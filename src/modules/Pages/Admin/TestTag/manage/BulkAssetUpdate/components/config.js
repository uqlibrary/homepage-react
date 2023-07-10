export default {
    defaults: {},
    form: {
        fields: {
            asset_id: { fieldParams: { renderInTable: false } },
            asset_id_displayed: { fieldParams: { minWidth: 100 } },
            asset_type_name: { fieldParams: { flex: 1, minWidth: 250 } },
            asset_location: { fieldParams: { flex: 1, minWidth: 100 } },
            asset_status: { fieldParams: {} },
        },
    },
    filterDialog: {
        fields: {
            asset_id: { fieldParams: { renderInTable: false } },
            asset_barcode: { fieldParams: { minWidth: 100 } },
            asset_type_name: { fieldParams: { flex: 1, minWidth: 250 } },
            asset_location: { fieldParams: { flex: 1, minWidth: 100 } },
            asset_status: { fieldParams: {} },
        },
    },
};