import React from 'react';
import { render, WithReduxStore } from 'test-utils';
import Immutable from 'immutable';

import * as actions from '../../../../../data/actions/actionTypes';
import * as tntActions from '../../../../../data/actions/testTagActions';
import * as repositories from 'repositories';

import { withUser } from './withUser';

const Component = () => <div>Here is the component</div>;
const user = { user_uid: 1 };
const userReducer = {
    testTagUserReducer: {
        user: user,
        userLoading: false,
        userLoaded: true,
        userError: null,
    },
};

function setup(testProps = {}, renderer = render) {
    const { state = {} } = testProps;

    const _state = {
        ...userReducer,
        ...state,
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
            state: {
                testTagUserReducer: {
                    userLoading: true,
                    userLoaded: false,
                    userError: null,
                },
            },
        });
        expect(getByText('Retrieving user details...')).toBeInTheDocument();
    });
    it('renders component with denied text when no user object available', () => {
        const { getByTestId } = setup({
            state: {
                testTagUserReducer: {
                    userLoading: false,
                    userLoaded: true,
                },
            },
        });
        expect(getByTestId('account-not-found')).toHaveTextContent(
            'The requested page is only available to users with an active Test and Tag account.',
        );
    });
    it('renders component with denied text when error loading user', () => {
        const { getByTestId } = setup({
            state: {
                testTagUserReducer: {
                    userLoading: false,
                    userLoaded: true,
                    userError: 'Error',
                },
            },
        });
        expect(getByTestId('account-not-found')).toHaveTextContent(
            'The requested page is only available to users with an active Test and Tag account.',
        );
    });

    it('renders component when user object is available', () => {
        const { getByText } = setup({
            state: {
                testTagUserReducer: {
                    user,
                    userLoading: false,
                    userLoaded: true,
                },
            },
        });
        expect(getByText('Here is the component')).toBeInTheDocument();
    });

    describe('calling the API', () => {
        beforeEach(() => {
            mockActionsStore = setupStoreForActions();
            mockApi = setupMockAdapter();
            mockApi.onGet(repositories.routes.TEST_TAG_USER_API().apiUrl).reply(200, { data: user });
        });
        afterEach(() => {
            mockApi.reset();
        });

        it('should dispatch action to load user if needed', async () => {
            setup({
                state: {
                    testTagUserReducer: {
                        userLoading: false,
                        userLoaded: false,
                        userError: false,
                    },
                },
            });

            const expectedActions = [actions.TESTTAG_USER_LOADING, actions.TESTTAG_USER_LOADED];

            await mockActionsStore.dispatch(tntActions.loadUser());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});
