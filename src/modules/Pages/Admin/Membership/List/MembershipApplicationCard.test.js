import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { mui1theme } from 'config';

import MembershipApplicationCard, {
    confirmButtonText,
    formatDate,
    formatDateTime,
    fullName,
    initialsOf,
    isConfirmationInProgress,
    isIssued,
    statusColour,
    statusText,
} from './MembershipApplicationCard';

const typeTitles = { community: 'Community', alumni: 'Alumni', hospital: 'Hospital' };

const setup = (membership, props = {}) =>
    render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={mui1theme}>
                <ul>
                    <MembershipApplicationCard
                        membership={membership}
                        typeTitles={typeTitles}
                        onConfirm={jest.fn()}
                        {...props}
                    />
                </ul>
            </ThemeProvider>
        </StyledEngineProvider>,
    );

describe('MembershipApplicationCard', () => {
    it('shows the name, the type title, contact and dates for a community applicant', () => {
        setup({
            id: '101',
            type: 'community',
            status: 'unconfirmed',
            title: 'Mr',
            first_name: 'Newly',
            sn: 'Applied',
            mail: 'newly.applied@example.org',
            date_of_birth: '04-05-1990',
            submitted_on: '01-07-2026 13:15:00',
        });

        expect(screen.getByRole('heading', { name: 'Mr Newly Applied' })).toBeInTheDocument();
        expect(screen.getByTestId('membership-type-101')).toHaveTextContent('Community');
        expect(screen.getByTestId('membership-status-101')).toHaveTextContent('Unconfirmed');
        expect(screen.getByRole('link', { name: /newly.applied@example.org/ })).toHaveAttribute(
            'href',
            expect.stringContaining('mailto:newly.applied@example.org'),
        );
        // 4 May, not 5 April — the day-first date is read with the API's own format.
        expect(screen.getByTestId('membership-meta-101')).toHaveTextContent('Born 4 May 1990');
        expect(screen.getByTestId('membership-meta-101')).toHaveTextContent('1 Jul 2026');
    });

    it('shows the hospital service and colours a confirmed status', () => {
        setup({
            id: '104',
            type: 'hospital',
            status: 'confirmed',
            first_name: 'Halfway',
            sn: 'Through',
            hospital_service: 'Royal Brisbane',
            submitted_on: '10-07-2026 15:00:00',
        });

        expect(screen.getByTestId('membership-meta-104')).toHaveTextContent('Royal Brisbane');
        expect(screen.getByTestId('membership-status-104')).toHaveTextContent('Confirmed');
    });

    it('shows the alumni number and hides the date of birth for a fryer applicant', () => {
        const { rerender } = setup({
            id: '102',
            type: 'alumni',
            status: 'renewing',
            first_name: 'Already',
            sn: 'Confirmed',
            alumni_num: 's1234567',
        });
        expect(screen.getByTestId('membership-meta-102')).toHaveTextContent('s1234567');
        expect(screen.getByTestId('membership-status-102')).toHaveTextContent('Renewing');

        // A fryer applicant keeps their date of birth off the card even when the record carries one.
        rerender(
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={mui1theme}>
                    <ul>
                        <MembershipApplicationCard
                            membership={{
                                id: '107',
                                type: 'fryer',
                                status: 'unconfirmed',
                                first_name: 'Fryer',
                                sn: 'Visitor',
                                date_of_birth: '04-05-1990',
                            }}
                            typeTitles={typeTitles}
                            onConfirm={jest.fn()}
                        />
                    </ul>
                </ThemeProvider>
            </StyledEngineProvider>,
        );
        expect(screen.getByTestId('membership-meta-107')).not.toHaveTextContent('Born');
        // A type with no title in the map falls back to its own value.
        expect(screen.getByTestId('membership-type-107')).toHaveTextContent('fryer');
    });

    it('renders a spare record with no optional facts', () => {
        setup({ id: '108', type: 'community', status: 'unconfirmed', first_name: 'Just', sn: 'Aname' });

        expect(screen.getByRole('heading', { name: 'Just Aname' })).toBeInTheDocument();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
        expect(screen.getByTestId('membership-meta-108')).not.toHaveTextContent('Submitted');
    });

    describe('confirm controls', () => {
        const unconfirmed = { id: '101', type: 'community', status: 'unconfirmed', first_name: 'Newly', sn: 'Applied' };

        it('offers Confirm on an application waiting on a decision, and reports it when pressed', async () => {
            const onConfirm = jest.fn();
            setup(unconfirmed, { onConfirm });

            const button = screen.getByTestId('membership-confirm-101');
            expect(button).toHaveTextContent('Confirm');
            expect(button).toHaveAccessibleName('Confirm the application for Newly Applied');

            await userEvent.click(button);
            expect(onConfirm).toHaveBeenCalledWith(unconfirmed);
        });

        it('offers Re-confirm on a renewing application that has been confirmed before', () => {
            setup({
                id: '103',
                type: 'community',
                status: 'renewing',
                first_name: 'Renewing',
                sn: 'Member',
                confirmed_on: '21-05-2025',
            });

            expect(screen.getByTestId('membership-confirm-103')).toHaveTextContent('Re-confirm');
        });

        it('offers no confirm on an application that is already a confirmed account', () => {
            setup({ id: '102', type: 'alumni', status: 'confirmed', first_name: 'Already', sn: 'Confirmed' });

            expect(screen.queryByTestId('membership-confirm-102')).not.toBeInTheDocument();
        });

        it('guards a confirmation in progress: an in-progress chip in place of the confirm button', () => {
            setup({ ...unconfirmed, id: '104', confirm_step: 1 });

            expect(screen.getByTestId('membership-inprogress-104')).toHaveTextContent('In progress');
            expect(screen.queryByTestId('membership-confirm-104')).not.toBeInTheDocument();
        });

        it('shows the confirming state and disables the button while a confirm is in flight', () => {
            setup(unconfirmed, { busy: 'confirming' });

            const button = screen.getByTestId('membership-confirm-101');
            expect(button).toHaveTextContent('Confirming');
            expect(button).toBeDisabled();
        });
    });

    describe('helpers', () => {
        it('isIssued is true only for a confirmed or renewing account', () => {
            expect(isIssued({ status: 'confirmed' })).toBe(true);
            expect(isIssued({ status: 'renewing' })).toBe(true);
            expect(isIssued({ status: 'unconfirmed' })).toBe(false);
            expect(isIssued(undefined)).toBe(false);
        });

        it('isConfirmationInProgress reads the step the backend reports, as a number or a string', () => {
            expect(isConfirmationInProgress({ confirm_step: 1 })).toBe(true);
            expect(isConfirmationInProgress({ confirm_step: '2' })).toBe(true);
            expect(isConfirmationInProgress({ confirm_step: 0 })).toBe(false);
            expect(isConfirmationInProgress({})).toBe(false);
        });

        it('confirmButtonText reads Re-confirm once an applicant has been confirmed before', () => {
            expect(confirmButtonText({ confirmed_on: '21-05-2025' })).toBe('Re-confirm');
            expect(confirmButtonText({})).toBe('Confirm');
        });

        it('fullName joins the parts that are present', () => {
            expect(fullName({ title: 'Mr', first_name: 'A', sn: 'B' })).toBe('Mr A B');
            expect(fullName({ first_name: 'A', sn: 'B' })).toBe('A B');
            expect(fullName(undefined)).toBe('');
        });

        it('statusText capitalises a status and tolerates a blank one', () => {
            expect(statusText('confirmed')).toBe('Confirmed');
            expect(statusText('')).toBe('');
            expect(statusText(undefined)).toBe('');
        });

        it('statusColour maps the issued statuses and falls back for the rest', () => {
            expect(statusColour('confirmed')).toBe('success');
            expect(statusColour('renewing')).toBe('warning');
            expect(statusColour('unconfirmed')).toBe('default');
        });

        it('initialsOf takes the first letter of each name that is present', () => {
            expect(initialsOf({ first_name: 'Newly', sn: 'Applied' })).toBe('NA');
            expect(initialsOf({ first_name: 'Solo' })).toBe('S');
            expect(initialsOf({})).toBe('');
        });

        it('formats a valid date, and shows a bad one as it arrived', () => {
            expect(formatDate('04-05-1990')).toBe('4 May 1990');
            expect(formatDate('not-a-date')).toBe('not-a-date');
            expect(formatDateTime('01-07-2026 13:15:00')).toBe('1 Jul 2026, 1:15pm');
            expect(formatDateTime('rubbish')).toBe('rubbish');
        });
    });
});
