import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@material-ui/core/Grid';

import DataTable from './../../../SharedComponents/DataTable/DataTable';

import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import locale from '../../../testTag.locale';
import { PERMISSIONS } from '../../../config/auth';
import AddToolbar from '../../../SharedComponents/DataTable/AddToolbar';
import UpdateDialog from '../../../SharedComponents/DataTable/UpdateDialog';
import { transformRow, transformUpdateRequest, transformAddRequest, emptyActionState, actionReducer } from './utils';
// import ActionDialogue from './ActionDialogue';

import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useConfirmationState } from 'hooks';

import { useDataTableColumns, useDataTableRow } from '../../../SharedComponents/DataTable/DataTableHooks';
import config from './config';

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

const Users = ({ actions, userListLoading, userList }) => {
    const componentId = 'user-management';
    const componentIdLower = 'user_management';

    const pageLocale = locale.pages.manage.users;

    const [dialogueBusy, setDialogueBusy] = React.useState(false);
    const [actionState, actionDispatch] = useReducer(actionReducer, { ...emptyActionState });
    const [confirmationAlert, setConfirmationAlert] = React.useState({ message: '', visible: false });

    const classes = useStyles();

    const closeDialog = () => actionDispatch({ type: 'clear' });

    const closeConfirmationAlert = () => {
        setConfirmationAlert({ message: '', visible: false, type: confirmationAlert.type });
    };
    const openConfirmationAlert = (message, type) => {
        setConfirmationAlert({ message: message, visible: true, type: !!type ? type : 'info', autoHideDuration: 6000 });
    };

    const onRowAdd = data => {
        setDialogueBusy(true);
        const request = structuredClone(data);
        const wrappedRequest = transformAddRequest(request);
        actions
            .addUser(wrappedRequest)
            .then(() => {
                closeDialog();
                openConfirmationAlert(pageLocale.alerts?.addSuccess, 'success');
                actions.clearInspectionDevices();
            })
            .catch(error => {
                console.log(error);
                openConfirmationAlert(locale.config.alerts.error(error.message), 'error');
            })
            .finally(() => {
                setDialogueBusy(false);
            });
    };

    const onRowEdit = data => {
        setDialogueBusy(true);
        const request = structuredClone(data);
        const userID = request.user_id;
        const wrappedRequest = transformUpdateRequest(request);
        actions
            .updateUser(userID, wrappedRequest)
            .then(() => {
                openConfirmationAlert(locale.config.alerts.success(), 'success');
                actions.loadUserList();
                closeDialog();
            })
            .catch(error => {
                console.log('Error: ', error);
                openConfirmationAlert(locale.config.alerts.error(error.message), 'error');
            })
            .finally(() => {
                setDialogueBusy(false);
            });
    };

    const handleEditClick = ({ id, api }) => {
        const row = api.getRow(id);
        actionDispatch({
            type: 'edit',
            title: pageLocale.dialogEdit?.confirmationTitle,
            row,
        });
    };

    const handleDeleteClick = ({ id, api }) => {
        const row = api.getRow(id);
        actionDispatch({
            type: 'delete',
            row,
        });
    };

    const onRowDelete = data => {
        setDialogueBusy(true);
        const id = data.row.device_id;

        console.log('delete', id);

        actions
            .deleteUser(id)
            .then(() => {
                closeDialog();
                openConfirmationAlert(pageLocale.alerts?.deleteSuccess, 'success');
                actions.clearInspectionDevices();
            })
            .catch(error => {
                console.log(error);
                openConfirmationAlert(locale.config.alerts.error(error.message), 'error');
            })
            .finally(() => {
                setDialogueBusy(false);
            });
    };
    const handleAddClick = () => {
        actionDispatch({
            type: 'add',
            title: pageLocale.dialogAdd?.confirmationTitle,
        });
    };

    const { row } = useDataTableRow(userList, transformRow);
    const shouldDisableDelete = row => (row?.inspectionCount ?? 0) > 0;
    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        handleEditClick,
        handleDeleteClick,
        shouldDisableDelete,
        actionDataFieldKeys: { valueKey: 'user_id' },
    });

    React.useEffect(() => {
        actions.loadUserList();
    }, []);

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_admin]}
        >
            <StandardCard noHeader>
                <UpdateDialog
                    title={actionState.title}
                    action="add"
                    updateDialogueBoxId="addRow"
                    isOpen={actionState.isAdd}
                    locale={pageLocale?.dialogAdd}
                    fields={config.fields ?? []}
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
                    updateDialogueBoxId="editRow"
                    isOpen={actionState.isEdit}
                    locale={pageLocale?.dialogEdit}
                    fields={config?.fields ?? []}
                    columns={pageLocale.form.columns}
                    row={actionState?.row}
                    onCancelAction={closeDialog}
                    onAction={onRowEdit}
                    props={actionState?.props}
                    isBusy={dialogueBusy}
                />
                <ConfirmationBox
                    actionButtonColor="primary"
                    actionButtonVariant="contained"
                    cancelButtonColor="secondary"
                    confirmationBoxId={componentId}
                    onCancelAction={closeDialog}
                    onAction={onRowDelete}
                    isOpen={actionState.isDelete}
                    locale={
                        !dialogueBusy
                            ? pageLocale?.dialogDeleteConfirm
                            : {
                                  ...pageLocale?.dialogDeleteConfirm,
                                  confirmButtonLabel: (
                                      <CircularProgress
                                          color="inherit"
                                          size={25}
                                          id={`${componentIdLower}-progress`}
                                          data-testid={`${componentIdLower}-progress`}
                                      />
                                  ),
                              }
                    }
                    disableButtonsWhenBusy
                    isBusy={dialogueBusy}
                    noMinContentWidth
                    actionProps={{ row: actionState?.row, props: actionState?.props }}
                />
                <Grid container spacing={3}>
                    <Grid item padding={3} style={{ flex: 1 }}>
                        <DataTable
                            rows={row}
                            columns={columns}
                            rowId="user_id"
                            loading={userListLoading}
                            /* editRowsModel={editRowsModel}*/
                            components={{ Toolbar: AddToolbar }}
                            componentsProps={{
                                toolbar: {
                                    label: pageLocale.form.addButtonLabel,
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
                    autoHideDuration={confirmationAlert.autoHideDuration}
                />
            </StandardCard>
        </StandardAuthPage>
    );
};

Users.propTypes = {
    actions: PropTypes.object,
    userList: PropTypes.array,
    userListLoading: PropTypes.bool,
    assetTypesActionType: PropTypes.string,
    assetTypesListLoading: PropTypes.bool,
    assetTypesActionError: PropTypes.bool,
};

export default React.memo(Users);
