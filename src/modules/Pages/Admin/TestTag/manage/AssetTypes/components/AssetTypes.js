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

import ConfirmationAlert from './ConfirmationAlert';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';

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

const ManageAssetTypes = ({
    actions,
    assetTypesList,
    assetTypesListLoading,
    assetTypesActionType,
    assetTypesActionError,
}) => {
    const pageLocale = locale.pages.assetTypeManagement;
    const classes = useStyles();
    const [dialogueBusy, setDialogueBusy] = React.useState(false);
    const [isDeleteConfirmOpen, showDeleteConfirm, hideDeleteConfirm] = useConfirmationState();
    const [confirmID, setConfirmID] = React.useState(null);
    React.useEffect(() => {
        actions.loadAssetTypes();
    }, []);
    const emptyActionState = { isAdd: false, isEdit: false, isDelete: false, rows: {}, row: {} };
    const actionReducer = (_, action) => {
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

    const [confirmationAlert, setConfirmationAlert] = React.useState({ message: '', visible: false });

    const closeConfirmationAlert = () => {
        setConfirmationAlert({ message: '', visible: false, type: confirmationAlert.type });
    };
    const openConfirmationAlert = (message, type) => {
        console.log('Setting with message', message);
        setConfirmationAlert({ message: message, visible: true, type: !!type ? type : 'info' });
    };

    const handleAddClick = () => {
        closeConfirmationAlert();
        actionDispatch({ type: 'add' });
    };

    const onRowEdit = ({ id, api }) => {
        const row = api.getRow(id);
        closeConfirmationAlert();
        actionDispatch({ type: 'edit', row });
    };

    const onRowDelete = ({ id, api }) => {
        const row = api.getRow(id);
        closeConfirmationAlert();
        if (row.asset_count > 0) {
            actionDispatch({ type: 'delete', row });
        } else {
            setConfirmID(row.asset_type_id);
            showDeleteConfirm();
        }
    };

    const onRowAdd = data => {
        const Payload = data;
        delete Payload.asset_type_id;
        setDialogueBusy(true);
        actions.addAssetType(Payload).then(() => {
            actions.loadAssetTypes().then(() => {
                actionDispatch({ type: 'clear' });
                setDialogueBusy(false);
                openConfirmationAlert('Asset Type added successfully.', 'success');
            });
        });
    };

    const onRowUpdate = data => {
        setDialogueBusy(true);
        actions.saveAssetType(data).then(() => {
            actions.loadAssetTypes().then(() => {
                setDialogueBusy(false);
                actionDispatch({ type: 'clear' });
                openConfirmationAlert('Asset Type updated successfully.', 'success');
            });
        });
    };

    const onActionDialogueCancel = () => {
        setDialogueBusy(false);
        actionDispatch({ type: 'clear' });
    };

    const onActionDialogueProceed = (oldTypeID, newTypeID) => {
        const Payload = {
            old_asset_type_id: oldTypeID,
            new_asset_type_id: newTypeID,
        };
        setDialogueBusy(true);
        actions.deleteAndReassignAssetType(Payload).then(() => {
            actions.loadAssetTypes().then(() => {
                setDialogueBusy(false);
                openConfirmationAlert('Asset Type Deleted and reallocated.', 'success');
                actionDispatch({ type: 'clear' });
            });
        });
    };

    const onDeleteEmptyAssetType = () => {
        // actions.
    };

    const columns = useMemo(() => getColumns({ data: assetTypesList, /* setEditRowsModel,*/ onRowEdit, onRowDelete }), [
        assetTypesList,
    ]);
    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_admin]}
        >
            <ActionDialogue
                data={assetTypesList}
                row={actionState.row}
                isOpen={actionState.isDelete}
                onCancel={onActionDialogueCancel}
                onProceed={onActionDialogueProceed}
                isBusy={dialogueBusy}
            />
            <div className={classes.root}>
                <StandardCard noHeader>
                    <UpdateDialog
                        updateDialogueBoxId="addRow"
                        isOpen={actionState?.isAdd}
                        confirmationTitle={locale.pages.assetTypeManagement.addAsset.title}
                        cancelButtonLabel={locale.pages.assetTypeManagement.addAsset.cancelButtonLabel}
                        confirmButtonLabel={locale.pages.assetTypeManagement.addAsset.confirmButtonLabel}
                        fields={fieldConfig}
                        row={actionState?.row}
                        isBusy={dialogueBusy}
                        onCancelAction={() => actionDispatch({ type: 'clear' })}
                        onAction={onRowAdd}
                    />
                    <UpdateDialog
                        updateDialogueBoxId="editRow"
                        isOpen={actionState?.isEdit}
                        confirmationTitle={locale.pages.assetTypeManagement.editAsset.title}
                        cancelButtonLabel={locale.pages.assetTypeManagement.editAsset.cancelButtonLabel}
                        confirmButtonLabel={locale.pages.assetTypeManagement.editAsset.confirmButtonLabel}
                        fields={fieldConfig}
                        row={actionState?.row}
                        onCancelAction={() => actionDispatch({ type: 'clear' })}
                        onAction={onRowUpdate}
                        isBusy={dialogueBusy}
                    />
                    <ConfirmationBox
                        actionButtonColor="primary"
                        actionButtonVariant="contained"
                        cancelButtonColor="secondary"
                        confirmationBoxId="testTag-network-error"
                        onAction={onDeleteEmptyAssetType}
                        onClose={hideDeleteConfirm}
                        isOpen={isDeleteConfirmOpen}
                        locale={locale.pages.assetTypeManagement.deleteConfirm}
                        noMinContentWidth
                    />

                    <Grid container spacing={3}>
                        <Grid item padding={3} style={{ flex: 1 }}>
                            <DataTable
                                rows={assetTypesList}
                                columns={columns}
                                rowId="asset_type_id"
                                loading={assetTypesListLoading}
                                /* editRowsModel={editRowsModel}*/
                                components={{ Toolbar: AddToolbar }}
                                componentsProps={{
                                    toolbar: {
                                        label: locale.pages.assetTypeManagement.header.addButtonLabel,
                                        onClick: handleAddClick,
                                    },
                                }}
                                classes={{ root: classes.gridRoot }}
                            />
                        </Grid>
                    </Grid>
                    <ConfirmationAlert
                        isOpen={confirmationAlert.visible}
                        message={confirmationAlert.message}
                        type={confirmationAlert.type}
                        closeAlert={closeConfirmationAlert}
                    />
                </StandardCard>
            </div>
        </StandardAuthPage>
    );
};

ManageAssetTypes.propTypes = {
    actions: PropTypes.object,
    assetTypesList: PropTypes.array,
    assetTypesActionType: PropTypes.string,
    assetTypesListLoading: PropTypes.bool,
    assetTypesActionError: PropTypes.bool,
};

export default React.memo(ManageAssetTypes);
