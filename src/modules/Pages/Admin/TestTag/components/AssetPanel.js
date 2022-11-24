import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { useTheme } from '@material-ui/core';

import { Grid } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import TabPanel from './TabPanel';
import LastTestPanel from './LastTestPanel';
import {
    isValidAssetId,
    isValidAssetTypeId,
    isValidTestingDeviceId,
    isValidFailReason,
    isValidRepair,
    isValidDiscard,
    statusEnum,
} from '../utils/helpers';

import { transformer } from '../utils/transformers';

import locale from '../testTag.locale';

const moment = require('moment');

const filter = createFilterOptions();

const a11yProps = index => ({
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
});

const testStatusEnum = statusEnum(locale);

export const transformerRules = (passValue, failValue) => ({
    asset_barcode: data => {
        const id = data.asset_barcode;
        delete data.asset_barcode;
        return { asset_id_displayed: id };
    },
    with_inspection: data => {
        if (data.with_inspection.inspection_status === passValue) {
            data.with_inspection.inspection_fail_reason = null;
        }

        if (data.with_inspection.inspection_status === failValue) {
            data.with_inspection.inspection_date_next = undefined;
        }
        return { with_inspection: data.with_inspection };
    },
    with_repair: data => {
        if (data.with_repair.isRepair) {
            data.with_discarded.discard_reason = null;
        } else {
            data.with_repair.repairer_contact_details = null;
        }
        delete data.with_repair.isRepair;
        return { with_repair: data.with_repair, with_discarded: data.with_discarded };
    },
    with_discarded: data => {
        if (data.with_discarded.isDiscarded) {
            data.with_repair.repairer_contact_details = null;
        } else {
            data.with_discarded.discard_reason = null;
        }
        delete data.with_discarded.isDiscarded;
        return { with_repair: data.with_repair, with_discarded: data.with_discarded };
    },
});

const AssetPanel = ({
    actions,
    currentRetestList,
    currentAssetOwnersList,
    formValues,
    selectedAsset,
    location,
    assetsSearch,
    assignCurrentAsset,
    handleChange,
    focusElementRef,
    defaultNextTestDateValue,
    classes,
    saveInspectionSaving,
    isMobileView,
    isValid,
} = {}) => {
    AssetPanel.propTypes = {
        actions: PropTypes.any.isRequired,
        currentRetestList: PropTypes.array.isRequired,
        currentAssetOwnersList: PropTypes.array.isRequired,
        formValues: PropTypes.object.isRequired,
        selectedAsset: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        assetsSearch: PropTypes.func.isRequired,
        assignCurrentAsset: PropTypes.func.isRequired,
        handleChange: PropTypes.func.isRequired,
        focusElementRef: PropTypes.any.isRequired,
        defaultNextTestDateValue: PropTypes.number.isRequired,
        classes: PropTypes.object.isRequired,
        saveInspectionSaving: PropTypes.bool,
        isMobileView: PropTypes.bool,
        isValid: PropTypes.bool,
    };

    const theme = useTheme();
    const { initConfig, initConfigLoading } = useSelector(state => state.get?.('testTagOnLoadReducer'));
    const { assetsList, assetsListLoading } = useSelector(state => state.get?.('testTagAssetsReducer'));

    const [formAssetList, setFormAssetList] = useState(assetsList ?? []);
    const [formNextTestDate, setFormNextTestDate] = useState(defaultNextTestDateValue);
    const [selectedTabValue, setSelectedTabValue] = useState(0);

    React.useEffect(() => {
        !!assetsList && setFormAssetList(...[assetsList]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetsList]);

    const saveForm = () => {
        if (isValid && !saveInspectionSaving) {
            const transformedData = transformer(
                formValues,
                transformerRules(testStatusEnum.PASSED.value, testStatusEnum.FAILED.value),
            );
            console.log('saveForm', formValues, transformedData);
            actions.saveInspection(transformedData);
        }
    };

    useEffect(() => {
        console.log('date effect', formValues.with_inspection);
        if (formValues?.with_inspection?.inspection_status === testStatusEnum.PASSED.value) {
            handleChange('with_inspection.inspection_date_next')(moment().add(formNextTestDate, 'months'));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues?.with_inspection?.inspection_status, formNextTestDate]);

    return (
        <StandardCard title={locale.form.asset.title} style={{ marginTop: '30px' }}>
            <Grid container spacing={3}>
                <Grid xs={12} item sm={6} md={3}>
                    <FormControl className={classes.formControl} fullWidth>
                        <Autocomplete
                            fullWidth
                            onChange={(event, newValue) => {
                                if (typeof newValue === 'string') {
                                    assignCurrentAsset({ asset_barcode: newValue, isNew: true });
                                } else if (newValue && newValue.inputValue) {
                                    // Create a new value from the user input
                                    assignCurrentAsset({
                                        asset_barcode: newValue.inputValue,
                                        isNew: true,
                                    });
                                } else {
                                    assignCurrentAsset(newValue);
                                }
                            }}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);
                                // Suggest the creation of a new value
                                if (params.inputValue !== '') {
                                    filtered.push({
                                        inputValue: params.inputValue,
                                        asset_barcode: locale.form.asset.addText(params.inputValue),
                                    });
                                }

                                return filtered;
                            }}
                            selectOnFocus
                            handleHomeEndKeys
                            options={formAssetList}
                            getOptionLabel={option => {
                                // Value selected with enter, right from the input
                                if (typeof option === 'string') {
                                    return option;
                                }
                                // Add "xxx" option created dynamically
                                if (option.inputValue) {
                                    return option.inputValue;
                                }
                                // Regular option
                                return `${option.asset_barcode ?? ''}`;
                            }}
                            renderOption={option => option.asset_barcode}
                            freeSolo
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    {...locale.form.asset.assetId}
                                    ref={focusElementRef}
                                    required
                                    error={!isValidAssetId(formValues.asset_barcode)}
                                    variant="standard"
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {!!assetsListLoading ? (
                                                    <CircularProgress color="inherit" size={20} />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                    onChange={e => assetsSearch(e.target.value)}
                                />
                            )}
                            loading={!!assetsListLoading}
                        />
                    </FormControl>
                </Grid>
                <Grid xs={12} item sm={6}>
                    <FormControl className={classes.formControl} fullWidth>
                        <Autocomplete
                            fullWidth
                            options={initConfig?.asset_types ?? []}
                            value={
                                initConfig?.asset_types?.find(
                                    assetType => assetType.asset_type_id === formValues.asset_type_id,
                                ) ?? ''
                            }
                            onChange={(_, newValue) => {
                                handleChange('asset_type_id')(newValue.asset_type_id);
                            }}
                            getOptionLabel={option => option.asset_type_name}
                            getOptionSelected={(option, value) => option.asset_type_id === value.asset_type_id}
                            autoHighlight
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    {...locale.form.asset.assetType}
                                    required
                                    error={
                                        isValidAssetId(formValues.asset_barcode) &&
                                        !isValidAssetTypeId(formValues.asset_type_id)
                                    }
                                    variant="standard"
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {initConfigLoading ? (
                                                    <CircularProgress color="inherit" size={20} />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                />
                            )}
                            disabled={initConfigLoading}
                            disableClearable
                            autoSelect
                            loading={!!initConfigLoading}
                        />
                    </FormControl>
                </Grid>
                <Grid xs={12} item sm={6} md={3}>
                    <FormControl className={classes.formControl} fullWidth>
                        <InputLabel shrink>{locale.form.asset.ownerLabel}</InputLabel>
                        <Select className={classes.formSelect} value={formValues.asset_department_owned_by}>
                            {currentAssetOwnersList.map(owner => (
                                <MenuItem value={owner.value} key={owner.value}>
                                    {owner.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <LastTestPanel
                asset={selectedAsset ?? {}}
                currentLocation={location}
                dateFormatPattern={locale.config.dateFormatDisplay}
                disabled={!!!selectedAsset?.last_test?.test_status ?? true}
                forceOpen={selectedAsset?.asset_status === testStatusEnum.DISCARDED.value}
                testStatusEnums={testStatusEnum}
                locale={locale.form.lastTestPanel}
            />
            <StandardCard
                title={locale.form.inspection.title}
                style={{ marginTop: 30, marginBottom: 30 }}
                smallTitle
                variant="outlined"
                noPadding={selectedAsset?.asset_status === testStatusEnum.DISCARDED.value}
            >
                <Collapse in={selectedAsset?.asset_status !== testStatusEnum.DISCARDED.value} timeout="auto">
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl className={classes.formControl} fullWidth>
                                <InputLabel required htmlFor="testResultTestingDevice">
                                    {locale.form.inspection.deviceLabel}
                                </InputLabel>
                                <Select
                                    fullWidth
                                    className={classes.formSelect}
                                    id="testResultTestingDevice"
                                    value={formValues?.with_inspection?.inspection_device_id ?? ''}
                                    onChange={e => handleChange('with_inspection.inspection_device_id')(e.target.value)}
                                    required
                                    error={!isValidTestingDeviceId(formValues.with_inspection.inspection_device_id)}
                                >
                                    {!!initConfigLoading && (
                                        <MenuItem value={-1} disabled key={'devicetypes-loading'}>
                                            {locale.form.loading}
                                        </MenuItem>
                                    )}
                                    {!!!initConfigLoading &&
                                        !!initConfig &&
                                        !!initConfig?.inspection_devices &&
                                        initConfig?.inspection_devices?.length > 0 &&
                                        initConfig.inspection_devices.map(device => (
                                            <MenuItem value={device.device_id} key={device.device_id}>
                                                {device.device_model_name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Box margin={1}>
                                <InputLabel shrink required htmlFor="testResultToggleButtons">
                                    {locale.form.inspection.testResultLabel}
                                </InputLabel>
                                <ToggleButtonGroup
                                    value={formValues?.with_inspection?.inspection_status ?? testStatusEnum.NONE.value}
                                    exclusive
                                    id="testResultToggleButtons"
                                    size={isMobileView ? 'large' : 'small'}
                                    defaultChecked={false}
                                    onChange={(_, child) => {
                                        handleChange('with_inspection.inspection_status')(child);
                                    }}
                                    style={{ display: 'flex' }}
                                >
                                    <ToggleButton
                                        value={testStatusEnum.PASSED.value}
                                        aria-label={testStatusEnum.PASSED.label}
                                        style={{
                                            backgroundColor:
                                                formValues?.with_inspection?.inspection_status ===
                                                testStatusEnum.PASSED.value
                                                    ? theme.palette.success.main
                                                    : theme.palette.grey[300],
                                            color:
                                                formValues?.with_inspection?.inspection_status ===
                                                testStatusEnum.PASSED.value
                                                    ? theme.palette.primary.contrastText
                                                    : theme.palette.text.main,
                                        }}
                                        classes={{ sizeLarge: classes.toggleButtonMobile }}
                                    >
                                        <DoneIcon /> {testStatusEnum.PASSED.label}
                                    </ToggleButton>
                                    <ToggleButton
                                        value={testStatusEnum.FAILED.value}
                                        aria-label={testStatusEnum.FAILED.label}
                                        style={{
                                            backgroundColor:
                                                formValues?.with_inspection?.inspection_status ===
                                                testStatusEnum.FAILED.value
                                                    ? theme.palette.error.main
                                                    : theme.palette.grey[300],
                                            color:
                                                formValues?.with_inspection?.inspection_status ===
                                                testStatusEnum.FAILED.value
                                                    ? theme.palette.primary.contrastText
                                                    : theme.palette.text.main,
                                        }}
                                        classes={{ sizeLarge: classes.toggleButtonMobile }}
                                    >
                                        <ClearIcon /> {testStatusEnum.FAILED.label}
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                        </Grid>
                        {formValues?.with_inspection?.inspection_status === testStatusEnum.PASSED.value && (
                            <Grid item xs={12}>
                                <FormControl className={classes.formControl} fullWidth={isMobileView}>
                                    <InputLabel shrink required>
                                        {locale.form.inspection.nextTestDateLabel}
                                    </InputLabel>
                                    <Select
                                        fullWidth
                                        className={classes.formSelect}
                                        value={formNextTestDate}
                                        onChange={e => setFormNextTestDate(e.target.value)}
                                        required
                                    >
                                        {currentRetestList.map(retestPeriod => (
                                            <MenuItem value={retestPeriod.value} key={retestPeriod.value}>
                                                {retestPeriod.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <Typography component={'span'}>
                                        {locale.form.inspection.nextTestDateFormatted(
                                            moment()
                                                .add(formNextTestDate, 'months')
                                                .format(locale.config.dateFormatDisplay),
                                        )}
                                    </Typography>
                                </FormControl>
                            </Grid>
                        )}
                        {formValues?.with_inspection?.inspection_status === testStatusEnum.FAILED.value && (
                            <Grid item xs={12} sm={12}>
                                <FormControl className={classes.formControl} fullWidth>
                                    <TextField
                                        {...locale.form.inspection.failReason}
                                        multiline
                                        rows={4}
                                        variant="standard"
                                        InputProps={{ fullWidth: true }}
                                        required
                                        error={
                                            !isValidFailReason(formValues.with_inspection, testStatusEnum.FAILED.value)
                                        }
                                        value={formValues?.with_inspection?.inspection_fail_reason ?? undefined}
                                        onChange={handleChange('with_inspection.inspection_fail_reason')}
                                    />
                                </FormControl>
                            </Grid>
                        )}

                        <Grid item xs={12} sm={12}>
                            <FormControl className={classes.formControl} fullWidth>
                                <TextField
                                    {...locale.form.inspection.inspectionNotes}
                                    multiline
                                    rows={4}
                                    variant="standard"
                                    InputProps={{ fullWidth: true }}
                                    value={formValues?.with_inspection?.inspection_notes ?? undefined}
                                    onChange={handleChange('with_inspection.inspection_notes')}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item sm={12}>
                            <Typography component={'h4'} variant={'h6'}>
                                {locale.form.action.title}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Tabs
                        value={selectedTabValue}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={(e, value) => setSelectedTabValue(value)}
                        variant={isMobileView ? 'fullWidth' : 'standard'}
                    >
                        {locale.form.action.tabs.map((tab, index) => (
                            <Tab
                                label={tab.label}
                                {...a11yProps(index)}
                                key={tab.value}
                                disabled={
                                    (tab.value === 1 && !!formValues.with_discarded.isDiscarded) ||
                                    (tab.value === 2 && !!formValues.with_repair.isRepair)
                                } // here make page mobile friendly test responses etc
                            />
                        ))}
                    </Tabs>
                    <TabPanel value={selectedTabValue} index={0}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <FormControl className={classes.formControl} fullWidth={isMobileView}>
                                    <InputLabel shrink>{locale.form.action.repair.label}</InputLabel>
                                    <Select
                                        fullWidth
                                        className={classes.formSelect}
                                        value={formValues.with_repair.isRepair ? 2 : 1}
                                        onChange={e => handleChange('with_repair.isRepair')(e.target.value === 2)}
                                        style={{ minWidth: 200 }}
                                    >
                                        {locale.form.action.repair.options.map(option => (
                                            <MenuItem value={option.value} key={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl className={classes.formControl} fullWidth required>
                                    <TextField
                                        {...locale.form.action.repair.repairerDetails}
                                        required
                                        error={
                                            !!formValues.with_repair.isRepair && !isValidRepair(formValues.with_repair)
                                        }
                                        multiline
                                        rows={4}
                                        variant="standard"
                                        InputProps={{ fullWidth: true }}
                                        disabled={!formValues.with_repair.isRepair}
                                        value={formValues?.with_repair?.repairer_contact_details ?? undefined}
                                        onChange={handleChange('with_repair.repairer_contact_details')}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={selectedTabValue} index={1}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Alert severity="warning">{locale.form.action.discard.alertMessage}</Alert>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <FormControl className={classes.formControl} fullWidth={isMobileView}>
                                    <InputLabel shrink>{locale.form.action.discard.label}</InputLabel>
                                    <Select
                                        fullWidth
                                        className={classes.formSelect}
                                        value={formValues.with_discarded.isDiscarded ? 2 : 1}
                                        onChange={e => handleChange('with_discarded.isDiscarded')(e.target.value === 2)}
                                        style={{ minWidth: 200 }}
                                    >
                                        {locale.form.action.discard.options.map(option => (
                                            <MenuItem value={option.value} key={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl className={classes.formControl} fullWidth required>
                                    <TextField
                                        {...locale.form.action.discard.discardReason}
                                        required
                                        error={
                                            !!formValues.with_discarded.isDiscarded &&
                                            !isValidDiscard(formValues.with_discarded)
                                        }
                                        multiline
                                        rows={4}
                                        variant="standard"
                                        InputProps={{ fullWidth: true }}
                                        disabled={!formValues.with_discarded.isDiscarded}
                                        value={formValues?.with_discarded?.discard_reason ?? undefined}
                                        onChange={handleChange('with_discarded.discard_reason')}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </TabPanel>
                </Collapse>
            </StandardCard>
            <Grid container spacing={3} justify="flex-end">
                <Grid xs={12} sm="auto" item>
                    <Button variant="outlined" fullWidth>
                        {locale.form.buttons.cancel}
                    </Button>
                </Grid>
                <Grid item xs={12} sm="auto">
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!isValid || saveInspectionSaving}
                        onClick={saveForm}
                        fullWidth
                    >
                        {saveInspectionSaving ? (
                            <CircularProgress color="inherit" size={25} />
                        ) : (
                            locale.form.buttons.save
                        )}
                    </Button>
                </Grid>
            </Grid>
        </StandardCard>
    );
};

export default React.memo(AssetPanel);
