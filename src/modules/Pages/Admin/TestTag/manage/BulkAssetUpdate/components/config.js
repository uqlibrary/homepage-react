export default {
    defaults: {},
    form: {
        fields: {
            asset_id: { fieldParams: { renderInTable: false, sortable: false } },
            asset_id_displayed: { fieldParams: { minWidth: 100, sortable: false } },
            asset_type_name: { fieldParams: { flex: 1, minWidth: 250, sortable: false } },
            asset_location: { fieldParams: { flex: 1, minWidth: 100, sortable: false } },
            asset_status: { fieldParams: { sortable: false } },
        },
    },
    filterDialog: {
        fields: {
            asset_id: { fieldParams: { renderInTable: false, sortable: false } },
            asset_barcode: { fieldParams: { minWidth: 100, sortable: false } },
            asset_type_name: { fieldParams: { flex: 1, minWidth: 250, sortable: false } },
            asset_location: { fieldParams: { flex: 1, minWidth: 300, sortable: false } },
            asset_status: { fieldParams: { minWidth: 150, sortable: false } },
        },
    },
};
