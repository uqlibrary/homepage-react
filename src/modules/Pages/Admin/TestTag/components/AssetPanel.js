import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Grid } from '@material-ui/core';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import InspectionPanel from './InspectionPanel';
import LastTestPanel from './LastTestPanel';
import { isValidAssetId, isValidAssetTypeId, statusEnum } from '../utils/helpers';

import locale from '../testTag.locale';

const filter = createFilterOptions();

const testStatusEnum = statusEnum(locale);

const AssetPanel = ({
    saveForm,
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
        saveForm: PropTypes.func.isRequired,
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

    const { initConfig, initConfigLoading } = useSelector(state => state.get?.('testTagOnLoadReducer'));
    const { assetsList, assetsListLoading } = useSelector(state => state.get?.('testTagAssetsReducer'));

    const [formAssetList, setFormAssetList] = useState(assetsList ?? []);

    React.useEffect(() => {
        !!assetsList && setFormAssetList(...[assetsList]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetsList]);
    // HERE - update asset selector onChange to use local state for entering text,
    // and a debounced call to set in the formvalues object. same as notes in inspectionpanel
    return (
        <StandardCard title={locale.form.asset.title} style={{ marginTop: '30px' }}>
            <Grid container spacing={3}>
                <Grid xs={12} item sm={6} md={3}>
                    <FormControl className={classes.formControl} fullWidth>
                        <Autocomplete
                            fullWidth
                            value={formValues?.asset_barcode ?? null}
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
                                    required
                                    error={!isValidAssetId(formValues.asset_barcode)}
                                    ref={focusElementRef}
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
                            disabled={initConfigLoading || !isValidAssetId(formValues?.asset_barcode)}
                            disableClearable
                            autoSelect
                            loading={!!initConfigLoading}
                        />
                    </FormControl>
                </Grid>
                <Grid xs={12} item sm={6} md={3}>
                    <FormControl className={classes.formControl} fullWidth>
                        <InputLabel shrink>{locale.form.asset.ownerLabel}</InputLabel>
                        <Select
                            className={classes.formSelect}
                            value={formValues.asset_department_owned_by}
                            disabled={!isValidAssetId(formValues?.asset_barcode)}
                        >
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
            <InspectionPanel
                formValues={formValues}
                selectedAsset={selectedAsset}
                handleChange={handleChange}
                currentRetestList={currentRetestList}
                defaultNextTestDateValue={defaultNextTestDateValue}
                classes={classes}
                disabled={!isValidAssetId(formValues?.asset_barcode)}
                isMobileView={isMobileView}
            />
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
