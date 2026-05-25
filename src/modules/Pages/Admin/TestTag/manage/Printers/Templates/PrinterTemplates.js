import React, { useEffect, useReducer, useMemo, useRef, useCallback } from 'react';

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
import { ConfirmationBox } from '../../../../../../SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';

import locale from 'modules/Pages/Admin/TestTag/testTag.locale';
import { PERMISSIONS } from '../../../config/auth';
import {
    transformRow,
    transformUpdateRequest,
    transformAddRequest,
    emptyActionState,
    actionReducer,
    hasPrinterError,
    getLabelDates,
    formatTemplate,
} from './utils';
import { useConfirmationAlert, useAccountUser } from '../../../helpers/hooks';
import config from './configure';
import { breadcrumbs } from 'config/routes';
import {
    useLabelPrinter,
    useLabelPrinterPreference,
    LabelPrinterSelector,
} from '../../../SharedComponents/LabelPrinter';
import { getDefaultDeptPrinter } from '../../../helpers/labelPrinting';
import { COOKIE_PRINTER_PREFERENCE } from '../../../config/labelPrinting';

const componentId = 'printer-template-management';

const PrinterTemplates = () => {
    const theme = useTheme();
    const { user } = useAccountUser();
    const deptPrinterDefault = getDefaultDeptPrinter(user?.user_department);
    const isMobileView = useMediaQuery(theme.breakpoints.down('md'));
    const [printerPreference] = useLabelPrinterPreference(COOKIE_PRINTER_PREFERENCE);

    const [selectedPrinter, setSelectedPrinter] = React.useState(printerPreference);
    const { printer, availablePrinters } = useLabelPrinter({
        printerCode: deptPrinterDefault,
        shouldOverridePrinterDevEnv: true,
    });
    const printerError = useMemo(() => hasPrinterError(selectedPrinter, availablePrinters), [
        selectedPrinter,
        availablePrinters,
    ]);
    const testPrintData = useRef('');
    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();
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

    /* istanbul ignore next */
    const onCloseConfirmationAlert = () => actions.clearPrinterTemplateListError();
    const errorMessageFormatter = useMemo(() => locale.config.alerts.error, []);
    const { confirmationAlert, openConfirmationAlert, closeConfirmationAlert } = useConfirmationAlert({
        duration: locale.config.alerts.timeout,
        onClose: onCloseConfirmationAlert,
        errorMessage: printerTemplateListError,
        errorMessageFormatter,
    });
    const [editingRows, setEditingRows] = React.useState(0);

    const closeDialog = useCallback(() => {
        actionDispatch({ type: 'clear' });
    }, []);

    const showAlert = useCallback(
        (alert, type = 'error') => {
            openConfirmationAlert(type === 'error' ? errorMessageFormatter(alert) : alert, type);
        },
        [openConfirmationAlert, errorMessageFormatter],
    );

    const onRowAdd = useCallback(data => {
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

    const onRowEdit = useCallback(data => {
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
    const handleAddClick = useCallback(() => {
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
    }, [pageLocale.dialogAdd?.confirmationTitle]);

    const handleEditClick = useCallback(
        ({ id, api }) => {
            const row = api.getRow(id);
            const identifiers =
                printerTemplateList.find(template => template.printer_template_id === row.printer_template_id)
                    ?.identifiers ?? /* istanbul ignore next*/ [];

            const fieldProps = {
                identifiers: {
                    options: identifiers,
                    // The following settings control the autocomplete popup, which isnt
                    // expected to be used in the UI but required to avoid errors
                    getOptionKey: /* istanbul ignore next*/ option =>
                        /* istanbul ignore next*/ option.printer_template_identifier_id,
                    getOptionLabel: option => option.printer_template_identifier_value ?? /* istanbul ignore next*/ '',
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
        },
        [pageLocale.dialogEdit?.confirmationTitle, printerTemplateList],
    );

    const { row } = useDataTableRow(printerTemplateList, transformRow);
    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        handleEditClick,
        actionDataFieldKeys: { valueKey: 'printer_template_id' },
        actionTooltips: pageLocale.form.actionTooltips,
    });

    useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.testntag.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.testntag.pathname);
    }, []);

    useEffect(() => {
        dispatch(actions.loadPrinterTemplateList()).catch(error => {
            console.error(error);
            openConfirmationAlert(locale.config.alerts.error(pageLocale.snackbar.loadFail), 'error');
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    const onPrint = useCallback(
        data => {
            testPrintData.current = data;
            showConfirmation();
        },
        [showConfirmation],
    );
    const onPrinterSelectionChange = useCallback((_, printer) => {
        setSelectedPrinter(printer);
    }, []);

    const handlePrint = useCallback(() => {
        const now = new Date();
        const { testDate, dueDate } = getLabelDates(now);
        const formattedTemplate = formatTemplate(
            testPrintData.current.printer_template_code,
            testPrintData.current.vars,
            {
                userid: user.user_uid,
                assetId: `${user.user_department}000000`,
                testDate,
                dueDate,
            },
        );
        printer
            ?.setPrinter(selectedPrinter)
            .then(() => {
                printer.getConnectionStatus().then(status => {
                    if (status.ready) {
                        printer
                            .print(formattedTemplate)
                            .then(() => {
                                hideConfirmation();
                                showAlert(
                                    locale.pages.general.labelPrinting.printJobSent(printerPreference.name),
                                    'info',
                                );
                            })
                            .catch(error => {
                                console.error('Print job error:', error);
                                showAlert(locale.pages.general.labelPrinting.error.printJobError);
                            });
                    } else {
                        console.error('Printer is not ready: ' + JSON.stringify(status.errors));
                        showAlert(locale.pages.general.labelPrinting.error.printerNotReady);
                    }
                });
            })
            .catch(error => {
                console.error('Printer connection error:', error);
                showAlert(locale.pages.general.labelPrinting.error.noConnection);
            })
            .finally(() => {
                testPrintData.current = '';
            });
    }, [hideConfirmation, printer, printerPreference, selectedPrinter, showAlert, user]);

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_admin]}
        >
            <StandardCard noHeader>
                <ConfirmationBox
                    confirmationBoxId="label-printer"
                    onAction={handlePrint}
                    onCancelAction={hideConfirmation}
                    onClose={hideConfirmation}
                    isOpen={isOpen}
                    locale={{
                        ...pageLocale?.dialogSelectPrinter,
                        confirmationMessage: (
                            <LabelPrinterSelector
                                id={componentId}
                                list={availablePrinters}
                                value={selectedPrinter?.name ?? null}
                                onChange={onPrinterSelectionChange}
                                locale={{
                                    printerLabel: pageLocale.printerLabel,
                                }}
                                error={printerError}
                            />
                        ),
                    }}
                />
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
                    onAccessoryAction={onPrint}
                    onAction={onRowAdd}
                    props={actionState?.props}
                    isBusy={dialogueBusy}
                    noMinContentWidth
                    styles={dialogStyles}
                    disabledState={{ actionButton: editingRows > 0, accessoryButton: editingRows > 0 }}
                    hideAccessoryButton={false}
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
                    onAccessoryAction={onPrint}
                    onAction={onRowEdit}
                    props={actionState?.props}
                    isBusy={dialogueBusy}
                    noMinContentWidth
                    styles={dialogStyles}
                    disabledState={{ actionButton: editingRows > 0, accessoryButton: editingRows > 0 }}
                    hideAccessoryButton={false}
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
                                        <AddButton
                                            label={pageLocale.buttons.add.label}
                                            onClick={handleAddClick}
                                            disabled={printerTemplateListLoading}
                                        />
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
