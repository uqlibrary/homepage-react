import { createLocationString } from '../../../helpers/helpers';

export const transformRow = row => {
    return row.map(line => {
        if (!!line?.asset_location) return line;
        return {
            ...line,
            asset_type_name: line?.asset_type?.asset_type_name ?? '',
            asset_location: !!line?.last_location
                ? createLocationString({
                      site: line.last_location.site_name,
                      building: line.last_location.building_name,
                      floor: line.last_location.floor_id_displayed,
                      room: line.last_location.room_id_displayed,
                  })
                : '',
        };
    });
};

export const transformRequest = formValues => {
    if (!!formValues.hasDiscardStatus) {
        formValues.hasLocation = false;
        formValues.hasAssetType = false;
    } else {
        formValues.hasDiscardStatus = false;
    }
    return {
        asset: formValues.asset_list.reduce((cumulative, current) => [...cumulative, current.asset_id], []),
        ...(!!formValues.hasLocation ? { asset_room_id_last_seen: formValues.location.room } : {}),
        ...(!!formValues.hasAssetType ? { asset_type_id: formValues.asset_type.asset_type_id } : {}),
        ...(!!formValues.hasDiscardStatus ? { is_discarding: 1, discard_reason: formValues.discard_reason } : {}),
    };
};

export const transformFilterRow = row => {
    return row.map(line => {
        if (!!line?.asset_id_displayed) return line;
        return {
            ...line,
            asset_id_displayed: line?.asset_barcode ?? '',
            asset_location: createLocationString({
                site: line.site_name,
                building: line.building_name,
                floor: line.floor_id_displayed,
                room: line.room_id_displayed,
            }),
        };
    });
};
