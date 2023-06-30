export const transformRow = row => {
    return row.map(line => ({
        ...line,
        can_admin: line?.privileges?.can_admin === 1 ? 'Yes' : 'No',
        can_inspect: line?.privileges?.can_inspect === 1 ? 'Yes' : 'No',
        can_alter: line?.privileges?.can_alter === 1 ? 'Yes' : 'No',
        can_see_reports: line?.privileges?.can_see_reports === 1 ? 'Yes' : 'No',
    }));
};

export const emptyActionState = { isAdd: false, isEdit: false, isDelete: false, title: '', row: {} };

export const transformUpdateRequest = request => {
    // delete request.previleges;
    delete request.inspectionCount;
    delete request.id;
    request.privileges.can_admin = request?.can_admin === 'Yes' ? 1 : 0;
    request.privileges.can_inspect = request?.can_inspect === 'Yes' ? 1 : 0;
    request.privileges.can_alter = request?.can_alter === 'Yes' ? 1 : 0;
    request.privileges.can_see_reports = request?.can_see_reports === 'Yes' ? 1 : 0;

    delete request.can_admin;
    delete request.can_inspect;
    delete request.can_alter;
    delete request.can_see_reports;

    console.log(request);
    // const newResponse = formatDateStrings(request, '00:00:00');
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
                // row: {
                //     device_id: 'auto',
                //     device_calibrated_date_last: moment().format(dateFormat),
                //     device_calibration_due_date: moment()
                //         .add(1, 'd')
                //         .format(dateFormat),
                // },
                title,
                props: { ...props },
            };
        case 'edit':
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
