import React from 'react';
import RowMenuCell from './../../../SharedComponents/DataTable/RowMenuCell';

export const createLocationString = ({ site, building, floor }) =>
    [site, building, floor].filter(item => !!item).join(' / ');

export const getColumns = ({ config, locale, selectedFilter, onRowEdit, onRowDelete }) => {
    const actionsCell = {
        field: 'actions',
        headerName: locale?.actions,
        renderCell: params => {
            return (
                <RowMenuCell
                    {...params}
                    onRowEdit={onRowEdit}
                    {...((params.row?.asset_count ?? 1) === 0 ? { onRowDelete: onRowDelete } : {})}
                />
            );
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
    const keys = Object.keys(config[selectedFilter].fields);

    keys.forEach(key => {
        !!(config[selectedFilter].fields[key]?.fieldParams.renderInTable ?? true) &&
            columns.push({
                field: key,
                headerName: locale?.[selectedFilter]?.[key].label,
                editable: false,
                sortable: false,
                ...config[selectedFilter].fields[key].fieldParams,
            });
    });

    columns && columns.length > 0 && columns.push(actionsCell);
    return columns;
};

export const emptyActionState = { isAdd: false, isEdit: false, isDelete: false, row: {} };
export const actionReducer = (_, action) => {
    console.log(action);
    const { type, row, selectedFilter, ...props } = action;
    switch (type) {
        case 'add':
            return {
                isAdd: true,
                isEdit: false,
                isDelete: false,
                row: { [`${selectedFilter}_id`]: 'auto' },
                props: { ...props },
            };
        case 'edit':
            return { isAdd: false, isEdit: true, isDelete: false, row, props: { ...props } };
        case 'delete':
            return { isAdd: false, isEdit: false, isDelete: true, row: action.row };
        case 'clear':
            return { ...emptyActionState };
        default:
            throw `Unknown action '${type}'`;
    }
};
