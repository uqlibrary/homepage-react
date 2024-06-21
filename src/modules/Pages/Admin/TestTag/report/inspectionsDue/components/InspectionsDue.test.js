import React from 'react';
import {
    rtlRender,
    WithRouter,
    WithReduxStore,
    waitFor,
    userEvent,
    within,
    waitForElementToBeRemoved,
} from 'test-utils';
import Immutable from 'immutable';

import InspectionsDue from './InspectionsDue';
import config from './config';

import inspectionData from '../../../../../../../data/mock/data/testing/testAndTag/testTagPendingInspections';
import userData from '../../../../../../../data/mock/data/testing/testAndTag/testTagUser';
import siteList from '../../../../../../../data/mock/data/testing/testAndTag/testTagSites';
import floorList from '../../../../../../../data/mock/data/testing/testAndTag/testTagFloors';
import roomList from '../../../../../../../data/mock/data/testing/testAndTag/testTagRooms';

import { getUserPermissions } from '../../../helpers/auth';

const defaultLocationState = {
    siteList,
    siteListLoading: false,
    siteListLoaded: false,
    buildingList: siteList[0].buildings,
    buildingListLoading: false,
    floorList: floorList[0],
    floorListLoading: false,
    floorListLoaded: false,
    roomList: roomList[0],
    roomListLoading: false,
    roomListLoaded: false,
};

function setup(testProps = {}, renderer = rtlRender) {
    const {
        state = {},
        actions = {},
        inspectionsDue = inspectionData,
        inspectionsDueLoading = false,
        inspectionsDueError = null,
        ...props
    } = testProps;

    const _state = {
        testTagLocationReducer: {
            ...defaultLocationState,
        },
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
            <WithRouter>
                <InspectionsDue
                    actions={actions}
                    inspectionsDue={inspectionsDue}
                    inspectionsDueLoading={inspectionsDueLoading}
                    inspectionsDueError={inspectionsDueError}
                    {...props}
                />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('InspectionsDue', () => {
    it('renders component', async () => {
        const loadSitesFn = jest.fn();
        const getInspectionsDueFn = jest.fn();
        const { getByText, getByTestId, getAllByRole } = setup({
            actions: { loadSites: loadSitesFn, getInspectionsDue: getInspectionsDueFn },
        });

        expect(loadSitesFn).toHaveBeenCalled();
        expect(getInspectionsDueFn).toHaveBeenCalledWith({ period: config.defaults.monthsPeriod, periodType: 'month' });
        expect(getByText('Asset tests due report for Library')).toBeInTheDocument();
        expect(getByTestId('location_picker-inspections-due-site')).toBeInTheDocument();
        expect(getByTestId('location_picker-inspections-due-site-input')).toHaveAttribute('value', 'All sites');
        expect(getByTestId('location_picker-inspections-due-building')).toBeInTheDocument();
        expect(getByTestId('location_picker-inspections-due-building-input')).toHaveAttribute('value', 'All buildings');
        expect(getByTestId('location_picker-inspections-due-floor')).toBeInTheDocument();
        expect(getByTestId('location_picker-inspections-due-floor-input')).toHaveAttribute('value', 'All floors');
        expect(getByTestId('location_picker-inspections-due-room')).toBeInTheDocument();
        expect(getByTestId('location_picker-inspections-due-room-input')).toHaveAttribute('value', 'All rooms');
        expect(getByTestId('months_selector-inspections-due-select')).toHaveTextContent(
            `${config.defaults.monthsPeriod} months`,
        );
        expect(getByTestId('months_selector-inspections-due-next-date-label')).toHaveTextContent(
            'Including assets up to 30 September 2017',
        );
        expect(getByTestId('data_table-inspections-due')).toBeInTheDocument();

        // check first row is as expected
        const row = within(getAllByRole('row')[1]);
        expect(row.getByText('UQL000007')).toBeInTheDocument();
        expect(row.getByText('Power Cord - C5')).toBeInTheDocument();

        // expect a red cell with alert icon
        expect(row.getAllByRole('cell')[2]).toHaveStyle('background-color: #951126');
        expect(row.getByText('2010-04-25')).toBeInTheDocument();
        expect(row.getByTestId('tooltip-overdue')).toBeInTheDocument();

        expect(row.getByText('2022-10-25')).toBeInTheDocument();
        expect(row.getByText('4-L412')).toBeInTheDocument();

        // check pagination counter shows expected number of rows
        expect(getByText('1–10 of 10')).toBeInTheDocument();
    });

    it('fires action when filter site and date range change', async () => {
        const loadSitesFn = jest.fn();
        const getInspectionsDueFn = jest.fn();
        const { getByText, getByTestId, getByRole } = setup({
            actions: { loadSites: loadSitesFn, getInspectionsDue: getInspectionsDueFn },
        });
        expect(loadSitesFn).toHaveBeenCalled();
        expect(getInspectionsDueFn).toHaveBeenCalledWith({ period: config.defaults.monthsPeriod, periodType: 'month' });
        expect(getByText('Asset tests due report for Library')).toBeInTheDocument();

        // select site
        await userEvent.click(getByTestId('location_picker-inspections-due-site-input'));

        await userEvent.selectOptions(getByRole('listbox'), 'St Lucia');
        await waitFor(() =>
            expect(getInspectionsDueFn).toHaveBeenLastCalledWith({
                locationId: 1,
                locationType: 'site',
                period: '3',
                periodType: 'month',
            }),
        );

        // change date range
        await userEvent.click(getByTestId('months_selector-inspections-due-select'));
        await userEvent.selectOptions(
            getByRole('listbox'),
            document.querySelector('#months_selector-inspections-due-option-1'),
        );
        await waitFor(() =>
            expect(getInspectionsDueFn).toHaveBeenLastCalledWith({
                locationId: 1,
                locationType: 'site',
                period: '6',
                periodType: 'month',
            }),
        );
        expect(getByTestId('months_selector-inspections-due-select')).toHaveTextContent('6 months');
        expect(getByTestId('months_selector-inspections-due-next-date-label')).toHaveTextContent(
            'Including assets up to 30 December 2017',
        );
    });

    it('fires action when filter building changes', async () => {
        const loadSitesFn = jest.fn();
        const getInspectionsDueFn = jest.fn();
        const clearFloorsFn = jest.fn();
        const { getByText, getByTestId, getByRole } = setup({
            state: { testTagLocationReducer: { ...defaultLocationState, siteListLoaded: true, floorListLoaded: true } },
            actions: { loadSites: loadSitesFn, getInspectionsDue: getInspectionsDueFn, clearFloors: clearFloorsFn },
        });
        expect(loadSitesFn).toHaveBeenCalled();
        expect(getInspectionsDueFn).toHaveBeenCalledWith({ period: config.defaults.monthsPeriod, periodType: 'month' });
        expect(getByText('Asset tests due report for Library')).toBeInTheDocument();

        // select site
        await userEvent.click(getByTestId('location_picker-inspections-due-site-input'));
        await userEvent.selectOptions(getByRole('listbox'), 'St Lucia');

        // select building
        await userEvent.click(getByTestId('location_picker-inspections-due-building-input'));
        await userEvent.selectOptions(getByRole('listbox'), '0001 - Forgan Smith Building');

        await waitFor(() =>
            expect(getInspectionsDueFn).toHaveBeenLastCalledWith({
                locationId: 1,
                locationType: 'building',
                period: '3',
                periodType: 'month',
            }),
        );
        expect(clearFloorsFn).toHaveBeenCalled();
    });

    it('fires action when filter floor changes', async () => {
        const loadSitesFn = jest.fn();
        const getInspectionsDueFn = jest.fn();
        const clearRoomsFn = jest.fn();
        const { getByText, getByTestId, getByRole } = setup({
            state: {
                testTagLocationReducer: {
                    ...defaultLocationState,
                    siteListLoaded: true,
                    floorListLoaded: true,
                    roomListLoaded: true,
                },
            },
            actions: { loadSites: loadSitesFn, getInspectionsDue: getInspectionsDueFn, clearRooms: clearRoomsFn },
        });
        expect(loadSitesFn).toHaveBeenCalled();
        expect(getInspectionsDueFn).toHaveBeenCalledWith({ period: config.defaults.monthsPeriod, periodType: 'month' });
        expect(getByText('Asset tests due report for Library')).toBeInTheDocument();

        // select site
        await userEvent.click(getByTestId('location_picker-inspections-due-site-input'));
        await userEvent.selectOptions(getByRole('listbox'), 'St Lucia');

        // select building
        await userEvent.click(getByTestId('location_picker-inspections-due-building-input'));
        await userEvent.selectOptions(getByRole('listbox'), '0001 - Forgan Smith Building');

        // select floor
        await userEvent.click(getByTestId('location_picker-inspections-due-floor-input'));
        await userEvent.selectOptions(getByRole('listbox'), '2');

        await waitFor(() =>
            expect(getInspectionsDueFn).toHaveBeenLastCalledWith({
                locationId: 1,
                locationType: 'floor',
                period: '3',
                periodType: 'month',
            }),
        );
        expect(clearRoomsFn).toHaveBeenCalled();
    });

    it('fires action when filter room changes', async () => {
        const loadSitesFn = jest.fn();
        const getInspectionsDueFn = jest.fn();
        const clearRoomsFn = jest.fn();
        const { getByText, getByTestId, getByRole } = setup({
            state: {
                testTagLocationReducer: {
                    ...defaultLocationState,
                    siteListLoaded: true,
                    floorListLoaded: true,
                    roomListLoaded: true,
                },
            },
            actions: { loadSites: loadSitesFn, getInspectionsDue: getInspectionsDueFn, clearRooms: clearRoomsFn },
        });
        expect(loadSitesFn).toHaveBeenCalled();
        expect(getInspectionsDueFn).toHaveBeenCalledWith({ period: config.defaults.monthsPeriod, periodType: 'month' });
        expect(getByText('Asset tests due report for Library')).toBeInTheDocument();

        // select site
        await userEvent.click(getByTestId('location_picker-inspections-due-site-input'));
        await userEvent.selectOptions(getByRole('listbox'), 'St Lucia');

        // select building
        await userEvent.click(getByTestId('location_picker-inspections-due-building-input'));
        await userEvent.selectOptions(getByRole('listbox'), '0001 - Forgan Smith Building');

        // select floor
        await userEvent.click(getByTestId('location_picker-inspections-due-floor-input'));
        await userEvent.selectOptions(getByRole('listbox'), '2');

        // select room
        await userEvent.click(getByTestId('location_picker-inspections-due-room-input'));
        await userEvent.selectOptions(getByRole('listbox'), 'W212');
        await waitFor(() =>
            expect(getInspectionsDueFn).toHaveBeenLastCalledWith({
                locationId: 1,
                locationType: 'room',
                period: '3',
                periodType: 'month',
            }),
        );
    }, 8000);

    describe('coverage', () => {
        it('shows alert if inspectionsDueError is set', async () => {
            const clearInspectionsDueErrorFn = jest.fn();

            const { getByTitle, getByTestId } = setup({
                actions: {
                    loadSites: jest.fn(),
                    getInspectionsDue: jest.fn(),
                    clearInspectionsDueError: clearInspectionsDueErrorFn,
                },
                inspectionsDueError: 'Test inspectionsDueError error',
            });
            expect(getByTestId('confirmation_alert-error-alert')).toHaveTextContent('Test inspectionsDueError error');
            userEvent.click(getByTitle('Close'));

            await waitForElementToBeRemoved(getByTestId('confirmation_alert-error-alert'));

            expect(clearInspectionsDueErrorFn).toHaveBeenCalled();
        });
    });
});
