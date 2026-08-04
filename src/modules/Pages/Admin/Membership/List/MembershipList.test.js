import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { mui1theme } from 'config';

import MembershipList, { SEARCH_LIMIT, typeTitlesFrom } from './MembershipList';

jest.mock('modules/Pages/Membership/membershipOutage', () => ({ isFrozen: jest.fn(() => false) }));
const { isFrozen } = require('modules/Pages/Membership/membershipOutage');

const membershipFormData = {
    account_types: [
        { value: 'community', title: 'Community' },
        { value: 'hospital', title: 'Hospital' },
    ],
};

const memberships = [
    { id: '101', type: 'community', status: 'unconfirmed', first_name: 'Newly', sn: 'Applied' },
    { id: '104', type: 'hospital', status: 'unconfirmed', first_name: 'Halfway', sn: 'Through' },
];

const setup = (props = {}) => {
    const actions = { loadMembershipFormData: jest.fn(), loadMemberships: jest.fn(), ...props.actions };
    return render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={mui1theme}>
                <MemoryRouter>
                    <MembershipList membershipFormData={membershipFormData} {...props} actions={actions} />
                </MemoryRouter>
            </ThemeProvider>
        </StyledEngineProvider>,
    );
};

beforeEach(() => isFrozen.mockReturnValue(false));

afterEach(() => {
    document.querySelectorAll('uq-site-header').forEach(node => node.remove());
});

describe('MembershipList', () => {
    it('shows a loader and does not fetch the form data again while it is loading', () => {
        const actions = { loadMembershipFormData: jest.fn(), loadMemberships: jest.fn() };
        setup({ membershipFormData: null, membershipFormDataLoading: true, actions });

        expect(screen.getByText('Loading membership applications')).toBeInTheDocument();
        expect(actions.loadMembershipFormData).not.toHaveBeenCalled();
    });

    it('fetches the form data on mount when the store has none', () => {
        const actions = { loadMembershipFormData: jest.fn(), loadMemberships: jest.fn() };
        setup({ membershipFormData: null, actions });

        expect(actions.loadMembershipFormData).toHaveBeenCalled();
    });

    it('does not fetch the form data again when the store already has it', () => {
        const actions = { loadMembershipFormData: jest.fn(), loadMemberships: jest.fn() };
        setup({ actions });

        expect(actions.loadMembershipFormData).not.toHaveBeenCalled();
    });

    it('sets the second-level breadcrumb on the site header when one is present', () => {
        const siteHeader = document.createElement('uq-site-header');
        document.body.appendChild(siteHeader);

        setup();

        expect(siteHeader.getAttribute('secondleveltitle')).toBe('Membership admin');
        expect(siteHeader.getAttribute('secondLevelUrl')).toBe('/admin/membership');
    });

    it('searches with the entered filter, capped at the search limit', async () => {
        const actions = { loadMembershipFormData: jest.fn(), loadMemberships: jest.fn() };
        setup({ actions });

        await userEvent.click(screen.getByTestId('membership-search-button'));

        await waitFor(() => expect(actions.loadMemberships).toHaveBeenCalled());
        expect(actions.loadMemberships).toHaveBeenCalledWith({ name: '', type: '', status: '' }, SEARCH_LIMIT);
    });

    it('announces the count and lists a card per application', () => {
        setup({ memberships });

        expect(screen.getByTestId('membership-list-status')).toHaveTextContent('2 membership applications found');
        expect(screen.getByTestId('membership-row-101')).toBeInTheDocument();
        expect(screen.getByTestId('membership-row-104')).toBeInTheDocument();
    });

    it('uses the singular wording for a single result', () => {
        setup({ memberships: [memberships[0]] });

        expect(screen.getByTestId('membership-list-status')).toHaveTextContent('1 membership application found');
    });

    it('shows the empty state when a search returns nothing', () => {
        setup({ memberships: [] });

        expect(screen.getByTestId('membership-list-empty')).toBeInTheDocument();
        expect(screen.getByTestId('membership-list-status')).toHaveTextContent('No membership applications found');
    });

    it('shows a skeleton while a search is running', () => {
        setup({ membershipsLoading: true });

        expect(screen.getByTestId('membership-list-skeleton')).toBeInTheDocument();
        expect(screen.queryByTestId('membership-list')).not.toBeInTheDocument();
    });

    it('shows an error when the listing cannot be loaded', () => {
        setup({ membershipsError: 'It broke' });

        expect(screen.getByTestId('membership-list-error')).toBeInTheDocument();
    });

    it('replaces the page with a maintenance message during the outage window', () => {
        isFrozen.mockReturnValue(true);
        setup();

        expect(screen.getByTestId('membership-admin-frozen')).toBeInTheDocument();
        expect(screen.queryByTestId('membership-search-form')).not.toBeInTheDocument();
    });

    it('typeTitlesFrom maps types to titles and defaults to an empty map', () => {
        expect(typeTitlesFrom(membershipFormData.account_types)).toEqual({
            community: 'Community',
            hospital: 'Hospital',
        });
        expect(typeTitlesFrom()).toEqual({});
    });
});
