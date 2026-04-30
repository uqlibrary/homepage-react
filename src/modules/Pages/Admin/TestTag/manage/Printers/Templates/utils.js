export const transformRow = row => {
    return row?.map(line => ({
        ...line,
        identifiers_str: line?.identifiers?.map(identifier => identifier.printer_template_identifier_value).join(', '),
        printer_template_current_flag_cb: line?.printer_template_current_flag === 1,
        printer_template_current_flag: line?.printer_template_current_flag === 1 ? 'Yes' : 'No',
    }));
};

export const emptyActionState = { isAdd: false, isEdit: false, isDelete: false, title: '', row: {} };

export const transformUpdateRequest = request => {
    request.printer_template_current_flag = request?.printer_template_current_flag_cb ? 1 : 0;
    delete request.created_at;
    delete request.printer_template_id;
    delete request.printer_template_current_flag_cb;
    delete request.printer_template_department;
    delete request.printer_template_slug;
    delete request.updated_at;
    return request;
};

export const transformAddRequest = request => {
    // Assign team Current flag.
    request.printer_template_current_flag = request?.printer_template_current_flag_cb ? 1 : 0;

    // clear data not required from UI for request.
    delete request.printer_template_current_flag_cb;

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
                    printer_template_name: '',
                    identifiers: [],
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
                row: { ...row, id: row.printer_template_id },
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

export const randomId = rows => Math.max(...(rows?.map?.(row => row.printer_template_var_id) ?? [0])) + 1;
export const getCleanVarName = name => {
    const varName = name;
    return varName?.replaceAll(/[\s{}]/g, '').toUpperCase() ?? '';
};
export const getUserVariablePlaceholder = name => `{{${name}}}`;
