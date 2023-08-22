import React from 'react';
import { renderWithRouter, WithReduxStore, act, fireEvent, waitFor, preview } from 'test-utils';
import Immutable from 'immutable';

import InspectionsByLicencedUser from './InspectionsByLicencedUser';

import inspectionData from '../../../../../../../data/mock/data/testing/testTagInspectionsByLicencedUsers';
import inspectorsData from '../../../../../../../data/mock/data/testing/testTagLicencedInspectors';
import userData from '../../../../../../../data/mock/data/testing/testTagUser';

import { getUserPermissions } from '../../../helpers/auth';

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
        const { getByText, getByTestId } = setup({ actions: { getInspectionsByLicencedUser: jest.fn() } });
        expect(getByText('Tests by licenced users report for Library')).toBeInTheDocument();
        expect(getByTestId('user_inspections-user-name-select')).toBeInTheDocument();
        expect(getByTestId('user_inspections-tagged-start-input')).toBeInTheDocument();
        expect(getByTestId('user_inspections-tagged-end-input')).toBeInTheDocument();
        expect(getByTestId('data_table-user-inspections')).toBeInTheDocument();
        expect(getByTestId('data_table_total-user-inspections')).toHaveTextContent('Total tests: 253');
        await waitFor(() => expect(getByText('JTest User')).toBeInTheDocument());
    });
});
