export const transformRow = row => {
    return row.map(line => ({
        ...line,
        can_admin_cb: line?.privileges?.can_admin === 1,
        can_inspect_cb: line?.privileges?.can_inspect === 1,
        can_alter_cb: line?.privileges?.can_alter === 1,
        can_see_reports_cb: line?.privileges?.can_see_reports === 1,
        user_current_flag_cb: line?.user_current_flag === 1,
        can_admin: line?.privileges?.can_admin === 1 ? 'Yes' : 'No',
        can_inspect: line?.privileges?.can_inspect === 1 ? 'Yes' : 'No',
        can_alter: line?.privileges?.can_alter === 1 ? 'Yes' : 'No',
        can_see_reports: line?.privileges?.can_see_reports === 1 ? 'Yes' : 'No',
        user_current_flag: line?.user_current_flag === 1 ? 'Yes' : 'No',
    }));
};

export const emptyActionState = { isAdd: false, isEdit: false, isDelete: false, title: '', row: {} };

export const transformUpdateRequest = request => {
    // delete request.previleges;
    delete request.inspectionCount;
    delete request.id;
    request.privileges.can_admin = request?.can_admin_cb ? 1 : 0;
    request.privileges.can_inspect = request?.can_inspect_cb ? 1 : 0;
    request.privileges.can_alter = request?.can_alter_cb ? 1 : 0;
    request.privileges.can_see_reports = request?.can_see_reports_cb ? 1 : 0;

    request.user_current_flag = request?.user_current_flag_cb ? 1 : 0;

    delete request.can_admin;
    delete request.can_admin_cb;
    delete request.can_inspect;
    delete request.can_inspect_cb;
    delete request.can_alter;
    delete request.can_alter_cb;
    delete request.can_see_reports;
    delete request.can_see_reports_cb;

    return request;
};

export const transformAddRequest = request => {
    // delete request.previleges;
    console.log('REquest is ', request);
    delete request.inspectionCount;
    delete request.id;

    request.privileges.can_admin = request?.can_admin_cb ? 1 : 0;
    request.privileges.can_inspect = request?.can_inspect_cb ? 1 : 0;
    request.privileges.can_alter = request?.can_alter_cb ? 1 : 0;
    request.privileges.can_see_reports = request?.can_see_reports_cb ? 1 : 0;

    request.user_current_flag = request?.user_current_flag_cb ? 1 : 0;

    delete request.can_admin;
    delete request.can_admin_cb;
    delete request.can_inspect;
    delete request.can_inspect_cb;
    delete request.can_alter;
    delete request.can_alter_cb;
    delete request.can_see_reports;
    delete request.can_see_reports_cb;

    return request;
};

export const actionReducer = (_, action) => {
    const { type, row, title, ...props } = action;
    switch (type) {
        case 'add':
            return {
                isAdd: true,
                isEdit: false,
                isDelete: false,
                row: {
                    user_id: 'Auto',
                    user_uid: '',
                    user_name: '',
                    user_current_flag_cb: true,
                },
                title,
                props: { ...props },
            };
        case 'edit':
            console.log('Edit Row', row);
            return {
                isAdd: false,
                isEdit: true,
                isDelete: false,
                title,
                row: { ...row, id: row.user_id },
                // row,
                props: { ...props },
            };
        case 'delete':
            return { isAdd: false, isEdit: false, isDelete: true, title, row, props: { ...props } };
        case 'clear':
            return { ...emptyActionState };
        default:
            throw `Unknown action '${type}'`;
    }
};
