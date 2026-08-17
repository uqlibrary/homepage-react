import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import Immutable from 'immutable';
import { createStore } from 'redux';

import MembershipListContainer from './MembershipListContainer';

jest.mock('./MembershipList', () => {
    const MembershipListMock = ({ memberships, membershipFormData, actions }) => (
        <div data-testid="membership-list-mock">
            {memberships?.length}
            {membershipFormData?.account_types?.length}
            {typeof actions?.loadMemberships}
        </div>
    );
    MembershipListMock.propTypes = {
        memberships: require('prop-types').array,
        membershipFormData: require('prop-types').object,
        actions: require('prop-types').object,
    };
    return MembershipListMock;
});

describe('MembershipListContainer', () => {
    it('hands the page the listing, the form data and the actions from the store', () => {
        const state = Immutable.Map({
            membershipListReducer: { memberships: [{ id: '101' }, { id: '104' }] },
            membershipFormDataReducer: { membershipFormData: { account_types: [{ value: 'community' }] } },
        });
        const store = createStore(() => state, state);

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <MembershipListContainer />
                </MemoryRouter>
            </Provider>,
        );

        const page = screen.getByTestId('membership-list-mock');
        expect(page).toHaveTextContent('2');
        expect(page).toHaveTextContent('1');
        expect(page).toHaveTextContent('function');
    });
});
