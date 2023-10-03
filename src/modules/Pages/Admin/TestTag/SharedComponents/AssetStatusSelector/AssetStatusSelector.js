import React, { useState } from 'react';
import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import Popper from '@mui/material/Popper';

import { isEmptyObject } from '../../helpers/helpers';

const rootId = 'asset_status_selector';

const AssetStatusSelector = ({
    id,
    label,
    options,
    initialOptionIndex = -1,
    required = false,
    onChange,
    classNames,
    disabled = false,
    ...rest
}) => {
    const componentId = `${rootId}-${id}`;
    const [currentValue, setCurrentValue] = useState(initialOptionIndex > -1 ? options[initialOptionIndex] : {});
    const handleOnChange = (event, newValue) => {
        setCurrentValue(newValue);
        onChange?.(newValue);
    };

    const customPopper = props => (
        <Popper {...props} id={`${componentId}-options`} data-testid={`${componentId}-options`} />
    );

    return (
        <FormControl variant="standard" className={classNames?.formControl} fullWidth>
            <Autocomplete
                id={`${componentId}`}
                data-testid={`${componentId}`}
                className={classNames?.autocomplete}
                fullWidth
                options={options}
                value={currentValue}
                onChange={handleOnChange}
                getOptionLabel={option => option?.label ?? /* istanbul ignore next */ ''}
                autoHighlight
                renderInput={params => (
                    <TextField
                        {...params}
                        label={label}
                        required={required}
                        variant="standard"
                        error={
                            (!disabled && required && isEmptyObject(currentValue)) ?? /* istanbul ignore next */ false
                        }
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
                PopperComponent={customPopper}
                disableClearable
                autoSelect
                disabled={disabled}
                {...rest}
            />
        </FormControl>
    );
};
AssetStatusSelector.propTypes = {
    id: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    label: PropTypes.string,
    initialOptionIndex: PropTypes.number,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    classNames: PropTypes.shape({ formControl: PropTypes.string, autocomplete: PropTypes.string }),
};

export default React.memo(AssetStatusSelector);
