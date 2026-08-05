import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { mui1theme } from 'config';

import MembershipList, { typeTitlesFrom } from './MembershipList';

jest.mock('modules/Pages/Membership/membershipOutage', () => ({ isFrozen: jest.fn(() => false) }));
const { isFrozen } = require('modules/Pages/Membership/membershipOutage');

const membershipFormData = {
    account_types: [
        { value: 'community', title: 'Community' },
        { value: 'hospital', title: 'Hospital' },
    ],
};

const page = [
    { id: '101', type: 'community', status: 'unconfirmed', first_name: 'Newly', sn: 'Applied' },
    { id: '102', type: 'hospital', status: 'confirmed', first_name: 'Already', sn: 'Confirmed' },
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

beforeEach(() => isFrozen.mockReturnValue(false));

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

    it('typeTitlesFrom maps types to titles and defaults to an empty map', () => {
        expect(typeTitlesFrom(membershipFormData.account_types)).toEqual({
            community: 'Community',
            hospital: 'Hospital',
        });
        expect(typeTitlesFrom()).toEqual({});
    });
});
