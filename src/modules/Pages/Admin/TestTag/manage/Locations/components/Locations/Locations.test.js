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

import Locations, { actionHandler, locationDataFieldKeys } from '../Locations';
import { locationType } from '../../../../SharedComponents/LocationPicker/utils';

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

            userEvent.click(getByTestId('update_dialog-action-button'));

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

            userEvent.click(getByTestId('confirm-locations'));

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
