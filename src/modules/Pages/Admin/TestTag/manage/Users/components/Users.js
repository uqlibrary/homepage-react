import React, { useReducer } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import DataTable from './../../../SharedComponents/DataTable/DataTable';
import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import AddToolbar from '../../../SharedComponents/DataTable/AddToolbar';
import UpdateDialog from '../../../SharedComponents/DataTable/UpdateDialog';
import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useDataTableColumns, useDataTableRow } from '../../../SharedComponents/DataTable/DataTableHooks';

import locale from '../../../testTag.locale';
import { PERMISSIONS } from '../../../config/auth';
import { transformRow, transformUpdateRequest, transformAddRequest, emptyActionState, actionReducer } from './utils';
import { useConfirmationAlert } from '../../../helpers/hooks';
import config from './config';

const componentId = 'user-management';

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

const Users = ({ actions, userListLoading, userList, userListError }) => {
    const pageLocale = locale.pages.manage.users;

    const { user } = useSelector(state => state.get?.('testTagUserReducer'));
    const userDepartment = user?.user_department ?? null;

    const [dialogueBusy, setDialogueBusy] = React.useState(false);
    const [actionState, actionDispatch] = useReducer(actionReducer, { ...emptyActionState });

    const onCloseConfirmationAlert = () => actions.clearUserListError();
    const { confirmationAlert, openConfirmationAlert, closeConfirmationAlert } = useConfirmationAlert({
        duration: locale.config.alerts.timeout,
        onClose: onCloseConfirmationAlert,
        errorMessage: userListError,
    });

    const classes = useStyles();

    const closeDialog = () => actionDispatch({ type: 'clear' });

    const onRowAdd = data => {
        setDialogueBusy(true);
        const request = structuredClone(data);
        const wrappedRequest = transformAddRequest(request, userDepartment);
        actions
            .addUser(wrappedRequest)
            .then(() => {
                closeDialog();
                openConfirmationAlert(pageLocale.alerts?.addSuccess, 'success');
                actions.loadUserList();
            })
            .catch(error => {
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
        const id = data.row.user_id;

        actions
            .deleteUser(id)
            .then(() => {
                closeDialog();
                openConfirmationAlert(pageLocale.alerts?.deleteSuccess, 'success');
                actions.loadUserList();
            })
            .catch(error => {
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
    const shouldDisableDelete = row => (row?.actions_count ?? 0) > 0;
    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        handleEditClick,
        handleDeleteClick,
        shouldDisableDelete,
        actionDataFieldKeys: { valueKey: 'user_uid' },
    });

    React.useEffect(() => {
        actions.loadUserList();
    }, [actions]);

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_admin]}
        >
            <StandardCard noHeader>
                <UpdateDialog
                    id={componentId}
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
                    id={componentId}
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
                                          id={`${componentId}-progress`}
                                          data-testid={`${componentId}-progress`}
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
                            id={componentId}
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
                                    id: componentId,
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
    userListError: PropTypes.string,
};

export default React.memo(Users);
