import { useMemo } from 'react';

export const useLocationDisplayName = (location, sites, floors) => {
    const locationDisplayedAs = useMemo(
        () => {
            const value = {
                site: sites?.find(site => site.site_id === location.site)?.site_id_displayed,
                building: sites
                    ?.find(site => site.site_id === location.site)
                    ?.buildings?.find(building => building.building_id === location.building)?.building_id_displayed,
                floor: floors?.floors?.find(floor => floor.floor_id === location.floor)?.floor_id_displayed,
            };
            return value;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [location, sites, floors],
    );

    return { locationDisplayedAs };
};
