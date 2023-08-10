import React from 'react';
import LocationPicker from './LocationPicker';
import { render, act, fireEvent } from 'test-utils';
import siteList from '../../../../../../data/mock/data/testing/testTagSites';
import floorList from '../../../../../../data/mock/data/testing/testTagFloors';
import roomList from '../../../../../../data/mock/data/testing/testTagRooms';

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
    floorList,
    floorListLoading: false,
    roomList,
    roomListLoading: false,
};
const defaultLocale = {
    site: { label: 'Test site', labelAll: 'All test sites' },
    building: { label: 'Test building', labelAll: 'All test buildings' },
    floor: { label: 'Test floor', labelAll: 'All test floors' },
    room: { label: 'Test room', labelAll: 'All test rooms' },
};

const defaultLocation = { site: -1, building: -1, floor: -1, room: -1 };

function setup(testProps = {}, renderer = render) {
    const { state = {}, ...props } = testProps;

    const _state = {
        ...defaultState,
        ...state,
    };
    console.log(props);
    return renderer(<LocationPicker locale={defaultLocale} location={defaultLocation} {..._state} {...props} />);
}

describe('LocationPicker Renders component', () => {
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
