import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Box, Grid } from '@material-ui/core';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { debounce } from 'throttle-debounce';

import { transformer } from '../utils/transformers';
import { saveInspectionTransformer } from '../transformers/saveInspectionTransformer';
import InspectionPanel from './InspectionPanel';
import LastInspectionPanel from './LastInspectionPanel';
import { isValidAssetId, isValidAssetTypeId, statusEnum } from '../utils/helpers';

import locale from '../testTag.locale';

const filter = createFilterOptions();

const testStatusEnum = statusEnum(locale);

const MINIMUM_ASSET_ID_PATTERN_LENGTH = 7;

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
    saveInspectionSaving,
    saveAssetTypeSaving,
    isMobileView,
    isValid,
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
        saveAssetTypeSaving: PropTypes.bool,
        isMobileView: PropTypes.bool,
        isValid: PropTypes.bool,
    };

    const { initConfig, initConfigLoading } = useSelector(state => state.get?.('testTagOnLoadReducer'));
    const { assetsList, assetsListLoading } = useSelector(state => state.get?.('testTagAssetsReducer'));

    const [formAssetList, setFormAssetList] = useState(assetsList);
    const [isOpen, setIsOpen] = React.useState(false);

    const debounceAssetsSearch = React.useRef(
        debounce(500, pattern => {
            !!pattern && pattern.length >= MINIMUM_ASSET_ID_PATTERN_LENGTH && actions.loadAssets(pattern);
        }),
    ).current;

    const [isAssetTypeDialogOpen, setAssetTypeDialogOpen] = React.useState(null);

    React.useEffect(() => {
        !!assetsList && setFormAssetList(...[assetsList]);
        if (assetsList?.length === 1) {
            assignCurrentAsset(assetsList[0]);
            setIsOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetsList]);

    const saveForm = () => {
        /* istanbul ignore else */ if (isValid && !saveInspectionSaving) {
            const transformedData = transformer(
                formValues,
                saveInspectionTransformer(testStatusEnum.PASSED.value, testStatusEnum.FAILED.value),
                selectedAsset?.last_inspection ?? /* istanbul ignore next */ {},
            );
            actions.saveInspection(transformedData);
        }
    };

    const [assetTypeValid, setAssetTypeValid] = React.useState(false);
    const saveAssetType = () => {
        console.log('saveAssetType', formValues);
        /* istanbul ignore else */ if (assetTypeValid && !saveAssetTypeSaving) {
            // const transformedData = transformer(
            //     formValues,
            //     saveInspectionTransformer(testStatusEnum.PASSED.value, testStatusEnum.FAILED.value),
            //     selectedAsset?.last_inspection ?? /* istanbul ignore next */ {},
            // );
            actions.saveAssetType(formValues);
        }
    };

    const closeAssetTypeDialog = () => {
        setAssetTypeDialogOpen(false);
    };
    const openAssetTypeDialog = () => {
        console.log('openAssetTypeDialog');
        setAssetTypeDialogOpen(true);
    };
    const AssetTypeDialogPopup = ({}) => {
        if (!!isAssetTypeDialogOpen) {
            return (
                <Dialog
                    onClose={/* istanbul ignore next */ () => closeAssetTypeDialog()}
                    aria-label="Asset Type Editor"
                    role="dialog"
                    open={!!isAssetTypeDialogOpen}
                    // maxWidth={'sx'}
                    PaperProps={{
                        id: 'asset-type-dialog',
                        style: {
                            backgroundColor: '#fff',
                            color: '#000',
                            height: '40em',
                        },
                        'aria-label': 'Manage asset type',
                    }}
                >
                    <DialogTitle
                        // id="lightboxTitle"
                        // data-testid="panel-save-or-schedule-title"
                        style={{ borderBottom: '1px solid #d7d1cc' }}
                        children={
                            <React.Fragment>
                                <p style={{ paddingLeft: 24, margin: '10px 0 0 0', float: 'left' }}>
                                    Add an Asset type
                                </p>{' '}
                                <IconButton
                                    style={{ float: 'right' }}
                                    // id="asset-type-dialog-close-button"
                                    // data-testid="asset-type-dialog-close-button"
                                    // data-analyticsid="asset-type-dialog-close-button"
                                    onClick={() => closeAssetTypeDialog()}
                                    aria-label="Click to close asset type dialog"
                                    // style={{ color: 'white', marginTop: -16 }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </React.Fragment>
                        }
                    />
                    <DialogContent>
                        <Grid
                            container
                            spacing={0}
                            style={{
                                backgroundColor: '#000020 !important',
                                color: '#FFFFFF !important',
                                padding: 20,
                            }}
                        >
                            {/* <Grid item xs={12} style={{ padding: '8px 0' }}>*/}
                            {/*    asset_type_id*/}
                            {/* </Grid>*/}
                            <Grid item xs={12} style={{ padding: '8px 0' }}>
                                <FormControl className={classes.formControl} fullWidth>
                                    <TextField
                                        id="asset_type_name"
                                        data-testid="asset_type_name"
                                        variant="standard"
                                        InputProps={{ fullWidth: true }}
                                        onChange={() => {
                                            handleChange();
                                            setAssetTypeValid(true);
                                        }}
                                        // updateKey="asset_type_name"
                                        label="Asset type name"
                                        required
                                        // InputLabelProps={{ htmlFor: 'asset_type_name-input' }}
                                        // {...locale.form.inspection.inspectionNotes}
                                        // disabled={disabled}
                                        // value={formValues?.inspection_notes ?? ''}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} style={{ padding: '8px 0' }}>
                                <FormControl className={classes.formControl} fullWidth>
                                    <TextField
                                        id="asset_type_class"
                                        data-testid="asset_type_class"
                                        variant="standard"
                                        InputProps={{ fullWidth: true }}
                                        onChange={handleChange}
                                        // updateKey="asset_type_class"
                                        label="Asset type class"
                                        // InputLabelProps={{ htmlFor: `${rest.id ?? ''}-input` }}
                                        // {...locale.form.inspection.inspectionNotes}
                                        // disabled={disabled}
                                        // value={formValues?.inspection_notes ?? ''}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} style={{ padding: '8px 0' }}>
                                <FormControl className={classes.formControl} fullWidth>
                                    <TextField
                                        id="asset_type_power_rating"
                                        data-testid="asset_type_power_rating"
                                        variant="standard"
                                        InputProps={{ fullWidth: true }}
                                        onChange={handleChange}
                                        // updateKey="asset_type_power_rating"
                                        label="Asset type power rating"
                                        // InputLabelProps={{ htmlFor: `${rest.id ?? ''}-input` }}
                                        // {...locale.form.inspection.inspectionNotes}
                                        // disabled={disabled}
                                        // value={formValues?.inspection_notes ?? ''}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} style={{ padding: '8px 0' }}>
                                <FormControl className={classes.formControl} fullWidth>
                                    <TextField
                                        id="asset_type"
                                        data-testid="asset_type"
                                        variant="standard"
                                        InputProps={{ fullWidth: true }}
                                        onChange={handleChange}
                                        // updateKey="asset_type"
                                        label="Asset type (a longer version of the name, if needed)"
                                        // InputLabelProps={{ htmlFor: `${rest.id ?? ''}-input` }}
                                        // {...locale.form.inspection.inspectionNotes}
                                        // disabled={disabled}
                                        // value={formValues?.inspection_notes ?? ''}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} style={{ padding: '8px 0' }}>
                                <FormControl className={classes.formControl} fullWidth>
                                    <TextField
                                        id="asset_type_notes"
                                        data-testid="asset_type_notes"
                                        variant="standard"
                                        InputProps={{ fullWidth: true }}
                                        onChange={handleChange}
                                        // updateKey="asset_type_notes"
                                        label="Notes"
                                        // InputLabelProps={{ htmlFor: `${rest.id ?? ''}-input` }}
                                        // {...locale.form.inspection.inspectionNotes}
                                        // disabled={disabled}
                                        // value={formValues?.inspection_notes ?? ''}
                                        multiline
                                        rows={4}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions style={{ borderTop: '1px solid #d7d1cc' }}>
                        <Box display={'flex'} justifyContent={'flex-end'} style={{ paddingRight: 24, margin: 0 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={!assetTypeValid || saveAssetTypeSaving}
                                onClick={saveAssetType}
                                fullWidth={isMobileView}
                                id="testntagFormSubmitButton"
                                data-testid="testntagFormSubmitButton"
                            >
                                {saveInspectionSaving ? (
                                    <CircularProgress
                                        color="inherit"
                                        size={25}
                                        id="saveInspectionSpinner"
                                        data-testid="saveInspectionSpinner"
                                    />
                                ) : (
                                    locale.form.buttons.save
                                )}
                            </Button>
                        </Box>
                    </DialogActions>
                </Dialog>
            );
        }
        return null;
    };

    // we group them all together to place a header at the top of the search results
    const renderGroup = params => [
        params.children,
        <Button
            className={classes.addNewLabel}
            onClick={() => openAssetTypeDialog()}
            key="testntagFormAssetType-option-add"
        >
            {locale.form.asset.assetType.addNewLabel}
        </Button>,
    ];

    return (
        <StandardCard title={locale.form.asset.title} style={{ marginTop: '30px' }}>
            <AssetTypeDialogPopup />
            <Grid container spacing={3}>
                <Grid xs={12} item sm={6} md={3}>
                    <FormControl className={classes.formControl} fullWidth>
                        <Autocomplete
                            id="testntagFormAssetId"
                            data-testid="testntagFormAssetId"
                            fullWidth
                            open={isOpen}
                            value={formValues?.asset_id_displayed ?? null}
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
                                    asset_id_displayed: locale.form.asset.addText,
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
                                    {...locale.form.asset.assetId}
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
                                        debounceAssetsSearch(e.target.value);
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
                            options={initConfig?.asset_types ?? []}
                            value={
                                initConfig?.asset_types?.find(
                                    assetType => assetType.asset_type_id === formValues.asset_type_id,
                                ) ?? null
                            }
                            onChange={(_, newValue) => {
                                handleChange('asset_type_id')(newValue.asset_type_id);
                            }}
                            getOptionLabel={option => option.asset_type_name ?? /* istanbul ignore next */ null}
                            getOptionSelected={(option, value) => option.asset_type_id === value.asset_type_id}
                            autoHighlight
                            renderGroup={renderGroup}
                            groupBy={() => false}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label={locale.form.asset.assetType.label}
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
                                                {initConfigLoading ? (
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
                            disabled={initConfigLoading || !isValidAssetId(formValues?.asset_id_displayed)}
                            disableClearable
                            autoSelect
                            loading={!!initConfigLoading}
                        />
                    </FormControl>
                </Grid>
            </Grid>
            <LastInspectionPanel
                asset={selectedAsset ?? {}}
                currentLocation={location}
                dateFormatPattern={locale.config.dateFormatDisplay}
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
            <Grid container spacing={3}>
                <Grid xs={12} sm={6} item>
                    <Button
                        variant="outlined"
                        onClick={resetForm}
                        fullWidth={isMobileView}
                        id="testntagFormResetButton"
                        data-testid="testntagFormResetButton"
                    >
                        {locale.form.buttons.reset}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box display={'flex'} justifyContent={'flex-end'}>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={!isValid || saveInspectionSaving}
                            onClick={saveForm}
                            fullWidth={isMobileView}
                            id="testntagFormSubmitButton"
                            data-testid="testntagFormSubmitButton"
                        >
                            {saveInspectionSaving ? (
                                <CircularProgress
                                    color="inherit"
                                    size={25}
                                    id="saveInspectionSpinner"
                                    data-testid="saveInspectionSpinner"
                                />
                            ) : (
                                locale.form.buttons.save
                            )}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </StandardCard>
    );
};

export default React.memo(AssetPanel);
