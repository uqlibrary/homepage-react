import React, { useReducer } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import CircularProgress from '@mui/material/CircularProgress';

import { useSelector, useDispatch } from 'react-redux';

import * as actions from 'data/actions';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import DataTable from './../../../SharedComponents/DataTable/DataTable';
import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import UpdateDialog from '../../../SharedComponents/UpdateDialog/UpdateDialog';
import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useDataTableColumns, useDataTableRow } from '../../../SharedComponents/DataTable/DataTableHooks';

import locale from 'modules/Pages/Admin/TestTag/testTag.locale';
import { PERMISSIONS } from '../../../config/auth';
import { transformRow, transformUpdateRequest, transformAddRequest, emptyActionState, actionReducer } from './utils';
import { useConfirmationAlert } from '../../../helpers/hooks';
import config from './configure';
import { breadcrumbs } from 'config/routes';
import { AddButton, WithExportMenu } from '../../../SharedComponents/DataTable/Toolbar';

const componentId = 'printer-template-management';

const dialogStyles = {
    padding: '6px',
    '& .MuiDialog-paper': { minHeight: '30vh', maxHeight: '75vh' },
};

const PrinterTemplates = () => {
    const pageLocale = locale.pages.manage.printertemplates;

    const { printerTemplateList, printerTemplateListLoading, printerTemplateListError } = useSelector(state =>
        state.get?.('testTagPrinterTemplateReducer'),
    );
    const [dialogueBusy, setDialogueBusy] = React.useState(false);
    const [actionState, actionDispatch] = useReducer(actionReducer, { ...emptyActionState });
    const dispatch = useDispatch();

    const onCloseConfirmationAlert = () => actions.clearPrinterTemplateListError();
    const { confirmationAlert, openConfirmationAlert, closeConfirmationAlert } = useConfirmationAlert({
        duration: locale.config.alerts.timeout,
        onClose: onCloseConfirmationAlert,
        errorMessage: printerTemplateListError,
        errorMessageFormatter: locale.config.alerts.error,
    });
    const [editingRows, setEditingRows] = React.useState(0);

    const closeDialog = React.useCallback(() => {
        actionDispatch({ type: 'clear' });
    }, []);

    const onRowAdd = React.useCallback(data => {
        setDialogueBusy(true);
        const request = structuredClone(data);
        const wrappedRequest = transformAddRequest(request);
        actions
            .addTeam(wrappedRequest)
            .then(() => {
                closeDialog();
                openConfirmationAlert(locale.config.alerts.success(), 'success');
                actions.loadTeamList();
            })
            .catch(error => {
                console.error(error);
                openConfirmationAlert(locale.config.alerts.error(pageLocale.snackbar.addFail), 'error');
            })
            .finally(() => {
                setDialogueBusy(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRowEdit = React.useCallback(data => {
        setDialogueBusy(true);
        const request = structuredClone(data);
        const teamSlug = request.team_slug;
        const wrappedRequest = transformUpdateRequest(request);
        actions
            .updateTeam(teamSlug, wrappedRequest)
            .then(() => {
                openConfirmationAlert(locale.config.alerts.success(), 'success');
                actions.loadTeamList();
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

    const onRowDelete = React.useCallback(data => {
        setDialogueBusy(true);
        const teamSlug = data.row.team_slug;

        actions
            .deleteTeam(teamSlug)
            .then(() => {
                closeDialog();
                openConfirmationAlert(locale.config.alerts.success(), 'success');
                actions.loadTeamList();
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

    const setIsEditing = value => {
        console.log('setIsEditing', value);
        setEditingRows(prev => (value ? prev + 1 : Math.max(prev - 1, 0)));
    };
    const handleAddClick = () => {
        const fieldProps = {
            identifiers: {
                options: [],
            },
            vars: {
                setIsEditing,
            },
        };

        setEditingRows(0);
        actionDispatch({
            type: 'add',
            title: pageLocale.dialogAdd?.confirmationTitle,
            fieldProps,
        });
    };

    const handleEditClick = ({ id, api }) => {
        const row = api.getRow(id);
        const identifiers =
            printerTemplateList.find(template => template.printer_template_id === row.printer_template_id)
                ?.identifiers ?? [];

        const fieldProps = {
            identifiers: {
                options: identifiers,
                getOptionKey: option => option.printer_template_identifier_id,
                getOptionLabel: option => option.printer_template_identifier_value ?? '',
                isOptionEqualToValue: (option, value) => option.printer_template_identifier_value === value,
            },
            vars: {
                setIsEditing,
            },
        };

        setEditingRows(0);
        actionDispatch({
            type: 'edit',
            title: pageLocale.dialogEdit?.confirmationTitle,
            row,
            fieldProps,
        });
    };

    const handleDeleteClick = ({ id, api }) => {
        const row = api.getRow(id);
        actionDispatch({
            type: 'delete',
            row,
        });
    };

    const { row } = useDataTableRow(printerTemplateList, transformRow);
    const shouldDisableDelete = row => row?.users_count > 0;
    // const shouldDisableEdit = row => userUID === row?.user_uid;
    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        handleEditClick,
        handleDeleteClick,
        shouldDisableDelete,
        // shouldDisableEdit,
        actionDataFieldKeys: { valueKey: 'printer_template_id' },
        actionTooltips: pageLocale.form.actionTooltips,
    });

    React.useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.testntag.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.testntag.pathname);
    }, []);

    React.useEffect(() => {
        dispatch(actions.loadPrinterTemplateList()).catch(error => {
            console.error(error);
            openConfirmationAlert(locale.config.alerts.error(pageLocale.snackbar.loadFail), 'error');
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

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
                    noMinContentWidth
                    sx={dialogStyles}
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
                    noMinContentWidth
                    sx={dialogStyles}
                    disabledState={{ actionButton: editingRows > 0 }}
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
                    <Grid sx={{ flex: 1 }}>
                        <DataTable
                            id={componentId}
                            rows={row}
                            columns={columns}
                            rowId="printer_template_id"
                            loading={printerTemplateListLoading}
                            components={{
                                Toolbar: () => (
                                    <WithExportMenu id={componentId}>
                                        <AddButton label={pageLocale.form.addButtonLabel} onClick={handleAddClick} />
                                    </WithExportMenu>
                                ),
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

export default React.memo(PrinterTemplates);
