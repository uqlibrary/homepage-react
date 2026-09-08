import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import Immutable from 'immutable';
import { createStore } from 'redux';

import MembershipReceivedContainer from './MembershipReceivedContainer';

jest.mock('./MembershipReceived', () => {
    const MembershipReceivedMock = ({ membership, membershipLoading, actions }) => (
        <div data-testid="membership-received-mock" data-loading={String(membershipLoading)}>
            {membership?.id}
            {typeof actions?.loadMembership}
        </div>
    );
    MembershipReceivedMock.propTypes = {
        membership: require('prop-types').object,
        membershipLoading: require('prop-types').bool,
        actions: require('prop-types').object,
    };
    return MembershipReceivedMock;
});

describe('MembershipReceivedContainer', () => {
    it('hands the page the application from the store, and the actions to fetch it', () => {
        const state = Immutable.Map({
            membershipReducer: { membership: { id: 'abc-123' }, membershipLoading: false },
        });
        const store = createStore(() => state, state);

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <MembershipReceivedContainer />
                </MemoryRouter>
            </Provider>,
        );

        const page = screen.getByTestId('membership-received-mock');
        expect(page).toHaveAttribute('data-loading', 'false');
        expect(page).toHaveTextContent('abc-123');
        expect(page).toHaveTextContent('function');
    });
});
