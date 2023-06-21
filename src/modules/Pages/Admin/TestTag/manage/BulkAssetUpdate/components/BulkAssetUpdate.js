import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import DataTable from './../../../SharedComponents/DataTable/DataTable';
import FilterDialog from './FilterDialog';
import { useDataTableColumns } from '../../../SharedComponents/DataTable/DataTableHooks';
import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import AutoLocationPicker from '../../../SharedComponents/LocationPicker/AutoLocationPicker';
import AssetSelector from '../../../SharedComponents/AssetSelector/AssetSelector';
import AssetTypeSelector from '../../../SharedComponents/AssetTypeSelector/AssetTypeSelector';
import AssetStatusSelector from '../../../SharedComponents/AssetStatusSelector/AssetStatusSelector';
import FooterBar from '../../../SharedComponents/DataTable/FooterBar';
import locale from '../../../testTag.locale';
import config from './config';
import { PERMISSIONS } from '../../../config/auth';
import { isValidAssetId } from '../../../Inspection/utils/helpers';
import { createLocationString } from '../../../helpers/helpers';
import { useLocation, useSelectLocation } from '../../../SharedComponents/LocationPicker/LocationPickerHooks';
import { useForm, useObjectList } from '../../../helpers/hooks';

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
}));

export const transformRow = row => {
    console.log('>>ROW', row);
    return row.map(line => {
        if (!!line?.asset_location) return line;
        return {
            ...line,
            asset_type_name: line?.asset_type?.asset_type_name ?? '',
            asset_location: !!line?.last_location
                ? createLocationString({
                      site: line.last_location.site_id_displayed,
                      building: line.last_location.building_id_displayed,
                      floor: line.last_location.floor_id_displayed,
                      room: line.last_location.room_id_displayed,
                  })
                : '',
        };
    });
};

const BulkAssetUpdate = ({ actions, defaultFormValues }) => {
    const pageLocale = locale.pages.manage.bulkassetupdate;
    const stepOneLocale = pageLocale.form.step.one;
    const stepTwoLocale = pageLocale.form.step.two;
    const classes = useStyles();
    const list = useObjectList([], transformRow);
    const [step, setStep] = useState(1);
    const assignAssetDefaults = () => ({ ...defaultFormValues });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { formValues, resetFormValues, handleChange } = useForm({
        defaultValues: { ...assignAssetDefaults() },
    });
    const locationStore = useSelector(state => state.get('testTagLocationReducer'));
    const { location, setLocation } = useLocation();
    const { selectedLocation } = useSelectLocation({
        location,
        setLocation,
        actions,
        store: locationStore,
    });

    useEffect(() => {
        console.log('effect', list.data);
        handleChange('asset_list')(list.data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list.data]);

    useEffect(() => {
        console.log('formValues', formValues);
    }, [formValues]);
    const handleSearchAssetIdChange = useCallback(
        newValue => {
            console.log(newValue);
            list.addStart(newValue);
        },
        [list],
    );

    const resetForm = () => {
        const newFormValues = assignAssetDefaults();
        resetFormValues(newFormValues);
        list.clear();
    };

    const handleDeleteClick = useCallback(
        ({ id, api }) => {
            const row = api.getRow(id);
            console.log(row, list);
            list.deleteWith('asset_id', row.asset_id);
        },
        [list],
    );

    const { columns } = useDataTableColumns({
        config: config.form,
        locale: pageLocale.form.columns,
        handleDeleteClick,
    });

    const handleNextStepButton = e => {
        console.log('handleNextStepButton', e, formValues);
        setStep(2);
    };
    const handlePrevStepButton = e => {
        console.log('handlePrevStepButton', e, formValues);
        setStep(1);
    };

    const openDialog = () => setIsDialogOpen(true);
    const closeDialog = () => setIsDialogOpen(false);
    const handleDialogClose = () => closeDialog();
    const handleDialogAction = data => {
        closeDialog();
        console.log('handleDialogAction', data);
        list.addStart(data);
    };

    const handleOnSubmit = e => {
        console.log('submit', e);
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

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_inspect]}
        >
            <div className={classes.root}>
                {step === 1 && (
                    <StandardCard title={stepOneLocale.title}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                                <AssetSelector
                                    id="assetId"
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
                            <Grid
                                item
                                xs={12}
                                sm={2}
                                alignItems="center"
                                style={{ display: 'flex' }}
                                justifyContent="center"
                            >
                                or
                            </Grid>
                            <Grid item xs={12} sm={6} alignItems="center" style={{ display: 'flex' }}>
                                <Button
                                    variant="outlined"
                                    id="addByFeatureButton"
                                    data-testid="addByFeatureButton"
                                    color="primary"
                                    onClick={openDialog}
                                >
                                    {stepOneLocale.button.findAndAdd}
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item padding={3} style={{ flex: 1 }}>
                                <DataTable
                                    rows={list.data}
                                    columns={columns}
                                    rowId={'asset_id'}
                                    classes={{ root: classes.gridRoot }}
                                    handleDeleteClick={handleDeleteClick}
                                    components={{ Footer: FooterBar }}
                                    componentsProps={{
                                        footer: {
                                            id: 'bulkAssetUpdate',
                                            actionLabel: stepOneLocale.button.next,
                                            altLabel: stepOneLocale.button.clear,
                                            onAltClick: resetForm,
                                            onActionClick: handleNextStepButton,
                                            nextButtonProps: { disabled: list.data.length === 0 },
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <FilterDialog
                            locale={pageLocale.form.filterDialog}
                            assetTypeLocale={pageLocale.form.assetType}
                            locationLocale={locale.pages.general.locationPicker}
                            minContentWidth={'100%'}
                            config={config.filterDialog}
                            isOpen={isDialogOpen}
                            onCancel={handleDialogClose}
                            onAction={handleDialogAction}
                            actions={actions}
                        />
                    </StandardCard>
                )}
                {step === 2 && (
                    <StandardCard title={stepTwoLocale.title}>
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
                                            id="bulkAssetUpdateLocationCheckbox"
                                            data-testid="bulkAssetUpdateLocationCheckbox"
                                            color="primary"
                                        />
                                    }
                                    label={stepTwoLocale.checkbox.location}
                                />
                            </Grid>
                            <AutoLocationPicker
                                disabled={!formValues.hasLocation}
                                actions={actions}
                                location={location}
                                setLocation={handleLocationUpdate}
                                locale={locale.pages.general.locationPicker}
                                inputProps={{
                                    site: {
                                        error: location.site === -1,
                                    },
                                    building: {
                                        required: location.site !== -1,
                                        error: location.site !== -1 && location.building === -1,
                                    },
                                    floor: {
                                        required: location.building !== -1,
                                        error:
                                            location.site !== -1 && location.building !== -1 && location.floor === -1,
                                    },
                                    room: {
                                        required: location.floor !== -1,
                                        error:
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
                                                    id="bulkAssetUpdateStatusCheckbox"
                                                    data-testid="bulkAssetUpdateStatusCheckbox"
                                                    color="primary"
                                                />
                                            }
                                            label={stepTwoLocale.checkbox.status}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <AssetStatusSelector
                                            id="bulkUpdate"
                                            label="Asset status"
                                            onChange={handleChange('asset_status')}
                                            options={locale.config.assetStatusOptions.filter(
                                                option => option.value === 'DISCARDED',
                                            )}
                                            disabled={!formValues.hasStatus}
                                            required={formValues.hasStatus}
                                            error={formValues.hasStatus && formValues.asset_status === undefined}
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
                                                    id="bulkAssetUpdateAssetTypeCheckbox"
                                                    data-testid="bulkAssetUpdateAssetTypeCheckbox"
                                                    color="primary"
                                                />
                                            }
                                            label={stepTwoLocale.checkbox.assetType}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <AssetTypeSelector
                                            id="bulkUpdate"
                                            locale={pageLocale.form.assetType}
                                            actions={actions}
                                            onChange={handleChange('asset_type')}
                                            disabled={!formValues.hasAssetType}
                                            required={formValues.hasAssetType}
                                            error={formValues.hasAssetType && formValues.asset_type === undefined}
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
                                    id="bulkUpdateBackButton"
                                    data-testid="bulkUpdateBackButton"
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
                                    id="bulkUpdateSubmitButton"
                                    data-testid="bulkUpdateSubmitButton"
                                >
                                    {stepTwoLocale.button.submit}
                                </Button>
                            </Grid>
                        </Grid>
                    </StandardCard>
                )}
            </div>
        </StandardAuthPage>
    );
};

BulkAssetUpdate.propTypes = {
    actions: PropTypes.object,
    defaultFormValues: PropTypes.object,
};

export default React.memo(BulkAssetUpdate);
