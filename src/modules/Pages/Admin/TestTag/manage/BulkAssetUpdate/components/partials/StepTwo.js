import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useSelector } from 'react-redux';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import AutoLocationPicker from '../../../../SharedComponents/LocationPicker/AutoLocationPicker';
import AssetTypeSelector from '../../../../SharedComponents/AssetTypeSelector/AssetTypeSelector';
import AssetStatusSelector from '../../../../SharedComponents/AssetStatusSelector/AssetStatusSelector';
import MonthsSelector from '../../../../SharedComponents/MonthsSelector/MonthsSelector';
import AuthWrapper from '../../../../SharedComponents/AuthWrapper/AuthWrapper';
import { useLocation, useSelectLocation } from '../../../../SharedComponents/LocationPicker/LocationPickerHooks';

import locale from 'modules/Pages/Admin/TestTag/testTag.locale';

import { isValidRoomId, isValidAssetTypeId, isValidAssetStatus } from '../../../../Inspection/utils/helpers';
import { isEmptyObject, isEmptyStr } from '../../../../helpers/helpers';
import { PERMISSIONS } from '../../../../config/auth';
import { AccordionWithCheckbox } from '../AccordionWithCheckbox';
import { FormContext } from '../../../../helpers/hooks';

const moment = require('moment');

const validAssetStatusOptions = locale.pages.manage.bulkassetupdate.config.validAssetStatusOptions;

const StepTwo = ({ id, actions, list, excludedList, isFilterDialogOpen, prevStep, onSubmit }) => {
    const componentId = `${id}-step-two`;
    const componentIdLower = componentId.replace(/-/g, '_');

    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('md')) || false;
    const today = moment().format(locale.config.format.dateFormatNoTime);

    const pageLocale = locale.pages.manage.bulkassetupdate;
    const stepTwoLocale = pageLocale.form.step.two;
    const monthsOptions = pageLocale.config.monthsOptions;

    const currentFormValueSignature = useRef('{}');
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

    const handlePrevStep = () => {
        currentFormValueSignature.current = '{}';
        prevStep();
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

    React.useEffect(() => {
        // whenever form values change, we need to
        // revalidate the list against the new rules

        if (currentFormValueSignature.current !== formValueSignature) {
            currentFormValueSignature.current = formValueSignature;
            let listCopy = [...list.data, ...excludedList.data];
            const listToExclude = [];

            const targetDate = moment()
                .startOf('day')
                .add(formValues.monthRange, 'months');

            for (const asset of listCopy) {
                // if location
                if (formValues.hasLocation) {
                    // next inspection date range selected
                    if (formValues.monthRange !== '-1') {
                        const nextTestDueDate = moment(
                            asset.asset_next_test_due_date,
                            locale.config.format.dateFormatNoTime,
                        );
                        if (nextTestDueDate.isAfter(targetDate)) {
                            // exclude this asset
                            listToExclude.push(asset);
                            listCopy = listCopy.filter(item => item.asset_id !== asset.asset_id);
                            continue; // already excluded this asset, dont need further checks
                        }
                    }
                }
                // if asset status selected, validate
                if (formValues.hasAssetStatus) {
                    if (
                        [
                            locale.config.assetStatus.failed,
                            locale.config.assetStatus.outforrepair,
                            locale.config.assetStatus.discarded,
                            locale.config.assetStatus.awaitingtest,
                        ].includes(asset.asset_status)
                    ) {
                        // exclude this asset
                        listToExclude.push(asset);
                        listCopy = listCopy.filter(item => item.asset_id !== asset.asset_id);
                    }
                }
            }
            list.clear();
            excludedList.clear();
            list.importTransformedData(listCopy);
            excludedList.importTransformedData(listToExclude);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValueSignature]);

    const isLocationDisabled = formValues.hasAssetType || formValues.hasDiscardStatus;
    const isAssetStatusDisabled = formValues.hasAssetType || formValues.hasDiscardStatus;
    const isAssetTypeDisabled = formValues.hasLocation || formValues.hasDiscardStatus || formValues.hasAssetStatus;
    const isDiscardedDisabled =
        formValues.hasAssetType || formValues.hasLocation || formValues.hasClearNotes || formValues.hasAssetStatus;

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
                                disabled={!formValues.hasLocation}
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
                                    disabled={!formValues.hasLocation}
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
                                    disabled: !formValues.asset_status?.value,
                                    onClick: () => {
                                        handleChange('asset_status')('');
                                    },
                                },
                                checkbox: {
                                    name: 'hasAssetStatus',
                                    checked: formValues.hasAssetStatus,
                                    onClick: handleCheckboxChange,
                                },
                            }}
                        >
                            <Grid container>
                                <Grid xs={12} sm={6}>
                                    <AssetStatusSelector
                                        id={componentId}
                                        options={validAssetStatusOptions}
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
                                        disabled={!formValues.hasAssetType}
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
                            disabled={!formValues.hasDiscardStatus}
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
                        disabled={!validFormValues}
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
