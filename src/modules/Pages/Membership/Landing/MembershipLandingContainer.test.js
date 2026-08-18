import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import Immutable from 'immutable';
import { createStore } from 'redux';

import MembershipLandingContainer from './MembershipLandingContainer';

jest.mock('./MembershipLanding', () => {
    const MembershipLandingMock = ({ accountLoading, membershipFormData, membershipRenewing, actions }) => (
        <div data-testid="membership-landing-mock" data-account-loading={String(accountLoading)}>
            {membershipFormData?.account_types?.[0]?.title}
            {String(membershipRenewing?.renewing)}
            {typeof actions?.loadMembershipFormData}
        </div>
    );
    MembershipLandingMock.propTypes = {
        accountLoading: require('prop-types').bool,
        membershipFormData: require('prop-types').object,
        membershipRenewing: require('prop-types').object,
        actions: require('prop-types').object,
    };
    return MembershipLandingMock;
});

describe('MembershipLandingContainer', () => {
    it('hands the page what the store holds, and the actions to fill it', () => {
        const state = Immutable.Map({
            accountReducer: { account: { id: 'uqtester' }, accountLoading: false },
            membershipFormDataReducer: { membershipFormData: { account_types: [{ title: 'Community' }] } },
            membershipRenewingReducer: { membershipRenewing: { renewing: true } },
        });
        const store = createStore(() => state, state);

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <MembershipLandingContainer />
                </MemoryRouter>
            </Provider>,
        );

        const page = screen.getByTestId('membership-landing-mock');
        expect(page).toHaveAttribute('data-account-loading', 'false');
        expect(page).toHaveTextContent('Community');
        expect(page).toHaveTextContent('true');
        expect(page).toHaveTextContent('function');
    });
});
