import React from 'react';
import RowMenuCell from './../../../SharedComponents/DataTable/RowMenuCell';

export const getColumns = ({ config, locale, handleEditClick, handleDeleteClick }) => {
    const actionsCell = {
        field: 'actions',
        headerName: locale?.actions,
        renderCell: params => {
            return <RowMenuCell {...params} handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick} />;
        },
        sortable: false,
        width: 100,
        headerAlign: 'center',
        filterable: false,
        align: 'center',
        disableColumnMenu: true,
        disableReorder: true,
        renderInUpdate: false,
    };

    const columns = [];
    const keys = Object.keys(config.fields);

    keys.forEach(key => {
        !!(config.fields[key]?.fieldParams.renderInTable ?? true) &&
            columns.push({
                field: key,
                headerName: locale?.[key].label,
                editable: false,
                sortable: false,
                ...config.fields[key].fieldParams,
            });
    });

    columns && columns.length > 0 && columns.push(actionsCell);
    return columns;
};

export const emptyActionState = { isAdd: false, isEdit: false, isDelete: false, title: '', row: {} };
export const actionReducer = (_, action) => {
    const { type, row, title, ...props } = action;
    switch (type) {
        case 'add':
            return {
                isAdd: true,
                isEdit: false,
                isDelete: false,
                row: { device_id: 'auto' },
                title,
                props: { ...props },
            };
        case 'edit':
            return { isAdd: false, isEdit: true, isDelete: false, title, row, props: { ...props } };
        case 'delete':
            return { isAdd: false, isEdit: false, isDelete: true, title, row, props: { ...props } };
        case 'clear':
            return { ...emptyActionState };
        default:
            throw `Unknown action '${type}'`;
    }
};

export const transformAddRequest = ({ request }) => {
    delete request.device_id;
    delete request.device_current_flag;

    return request;
};

export const transformUpdateRequest = ({ request }) => {
    delete request.device_current_flag;

    return request;
};
