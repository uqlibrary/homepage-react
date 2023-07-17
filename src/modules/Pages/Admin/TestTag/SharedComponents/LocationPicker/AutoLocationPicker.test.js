import React from 'react';
import AutoLocationPicker from './AutoLocationPicker';
import locale from '../../testTag.locale';
import { render, act, fireEvent, WithReduxStore, waitFor, screen } from 'test-utils';
import Immutable from 'immutable';

const initialState = {
    testTagLocationReducer: {
        siteList: [
            {
                site_id: 1,
                site_id_displayed: '01',
                site_name: 'St Lucia',
                asset_count: 120,
                buildings: [
                    {
                        building_id: 1,
                        building_name: 'Forgan Smith Building',
                        building_id_displayed: '0001',
                        asset_count: 12,
                    },
                    {
                        building_id: 2,
                        building_name: 'Duhig Tower',
                        building_id_displayed: '0002',
                        asset_count: 0,
                    },
                ],
            },
            {
                site_id: 2,
                site_id_displayed: '29',
                site_name: 'Gatton',
                asset_count: 0,
                buildings: [
                    {
                        building_id: 8,
                        building_name: 'J.K. Murray Library',
                        building_id_displayed: '8102',
                        asset_count: 4,
                    },
                    {
                        building_id: 9,
                        building_name: 'Library Warehouse',
                        building_id_displayed: '8248',
                        asset_count: 0,
                    },
                ],
            },
        ],
        siteListLoading: false,
        siteListLoaded: true,
        siteListError: null,
        buildingList: null,
        buildingListLoading: false,
        buildingListLoaded: false,
        buildingListError: null,
        floorList: {
            building_id: 8,
            building_id_displayed: '8102',
            building_name: 'J.K. Murray Library',
            site_id: 2,
            site_id_displayed: '29',
            site_name: 'Gatton',
            floors: [
                {
                    floor_id: 29,
                    floor_id_displayed: '1',
                    asset_count: 1,
                },
                {
                    floor_id: 30,
                    floor_id_displayed: '2',
                    asset_count: 0,
                },
            ],
        },
        floorListLoading: false,
        floorListLoaded: true,
        floorListError: null,
        roomList: {
            floor_id: 29,
            floor_id_displayed: '1',
            building_id: 8,
            building_id_displayed: '8102',
            building_name: 'J.K. Murray Library',
            site_id: 2,
            site_id_displayed: '29',
            site_name: 'Gatton',
            rooms: [
                {
                    room_id: 476,
                    room_description: 'Library Facilities',
                    room_id_displayed: '101',
                    asset_count: 1,
                },
                {
                    room_id: 477,
                    room_description: 'Library Facilities',
                    room_id_displayed: '102',
                    asset_count: 1,
                },
                {
                    room_id: 478,
                    room_description: 'Library Facilities',
                    room_id_displayed: '112',
                    asset_count: 1,
                },
                {
                    room_id: 479,
                    room_description: 'Library Facilities',
                    room_id_displayed: '114',
                    asset_count: 1,
                },
                {
                    room_id: 480,
                    room_description: 'Library Facilities',
                    room_id_displayed: '115',
                    asset_count: 1,
                },
                {
                    room_id: 481,
                    room_description: 'Library Facilities',
                    room_id_displayed: '116',
                    asset_count: 1,
                },
                {
                    room_id: 482,
                    room_description: 'Library Facilities',
                    room_id_displayed: '117A',
                    asset_count: 1,
                },
                {
                    room_id: 483,
                    room_description: 'Learning & Study',
                    room_id_displayed: '118',
                    asset_count: 1,
                },
                {
                    room_id: 484,
                    room_description: 'Learning & Study',
                    room_id_displayed: '119',
                    asset_count: 1,
                },
                {
                    room_id: 485,
                    room_description: 'Library Facilities',
                    room_id_displayed: '121',
                    asset_count: 1,
                },
                {
                    room_id: 486,
                    room_description: 'Library Facilities',
                    room_id_displayed: '123',
                    asset_count: 1,
                },
                {
                    room_id: 487,
                    room_description: 'Library Facilities',
                    room_id_displayed: '124',
                    asset_count: 1,
                },
                {
                    room_id: 488,
                    room_description: 'Library Facilities',
                    room_id_displayed: '125',
                    asset_count: 1,
                },
                {
                    room_id: 489,
                    room_description: 'Library Facilities',
                    room_id_displayed: '127',
                    asset_count: 1,
                },
                {
                    room_id: 490,
                    room_description: 'Unassignable',
                    room_id_displayed: '127A',
                    asset_count: 1,
                },
                {
                    room_id: 491,
                    room_description: 'Learning & Study',
                    room_id_displayed: '128',
                    asset_count: 1,
                },
                {
                    room_id: 492,
                    room_description: 'Library Facilities',
                    room_id_displayed: '130',
                    asset_count: 1,
                },
                {
                    room_id: 493,
                    room_description: 'Unassignable',
                    room_id_displayed: '131',
                    asset_count: 1,
                },
                {
                    room_id: 494,
                    room_description: 'Learning & Study',
                    room_id_displayed: '141',
                    asset_count: 1,
                },
                {
                    room_id: 495,
                    room_description: 'Learning & Study',
                    room_id_displayed: '142',
                    asset_count: 1,
                },
                {
                    room_id: 496,
                    room_description: 'Library Facilities',
                    room_id_displayed: '143',
                    asset_count: 0,
                },
            ],
        },
        roomListLoading: false,
        roomListLoaded: true,
        roomListError: null,
    },
};

// import configData from '../../../../../../data/mock/data/testing/testTagOnLoadInspection';
// import assetData from '../../../../../../data/mock/data/testing/testTagAssets';
// import locale from '../../testTag.locale.js';

// const formValues = {
//     action_date: '2016-12-05 14:22',
//     asset_department_owned_by: 'UQL-WSS',
//     asset_id_displayed: 'UQL310000',
//     asset_type_id: 1,
//     discard_reason: undefined,
//     inspection_date_next: '2018-12-05 14:22',
//     inspection_device_id: 1,
//     inspection_fail_reason: undefined,
//     inspection_notes: '',
//     inspection_status: 'PASSED',
//     isDiscarded: false,
//     isRepair: false,
//     repairer_contact_details: undefined,
//     room_id: 1,
//     user_id: 3,
// };

// const currentRetestList = [
//     { value: '3', label: '3 months' },
//     { value: '6', label: '6 months' },
//     { value: '12', label: '1 year' },
//     { value: '60', label: '5 years' },
// ];

// const DEFAULT_NEXT_TEST_DATE_VALUE = 12;

function setup(testProps = {}) {
    const { state = {}, ...props } = testProps;

    const _state = {
        ...initialState,
        ...state,
    };
    return render(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <AutoLocationPicker id="jest" locale={locale.pages.general.locationPicker} {...props} />
        </WithReduxStore>,
    );
}

describe('AutoLocationPicker', () => {
    it('renders component', async () => {
        // const updateKey = 'inspection_date_next';
        // const newValue = '2017-12-05';
        // const handleChange = jest.fn(prop =>
        //     jest.fn(value => {
        //         expect(prop).toEqual(updateKey);
        //         expect(value.format('YYYY-MM-DD')).toEqual(newValue);
        //     }),
        // );
        const { getByTestId } = setup({ location: { site: 1 } });
        expect(getByTestId('location_picker-jest-site')).toBeInTheDocument();

        // screen.debug(undefined, 10000000);

        // expect(getByText(locale.pages.inspect.form.inspection.title)).toBeInTheDocument();
        // expect(getByTestId('inspection_panel-inspection-device')).toBeInTheDocument();
        // expect(getByTestId('inspection_panel-inspection-result-toggle-buttons')).toBeInTheDocument();
        // await waitFor(() => expect(handleChange).toHaveBeenCalledWith(updateKey));
    });
});
