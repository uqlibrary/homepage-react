import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import LocationPicker from './LocationPicker';

import locale from './location.locale';

const AutoLocationPicker = ({ hasAllOption, location, ...props }) => {
    const {
        siteList,
        siteListLoading,
        // siteListError,
        // buildingList,
        // buildingListLoading,
        // buildingListError,
        floorList,
        floorListLoading,
        // floorListError,
        roomList,
        roomListLoading,
        // roomListError,
    } = useSelector(state => state.get?.('testTagLocationReducer'));

    const fullSiteList = React.useMemo(
        () =>
            !!hasAllOption ? [{ site_id: -1, site_id_displayed: locale.site.labelAll }, ...(siteList ?? [])] : siteList,
        [hasAllOption, siteList],
    );

    const buildingList = siteList?.find(site => site.site_id === location.site)?.buildings ?? [];
    console.log(roomList, location);
    const fullBuildingList = !!hasAllOption
        ? [{ building_id: -1, building_id_displayed: locale.building.labelAll }, ...buildingList]
        : buildingList;

    const fullFloorList = React.useMemo(
        () =>
            !!hasAllOption
                ? [{ floor_id: -1, floor_id_displayed: locale.floor.labelAll }, ...(floorList?.floors ?? [])]
                : floorList,
        [floorList, hasAllOption],
    );

    const fullRoomList = React.useMemo(
        () =>
            !!hasAllOption
                ? [{ room_id: -1, room_id_displayed: locale.room.labelAll }, ...(roomList?.rooms ?? [])]
                : roomList,
        [roomList, hasAllOption],
    );

    return (
        <LocationPicker
            siteList={fullSiteList}
            siteListLoading={siteListLoading}
            buildingList={fullBuildingList}
            buildingListLoading={siteListLoading}
            floorList={fullFloorList}
            floorListLoading={floorListLoading}
            roomList={fullRoomList}
            roomListLoading={roomListLoading}
            location={location}
            {...props}
        />
    );
};

AutoLocationPicker.propTypes = {
    location: PropTypes.object.isRequired,
    hasAllOption: PropTypes.bool,
};

export default React.memo(AutoLocationPicker);
