import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

const AssetTypeSelector = ({
    id,
    locale,
    actions,
    initValue,
    required = true,
    onChange,
    validateAssetTypeId,
    classNames = {},
    disabled = false,
    ...rest
}) => {
    const [value, setValue] = useState(initValue);
    const { assetTypesList, assetTypesListLoading } = useSelector(state => state.get('testTagAssetTypesReducer'));

    React.useEffect(() => {
        actions.loadAssetTypes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (_event, assetType) => {
        setValue(assetType);
        onChange?.(assetType);
    };

    return (
        <FormControl className={classNames.formControl} fullWidth>
            <Autocomplete
                id={`testntagFormAssetType-${id}`}
                data-testid={`testntagFormAssetType-${id}`}
                className={classNames.autocomplete}
                fullWidth
                options={assetTypesList ?? []}
                value={assetTypesList?.find(assetType => assetType.asset_type_id === value?.asset_type_id) ?? null}
                onChange={handleChange}
                getOptionLabel={option => option.asset_type_name ?? /* istanbul ignore next */ null}
                getOptionSelected={(option, value) => option.asset_type_id === value.asset_type_id}
                autoHighlight
                renderInput={params => (
                    <TextField
                        {...params}
                        {...locale}
                        required={required}
                        error={(!disabled && required && !validateAssetTypeId?.(value)) ?? false}
                        variant="standard"
                        InputLabelProps={{ shrink: true, htmlFor: `testntagFormAssetTypeInput-${id}` }}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {assetTypesListLoading ? (
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
                            id: `testntagFormAssetTypeInput-${id}`,
                            'data-testid': `testntagFormAssetTypeInput-${id}`,
                        }}
                    />
                )}
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
    locale: PropTypes.object.required,
    actions: PropTypes.object.required,
    required: PropTypes.bool,
    initValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func,
    classNames: PropTypes.shape({ formControl: PropTypes.string, autocomplete: PropTypes.string }),
    validateAssetTypeId: PropTypes.func,
    disabled: PropTypes.bool,
};

export default React.memo(AssetTypeSelector);
