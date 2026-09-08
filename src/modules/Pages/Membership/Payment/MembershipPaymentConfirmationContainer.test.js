import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import Immutable from 'immutable';
import { createStore } from 'redux';

import MembershipPaymentConfirmationContainer from './MembershipPaymentConfirmationContainer';

jest.mock('./MembershipPaymentConfirmation', () => {
    const MembershipPaymentConfirmationMock = ({ actions }) => (
        <div data-testid="membership-payment-mock">{typeof actions?.saveMembershipPayment}</div>
    );
    MembershipPaymentConfirmationMock.propTypes = { actions: require('prop-types').object };
    return MembershipPaymentConfirmationMock;
});

describe('MembershipPaymentConfirmationContainer', () => {
    it('hands the page the action that records the payment', () => {
        const state = Immutable.Map({ membershipReducer: { membership: null } });
        const store = createStore(() => state, state);

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <MembershipPaymentConfirmationContainer />
                </MemoryRouter>
            </Provider>,
        );

        expect(screen.getByTestId('membership-payment-mock')).toHaveTextContent('function');
    });
});
