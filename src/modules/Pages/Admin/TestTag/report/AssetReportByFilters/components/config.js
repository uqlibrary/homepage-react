export default {
    defaults: {
        status: null,
        building_id: null,
    },
    fields: {
        asset_barcode: { fieldParams: { minWidth: 120, flex: 1 } },
        building_name: { fieldParams: { minWidth: 120, flex: 1 } },
        building_site_id: { fieldParams: { minWidth: 120, flex: 1 } },
        building_id_displayed: { fieldParams: { minWidth: 50 } },
        building_current_flag: { fieldParams: { width: 100 } },
    },
};
