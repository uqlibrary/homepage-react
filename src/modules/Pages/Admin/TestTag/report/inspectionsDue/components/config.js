export default {
    defaults: {
        monthsPeriod: '3',
    },
    fields: {
        asset_barcode: { fieldParams: { minWidth: 100 } },
        asset_location: { fieldParams: { flex: 1, minWidth: 150 } },
        asset_type_name: { fieldParams: { flex: 1, minWidth: 250 } },
        asset_test_date: { fieldParams: {} },
        asset_next_test_due_date: { fieldParams: {} },
    },
};
