import React, { useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@material-ui/core/Grid';

import TextField from '@material-ui/core/TextField';

import DataTable from './../../../SharedComponents/DataTable/DataTable';
import RowMenuCell from './../../../SharedComponents/DataTable/RowMenuCell';

import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import locale from '../../../testTag.locale';
import { PERMISSIONS } from '../../../config/auth';
import AddToolbar from '../../../SharedComponents/DataTable/AddToolbar';
import UpdateDialog from '../../../SharedComponents/DataTable/UpdateDialog';
import ActionDialogue from './ActionDialogue';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    tableMarginTop: {
        marginTop: theme.spacing(0),
    },
    gridRoot: {
        border: 0,
    },
}));

const rows = [
    {
        asset_type_id: 1,
        asset_type_name: 'KEW 620-1',
        asset_type_class: 'A',
        asset_type_power_rating: '240V',
        asset_type: 'KEW',
        asset_type_notes: 'KEW Notes',
        asset_count: 10,
    },
    {
        asset_type_id: 2,
        asset_type_name: 'HEW 20-2',
        asset_type_class: 'A',
        asset_type_power_rating: '240V',
        asset_type: 'HEW',
        asset_type_notes: 'HEW Notes',
        asset_count: 22,
    },
];

const fieldConfig = {
    asset_type_id: {
        label: 'Id',
        fieldParams: { canEdit: false },
    },
    asset_type_name: {
        label: 'Asset Type Name',
        component: props => <TextField {...props} />,
        fieldParams: { canEdit: true, flex: 1 },
    },
    asset_type_class: {
        label: 'Class',
        component: props => <TextField {...props} />,
        fieldParams: { canEdit: true, flex: 1 },
    },
    asset_type_power_rating: {
        label: 'Power Rating',
        component: props => <TextField {...props} />,
        fieldParams: { canEdit: true, flex: 1 },
    },
    asset_type: {
        label: 'Type',
        component: props => <TextField {...props} />,
        fieldParams: { canEdit: true, flex: 1 },
    },
    asset_type_notes: {
        label: 'Notes',
        component: props => <TextField multiline minRows={3} {...props} />,
        fieldParams: { canEdit: true, flex: 1 },
    },
    asset_count: {
        label: 'Usage',
        fieldParams: { canEdit: false, shouldRender: false, flex: 1 },
    },
};

const getColumns = ({ onRowEdit, onRowDelete }) => {
    const actionsCell = {
        field: 'actions',
        headerName: 'Actions',
        renderCell: params => <RowMenuCell {...params} onRowEdit={onRowEdit} onRowDelete={onRowDelete} />,
        sortable: false,
        width: 100,
        headerAlign: 'center',
        filterable: false,
        align: 'center',
        disableColumnMenu: true,
        disableReorder: true,
        shouldRender: false,
    };

    const columns = [];
    const keys = Object.keys(fieldConfig);

    keys.forEach(key => {
        columns.push({
            field: key,
            headerName: fieldConfig[key].label,
            editable: false,
            sortable: false,
            ...fieldConfig[key].fieldParams,
        });
    });

    columns && columns.length > 0 && columns.push(actionsCell);
    return columns;
};

const ManageAssetTypes = ({ actions }) => {
    const pageLocale = locale.pages.assetTypeManagement;
    const classes = useStyles();
    const [therows] = React.useState(rows);
    const emptyActionState = { isAdd: false, isEdit: false, isDelete: false, rows: {}, row: {} };
    const actionReducer = (_, action) => {
        console.log('ACTION IS ', action);
        switch (action.type) {
            case 'add':
                return { isAdd: true, isEdit: false, isDelete: false, row: { asset_type_id: 'auto' } };
            case 'edit':
                return { isAdd: false, isEdit: true, isDelete: false, row: action.row };
            case 'clear':
                return { ...emptyActionState };
            case 'delete':
                return { isAdd: false, isEdit: false, isDelete: true, row: action.row };
            default:
                throw `Unknown action '${action.type}'`;
        }
    };
    const [actionState, actionDispatch] = useReducer(actionReducer, { ...emptyActionState });
    const handleAddClick = () => {
        actionDispatch({ type: 'add' });
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

    const onRowEdit = ({ id, api }) => {
        const row = api.getRow(id);
        console.log(row);
        actionDispatch({ type: 'edit', row });
        // const fields = api.getRowParams(id).columns;
        // console.log('On Row Edit', id, api, fields);
        // fields
        //     .filter(field => !!field.shouldRender === true)
        //     .map(field => {
        //         const fieldName = field.field;
        //         console.log(
        //             fieldName,
        //             field.canEdit,
        //             api.getRow(id)[field.field],
        //             !!fieldConfig[fieldName]?.component ? 'config component' : 'default component',
        //         );
        //     });
    };

    const onRowDelete = ({ id, api }) => {
        const row = api.getRow(id);
        actionDispatch({ type: 'delete', row });
    };

    const onRowAdd = data => {
        console.log('added', data);
        actionDispatch({ type: 'clear' });
    };

    const onRowUpdate = data => {
        console.log('udpated', data);
        actionDispatch({ type: 'clear' });
    };

    const onDeleteCancel = () => {
        actionDispatch({ type: 'clear' });
    };

    const columns = useMemo(() => getColumns({ data: rows, /* setEditRowsModel,*/ onRowEdit, onRowDelete }), []);

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_admin]}
        >
            <ActionDialogue
                data={therows}
                row={actionState.row}
                isOpen={actionState.isDelete}
                onCancel={onDeleteCancel}
                // onProceed={//onActionDialogueProceed}
            />
            <div className={classes.root}>
                <StandardCard noHeader>
                    <UpdateDialog
                        updateDialogueBoxId="addRow"
                        isOpen={actionState.isAdd}
                        confirmationTitle="Add New Asset Type"
                        cancelButtonLabel="Cancel"
                        confirmButtonLabel="Add"
                        fields={fieldConfig}
                        row={actionState?.row}
                        onCancelAction={() => actionDispatch({ type: 'clear' })}
                        onAction={onRowAdd}
                    />
                    <UpdateDialog
                        updateDialogueBoxId="editRow"
                        isOpen={actionState.isEdit}
                        confirmationTitle="Edit Asset Type"
                        cancelButtonLabel="Cancel"
                        confirmButtonLabel="Update"
                        fields={fieldConfig}
                        row={actionState?.row}
                        onCancelAction={() => actionDispatch({ type: 'clear' })}
                        onAction={onRowUpdate}
                    />

                    <Grid container spacing={3}>
                        <Grid item padding={3} style={{ flex: 1 }}>
                            <DataTable
                                rows={therows}
                                columns={columns}
                                rowId="asset_type_id"
                                /* editRowsModel={editRowsModel}*/
                                components={{ Toolbar: AddToolbar }}
                                componentsProps={{ toolbar: { label: 'Add it', onClick: handleAddClick } }}
                                loading={false}
                                classes={{ root: classes.gridRoot }}
                            />
                        </Grid>
                    </Grid>
                </StandardCard>
            </div>
        </StandardAuthPage>
    );
};

ManageAssetTypes.propTypes = {
    actions: PropTypes.object,
};

export default React.memo(ManageAssetTypes);
