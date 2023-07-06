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
import { transformRow, transformUpdateRequest, emptyActionState, actionReducer } from './utils';
// import ActionDialogue from './ActionDialogue';

import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
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
    const pageLocale = locale.pages.manage.users;

    const [dialogueBusy, setDialogueBusy] = React.useState(false);
    const [actionState, actionDispatch] = useReducer(actionReducer, { ...emptyActionState });

    const classes = useStyles();

    const closeDialog = () => actionDispatch({ type: 'clear' });

    const onRowAdd = data => {
        setDialogueBusy(true);
        const request = structuredClone(data);
        const wrappedRequest = transformAddRequest(request, user);
        console.log('add', wrappedRequest);

        actions
            .addInspectionDevice(wrappedRequest)
            .then(() => {
                closeDialog();
                openConfirmationAlert(pageLocale.alerts?.addSuccess, 'success');
                actions.clearInspectionDevices();
            })
            .catch(error => {
                console.log(error);
                handleApiError({ message: pageLocale.alerts?.addFail });
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
        console.log('sending to the API', wrappedRequest);
        actions
            .updateUser(userID, wrappedRequest)
            .then(() => {
                closeDialog();
            })
            .catch(error => {
                console.log('Error: ', error);
            })
            .finally(() => {
                setDialogueBusy(false);
            });
        // actions
        //     .updateInspectionDevice(id, wrappedRequest)
        //     .then(() => {
        //         closeDialog();
        //         openConfirmationAlert(pageLocale.alerts?.updateSuccess, 'success');
        //         actions.clearInspectionDevices();
        //     })
        //     .catch(error => {
        //         console.log(error);
        //         handleApiError({ message: pageLocale.alerts?.updateFail });
        //     })
        //     .finally(() => {
        //         setDialogueBusy(false);
        //     });
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
            .deleteInspectionDevice(id)
            .then(() => {
                closeDialog();
                openConfirmationAlert(pageLocale.alerts?.deleteSuccess, 'success');
                actions.clearInspectionDevices();
            })
            .catch(error => {
                console.log(error);
                handleApiError({ message: pageLocale.alerts?.deleteFail });
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
    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        handleEditClick,
        handleDeleteClick,
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
