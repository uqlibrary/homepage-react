import React, { useReducer, useMemo } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import * as actions from 'data/actions';

import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import DataTable from '../../../SharedComponents/DataTable/DataTable';
import { AddButton, WithExportMenu } from '../../../SharedComponents/DataTable/Toolbar';
import { useDataTableColumns, useDataTableRow } from '../../../SharedComponents/DataTable/DataTableHooks';
import UpdateDialog from '../../../SharedComponents/UpdateDialog/UpdateDialog';
import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';

import locale from 'modules/Pages/Admin/TestTag/testTag.locale';
import { PERMISSIONS } from '../../../config/auth';
import { transformRow, transformUpdateRequest, transformAddRequest, emptyActionState, actionReducer } from './utils';
import { useConfirmationAlert } from '../../../helpers/hooks';
import config from './config';
import { breadcrumbs } from 'config/routes';

const componentId = 'printer-template-management';

const PrinterTemplates = () => {
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('md'));

    const dialogStyles = useMemo(
        () => ({
            '& .MuiDialog-paper': { minHeight: '30vh', maxHeight: isMobileView ? '100%' : '75vh' },
        }),
        [isMobileView],
    );

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
        dispatch(actions.addPrinterTemplate(wrappedRequest))
            .then(() => {
                closeDialog();
                openConfirmationAlert(locale.config.alerts.success(), 'success');
                dispatch(actions.loadPrinterTemplateList());
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
        const wrappedRequest = transformUpdateRequest(request);
        dispatch(actions.updatePrinterTemplate(wrappedRequest.printer_template_id, wrappedRequest))
            .then(() => {
                openConfirmationAlert(locale.config.alerts.success(), 'success');
                dispatch(actions.loadPrinterTemplateList());
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

    const setIsEditing = value => {
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

    const { row } = useDataTableRow(printerTemplateList, transformRow);
    // const shouldDisableEdit = row => userUID === row?.user_uid;
    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        handleEditClick,
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
                    rows={row}
                    onCancelAction={closeDialog}
                    onAction={onRowAdd}
                    props={actionState?.props}
                    isBusy={dialogueBusy}
                    noMinContentWidth
                    styles={dialogStyles}
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
                    rows={row}
                    onCancelAction={closeDialog}
                    onAction={onRowEdit}
                    props={actionState?.props}
                    isBusy={dialogueBusy}
                    noMinContentWidth
                    styles={dialogStyles}
                    disabledState={{ actionButton: editingRows > 0 }}
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
                                        <AddButton label={pageLocale.buttons.add.label} onClick={handleAddClick} />
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
