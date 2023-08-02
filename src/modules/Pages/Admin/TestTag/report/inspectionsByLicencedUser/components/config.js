export default {
    defaults: {
        monthsPeriod: '3',
    },
    sort: {
        defaultSortColumn: 'total_for_user',
        defaultSortDirection: 'desc',
    },
    fields: {
        user_uid: { fieldParams: { minWidth: 110 } },
        user_name: { fieldParams: { minWidth: 150, flex: 1 } },
        user_licence_number: { fieldParams: { minWidth: 200 } },
        start_date: {
            fieldParams: {
                minWidth: 150,
            },
        },
        end_date: { fieldParams: { minWidth: 150 } },
        total_for_user: { fieldParams: { minWidth: 180 } },
    },
};
