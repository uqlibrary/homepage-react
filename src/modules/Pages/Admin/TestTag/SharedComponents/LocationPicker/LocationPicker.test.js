import React from 'react';
import LocationPicker, { GridWrapper, getBuildingLabel } from './LocationPicker';
import { render, rtlRender, act, fireEvent } from 'test-utils';
import siteList from '../../../../../../data/mock/data/testing/testAndTag/testTagSites';
import floorList from '../../../../../../data/mock/data/testing/testAndTag/testTagFloors';
import roomList from '../../../../../../data/mock/data/testing/testAndTag/testTagRooms';

const selectOptionFromListByIndex = (index, actions) => {
    expect(actions.getByRole('listbox')).not.toEqual(null);
    act(() => {
        const options = actions.getAllByRole('option');

        fireEvent.mouseDown(options[index]);
        options[index].click();
    });
};

const defaultState = {
    siteList,
    siteListLoading: false,
    buildingList: siteList[0].buildings,
    buildingListLoading: false,
    floorList: floorList[0].floors,
    floorListLoading: false,
    roomList: roomList[0].rooms,
    roomListLoading: false,
};
const defaultLocale = {
    site: { label: 'Test site', labelAll: 'All test sites' },
    building: { label: 'Test building', labelAll: 'All test buildings' },
    floor: { label: 'Test floor', labelAll: 'All test floors' },
    room: { label: 'Test room', labelAll: 'All test rooms' },
};

const defaultLocation = { site: -1, building: -1, floor: -1, room: -1 };

function setup(testProps = {}, renderer = rtlRender) {
    const { state = {}, ...props } = testProps;

    const _state = {
        ...defaultState,
        ...state,
    };
    return renderer(<LocationPicker locale={defaultLocale} location={defaultLocation} {..._state} {...props} />);
}

describe('LocationPicker Renders component', () => {
    it('fires expected functions when setting site', () => {
        const setLocationFn = jest.fn();
        const clearFloorsFn = jest.fn();
        const loadFloorsFn = jest.fn();
        const { getByTestId, getByText, getByRole, getAllByRole } = setup({
            id: 'testLocationPicker',
            actions: {
                clearFloors: clearFloorsFn,
                loadFloors: loadFloorsFn,
            },
            setLocation: setLocationFn,
        });

        expect(getByTestId('location_picker-testLocationPicker-site')).toBeInTheDocument();
        expect(getByTestId('location_picker-testLocationPicker-building')).toBeInTheDocument();
        expect(getByTestId('location_picker-testLocationPicker-floor')).toBeInTheDocument();
        expect(getByTestId('location_picker-testLocationPicker-room')).toBeInTheDocument();

        expect(getByText(defaultLocale.site.label)).toBeInTheDocument();
        expect(getByText(defaultLocale.building.label)).toBeInTheDocument();
        expect(getByText(defaultLocale.floor.label)).toBeInTheDocument();
        expect(getByText(defaultLocale.room.label)).toBeInTheDocument();

        act(() => {
            fireEvent.mouseDown(getByTestId('location_picker-testLocationPicker-site-input'));
        });

        selectOptionFromListByIndex(0, { getByRole, getAllByRole });
        expect(setLocationFn).toHaveBeenCalledWith({ ...defaultLocation, site: 1 });
        expect(clearFloorsFn).toHaveBeenCalled();
    });
    it('fires expected functions when setting building', () => {
        const setLocationFn = jest.fn();
        const clearFloorsFn = jest.fn();
        const loadFloorsFn = jest.fn();
        const { getByTestId, getByText, getByRole, getAllByRole } = setup({
            id: 'testLocationPicker',
            location: { ...defaultLocation, site: 1 },
            actions: {
                clearFloors: clearFloorsFn,
                loadFloors: loadFloorsFn,
            },
            setLocation: setLocationFn,
        });

        expect(getByTestId('location_picker-testLocationPicker-building')).toBeInTheDocument();
        expect(getByText(defaultLocale.building.label)).toBeInTheDocument();

        act(() => {
            fireEvent.mouseDown(getByTestId('location_picker-testLocationPicker-building-input'));
        });

        selectOptionFromListByIndex(0, { getByRole, getAllByRole });
        expect(setLocationFn).toHaveBeenCalledWith({ building: 1, floor: -1, room: -1 });
        expect(loadFloorsFn).toHaveBeenCalledWith(1);
        expect(clearFloorsFn).toHaveBeenCalled();
    });
    it('fires expected functions when setting floor', () => {
        const setLocationFn = jest.fn();
        const clearRoomsFn = jest.fn();
        const loadRoomsFn = jest.fn();
        const { getByTestId, getByText, getByRole, getAllByRole } = setup({
            id: 'testLocationPicker',
            location: { ...defaultLocation, site: 1, building: 1 },
            actions: {
                clearRooms: clearRoomsFn,
                loadRooms: loadRoomsFn,
            },
            setLocation: setLocationFn,
        });

        expect(getByTestId('location_picker-testLocationPicker-floor')).toBeInTheDocument();
        expect(getByText(defaultLocale.floor.label)).toBeInTheDocument();

        act(() => {
            fireEvent.mouseDown(getByTestId('location_picker-testLocationPicker-floor-input'));
        });

        selectOptionFromListByIndex(0, { getByRole, getAllByRole });
        expect(setLocationFn).toHaveBeenCalledWith({ floor: 1, room: -1 });
        expect(clearRoomsFn).toHaveBeenCalled();
        expect(loadRoomsFn).toHaveBeenCalledWith(1);
    });
    it('fires expected functions when setting room', () => {
        const setLocationFn = jest.fn();

        const { getByTestId, getByText, getByRole, getAllByRole } = setup({
            id: 'testLocationPicker',
            location: { ...defaultLocation, site: 1, building: 1, floor: 1 },
            setLocation: setLocationFn,
        });

        expect(getByTestId('location_picker-testLocationPicker-room')).toBeInTheDocument();
        expect(getByText(defaultLocale.room.label)).toBeInTheDocument();

        act(() => {
            fireEvent.mouseDown(getByTestId('location_picker-testLocationPicker-room-input'));
        });

        selectOptionFromListByIndex(0, { getByRole, getAllByRole });
        expect(setLocationFn).toHaveBeenCalledWith({ room: 1 }, true);
    });

    it('renders component without "all" option', () => {
        const { getByTestId, getByText, getByRole, queryByRole } = setup({
            id: 'testLocationPicker',
        });

        expect(getByTestId('location_picker-testLocationPicker-site')).toBeInTheDocument();
        expect(getByTestId('location_picker-testLocationPicker-building')).toBeInTheDocument();
        expect(getByTestId('location_picker-testLocationPicker-floor')).toBeInTheDocument();
        expect(getByTestId('location_picker-testLocationPicker-room')).toBeInTheDocument();

        expect(getByText(defaultLocale.site.label)).toBeInTheDocument();
        expect(getByText(defaultLocale.building.label)).toBeInTheDocument();
        expect(getByText(defaultLocale.floor.label)).toBeInTheDocument();
        expect(getByText(defaultLocale.room.label)).toBeInTheDocument();

        act(() => {
            fireEvent.mouseDown(getByTestId('location_picker-testLocationPicker-site-input'));
        });
        expect(getByRole('listbox')).not.toEqual(null);
        expect(queryByRole('option', { name: defaultLocale.site.labelAll })).toEqual(null);
    });

    it('correctly sets focus to Site when target is not disabled', () => {
        const focusTarget = 'site';
        const { getByTestId } = setup({
            id: 'testLocationPicker',
            autoFocus: true,
            focusTarget,
        });

        const id = `location_picker-testLocationPicker-${focusTarget}`;
        const expectedFocusEl = document.querySelector(`#${id}-input`);

        expect(getByTestId(id)).toBeInTheDocument();
        expect(document.activeElement).toBe(expectedFocusEl);
    });

    it('correctly sets focus to Building when target is not disabled', () => {
        const focusTarget = 'building';
        const { getByTestId } = setup({
            id: 'testLocationPicker',
            autoFocus: true,
            focusTarget,
            hide: ['site'],
        });

        const id = `location_picker-testLocationPicker-${focusTarget}`;
        const expectedFocusEl = document.querySelector(`#${id}-input`);

        expect(getByTestId(id)).toBeInTheDocument();
        expect(document.activeElement).toBe(expectedFocusEl);
    });

    it('correctly sets focus to floor when target is not disabled', () => {
        const focusTarget = 'floor';
        const { getByTestId } = setup({
            id: 'testLocationPicker',
            autoFocus: true,
            focusTarget,
            hide: ['building'],
        });

        const id = `location_picker-testLocationPicker-${focusTarget}`;
        const expectedFocusEl = document.querySelector(`#${id}-input`);

        expect(getByTestId(id)).toBeInTheDocument();
        expect(document.activeElement).toBe(expectedFocusEl);
    });

    it('correctly sets focus to room when target is not disabled', () => {
        const focusTarget = 'room';
        const { getByTestId } = setup({
            id: 'testLocationPicker',
            autoFocus: true,
            focusTarget,
            hide: ['floor'],
        });

        const id = `location_picker-testLocationPicker-${focusTarget}`;
        const expectedFocusEl = document.querySelector(`#${id}-input`);

        expect(getByTestId(id)).toBeInTheDocument();
        expect(document.activeElement).toBe(expectedFocusEl);
    });

    it('cant sets focus to Site when target has no options', () => {
        const focusTarget = 'site';
        const { getByTestId } = setup({
            id: 'testLocationPicker',
            autoFocus: true,
            focusTarget,
            state: {
                siteList: [],
            },
        });

        const id = `location_picker-testLocationPicker-${focusTarget}`;
        const expectedFocusEl = document.querySelector(`#${id}-input`);

        expect(getByTestId(id)).toBeInTheDocument();
        expect(document.activeElement).not.toBe(expectedFocusEl);
    });
    it('cant sets focus to building when target has no options', () => {
        const focusTarget = 'building';
        const { getByTestId } = setup({
            id: 'testLocationPicker',
            autoFocus: true,
            focusTarget,
            hide: ['site'],
            state: {
                buildingList: [],
            },
        });

        const id = `location_picker-testLocationPicker-${focusTarget}`;
        const expectedFocusEl = document.querySelector(`#${id}-input`);

        expect(getByTestId(id)).toBeInTheDocument();
        expect(document.activeElement).not.toBe(expectedFocusEl);
    });
    it('cant sets focus to floor when target has no options', () => {
        const focusTarget = 'floor';
        const { getByTestId } = setup({
            id: 'testLocationPicker',
            autoFocus: true,
            focusTarget,
            hide: ['building'],
            state: {
                floorList: [],
            },
        });

        const id = `location_picker-testLocationPicker-${focusTarget}`;
        const expectedFocusEl = document.querySelector(`#${id}-input`);

        expect(getByTestId(id)).toBeInTheDocument();
        expect(document.activeElement).not.toBe(expectedFocusEl);
    });
    it('cant sets focus to room when target has no options', () => {
        const focusTarget = 'room';
        const { getByTestId } = setup({
            id: 'testLocationPicker',
            autoFocus: true,
            focusTarget,
            hide: ['floor'],
            state: {
                roomList: [],
            },
        });

        const id = `location_picker-testLocationPicker-${focusTarget}`;
        const expectedFocusEl = document.querySelector(`#${id}-input`);

        expect(getByTestId(id)).toBeInTheDocument();
        expect(document.activeElement).not.toBe(expectedFocusEl);
    });

    it('disables building control', () => {
        const focusTarget = 'building';
        const { getByTestId } = setup({
            id: 'testLocationPicker',
            location: { ...defaultLocation, site: 1 },
            state: {
                siteList: undefined,
            },
        });

        const id = `location_picker-testLocationPicker-${focusTarget}`;

        expect(getByTestId(id)).toBeInTheDocument();
        expect(getByTestId(`${id}-input`)).toHaveAttribute('disabled');
    });
    it('disables floor control', () => {
        const focusTarget = 'floor';
        const { getByTestId } = setup({
            id: 'testLocationPicker',
            location: { ...defaultLocation, building: 1 },
            state: {
                floorListLoading: true,
            },
        });

        const id = `location_picker-testLocationPicker-${focusTarget}`;

        expect(getByTestId(id)).toBeInTheDocument();
        expect(getByTestId(`${id}-input`)).toHaveAttribute('disabled');
    });
    it('disables room control', () => {
        const focusTarget = 'room';
        const { getByTestId } = setup({
            id: 'testLocationPicker',
            autoFocus: true,
            focusTarget,
            location: { ...defaultLocation, floor: 1 },
            state: {
                roomListLoading: true,
            },
        });

        const id = `location_picker-testLocationPicker-${focusTarget}`;

        expect(getByTestId(id)).toBeInTheDocument();
        expect(getByTestId(`${id}-input`)).toHaveAttribute('disabled');
    });

    it('gets expected response from GridWrapper subcomponent', () => {
        const { getByText, rerender } = render(<GridWrapper withGrid={false}>content</GridWrapper>);

        expect(getByText('content')).toBeInTheDocument();
        expect(document.querySelectorAll('div').length).toBe(1);

        rerender(<GridWrapper>content</GridWrapper>);
        expect(document.querySelectorAll('div').length).toBe(2);

        rerender(<GridWrapper divisor={4}>content</GridWrapper>);
        expect(document.querySelectorAll('div').length).toBe(2);
        expect(document.querySelectorAll('div')[1]).toHaveClass('MuiGrid2-grid-md-3');

        rerender(<GridWrapper divisor={3}>content</GridWrapper>);
        expect(document.querySelectorAll('div')[1]).toHaveClass('MuiGrid2-grid-md-4');
    });

    it('gets expected values from getBuildingLabel', () => {
        const input1 = { building_id_displayed: '01', building_name: 'Test building' };
        expect(getBuildingLabel(input1)).toBe('01 - Test building');
        const input2 = { building_name: 'Test building' };
        expect(getBuildingLabel(input2)).toBe('Test building');
        const input3 = {};
        expect(getBuildingLabel(input3)).toBe('');
    });

    it('renders component with "all" option selected', () => {
        const state = {
            siteList: [{ site_id: -1, site_name: defaultLocale.site.labelAll }, ...siteList],
            siteListLoading: false,
            buildingList: [
                { building_id: -1, building_name: defaultLocale.building.labelAll },
                ...siteList[0].buildings,
            ],
            buildingListLoading: false,
            floorList: [{ floor_id: -1, floor_id_displayed: defaultLocale.floor.labelAll }, ...floorList[0].floors],
            floorListLoading: false,
            roomList: [{ room_id: -1, room_id_displayed: defaultLocale.room.labelAll }, ...roomList[0].rooms],
            roomListLoading: false,
        };
        const { getByTestId } = setup({
            id: 'testLocationPicker',
            state,
            hasAllOption: true,
        });

        expect(getByTestId('location_picker-testLocationPicker-site')).toBeInTheDocument();
        expect(getByTestId('location_picker-testLocationPicker-building')).toBeInTheDocument();
        expect(getByTestId('location_picker-testLocationPicker-floor')).toBeInTheDocument();
        expect(getByTestId('location_picker-testLocationPicker-room')).toBeInTheDocument();

        expect(getByTestId('location_picker-testLocationPicker-site-input')).toHaveAttribute(
            'value',
            defaultLocale.site.labelAll,
        );
        expect(getByTestId('location_picker-testLocationPicker-building-input')).toHaveAttribute(
            'value',
            defaultLocale.building.labelAll,
        );
        expect(getByTestId('location_picker-testLocationPicker-floor-input')).toHaveAttribute(
            'value',
            defaultLocale.floor.labelAll,
        );
        expect(getByTestId('location_picker-testLocationPicker-room-input')).toHaveAttribute(
            'value',
            defaultLocale.room.labelAll,
        );
    });
});
