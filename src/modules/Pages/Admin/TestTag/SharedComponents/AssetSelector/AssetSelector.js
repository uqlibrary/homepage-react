import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { debounce } from 'throttle-debounce';
import * as actions from 'data/actions';

const MINIMUM_ASSET_ID_PATTERN_LENGTH = 5;

const filter = createFilterOptions();

export const maskNumber = (number, department) => {
    const prefix = /^\d+$/.test(number) ? department : '';
    const paddedNumber = !!prefix ? number.toString().padStart(6, '0') : number;
    return `${prefix}${paddedNumber}`;
};

const AssetSelector = ({
    id,
    locale,
    selectedAsset,
    masked = true,
    required = true,
    canAddNew = true,
    clearOnSelect = false,
    headless = false, // if true, no popup is shown and the calling component is expected to intercept the Redux store
    minAssetIdLength = MINIMUM_ASSET_ID_PATTERN_LENGTH,
    user,
    classNames,
    inputRef,
    onChange,
    onReset,
    onSearch,
    validateAssetId,
}) => {
    const previousValueRef = React.useRef(null);
    const dispatch = useDispatch();
    const { assetsList, assetsListLoading } = useSelector(state => state.get?.('testTagAssetsReducer'));

    const [currentValue, setCurrentValue] = useState(selectedAsset ?? null);
    const [formAssetList, setFormAssetList] = useState(assetsList);
    const [isOpen, setIsOpen] = React.useState(false);

    const debounceAssetsSearch = React.useRef(
        debounce(500, (pattern, user) => {
            const assetPartial = masked ? maskNumber(pattern, user?.user_department) : pattern;
            setCurrentValue(assetPartial);
            if (!!assetPartial && assetPartial.length >= minAssetIdLength) {
                onSearch?.(assetPartial);
                dispatch(actions.loadAssets(assetPartial));
            }
        }),
    ).current;

    const clearInput = useCallback(() => {
        if (clearOnSelect) {
            setCurrentValue(null);
            previousValueRef.current = null;
            dispatch(actions.clearAssets());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        !!assetsList && setFormAssetList(...[assetsList]);
        /* istanbul ignore else */ if (assetsList?.length === 1) {
            onChange?.(assetsList[0]);
            setCurrentValue(assetsList[0]);
            setIsOpen(false);
            clearInput();
        }
        /* istanbul ignore else */ if (assetsList?.length < 1) {
            onReset?.(false);
            setIsOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetsList]);

    return (
        <FormControl className={classNames.formControl} fullWidth>
            <Autocomplete
                id={`${id}-select`}
                data-testid={`${id}-select`}
                className={classNames.autocomplete}
                fullWidth
                open={!headless && isOpen}
                value={selectedAsset ?? currentValue ?? previousValueRef.current}
                onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                        onChange?.(
                            assetsList?.find(asset => asset.asset_id_displayed === newValue) ?? {
                                asset_id_displayed: newValue,
                            },
                        );
                    } else if (newValue && newValue.inputValue) {
                        // Create a new value from the user input
                        onChange?.({
                            asset_id_displayed: newValue.inputValue,
                        });
                    } else {
                        onChange?.(newValue);
                    }
                    setIsOpen(false);
                    clearInput();
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    // Suggest the creation of a new value
                    // if (params.inputValue !== '') {
                    canAddNew &&
                        filtered.push({
                            inputValue: locale.newAssetText,
                            asset_id_displayed: locale.addText,
                        });
                    // }

                    return filtered;
                }}
                openOnFocus
                selectOnFocus
                handleHomeEndKeys
                clearOnBlur={headless}
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
                        {...locale.assetSelector}
                        required={required}
                        error={!validateAssetId?.(selectedAsset ?? currentValue) ?? false}
                        inputRef={inputRef}
                        variant="standard"
                        onFocus={() => setIsOpen(true)}
                        onBlur={() => setIsOpen(false)}
                        InputLabelProps={{ shrink: true, htmlFor: `${id}-input` }}
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
                            id: `${id}-input`,
                            'data-testid': `${id}-input`,
                            maxLength: 12,
                        }}
                    />
                )}
                loading={!!assetsListLoading}
            />
        </FormControl>
    );
};

AssetSelector.propTypes = {
    id: PropTypes.string.isRequired,
    locale: PropTypes.object.isRequired,
    selectedAsset: PropTypes.string,
    label: PropTypes.string,
    minAssetIdLength: PropTypes.number,
    masked: PropTypes.bool,
    required: PropTypes.bool,
    canAddNew: PropTypes.bool,
    headless: PropTypes.bool,
    clearOnSelect: PropTypes.bool,
    user: PropTypes.object,
    classNames: PropTypes.shape({ formControl: PropTypes.string, autocomplete: PropTypes.string }),
    inputRef: PropTypes.any,
    onChange: PropTypes.func,
    onSearch: PropTypes.func,
    onReset: PropTypes.func,
    validateAssetId: PropTypes.func,
};

export default React.memo(AssetSelector);
