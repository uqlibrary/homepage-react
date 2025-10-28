import React from 'react';
import { render, WithReduxStore } from 'test-utils';
import Immutable from 'immutable';

import { withUser } from './withUser';

const Component = () => <div>Here is the component</div>;
const user = { user_uid: 1 };

function setup(testProps = {}, renderer = render) {
    const { state = {}, ...rest } = testProps;

    const _state = {
        accountReducer: {
            account: {
                ...state,
            },
            accountLoading: false,
            ...rest,
        },
    };

    const Container = withUser(Component);

    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <Container />
        </WithReduxStore>,
    );
}

describe('withUser', () => {
    it('renders component with loading message', () => {
        const { getByText } = setup({
            accountLoading: true,
        });
        expect(getByText('Retrieving user details...')).toBeInTheDocument();
    });
    it('renders component with denied text when no user object available', () => {
        const { getByTestId } = setup();
        expect(getByTestId('account-not-found')).toHaveTextContent(
            'The requested page is only available to users with an active Test and Tag account.',
        );
    });
    it('renders component when user object is available', () => {
        const { getByText } = setup({
            state: {
                tnt: user,
            },
        });
        expect(getByText('Here is the component')).toBeInTheDocument();
    });
});
