import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';

import Grid from '@mui/material/Unstable_Grid2';
import CircularProgress from '@mui/material/CircularProgress';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import DataTable from './../../../SharedComponents/DataTable/DataTable';
import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import AddToolbar from '../../../SharedComponents/DataTable/AddToolbar';
import UpdateDialog from '../../../SharedComponents/UpdateDialog/UpdateDialog';
import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';
import { useDataTableColumns, useDataTableRow } from '../../../SharedComponents/DataTable/DataTableHooks';

import { useConfirmationAlert } from '../../../helpers/hooks';
import locale from '../../../testTag.locale';
import { emptyActionState, actionReducer, transformRow, transformAddRequest, transformUpdateRequest } from './utils';
import { breadcrumbs } from 'config/routes';

const moment = require('moment');

const StyledWrapper = styled('div')(({ theme }) => ({
    flexGrow: 1,

    '& .inspectionOverdue': {
        backgroundColor: theme.palette.error.main,
        color: 'white',
    },
}));

const InspectionDevices = ({
    componentId,
    componentIdLower,
    actions,
    canManage = true,
    config,
    pageLocale,
    inspectionDevices,
    inspectionDevicesLoading,
    inspectionDevicesError,
    requiredPermissions,
}) => {
    const today = moment().format(locale.config.format.dateFormatNoTime);

    const [actionState, actionDispatch] = useReducer(actionReducer, { ...emptyActionState });
    const [dialogueBusy, setDialogueBusy] = React.useState(false);
    const { user } = useSelector(state => state.get('testTagUserReducer'));

    const onCloseConfirmationAlert = () => actions.clearInspectionDevicesError();
    const { confirmationAlert, openConfirmationAlert, closeConfirmationAlert } = useConfirmationAlert({
        duration: locale.config.alerts.timeout,
        onClose: onCloseConfirmationAlert,
        errorMessage: inspectionDevicesError,
        errorMessageFormatter: locale.config.alerts.error,
    });
    const closeDialog = React.useCallback(() => {
        actionDispatch({ type: 'clear' });
    }, []);

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
        const noInspections = row.has_inspections === 0;

        !noInspections && setDialogueBusy(true);

        actionDispatch({
            type: 'delete',
            locale: noInspections ? pageLocale?.dialogDeleteConfirm : pageLocale?.dialogDeleteConfirmWithAlert,
            row,
        });

        !noInspections && setTimeout(() => setDialogueBusy(false), 3000);
    };

    const onRowAdd = React.useCallback(
        data => {
            setDialogueBusy(true);
            const request = structuredClone(data);
            const wrappedRequest = transformAddRequest(request, user);

            actions
                .addInspectionDevice(wrappedRequest)
                .then(() => {
                    closeDialog();
                    openConfirmationAlert(locale.config.alerts.success(), 'success');
                    actions.loadInspectionDevices();
                })
                .catch(error => {
                    console.error(error);
                    openConfirmationAlert(locale.config.alerts.failed(pageLocale.snackbar.addFail), 'error');
                })
                .finally(() => {
                    setDialogueBusy(false);
                });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [user],
    );

    const onRowEdit = React.useCallback(data => {
        setDialogueBusy(true);
        const id = data.device_id;
        const request = structuredClone(data);
        const wrappedRequest = transformUpdateRequest(request);

        actions
            .updateInspectionDevice(id, wrappedRequest)
            .then(() => {
                closeDialog();
                openConfirmationAlert(locale.config.alerts.success(), 'success');
                actions.loadInspectionDevices();
            })
            .catch(error => {
                console.error(error);
                openConfirmationAlert(locale.config.alerts.failed(pageLocale.snackbar.updateFail), 'error');
            })
            .finally(() => {
                setDialogueBusy(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRowDelete = React.useCallback(data => {
        setDialogueBusy(true);
        const id = data.row.device_id;
        actions
            .deleteInspectionDevice(id)
            .then(() => {
                closeDialog();
                openConfirmationAlert(locale.config.alerts.success(), 'success');
                actions.loadInspectionDevices();
            })
            .catch(error => {
                console.error(error);
                openConfirmationAlert(locale.config.alerts.failed(pageLocale.snackbar.deleteFail), 'error');
            })
            .finally(() => {
                setDialogueBusy(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        withActions: canManage,
        handleEditClick,
        handleDeleteClick,
        actionDataFieldKeys: { valueKey: 'device_model_name' },
        actionTooltips: pageLocale.form.actionTooltips,
    });

    const { row } = useDataTableRow(inspectionDevices, transformRow);

    useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.testntag.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.testntag.pathname);

        actions.loadInspectionDevices().catch(error => {
            console.error(error);
            openConfirmationAlert(locale.config.alerts.failed('error'), 'error');
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={requiredPermissions}
            inclusive={false}
        >
            <StyledWrapper>
                <StandardCard noHeader>
                    {canManage && (
                        <>
                            <UpdateDialog
                                title={actionState.title}
                                action="add"
                                id={componentId}
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
                                title={actionState.title}
                                action="edit"
                                id={componentId}
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
                                        ? actionState.props?.locale ?? {}
                                        : {
                                              ...(actionState.props?.locale ?? {}),
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
                    <Grid container spacing={3}>
                        <Grid sx={{ flex: 1 }}>
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
                                getCellClassName={params =>
                                    params.field === 'device_calibration_due_date' && params.value < today
                                        ? 'inspectionOverdue'
                                        : ''
                                }
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
            </StyledWrapper>
        </StandardAuthPage>
    );
};

InspectionDevices.propTypes = {
    componentId: PropTypes.string.isRequired,
    componentIdLower: PropTypes.string.isRequired, // container provided
    config: PropTypes.object.isRequired,
    pageLocale: PropTypes.object.isRequired,
    inspectionDevices: PropTypes.any,
    actions: PropTypes.object,
    canManage: PropTypes.bool,
    inspectionDevicesLoading: PropTypes.bool,
    inspectionDevicesLoaded: PropTypes.bool,
    inspectionDevicesError: PropTypes.bool,
    requiredPermissions: PropTypes.array,
};

export default React.memo(InspectionDevices);
