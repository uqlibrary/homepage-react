/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Popper from '@mui/material/Popper';

const rootId = 'asset_type_selector';
export const ADD_NEW_ID = 99999;

const filterOptions = createFilterOptions();

const AssetTypeSelector = ({
    id,
    locale,
    actions,
    value,
    required = true,
    canAddNew = false,
    hasAllOption = false,
    disabled = false,
    onChange,
    validateAssetTypeId,
    classNames = {},
    ...rest
}) => {
    const componentId = `${rootId}-${id}`;
    const [_value, setValue] = React.useState(value ?? '');
    const [_assetTypeList, setAssetTypeList] = useState([]);
    const { assetTypesList, assetTypesListLoading, assetTypesListLoaded, assetTypesListError } = useSelector(state =>
        state.get('testTagAssetTypesReducer'),
    );
    React.useEffect(() => {
        if (assetTypesList.length === 0 && !!!assetTypesListLoaded && !!!assetTypesListError) {
            actions.loadAssetTypes();
        } else if (!!!assetTypesListError) {
            setAssetTypeList(
                !!hasAllOption
                    ? [{ asset_type_id: -1, asset_type_name: locale.labelAll }, ...assetTypesList]
                    : assetTypesList,
            );

            if (!!hasAllOption) setValue(-1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasAllOption, assetTypesList, assetTypesListLoaded, assetTypesListError]);

    const handleChange = (_event, assetType) => {
        !!!value && setValue(assetType.asset_type_id);
        onChange?.(assetType);
    };

    React.useEffect(() => {
        setValue(value);
    }, [value]);

    const customPopper = props => (
        <Popper {...props} id={`${componentId}-options`} data-testid={`${componentId}-options`} />
    );

    return (
        <FormControl variant="standard" className={classNames.formControl} fullWidth>
            <Autocomplete
                id={`${componentId}`}
                data-testid={`${componentId}`}
                className={classNames.autocomplete}
                fullWidth
                options={_assetTypeList ?? /* istanbul ignore next */ []}
                value={_assetTypeList?.find(assetType => assetType.asset_type_id === _value) ?? null}
                onChange={handleChange}
                getOptionLabel={option => option.asset_type_name ?? /* istanbul ignore next */ null}
                isOptionEqualToValue={(option, value) => option.asset_type_id === value.asset_type_id}
                autoHighlight
                renderInput={params => (
                    <TextField
                        {...params}
                        {...locale.props}
                        required={required}
                        error={
                            (!disabled && required && !validateAssetTypeId?.(value)) ?? /* istanbul ignore next */ false
                        }
                        variant="standard"
                        InputLabelProps={{ shrink: true, htmlFor: `${componentId}-input` }}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {assetTypesListLoading ? (
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
                        }}
                    />
                )}
                filterOptions={(options, params) => {
                    const filtered = filterOptions(options, params);
                    canAddNew &&
                        filtered.push({
                            asset_type_name: locale.addNewLabel.toUpperCase(),
                            asset_type_id: ADD_NEW_ID,
                        });

                    return filtered;
                }}
                PopperComponent={customPopper}
                disabled={disabled || assetTypesListLoading}
                disableClearable
                autoSelect
                loading={!!assetTypesListLoading}
                {...rest}
            />
        </FormControl>
    );
};
AssetTypeSelector.propTypes = {
    id: PropTypes.string.isRequired,
    locale: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    required: PropTypes.bool,
    canAddNew: PropTypes.bool,
    hasAllOption: PropTypes.bool,
    disabled: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func,
    classNames: PropTypes.shape({ formControl: PropTypes.string, autocomplete: PropTypes.string }),
    validateAssetTypeId: PropTypes.func,
};

export default React.memo(AssetTypeSelector);
