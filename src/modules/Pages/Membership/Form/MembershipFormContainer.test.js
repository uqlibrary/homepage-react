import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import Immutable from 'immutable';
import { createStore } from 'redux';

import MembershipFormContainer from './MembershipFormContainer';

jest.mock('./MembershipForm', () => {
    const MembershipFormMock = ({ membershipFormData, membershipSaving, actions }) => (
        <div data-testid="membership-form-mock" data-saving={String(membershipSaving)}>
            {membershipFormData?.account_types?.[0]?.title}
            {typeof actions?.submitMembership}
        </div>
    );
    MembershipFormMock.propTypes = {
        membershipFormData: require('prop-types').object,
        membershipSaving: require('prop-types').bool,
        actions: require('prop-types').object,
    };
    return MembershipFormMock;
});

describe('MembershipFormContainer', () => {
    it('hands the page the form-data and membership slices, and the actions to fill them', () => {
        const state = Immutable.Map({
            membershipFormDataReducer: { membershipFormData: { account_types: [{ title: 'Community' }] } },
            membershipReducer: { membershipSaving: true },
        });
        const store = createStore(() => state, state);

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <MembershipFormContainer />
                </MemoryRouter>
            </Provider>,
        );

        const page = screen.getByTestId('membership-form-mock');
        expect(page).toHaveAttribute('data-saving', 'true');
        expect(page).toHaveTextContent('Community');
        expect(page).toHaveTextContent('function');
    });
});
