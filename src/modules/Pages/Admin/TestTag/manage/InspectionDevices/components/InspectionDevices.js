import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import DataTable from './../../../SharedComponents/DataTable/DataTable';
import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import AddToolbar from '../../../SharedComponents/DataTable/AddToolbar';
import UpdateDialog from '../../../SharedComponents/DataTable/UpdateDialog';
import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';
import { useDataTableColumns, useDataTableRow } from '../../../SharedComponents/DataTable/DataTableHooks';

import locale from '../../../testTag.locale';
import { PERMISSIONS } from '../../../config/auth';
import config from './config';
import { emptyActionState, actionReducer, transformRow, transformAddRequest, transformUpdateRequest } from './utils';

const moment = require('moment');

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    tableMarginTop: {
        marginTop: theme.spacing(2),
    },
    gridRoot: {
        border: 0,
    },
    inspectionOverdue: {
        backgroundColor: theme.palette.error.main,
        color: 'white',
    },
}));

const InspectionDevices = ({
    componentId,
    componentIdLower,
    actions,
    canManage = true,
    pageLocale,
    inspectionDevices,
    inspectionDevicesLoading,
}) => {
    const today = moment().format(locale.config.format.dateFormatNoTime);

    const classes = useStyles();
    const pagePermissions = [PERMISSIONS.can_inspect, PERMISSIONS.can_see_reports];
    const [actionState, actionDispatch] = useReducer(actionReducer, { ...emptyActionState });
    const [dialogueBusy, setDialogueBusy] = React.useState(false);
    const { user } = useSelector(state => state.get('testTagUserReducer'));

    const [confirmationAlert, setConfirmationAlert] = React.useState({ message: '', visible: false });

    const closeConfirmationAlert = () => {
        setConfirmationAlert({ message: '', visible: false, type: confirmationAlert.type });
    };
    const openConfirmationAlert = (message, type) => {
        setConfirmationAlert({ message: message, visible: true, type: !!type ? type : 'info', autoHideDuration: 6000 });
    };

    const closeDialog = () => actionDispatch({ type: 'clear' });

    const handleAddClick = () => {
        actionDispatch({
            type: 'add',
            title: pageLocale.dialogAdd?.confirmationTitle,
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
                actions.loadInspectionDevices();
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
        const id = data.device_id;
        const request = structuredClone(data);
        const wrappedRequest = transformUpdateRequest(request);
        console.log('edit', wrappedRequest);

        actions
            .updateInspectionDevice(id, wrappedRequest)
            .then(() => {
                closeDialog();
                openConfirmationAlert(locale.config.alerts.success(), 'success');
                actions.loadInspectionDevices();
            })
            .catch(error => {
                console.log(error);
                openConfirmationAlert(locale.config.alerts.error(error.message), 'error');
            })
            .finally(() => {
                setDialogueBusy(false);
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
                openConfirmationAlert(locale.config.alerts.success(), 'success');
                actions.loadInspectionDevices();
            })
            .catch(error => {
                console.log(error);
                openConfirmationAlert(locale.config.alerts.error(error.message), 'error');
            })
            .finally(() => {
                setDialogueBusy(false);
            });
    };
    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        withActions: canManage,
        handleEditClick,
        handleDeleteClick,
    });

    const { row } = useDataTableRow(inspectionDevices, transformRow);

    useEffect(() => {
        actions.loadInspectionDevices();
    }, [actions]);

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            inclusive={false}
            requiredPermissions={pagePermissions}
        >
            <div className={classes.root}>
                <StandardCard noHeader>
                    {canManage && (
                        <>
                            <UpdateDialog
                                title={actionState.title}
                                action="add"
                                id={componentId}
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
                                id={componentId}
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
                        </>
                    )}
                    <Grid container spacing={3} className={classes.tableMarginTop}>
                        <Grid item padding={3} style={{ flex: 1 }}>
                            <DataTable
                                id={componentId}
                                rows={row}
                                columns={columns}
                                rowId={'device_id'}
                                components={{ ...(canManage ? { Toolbar: AddToolbar } : {}) }}
                                componentsProps={{
                                    ...(canManage
                                        ? {
                                              toolbar: {
                                                  id: componentId,
                                                  label: pageLocale.form?.addDeviceButton,
                                                  onClick: handleAddClick,
                                              },
                                          }
                                        : {}),
                                }}
                                loading={inspectionDevicesLoading}
                                classes={{ root: classes.gridRoot }}
                                getCellClassName={params =>
                                    params.field === 'device_calibration_due_date' && params.value <= today
                                        ? classes.inspectionOverdue
                                        : ''
                                }
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
            </div>
        </StandardAuthPage>
    );
};

InspectionDevices.propTypes = {
    componentId: PropTypes.string.isRequired,
    componentIdLower: PropTypes.string.isRequired, // container provided
    actions: PropTypes.object,
    canManage: PropTypes.bool,
    pageLocale: PropTypes.object.isRequired,
    inspectionDevices: PropTypes.any,
    inspectionDevicesLoading: PropTypes.bool,
    inspectionDevicesLoaded: PropTypes.bool,
    inspectionDevicesError: PropTypes.bool,
};

export default React.memo(InspectionDevices);