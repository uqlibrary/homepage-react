import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@material-ui/core/Grid';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';

import DataTable from './../../../SharedComponents/DataTable/DataTable';
import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import AddToolbar from '../../../SharedComponents/DataTable/AddToolbar';
import UpdateDialog from '../../../SharedComponents/DataTable/UpdateDialog';
import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';
import ActionDialogue from './ActionDialogue';

import { useConfirmationAlert } from '../../../helpers/hooks';
import { useDataTableColumns, useDataTableRow } from '../../../SharedComponents/DataTable/DataTableHooks';
import locale from '../../../testTag.locale';
import { PERMISSIONS } from '../../../config/auth';
import config from './config';

const componentId = 'asset-types';

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

const ManageAssetTypes = ({ actions, assetTypesList, assetTypesListLoading, assetTypesListError }) => {
    const pageLocale = locale.pages.manage.assetTypes;

    const classes = useStyles();
    const [dialogueBusy, setDialogueBusy] = React.useState(false);
    const [isDeleteConfirmOpen, showDeleteConfirm, hideDeleteConfirm] = useConfirmationState();
    const [confirmID, setConfirmID] = React.useState(null);

    const onCloseConfirmationAlert = () => actions.clearAssetTypesError();
    const { confirmationAlert, openConfirmationAlert, closeConfirmationAlert } = useConfirmationAlert({
        duration: locale.config.alerts.timeout,
        onClose: onCloseConfirmationAlert,
        errorMessage: assetTypesListError,
    });

    const emptyActionState = { isAdd: false, isEdit: false, isDelete: false, rows: {}, row: {}, title: '' };

    const actionReducer = (_, action) => {
        switch (action.type) {
            case 'add':
                return {
                    title: 'Add Asset Type',
                    isAdd: true,
                    isEdit: false,
                    isDelete: false,
                    row: { asset_type_id: 'auto' },
                };
            case 'edit':
                return { title: 'Edit Asset Type', isAdd: false, isEdit: true, isDelete: false, row: action.row };
            case 'clear':
                return { ...emptyActionState };
            case 'delete':
                return { isAdd: false, isEdit: false, isDelete: true, row: action.row };
            default:
                throw `Unknown action '${action.type}'`;
        }
    };
    const [actionState, actionDispatch] = useReducer(actionReducer, { ...emptyActionState });

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

    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        handleEditClick: onRowEdit,
        handleDeleteClick: onRowDelete,
        actionDataFieldKeys: { valueKey: 'asset_type_name' },
    });

    const { row } = useDataTableRow(assetTypesList);

    React.useEffect(() => {
        actions.loadAssetTypes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddClick = () => {
        closeConfirmationAlert();
        actionDispatch({ type: 'add' });
    };

    const onRowAdd = data => {
        const Payload = data;
        delete Payload.asset_type_id;
        setDialogueBusy(true);
        actions
            .addAssetType(Payload)
            .then(() => {
                actions
                    .loadAssetTypes()
                    .then(() => {
                        setDialogueBusy(false);
                        actionDispatch({ type: 'clear' });
                        openConfirmationAlert(locale.config.alerts.success(), 'success', true);
                    })
                    .catch(error => {
                        openConfirmationAlert(locale.config.alerts.error(error.message), 'error', false);
                    });
            })
            .catch(error => {
                openConfirmationAlert(locale.config.alerts.failed(error.message), 'error', false);
            });
    };

    const onRowUpdate = data => {
        const Id = data?.asset_type_id;
        setDialogueBusy(true);
        actions
            .saveAssetType(Id, data)
            .then(() => {
                actions
                    .loadAssetTypes()
                    .then(() => {
                        setDialogueBusy(false);
                        actionDispatch({ type: 'clear' });
                        openConfirmationAlert(locale.config.alerts.success(), 'success', true);
                    })
                    .catch(error => {
                        openConfirmationAlert(locale.config.alerts.error(error.message), 'error', false);
                    });
            })
            .catch(error => {
                openConfirmationAlert(locale.config.alerts.failed(error.message), 'error', false);
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
        actions
            .deleteAndReassignAssetType(Payload)
            .then(() => {
                actions
                    .loadAssetTypes()
                    .then(() => {
                        setDialogueBusy(false);
                        actionDispatch({ type: 'clear' });
                        openConfirmationAlert(locale.config.alerts.success(), 'success', true);
                    })
                    .catch(error => {
                        openConfirmationAlert(locale.config.alerts.error(error.message), 'error', false);
                    });
            })
            .catch(error => {
                openConfirmationAlert(locale.config.alerts.failed(error.message), 'error', false);
            });
    };

    const onDeleteEmptyAssetType = () => {
        actions
            .deleteAssetType(confirmID)
            .then(() => {
                actions
                    .loadAssetTypes()
                    .then(() => {
                        setDialogueBusy(false);
                        actionDispatch({ type: 'clear' });
                        openConfirmationAlert(locale.config.alerts.success(), 'success', true);
                    })
                    .catch(error => {
                        openConfirmationAlert(locale.config.alerts.error(error.message), 'error', false);
                    });
            })
            .catch(error => {
                openConfirmationAlert(locale.config.alerts.failed(error.message), 'error', false);
            });
    };

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_admin]}
        >
            <ActionDialogue
                id={componentId}
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
                        title={actionState.title}
                        action="add"
                        id={componentId}
                        isOpen={actionState.isAdd}
                        locale={pageLocale.dialogAdd}
                        fields={config?.fields ?? []}
                        columns={pageLocale.form.columns}
                        row={actionState?.row}
                        onCancelAction={() => actionDispatch({ type: 'clear' })}
                        onAction={onRowAdd}
                        props={actionState?.props}
                        isBusy={dialogueBusy}
                    />
                    <UpdateDialog
                        title={actionState.title}
                        action="edit"
                        id={componentId}
                        isOpen={actionState.isEdit}
                        locale={pageLocale.dialogEdit}
                        fields={config?.fields ?? []}
                        columns={pageLocale.form.columns}
                        row={actionState?.row}
                        onCancelAction={() => actionDispatch({ type: 'clear' })}
                        onAction={onRowUpdate}
                        props={actionState?.props}
                        isBusy={dialogueBusy}
                    />

                    <ConfirmationBox
                        actionButtonColor="primary"
                        actionButtonVariant="contained"
                        cancelButtonColor="secondary"
                        confirmationBoxId={componentId}
                        onAction={onDeleteEmptyAssetType}
                        onClose={hideDeleteConfirm}
                        isOpen={isDeleteConfirmOpen}
                        locale={pageLocale.deleteConfirm}
                        noMinContentWidth
                    />

                    <Grid container spacing={3}>
                        <Grid item padding={3} style={{ flex: 1 }}>
                            <DataTable
                                id={componentId}
                                rows={row}
                                columns={columns}
                                rowId="asset_type_name"
                                loading={assetTypesListLoading}
                                /* editRowsModel={editRowsModel}*/
                                components={{ Toolbar: AddToolbar }}
                                componentsProps={{
                                    toolbar: {
                                        id: componentId,
                                        label: pageLocale.header.addButtonLabel,
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
                        autoHideDuration={confirmationAlert.autoHideDuration}
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
    assetTypesListError: PropTypes.string,
    assetTypesActionType: PropTypes.string,
    assetTypesListLoading: PropTypes.bool,
    assetTypesActionError: PropTypes.bool,
};

export default React.memo(ManageAssetTypes);
