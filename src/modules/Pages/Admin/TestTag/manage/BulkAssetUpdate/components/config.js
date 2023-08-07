export default {
    defaults: {},
    form: {
        sort: {
            defaultSortColumn: 'asset_id_displayed',
        },
        fields: {
            asset_id: { fieldParams: { renderInTable: false } },
            asset_id_displayed: { fieldParams: { minWidth: 120 } },
            asset_type_name: { fieldParams: { flex: 1, minWidth: 140 } },
            asset_location: { fieldParams: { minWidth: 200, flex: 1 } },
            asset_status: { fieldParams: { sortable: false } },
        },
    },
    filterDialog: {
        sort: {
            defaultSortColumn: 'asset_barcode',
        },
        fields: {
            asset_id: { fieldParams: { renderInTable: false } },
            asset_barcode: { fieldParams: { minWidth: 120 } },
            asset_type_name: { fieldParams: { flex: 1, minWidth: 150 } },
            inspect_comment: { fieldParams: { minWidth: 100, flex: 1 } },
            asset_location: { fieldParams: { flex: 1, minWidth: 200 } },
            asset_status: { fieldParams: { minWidth: 150 } },
        },
    },
};
