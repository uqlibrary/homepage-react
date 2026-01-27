import React from 'react';
import {
    rtlRender,
    WithRouter,
    WithReduxStore,
    waitForElementToBeRemoved,
    userEvent,
    within,
    act,
    waitFor,
} from 'test-utils';
import Immutable from 'immutable';

import siteList from '../../../../../../../../data/mock/data/testing/testAndTag/testTagSites';
import floorList from '../../../../../../../../data/mock/data/testing/testAndTag/testTagFloors';
import roomList from '../../../../../../../../data/mock/data/testing/testAndTag/testTagRooms';
import userData from '../../../../../../../../data/mock/data/testing/testAndTag/testTagUser';

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

    const _state = {
        testTagLocationReducer: {
            ...defaultLocationState,
        },
        accountReducer: {
            accountLoading: false,
            account: { tnt: { ...userData, privileges: { ...userData.privileges, can_admin: 1 } } },
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
    describe('buildings', () => {
        jest.setTimeout(30000);
        it('renders grid with buildings', async () => {
            const { getByText, getByTestId, getByRole } = setup({
                isOpen: true,
                actions: {
                    loadSites: jest.fn(),
                    clearSites: jest.fn(),
                    clearRooms: jest.fn(),
                    clearFloors: jest.fn(),
                },
            });

            expect(getByText('Locations management for Library')).toBeInTheDocument();

            await userEvent.click(getByTestId('location_picker-locations-site-input'));

            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), 'Gatton');
            });
            expect(getByTestId('location_picker-locations-site-input')).toHaveAttribute('value', 'Gatton');
            expect(getByTestId('location_picker-locations-building-input')).not.toHaveAttribute('disabled');

            expect(getByTestId('locations-data-table-toolbar-add-button')).toHaveTextContent('Add building');

            const grid = getByTestId('data_table-locations');
            assertHeader(grid, ['Building ID', 'Building name', 'No. assets']);
            const cells1 = assertRow(grid, ['8102', 'J.K. Murray Library', '4'], 1);
            expect(within(cells1[3]).getByTestId('action_cell-8-edit-button')).not.toHaveAttribute('disabled');
            expect(within(cells1[3]).getByTestId('action_cell-8-delete-button')).toHaveAttribute('disabled');
            const cells2 = assertRow(grid, ['8248', 'Library Warehouse', '0'], 2);
            expect(within(cells2[3]).getByTestId('action_cell-9-edit-button')).not.toHaveAttribute('disabled');
            expect(within(cells2[3]).getByTestId('action_cell-9-delete-button')).not.toHaveAttribute('disabled');
        });

        it('handles add action as expected', async () => {
            const addLocationFn = jest.fn(() => Promise.resolve());
            const { getByText, getByTestId, findByTestId, queryByTestId, getByRole } = setup({
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

            await userEvent.click(getByTestId('location_picker-locations-site-input'));

            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), 'Gatton');
            });

            userEvent.click(getByTestId('locations-data-table-toolbar-add-button'));
            await findByTestId('update_dialog-locations');
            expect(getByTestId('update_dialog-action-button')).toHaveAttribute('disabled');

            await userEvent.type(getByTestId('building_id_displayed-input'), 'Test ID');
            await userEvent.type(getByTestId('building_name-input'), 'Test name');
            expect(getByTestId('update_dialog-action-button')).not.toHaveAttribute('disabled');

            userEvent.click(getByTestId('update_dialog-action-button'));

            await waitForElementToBeRemoved(() => queryByTestId('update_dialog-locations'));

            expect(addLocationFn).toHaveBeenCalledWith({
                request: {
                    building_id_displayed: 'Test ID',
                    building_name: 'Test name',
                    building_site_id: 2,
                },
                type: 'building',
            });

            await findByTestId('confirmation_alert-success');
            expect(getByTestId('confirmation_alert-success-alert')).toHaveTextContent('Request successfully completed');
        });

        it('handles update action as expected', async () => {
            const updateLocationFn = jest.fn(() => Promise.resolve());
            const { getByText, getByTestId, findByTestId, queryByTestId, getByRole } = setup({
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

            await userEvent.click(getByTestId('location_picker-locations-site-input'));

            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), 'Gatton');
            });

            userEvent.click(getByTestId('action_cell-9-edit-button'));

            await findByTestId('update_dialog-locations');
            expect(getByTestId('update_dialog-action-button')).not.toHaveAttribute('disabled');
            expect(getByTestId('building_id_displayed-input')).toHaveAttribute('value', '8248');
            expect(getByTestId('building_name-input')).toHaveAttribute('value', 'Library Warehouse');

            await userEvent.type(getByTestId('building_id_displayed-input'), ' update');
            await userEvent.type(getByTestId('building_name-input'), ' update');

            userEvent.click(getByTestId('update_dialog-action-button'));
            await waitForElementToBeRemoved(() => queryByTestId('update_dialog-locations'));

            expect(updateLocationFn).toHaveBeenCalledWith({
                request: {
                    building_id: 9,
                    building_site_id: 2,
                    building_id_displayed: '8248 updat', // this field has a max length, so we should expect truncation here
                    building_name: 'Library Warehouse update',
                },
                type: 'building',
            });

            await findByTestId('confirmation_alert-success');
            expect(getByTestId('confirmation_alert-success-alert')).toHaveTextContent('Request successfully completed');
        });

        it('handles delete action as expected', async () => {
            const deleteLocationFn = jest.fn(() => Promise.resolve());
            const { getByText, getByTestId, findByTestId, queryByTestId, getByRole } = setup({
                isOpen: true,
                actions: {
                    loadSites: jest.fn(),
                    clearSites: jest.fn(),
                    clearRooms: jest.fn(),
                    clearFloors: jest.fn(),
                    deleteLocation: deleteLocationFn,
                },
            });

            expect(getByText('Locations management for Library')).toBeInTheDocument();

            await userEvent.click(getByTestId('location_picker-locations-site-input'));

            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), 'Gatton');
            });

            userEvent.click(getByTestId('action_cell-9-delete-button'));

            await findByTestId('dialogbox-locations');
            expect(getByTestId('message-content')).toHaveTextContent(
                'Are you sure you wish to delete the building "Library Warehouse"?',
            );
            expect(getByTestId('confirm-delete-alert')).toBeInTheDocument();
            expect(getByTestId('confirm-locations')).toHaveAttribute('disabled');

            await waitFor(() => expect(getByTestId('confirm-locations')).not.toHaveAttribute('disabled'), {
                timeout: 3000,
            });

            userEvent.click(getByTestId('confirm-locations'));
            await waitForElementToBeRemoved(() => queryByTestId('dialogbox-locations'));

            expect(deleteLocationFn).toHaveBeenCalledWith({
                id: 9,
                type: 'building',
            });

            await findByTestId('confirmation_alert-success');
            expect(getByTestId('confirmation_alert-success-alert')).toHaveTextContent('Request successfully completed');
        });
    });
});
