import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Grid } from '@material-ui/core';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

import { debounce } from 'throttle-debounce';
import InspectionPanel from './InspectionPanel';
import LastInspectionPanel from './LastInspectionPanel';
import { isValidAssetId, isValidAssetTypeId, statusEnum } from '../utils/helpers';

import locale from '../../testTag.locale';

const filter = createFilterOptions();

const testStatusEnum = statusEnum(locale.pages.inspect.config);

const MINIMUM_ASSET_ID_PATTERN_LENGTH = 5;

const AssetPanel = ({
    actions,
    currentRetestList,
    formValues,
    selectedAsset,
    resetForm,
    location,
    assignCurrentAsset,
    handleChange,
    focusElementRef,
    defaultNextTestDateValue,
    classes,
    isMobileView,
}) => {
    AssetPanel.propTypes = {
        actions: PropTypes.any.isRequired,
        currentRetestList: PropTypes.array.isRequired,
        formValues: PropTypes.object.isRequired,
        selectedAsset: PropTypes.object,
        resetForm: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        assignCurrentAsset: PropTypes.func.isRequired,
        handleChange: PropTypes.func.isRequired,
        focusElementRef: PropTypes.any.isRequired,
        defaultNextTestDateValue: PropTypes.number.isRequired,
        classes: PropTypes.object.isRequired,
        saveInspectionSaving: PropTypes.bool,
        isMobileView: PropTypes.bool,
    };
    const pageLocale = locale.pages.inspect;

    const { inspectionConfig, inspectionConfigLoading } = useSelector(state =>
        state.get?.('testTagOnLoadInspectionReducer'),
    );

    const { user } = useSelector(state => state.get('testTagUserReducer'));

    const { assetsList, assetsListLoading } = useSelector(state => state.get?.('testTagAssetsReducer'));

    const [formAssetList, setFormAssetList] = useState(assetsList);
    const [isOpen, setIsOpen] = React.useState(false);

    const maskNumber = (number, department) => {
        const prefix = /^\d+$/.test(number) ? department : '';
        const paddedNumber = !!prefix ? number.toString().padStart(6, '0') : number;
        return `${prefix}${paddedNumber}`;
    };

    const previousValueRef = React.useRef(null);

    const debounceAssetsSearch = React.useRef(
        debounce(500, (pattern, user) => {
            const paddedNumber = maskNumber(pattern, user?.user_department);
            !!paddedNumber &&
                paddedNumber.length >= MINIMUM_ASSET_ID_PATTERN_LENGTH &&
                actions.loadAssets(paddedNumber);
        }),
    ).current;

    React.useEffect(() => {
        !!assetsList && setFormAssetList(...[assetsList]);
        /* istanbul ignore else */ if (assetsList?.length === 1) {
            assignCurrentAsset(assetsList[0]);
            setIsOpen(false);
        }
        /* istanbul ignore else */ if (assetsList?.length < 1) {
            resetForm(false);
            setIsOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetsList]);

    return (
        <StandardCard title={pageLocale.form.asset.title} style={{ marginTop: '30px' }}>
            <Grid container spacing={3}>
                <Grid xs={12} item sm={6} md={3}>
                    <FormControl className={classes.formControl} fullWidth>
                        <Autocomplete
                            id="testntagFormAssetId"
                            data-testid="testntagFormAssetId"
                            fullWidth
                            open={isOpen}
                            value={formValues?.asset_id_displayed ?? previousValueRef.current}
                            onChange={(event, newValue) => {
                                if (typeof newValue === 'string') {
                                    assignCurrentAsset({ asset_id_displayed: newValue });
                                } else if (newValue && newValue.inputValue) {
                                    // Create a new value from the user input
                                    assignCurrentAsset({
                                        asset_id_displayed: newValue.inputValue,
                                    });
                                } else {
                                    assignCurrentAsset(newValue);
                                }
                                setIsOpen(false);
                            }}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);
                                // Suggest the creation of a new value
                                // if (params.inputValue !== '') {
                                filtered.push({
                                    inputValue: 'NEW ASSET',
                                    asset_id_displayed: pageLocale.form.asset.addText,
                                });
                                // }

                                return filtered;
                            }}
                            openOnFocus
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
                                return `${option.asset_id_displayed ?? /* istanbul ignore next */ ''}`;
                            }}
                            renderOption={option => option.asset_id_displayed}
                            freeSolo
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    {...pageLocale.form.asset.assetId}
                                    required
                                    error={!isValidAssetId(formValues.asset_id_displayed)}
                                    inputRef={focusElementRef}
                                    variant="standard"
                                    onFocus={() => setIsOpen(true)}
                                    onBlur={() => setIsOpen(false)}
                                    InputLabelProps={{ shrink: true, htmlFor: 'testntagFormAssetIdInput' }}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {!!assetsListLoading ? (
                                                    <CircularProgress
                                                        color="inherit"
                                                        size={20}
                                                        id="assetIdSpinner"
                                                        data-testid="assetIdSpinner"
                                                    />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                    onChange={e => {
                                        !isOpen && setIsOpen(true);
                                        previousValueRef.current = e.target.value;
                                        debounceAssetsSearch(e.target.value, user);
                                    }}
                                    inputProps={{
                                        ...params.inputProps,
                                        id: 'testntagFormAssetIdInput',
                                        'data-testid': 'testntagFormAssetIdInput',
                                        maxLength: 12,
                                    }}
                                />
                            )}
                            loading={!!assetsListLoading}
                        />
                    </FormControl>
                </Grid>
                <Grid xs={12} item sm={6}>
                    <FormControl className={classes.formControl} fullWidth>
                        <Autocomplete
                            id="testntagFormAssetType"
                            data-testid="testntagFormAssetType"
                            fullWidth
                            options={inspectionConfig?.asset_types ?? []}
                            value={
                                inspectionConfig?.asset_types?.find(
                                    assetType => assetType.asset_type_id === formValues.asset_type_id,
                                ) ?? null
                            }
                            onChange={(_, newValue) => {
                                handleChange('asset_type_id')(newValue.asset_type_id);
                            }}
                            getOptionLabel={option => option.asset_type_name ?? /* istanbul ignore next */ null}
                            getOptionSelected={(option, value) => option.asset_type_id === value.asset_type_id}
                            autoHighlight
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    {...pageLocale.form.asset.assetType}
                                    required
                                    error={
                                        isValidAssetId(formValues.asset_id_displayed) &&
                                        !isValidAssetTypeId(formValues.asset_type_id)
                                    }
                                    variant="standard"
                                    InputLabelProps={{ shrink: true, htmlFor: 'testntagFormAssetTypeInput' }}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {inspectionConfigLoading ? (
                                                    <CircularProgress
                                                        color="inherit"
                                                        size={20}
                                                        id="assetTypeSpinner"
                                                        data-testid="assetTypeSpinner"
                                                    />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                    inputProps={{
                                        ...params.inputProps,
                                        id: 'testntagFormAssetTypeInput',
                                        'data-testid': 'testntagFormAssetTypeInput',
                                    }}
                                />
                            )}
                            disabled={inspectionConfigLoading || !isValidAssetId(formValues?.asset_id_displayed)}
                            disableClearable
                            autoSelect
                            loading={!!inspectionConfigLoading}
                        />
                    </FormControl>
                </Grid>
            </Grid>
            <LastInspectionPanel
                asset={selectedAsset ?? {}}
                currentLocation={location}
                dateFormatPattern={pageLocale.config.dateFormatDisplay}
                disabled={!!!selectedAsset?.last_inspection?.inspect_status ?? /* istanbul ignore next */ true}
                forceOpen={selectedAsset?.asset_status === testStatusEnum.DISCARDED.value}
            />
            {selectedAsset?.asset_status !== testStatusEnum.DISCARDED.value && (
                <InspectionPanel
                    formValues={formValues}
                    selectedAsset={selectedAsset}
                    handleChange={handleChange}
                    currentRetestList={currentRetestList}
                    defaultNextTestDateValue={defaultNextTestDateValue}
                    classes={classes}
                    disabled={!isValidAssetId(formValues?.asset_id_displayed)}
                    isMobileView={isMobileView}
                />
            )}
        </StandardCard>
    );
};

export default React.memo(AssetPanel);
