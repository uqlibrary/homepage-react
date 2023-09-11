import React, { useReducer } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import DataTable from './../../../SharedComponents/DataTable/DataTable';
import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import AddToolbar from '../../../SharedComponents/DataTable/AddToolbar';
import UpdateDialog from '../../../SharedComponents/UpdateDialog/UpdateDialog';
import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useDataTableColumns, useDataTableRow } from '../../../SharedComponents/DataTable/DataTableHooks';

import locale from '../../../testTag.locale';
import { PERMISSIONS } from '../../../config/auth';
import { transformRow, transformUpdateRequest, transformAddRequest, emptyActionState, actionReducer } from './utils';
import { useConfirmationAlert } from '../../../helpers/hooks';
import config from './configure';

const componentId = 'user-management';

const Users = ({ actions, userListLoading, userList, userListError }) => {
    const pageLocale = locale.pages.manage.users;

    const { user } = useSelector(state => state.get?.('testTagUserReducer'));
    const userDepartment = user?.user_department ?? /* istanbul ignore next */ null;
    const userUID = user?.user_uid ?? /* istanbul ignore next */ null;

    const [dialogueBusy, setDialogueBusy] = React.useState(false);
    const [actionState, actionDispatch] = useReducer(actionReducer, { ...emptyActionState });

    const onCloseConfirmationAlert = () => actions.clearUserListError();
    const { confirmationAlert, openConfirmationAlert, closeConfirmationAlert } = useConfirmationAlert({
        duration: locale.config.alerts.timeout,
        onClose: onCloseConfirmationAlert,
        errorMessage: userListError,
        errorMessageFormatter: locale.config.alerts.error,
    });
    const closeDialog = React.useCallback(() => {
        actionDispatch({ type: 'clear' });
    }, []);

    const onRowAdd = React.useCallback(
        data => {
            setDialogueBusy(true);
            const request = structuredClone(data);
            const wrappedRequest = transformAddRequest(request, userDepartment);
            actions
                .addUser(wrappedRequest)
                .then(() => {
                    closeDialog();
                    openConfirmationAlert(locale.config.alerts.success(), 'success');
                    actions.loadUserList();
                })
                .catch(error => {
                    console.error(error);
                    openConfirmationAlert(locale.config.alerts.error(pageLocale.snackbar.addFail), 'error');
                })
                .finally(() => {
                    setDialogueBusy(false);
                });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [userDepartment],
    );

    const onRowEdit = React.useCallback(data => {
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
                console.error(error);
                openConfirmationAlert(locale.config.alerts.error(pageLocale.snackbar.updateFail), 'error');
            })
            .finally(() => {
                setDialogueBusy(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEditClick = ({ id, api }) => {
        const row = api.getRow(id);
        row.isSelf = row?.user_uid === userUID;
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

    const onRowDelete = React.useCallback(data => {
        setDialogueBusy(true);
        const id = data.row.user_id;

        actions
            .deleteUser(id)
            .then(() => {
                closeDialog();
                openConfirmationAlert(locale.config.alerts.success(), 'success');
                actions.loadUserList();
            })
            .catch(error => {
                console.error(error);
                openConfirmationAlert(locale.config.alerts.error(pageLocale.snackbar.deleteFail), 'error');
            })
            .finally(() => {
                setDialogueBusy(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleAddClick = () => {
        actionDispatch({
            type: 'add',
            title: pageLocale.dialogAdd?.confirmationTitle,
        });
    };

    const { row } = useDataTableRow(userList, transformRow);
    const shouldDisableDelete = row => (row?.actions_count ?? 0) > 0 || userUID === row?.user_uid;
    // const shouldDisableEdit = row => userUID === row?.user_uid;
    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        handleEditClick,
        handleDeleteClick,
        shouldDisableDelete,
        // shouldDisableEdit,
        actionDataFieldKeys: { valueKey: 'user_uid' },
        actionTooltips: pageLocale.form.actionTooltips,
    });

    React.useEffect(() => {
        actions.loadUserList().catch(error => {
            console.error(error);
            openConfirmationAlert(locale.config.alerts.error(pageLocale.snackbar.loadFail), 'error');
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    fields={config.fields ?? /* istanbul ignore next */ []}
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
                    fields={config?.fields ?? /* istanbul ignore next */ []}
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
                            components={{ Toolbar: AddToolbar }}
                            componentsProps={{
                                toolbar: {
                                    label: pageLocale.form.addButtonLabel,
                                    onClick: handleAddClick,
                                    id: componentId,
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
