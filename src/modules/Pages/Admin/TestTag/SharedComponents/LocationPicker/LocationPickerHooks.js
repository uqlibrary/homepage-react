import { useState, useEffect } from 'react';
import { locationType } from './utils';

export const useLocation = (defaultSiteId = -1, defaultBuildingId = -1, defaultFloorId = -1, defaultRoomId = -1) => {
    const [location, _setLocation] = useState({
        [locationType.site]: defaultSiteId,
        [locationType.building]: defaultBuildingId,
        [locationType.floor]: defaultFloorId,
        [locationType.room]: defaultRoomId,
    });

    const setLocation = update => {
        _setLocation({ ...location, ...update });
    };

    return { location, setLocation };
};

export const useSelectLocation = ({ initial = locationType.site, location, setLocation, setRow, actions, store }) => {
    const [selectedLocation, setSelectedLocation] = useState(initial ?? locationType.site);
    const [lastSelectedLocation, setLastSelectedLocation] = useState(initial ?? locationType.site);
    const { siteList, siteListLoaded, floorList, floorListLoaded, roomList, roomListLoaded } = store;

    useEffect(() => {
        if (roomListLoaded) {
            if (location.room !== -1) {
                setLastSelectedLocation(locationType.room);
            } else {
                if (location.floor !== -1) {
                    setRow?.(roomList.rooms);
                    setLastSelectedLocation(locationType.floor);
                } else {
                    setLocation?.({ room: -1 });
                    actions?.clearRooms();
                    setLastSelectedLocation(locationType.building);
                }
            }
            setSelectedLocation(locationType.room);
        } else if (floorListLoaded) {
            if (location.building !== -1) {
                setRow?.(floorList.floors);
            } else {
                setRow?.(
                    siteList
                        ?.find(site => site.site_id === location.site)
                        ?.buildings?.find(building => building.building_id === location.building)?.floors ?? [],
                );
                setLocation?.({ floor: -1, room: -1 });
                actions?.clearFloors();
            }
            setSelectedLocation(locationType.floor);
            setLastSelectedLocation(locationType.building);
        } else if (siteListLoaded) {
            if (location.site !== -1) {
                setRow?.(siteList.find(site => site.site_id === location.site).buildings);
                setSelectedLocation(locationType.building);
                setLastSelectedLocation(locationType.site);
            } else {
                setRow?.(siteList);
                setLocation?.({ building: -1, floor: -1, room: -1 });
                setSelectedLocation(locationType.site);
            }
        } else actions?.loadSites();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        location.site,
        location.building,
        location.floor,
        location.room,
        siteListLoaded,
        floorListLoaded,
        roomListLoaded,
    ]);

    return { selectedLocation, lastSelectedLocation, setSelectedLocation, setLastSelectedLocation };
};
