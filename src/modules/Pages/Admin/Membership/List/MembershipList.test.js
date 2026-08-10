import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { mui1theme } from 'config';

import MembershipList, { messageOf, typeTitlesFrom } from './MembershipList';

jest.mock('modules/Pages/Membership/membershipOutage', () => ({ isFrozen: jest.fn(() => false) }));
const { isFrozen } = require('modules/Pages/Membership/membershipOutage');

// The export's file-building and download are tested in membershipCsv; here we only check the list wires the
// gathered set into them, so they are stubbed to observe the call without touching jsdom's absent Blob URL API.
jest.mock('../membershipCsv', () => ({
    buildCsv: jest.fn(() => 'CSV-BODY'),
    downloadCsv: jest.fn(),
}));
const { buildCsv, downloadCsv } = require('../membershipCsv');

const membershipFormData = {
    account_types: [
        { value: 'community', title: 'Community' },
        { value: 'hospital', title: 'Hospital' },
    ],
};

const page = [
    { id: '101', type: 'community', status: 'unconfirmed', first_name: 'Newly', sn: 'Applied' },
    {
        id: '102',
        type: 'hospital',
        status: 'confirmed',
        first_name: 'Already',
        sn: 'Confirmed',
        expires_on: '31-12-2026',
        barcode: '2406700012345',
    },
];

const pagination = { total: 42, page: 1, per_page: 20, pages: 3 };
const counts = { all: 42, unconfirmed: 10, renewing: 12, confirmed: 20 };

const INITIAL_QUERY = { name: '', type: '', status: 'all', sort: 'newest', page: 1, perPage: 20 };

const setup = (props = {}) => {
    const actions = { loadMembershipFormData: jest.fn(), loadMemberships: jest.fn(), ...props.actions };
    render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={mui1theme}>
                <MemoryRouter>
                    <MembershipList
                        membershipFormData={membershipFormData}
                        memberships={page}
                        pagination={pagination}
                        counts={counts}
                        {...props}
                        actions={actions}
                    />
                </MemoryRouter>
            </ThemeProvider>
        </StyledEngineProvider>,
    );
    return actions;
};

beforeEach(() => {
    isFrozen.mockReturnValue(false);
    buildCsv.mockClear();
    downloadCsv.mockClear();
});

afterEach(() => {
    document.querySelectorAll('uq-site-header').forEach(node => node.remove());
});

describe('MembershipList', () => {
    it('loads the first page and the form data on mount', () => {
        const actions = setup({ memberships: null, membershipFormData: null });

        expect(actions.loadMembershipFormData).toHaveBeenCalled();
        expect(actions.loadMemberships).toHaveBeenCalledWith(INITIAL_QUERY);
    });

    it('does not refetch the form data when the store already holds it', () => {
        const actions = setup();

        expect(actions.loadMembershipFormData).not.toHaveBeenCalled();
    });

    it('sets the second-level breadcrumb on the site header when one is present', () => {
        const siteHeader = document.createElement('uq-site-header');
        document.body.appendChild(siteHeader);

        setup();

        expect(siteHeader.getAttribute('secondleveltitle')).toBe('Membership admin');
        expect(siteHeader.getAttribute('secondLevelUrl')).toBe('/admin/membership');
    });

    it('shows the triage tiles with server counts, the toolbar span and a card per application', () => {
        setup();

        expect(screen.getByTestId('membership-status-tile-all')).toHaveTextContent('42');
        expect(screen.getByTestId('membership-list-status')).toHaveTextContent('Showing 1–20 of 42 applications');
        expect(screen.getByTestId('membership-row-101')).toBeInTheDocument();
        expect(screen.getByTestId('membership-row-102')).toBeInTheDocument();
    });

    it('re-queries the server when a triage tile is chosen, from page one', async () => {
        const actions = setup();

        await userEvent.click(screen.getByTestId('membership-status-tile-unconfirmed'));

        await waitFor(() =>
            expect(actions.loadMemberships).toHaveBeenCalledWith({ ...INITIAL_QUERY, status: 'unconfirmed' }),
        );
    });

    it('re-queries the server on a type filter and a sort change', async () => {
        const actions = setup();

        await userEvent.selectOptions(screen.getByTestId('membership-filter-type'), 'hospital');
        await waitFor(() =>
            expect(actions.loadMemberships).toHaveBeenCalledWith({ ...INITIAL_QUERY, type: 'hospital' }),
        );

        await userEvent.selectOptions(screen.getByTestId('membership-sort'), 'oldest');
        await waitFor(() =>
            expect(actions.loadMemberships).toHaveBeenCalledWith(expect.objectContaining({ sort: 'oldest', page: 1 })),
        );
    });

    it('debounces the search into a server query that starts at page one', async () => {
        const actions = setup();

        await userEvent.type(screen.getByTestId('membership-search-name'), 'renew');

        await waitFor(() => expect(actions.loadMemberships).toHaveBeenCalledWith({ ...INITIAL_QUERY, name: 'renew' }));
    });

    it('fetches the next page from the pager', async () => {
        const actions = setup();

        await userEvent.click(screen.getByRole('button', { name: 'Go to page 2' }));

        await waitFor(() => expect(actions.loadMemberships).toHaveBeenCalledWith({ ...INITIAL_QUERY, page: 2 }));
    });

    it('does not show a pager when there is only one page', () => {
        setup({ pagination: { total: 5, page: 1, per_page: 20, pages: 1 } });

        expect(screen.queryByTestId('membership-pager')).not.toBeInTheDocument();
    });

    it('re-runs the current query on reload', async () => {
        const actions = setup();

        await userEvent.click(screen.getByTestId('membership-reload'));

        await waitFor(() => expect(actions.loadMemberships).toHaveBeenCalledWith(INITIAL_QUERY));
    });

    it('shows the queue-empty state when nothing is loaded and no filter is set', () => {
        setup({ memberships: [], pagination: { total: 0, page: 1, per_page: 20, pages: 0 } });

        expect(screen.getByTestId('membership-list-empty')).toHaveTextContent('No membership applications found');
        expect(screen.queryByTestId('membership-clear-filters')).not.toBeInTheDocument();
    });

    it('offers a way back when a filter matches nothing', async () => {
        const actions = setup({ memberships: [], pagination: { total: 0, page: 1, per_page: 20, pages: 0 } });

        await userEvent.click(screen.getByTestId('membership-status-tile-renewing'));
        expect(screen.getByTestId('membership-list-empty')).toHaveTextContent('No applications match your filters');

        await userEvent.click(screen.getByTestId('membership-clear-filters'));
        await waitFor(() => expect(actions.loadMemberships).toHaveBeenCalledWith(INITIAL_QUERY));
    });

    it('shows a skeleton and keeps the workspace while a page is loading', () => {
        setup({ membershipsLoading: true });

        expect(screen.getByTestId('membership-list-skeleton')).toBeInTheDocument();
        expect(screen.getByTestId('membership-status-tiles')).toBeInTheDocument();
    });

    it('shows only a skeleton on the very first load, before any page arrives', () => {
        setup({ memberships: null, pagination: null, counts: null, membershipsLoading: true });

        expect(screen.getByTestId('membership-list-skeleton')).toBeInTheDocument();
        expect(screen.queryByTestId('membership-status-tiles')).not.toBeInTheDocument();
    });

    it('reports a load failure and can try again', async () => {
        const actions = setup({ membershipsError: 'It broke' });

        expect(screen.getByTestId('membership-list-error')).toBeInTheDocument();
        expect(screen.queryByTestId('membership-status-tiles')).not.toBeInTheDocument();

        await userEvent.click(screen.getByTestId('membership-retry'));
        await waitFor(() => expect(actions.loadMemberships).toHaveBeenCalledWith(INITIAL_QUERY));
    });

    it('replaces the page with a maintenance message during the outage window', () => {
        isFrozen.mockReturnValue(true);
        setup();

        expect(screen.getByTestId('membership-admin-frozen')).toBeInTheDocument();
        expect(screen.queryByTestId('membership-toolbar')).not.toBeInTheDocument();
    });

    it('confirms an application and reflects the issued account on its card', async () => {
        const confirmMembership = jest.fn().mockResolvedValue({ ...page[0], status: 'confirmed' });
        const actions = setup({ actions: { confirmMembership } });

        await userEvent.click(screen.getByTestId('membership-confirm-101'));

        expect(confirmMembership).toHaveBeenCalledWith(page[0]);
        // The card takes on the confirmed record: its status reads Confirmed and the confirm button is gone.
        await waitFor(() => expect(screen.getByTestId('membership-status-101')).toHaveTextContent('Confirmed'));
        expect(screen.queryByTestId('membership-confirm-101')).not.toBeInTheDocument();
    });

    it('surfaces the reason in a dialog when a confirmation is refused, and dismisses it', async () => {
        const confirmMembership = jest.fn().mockRejectedValue({ message: 'This applicant is already a member.' });
        setup({ actions: { confirmMembership } });

        await userEvent.click(screen.getByTestId('membership-confirm-101'));

        await waitFor(() =>
            expect(screen.getByTestId('message-content')).toHaveTextContent('This applicant is already a member.'),
        );
        // The card is left as it was - still unconfirmed, still offering Confirm.
        expect(screen.getByTestId('membership-confirm-101')).toBeInTheDocument();

        await userEvent.click(screen.getByTestId('confirm-membership-error'));
        await waitFor(() => expect(screen.queryByTestId('dialogbox-membership-error')).not.toBeInTheDocument());
    });

    it('deletes an application once the prompt is confirmed, and marks its card', async () => {
        const deleteMembership = jest.fn().mockResolvedValue({ status: 'ok' });
        setup({ actions: { deleteMembership } });

        await userEvent.click(screen.getByTestId('membership-delete-101'));
        // The prompt names the applicant and warns the delete is final.
        expect(screen.getByTestId('message-content')).toHaveTextContent(
            'You are about to delete the membership application for Newly Applied',
        );

        await userEvent.click(screen.getByTestId('confirm-membership-delete'));

        expect(deleteMembership).toHaveBeenCalledWith('101');
        await waitFor(() => expect(screen.getByTestId('membership-deleted-101')).toBeInTheDocument());
        expect(screen.queryByTestId('membership-delete-101')).not.toBeInTheDocument();
    });

    it('does not delete when the prompt is dismissed', async () => {
        const deleteMembership = jest.fn();
        setup({ actions: { deleteMembership } });

        await userEvent.click(screen.getByTestId('membership-delete-101'));
        await userEvent.click(screen.getByTestId('cancel-membership-delete'));

        expect(deleteMembership).not.toHaveBeenCalled();
        await waitFor(() => expect(screen.queryByTestId('dialogbox-membership-delete')).not.toBeInTheDocument());
    });

    it('surfaces the reason in a dialog when a delete fails', async () => {
        const deleteMembership = jest.fn().mockRejectedValue(new Error('nope'));
        setup({ actions: { deleteMembership } });

        await userEvent.click(screen.getByTestId('membership-delete-101'));
        await userEvent.click(screen.getByTestId('confirm-membership-delete'));

        await waitFor(() =>
            expect(screen.getByTestId('message-content')).toHaveTextContent(
                'Please try again, or contact support if the problem continues.',
            ),
        );
        // The card is left as it was - still there, still offering Delete.
        expect(screen.getByTestId('membership-delete-101')).toBeInTheDocument();
    });

    it('saves an inline-edited barcode and shows the stored value on its card', async () => {
        const updateMembership = jest.fn().mockResolvedValue({ ...page[1], barcode: '2406700054321' });
        const actions = setup({ actions: { updateMembership } });

        await userEvent.click(screen.getByTestId('barcode-102-edit-button'));
        const input = screen.getByTestId('barcode-102-input');
        await userEvent.clear(input);
        await userEvent.type(input, '2406700054321');
        await userEvent.click(screen.getByTestId('barcode-102-save-button'));

        expect(updateMembership).toHaveBeenCalledWith({ ...page[1], barcode: '2406700054321' });
        await waitFor(() => expect(screen.getByTestId('barcode-102-value')).toHaveTextContent('2406700054321'));
        // The listing itself is not the card's to rewrite - server truth returns on the next query.
        expect(actions.loadMemberships).toHaveBeenCalled();
    });

    it('explains a refused barcode and leaves the stored value on the card', async () => {
        const updateMembership = jest.fn().mockRejectedValue(new Error('Request failed with status code 400'));
        setup({ actions: { updateMembership } });

        await userEvent.click(screen.getByTestId('barcode-102-edit-button'));
        const input = screen.getByTestId('barcode-102-input');
        await userEvent.clear(input);
        await userEvent.type(input, '2406700010000');
        await userEvent.click(screen.getByTestId('barcode-102-save-button'));

        await waitFor(() =>
            expect(screen.getByTestId('message-content')).toHaveTextContent(
                'That barcode could not be saved. It may already be in use by another member.',
            ),
        );
        // The save did not take, so the card keeps the barcode the server still holds rather than the edit.
        expect(screen.getByTestId('barcode-102-value')).toHaveTextContent('2406700012345');
    });

    it('surfaces the backend reason when an edited expiry is refused', async () => {
        const updateMembership = jest.fn().mockRejectedValue({ message: 'The expiry date was invalid.' });
        setup({ actions: { updateMembership } });

        await userEvent.click(screen.getByTestId('expiry-102-edit-button'));
        const input = screen.getByTestId('expiry-102-input');
        await userEvent.clear(input);
        await userEvent.type(input, '31-13-2026');
        await userEvent.click(screen.getByTestId('expiry-102-save-button'));

        await waitFor(() =>
            expect(screen.getByTestId('message-content')).toHaveTextContent('The expiry date was invalid.'),
        );
    });

    const renewingPage = [{ id: '103', type: 'community', status: 'renewing', first_name: 'Renewing', sn: 'Member' }];

    it('reports a sent renewal email in a dialog naming the applicant', async () => {
        const resendRenewalEmail = jest.fn().mockResolvedValue(true);
        setup({ memberships: renewingPage, actions: { resendRenewalEmail } });

        await userEvent.click(screen.getByTestId('membership-resend-103'));

        expect(resendRenewalEmail).toHaveBeenCalledWith('103');
        await waitFor(() =>
            expect(screen.getByTestId('message-content')).toHaveTextContent(
                'Renewing Member: Renewal email sent successfully.',
            ),
        );

        await userEvent.click(screen.getByTestId('confirm-membership-resend'));
        await waitFor(() => expect(screen.queryByTestId('dialogbox-membership-resend')).not.toBeInTheDocument());
    });

    it('reports a renewal email the endpoint declined to send', async () => {
        const resendRenewalEmail = jest.fn().mockResolvedValue(false);
        setup({ memberships: renewingPage, actions: { resendRenewalEmail } });

        await userEvent.click(screen.getByTestId('membership-resend-103'));

        await waitFor(() =>
            expect(screen.getByTestId('message-content')).toHaveTextContent(
                'Renewing Member: Unfortunately, the renewal email could not be sent. Please try again later.',
            ),
        );
    });

    it('reports a resend that could not be reached as not sent', async () => {
        const resendRenewalEmail = jest.fn().mockRejectedValue(new Error('nope'));
        setup({ memberships: renewingPage, actions: { resendRenewalEmail } });

        await userEvent.click(screen.getByTestId('membership-resend-103'));

        await waitFor(() => expect(screen.getByTestId('message-content')).toHaveTextContent('could not be sent'));
    });

    it('exports the whole matching set to a named CSV file', async () => {
        const gathered = [page[0], page[1]];
        const fetchAllMemberships = jest.fn().mockResolvedValue(gathered);
        const actions = setup({ actions: { fetchAllMemberships } });

        await userEvent.click(screen.getByTestId('membership-export'));

        // The export asks for the matching set under the current query, not just the page on screen.
        expect(fetchAllMemberships).toHaveBeenCalledWith(INITIAL_QUERY);
        await waitFor(() => expect(downloadCsv).toHaveBeenCalledWith('memberships.csv', 'CSV-BODY'));
        // The rows are turned into the file with the type titles, so the CSV names a type rather than its code.
        expect(buildCsv).toHaveBeenCalledWith(gathered, { community: 'Community', hospital: 'Hospital' });
    });

    it('surfaces the reason in a dialog when an export cannot be gathered, and downloads nothing', async () => {
        const fetchAllMemberships = jest.fn().mockRejectedValue(new Error('nope'));
        setup({ actions: { fetchAllMemberships } });

        await userEvent.click(screen.getByTestId('membership-export'));

        await waitFor(() =>
            expect(screen.getByTestId('message-content')).toHaveTextContent(
                'Please try again, or contact support if the problem continues.',
            ),
        );
        expect(downloadCsv).not.toHaveBeenCalled();
    });

    it('messageOf reads the API message from a plain rejection and falls back otherwise', () => {
        expect(messageOf({ message: 'Already a member.' })).toBe('Already a member.');
        // A raw axios Error carries nothing an admin can act on, so the fallback stands in.
        expect(messageOf(new Error('Request failed with status code 500'))).toBe(
            'Please try again, or contact support if the problem continues.',
        );
        expect(messageOf(null)).toBe('Please try again, or contact support if the problem continues.');
        expect(messageOf({}, 'custom fallback')).toBe('custom fallback');
    });

    it('typeTitlesFrom maps types to titles and defaults to an empty map', () => {
        expect(typeTitlesFrom(membershipFormData.account_types)).toEqual({
            community: 'Community',
            hospital: 'Hospital',
        });
        expect(typeTitlesFrom()).toEqual({});
    });
});
