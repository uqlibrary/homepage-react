import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Popper from '@mui/material/Popper';
import { debounce } from 'throttle-debounce';
import * as actions from 'data/actions';

const rootId = 'asset_selector';

const MINIMUM_ASSET_ID_PATTERN_LENGTH = 5;

const filterOptions = createFilterOptions();

export const maskNumber = (number, department) => {
    const prefix = /^\d+$/.test(number) ? department : '';
    const paddedNumber = !!prefix ? number.toString().padStart(6, '0') : number;
    return `${prefix}${paddedNumber}`;
};

const AssetSelector = ({
    id,
    locale,
    autoFocus = false,
    selectedAsset,
    masked = true,
    required = true,
    canAddNew = true,
    clearOnSelect = false,
    headless = false, // if true, no popup is shown and the calling component is expected to intercept the Redux store
    minAssetIdLength = MINIMUM_ASSET_ID_PATTERN_LENGTH,
    user,
    classNames,
    onChange,
    onReset,
    onSearch,
    validateAssetId,
    filter,
}) => {
    const componentId = `${rootId}-${id}`;
    const previousValueRef = React.useRef(null);
    const inputRef = React.useRef();
    const dispatch = useDispatch();
    const { assetsList, assetsListLoading } = useSelector(state => state.get?.('testTagAssetsReducer'));

    const [currentValue, setCurrentValue] = useState(selectedAsset ?? null);

    const [formAssetList, setFormAssetList] = useState(assetsList);
    const [isOpen, setIsOpen] = React.useState(false);

    const clearInput = () => {
        setCurrentValue(null);
        previousValueRef.current = null;
        dispatch(actions.clearAssets());
    };

    const debounceAssetsSearch = React.useRef(
        debounce(500, (pattern, user) => {
            const assetPartial = masked ? maskNumber(pattern, user?.user_department) : pattern;
            setCurrentValue(assetPartial);
            /* istanbul ignore else */
            if (!!assetPartial && assetPartial.length >= minAssetIdLength) {
                onSearch?.(assetPartial);
                dispatch(
                    !!filter ? actions.loadAssetsFiltered(assetPartial, filter) : actions.loadAssets(assetPartial),
                );
            }
        }),
    ).current;

    const customPopper = props => (
        <Popper {...props} id={`${componentId}-options`} data-testid={`${componentId}-options`} />
    );

    React.useEffect(() => {
        previousValueRef.current = selectedAsset;
        setCurrentValue(selectedAsset);
    }, [selectedAsset]);

    React.useEffect(() => {
        !!assetsList && setFormAssetList(...[assetsList]);
        /* istanbul ignore else */ if (assetsList?.length === 1) {
            onChange?.(assetsList[0]);
            setCurrentValue(assetsList[0]);
            setIsOpen(false);
            clearOnSelect && clearInput();
        }
        /* istanbul ignore else */ if (assetsList?.length < 1) {
            onReset?.(false);
            setIsOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetsList]);

    React.useLayoutEffect(() => {
        if (autoFocus) {
            inputRef?.current?.focus();
        }
    }, [autoFocus]);

    return (
        <FormControl variant="standard" className={classNames?.formControl} fullWidth>
            <Autocomplete
                id={`${componentId}`}
                data-testid={`${componentId}`}
                className={classNames?.autocomplete}
                fullWidth
                open={!headless && isOpen}
                value={currentValue ?? previousValueRef.current ?? ''}
                onChange={(event, newValue) => {
                    if (newValue && newValue.inputValue) {
                        // Create a new value from the user input
                        onChange?.({
                            asset_id_displayed: newValue.inputValue,
                        });
                    } else {
                        onChange?.(newValue);
                    }
                    setIsOpen(false);
                    clearOnSelect && clearInput();
                }}
                filterOptions={(options, params) => {
                    const filtered = filterOptions(options, params);
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
                PopperComponent={customPopper}
                freeSolo
                renderInput={params => (
                    <TextField
                        {...params}
                        {...locale.assetSelector}
                        required={required}
                        error={!validateAssetId?.(selectedAsset ?? currentValue) ?? /* istanbul ignore next */ false}
                        variant="standard"
                        onFocus={() => {
                            setIsOpen(true);
                        }}
                        onBlur={() => {
                            setIsOpen(false);
                        }}
                        onChange={e => {
                            !isOpen && setIsOpen(true);
                            previousValueRef.current = e.target.value;
                            debounceAssetsSearch(e.target.value, user);
                        }}
                        InputLabelProps={{ shrink: true, htmlFor: `${componentId}-input` }}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {!!assetsListLoading ? (
                                        <CircularProgress
                                            color="inherit"
                                            size={20}
                                            id={`${componentId}-progress`}
                                            data-testid={`${componentId}-progress`}
                                        />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                        inputProps={{
                            ...params.inputProps,
                            id: `${componentId}-input`,
                            'data-testid': `${componentId}-input`,
                            maxLength: 12,
                        }}
                        inputRef={inputRef}
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
    autoFocus: PropTypes.bool,
    masked: PropTypes.bool,
    required: PropTypes.bool,
    canAddNew: PropTypes.bool,
    headless: PropTypes.bool,
    clearOnSelect: PropTypes.bool,
    user: PropTypes.object,
    classNames: PropTypes.shape({ formControl: PropTypes.string, autocomplete: PropTypes.string }),
    onChange: PropTypes.func,
    onSearch: PropTypes.func,
    onReset: PropTypes.func,
    validateAssetId: PropTypes.func,
    filter: PropTypes.shape({ status: PropTypes.shape({ discarded: PropTypes.bool }) }),
};

export default React.memo(AssetSelector);
