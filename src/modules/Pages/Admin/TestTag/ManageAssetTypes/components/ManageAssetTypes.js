import * as React from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import locale from '../../testTag.locale';

import RowMenuCell from './RowMenuCell';

const initialRows = [
    {
        asset_type_id: 1,
        asset_type_name: 'Power Cord - C13',
        asset_type_class: 'C',
        asset_type_power_rating: '123',
        asset_type: '',
        asset_type_notes: '',
        asset_count: 75,
    },
    {
        asset_type_id: 2,
        asset_type_name: 'Power Cord - C5',
        asset_type_class: '',
        asset_type_power_rating: '',
        asset_type: 'Cord',
        asset_type_notes: '',
        asset_count: 472,
    },
];
const columns = [
    { field: 'asset_type_id', headerName: 'ID', width: 50, editable: false, sortable: false },
    { field: 'asset_type_name', headerName: 'Name', width: 200, editable: true, sortable: false },
    { field: 'asset_type_class', headerName: 'Class', width: 100, editable: true, sortable: false },
    { field: 'asset_type_power_rating', headerName: 'Rating', width: 100, editable: true, sortable: false },
    { field: 'asset_type', headerName: 'Type', width: 150, editable: true, sortable: false },
    { field: 'asset_type_notes', headerName: 'Notes', width: 150, editable: true, sortable: false },
    { field: 'asset_count', headerName: 'Usage', width: 100, editable: false, sortable: false },
    {
        field: 'actions',
        headerName: 'Actions',
        renderCell: RowMenuCell,
        sortable: false,
        width: 100,
        headerAlign: 'center',
        filterable: false,
        align: 'center',
        disableColumnMenu: true,
        disableReorder: true,
    },
];
const EditToolbar = () => {
    // const { apiRef } = props;

    const handleClick = () => {
        // const id = 1;
        // apiRef.current.updateRows([{ id, isNew: true }]);
        // apiRef.current.setRowMode(id, 'edit');
        // // Wait for the grid to render with the new row
        // setTimeout(() => {
        //     apiRef.current.scrollToIndexes({
        //         rowIndex: apiRef.current.getRowsCount() - 1,
        //     });
        //     apiRef.current.setCellFocus(id, 'name');
        // }, 150);
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add record
            </Button>
        </GridToolbarContainer>
    );
};

EditToolbar.propTypes = {};

const ManageAssetTypes = () => {
    const [rows, setRows] = React.useState(initialRows);

    const handleRowEditStart = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleRowEditStop = (params, event) => {
        event.defaultMuiPrevented = true;
        // Set rows in here
        console.log(setRows);
    };

    return (
        <StandardPage title={locale.form.pageTitle}>
            <div style={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    editMode="row"
                    // disableColumnMenu
                    disableColumnSort
                    getRowId={row => row?.asset_type_id}
                    onRowEditStart={handleRowEditStart}
                    onRowEditStop={handleRowEditStop}
                    components={{
                        Toolbar: EditToolbar,
                    }}
                />
            </div>
        </StandardPage>
    );
};

export default React.memo(ManageAssetTypes);
