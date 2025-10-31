import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import { useSelector } from 'react-redux';

import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

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

import locale from 'modules/Pages/Admin/TestTag/testTag.locale';

import config from './config';
import { PERMISSIONS } from '../../../config/auth';
import {
    isValidRoomId,
    isValidAssetId,
    isValidAssetTypeId,
    isValidAssetStatus,
} from '../../../Inspection/utils/helpers';
import { isEmptyObject, isEmptyStr } from '../../../helpers/helpers';
import { useForm, useObjectList, useConfirmationAlert, useAccountUser } from '../../../helpers/hooks';
import { transformRow, transformRequest } from './utils';
import AuthWrapper from '../../../SharedComponents/AuthWrapper/AuthWrapper';
import { breadcrumbs } from 'config/routes';

const StyledWrapper = styled('div')(({ theme }) => ({
    flexGrow: 1,
    '& .actionButtons': {
        marginTop: theme.spacing(2),
    },
    '& .centredGrid': { display: 'flex', alignItems: 'center', justifyContent: 'center' },
    '& .centredGridNoJustify': {
        display: 'flex',
        alignItems: 'center',
    },
}));

const componentId = 'bulk-asset-update';
const componentIdLower = 'bulk_asset_update';
const validAssetStatusOptions = locale.pages.manage.bulkassetupdate.config.validAssetStatusOptions;

const BulkAssetUpdate = ({ actions, defaultFormValues }) => {
    const pageLocale = locale.pages.manage.bulkassetupdate;
    const stepOneLocale = pageLocale.form.step.one;
    const stepTwoLocale = pageLocale.form.step.two;

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
    const isMobileView = useMediaQuery(theme.breakpoints.down('md')) || false;

    const { user } = useAccountUser();

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
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.testntag.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.testntag.pathname);

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

        const validAssetStatus =
            !formValues.hasAssetStatus ||
            (!isEmptyObject(formValues.asset_status) &&
                isValidAssetStatus(formValues.asset_status?.value, validAssetStatusOptions));

        const isValid =
            (formValues.hasLocation ||
                formValues.hasDiscardStatus ||
                formValues.hasAssetType ||
                formValues.hasClearNotes ||
                formValues.hasAssetStatus) &&
            validLocation &&
            validDiscardStatus &&
            validAssetType &&
            validAssetStatus;

        return isValid;
    }, [
        formValues.discard_reason,
        formValues.asset_type,
        formValues.asset_status,
        formValues.hasAssetType,
        formValues.hasLocation,
        formValues.hasDiscardStatus,
        formValues.hasAssetStatus,
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
            <StyledWrapper>
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
                                          size={15}
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
                            <Grid xs={12} md={4}>
                                <AssetSelector
                                    id={componentId}
                                    locale={stepOneLocale}
                                    user={user}
                                    classNames={{ formControl: 'formControl' }}
                                    onChange={handleSearchAssetIdChange}
                                    validateAssetId={isValidAssetId}
                                    canAddNew={false}
                                    required={false}
                                    clearOnSelect
                                    filter={{ status: { discarded: false } }}
                                />
                            </Grid>
                            <Grid xs={12} md={2} className={'centredGrid'}>
                                or
                            </Grid>
                            <Grid xs={12} md={6} className={'centredGridNoJustify'}>
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
                                <Grid xs={12}>
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
                            <Grid sx={{ flex: 1 }}>
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
                                            className: 'actionButtons',
                                        },
                                    }}
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
                            <Grid xs={12}>
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
                            <Grid xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={!!formValues.hasLocation && !formValues.hasDiscardStatus}
                                            onChange={handleCheckboxChange}
                                            name="hasLocation"
                                            id={`${componentIdLower}-location-checkbox`}
                                            data-testid={`${componentIdLower}-location-checkbox`}
                                            color="primary"
                                            disabled={formValues.hasDiscardStatus || formValues.hasAssetStatus}
                                        />
                                    }
                                    label={stepTwoLocale.checkbox.location}
                                />
                            </Grid>
                            <AutoLocationPicker
                                id={componentId}
                                disabled={
                                    !formValues.hasLocation || formValues.hasDiscardStatus || formValues.hasAssetStatus
                                }
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

                        <Grid container spacing={0} padding={0} mt={3}>
                            <AuthWrapper requiredPermissions={[PERMISSIONS.can_inspect]}>
                                <Grid xs={12} sm={6} sx={{ paddingRight: { xs: 0, sm: 2 } }}>
                                    <Grid container spacing={3}>
                                        <Grid xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={
                                                            !!formValues.hasAssetType && !formValues.hasDiscardStatus
                                                        }
                                                        onChange={handleCheckboxChange}
                                                        name="hasAssetType"
                                                        id={`${componentIdLower}-asset-type-checkbox`}
                                                        data-testid={`${componentIdLower}-asset-type-checkbox`}
                                                        color="primary"
                                                        disabled={
                                                            formValues.hasDiscardStatus || formValues.hasAssetStatus
                                                        }
                                                    />
                                                }
                                                label={stepTwoLocale.checkbox.assetType}
                                            />
                                        </Grid>
                                        <Grid xs={12}>
                                            <AssetTypeSelector
                                                id={componentId}
                                                locale={pageLocale.form.assetType}
                                                actions={actions}
                                                onChange={handleChange('asset_type')}
                                                disabled={
                                                    !formValues.hasAssetType ||
                                                    formValues.hasDiscardStatus ||
                                                    formValues.hasAssetStatus
                                                }
                                                required={formValues.hasAssetType}
                                                value={formValues.asset_type?.asset_type_id}
                                                validateAssetTypeId={isValidAssetTypeId}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </AuthWrapper>
                            <Grid xs={12} sm={6} sx={{ marginTop: { xs: 3, sm: 0 } }}>
                                <Grid container spacing={3}>
                                    <Grid xs={12} width={'100%'}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={
                                                        !!formValues.hasDiscardStatus &&
                                                        !formValues.hasAssetType &&
                                                        !formValues.hasLocation &&
                                                        !formValues.hasClearNotes &&
                                                        !formValues.hasAssetStatus
                                                    }
                                                    disabled={
                                                        formValues.hasAssetType ||
                                                        formValues.hasLocation ||
                                                        formValues.hasAssetStatus ||
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
                                    <Grid xs={12} width={'100%'}>
                                        <TextField
                                            {...stepTwoLocale.discardReason}
                                            required={formValues.hasDiscardStatus}
                                            error={formValues.hasDiscardStatus && isEmptyStr(formValues.discard_reason)}
                                            multiline
                                            minRows={1}
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
                                                formValues.hasAssetStatus ||
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
                        <Grid container spacing={0} padding={0} mt={3}>
                            <AuthWrapper requiredPermissions={[PERMISSIONS.can_alter]}>
                                <Grid xs={12} sm={6} sx={{ paddingRight: { xs: 0, sm: 2 } }}>
                                    <Grid container spacing={3}>
                                        <Grid xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={
                                                            !!formValues.hasAssetStatus &&
                                                            !formValues.hasDiscardStatus &&
                                                            !formValues.hasAssetType &&
                                                            !formValues.hasLocation &&
                                                            !formValues.hasClearNotes
                                                        }
                                                        onChange={handleCheckboxChange}
                                                        name="hasAssetStatus"
                                                        id={`${componentIdLower}-asset-status-checkbox`}
                                                        data-testid={`${componentIdLower}-asset-status-checkbox`}
                                                        color="primary"
                                                        disabled={
                                                            formValues.hasAssetType ||
                                                            formValues.hasLocation ||
                                                            formValues.hasClearNotes ||
                                                            formValues.hasDiscardStatus
                                                        }
                                                    />
                                                }
                                                label={stepTwoLocale.checkbox.assetStatus}
                                            />
                                        </Grid>
                                        <Grid xs={12}>
                                            <AssetStatusSelector
                                                id={componentId}
                                                options={validAssetStatusOptions}
                                                label={pageLocale.form.assetStatus.label}
                                                actions={actions}
                                                onChange={handleChange('asset_status')}
                                                disabled={
                                                    !formValues.hasAssetStatus ||
                                                    formValues.hasAssetType ||
                                                    formValues.hasLocation ||
                                                    formValues.hasClearNotes ||
                                                    formValues.hasDiscardStatus
                                                }
                                                required={formValues.hasAssetStatus}
                                                value={formValues.asset_status?.value}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </AuthWrapper>
                        </Grid>
                        <Grid container spacing={3} mt={3}>
                            <Grid xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={!formValues.hasDiscardStatus && !!formValues.hasClearNotes}
                                            disabled={formValues.hasDiscardStatus || formValues.hasAssetStatus}
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
                        <Grid container spacing={4} padding={2} className={'actionButtons'}>
                            <Grid xs={12} sm={6} container justifyContent="flex-start">
                                <Button
                                    variant="outlined"
                                    onClick={handlePrevStepButton}
                                    id={`${componentIdLower}-back-button`}
                                    data-testid={`${componentIdLower}-back-button`}
                                    fullWidth={isMobileView}
                                >
                                    {stepTwoLocale.button.previous}
                                </Button>
                            </Grid>
                            <Grid xs={12} sm={6} container justifyContent="flex-end">
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
            </StyledWrapper>
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
