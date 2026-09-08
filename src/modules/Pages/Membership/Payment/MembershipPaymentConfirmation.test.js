import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { mui1theme } from 'config';

import locale from '../membership.locale';
import MembershipPaymentConfirmation, { buildPaymentRecord } from './MembershipPaymentConfirmation';

const { paymentConfirmation } = locale;

// What the gateway sends back on its return leg.
const GATEWAY_RETURN =
    '?UQ_LIB_ID=abc-123&ReceiptNo=R123456&MembershipCode=COM&Success=Y&AmountPaid=25.00&TranType=W01LIB05';

const setup = (props = {}, search = GATEWAY_RETURN) => {
    const actions = {
        saveMembershipPayment: jest.fn().mockResolvedValue({ id: 'abc-123' }),
        ...props.actions,
    };

    const utils = render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={mui1theme}>
                <MemoryRouter initialEntries={[`/membership/paymentconfirmation${search}`]}>
                    <MembershipPaymentConfirmation {...{ ...props, actions }} />
                </MemoryRouter>
            </ThemeProvider>
        </StyledEngineProvider>,
    );

    return { ...utils, actions };
};

describe('MembershipPaymentConfirmation', () => {
    describe('buildPaymentRecord', () => {
        const params = new URLSearchParams(GATEWAY_RETURN);

        it("maps the gateway's parameters onto the fields the API stores", () => {
            expect(buildPaymentRecord(params)).toEqual(
                expect.objectContaining({
                    id: 'abc-123',
                    payment_receipt: 'R123456',
                    payment_code: 'COM',
                    payment_response: 'Y',
                    payment_amount: '25.00',
                }),
            );
        });

        // The gateway has changed what it sends before, and staff have had to go back to the raw response.
        it('keeps the whole response, including what it does not have a field for', () => {
            const everything = JSON.parse(buildPaymentRecord(params).everything);

            expect(everything.TranType).toBe('W01LIB05');
            expect(everything.UQ_LIB_ID).toBe('abc-123');
        });

        it('does not invent values the gateway did not send', () => {
            const record = buildPaymentRecord(new URLSearchParams('?UQ_LIB_ID=abc-123'));

            expect(record.id).toBe('abc-123');
            expect(record.payment_receipt).toBeUndefined();
            expect(record.everything).toBe('{"UQ_LIB_ID":"abc-123"}');
        });
    });

    describe('recording the payment', () => {
        it('records what the gateway reported', async () => {
            const { actions } = setup();

            await waitFor(() => expect(actions.saveMembershipPayment).toHaveBeenCalledTimes(1));
            expect(actions.saveMembershipPayment).toHaveBeenCalledWith(
                expect.objectContaining({ id: 'abc-123', payment_receipt: 'R123456' }),
            );
        });

        it('says it is working while it does', () => {
            setup({ actions: { saveMembershipPayment: jest.fn(() => new Promise(() => {})) } });

            expect(screen.getByRole('progressbar')).toBeInTheDocument();
            expect(screen.queryByTestId('membership-payment-thankyou')).not.toBeInTheDocument();
        });

        it('thanks the applicant once it is recorded', async () => {
            setup();

            await waitFor(() =>
                expect(screen.getByTestId('membership-payment-thankyou')).toHaveTextContent(
                    paymentConfirmation.thankYou,
                ),
            );
        });

        // Recording the same payment twice would be worse than not recording it. The container rebuilds its
        // actions object on every render, so the effect's dependencies change even when nothing else has.
        it('records it once, however many times it renders', async () => {
            const saveMembershipPayment = jest.fn().mockResolvedValue({ id: 'abc-123' });
            const { rerender } = setup({ actions: { saveMembershipPayment } });

            await waitFor(() => expect(saveMembershipPayment).toHaveBeenCalledTimes(1));

            [1, 2].forEach(() =>
                rerender(
                    <StyledEngineProvider injectFirst>
                        <ThemeProvider theme={mui1theme}>
                            <MemoryRouter initialEntries={[`/membership/paymentconfirmation${GATEWAY_RETURN}`]}>
                                {/* a fresh actions object each time, as bindActionCreators gives */}
                                <MembershipPaymentConfirmation actions={{ saveMembershipPayment }} />
                            </MemoryRouter>
                        </ThemeProvider>
                    </StyledEngineProvider>,
                ),
            );

            expect(saveMembershipPayment).toHaveBeenCalledTimes(1);
        });
    });

    describe('when the payment cannot be recorded', () => {
        // A payment the Library never recorded must not look exactly like one it did, or the applicant walks
        // away believing they are done when staff have no record to process.
        it('tells the applicant the Library needs to hear from them', async () => {
            setup({ actions: { saveMembershipPayment: jest.fn().mockRejectedValue({ message: 'Network error' }) } });

            await waitFor(() =>
                expect(screen.getByTestId('membership-payment-record-failed')).toHaveTextContent(
                    paymentConfirmation.recordFailed,
                ),
            );
            expect(screen.queryByTestId('membership-payment-thankyou')).not.toBeInTheDocument();
        });

        // Their money is already gone; the receipt is what lets staff find it.
        it('gives them the receipt number to quote', async () => {
            setup({ actions: { saveMembershipPayment: jest.fn().mockRejectedValue({}) } });

            await waitFor(() =>
                expect(screen.getByTestId('membership-payment-record-failed')).toHaveTextContent(
                    'Your receipt number is R123456.',
                ),
            );
        });

        it('copes when the gateway sent no receipt number', async () => {
            setup(
                { actions: { saveMembershipPayment: jest.fn().mockRejectedValue({}) } },
                '?UQ_LIB_ID=abc-123&Success=N',
            );

            await waitFor(() =>
                expect(screen.getByTestId('membership-payment-record-failed')).toHaveTextContent(
                    paymentConfirmation.recordFailed,
                ),
            );
            expect(screen.getByTestId('membership-payment-record-failed')).not.toHaveTextContent('receipt number is');
        });

        it('still offers a way back to the Library', async () => {
            setup({ actions: { saveMembershipPayment: jest.fn().mockRejectedValue({}) } });

            await waitFor(() =>
                expect(screen.getByRole('link', { name: locale.received.backToHomePage.label })).toBeInTheDocument(),
            );
        });
    });

    it('tells the site header where it is, for the breadcrumb', () => {
        const setAttribute = jest.fn();
        const realQuerySelector = document.querySelector.bind(document);
        jest.spyOn(document, 'querySelector').mockImplementation(selector =>
            selector === 'uq-site-header' ? { setAttribute } : realQuerySelector(selector),
        );

        setup();

        expect(setAttribute).toHaveBeenCalledWith('secondleveltitle', 'Membership');
        document.querySelector.mockRestore();
    });
});
