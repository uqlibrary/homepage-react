import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Grid } from '@material-ui/core';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

import InspectionPanel from './InspectionPanel';
import LastInspectionPanel from './LastInspectionPanel';
import AssetSelector from '../../SharedComponents/AssetSelector/AssetSelector';
import { isValidAssetId, isValidAssetTypeId, statusEnum } from '../utils/helpers';

import locale from '../../testTag.locale';

const testStatusEnum = statusEnum(locale.pages.inspect.config);

const AssetPanel = ({
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
        formValues: PropTypes.object.isRequired,
        selectedAsset: PropTypes.object,
        resetForm: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        assignCurrentAsset: PropTypes.func.isRequired,
        handleChange: PropTypes.func.isRequired,
        focusElementRef: PropTypes.any.isRequired,
        defaultNextTestDateValue: PropTypes.string.isRequired,
        classes: PropTypes.object.isRequired,
        saveInspectionSaving: PropTypes.bool,
        isMobileView: PropTypes.bool,
    };
    const pageLocale = locale.pages.inspect;

    const { inspectionConfig, inspectionConfigLoading } = useSelector(state =>
        state.get?.('testTagOnLoadInspectionReducer'),
    );
    console.log(formValues);
    const { user } = useSelector(state => state.get('testTagUserReducer'));

    return (
        <StandardCard title={pageLocale.form.asset.title} style={{ marginTop: '30px' }}>
            <Grid container spacing={3}>
                <Grid xs={12} item sm={6} md={3}>
                    <AssetSelector
                        id="testntagFormAssetId"
                        locale={pageLocale.form.asset}
                        user={user}
                        classNames={{ formControl: classes.formControl }}
                        inputRef={focusElementRef}
                        onChange={assignCurrentAsset}
                        onReset={resetForm}
                        validateAssetId={isValidAssetId}
                        selectedAsset={formValues?.asset_id_displayed}
                    />
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
