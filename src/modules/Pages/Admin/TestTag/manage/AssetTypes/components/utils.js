export const emptyActionState = { isAdd: false, isEdit: false, isDelete: false, rows: {}, row: {}, title: '' };

export const actionReducer = (_, action) => {
    switch (action.type) {
        case 'add':
            return {
                title: action.title,
                isAdd: true,
                isEdit: false,
                isDelete: false,
                row: { asset_type_id: 'auto' },
            };
        case 'edit':
            return { title: action.title, isAdd: false, isEdit: true, isDelete: false, row: action.row };
        case 'clear':
            return { ...emptyActionState };
        case 'delete':
            return { isAdd: false, isEdit: false, isDelete: true, row: action.row };
        default:
            throw `Unknown action '${action.type}'`;
    }
};
