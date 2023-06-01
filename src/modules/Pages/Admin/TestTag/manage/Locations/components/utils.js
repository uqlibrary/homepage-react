import React from 'react';
import RowMenuCell from './../../../SharedComponents/DataTable/RowMenuCell';

export const createLocationString = ({ site, building, floor }) =>
    [site, building, floor].filter(item => !!item).join(' / ');

export const getColumns = ({ config, locale, selectedFilter, handleEditClick, handleDeleteClick }) => {
    const actionsCell = {
        field: 'actions',
        headerName: locale?.actions,
        renderCell: params => {
            return (
                <RowMenuCell
                    {...params}
                    handleEditClick={handleEditClick}
                    {...((params.row?.asset_count ?? 1) === 0 ? { handleDeleteClick: handleDeleteClick } : {})}
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
    const { type, row, selectedFilter, ...props } = action;
    console.log('actionReducer', type, props);
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
            return { isAdd: false, isEdit: false, isDelete: true, row, props: { ...props, selectedFilter } };
        case 'clear':
            return { ...emptyActionState };
        default:
            throw `Unknown action '${type}'`;
    }
};

export const transformAddRequest = ({ request, selectedFilter, location }) => {
    // add requests may have an id field (probably 'auto') that needs to be removed
    delete request[`${selectedFilter}_id`];

    // get location key names i.e. ['site','building','floor','room']
    const keys = Object.keys(location);

    // get current selected location index
    const index = keys.findIndex(key => key === selectedFilter);

    // index 0 (sites) doesnt have a preceding location, so just return the request
    if (index === 0) return request;

    // else grab the name of the previous location type i.e. if selectedFilter is 'room', this would return 'building'
    const prevKey = keys[index - 1];

    // build a new request by inserting a key:value in format e.g. 'room_floor_id: 1'
    return { ...request, [`${selectedFilter}_${prevKey}_id`]: location[prevKey] };
};

export const transformUpdateRequest = ({ request, selectedFilter, location }) => {
    // get location key names i.e. ['site','building','floor','room']
    const keys = Object.keys(location);

    // get current selected location index
    const index = keys.findIndex(key => key === selectedFilter);

    // index max (room) doesnt have any superseding locations, so just return the request
    if (index === keys.length - 1) return request;

    // else grab the name of the next location type i.e. if selectedFilter is 'building', this would return 'room'
    const nextKey = keys[index + 1];

    // now remove the array of next location data we got from the server e.g.
    // for sites, we also get a buildings:[] array (note plural), for buildings
    // we also get a rooms:[] array etc.
    // We dont need to send all of this stuff back to the server.
    delete request[`${nextKey}s`];

    return request;
};
