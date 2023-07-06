import React, { useState } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { isEmptyObject } from '../../helpers/helpers';

const rootId = 'asset_status_selector';

const AssetStatusSelector = ({ id, label, options, required = false, onChange, classNames, disabled, ...rest }) => {
    const componentId = `${rootId}-${id}`;
    const [currentValue, setCurrentValue] = useState({});
    const handleOnChange = (event, newValue) => {
        console.log('handleOnChange', event, newValue);
        setCurrentValue(newValue);
        onChange?.(newValue);
    };
    return (
        <FormControl className={classNames.formControl} fullWidth>
            <Autocomplete
                id={`${componentId}`}
                data-testid={`${componentId}`}
                className={classNames.autocomplete}
                fullWidth
                options={options}
                value={currentValue}
                onChange={handleOnChange}
                getOptionLabel={option => option.label}
                autoHighlight
                renderInput={params => (
                    <TextField
                        {...params}
                        label={label}
                        required={required}
                        variant="standard"
                        error={(!disabled && required && isEmptyObject(currentValue)) ?? false}
                        InputLabelProps={{ shrink: true, htmlFor: `${componentId}-input` }}
                        InputProps={{
                            ...params.InputProps,
                        }}
                        inputProps={{
                            ...params.inputProps,
                            id: `${componentId}-input`,
                            'data-testid': `${componentId}-input`,
                        }}
                    />
                )}
                disableClearable
                autoSelect
                {...rest}
            />
        </FormControl>
    );
};
AssetStatusSelector.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    options: PropTypes.object.required,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    classNames: PropTypes.shape({ formControl: PropTypes.string, autocomplete: PropTypes.string }),
};

export default React.memo(AssetStatusSelector);
