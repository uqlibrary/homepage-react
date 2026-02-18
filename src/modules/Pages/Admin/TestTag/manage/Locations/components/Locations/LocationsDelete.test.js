import React from 'react';
import { rtlRender, WithRouter, WithReduxStore, waitForElementToBeRemoved, userEvent, waitFor } from 'test-utils';
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

describe('Locations', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error');
        console.error.mockImplementation(() => null);
    });

    afterEach(() => {
        console.error.mockRestore();
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

            expect(getByText('Locations management for Work Station Support (Library)')).toBeInTheDocument();

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
            await waitForElementToBeRemoved(() => queryByTestId('dialogbox-locations'));

            expect(deleteLocationFn).toHaveBeenCalledWith({
                id: 2,
                type: 'site',
            });

            await findByTestId('confirmation_alert-success');
            expect(getByTestId('confirmation_alert-success-alert')).toHaveTextContent('Request successfully completed');
        });
    });
});
