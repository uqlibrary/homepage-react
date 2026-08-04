import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { mui1theme } from 'config';

import MembershipApplicationCard, {
    formatDate,
    formatDateTime,
    fullName,
    initialsOf,
    statusColour,
    statusText,
} from './MembershipApplicationCard';

const typeTitles = { community: 'Community', alumni: 'Alumni', hospital: 'Hospital' };

const setup = membership =>
    render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={mui1theme}>
                <ul>
                    <MembershipApplicationCard membership={membership} typeTitles={typeTitles} />
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

    describe('helpers', () => {
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
