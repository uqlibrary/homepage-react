import React from 'react';
import EventPanel from './EventPanel';
import { render, act, fireEvent, WithReduxStore } from 'test-utils';
import Immutable from 'immutable';

import configData from '../../../../../data/mock/data/testing/testTagOnLoad';

import locale from '../testTag.locale.js';

function setup(testProps = {}) {
    const { state = {}, actionDate = '2017-12-01 00:00', classes = {}, ...props } = testProps;
    const floorList = [
        {
            floor_id: 1,
            floor_id_displayed: '2',
        },
        {
            floor_id: 2,
            floor_id_displayed: '3',
        },
    ];
    const roomList = [
        {
            room_id: 10,
            room_description: 'Learning & Study',
            room_id_displayed: 'W334',
        },
        {
            room_id: 11,
            room_description: 'Library Facilities',
            room_id_displayed: 'W335',
        },
        {
            room_id: 12,
            room_description: 'Library Facilities',
            room_id_displayed: 'W341',
        },
    ];
    const _state = {
        testTagOnLoadReducer: { initConfig: configData, initConfigLoading: false },
        testTagLocationReducer: { floorList, floorListLoading: false, roomList, roomListLoading: false },
        ...state,
    };
    return render(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <EventPanel actionDate={actionDate} classes={classes} {...props} />
        </WithReduxStore>,
    );
}

describe('EventPanel', () => {
    it('renders component', () => {
        const actions = {};
        const location = { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 };
        const setLocation = jest.fn();
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));

        const setStateMock = jest.fn();
        const spyState = useState => [useState, setStateMock];
        jest.spyOn(React, 'useState').mockImplementationOnce(spyState);

        const { getByText, getByTestId } = setup({ actions, location, setLocation, handleChange });

        expect(getByText(locale.form.event.title)).toBeInTheDocument();
        expect(setLocation).toHaveBeenCalledWith({ formSiteId: 1 });
        expect(getByTestId('testntag-form-event-date')).toBeInTheDocument();
        expect(getByTestId('testntag-form-siteid')).toBeInTheDocument();
        expect(getByTestId('testntag-form-buildingid')).toBeInTheDocument();
        expect(getByTestId('testntag-form-floorid')).toBeInTheDocument();
        expect(getByTestId('testntag-form-roomid')).toBeInTheDocument();

        // test expander
        act(() => {
            fireEvent.click(getByTestId('testntagEventPanelExpander'));
        });
        expect(setStateMock).toHaveBeenCalledWith(false);
    });

    it('shows location text in floor and room elements', () => {
        const actions = {};
        const location = { formSiteId: 1, formBuildingId: 1, formFloorId: 1, formRoomId: 1 };
        const setLocation = jest.fn();
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));

        const { getByTestId } = setup({
            actions,
            location,
            setLocation,
            handleChange,
            state: {
                testTagLocationReducer: {
                    floorList: {
                        floors: [
                            {
                                floor_id: 1,
                                floor_id_displayed: 'Test Floor',
                            },
                        ],
                    },

                    floorListLoading: false,
                    roomList: {
                        rooms: [
                            {
                                room_id: 1,
                                room_id_displayed: 'Test Room',
                            },
                        ],
                    },
                    roomListLoading: false,
                },
            },
        });

        expect(getByTestId('testntag-form-floorid-input')).toHaveAttribute('value', 'Test Floor');
        expect(getByTestId('testntag-form-roomid-input')).toHaveAttribute('value', 'Test Room');
    });

    it('shows error status on building id when hasInspection=true and location empty', () => {
        const actions = {};
        const location = { formSiteId: 1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 };
        const setLocation = jest.fn();
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));

        const { getByTestId } = setup({
            actions,
            location,
            setLocation,
            handleChange,
            hasInspection: true,
        });
        expect(getByTestId('testntag-form-buildingid-input')).toHaveAttribute('aria-invalid', 'true');
    });

    it('shows error status on floor id when hasInspection=true and location empty', () => {
        const actions = {};
        const location = { formSiteId: 1, formBuildingId: 1, formFloorId: -1, formRoomId: -1 };
        const setLocation = jest.fn();
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));

        const { getByTestId } = setup({
            actions,
            location,
            setLocation,
            handleChange,
            hasInspection: true,
        });
        expect(getByTestId('testntag-form-floorid-input')).toHaveAttribute('aria-invalid', 'true');
    });

    it('shows error status on room id when hasInspection=true and location empty', () => {
        const actions = {};
        const location = { formSiteId: 1, formBuildingId: 1, formFloorId: 1, formRoomId: -1 };
        const setLocation = jest.fn();
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));

        const { getByTestId } = setup({
            actions,
            location,
            setLocation,
            handleChange,
            hasInspection: true,
        });
        expect(getByTestId('testntag-form-roomid-input')).toHaveAttribute('aria-invalid', 'true');
    });

    it('shows loading spinners', async () => {
        const actions = {};
        const location = { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 };
        const setLocation = jest.fn();
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));

        const { getByTestId } = setup({
            actions,
            location,
            setLocation,
            handleChange,
            state: {
                testTagOnLoadReducer: { initConfig: {}, initConfigLoading: true },
                testTagLocationReducer: { floorList: [], floorListLoading: true, roomList: [], roomListLoading: true },
            },
        });
        expect(getByTestId('buildingSpinner')).toBeInTheDocument();
        expect(getByTestId('floorSpinner')).toBeInTheDocument();
        expect(getByTestId('roomSpinner')).toBeInTheDocument();
    });

    it('should handle defaults (coverage)', () => {
        const actions = {};
        const location = { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 };
        const setLocation = jest.fn();
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));

        const setStateMock = jest.fn();
        const spyState = useState => [useState, setStateMock];
        jest.spyOn(React, 'useState').mockImplementationOnce(spyState);
        const testConfig = JSON.parse(JSON.stringify(configData)); // deep copy

        testConfig.sites.forEach(site => {
            delete site.site_id_displayed;
            delete site.site_name;
        });

        const { getByText, queryByText } = setup({
            state: {
                testTagOnLoadReducer: { initConfig: testConfig, initConfigLoading: false },
            },
            actions,
            location,
            setLocation,
            handleChange,
        });

        expect(getByText(locale.form.event.title)).toBeInTheDocument();
        expect(setLocation).toHaveBeenCalledWith({ formSiteId: 1 });
        configData.sites.forEach(site => {
            expect(queryByText(site.site_id_displayed)).not.toBeInTheDocument();
            expect(queryByText(site.site_name)).not.toBeInTheDocument();
        });
    });
});
