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
        ...(!!formValues.monthRange && formValues.monthRange !== '-1'
            ? { month_range: parseInt(formValues.monthRange, 10) }
            : {}),
    };
};

export const transformFilterRow = row => {
    return row.map(line => {
        if (!!line?.asset_id_displayed) return line;
        return {
            ...line,
            asset_id_displayed: line?.asset_barcode ?? '',
        };
    });
};
