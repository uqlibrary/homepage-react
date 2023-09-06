import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import { useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import DataTable from './../../../SharedComponents/DataTable/DataTable';
import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';
import { useDataTableColumns } from '../../../SharedComponents/DataTable/DataTableHooks';
import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import AutoLocationPicker from '../../../SharedComponents/LocationPicker/AutoLocationPicker';
import AssetSelector from '../../../SharedComponents/AssetSelector/AssetSelector';
import AssetTypeSelector from '../../../SharedComponents/AssetTypeSelector/AssetTypeSelector';
import FooterBar from '../../../SharedComponents/DataTable/FooterBar';
import { useLocation, useSelectLocation } from '../../../SharedComponents/LocationPicker/LocationPickerHooks';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import FilterDialog from './FilterDialog';

import locale from '../../../testTag.locale';
import config from './config';
import { PERMISSIONS } from '../../../config/auth';
import { isValidRoomId, isValidAssetId, isValidAssetTypeId } from '../../../Inspection/utils/helpers';
import { isEmptyObject, isEmptyStr } from '../../../helpers/helpers';
import { useForm, useObjectList, useConfirmationAlert } from '../../../helpers/hooks';
import { transformRow, transformRequest } from './utils';
import AuthWrapper from '../../../SharedComponents/AuthWrapper/AuthWrapper';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    tableMarginTop: {
        marginTop: theme.spacing(2),
    },
    actionButtons: {
        marginTop: theme.spacing(2),
    },
    centredGrid: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
    centredGridNoJustify: {
        display: 'flex',
        alignItems: 'center',
    },
}));

const componentId = 'bulk-asset-update';
const componentIdLower = 'bulk_asset_update';

const BulkAssetUpdate = ({ actions, defaultFormValues }) => {
    const pageLocale = locale.pages.manage.bulkassetupdate;
    const stepOneLocale = pageLocale.form.step.one;
    const stepTwoLocale = pageLocale.form.step.two;
    const classes = useStyles();
    const list = useObjectList([], transformRow, { key: 'asset_id' });
    const [step, setStep] = useState(1);
    const assignAssetDefaults = () => ({ ...defaultFormValues });
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmDialogueBusy, setConfirmDialogueBusy] = useState(false);
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
    const { formValues, resetFormValues, handleChange } = useForm({
        defaultValues: { ...assignAssetDefaults() },
    });

    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('sm')) || false;

    const { user } = useSelector(state => state.get('testTagUserReducer'));

    const locationStore = useSelector(state => state.get('testTagLocationReducer'));
    const { location, setLocation, resetLocation } = useLocation();
    useSelectLocation({
        location,
        setLocation,
        actions,
        store: locationStore,
        condition: () => !isFilterDialogOpen,
    });

    useEffect(() => {
        handleChange('asset_list')(list.data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list.data]);

    const handleSearchAssetIdChange = useCallback(
        newValue => {
            if (isEmptyObject(newValue)) return;
            list.addStart(newValue);
        },
        [list],
    );

    const { confirmationAlert, openConfirmationAlert, closeConfirmationAlert } = useConfirmationAlert({
        duration: locale.config.alerts.timeout,
    });

    const resetForm = () => {
        const newFormValues = assignAssetDefaults();
        setConfirmDialogueBusy(false);
        setConfirmDialogOpen(false);
        resetFormValues(newFormValues);
        resetLocation();
        actions.clearAssetsMine();
        list.clear();
        setStep(1);
    };

    useEffect(() => {
        resetForm();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDeleteClick = useCallback(
        ({ id, api }) => {
            const row = api.getRow(id);
            list.deleteWith('asset_id', row.asset_id);
        },
        [list],
    );

    const { columns } = useDataTableColumns({
        config: config.form,
        locale: pageLocale.form.columns,
        handleDeleteClick,
        deleteIcon: <RemoveCircleOutlineIcon size="small" />,
        actionDataFieldKeys: { valueKey: 'asset_id_displayed' },
        actionTooltips: stepOneLocale.actionTooltips,
    });

    const handleNextStepButton = () => {
        setStep(2);
    };
    const handlePrevStepButton = () => {
        setStep(1);
    };

    const openFilterDialog = () => setIsFilterDialogOpen(true);
    const closeFilterDialog = () => setIsFilterDialogOpen(false);
    const handleFilterDialogClose = () => closeFilterDialog();
    const handleFilterDialogAction = data => {
        closeFilterDialog();
        list.addStart(data);
    };

    const openConfirmDialog = () => setConfirmDialogOpen(true);
    const closeConfirmDialog = () => setConfirmDialogOpen(false);

    const handleOnSubmit = () => {
        openConfirmDialog();
    };

    const handleConfirmDialogClose = () => closeConfirmDialog();
    const handleConfirmDialogAction = () => {
        // Send data to the server and save update
        setConfirmDialogueBusy(true);
        const clonedData = structuredClone(formValues);
        const request = transformRequest(clonedData);
        actions
            .bulkAssetUpdate(request)
            .then(() => {
                openConfirmationAlert(locale.config.alerts.success(), 'success');
                resetForm();
            })
            .catch(error => {
                console.error(error);
                openConfirmationAlert(locale.config.alerts.failed(stepTwoLocale.snackbars.failed), 'error');
                setConfirmDialogueBusy(false);
            });
    };

    const handleLocationUpdate = location => {
        // because location relies on useSelectLocation to fire
        // the various API calls, we need to handle updates
        // to this component separate from the useFormValues handleChange
        setLocation(location);
        // and we only want to update when a room has been selected, as
        // that's all we're allowing the user to bulk change
        if (location.room !== -1) {
            handleChange('location')(location);
        } else if (formValues.location !== undefined) {
            handleChange('location')(undefined);
        }
    };

    const handleCheckboxChange = e => {
        // checkboxes use 'checked' value on the target to set t/f values,
        // so the standard formValues handleChange wont work without
        // a bit of help sending through the actual value.
        // This relies on the checkbox having the same name as the
        // formvalue variable being set (hasLocation etc)
        const checked = e.target.checked;
        handleChange(e.target.name)(checked);
    };

    const validFormValues = React.useMemo(() => {
        const validLocation =
            !formValues.hasLocation ||
            (!isEmptyObject(formValues.location) &&
                isValidRoomId(formValues.location?.room ?? /* istanbul ignore next */ 0));

        const validDiscardStatus = !formValues.hasDiscardStatus || !isEmptyStr(formValues.discard_reason);

        const validAssetType =
            !formValues.hasAssetType ||
            (!isEmptyObject(formValues.asset_type) &&
                isValidAssetTypeId(formValues.asset_type?.asset_type_id ?? /* istanbul ignore next */ 0));

        const isValid =
            (formValues.hasLocation ||
                formValues.hasDiscardStatus ||
                formValues.hasAssetType ||
                formValues.hasClearNotes) &&
            validLocation &&
            validDiscardStatus &&
            validAssetType;

        return isValid;
    }, [
        formValues.discard_reason,
        formValues.asset_type,
        formValues.hasAssetType,
        formValues.hasLocation,
        formValues.hasDiscardStatus,
        formValues.location,
        formValues.hasClearNotes,
    ]);

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_inspect, PERMISSIONS.can_alter]}
            inclusive={false}
        >
            <div className={classes.root}>
                <ConfirmationBox
                    actionButtonColor="primary"
                    actionButtonVariant="contained"
                    cancelButtonColor="secondary"
                    confirmationBoxId={componentId}
                    onCancelAction={handleConfirmDialogClose}
                    onAction={handleConfirmDialogAction}
                    isOpen={confirmDialogOpen}
                    locale={
                        !confirmDialogueBusy
                            ? stepTwoLocale.dialogBulkUpdateConfirm
                            : {
                                  ...stepTwoLocale.dialogBulkUpdateConfirm,
                                  confirmButtonLabel: (
                                      <CircularProgress
                                          color="inherit"
                                          size={25}
                                          id={`${componentIdLower}-confirmation-progress`}
                                          data-testid={`${componentIdLower}-confirmation-progress`}
                                      />
                                  ),
                              }
                    }
                    disableButtonsWhenBusy
                    isBusy={confirmDialogueBusy}
                    noMinContentWidth
                />
                {step === 1 && (
                    <StandardCard title={stepOneLocale.title} standardCardId={`standard_card-${componentId}-step-1`}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <AssetSelector
                                    id={componentId}
                                    locale={stepOneLocale}
                                    user={user}
                                    classNames={{ formControl: classes.formControl }}
                                    onChange={handleSearchAssetIdChange}
                                    validateAssetId={isValidAssetId}
                                    canAddNew={false}
                                    required={false}
                                    clearOnSelect
                                    filter={{ status: { discarded: false } }}
                                />
                            </Grid>
                            <Grid item xs={12} md={2} className={classes.centredGrid}>
                                or
                            </Grid>
                            <Grid item xs={12} md={6} className={classes.centredGridNoJustify}>
                                <Button
                                    variant="outlined"
                                    id={`${componentIdLower}-feature-button`}
                                    data-testid={`${componentIdLower}-feature-button`}
                                    color="primary"
                                    onClick={openFilterDialog}
                                    fullWidth={isMobileView}
                                >
                                    {stepOneLocale.button.findAndAdd}
                                </Button>
                            </Grid>
                        </Grid>
                        {list.data.length > 0 && (
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Alert
                                        severity="info"
                                        id={`${componentIdLower}-count-alert`}
                                        data-testid={`${componentIdLower}-count-alert`}
                                    >
                                        {stepTwoLocale.subtext(list.data.length, locale.pages.general.pluraliser)}
                                    </Alert>
                                </Grid>
                            </Grid>
                        )}
                        <Grid container spacing={3}>
                            <Grid item padding={3} style={{ flex: 1 }}>
                                <DataTable
                                    id={componentId}
                                    rows={list.data}
                                    columns={columns}
                                    rowId={'asset_id'}
                                    handleDeleteClick={handleDeleteClick}
                                    components={{ Footer: FooterBar }}
                                    componentsProps={{
                                        footer: {
                                            id: componentId,
                                            actionLabel: stepOneLocale.button.next,
                                            altLabel: stepOneLocale.button.clear,
                                            onAltClick: resetForm,
                                            onActionClick: handleNextStepButton,
                                            nextButtonProps: { disabled: list.data.length === 0 },
                                            className: classes.actionButtons,
                                        },
                                    }}
                                    autoPageSize
                                    {...(config.form.sort ?? /* istanbul ignore next */ {})}
                                />
                            </Grid>
                        </Grid>
                        <FilterDialog
                            id={componentId}
                            locale={pageLocale.form.filterDialog}
                            assetTypeLocale={pageLocale.form.filterDialog.form.assetType}
                            locationLocale={locale.pages.general.locationPicker}
                            confirmAlertTimeout={locale.config.alerts.timeout}
                            errorMessageFormatter={locale.config.alerts.error}
                            minContentWidth={'100%'}
                            config={config.filterDialog}
                            isOpen={isFilterDialogOpen}
                            onCancel={handleFilterDialogClose}
                            onAction={handleFilterDialogAction}
                            actions={actions}
                            isMobileView={isMobileView}
                        />
                    </StandardCard>
                )}
                {step === 2 && (
                    <StandardCard title={stepTwoLocale.title} standardCardId={`standard_card-${componentId}-step-2`}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Alert
                                    severity="warning"
                                    id={`${componentIdLower}-summary-alert`}
                                    data-testid={`${componentIdLower}-summary-alert`}
                                >
                                    {stepTwoLocale.subtext(list.data.length, locale.pages.general.pluraliser)}
                                </Alert>
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formValues.hasLocation && !formValues.hasDiscardStatus}
                                            onChange={handleCheckboxChange}
                                            name="hasLocation"
                                            id={`${componentIdLower}-location-checkbox`}
                                            data-testid={`${componentIdLower}-location-checkbox`}
                                            color="primary"
                                            disabled={formValues.hasDiscardStatus}
                                        />
                                    }
                                    label={stepTwoLocale.checkbox.location}
                                />
                            </Grid>
                            <AutoLocationPicker
                                id={componentId}
                                disabled={!formValues.hasLocation || formValues.hasDiscardStatus}
                                actions={actions}
                                location={location}
                                setLocation={handleLocationUpdate}
                                locale={locale.pages.general.locationPicker}
                                inputProps={{
                                    site: {
                                        required: formValues.hasLocation,
                                        error:
                                            !formValues.hasDiscardStatus &&
                                            formValues.hasLocation &&
                                            location.site === -1,
                                    },
                                    building: {
                                        required: formValues.hasLocation && location.site !== -1,
                                        error:
                                            !formValues.hasDiscardStatus &&
                                            formValues.hasLocation &&
                                            location.site !== -1 &&
                                            location.building === -1,
                                    },
                                    floor: {
                                        required: formValues.hasLocation && location.building !== -1,
                                        error:
                                            !formValues.hasDiscardStatus &&
                                            formValues.hasLocation &&
                                            location.site !== -1 &&
                                            location.building !== -1 &&
                                            location.floor === -1,
                                    },
                                    room: {
                                        required: formValues.hasLocation && location.floor !== -1,
                                        error:
                                            !formValues.hasDiscardStatus &&
                                            formValues.hasLocation &&
                                            location.site !== -1 &&
                                            location.building !== -1 &&
                                            location.floor !== -1 &&
                                            location.room === -1,
                                    },
                                }}
                            />
                        </Grid>

                        <Grid container spacing={3}>
                            <AuthWrapper requiredPermissions={[PERMISSIONS.can_inspect]}>
                                <Grid item xs={12} sm={6} padding={3}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={
                                                            formValues.hasAssetType && !formValues.hasDiscardStatus
                                                        }
                                                        onChange={handleCheckboxChange}
                                                        name="hasAssetType"
                                                        id={`${componentIdLower}-asset-type-checkbox`}
                                                        data-testid={`${componentIdLower}-asset-type-checkbox`}
                                                        color="primary"
                                                        disabled={formValues.hasDiscardStatus}
                                                    />
                                                }
                                                label={stepTwoLocale.checkbox.assetType}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <AssetTypeSelector
                                                id={componentId}
                                                locale={pageLocale.form.assetType}
                                                actions={actions}
                                                onChange={handleChange('asset_type')}
                                                disabled={!formValues.hasAssetType || formValues.hasDiscardStatus}
                                                required={formValues.hasAssetType}
                                                value={formValues.asset_type?.asset_type_id}
                                                validateAssetTypeId={isValidAssetTypeId}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </AuthWrapper>
                            <Grid item xs={12} sm={6} padding={3}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={
                                                        formValues.hasDiscardStatus &&
                                                        !formValues.hasAssetType &&
                                                        !formValues.hasLocation &&
                                                        !formValues.hasClearNotes
                                                    }
                                                    disabled={
                                                        formValues.hasAssetType ||
                                                        formValues.hasLocation ||
                                                        formValues.hasClearNotes
                                                    }
                                                    onChange={handleCheckboxChange}
                                                    name="hasDiscardStatus"
                                                    id={`${componentIdLower}-status-checkbox`}
                                                    data-testid={`${componentIdLower}-status-checkbox`}
                                                    color="primary"
                                                />
                                            }
                                            label={stepTwoLocale.checkbox.status}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            {...stepTwoLocale.discardReason}
                                            required={formValues.hasDiscardStatus}
                                            error={formValues.hasDiscardStatus && isEmptyStr(formValues.discard_reason)}
                                            multiline
                                            minRows={2}
                                            variant="standard"
                                            id={`${componentId}-discard-reason-input`}
                                            InputProps={{ fullWidth: true }}
                                            InputLabelProps={{
                                                shrink: true,
                                                htmlFor: `${componentId}-discard-reason-input`,
                                            }}
                                            inputProps={{
                                                'data-testid': `${componentId}-discard-reason-input`,
                                            }}
                                            disabled={
                                                formValues.hasAssetType ||
                                                formValues.hasLocation ||
                                                formValues.hasClearNotes ||
                                                !formValues.hasDiscardStatus
                                            }
                                            value={formValues?.discard_reason ?? ''}
                                            onChange={handleChange('discard_reason')}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={!formValues.hasDiscardStatus && formValues.hasClearNotes}
                                            disabled={formValues.hasDiscardStatus}
                                            onChange={handleCheckboxChange}
                                            name="hasClearNotes"
                                            id={`${componentIdLower}-notes-checkbox`}
                                            data-testid={`${componentIdLower}-notes-checkbox`}
                                            color="primary"
                                        />
                                    }
                                    label={stepTwoLocale.checkbox.notes}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={4} className={classes.actionButtons}>
                            <Grid item xs={12} sm={6} container justifyContent="flex-start">
                                <Button
                                    variant="outlined"
                                    onClick={handlePrevStepButton}
                                    id={`${componentIdLower}-back-button`}
                                    data-testid={`${componentIdLower}-back-button`}
                                    color={'default'}
                                    fullWidth={isMobileView}
                                >
                                    {stepTwoLocale.button.previous}
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} container justifyContent="flex-end">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleOnSubmit}
                                    id={`${componentIdLower}-submit-button`}
                                    data-testid={`${componentIdLower}-submit-button`}
                                    disabled={!validFormValues}
                                    fullWidth={isMobileView}
                                >
                                    {stepTwoLocale.button.submit}
                                </Button>
                            </Grid>
                        </Grid>
                    </StandardCard>
                )}
            </div>
            <ConfirmationAlert
                isOpen={confirmationAlert.visible}
                message={confirmationAlert.message}
                type={confirmationAlert.type}
                autoHideDuration={confirmationAlert.autoHideDuration}
                closeAlert={closeConfirmationAlert}
            />
        </StandardAuthPage>
    );
};

BulkAssetUpdate.propTypes = {
    actions: PropTypes.object,
    defaultFormValues: PropTypes.object,
};

export default React.memo(BulkAssetUpdate);
