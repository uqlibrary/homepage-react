export default {
    defaults: {
        monthsPeriod: '3',
    },
    fields: {
        // user_id: { fieldParams: { minWidth: 50, flex: 1 } },
        user_uid: { fieldParams: { minWidth: 120, flex: 1 } },
        user_name: { fieldParams: { minWidth: 120, flex: 1 } },
        user_licence_number: { fieldParams: { minWidth: 120, flex: 1 } },
        user_department: { fieldParams: { minWidth: 50 } },
        start_date: {
            fieldParams: {
                minWidth: 100,
                flex: 1,
            },
        },
        end_date: { fieldParams: { minWidth: 100, flex: 1 } },
        total_for_user: { fieldParams: { width: 100 } },
    },
};
