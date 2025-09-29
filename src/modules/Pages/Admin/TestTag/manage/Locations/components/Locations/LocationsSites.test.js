import React from 'react';
import { rtlRender, WithRouter, WithReduxStore, waitForElementToBeRemoved, userEvent, within } from 'test-utils';
import Immutable from 'immutable';

import siteList from '../../../../../../../../data/mock/data/testing/testAndTag/testTagSites';
import floorList from '../../../../../../../../data/mock/data/testing/testAndTag/testTagFloors';
import roomList from '../../../../../../../../data/mock/data/testing/testAndTag/testTagRooms';
import userData from '../../../../../../../../data/mock/data/testing/testAndTag/testTagUser';

import { getUserPermissions } from '../../../../helpers/auth';

const defaultLocationState = {
    siteList,
    siteListLoading: false,
    siteListLoaded: true,
    buildingList: siteList[0].buildings,
    buildingListLoading: false,
    floorList: floorList[2],
    floorListLoading: false,
    floorListLoaded: false,
    roomList: roomList[4],
    roomListLoading: false,
    roomListLoaded: false,
};

import Locations from '../Locations';

function setup(testProps = {}, renderer = rtlRender) {
    const { state = {}, actions = {}, ...props } = testProps;
    const _userData = { ...userData, privileges: { ...userData.privileges, can_admin: 1 } };

    const _state = {
        testTagLocationReducer: {
            ...defaultLocationState,
        },
        testTagUserReducer: {
            userLoading: false,
            userLoaded: true,
            userError: false,
            user: _userData,
            privilege: getUserPermissions(_userData.privileges ?? {}),
        },
        ...state,
    };

    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <WithRouter>
                <Locations actions={actions} {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}
const assertRowText = (row, values) => {
    values.every(
        (value, index) => values === undefined || expect(within(row[index]).getByText(value)).toBeInTheDocument(),
    );
};
const assertHeader = (grid, values, rowIndex = 0) => {
    const headerRow = within(grid).getAllByRole('row')[rowIndex];
    const headerCells = within(headerRow).getAllByRole('columnheader');
    assertRowText(headerCells, values);
    return headerCells;
};
const assertRow = (grid, values, rowIndex) => {
    const row = within(grid).getAllByRole('row')[rowIndex];
    const cells = within(row).getAllByRole('cell');
    assertRowText(cells, values);
    return cells;
};

describe('Locations', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error');
        console.error.mockImplementation(() => null);
    });

    afterEach(() => {
        console.error.mockRestore();
    });
    describe('sites', () => {
        jest.setTimeout(30000);
        it('renders component as expected', async () => {
            const { getByText, getByTestId } = setup({
                isOpen: true,
                actions: {
                    loadSites: jest.fn(),
                    clearSites: jest.fn(),
                    clearRooms: jest.fn(),
                    clearFloors: jest.fn(),
                },
            });

            expect(getByText('Locations management for Library')).toBeInTheDocument();
            expect(getByTestId('location_picker-locations-site-input')).toBeInTheDocument();
            expect(getByTestId('location_picker-locations-site-input')).toHaveAttribute('value', 'All sites');
            expect(getByTestId('location_picker-locations-site-input')).not.toHaveAttribute('disabled');
            expect(getByTestId('location_picker-locations-building-input')).toHaveAttribute('value', 'All buildings');
            expect(getByTestId('location_picker-locations-building-input')).toHaveAttribute('disabled');
            expect(getByTestId('location_picker-locations-floor-input')).toHaveAttribute('value', 'All floors');
            expect(getByTestId('location_picker-locations-floor-input')).toHaveAttribute('disabled');
            const grid = getByTestId('data_table-locations');
            expect(grid).toBeInTheDocument();
            expect(getByTestId('add_toolbar-locations-add-button')).toHaveTextContent('Add site');

            // check header row is as expected
            assertHeader(grid, ['Site ID', 'Site name', 'No. assets']);

            // check first row is as expected
            const cells1 = assertRow(grid, ['01', 'St Lucia', '120'], 1);
            expect(within(cells1[3]).getByTestId('action_cell-1-edit-button')).not.toHaveAttribute('disabled');
            expect(within(cells1[3]).getByTestId('action_cell-1-delete-button')).toHaveAttribute('disabled');

            // check second row is as expected
            const cells2 = assertRow(grid, ['29', 'Gatton', '0'], 2);
            expect(within(cells2[3]).getByTestId('action_cell-2-edit-button')).not.toHaveAttribute('disabled');
            expect(within(cells2[3]).getByTestId('action_cell-2-delete-button')).not.toHaveAttribute('disabled');
        });

        it('handles add action as expected', async () => {
            const addLocationFn = jest.fn(() => Promise.resolve());
            const { getByText, getByTestId, findByTestId, queryByTestId } = setup({
                isOpen: true,
                actions: {
                    loadSites: jest.fn(),
                    clearSites: jest.fn(),
                    clearRooms: jest.fn(),
                    clearFloors: jest.fn(),
                    addLocation: addLocationFn,
                },
            });

            expect(getByText('Locations management for Library')).toBeInTheDocument();

            userEvent.click(getByTestId('add_toolbar-locations-add-button'));
            await findByTestId('update_dialog-locations');
            expect(getByTestId('update_dialog-action-button')).toHaveAttribute('disabled');

            await userEvent.type(getByTestId('site_id_displayed-input'), 'Test ID');
            await userEvent.type(getByTestId('site_name-input'), 'Test name');
            expect(getByTestId('update_dialog-action-button')).not.toHaveAttribute('disabled');

            userEvent.click(getByTestId('update_dialog-action-button'));

            await waitForElementToBeRemoved(() => queryByTestId('update_dialog-locations'));

            expect(addLocationFn).toHaveBeenCalledWith({
                request: {
                    site_id_displayed: 'Test ID',
                    site_name: 'Test name',
                },
                type: 'site',
            });

            await findByTestId('confirmation_alert-success');
            expect(getByTestId('confirmation_alert-success-alert')).toHaveTextContent('Request successfully completed');
        });

        it('handles update action as expected', async () => {
            const updateLocationFn = jest.fn(() => Promise.resolve());
            const { getByText, getByTestId, findByTestId, queryByTestId } = setup({
                isOpen: true,
                actions: {
                    loadSites: jest.fn(),
                    clearSites: jest.fn(),
                    clearRooms: jest.fn(),
                    clearFloors: jest.fn(),
                    updateLocation: updateLocationFn,
                },
            });

            expect(getByText('Locations management for Library')).toBeInTheDocument();

            userEvent.click(getByTestId('action_cell-1-edit-button'));
            await findByTestId('update_dialog-locations');
            expect(getByTestId('update_dialog-action-button')).not.toHaveAttribute('disabled');
            expect(getByTestId('site_id_displayed-input')).toHaveAttribute('value', '01');
            expect(getByTestId('site_name-input')).toHaveAttribute('value', 'St Lucia');

            await userEvent.type(getByTestId('site_id_displayed-input'), ' update');
            await userEvent.type(getByTestId('site_name-input'), ' update');

            userEvent.click(getByTestId('update_dialog-action-button'));
            await waitForElementToBeRemoved(() => queryByTestId('update_dialog-locations'));

            expect(updateLocationFn).toHaveBeenCalledWith({
                request: {
                    site_id: 1,
                    site_id_displayed: '01 update',
                    site_name: 'St Lucia update',
                },
                type: 'site',
            });

            await findByTestId('confirmation_alert-success');
            expect(getByTestId('confirmation_alert-success-alert')).toHaveTextContent('Request successfully completed');
        });
    });
});
