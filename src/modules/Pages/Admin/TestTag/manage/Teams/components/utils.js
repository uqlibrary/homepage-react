export const transformRow = row => {
    return row.map(line => ({
        ...line,
        team_current_flag_cb: line?.team_current_flag === 1,
        team_current_flag: line?.team_current_flag === 1 ? 'Yes' : 'No',
    }));
};

export const emptyActionState = { isAdd: false, isEdit: false, isDelete: false, title: '', row: {} };

export const transformUpdateRequest = request => {
    request.team_current_flag = request?.team_current_flag_cb ? 1 : 0;
    delete request.created_at;
    delete request.id;
    delete request.team_current_flag_cb;
    delete request.team_department;
    delete request.team_slug;
    delete request.updated_at;
    delete request.users_count;
    return request;
};

export const transformAddRequest = request => {
    // Assign team Current flag.
    request.team_current_flag = request?.team_current_flag_cb ? 1 : 0;

    // clear data not required from UI for request.
    delete request.team_current_flag_cb;

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
                    team_slug: '',
                    team_display_name: '',
                    team_current_flag_cb: true,
                },
                title,
                props: { ...props },
            };
        case 'edit':
            return {
                isAdd: false,
                isEdit: true,
                isDelete: false,
                title,
                row: { ...row, id: row.team_slug },
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
