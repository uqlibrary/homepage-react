import React from 'react';

import moment from 'moment';

import RowMenuCell from './../../../SharedComponents/DataTable/RowMenuCell';
import locale from '../../../testTag.locale';
const dateFormat = locale.pages.manage.config.dateFormat;

export const getColumns = ({ config, locale, canManage = true, handleEditClick, handleDeleteClick }) => {
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

    columns && columns.length > 0 && canManage && columns.push(actionsCell);
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
                row: {
                    device_id: 'auto',
                    device_calibrated_date_last: moment().format(dateFormat),
                    device_calibration_due_date: moment()
                        .add(1, 'd')
                        .format(dateFormat),
                },
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

export const formatDateStrings = (row, suffix) => {
    const dateLastParts = row.device_calibrated_date_last.split(' ');
    const dateNextParts = row.device_calibration_due_date.split(' ');
    return {
        ...row,
        device_calibrated_date_last:
            dateLastParts.length > 1 ? row.device_calibrated_date_last : `${row.device_calibrated_date_last} ${suffix}`,
        device_calibration_due_date:
            dateNextParts.length > 1 ? row.device_calibration_due_date : `${row.device_calibration_due_date} ${suffix}`,
    };
};

export const transformAddRequest = (request, user) => {
    delete request.device_id;
    delete request.device_current_flag;

    const newResponse = { ...formatDateStrings(request, '00:00:00'), device_department: user.user_department };
    return newResponse;
};

export const transformUpdateRequest = request => {
    delete request.device_current_flag;

    const newResponse = formatDateStrings(request, '00:00:00');
    return newResponse;
};
