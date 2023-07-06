import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import DataTable from './../../../SharedComponents/DataTable/DataTable';
import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';
import { useDataTableColumns } from '../../../SharedComponents/DataTable/DataTableHooks';
import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import AutoLocationPicker from '../../../SharedComponents/LocationPicker/AutoLocationPicker';
import AssetSelector from '../../../SharedComponents/AssetSelector/AssetSelector';
import AssetTypeSelector from '../../../SharedComponents/AssetTypeSelector/AssetTypeSelector';
import AssetStatusSelector from '../../../SharedComponents/AssetStatusSelector/AssetStatusSelector';
import FooterBar from '../../../SharedComponents/DataTable/FooterBar';
import { useLocation, useSelectLocation } from '../../../SharedComponents/LocationPicker/LocationPickerHooks';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import FilterDialog from './FilterDialog';

import locale from '../../../testTag.locale';
import config from './config';
import { PERMISSIONS } from '../../../config/auth';
import { isValidRoomId, isValidAssetId, isValidAssetTypeId } from '../../../Inspection/utils/helpers';
import { isEmptyObject, isEmptyStr } from '../../../helpers/helpers';
import { useForm, useObjectList } from '../../../helpers/hooks';
import { transformRow, transformRequest } from './utils';

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
    const list = useObjectList([], transformRow);
    const [step, setStep] = useState(1);
    const assignAssetDefaults = () => ({ ...defaultFormValues });
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmDialogueBusy, setConfirmDialogueBusy] = React.useState(false);
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
    const { formValues, resetFormValues, handleChange } = useForm({
        defaultValues: { ...assignAssetDefaults() },
    });
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
            if (typeof newValue === 'string' && isEmptyStr(newValue)) return;
            if (isEmptyObject(newValue)) return;
            list.addStart(newValue);
        },
        [list],
    );

    const [snackbarAlert, setSnackbarAlert] = React.useState({ message: '', visible: false });

    const closeSnackbarAlert = () => {
        setSnackbarAlert({ message: '', visible: false, type: snackbarAlert.type });
    };
    const openSnackbarAlert = (message, type) => {
        setSnackbarAlert({ message: message, visible: true, type: !!type ? type : 'info', autoHideDuration: 6000 });
    };

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
        const request = transformRequest(formValues);
        console.log('handleConfirmDialogAction', { request });
        actions
            .bulkAssetUpdate(request)
            .then(() => {
                openSnackbarAlert(locale.config.alerts.success(), 'success');
                resetForm();
            })
            .catch(error => {
                openSnackbarAlert(locale.config.alerts.error(error.message), 'error');
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
            (!isEmptyObject(formValues.location) && isValidRoomId(formValues.location?.room ?? 0));

        const validStatus =
            !formValues.hasStatus ||
            (!isEmptyObject(formValues.asset_status) && !isEmptyStr(formValues.asset_status.value));
        // formValues.hasAssetType ||  || !formValues.hasStatus &

        const validAssetType =
            !formValues.hasAssetType ||
            (!isEmptyObject(formValues.asset_type) && isValidAssetTypeId(formValues.asset_type?.asset_type_id ?? 0));

        const isValid =
            (formValues.hasLocation || formValues.hasStatus || formValues.hasAssetType) &&
            validLocation &&
            validStatus &&
            validAssetType;

        return isValid;
    }, [
        formValues.asset_status,
        formValues.asset_type,
        formValues.hasAssetType,
        formValues.hasLocation,
        formValues.hasStatus,
        formValues.location,
    ]);

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_inspect]}
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
                                          id="confirmationSpinner"
                                          data-testid="confirmationSpinner"
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
                            <Grid item xs={12} sm={4}>
                                <AssetSelector
                                    id={componentId}
                                    locale={stepOneLocale}
                                    masked={false}
                                    classNames={{ formControl: classes.formControl }}
                                    onChange={handleSearchAssetIdChange}
                                    validateAssetId={isValidAssetId}
                                    canAddNew={false}
                                    required={false}
                                    clearOnSelect
                                />
                            </Grid>
                            <Grid item xs={12} sm={2} className={classes.centredGrid}>
                                or
                            </Grid>
                            <Grid item xs={12} sm={6} className={classes.centredGridNoJustify}>
                                <Button
                                    variant="outlined"
                                    id={`${componentIdLower}-feature-button`}
                                    data-testid={`${componentIdLower}-feature-button`}
                                    color="primary"
                                    onClick={openFilterDialog}
                                >
                                    {stepOneLocale.button.findAndAdd}
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item padding={3} style={{ flex: 1 }}>
                                <DataTable
                                    id={componentId}
                                    rows={list.data}
                                    columns={columns}
                                    rowId={'asset_id_displayed'}
                                    classes={{ root: classes.gridRoot }}
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
                                            withPagination: false,
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <FilterDialog
                            id={componentId}
                            locale={pageLocale.form.filterDialog}
                            assetTypeLocale={pageLocale.form.assetType}
                            locationLocale={locale.pages.general.locationPicker}
                            minContentWidth={'100%'}
                            config={config.filterDialog}
                            isOpen={isFilterDialogOpen}
                            onCancel={handleFilterDialogClose}
                            onAction={handleFilterDialogAction}
                            actions={actions}
                        />
                    </StandardCard>
                )}
                {step === 2 && (
                    <StandardCard title={stepTwoLocale.title} standardCardId={`standard_card-${componentId}-step-2`}>
                        <Grid container spacing={3}>
                            <Grid item>
                                <Typography variant="body2">{stepTwoLocale.subtext(list.data.length)}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formValues.hasLocation}
                                            onChange={handleCheckboxChange}
                                            name="hasLocation"
                                            id={`${componentIdLower}-location-checkbox`}
                                            data-testid={`${componentIdLower}-location-checkbox`}
                                            color="primary"
                                        />
                                    }
                                    label={stepTwoLocale.checkbox.location}
                                />
                            </Grid>
                            <AutoLocationPicker
                                id={componentId}
                                disabled={!formValues.hasLocation}
                                actions={actions}
                                location={location}
                                setLocation={handleLocationUpdate}
                                locale={locale.pages.general.locationPicker}
                                inputProps={{
                                    site: {
                                        error: formValues.hasLocation && location.site === -1,
                                    },
                                    building: {
                                        required: formValues.hasLocation && location.site !== -1,
                                        error:
                                            formValues.hasLocation && location.site !== -1 && location.building === -1,
                                    },
                                    floor: {
                                        required: formValues.hasLocation && location.building !== -1,
                                        error:
                                            formValues.hasLocation &&
                                            location.site !== -1 &&
                                            location.building !== -1 &&
                                            location.floor === -1,
                                    },
                                    room: {
                                        required: formValues.hasLocation && location.floor !== -1,
                                        error:
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
                            <Grid item xs={12} sm={3} padding={3} style={{ flex: 1 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={formValues.hasStatus}
                                                    onChange={handleCheckboxChange}
                                                    name="hasStatus"
                                                    id={`${componentIdLower}-status-checkbox`}
                                                    data-testid={`${componentIdLower}-status-checkbox`}
                                                    color="primary"
                                                />
                                            }
                                            label={stepTwoLocale.checkbox.status}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <AssetStatusSelector
                                            id={componentId}
                                            label="Asset status"
                                            onChange={handleChange('asset_status')}
                                            options={locale.config.assetStatusOptions.filter(
                                                option => option.value === 'DISCARDED',
                                            )}
                                            disabled={!formValues.hasStatus}
                                            required={formValues.hasStatus}
                                            classNames={{ formControl: classes.formControl }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={4} padding={3} style={{ flex: 1 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={formValues.hasAssetType}
                                                    onChange={handleCheckboxChange}
                                                    name="hasAssetType"
                                                    id={`${componentIdLower}-asset-type-checkbox`}
                                                    data-testid={`${componentIdLower}-asset-type-checkbox`}
                                                    color="primary"
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
                                            disabled={!formValues.hasAssetType}
                                            required={formValues.hasAssetType}
                                        />
                                    </Grid>
                                </Grid>
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
                                >
                                    {stepTwoLocale.button.submit}
                                </Button>
                            </Grid>
                        </Grid>
                    </StandardCard>
                )}
            </div>
            <ConfirmationAlert
                isOpen={snackbarAlert.visible}
                message={snackbarAlert.message}
                type={snackbarAlert.type}
                autoHideDuration={snackbarAlert.autoHideDuration}
                closeAlert={closeSnackbarAlert}
            />
        </StandardAuthPage>
    );
};

BulkAssetUpdate.propTypes = {
    actions: PropTypes.object,
    defaultFormValues: PropTypes.object,
};

export default React.memo(BulkAssetUpdate);
