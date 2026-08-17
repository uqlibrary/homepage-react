import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { mui1theme } from 'config';

import MembershipApplicationDialog, { editableValues, paymentSummary } from './MembershipApplicationDialog';

const membershipFormData = { titles: ['Mr', 'Ms', 'Dr', 'Mx'] };
const typeTitles = { community: 'Community', alumni: 'Alumni' };

const record = {
    id: '102',
    type: 'alumni',
    status: 'confirmed',
    title: 'Dr',
    first_name: 'Already',
    sn: 'Confirmed',
    mail: 'already.confirmed@example.org',
    phone: '0733650002',
    home_address_0: '4 Cordelia Street',
    home_address_city: 'Brisbane',
    home_address_postcode: '4101',
    submitted_on: '14-07-2026 11:00:00',
    confirmed_on: '03-06-2026',
    date_of_birth: '02-12-1985',
    expires_on: '31-12-2026',
    barcode: '2406700012345',
};

const setup = (props = {}) => {
    const handlers = { onSave: jest.fn(), onClose: jest.fn() };
    render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={mui1theme}>
                <MembershipApplicationDialog
                    membership={record}
                    membershipFormData={membershipFormData}
                    typeTitles={typeTitles}
                    open
                    {...handlers}
                    {...props}
                />
            </ThemeProvider>
        </StyledEngineProvider>,
    );
    return handlers;
};

describe('MembershipApplicationDialog', () => {
    it('names the dialog for the applicant and shows the record read-only', () => {
        setup();

        expect(screen.getByTestId('dialogbox-membership-view')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Application — Dr Already Confirmed/ })).toBeInTheDocument();
        const details = screen.getByTestId('membership-view-details');
        expect(details).toHaveTextContent('Alumni');
        expect(details).toHaveTextContent('Confirmed');
        // Day-first dates are read with the API's own format.
        expect(details).toHaveTextContent('2 Dec 1985');
        expect(details).toHaveTextContent('31-12-2026');
        expect(details).toHaveTextContent('2406700012345');
    });

    it('prefills the editable fields from the record', async () => {
        setup();

        await waitFor(() => expect(screen.getByTestId('first_name-input')).toHaveValue('Already'));
        expect(screen.getByTestId('sn-input')).toHaveValue('Confirmed');
        expect(screen.getByTestId('mail-input')).toHaveValue('already.confirmed@example.org');
        expect(screen.getByTestId('phone-input')).toHaveValue('0733650002');
        expect(screen.getByTestId('title-input')).toHaveValue('Dr');
    });

    it('saves the whole record with the edited contact fields', async () => {
        const { onSave } = setup();

        const surname = await screen.findByTestId('sn-input');
        await userEvent.clear(surname);
        await userEvent.type(surname, 'Renamed');
        await userEvent.click(screen.getByTestId('save-membership-view'));

        await waitFor(() => expect(onSave).toHaveBeenCalled());
        // The whole record goes back, so the update carries fields the dialog never showed, with the one change.
        expect(onSave).toHaveBeenCalledWith(
            expect.objectContaining({ id: '102', barcode: '2406700012345', first_name: 'Already', sn: 'Renamed' }),
        );
    });

    it('flags an empty required field and holds the save out of reach until it is fixed', async () => {
        setup();

        const firstName = await screen.findByTestId('first_name-input');
        await userEvent.clear(firstName);

        await waitFor(() => expect(screen.getByTestId('save-membership-view')).toBeDisabled());
        expect(screen.getByTestId('first_name-helper-text')).toBeInTheDocument();

        await userEvent.type(firstName, 'Restored');
        await waitFor(() => expect(screen.getByTestId('save-membership-view')).toBeEnabled());
    });

    it('holds the save out of reach while the email is invalid', async () => {
        setup();

        const mail = await screen.findByTestId('mail-input');
        await userEvent.clear(mail);
        await userEvent.type(mail, 'not-an-email');

        await waitFor(() => expect(screen.getByTestId('save-membership-view')).toBeDisabled());
    });

    it('closes from Cancel and from the close icon without saving', async () => {
        const { onClose, onSave } = setup();

        await userEvent.click(screen.getByTestId('cancel-membership-view'));
        await userEvent.click(screen.getByTestId('close-membership-view'));

        expect(onClose).toHaveBeenCalledTimes(2);
        expect(onSave).not.toHaveBeenCalled();
    });

    it('reads as busy and blocks the save while one is in flight', () => {
        setup({ saving: true });

        const save = screen.getByTestId('save-membership-view');
        expect(save).toBeDisabled();
        expect(save).toHaveTextContent('Saving..');
    });

    describe('payment detail', () => {
        it('shows a paid application as paid, with its amount and receipt', () => {
            setup({
                membership: {
                    ...record,
                    payment_response: 'Success',
                    payment_amount: '25.00',
                    payment_receipt: 'R7654321',
                },
            });

            const details = screen.getByTestId('membership-view-details');
            expect(details).toHaveTextContent('Paid');
            expect(details).toHaveTextContent('25.00');
            expect(details).toHaveTextContent('R7654321');
        });

        it('shows a refused payment as failed, and no receipt for its "-" sentinel', () => {
            setup({
                membership: { ...record, payment_response: 'Failed', payment_receipt: '-' },
            });

            const details = screen.getByTestId('membership-view-details');
            expect(details).toHaveTextContent('Failed');
            // The "-" blank writes no receipt, so that row reads as not recorded.
            expect(details).toHaveTextContent('Not recorded');
        });

        it('shows no payment rows for an application that never had a payment', () => {
            setup({
                membership: { id: '105', type: 'hospital', status: 'unconfirmed', first_name: 'No', sn: 'Payment' },
            });

            const details = screen.getByTestId('membership-view-details');
            expect(details).not.toHaveTextContent('Paid');
            expect(details).not.toHaveTextContent('Receipt');
        });
    });

    describe('helpers', () => {
        it('editableValues picks only the editable fields, defaulting a missing one to empty', () => {
            const values = editableValues({ id: 'x', first_name: 'A', sn: 'B', status: 'confirmed' });

            expect(values.first_name).toBe('A');
            expect(values.phone).toBe('');
            expect(values).not.toHaveProperty('status');
        });

        it('paymentSummary reads a failure, a payment, and nothing', () => {
            expect(paymentSummary({ payment_response: 'Failed' })).toBe('Failed');
            expect(paymentSummary({ payment_receipt: 'R1' })).toBe('Paid');
            expect(paymentSummary({ payment_amount: '25.00' })).toBe('Paid');
            expect(paymentSummary({})).toBe('');
        });
    });
});
