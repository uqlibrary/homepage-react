import React from 'react';
import EventPanel from './EventPanel';
import { render, act, fireEvent, WithReduxStore, preview } from 'test-utils';
import Immutable from 'immutable';

import configData from '../../../../../../data/mock/data/testAndTag/testTagOnLoadInspection';
import locale from '../../testTag.locale.js';

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
        testTagOnLoadInspectionReducer: { inspectionConfig: configData, inspectionConfigLoading: false },
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
        const location = { site: -1, building: -1, floor: -1, room: -1 };
        const setLocation = jest.fn();
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));

        const setStateMock = jest.fn();
        const spyState = useState => [useState, setStateMock];
        jest.spyOn(React, 'useState').mockImplementationOnce(spyState);

        const { getByText, getByTestId } = setup({ actions, location, setLocation, handleChange });

        expect(getByText(locale.pages.inspect.form.event.title)).toBeInTheDocument();
        expect(setLocation).toHaveBeenCalledWith({ site: 1 });
        preview.debug();
        expect(getByTestId('event_panel-event-date')).toBeInTheDocument();
        expect(getByTestId('location_picker-event-panel-site')).toBeInTheDocument();
        expect(getByTestId('location_picker-event-panel-building')).toBeInTheDocument();
        expect(getByTestId('location_picker-event-panel-floor')).toBeInTheDocument();
        expect(getByTestId('location_picker-event-panel-room')).toBeInTheDocument();

        // test expander
        act(() => {
            fireEvent.click(getByTestId('event_panel-expand-button'));
        });
        expect(setStateMock).toHaveBeenCalledWith(false);
    });
    it('renders date in desired format', () => {
        const actions = {};
        const location = { site: -1, building: -1, floor: -1, room: -1 };
        const setLocation = jest.fn();
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));

        const { getByText, getByTestId } = setup({ actions, location, setLocation, handleChange });

        expect(getByText(locale.pages.inspect.form.event.title)).toBeInTheDocument();

        expect(getByTestId('event_panel-event-date-input')).toHaveAttribute('value', '01 December 2017');

        act(() => {
            fireEvent.click(getByTestId('event_panel-event-date-input'));
            fireEvent.change(getByTestId('event_panel-event-date-input'), { target: { value: '01 November 2017' } });
        });

        expect(getByTestId('event_panel-event-date-input')).toHaveAttribute('value', '01 November 2017');

        expect(handleChange).toHaveBeenCalledWith('action_date');
        expect(handleChange).toHaveBeenLastCalledWith('isManualDate');
    });

    it('shows location text in floor and room elements', () => {
        const actions = {};
        const location = { site: 1, building: 1, floor: 1, room: 1 };
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

        expect(getByTestId('location_picker-event-panel-floor-input')).toHaveAttribute('value', 'Test Floor');
        expect(getByTestId('location_picker-event-panel-room-input')).toHaveAttribute('value', 'Test Room');
    });

    it('shows error status on building id when hasInspection=true and location empty', () => {
        const actions = {};
        const location = { site: 1, building: -1, floor: -1, room: -1 };
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
        expect(getByTestId('location_picker-event-panel-building-input')).toHaveAttribute('aria-invalid', 'true');
    });

    it('shows error status on floor id when hasInspection=true and location empty', () => {
        const actions = {};
        const location = { site: 1, building: 1, floor: -1, room: -1 };
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
        expect(getByTestId('location_picker-event-panel-floor-input')).toHaveAttribute('aria-invalid', 'true');
    });

    it('shows error status on room id when hasInspection=true and location empty', () => {
        const actions = {};
        const location = { site: 1, building: 1, floor: 1, room: -1 };
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
        expect(getByTestId('location_picker-event-panel-room-input')).toHaveAttribute('aria-invalid', 'true');
    });

    it('shows loading spinners', async () => {
        const actions = {};
        const location = { site: -1, building: -1, floor: -1, room: -1 };
        const setLocation = jest.fn();
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));

        const { getByTestId } = setup({
            actions,
            location,
            setLocation,
            handleChange,
            state: {
                testTagOnLoadInspectionReducer: { inspectionConfig: {}, inspectionConfigLoading: true },
                testTagLocationReducer: { floorList: [], floorListLoading: true, roomList: [], roomListLoading: true },
            },
        });
        expect(getByTestId('location_picker-event-panel-building-progress')).toBeInTheDocument();
        expect(getByTestId('location_picker-event-panel-floor-progress')).toBeInTheDocument();
        expect(getByTestId('location_picker-event-panel-room-progress')).toBeInTheDocument();
    });

    it('should handle defaults (coverage)', () => {
        const actions = {};
        const location = { site: -1, building: -1, floor: -1, room: -1 };
        const setLocation = jest.fn();
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));

        const setStateMock = jest.fn();
        const spyState = useState => [useState, setStateMock];
        jest.spyOn(React, 'useState').mockImplementationOnce(spyState);
        const testConfig = structuredClone(configData); // deep copy

        testConfig.sites.forEach(site => {
            delete site.site_id_displayed;
            delete site.site_name;
        });

        const { getByText, queryByText } = setup({
            state: {
                testTagOnLoadInspectionReducer: { inspectionConfig: testConfig, inspectionConfigLoading: false },
            },
            actions,
            location,
            setLocation,
            handleChange,
        });

        expect(getByText(locale.pages.inspect.form.event.title)).toBeInTheDocument();
        expect(setLocation).toHaveBeenCalledWith({ site: 1 });
        configData.sites.forEach(site => {
            expect(queryByText(site.site_id_displayed)).not.toBeInTheDocument();
            expect(queryByText(site.site_name)).not.toBeInTheDocument();
        });
    });
});
