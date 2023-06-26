import { createLocationString } from '../../../helpers/helpers';

export const transformRow = row => {
    console.log('>>ROW', row);
    return row.map(line => {
        if (!!line?.asset_location) return line;
        return {
            ...line,
            asset_type_name: line?.asset_type?.asset_type_name ?? '',
            asset_location: !!line?.last_location
                ? createLocationString({
                      site: line.last_location.site_id_displayed,
                      building: line.last_location.building_id_displayed,
                      floor: line.last_location.floor_id_displayed,
                      room: line.last_location.room_id_displayed,
                  })
                : '',
        };
    });
};

export const transformRequest = formValues => {
    return {
        asset: formValues.asset_list.reduce((cumulative, current) => [...cumulative, current.asset_id], []),
        ...(!!formValues.hasLocation ? { asset_room_id_last_seen: formValues.location.room } : {}),
        ...(!!formValues.hasAssetType ? { asset_type_id: formValues.asset_type.asset_type_id } : {}),
        ...(!!formValues.hasStatus ? { is_discarding: 1 } : {}),
    };
};
