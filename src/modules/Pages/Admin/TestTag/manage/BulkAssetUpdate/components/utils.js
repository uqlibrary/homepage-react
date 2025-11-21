import { createLocationString } from '../../../helpers/helpers';
import { MAXEXCLUDEDMOREITEMS } from './config';

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
    if (!!formValues.hasLocation) {
        formValues.hasAssetType = false;
        formValues.hasDiscardStatus = false;
    } else if (!!formValues.hasAssetStatus) {
        formValues.hasAssetType = false;
        formValues.hasDiscardStatus = false;
    } else if (!!formValues.hasAssetType) {
        formValues.hasLocation = false;
        formValues.hasAssetStatus = false;
        formValues.hasDiscardStatus = false;
        formValues.monthRange = null;
    } else if (!!formValues.hasDiscardStatus) {
        formValues.hasLocation = false;
        formValues.hasAssetStatus = false;
        formValues.hasAssetType = false;
        formValues.monthRange = null;
    } else {
        formValues.hasLocation = false;
        formValues.hasAssetStatus = false;
        formValues.hasDiscardStatus = false;
        formValues.hasAssetType = false;
        formValues.monthRange = null;
    }

    return {
        asset: formValues.asset_list.reduce((cumulative, current) => [...cumulative, current.asset_id], []),
        ...(!!formValues.hasLocation ? { asset_room_id_last_seen: formValues.location.room } : {}),
        ...(!!formValues.hasAssetStatus ? { asset_status: formValues.asset_status.value } : {}),
        ...(!!formValues.hasAssetType ? { asset_type_id: formValues.asset_type.asset_type_id } : {}),
        ...(!!formValues.hasDiscardStatus ? { is_discarding: 1, discard_reason: formValues.discard_reason } : {}),
        ...(!!formValues.hasClearNotes ? { clear_comments: 1 } : {}),
        ...(!!formValues.monthRange && formValues.monthRange !== '-1' ? { month_range: formValues.monthRange } : {}),
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

export const makeAssetExcludedMessage = ({ excludedList, maxItems = MAXEXCLUDEDMOREITEMS }) => {
    const count = excludedList.data.length;
    let excludedListIds = excludedList.data.map(item => item.asset_id_displayed);
    let excludedListString = excludedListIds.join(count === 2 ? ' and ' : ', ');
    if (maxItems > 0 && count > maxItems) {
        excludedListIds = excludedListIds.slice(0, maxItems);
        excludedListString = `${excludedListIds.join(', ')} and ${count - excludedListIds.length} more`;
    }
    return `${excludedListString} will not be updated in this bulk operation.`;
};
