import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

const rootId = 'asset_type_selector';

const AssetTypeSelector = ({
    id,
    title,
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
    const componentId = `${rootId}-${id}`;
    const [value, setValue] = useState(initValue);
    const { assetTypesList, assetTypesListLoading } = useSelector(state => state.get('testTagAssetTypesReducer'));

    React.useEffect(() => {
        if (assetTypesList.length === 0) {
            actions.loadAssetTypes();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetTypesList]);

    const handleChange = (_event, assetType) => {
        setValue(assetType);
        onChange?.(assetType);
    };

    return (
        <FormControl className={classNames.formControl} fullWidth>
            {!!title && (
                <Typography variant="h6" component={'h3'}>
                    {title}
                </Typography>
            )}
            <Autocomplete
                id={`${componentId}`}
                data-testid={`${componentId}`}
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
    initValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func,
    classNames: PropTypes.shape({ formControl: PropTypes.string, autocomplete: PropTypes.string }),
    validateAssetTypeId: PropTypes.func,
    disabled: PropTypes.bool,
    title: PropTypes.string,
};

export default React.memo(AssetTypeSelector);
