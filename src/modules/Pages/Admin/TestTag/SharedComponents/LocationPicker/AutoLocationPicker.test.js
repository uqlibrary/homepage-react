import React from 'react';
import AutoLocationPicker from './AutoLocationPicker';
import { render, act, fireEvent, WithReduxStore } from 'test-utils';
import Immutable from 'immutable';
import siteList from '../../../../../../data/mock/data/testAndTag/testTagSites';
import floorList from '../../../../../../data/mock/data/testAndTag/testTagFloors';
import roomList from '../../../../../../data/mock/data/testAndTag/testTagRooms';

const defaultState = {
    siteList,
    siteListLoading: false,
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
        testTagLocationReducer: defaultState,
        ...state,
    };

    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <AutoLocationPicker id={props.id} locale={defaultLocale} location={defaultLocation} {...props} />
        </WithReduxStore>,
    );
}

describe('AutoLocationPicker Renders component', () => {
    it('renders component without "all" option', () => {
        const { getByTestId, getByText, getByRole, queryByRole } = setup({
            id: 'testAutoLocationPicker',
        });

        expect(getByTestId('location_picker-testAutoLocationPicker-site')).toBeInTheDocument();
        expect(getByTestId('location_picker-testAutoLocationPicker-building')).toBeInTheDocument();
        expect(getByTestId('location_picker-testAutoLocationPicker-floor')).toBeInTheDocument();
        expect(getByTestId('location_picker-testAutoLocationPicker-room')).toBeInTheDocument();

        expect(getByText(defaultLocale.site.label)).toBeInTheDocument();
        expect(getByText(defaultLocale.building.label)).toBeInTheDocument();
        expect(getByText(defaultLocale.floor.label)).toBeInTheDocument();
        expect(getByText(defaultLocale.room.label)).toBeInTheDocument();

        act(() => {
            fireEvent.mouseDown(getByTestId('location_picker-testAutoLocationPicker-site-input'));
        });
        expect(getByRole('listbox')).not.toEqual(null);
        expect(queryByRole('option', { name: defaultLocale.site.labelAll })).toEqual(null);
    });

    it('renders component with "all" option', () => {
        const { getByTestId, getByText, getByRole } = setup({
            id: 'testAutoLocationPicker',
            hasAllOption: true,
        });

        expect(getByTestId('location_picker-testAutoLocationPicker-site')).toBeInTheDocument();
        expect(getByTestId('location_picker-testAutoLocationPicker-building')).toBeInTheDocument();
        expect(getByTestId('location_picker-testAutoLocationPicker-floor')).toBeInTheDocument();
        expect(getByTestId('location_picker-testAutoLocationPicker-room')).toBeInTheDocument();

        expect(getByText(defaultLocale.site.label)).toBeInTheDocument();
        expect(getByText(defaultLocale.building.label)).toBeInTheDocument();
        expect(getByText(defaultLocale.floor.label)).toBeInTheDocument();
        expect(getByText(defaultLocale.room.label)).toBeInTheDocument();

        act(() => {
            fireEvent.mouseDown(getByTestId('location_picker-testAutoLocationPicker-site-input'));
        });

        expect(getByRole('listbox')).not.toEqual(null);
        expect(getByRole('option', { name: defaultLocale.site.labelAll })).not.toEqual(null);
    });
});
