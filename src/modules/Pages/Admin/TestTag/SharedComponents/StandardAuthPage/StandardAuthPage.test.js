import React from 'react';
import StandardAuthPage from './StandardAuthPage';
import { render, WithReduxStore } from 'test-utils';
import Immutable from 'immutable';

import * as actions from '../../../../../../data/actions/actionTypes';
import * as tntActions from '../../../../../../data/actions/testTagActions';
import * as repositories from 'repositories';

import { getUserPermissions } from '../../helpers/auth';
import { PERMISSIONS } from '../../config/auth';
import locale from '../../testTag.locale';
import userData from '../../../../../../data/mock/data/testing/testTagUser';
/*
    title: PropTypes.string,
    user: PropTypes.object,
    locale: PropTypes.object,
    requiredPermissions: PropTypes.array,
    inclusive: PropTypes.bool,
    children: PropTypes.any,
    */

const contentText = 'This is the protected content';

function setup(testProps = {}, renderer = render) {
    const { state = {}, title = 'Test title', ...props } = testProps;

    const _state = {
        testTagUserReducer: {
            user: userData,
            privilege: getUserPermissions(userData.privileges),
            userLoading: false,
            userLoaded: true,
            userError: null,
        },
        ...state,
    };
    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <StandardAuthPage title={title} {...props}>
                <>{contentText}</>
            </StandardAuthPage>
        </WithReduxStore>,
    );
}

describe('StandardAuthPage', () => {
    it('renders component with loading message', () => {
        const { getByText } = setup({
            state: {
                testTagUserReducer: {
                    userLoading: true,
                    userLoaded: false,
                },
            },
        });
        expect(getByText(locale.pages.general.checkingAuth)).toBeInTheDocument();
    });
    it('renders component with denied text when no user object available', () => {
        const { getByText } = setup({
            state: {
                testTagUserReducer: {
                    userLoading: false,
                    userLoaded: true,
                },
            },
        });
        expect(getByText(locale.pages.general.pageUnavailable)).toBeInTheDocument();
    });
    it('renders component with denied text when error loading user', () => {
        const { getByText } = setup({
            state: {
                testTagUserReducer: {
                    userLoading: false,
                    userLoaded: false,
                    userError: true,
                },
            },
        });
        expect(getByText(locale.pages.general.pageUnavailable)).toBeInTheDocument();
    });

    it('renders component with denied text when user does not have required permissions', () => {
        const { getByText } = setup({ requiredPermissions: [PERMISSIONS.can_admin] });
        expect(getByText(locale.pages.general.pageUnavailable)).toBeInTheDocument();
    });
    it('renders component with denied text when user does not have all required permissions', () => {
        const { getByText } = setup({
            requiredPermissions: [
                PERMISSIONS.can_admin,
                PERMISSIONS.can_alter,
                PERMISSIONS.can_inspect,
                PERMISSIONS.can_see_reports,
            ],
        });
        expect(getByText(locale.pages.general.pageUnavailable)).toBeInTheDocument();
    });

    it('renders component with title, subtitle (department_display_name) and protected content when user has any required permission', () => {
        const mockSubtitleFn = jest.fn(dept => `Subtitle for ${dept}`);
        const { getByTestId, getByText } = setup({
            locale: { header: { pageSubtitle: mockSubtitleFn } },
            inclusive: false,
            requiredPermissions: [
                PERMISSIONS.can_admin,
                PERMISSIONS.can_alter,
                PERMISSIONS.can_inspect,
                PERMISSIONS.can_see_reports,
            ],
        });
        expect(mockSubtitleFn).toHaveBeenCalledWith('Library');
        expect(getByTestId('StandardPage-title')).toHaveTextContent('Test title');
        expect(getByTestId('test_tag_header')).toHaveTextContent('Subtitle for Library');
        expect(getByText(contentText)).toBeInTheDocument();
    });

    it('renders component with title, subtitle (user_department) and protected content when user has any required permission', () => {
        const mockSubtitleFn = jest.fn(dept => `Subtitle for ${dept}`);
        const { getByTestId, getByText } = setup({
            state: {
                testTagUserReducer: {
                    user: { ...userData, department_display_name: undefined },
                    privilege: getUserPermissions(userData.privileges),
                    userLoading: false,
                    userLoaded: true,
                    userError: null,
                },
            },
            locale: { header: { pageSubtitle: mockSubtitleFn } },
            inclusive: false,
            requiredPermissions: [
                PERMISSIONS.can_admin,
                PERMISSIONS.can_alter,
                PERMISSIONS.can_inspect,
                PERMISSIONS.can_see_reports,
            ],
        });
        expect(mockSubtitleFn).toHaveBeenCalledWith('UQL');
        expect(getByTestId('StandardPage-title')).toHaveTextContent('Test title');
        expect(getByTestId('test_tag_header')).toHaveTextContent('Subtitle for UQL');
        expect(getByText(contentText)).toBeInTheDocument();
    });
    it('renders component with title and subtitle and protected content', () => {
        const mockSubtitleFn = jest.fn(dept => `Subtitle for ${dept}`);
        const { getByTestId, getByText } = setup({
            locale: { header: { pageSubtitle: mockSubtitleFn } },
            requiredPermissions: [PERMISSIONS.can_inspect],
        });
        expect(mockSubtitleFn).toHaveBeenCalledWith('Library');
        expect(getByTestId('StandardPage-title')).toHaveTextContent('Test title');
        expect(getByTestId('test_tag_header')).toHaveTextContent('Subtitle for Library');
        expect(getByText(contentText)).toBeInTheDocument();
    });
    describe('calling the API', () => {
        beforeEach(() => {
            mockActionsStore = setupStoreForActions();
            mockApi = setupMockAdapter();
            mockApi.onGet(repositories.routes.TEST_TAG_USER_API().apiUrl).reply(200, { data: userData });
        });
        afterEach(() => {
            mockApi.reset();
        });

        it('should dispatch action to load user if needed', async () => {
            const { getByText } = setup({
                state: {
                    testTagUserReducer: {
                        userLoading: false,
                        userLoaded: false,
                        userError: false,
                    },
                },
            });
            expect(getByText(locale.pages.general.checkingAuth)).toBeInTheDocument();

            const expectedActions = [actions.TESTTAG_USER_LOADING, actions.TESTTAG_USER_LOADED];

            await mockActionsStore.dispatch(tntActions.loadUser());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});
