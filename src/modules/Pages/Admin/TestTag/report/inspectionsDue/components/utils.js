import { createLocationString } from '../../../helpers/helpers';

export const transformRow = row => {
    if (!!row.asset_location) return row;
    return row.map(line => ({
        ...line,
        asset_location: createLocationString({
            site: line.site_id_displayed,
            building: line.building_id_displayed,
            floor: line.floor_id_displayed,
            room: line.room_id_displayed,
        }),
    }));
};
