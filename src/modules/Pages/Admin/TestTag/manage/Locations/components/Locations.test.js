import React from 'react';
import {
    renderWithRouter,
    WithReduxStore,
    waitForElementToBeRemoved,
    userEvent,
    within,
    act,
    waitFor,
} from 'test-utils';
import Immutable from 'immutable';

import siteList from '../../../../../../../data/mock/data/testAndTag/testTagSites';
import floorList from '../../../../../../../data/mock/data/testAndTag/testTagFloors';
import roomList from '../../../../../../../data/mock/data/testAndTag/testTagRooms';
import userData from '../../../../../../../data/mock/data/testAndTag/testTagUser';

import { getUserPermissions } from '../../../helpers/auth';

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

import Locations, { actionHandler, locationDataFieldKeys } from './Locations';
import { locationType } from '../../../SharedComponents/LocationPicker/utils';

function setup(testProps = {}, renderer = renderWithRouter) {
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
            <Locations actions={actions} {...props} />
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

            act(() => userEvent.click(getByTestId('update_dialog-action-button')));
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
    describe('delete', () => {
        jest.setTimeout(30000);
        it('handles delete action as expected', async () => {
            const deleteLocationFn = jest.fn(() => Promise.resolve());
            const { getByText, getByTestId, findByTestId, queryByTestId } = setup({
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

            userEvent.click(getByTestId('action_cell-2-delete-button'));
            await findByTestId('dialogbox-locations');
            expect(getByTestId('message-content')).toHaveTextContent(
                'Are you sure you wish to delete the site "Gatton"?',
            );
            expect(getByTestId('confirm-delete-alert')).toBeInTheDocument();
            expect(getByTestId('confirm-locations')).toHaveAttribute('disabled');

            await waitFor(() => expect(getByTestId('confirm-locations')).not.toHaveAttribute('disabled'), {
                timeout: 3000,
            });

            act(() => userEvent.click(getByTestId('confirm-locations')));
            await waitForElementToBeRemoved(() => queryByTestId('dialogbox-locations'));

            expect(deleteLocationFn).toHaveBeenCalledWith({
                id: 2,
                type: 'site',
            });

            await findByTestId('confirmation_alert-success');
            expect(getByTestId('confirmation_alert-success-alert')).toHaveTextContent('Request successfully completed');
        });
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
            act(() => {
                userEvent.click(getByTestId('location_picker-locations-site-input'));
            });
            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), 'Gatton');
            });
            expect(getByTestId('location_picker-locations-site-input')).toHaveAttribute('value', 'Gatton');
            expect(getByTestId('location_picker-locations-building-input')).not.toHaveAttribute('disabled');

            expect(getByTestId('add_toolbar-locations-add-button')).toHaveTextContent('Add building');

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
            act(() => {
                userEvent.click(getByTestId('location_picker-locations-site-input'));
            });
            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), 'Gatton');
            });

            userEvent.click(getByTestId('add_toolbar-locations-add-button'));
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

            act(() => {
                userEvent.click(getByTestId('location_picker-locations-site-input'));
            });
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

            act(() => userEvent.click(getByTestId('update_dialog-action-button')));
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

            act(() => {
                userEvent.click(getByTestId('location_picker-locations-site-input'));
            });
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

            act(() => userEvent.click(getByTestId('confirm-locations')));
            await waitForElementToBeRemoved(() => queryByTestId('dialogbox-locations'));

            expect(deleteLocationFn).toHaveBeenCalledWith({
                id: 9,
                type: 'building',
            });

            await findByTestId('confirmation_alert-success');
            expect(getByTestId('confirmation_alert-success-alert')).toHaveTextContent('Request successfully completed');
        });
    });
    describe('floors', () => {
        jest.setTimeout(30000);
        it('renders component with floors', async () => {
            const { getByText, getByTestId, getByRole } = setup({
                isOpen: true,
                actions: {
                    loadSites: jest.fn(),
                    loadFloors: jest.fn(),
                    clearSites: jest.fn(),
                    clearRooms: jest.fn(),
                    clearFloors: jest.fn(),
                },
                state: {
                    testTagLocationReducer: {
                        ...defaultLocationState,
                        floorListLoaded: true,
                    },
                },
            });

            expect(getByText('Locations management for Library')).toBeInTheDocument();
            act(() => {
                userEvent.click(getByTestId('location_picker-locations-site-input'));
            });
            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), 'Gatton');
            });

            act(() => {
                userEvent.click(getByTestId('location_picker-locations-building-input'));
            });
            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), '8102 - J.K. Murray Library');
            });

            expect(getByTestId('add_toolbar-locations-add-button')).toHaveTextContent('Add floor');

            expect(getByTestId('location_picker-locations-building-input')).toHaveAttribute(
                'value',
                '8102 - J.K. Murray Library',
            );
            expect(getByTestId('location_picker-locations-floor-input')).not.toHaveAttribute('disabled');

            const grid = getByTestId('data_table-locations');
            assertHeader(grid, ['Floor ID', 'No. assets']);
            const cells1 = assertRow(grid, ['1', '1'], 1);
            expect(within(cells1[2]).getByTestId('action_cell-29-edit-button')).not.toHaveAttribute('disabled');
            expect(within(cells1[2]).getByTestId('action_cell-29-delete-button')).toHaveAttribute('disabled');
            const cells2 = assertRow(grid, ['2', '0'], 2);
            expect(within(cells2[2]).getByTestId('action_cell-30-edit-button')).not.toHaveAttribute('disabled');
            expect(within(cells2[2]).getByTestId('action_cell-30-delete-button')).not.toHaveAttribute('disabled');
        });

        it('handles add action as expected', async () => {
            const addLocationFn = jest.fn(() => Promise.resolve());
            const { getByText, getByTestId, findByTestId, queryByTestId, getByRole } = setup({
                isOpen: true,
                actions: {
                    loadSites: jest.fn(),
                    loadFloors: jest.fn(),
                    clearSites: jest.fn(),
                    clearRooms: jest.fn(),
                    clearFloors: jest.fn(),
                    addLocation: addLocationFn,
                },
                state: {
                    testTagLocationReducer: {
                        ...defaultLocationState,
                        floorListLoaded: true,
                    },
                },
            });

            expect(getByText('Locations management for Library')).toBeInTheDocument();
            act(() => {
                userEvent.click(getByTestId('location_picker-locations-site-input'));
            });
            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), 'Gatton');
            });
            act(() => {
                userEvent.click(getByTestId('location_picker-locations-building-input'));
            });
            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), '8102 - J.K. Murray Library');
            });

            userEvent.click(getByTestId('add_toolbar-locations-add-button'));
            await findByTestId('update_dialog-locations');
            expect(getByTestId('update_dialog-action-button')).toHaveAttribute('disabled');

            expect(
                within(getByTestId('update_dialog-locations')).getByText('J.K. Murray Library, Gatton'),
            ).toBeInTheDocument();
            await userEvent.type(getByTestId('floor_id_displayed-input'), 'Test ID');
            expect(getByTestId('update_dialog-action-button')).not.toHaveAttribute('disabled');

            userEvent.click(getByTestId('update_dialog-action-button'));

            await waitForElementToBeRemoved(() => queryByTestId('update_dialog-locations'));

            expect(addLocationFn).toHaveBeenCalledWith({
                request: {
                    floor_id_displayed: 'Test ID',
                    floor_building_id: 8,
                },
                type: 'floor',
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
                    loadFloors: jest.fn(),
                    clearSites: jest.fn(),
                    clearRooms: jest.fn(),
                    clearFloors: jest.fn(),
                    updateLocation: updateLocationFn,
                },
                state: {
                    testTagLocationReducer: {
                        ...defaultLocationState,
                        floorListLoaded: true,
                    },
                },
            });

            expect(getByText('Locations management for Library')).toBeInTheDocument();

            act(() => {
                userEvent.click(getByTestId('location_picker-locations-site-input'));
            });
            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), 'Gatton');
            });
            act(() => {
                userEvent.click(getByTestId('location_picker-locations-building-input'));
            });
            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), '8102 - J.K. Murray Library');
            });

            userEvent.click(getByTestId('action_cell-30-edit-button'));

            await findByTestId('update_dialog-locations');
            expect(getByTestId('update_dialog-action-button')).not.toHaveAttribute('disabled');

            expect(getByTestId('floor_id_displayed-input')).toHaveAttribute('value', '2');

            await userEvent.type(getByTestId('floor_id_displayed-input'), ' update');

            act(() => userEvent.click(getByTestId('update_dialog-action-button')));
            await waitForElementToBeRemoved(() => queryByTestId('update_dialog-locations'));

            expect(updateLocationFn).toHaveBeenCalledWith({
                request: {
                    floor_id: 30,
                    floor_building_id: 8,
                    floor_id_displayed: '2 update',
                },
                type: 'floor',
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
                    loadFloors: jest.fn(),
                    clearSites: jest.fn(),
                    clearRooms: jest.fn(),
                    clearFloors: jest.fn(),
                    deleteLocation: deleteLocationFn,
                },
                state: {
                    testTagLocationReducer: {
                        ...defaultLocationState,
                        floorListLoaded: true,
                    },
                },
            });

            expect(getByText('Locations management for Library')).toBeInTheDocument();

            act(() => {
                userEvent.click(getByTestId('location_picker-locations-site-input'));
            });
            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), 'Gatton');
            });
            act(() => {
                userEvent.click(getByTestId('location_picker-locations-building-input'));
            });
            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), '8102 - J.K. Murray Library');
            });

            userEvent.click(getByTestId('action_cell-30-delete-button'));

            await findByTestId('dialogbox-locations');
            expect(getByTestId('message-content')).toHaveTextContent('Are you sure you wish to delete the floor "2"?');
            expect(getByTestId('confirm-delete-alert')).toBeInTheDocument();
            expect(getByTestId('confirm-locations')).toHaveAttribute('disabled');

            await waitFor(() => expect(getByTestId('confirm-locations')).not.toHaveAttribute('disabled'), {
                timeout: 3000,
            });

            act(() => userEvent.click(getByTestId('confirm-locations')));
            await waitForElementToBeRemoved(() => queryByTestId('dialogbox-locations'));

            expect(deleteLocationFn).toHaveBeenCalledWith({
                id: 30,
                type: 'floor',
            });

            await findByTestId('confirmation_alert-success');
            expect(getByTestId('confirmation_alert-success-alert')).toHaveTextContent('Request successfully completed');
        });
    });

    describe('rooms', () => {
        jest.setTimeout(30000);
        it('renders component with rooms', async () => {
            const { getByText, getByTestId, getByRole } = setup({
                isOpen: true,
                actions: {
                    loadSites: jest.fn(),
                    loadFloors: jest.fn(),
                    loadRooms: jest.fn(),
                    clearSites: jest.fn(),
                    clearRooms: jest.fn(),
                    clearFloors: jest.fn(),
                },
                state: {
                    testTagLocationReducer: {
                        ...defaultLocationState,
                        roomListLoaded: true,
                    },
                },
            });

            expect(getByText('Locations management for Library')).toBeInTheDocument();
            act(() => {
                userEvent.click(getByTestId('location_picker-locations-site-input'));
            });
            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), 'Gatton');
            });

            act(() => {
                userEvent.click(getByTestId('location_picker-locations-building-input'));
            });
            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), '8102 - J.K. Murray Library');
            });

            act(() => {
                userEvent.click(getByTestId('location_picker-locations-floor-input'));
            });
            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), '1');
            });

            expect(getByTestId('add_toolbar-locations-add-button')).toHaveTextContent('Add room');

            expect(getByTestId('location_picker-locations-floor-input')).toHaveAttribute('value', '1');

            const grid = getByTestId('data_table-locations');
            assertHeader(grid, ['Room ID', 'Room name', 'No. assets']);
            const cells1 = assertRow(grid, ['101', 'Library Facilities', '1'], 1);
            expect(within(cells1[3]).getByTestId('action_cell-476-edit-button')).not.toHaveAttribute('disabled');
            expect(within(cells1[3]).getByTestId('action_cell-476-delete-button')).toHaveAttribute('disabled');
            const cells2 = assertRow(grid, ['102', 'Library Facilities', '0'], 2);
            expect(within(cells2[3]).getByTestId('action_cell-477-edit-button')).not.toHaveAttribute('disabled');
            expect(within(cells2[3]).getByTestId('action_cell-477-delete-button')).not.toHaveAttribute('disabled');
        });

        it('handles add action as expected', async () => {
            const addLocationFn = jest.fn(() => Promise.resolve());
            const { getByText, getByTestId, findByTestId, queryByTestId, getByRole } = setup({
                isOpen: true,
                actions: {
                    loadSites: jest.fn(),
                    loadFloors: jest.fn(),
                    loadRooms: jest.fn(),
                    clearSites: jest.fn(),
                    clearRooms: jest.fn(),
                    clearFloors: jest.fn(),
                    addLocation: addLocationFn,
                },
                state: {
                    testTagLocationReducer: {
                        ...defaultLocationState,
                        roomListLoaded: true,
                    },
                },
            });

            expect(getByText('Locations management for Library')).toBeInTheDocument();
            act(() => {
                userEvent.click(getByTestId('location_picker-locations-site-input'));
            });
            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), 'Gatton');
            });
            act(() => {
                userEvent.click(getByTestId('location_picker-locations-building-input'));
            });
            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), '8102 - J.K. Murray Library');
            });
            act(() => {
                userEvent.click(getByTestId('location_picker-locations-floor-input'));
            });
            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), '1');
            });

            userEvent.click(getByTestId('add_toolbar-locations-add-button'));
            await findByTestId('update_dialog-locations');
            expect(getByTestId('update_dialog-action-button')).toHaveAttribute('disabled');

            expect(
                within(getByTestId('update_dialog-locations')).getByText('Floor 1 J.K. Murray Library, Gatton'),
            ).toBeInTheDocument();

            await userEvent.type(getByTestId('room_id_displayed-input'), 'Test ID'); // only field that is required
            expect(getByTestId('update_dialog-action-button')).not.toHaveAttribute('disabled');
            await userEvent.type(getByTestId('room_description-input'), 'Test description'); // only field that is required

            userEvent.click(getByTestId('update_dialog-action-button'));

            await waitForElementToBeRemoved(() => queryByTestId('update_dialog-locations'));

            expect(addLocationFn).toHaveBeenCalledWith({
                request: {
                    room_id_displayed: 'Test ID',
                    room_description: 'Test description',
                    room_floor_id: 29,
                },
                type: 'room',
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
                    loadFloors: jest.fn(),
                    loadRooms: jest.fn(),
                    clearSites: jest.fn(),
                    clearRooms: jest.fn(),
                    clearFloors: jest.fn(),
                    updateLocation: updateLocationFn,
                },
                state: {
                    testTagLocationReducer: {
                        ...defaultLocationState,
                        roomListLoaded: true,
                    },
                },
            });

            expect(getByText('Locations management for Library')).toBeInTheDocument();

            act(() => {
                userEvent.click(getByTestId('location_picker-locations-site-input'));
            });
            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), 'Gatton');
            });
            act(() => {
                userEvent.click(getByTestId('location_picker-locations-building-input'));
            });
            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), '8102 - J.K. Murray Library');
            });
            act(() => {
                userEvent.click(getByTestId('location_picker-locations-floor-input'));
            });
            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), '1');
            });

            userEvent.click(getByTestId('action_cell-477-edit-button'));

            await findByTestId('update_dialog-locations');
            expect(getByTestId('update_dialog-action-button')).not.toHaveAttribute('disabled');

            expect(getByTestId('room_id_displayed-input')).toHaveAttribute('value', '102');
            await userEvent.type(getByTestId('room_id_displayed-input'), ' update');
            expect(getByTestId('room_description-input')).toHaveAttribute('value', 'Library Facilities');
            await userEvent.type(getByTestId('room_description-input'), ' update');

            act(() => userEvent.click(getByTestId('update_dialog-action-button')));
            await waitForElementToBeRemoved(() => queryByTestId('update_dialog-locations'));

            expect(updateLocationFn).toHaveBeenCalledWith({
                request: {
                    room_id: 477,
                    room_floor_id: 29,
                    room_id_displayed: '102 update',
                    room_description: 'Library Facilities update',
                },
                type: 'room',
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
                    loadFloors: jest.fn(),
                    loadRooms: jest.fn(),
                    clearSites: jest.fn(),
                    clearRooms: jest.fn(),
                    clearFloors: jest.fn(),
                    deleteLocation: deleteLocationFn,
                },
                state: {
                    testTagLocationReducer: {
                        ...defaultLocationState,
                        roomListLoaded: true,
                    },
                },
            });

            expect(getByText('Locations management for Library')).toBeInTheDocument();

            act(() => {
                userEvent.click(getByTestId('location_picker-locations-site-input'));
            });
            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), 'Gatton');
            });
            act(() => {
                userEvent.click(getByTestId('location_picker-locations-building-input'));
            });
            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), '8102 - J.K. Murray Library');
            });
            act(() => {
                userEvent.click(getByTestId('location_picker-locations-floor-input'));
            });
            await act(async () => {
                await userEvent.selectOptions(getByRole('listbox'), '1');
            });

            userEvent.click(getByTestId('action_cell-477-delete-button'));

            await findByTestId('dialogbox-locations');
            expect(getByTestId('message-content')).toHaveTextContent('Are you sure you wish to delete the room "102"?');
            expect(queryByTestId('confirm-delete-alert')).not.toBeInTheDocument(); // rooms have no children, so no alert is shown
            expect(getByTestId('confirm-locations')).toHaveAttribute('disabled');

            await waitFor(() => expect(getByTestId('confirm-locations')).not.toHaveAttribute('disabled'), {
                timeout: 3000,
            });

            act(() => userEvent.click(getByTestId('confirm-locations')));
            await waitForElementToBeRemoved(() => queryByTestId('dialogbox-locations'));

            expect(deleteLocationFn).toHaveBeenCalledWith({
                id: 477,
                type: 'room',
            });

            await findByTestId('confirmation_alert-success');
            expect(getByTestId('confirmation_alert-success-alert')).toHaveTextContent('Request successfully completed');
        });
    });

    describe('coverage', () => {
        jest.setTimeout(30000);
        it('handles closing of dialog', async () => {
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

            userEvent.click(getByTestId('update_dialog-cancel-button'));

            await waitForElementToBeRemoved(() => queryByTestId('update_dialog-locations'));
            expect(addLocationFn).not.toHaveBeenCalled();
        });
        it('handles Add action promise rejection', async () => {
            const addLocationFn = jest.fn(() => Promise.reject());
            const { getByText, getByTestId, findByTestId } = setup({
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

            await findByTestId('confirmation_alert-error');
            expect(getByTestId('confirmation_alert-error-alert')).toHaveTextContent('Unable to save the location');
        });

        it('handles Update action promise rejection', async () => {
            const updateLocationFn = jest.fn(() => Promise.reject());
            const { getByText, getByTestId, findByTestId } = setup({
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

            await userEvent.type(getByTestId('site_id_displayed-input'), ' update');
            await userEvent.type(getByTestId('site_name-input'), ' update');

            act(() => userEvent.click(getByTestId('update_dialog-action-button')));

            await findByTestId('confirmation_alert-error');
            expect(getByTestId('confirmation_alert-error-alert')).toHaveTextContent('Unable to update the location');
        });

        it('handles Delete action promise rejection', async () => {
            const deleteLocationFn = jest.fn(() => Promise.reject());
            const { getByText, getByTestId, findByTestId } = setup({
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

            userEvent.click(getByTestId('action_cell-2-delete-button'));
            await findByTestId('dialogbox-locations');
            expect(getByTestId('message-content')).toHaveTextContent(
                'Are you sure you wish to delete the site "Gatton"?',
            );
            expect(getByTestId('confirm-delete-alert')).toBeInTheDocument();
            expect(getByTestId('confirm-locations')).toHaveAttribute('disabled');

            await waitFor(() => expect(getByTestId('confirm-locations')).not.toHaveAttribute('disabled'), {
                timeout: 3000,
            });

            act(() => userEvent.click(getByTestId('confirm-locations')));

            await findByTestId('confirmation_alert-error');
            expect(getByTestId('confirmation_alert-error-alert')).toHaveTextContent('Unable to delete the location');
        });
    });

    describe('actionHandler', () => {
        jest.setTimeout(30000);
        it('returns expected results', () => {
            const loadSitesFn = jest.fn();
            const loadFloorsFn = jest.fn();
            const loadRoomsFn = jest.fn();
            const actions = { loadSites: loadSitesFn, loadFloors: loadFloorsFn, loadRooms: loadRoomsFn };
            actionHandler[locationType.site](actions);
            expect(loadSitesFn).toHaveBeenCalled();
            actionHandler[locationType.building](actions);
            expect(loadSitesFn).toHaveBeenCalledTimes(2);
            actionHandler[locationType.floor](actions, { building: 1 });
            expect(loadFloorsFn).toHaveBeenCalledWith(1);
            actionHandler[locationType.room](actions, { floor: 2 });
            expect(loadRoomsFn).toHaveBeenCalledWith(2);
        });
    });

    describe('locationDataFieldKeys', () => {
        jest.setTimeout(30000);
        it('returns expected results', () => {
            expect(locationDataFieldKeys).toEqual({
                site: 'site_id_displayed',
                building: 'building_id_displayed',
                floor: 'floor_id_displayed',
                room: 'room_id_displayed',
            });
        });
    });
});
