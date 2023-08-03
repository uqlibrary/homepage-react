export default {
    defaults: {
        assetStatus: null,
        locationType: 'building',
        locationId: null,
        inspectionDateFrom: null,
        inspectionDateTo: null,
    },
    sort: {
        defaultSortColumn: 'asset_barcode',
    },
    fields: {
        asset_barcode: { fieldParams: { minWidth: 120 } },
        building_name: { fieldParams: { minWidth: 180, flex: 1 } },
        asset_type_name: { fieldParams: { minWidth: 180, flex: 1 } },
        asset_test_date: { fieldParams: { minWidth: 180 } },
        asset_next_test_due_date: { fieldParams: { minWidth: 180 } },
        asset_status: { fieldParams: { width: 140 } },
    },
};
