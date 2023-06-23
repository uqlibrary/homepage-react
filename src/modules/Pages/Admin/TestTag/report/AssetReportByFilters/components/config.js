export default {
    defaults: {
        assetStatus: null,
        locationType: 'building',
        locationId: null,
        inspectionDateFrom: null,
        inspectionDateTo: null,
    },
    fields: {
        asset_barcode: { fieldParams: { minWidth: 80 } },
        building_name: { fieldParams: { minWidth: 80, flex: 1 } },
        asset_type: { fieldParams: { minWidth: 120 } },
        asset_test_date: { fieldParams: { minWidth: 140 } },
        asset_next_test_due_date: { fieldParams: { minWidth: 140 } },
        asset_status: { fieldParams: { width: 140 } },
    },
};
