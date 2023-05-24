import * as React from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import PropTypes from 'prop-types';

import StandardAuthPage from '../../SharedComponents/StandardAuthPage/StandardAuthPage';
import locale from '../../testTag.locale';
import { PERMISSIONS } from '../../config/auth';

import RowMenuCell from './RowMenuCell';
import ActionDialogue from './ActionDialogue';

const convertToProperCase = str => {
    // Find the index of the last underscore
    const lastUnderscoreIndex = str.lastIndexOf('_');

    // Extract the substring after the last underscore
    const suffix = str.substring(lastUnderscoreIndex + 1);

    // Capitalize the first character of the suffix
    const capitalizedSuffix = suffix.charAt(0).toUpperCase() + suffix.slice(1);

    return capitalizedSuffix;
};
// const columns = [
//     { field: 'asset_type_id', headerName: 'ID', editable: false, sortable: false },
//     { field: 'asset_type_name', headerName: 'Name', editable: true, sortable: false },
//     { field: 'asset_type_class', headerName: 'Class', editable: true, sortable: false },
//     { field: 'asset_type_power_rating', headerName: 'Rating', editable: true, sortable: false },
//     { field: 'asset_type', headerName: 'Type', width: 150, sortable: false },
//     { field: 'asset_type_notes', headerName: 'Notes', editable: true, sortable: false },
//     { field: 'asset_count', headerName: 'Usage', editable: false, sortable: false },
//     {
//         field: 'actions',
//         headerName: 'Actions',
//         renderCell: RowMenuCell,
//         sortable: false,
//         width: 100,
//         headerAlign: 'center',
//         filterable: false,
//         align: 'center',
//         disableColumnMenu: true,
//         disableReorder: true,
//     },
// ];
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

const ManageAssetTypes = ({ actions, assetTypesList, assetTypesListLoading, assetTypesListError }) => {
    const [rows, setRows] = React.useState(assetTypesList);
    const [deletingRow, setDeletingRow] = React.useState(null);
    const [actionDialogueOpen, setActionDialogueOpen] = React.useState(false);
    const assetTypeManagementLocale = locale.pages.assetTypeManagement;

    const onRowSave = row => {
        console.log('On Row Save', row);
        actions.saveAssetType(row);
    };

    const onRowDelete = row => {
        console.log('Firing Row Delete', row);
        setDeletingRow(row);
        setActionDialogueOpen(true);
    };
    const getColumns = data => {
        const template = {
            editable: true,
            sortable: false,
        };
        const actionsCell = {
            field: 'actions',
            headerName: 'Actions',
            renderCell: params => <RowMenuCell {...params} onRowSave={onRowSave} onRowDelete={onRowDelete} />,
            sortable: false,
            width: 100,
            headerAlign: 'center',
            filterable: false,
            align: 'center',
            disableColumnMenu: true,
            disableReorder: true,
        };

        const editableFields = [
            'asset_type_name',
            'asset_type_class',
            'asset_type_power_rating',
            'asset_type',
            'asset_type_notes',
        ];

        const columns = [];
        const keys = Object.keys(data[0]);

        keys.forEach(key => {
            const fieldName = convertToProperCase(key);
            if (!editableFields.includes(key)) {
                columns.push({ field: key, headerName: fieldName, editable: false, sortable: false });
            } else {
                columns.push({ field: key, headerName: fieldName, ...template });
            }
        });

        columns && columns.length > 0 && columns.push(actionsCell);
        return columns;
    };

    const columns = assetTypesList.length > 0 ? getColumns(assetTypesList) : [];

    React.useEffect(() => {
        actions.loadAssetTypes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        setRows(assetTypesList);
        console.log('The asset type list is', assetTypesList);
    }, [assetTypesList]);

    // I believe these are only used when using double-click to edit mode.
    // In this case, I dont think they are used.
    // commenting out for now

    // const handleRowEditStart = (params, event) => {
    //     event.defaultMuiPrevented = true;
    // };

    // const handleRowEditStop = (params, event) => {
    //     event.defaultMuiPrevented = true;
    //     // Set rows in here
    //     console.log("Here's where I am SAVING");
    //     console.log(setRows);
    // };

    console.log('Rows are', rows);
    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={assetTypeManagementLocale}
            requiredPermissions={[PERMISSIONS.can_inspect]}
        >
            <ActionDialogue data={assetTypesList} row={deletingRow} isOpen={actionDialogueOpen} />
            <div style={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    editMode="row"
                    loading={assetTypesListLoading}
                    // disableColumnMenu
                    disableColumnSort
                    getRowId={row => row?.asset_type_id}
                    // onRowEditStart={handleRowEditStart}
                    // onRowEditStop={handleRowEditStop}
                    components={{
                        Toolbar: EditToolbar,
                    }}
                />
            </div>
        </StandardAuthPage>
    );
};

ManageAssetTypes.propTypes = {
    actions: PropTypes.any,
    assetTypesList: PropTypes.array,
    assetTypesListLoading: PropTypes.bool,
    assetTypesListError: PropTypes.bool,
};

export default React.memo(ManageAssetTypes);
