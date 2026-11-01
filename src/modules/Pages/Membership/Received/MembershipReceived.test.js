import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { mui1theme } from 'config';

import { MEMBERSHIP_TYPES } from '../membershipFieldRules';
import locale from '../membership.locale';
import MembershipReceived, { canPay, mustAcknowledge } from './MembershipReceived';

const { received } = locale;

jest.mock('helpers/redirect', () => ({ redirectTo: jest.fn() }));

const { redirectTo } = require('helpers/redirect');

beforeEach(() => redirectTo.mockClear());

const setup = (props = {}, route = '/membership/received/abc-123') => {
    const actions = { loadMembership: jest.fn(), ...props.actions };

    const utils = render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={mui1theme}>
                <MemoryRouter initialEntries={[route]}>
                    <Routes>
                        <Route
                            path="/membership/received/:id"
                            element={<MembershipReceived {...{ ...props, actions }} />}
                        />
                        <Route
                            path="/membership/received"
                            element={<MembershipReceived {...{ ...props, actions }} />}
                        />
                    </Routes>
                </MemoryRouter>
            </ThemeProvider>
        </StyledEngineProvider>,
    );

    return { ...utils, actions };
};

describe('MembershipReceived', () => {
    describe('getting the application back', () => {
        // The record is not kept across a reload or a bookmarked link, so it has to be fetched.
        it('fetches the application when the store does not have it', () => {
            const { actions } = setup({ membership: null });

            expect(actions.loadMembership).toHaveBeenCalledWith('abc-123');
        });

        it('does not fetch what it already has', () => {
            const { actions } = setup({ membership: { id: 'abc-123', type: 'fryer' } });

            expect(actions.loadMembership).not.toHaveBeenCalled();
        });

        it('does not fetch again while a request is in flight, or after one failed', () => {
            const inFlight = setup({ membership: null, membershipLoading: true });
            expect(inFlight.actions.loadMembership).not.toHaveBeenCalled();
            inFlight.unmount();

            const failed = setup({ membership: null, membershipError: 'Forbidden' });
            expect(failed.actions.loadMembership).not.toHaveBeenCalled();
        });

        it('has nothing to fetch when there is no id in the link', () => {
            const { actions } = setup({ membership: null }, '/membership/received');

            expect(actions.loadMembership).not.toHaveBeenCalled();
        });

        it('waits while it fetches', () => {
            setup({ membership: null, membershipLoading: true });

            expect(screen.getByRole('progressbar')).toBeInTheDocument();
        });

        // The application went through - only reading it back did not - so it is not reported as a failure.
        // This is not an edge case for an applicant: the API serves a membership record to Library staff
        // alone, so every reload of this page lands here. Their application is fine and nothing they can do
        // will re-read it, so the page says so and hands them what AskUs will ask for.
        describe('when the record cannot be read back', () => {
            const forbidden = { membership: null, membershipError: 'Forbidden' };

            it('still thanks the applicant, and says the application is safe', () => {
                setup(forbidden);

                expect(screen.getByTestId('membership-received')).toHaveTextContent(received.thankYou);
                expect(screen.getByTestId('membership-received-load-error')).toHaveTextContent(
                    received.loadFailed.reassure,
                );
            });

            it('says why the details are not shown, rather than looking broken', () => {
                setup(forbidden);

                expect(screen.getByTestId('membership-received-load-error')).toHaveTextContent(
                    received.loadFailed.explain,
                );
            });

            // Never "your application failed" and never "payment failed" - neither is true, and an applicant
            // who believes either will apply or pay a second time.
            it('does not tell them anything failed', () => {
                setup(forbidden);

                const alert = screen.getByTestId('membership-received-load-error');
                expect(alert.textContent).not.toMatch(/fail|error|unsuccessful|could not be/i);
            });

            it('gives them the reference AskUs will ask for', () => {
                setup(forbidden);

                expect(screen.getByTestId('membership-received-reference')).toHaveTextContent('abc-123');
            });

            it('offers a way to reach AskUs that carries the reference with it', () => {
                setup(forbidden);

                const link = screen.getByTestId('membership-received-askus');
                expect(link).toHaveAttribute('href', expect.stringContaining('mailto:askus@library.uq.edu.au'));
                expect(link).toHaveAttribute('href', expect.stringContaining('abc-123'));
            });

            // Reached via /membership/received with no id at all, so there is no reference to quote.
            it('leaves out the reference when there is no id to quote', () => {
                setup(forbidden, '/membership/received');

                expect(screen.queryByTestId('membership-received-reference')).not.toBeInTheDocument();
                expect(screen.getByTestId('membership-received-askus')).toBeInTheDocument();
            });
        });
    });

    describe('a type that does not pay', () => {
        it('thanks them and tells them what happens next', () => {
            setup({ membership: { id: 'abc-123', type: MEMBERSHIP_TYPES.FRYER } });

            expect(screen.getByTestId('membership-received')).toHaveTextContent(received.thankYou);
            expect(screen.getByTestId('membership-received-notified')).toHaveTextContent(received.notifiedByEmail);
            expect(screen.queryByTestId('membership-received-payment')).not.toBeInTheDocument();
        });

        it('does not send them anywhere', () => {
            setup({ membership: { id: 'abc-123', type: MEMBERSHIP_TYPES.FRYER, uq_payments_url: 'https://pay.uq' } });

            expect(redirectTo).not.toHaveBeenCalled();
        });

        it('offers a way back to the Library', () => {
            setup({ membership: { id: 'abc-123', type: MEMBERSHIP_TYPES.FRYER } });

            expect(screen.getByRole('link', { name: received.backToHomePage.label })).toHaveAttribute(
                'href',
                received.backToHomePage.url,
            );
        });
    });

    describe('a type that pays', () => {
        const community = {
            id: 'abc-123',
            type: MEMBERSHIP_TYPES.COMMUNITY,
            uq_payments_url: 'https://payments.uq.edu.au/pay?x=1',
        };

        it('takes a community applicant to the payment gateway', async () => {
            setup({ membership: community });

            await waitFor(() => expect(redirectTo).toHaveBeenCalledWith('https://payments.uq.edu.au/pay?x=1'));
            expect(screen.getByTestId('membership-redirecting')).toHaveTextContent(received.redirecting);
        });

        it('takes an alumni friend to the payment gateway too', async () => {
            setup({ membership: { ...community, type: MEMBERSHIP_TYPES.ALUMNI_FRIENDS } });

            await waitFor(() => expect(redirectTo).toHaveBeenCalled());
        });

        it('does not tell them to wait for an email, because they are not done yet', () => {
            setup({ membership: community });

            expect(screen.queryByTestId('membership-received-notified')).not.toBeInTheDocument();
        });

        it('leaves a button to press if the redirect does not happen', async () => {
            setup({ membership: community });

            const payNow = screen.getByTestId('membership-received-pay');
            expect(payNow).toHaveTextContent(received.payNow);
            // it is already on its way, so pressing again would only send them twice
            await waitFor(() => expect(payNow).toBeDisabled());
        });

        // With no payment url there is nowhere to send them, so it says so rather than navigating nowhere.
        it('says so rather than navigating nowhere when there is no payment url', () => {
            setup({ membership: { id: 'abc-123', type: MEMBERSHIP_TYPES.COMMUNITY } });

            expect(screen.getByTestId('membership-received-no-payment-url')).toHaveTextContent(
                received.paymentUnavailable,
            );
            expect(screen.queryByTestId('membership-received-pay')).not.toBeInTheDocument();
            expect(redirectTo).not.toHaveBeenCalled();
        });
    });

    describe('the alumni acknowledgement', () => {
        it('is shown to an alumni applicant', () => {
            setup({ membership: { id: 'abc-123', type: MEMBERSHIP_TYPES.ALUMNI } });

            expect(screen.getByTestId('membership-alumni-ack')).toBeInTheDocument();
            expect(screen.getByRole('link', { name: received.alumniAcknowledgement.servicesLabel })).toHaveAttribute(
                'href',
                received.alumniAcknowledgement.servicesUrl,
            );
        });

        it('is shown to a new alumni applicant', () => {
            setup({ membership: { id: 'abc-123', type: MEMBERSHIP_TYPES.ALUMNI_NEW } });

            expect(screen.getByTestId('membership-alumni-ack')).toBeInTheDocument();
        });

        it('can be ticked', async () => {
            setup({ membership: { id: 'abc-123', type: MEMBERSHIP_TYPES.ALUMNI } });

            const checkbox = screen.getByTestId('membership-alumni-ack');
            await userEvent.click(checkbox);

            expect(checkbox).toBeChecked();
        });

        it('is not shown to a type it does not apply to', () => {
            setup({ membership: { id: 'abc-123', type: MEMBERSHIP_TYPES.COMMUNITY } });

            expect(screen.queryByTestId('membership-alumni-ack')).not.toBeInTheDocument();
        });
    });

    describe('helpers', () => {
        it('knows which types pay', () => {
            expect(canPay({ type: MEMBERSHIP_TYPES.COMMUNITY })).toBe(true);
            expect(canPay({ type: MEMBERSHIP_TYPES.ALUMNI_FRIENDS })).toBe(true);
            expect(canPay({ type: MEMBERSHIP_TYPES.ALUMNI })).toBe(false);
            expect(canPay({ type: MEMBERSHIP_TYPES.FRYER })).toBe(false);
            expect(canPay(null)).toBe(false);
        });

        it('knows which types acknowledge their entitlements', () => {
            expect(mustAcknowledge({ type: MEMBERSHIP_TYPES.ALUMNI })).toBe(true);
            expect(mustAcknowledge({ type: MEMBERSHIP_TYPES.ALUMNI_NEW })).toBe(true);
            expect(mustAcknowledge({ type: MEMBERSHIP_TYPES.COMMUNITY })).toBe(false);
            expect(mustAcknowledge(null)).toBe(false);
        });
    });

    it('tells the site header where it is, for the breadcrumb', () => {
        const setAttribute = jest.fn();
        const realQuerySelector = document.querySelector.bind(document);
        jest.spyOn(document, 'querySelector').mockImplementation(selector =>
            selector === 'uq-site-header' ? { setAttribute } : realQuerySelector(selector),
        );

        setup({ membership: { id: 'abc-123', type: MEMBERSHIP_TYPES.FRYER } });

        expect(setAttribute).toHaveBeenCalledWith('secondleveltitle', 'Membership');
        document.querySelector.mockRestore();
    });
});
