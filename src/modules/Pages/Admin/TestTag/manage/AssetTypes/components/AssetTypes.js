import React, { useReducer } from 'react';
import PropTypes from 'prop-types';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';

import DataTable from './../../../SharedComponents/DataTable/DataTable';
import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import AddToolbar from '../../../SharedComponents/DataTable/AddToolbar';
import UpdateDialog from '../../../SharedComponents/UpdateDialog/UpdateDialog';
import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';
import ActionDialogue from './ActionDialogue';

import { useConfirmationAlert } from '../../../helpers/hooks';
import { useDataTableColumns, useDataTableRow } from '../../../SharedComponents/DataTable/DataTableHooks';
import locale from '../../../testTag.locale';
import { PERMISSIONS } from '../../../config/auth';
import config from './config';
import { actionReducer, emptyActionState } from './utils';
import { breadcrumbs } from 'config/routes';

const componentId = 'asset-types';

const ManageAssetTypes = ({ actions, assetTypesList, assetTypesListLoading, assetTypesListError }) => {
    const pageLocale = locale.pages.manage.assetTypes;

    const [dialogueBusy, setDialogueBusy] = React.useState(false);
    const [isDeleteConfirmOpen, showDeleteConfirm, hideDeleteConfirm] = useConfirmationState();
    const [confirmID, setConfirmID] = React.useState(null);

    const onCloseConfirmationAlert = () => actions.clearAssetTypesError();
    const { confirmationAlert, openConfirmationAlert, closeConfirmationAlert } = useConfirmationAlert({
        duration: locale.config.alerts.timeout,
        onClose: onCloseConfirmationAlert,
        errorMessage: assetTypesListError,
        errorMessageFormatter: locale.config.alerts.error,
    });

    const [actionState, actionDispatch] = useReducer(actionReducer, { ...emptyActionState });

    const onRowEdit = ({ id, api }) => {
        const row = api.getRow(id);
        closeConfirmationAlert();
        actionDispatch({ type: 'edit', title: pageLocale.editAsset.title, row });
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
        actionTooltips: pageLocale.form.actionTooltips,
        handleEditClick: onRowEdit,
        handleDeleteClick: onRowDelete,
        actionDataFieldKeys: { valueKey: 'asset_type_name' },
    });

    const { row } = useDataTableRow(assetTypesList);

    React.useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.testntag.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.testntag.pathname);

        actions.loadAssetTypes().catch(error => {
            console.error(error);
            openConfirmationAlert(locale.config.alerts.error(pageLocale.snackbars.loadFailed), 'error');
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddClick = () => {
        closeConfirmationAlert();
        actionDispatch({ type: 'add', title: pageLocale.addAsset.title });
    };

    const onRowAdd = React.useCallback(data => {
        const payload = structuredClone(data);
        delete payload.asset_type_id;
        setDialogueBusy(true);
        actions
            .addAssetType(payload)
            .then(() => {
                actions
                    .loadAssetTypes()
                    .then(() => {
                        setDialogueBusy(false);
                        actionDispatch({ type: 'clear' });
                        openConfirmationAlert(locale.config.alerts.success(), 'success');
                    })
                    .catch(error => {
                        console.error(error);
                        openConfirmationAlert(locale.config.alerts.error(pageLocale.snackbars.loadFailed), 'error');
                    });
            })
            .catch(error => {
                console.error(error);
                openConfirmationAlert(locale.config.alerts.failed(pageLocale.snackbars.addFailed), 'error', false);
            })
            .finally(() => {
                setDialogueBusy(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRowUpdate = React.useCallback(data => {
        const id = data?.asset_type_id;
        setDialogueBusy(true);
        actions
            .saveAssetType(id, data)
            .then(() => {
                actions
                    .loadAssetTypes()
                    .then(() => {
                        setDialogueBusy(false);
                        actionDispatch({ type: 'clear' });
                        openConfirmationAlert(locale.config.alerts.success(), 'success');
                    })
                    .catch(error => {
                        console.error(error);
                        openConfirmationAlert(locale.config.alerts.error(pageLocale.snackbars.loadFailed), 'error');
                    });
            })
            .catch(error => {
                console.error(error);
                openConfirmationAlert(locale.config.alerts.failed(pageLocale.snackbars.updateFail), 'error');
            })
            .finally(() => {
                setDialogueBusy(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onActionDialogueCancel = React.useCallback(() => {
        setDialogueBusy(false);
        actionDispatch({ type: 'clear' });
    }, []);

    const onActionDialogueProceed = React.useCallback((oldTypeID, newTypeID) => {
        const payload = {
            old_asset_type_id: oldTypeID,
            new_asset_type_id: newTypeID,
        };
        setDialogueBusy(true);
        actions
            .deleteAndReassignAssetType(payload)
            .then(() => {
                actions
                    .loadAssetTypes()
                    .then(() => {
                        setDialogueBusy(false);
                        actionDispatch({ type: 'clear' });
                        openConfirmationAlert(locale.config.alerts.success(), 'success');
                    })
                    .catch(error => {
                        console.error(error);
                        openConfirmationAlert(locale.config.alerts.error(pageLocale.snackbars.loadFailed), 'error');
                    });
            })
            .catch(error => {
                console.error(error);
                openConfirmationAlert(locale.config.alerts.failed(pageLocale.snackbars.reallocateFailed), 'error');
            })
            .finally(() => {
                setDialogueBusy(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onDeleteEmptyAssetType = () => {
        setDialogueBusy(true);
        actions
            .deleteAssetType(confirmID)
            .then(() => {
                actions
                    .loadAssetTypes()
                    .then(() => {
                        setDialogueBusy(false);
                        actionDispatch({ type: 'clear' });
                        openConfirmationAlert(locale.config.alerts.success(), 'success');
                    })
                    .catch(error => {
                        console.error(error);
                        openConfirmationAlert(locale.config.alerts.error(pageLocale.snackbars.loadFailed), 'error');
                    });
            })
            .catch(error => {
                console.error(error);
                openConfirmationAlert(locale.config.alerts.failed(pageLocale.snackbars.deleteFailed), 'error');
            })
            .finally(() => {
                setDialogueBusy(false);
            });
    };

    const closeDialog = React.useCallback(() => {
        actionDispatch({ type: 'clear' });
    }, []);

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_inspect]}
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
            <Box sx={{ flexGrow: 1 }}>
                <StandardCard noHeader>
                    <UpdateDialog
                        title={actionState.title}
                        action="add"
                        id={componentId}
                        isOpen={actionState.isAdd}
                        locale={pageLocale.dialogAdd}
                        fields={config?.fields ?? /* istanbul ignore next */ []}
                        columns={pageLocale.form.columns}
                        row={actionState?.row}
                        onCancelAction={closeDialog}
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
                        fields={config?.fields ?? /* istanbul ignore next */ []}
                        columns={pageLocale.form.columns}
                        row={actionState?.row}
                        onCancelAction={closeDialog}
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
                        <Grid style={{ flex: 1 }}>
                            <DataTable
                                id={componentId}
                                rows={row}
                                density="standard"
                                columns={columns}
                                rowId="asset_type_id"
                                loading={assetTypesListLoading}
                                components={{ Toolbar: AddToolbar }}
                                disableVirtualization
                                componentsProps={{
                                    toolbar: {
                                        id: componentId,
                                        label: pageLocale.header.addButtonLabel,
                                        onClick: handleAddClick,
                                    },
                                }}
                                {...(config.sort ?? /* istanbul ignore next */ {})}
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
            </Box>
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
