import React from 'react';
import { renderWithRouter, WithReduxStore, waitFor, act, fireEvent, userEvent } from 'test-utils';
import Immutable from 'immutable';

import * as actions from '../../../../../../../data/actions/actionTypes';
import * as tntActions from '../../../../../../../data/actions/testTagActions';
import * as repositories from 'repositories';

import InspectionsByLicencedUser from './InspectionsByLicencedUser';

import inspectionData from '../../../../../../../data/mock/data/testing/testTagInspectionsByLicencedUsers';
import inspectorsData from '../../../../../../../data/mock/data/testing/testTagLicencedInspectors';
import userData from '../../../../../../../data/mock/data/testing/testTagUser';

import { getUserPermissions } from '../../../helpers/auth';

const panelRegExp = input => input.replace('.\\*', '.*').replace(/[\-\{\}\+\\\$\|]/g, '\\$&');

const selectOptionFromListByIndex = (index, actions) => {
    expect(actions.getByRole('listbox')).not.toEqual(null);
    act(() => {
        const options = actions.getAllByRole('option');

        fireEvent.mouseDown(options[index]);
        options[index].click();
    });
};

function setup(testProps = {}, renderer = renderWithRouter) {
    const {
        state = {},
        actions = {},
        userInspections = inspectionData.user_inspections,
        totalInspections = inspectionData.total_inspections,
        licencedUsers = inspectorsData,
        userInspectionsLoading = false,
        userInspectionsError = null,
        licencedUsersLoading = false,
        licencedUsersLoaded = true,
        licencedUsersError = null,
        ...props
    } = testProps;

    const _state = {
        testTagUserReducer: {
            userLoading: false,
            userLoaded: true,
            userError: false,
            user: userData,
            privilege: getUserPermissions(userData.privileges ?? {}),
        },
        ...state,
    };

    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <InspectionsByLicencedUser
                actions={actions}
                userInspections={userInspections}
                totalInspections={totalInspections}
                licencedUsers={licencedUsers}
                userInspectionsLoading={userInspectionsLoading}
                userInspectionsError={userInspectionsError}
                licencedUsersLoading={licencedUsersLoading}
                licencedUsersLoaded={licencedUsersLoaded}
                licencedUsersError={licencedUsersError}
                {...props}
            />
        </WithReduxStore>,
    );
}

describe('InspectionsByLicencedUser', () => {
    it('renders component', async () => {
        const { getByText, getByTestId } = setup({
            actions: { getInspectionsByLicencedUser: jest.fn(() => Promise.resolve()) },
        });
        expect(getByText('Tests by licenced users report for Library')).toBeInTheDocument();
        expect(getByTestId('user_inspections-user-name-select')).toBeInTheDocument();
        expect(getByTestId('user_inspections-tagged-start-input')).toBeInTheDocument();
        expect(getByTestId('user_inspections-tagged-end-input')).toBeInTheDocument();
        expect(getByTestId('data_table-user-inspections')).toBeInTheDocument();
        expect(getByTestId('data_table_total-user-inspections')).toHaveTextContent('Total tests: 253');
        await waitFor(() => expect(getByText('JTest User')).toBeInTheDocument());
    });

    describe('API', () => {
        beforeEach(() => {
            mockActionsStore = setupStoreForActions();
            mockApi = setupMockAdapter();
            mockApi
                .onGet(
                    new RegExp(
                        panelRegExp(repositories.routes.TEST_TAG_REPORT_INSPECTIONS_BY_LICENCED_USER_API('.*').apiUrl),
                    ),
                )
                .reply(() => [
                    200,
                    {
                        data: inspectionData,
                    },
                ]);
        });
        afterEach(() => {
            mockApi.reset();
        });

        it('can search on user', async () => {
            const getInspectionsByLicencedUserFn = jest.fn(() => Promise.resolve());
            const { getByText, getByTestId, getByRole, getAllByRole } = setup({
                actions: { getInspectionsByLicencedUser: getInspectionsByLicencedUserFn },
            });
            expect(getByText('Tests by licenced users report for Library')).toBeInTheDocument();
            expect(getByTestId('user_inspections-user-name-select')).toBeInTheDocument();

            userEvent.click(getByTestId('user_inspections-user-name-select'));

            selectOptionFromListByIndex(1, { getByRole, getAllByRole });

            expect(getByTestId('user_inspections-user-name-input')).toHaveAttribute('value', '5');

            const expectedActions = [
                actions.TESTTAG_INSPECTIONS_BY_LICENCED_USER_LOADING,
                actions.TESTTAG_INSPECTIONS_BY_LICENCED_USER_LOADED,
            ];

            await waitFor(() =>
                expect(getInspectionsByLicencedUserFn).toHaveBeenLastCalledWith({
                    endDate: null,
                    startDate: null,
                    userRange: '5',
                }),
            );
            await mockActionsStore.dispatch(tntActions.getInspectionsByLicencedUser({ userRange: [5] }));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('can search on start and end date', async () => {
            const getInspectionsByLicencedUserFn = jest.fn(() => Promise.resolve());
            const { getByText, getByTestId } = setup({
                actions: { getInspectionsByLicencedUser: getInspectionsByLicencedUserFn },
            });
            expect(getByText('Tests by licenced users report for Library')).toBeInTheDocument();
            expect(getByTestId('user_inspections-tagged-start-input')).toBeInTheDocument();

            await userEvent.type(getByTestId('user_inspections-tagged-start-input'), '2021-01-01');
            await userEvent.type(getByTestId('user_inspections-tagged-end-input'), '2022-12-31');
            expect(getByTestId('user_inspections-tagged-start-input')).toHaveAttribute('value', '2021-01-01');
            expect(getByTestId('user_inspections-tagged-end-input')).toHaveAttribute('value', '2022-12-31');

            const expectedActions = [
                actions.TESTTAG_INSPECTIONS_BY_LICENCED_USER_LOADING,
                actions.TESTTAG_INSPECTIONS_BY_LICENCED_USER_LOADED,
            ];

            await waitFor(() =>
                expect(getInspectionsByLicencedUserFn).toHaveBeenLastCalledWith({
                    endDate: '2022-12-31',
                    startDate: '2021-01-01',
                    userRange: '',
                }),
            );
            await mockActionsStore.dispatch(
                tntActions.getInspectionsByLicencedUser({ startDate: '2021-01-01', endDate: '2022-12-31' }),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should show date error messages', async () => {
            const getInspectionsByLicencedUserFn = jest.fn(() => Promise.resolve());
            const { getByText, queryByText, getByTestId } = setup({
                actions: { getInspectionsByLicencedUser: getInspectionsByLicencedUserFn },
            });
            expect(getByText('Tests by licenced users report for Library')).toBeInTheDocument();
            expect(getByTestId('user_inspections-tagged-start-input')).toBeInTheDocument();

            await userEvent.type(getByTestId('user_inspections-tagged-start-input'), '2021-01-01');
            expect(getByTestId('user_inspections-tagged-start-input')).toHaveAttribute('value', '2021-01-01');
            expect(getByText('An end date is required to search by date')).toBeInTheDocument();

            await userEvent.type(getByTestId('user_inspections-tagged-end-input'), '2022-12-31');
            expect(getByTestId('user_inspections-tagged-end-input')).toHaveAttribute('value', '2022-12-31');
            expect(queryByText('An end date is required to search by date')).not.toBeInTheDocument();

            // invalid end date
            await userEvent.clear(getByTestId('user_inspections-tagged-end-input'));
            await userEvent.type(getByTestId('user_inspections-tagged-end-input'), '2020-12-31');
            expect(getByTestId('user_inspections-tagged-end-input')).toHaveAttribute('value', '2020-12-31');

            expect(getByText('Start date must be before end date')).toBeInTheDocument();
            expect(getByText('End date must be after start date')).toBeInTheDocument();

            await userEvent.clear(getByTestId('user_inspections-tagged-start-input'));

            expect(getByText('A start date is required to search by date')).toBeInTheDocument();
        });
    });

    describe('coverage', () => {
        it('fires call to get licenced users if null', () => {
            const getLicencedUsersFn = jest.fn(() => Promise.resolve());
            const { getByText } = setup({
                actions: {
                    getInspectionsByLicencedUser: jest.fn(() => Promise.resolve()),
                    getLicencedUsers: getLicencedUsersFn,
                },
                licencedUsers: null,
            });
            expect(getByText('Tests by licenced users report for Library')).toBeInTheDocument();
            expect(getLicencedUsersFn).toHaveBeenCalled();
        });
        it('fires call to get licenced users if empty array', () => {
            const getLicencedUsersFn = jest.fn(() => Promise.resolve());
            const { getByText } = setup({
                actions: {
                    getInspectionsByLicencedUser: jest.fn(() => Promise.resolve()),
                    getLicencedUsers: getLicencedUsersFn,
                },
                licencedUsers: [],
            });
            expect(getByText('Tests by licenced users report for Library')).toBeInTheDocument();
            expect(getLicencedUsersFn).toHaveBeenCalled();
        });
        it('shows alert if licencedUsersError is set', async () => {
            const clearLicencedUsersErrorFn = jest.fn();

            const { getByTitle, getByTestId, queryByTestId } = setup({
                actions: {
                    getInspectionsByLicencedUser: jest.fn(() => Promise.resolve()),
                    clearLicencedUsersError: clearLicencedUsersErrorFn,
                },
                licencedUsersError: 'Test licencedUsersError error',
            });
            expect(getByTestId('confirmation_alert-error-alert')).toHaveTextContent('Test licencedUsersError error');
            userEvent.click(getByTitle('Close'));

            await waitFor(() => expect(queryByTestId('confirmation_alert-error-alert')).not.toBeInTheDocument());
            expect(clearLicencedUsersErrorFn).toHaveBeenCalled();
        });
        it('shows alert if userInspectionsError is set', async () => {
            const clearInspectionsErrorFn = jest.fn();

            const { getByTitle, getByTestId, queryByTestId } = setup({
                actions: {
                    getInspectionsByLicencedUser: jest.fn(() => Promise.resolve()),
                    clearInspectionsError: clearInspectionsErrorFn,
                },
                userInspectionsError: 'Test userInspectionsError error',
            });
            expect(getByTestId('confirmation_alert-error-alert')).toHaveTextContent('Test userInspectionsError error');
            userEvent.click(getByTitle('Close'));

            await waitFor(() => expect(queryByTestId('confirmation_alert-error-alert')).not.toBeInTheDocument());
            expect(clearInspectionsErrorFn).toHaveBeenCalled();
        });
        it('truncates selected users if more than 2', async () => {
            const getInspectionsByLicencedUserFn = jest.fn(() => Promise.resolve());
            const { getByText, getByTestId, getByRole, getAllByRole } = setup({
                actions: { getInspectionsByLicencedUser: getInspectionsByLicencedUserFn },
            });
            expect(getByText('Tests by licenced users report for Library')).toBeInTheDocument();
            expect(getByTestId('user_inspections-user-name-select')).toBeInTheDocument();

            userEvent.click(getByTestId('user_inspections-user-name-select'));

            selectOptionFromListByIndex(0, { getByRole, getAllByRole });
            selectOptionFromListByIndex(1, { getByRole, getAllByRole });
            selectOptionFromListByIndex(2, { getByRole, getAllByRole });

            expect(getByTestId('user_inspections-user-name-select')).toHaveTextContent(
                'JTest User, Second Testing user, (and 1 more)',
            );
            expect(getByTestId('user_inspections-user-name-input')).toHaveAttribute('value', '2,5,6');
        });
    });
});
