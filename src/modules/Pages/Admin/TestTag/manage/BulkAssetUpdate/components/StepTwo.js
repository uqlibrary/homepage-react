import React, { useContext, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useSelector } from 'react-redux';

import isEqual from 'lodash/isEqual';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import AutoLocationPicker from '../../../SharedComponents/LocationPicker/AutoLocationPicker';
import AssetTypeSelector from '../../../SharedComponents/AssetTypeSelector/AssetTypeSelector';
import AssetStatusSelector from '../../../SharedComponents/AssetStatusSelector/AssetStatusSelector';
import MonthsSelector from '../../../SharedComponents/MonthsSelector/MonthsSelector';
import AuthWrapper from '../../../SharedComponents/AuthWrapper/AuthWrapper';
import { useLocation, useSelectLocation } from '../../../SharedComponents/LocationPicker/LocationPickerHooks';

import locale from 'modules/Pages/Admin/TestTag/testTag.locale';

import { isValidAssetTypeId } from '../../../Inspection/utils/helpers';
import { isEmptyStr } from '../../../helpers/helpers';
import { PERMISSIONS } from '../../../config/auth';
import { AccordionWithCheckbox } from './AccordionWithCheckbox';
import { FormContext } from '../../../helpers/hooks';
import { makeAssetExcludedMessage } from './utils';
import { validateFormValues, validateAssetLists } from './validation';
import { assetStatusOptionExcludes } from './rules';

const moment = require('moment');

const validAssetStatusOptions = locale.pages.manage.bulkassetupdate.config.validAssetStatusOptions;
const emptyAssetStatusOption = locale.pages.manage.bulkassetupdate.config.emptyAssetStatusOption;
const validAssetStatusWithLocationOptions =
    locale.pages.manage.bulkassetupdate.config.validAssetStatusWithLocationOptions;

const StepTwo = ({ id, actions, list, excludedList, isFilterDialogOpen, prevStep, onSubmit }) => {
    const componentId = `${id}-step-two`;
    const componentIdLower = componentId.replace(/-/g, '_');

    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('md')) || false;
    const today = moment().format(locale.config.format.dateFormatNoTime);

    const pageLocale = locale.pages.manage.bulkassetupdate;
    const stepTwoLocale = pageLocale.form.step.two;
    const monthsOptions = pageLocale.config.monthsOptions;

    const { formValues, handleChange, formValueSignature } = useContext(FormContext);

    const locationStore = useSelector(state => state.get('testTagLocationReducer'));
    const { location, setLocation } = useLocation(
        formValues.fullLocation?.site,
        formValues.fullLocation?.building,
        formValues.fullLocation?.floor,
        formValues.fullLocation?.room,
    );

    useSelectLocation({
        location,
        setLocation,
        actions,
        store: locationStore,
        condition: () => !isFilterDialogOpen,
    });

    // Validate and update lists when formValueSignature changes
    useEffect(() => {
        const { validAssets, excludedAssets } = validateAssetLists(formValues, list.data, excludedList.data);
        // Only update if lists actually changed
        const listsChanged = !isEqual(validAssets, list.data) || !isEqual(excludedAssets, excludedList.data);

        if (listsChanged) {
            list.clear();
            excludedList.clear();
            list.importTransformedData(validAssets);
            excludedList.importTransformedData(excludedAssets);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValueSignature]);

    const handlePrevStep = () => {
        prevStep();
    };

    const validFormValues = useMemo(() => validateFormValues(formValues), [formValues]);

    const isLocationDisabled = formValues.hasAssetType || formValues.hasDiscardStatus;
    const isAssetStatusDisabled = formValues.hasAssetType || formValues.hasDiscardStatus;
    const isAssetTypeDisabled = formValues.hasLocation || formValues.hasDiscardStatus || formValues.hasAssetStatus;
    const isDiscardedDisabled =
        formValues.hasAssetType || formValues.hasLocation || formValues.hasClearNotes || formValues.hasAssetStatus;
    const isClearNotesDisabled =
        isLocationDisabled && isAssetStatusDisabled && isAssetTypeDisabled && isDiscardedDisabled;

    const handleLocationUpdate = newLocation => {
        // because location relies on useSelectLocation to fire
        // the various API calls, we need to handle updates
        // to this component separate from the useFormValues handleChange
        const fullLocation = { ...location, ...newLocation };
        setLocation(newLocation);
        // and we only want to update when a room has been selected, as
        // that's all we're allowing the user to bulk change
        handleChange('fullLocation')(fullLocation);
        if (newLocation.room !== -1) {
            handleChange('location')(newLocation);
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

    return (
        <StandardCard title={stepTwoLocale.title} standardCardId={`standard_card-${componentId}-step-2`}>
            <Grid container spacing={3}>
                <Grid xs={12}>
                    <Alert
                        severity="warning"
                        id={`${componentIdLower}-summary-alert`}
                        data-testid={`${componentIdLower}-summary-alert`}
                    >
                        {pageLocale.form.alert.alertMessageAssetsChosen(
                            list.data.length,
                            locale.pages.general.pluraliser,
                        )}
                        {pageLocale.form.alert.alertMessageAssetsExcluded(
                            excludedList.data,
                            locale.pages.general.pluraliser,
                            makeAssetExcludedMessage({ excludedList }),
                        )}
                    </Alert>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid xs={12}>
                    <AccordionWithCheckbox
                        id="location"
                        label={stepTwoLocale.checkbox.location}
                        disabled={isLocationDisabled}
                        slotProps={{
                            accordion: {
                                defaultExpanded: true,
                                expanded: formValues.hasLocation,
                            },
                            accordionActions: {
                                'data-testid': `${componentIdLower}-location-accordion-action`,
                                disabled: !formValues.location,
                                onClick: () => {
                                    handleLocationUpdate({ site: -1, building: -1, floor: -1, room: -1 });
                                    handleChange('monthRange')('-1');
                                },
                            },
                            checkbox: {
                                name: 'hasLocation',
                                checked: formValues.hasLocation,
                                onClick: handleCheckboxChange,
                            },
                        }}
                    >
                        <Grid container spacing={3}>
                            <AutoLocationPicker
                                id={componentId}
                                disabled={isLocationDisabled}
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
                            <Grid xs={12} sm={4}>
                                <MonthsSelector
                                    id={componentId}
                                    disabled={isLocationDisabled}
                                    label={stepTwoLocale.filterToDateLabel}
                                    options={monthsOptions}
                                    currentValue={formValues.monthRange}
                                    required={false}
                                    responsive
                                    onChange={handleChange('monthRange')}
                                    nextDateTextFormatter={stepTwoLocale.filterToDateFormatted}
                                    fromDate={today}
                                    fromDateFormat={locale.pages.report.config.dateFormat}
                                    dateDisplayFormat={locale.pages.report.config.dateFormatDisplay}
                                    classNames={{
                                        formControl: 'formControl',
                                        select: 'formSelect',
                                        nextDateLabel: 'nextDateLabel',
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </AccordionWithCheckbox>
                    <AuthWrapper requiredPermissions={[PERMISSIONS.can_alter]}>
                        <AccordionWithCheckbox
                            id="assetStatus"
                            label={stepTwoLocale.checkbox.assetStatus}
                            disabled={isAssetStatusDisabled}
                            slotProps={{
                                accordion: {
                                    expanded: formValues.hasAssetStatus,
                                },
                                accordionActions: {
                                    'data-testid': `${componentIdLower}-asset-status-accordion-action`,
                                    disabled: !formValues.asset_status?.value,
                                    onClick: () => {
                                        handleChange('asset_status')(emptyAssetStatusOption);
                                    },
                                },
                                checkbox: {
                                    name: 'hasAssetStatus',
                                    checked: formValues.hasAssetStatus,
                                    onClick: handleCheckboxChange,
                                },
                            }}
                        >
                            <Grid container spacing={3}>
                                <Grid xs={12}>
                                    <Typography variant="body2">
                                        Selecting this option will exclude any chosen assets with status:{' '}
                                        {assetStatusOptionExcludes.join(', ')}
                                    </Typography>
                                </Grid>
                                <Grid xs={12} sm={6}>
                                    <AssetStatusSelector
                                        id={componentId}
                                        options={
                                            formValues.hasLocation
                                                ? validAssetStatusWithLocationOptions
                                                : validAssetStatusOptions
                                        }
                                        label={pageLocale.form.assetStatus.label}
                                        actions={actions}
                                        onChange={handleChange('asset_status')}
                                        required={formValues.hasAssetStatus}
                                        value={formValues.asset_status}
                                        disabled={!formValues.hasAssetStatus}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionWithCheckbox>
                    </AuthWrapper>
                    <AuthWrapper requiredPermissions={[PERMISSIONS.can_inspect]}>
                        <AccordionWithCheckbox
                            id="assetType"
                            label={stepTwoLocale.checkbox.assetType}
                            disabled={isAssetTypeDisabled}
                            slotProps={{
                                accordion: {
                                    expanded: formValues.hasAssetType,
                                },
                                accordionActions: {
                                    'data-testid': `${componentIdLower}-asset-type-accordion-action`,
                                    disabled: !formValues?.asset_type,
                                    onClick: () => {
                                        handleChange('asset_type')('');
                                    },
                                },
                                checkbox: {
                                    name: 'hasAssetType',
                                    checked: formValues.hasAssetType,
                                    onClick: handleCheckboxChange,
                                },
                            }}
                        >
                            <Grid container>
                                <Grid xs={12} sm={6}>
                                    <AssetTypeSelector
                                        id={componentId}
                                        locale={pageLocale.form.assetType}
                                        actions={actions}
                                        onChange={handleChange('asset_type')}
                                        required={formValues.hasAssetType}
                                        value={formValues.asset_type?.asset_type_id}
                                        validateAssetTypeId={isValidAssetTypeId}
                                        disabled={isAssetTypeDisabled}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionWithCheckbox>
                    </AuthWrapper>
                    <AccordionWithCheckbox
                        id="discardStatus"
                        label={stepTwoLocale.checkbox.discardAsset}
                        disabled={isDiscardedDisabled}
                        slotProps={{
                            accordion: {
                                expanded: formValues.hasDiscardStatus,
                            },
                            accordionActions: {
                                'data-testid': `${componentIdLower}-discard-status-accordion-action`,
                                disabled: !formValues?.discard_reason,
                                onClick: () => {
                                    handleChange('discard_reason')('');
                                },
                            },
                            checkbox: {
                                name: 'hasDiscardStatus',
                                checked: formValues.hasDiscardStatus,
                                onClick: handleCheckboxChange,
                            },
                        }}
                    >
                        <TextField
                            {...stepTwoLocale.discardReason}
                            required={formValues.hasDiscardStatus}
                            error={formValues.hasDiscardStatus && isEmptyStr(formValues.discard_reason)}
                            multiline
                            minRows={3}
                            variant="standard"
                            id={`${componentIdLower}-discard-reason-input`}
                            InputProps={{ fullWidth: true }}
                            InputLabelProps={{
                                shrink: true,
                                htmlFor: `${componentIdLower}-discard-reason-input`,
                            }}
                            inputProps={{
                                'data-testid': `${componentIdLower}-discard-reason-input`,
                            }}
                            value={formValues?.discard_reason ?? ''}
                            onChange={handleChange('discard_reason')}
                            fullWidth
                            disabled={isDiscardedDisabled}
                        />
                    </AccordionWithCheckbox>
                </Grid>
            </Grid>

            <Grid container spacing={3} mt={3}>
                <Grid xs={12} sm={6}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={!formValues.hasDiscardStatus && formValues.hasClearNotes}
                                disabled={isClearNotesDisabled}
                                onChange={handleCheckboxChange}
                                name="hasClearNotes"
                                id={`${componentIdLower}-notes-checkbox`}
                                color="primary"
                                data-testid={`${componentIdLower}-notes-checkbox`}
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
                        onClick={handlePrevStep}
                        id={`${componentIdLower}-back-button`}
                        data-testid={`${componentIdLower}-back-button`}
                        fullWidth={isMobileView}
                    >
                        {pageLocale.form.step.button.previous}
                    </Button>
                </Grid>
                <Grid xs={12} sm={6} container justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onSubmit}
                        id={`${componentIdLower}-submit-button`}
                        data-testid={`${componentIdLower}-submit-button`}
                        disabled={!validFormValues || list.data.length === 0}
                        fullWidth={isMobileView}
                    >
                        {pageLocale.form.step.button.submit}
                    </Button>
                </Grid>
            </Grid>
        </StandardCard>
    );
};
StepTwo.propTypes = {
    id: PropTypes.string.isRequired,
    list: PropTypes.object.isRequired,
    excludedList: PropTypes.object.isRequired,
    isFilterDialogOpen: PropTypes.bool.isRequired,
    actions: PropTypes.object,
    prevStep: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default React.memo(StepTwo);
