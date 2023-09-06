import { createLocationString } from '../../../helpers/helpers';

export const transformRow = row => {
    return row.map(line => {
        if (!!line.asset_location) return line;
        return {
            ...line,
            asset_location: createLocationString({
                site: line.site_name,
                building: line.building_name,
                floor: line.floor_id_displayed,
                room: line.room_id_displayed,
            }),
        };
    });
};
