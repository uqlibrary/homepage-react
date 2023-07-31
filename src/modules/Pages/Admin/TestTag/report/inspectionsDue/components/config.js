export default {
    defaults: {
        monthsPeriod: '3',
    },
    sort: {
        defaultSortColumn: 'asset_barcode',
    },
    fields: {
        asset_barcode: { fieldParams: { minWidth: 130 } },
        asset_location: { fieldParams: { flex: 1, minWidth: 150 } },
        asset_type_name: { fieldParams: { flex: 1, minWidth: 200 } },
        asset_test_date: { fieldParams: { minWidth: 150 } },
        asset_next_test_due_date: { fieldParams: { minWidth: 150 } },
    },
};
