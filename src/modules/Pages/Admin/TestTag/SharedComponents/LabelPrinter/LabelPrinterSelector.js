import React from 'react';
import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import Popper from '@mui/material/Popper';

const rootId = 'label_printer_selector';

const LabelPrinterSelector = ({ id, list, value, onChange, disabled, disableUnknownPrinters, classNames }) => {
    const componentId = `${rootId}-${id}`;
    console.log('LabelPrinterSelector Rendered with props:', {
        id,
        list,
        value,
        onChange,
        disabled,
        disableUnknownPrinters,
        classNames,
    });
    const customPopper = props => (
        <Popper {...props} id={`${componentId}-options`} data-testid={`${componentId}-options`} />
    );

    return (
        <FormControl variant="standard" className={classNames?.formControl} fullWidth>
            <Autocomplete
                id={componentId}
                data-testid={componentId}
                className={classNames?.autocomplete}
                fullWidth
                options={list ?? /* istanbul ignore next */ []}
                value={value ? list.find(option => option.name === value) : null}
                onChange={onChange}
                getOptionLabel={option => (option.noconfig ? `${option.name} (Unknown)` : option.name)}
                {...(disableUnknownPrinters && {
                    getOptionDisabled: option => option.noconfig === true,
                })}
                isOptionEqualToValue={(option, value) => option.name === value}
                autoHighlight
                renderInput={params => (
                    <TextField
                        {...params}
                        variant="standard"
                        InputLabelProps={{ shrink: true, htmlFor: `${componentId}-input` }}
                        inputProps={{
                            ...params.inputProps,
                            id: `${componentId}-input`,
                            'data-testid': `${componentId}-input`,
                        }}
                    />
                )}
                PopperComponent={customPopper}
                disabled={disabled}
                disableClearable
                autoSelect
            />
        </FormControl>
    );
};
LabelPrinterSelector.propTypes = {
    id: PropTypes.string.isRequired,
    list: PropTypes.array,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    disableUnknownPrinters: PropTypes.bool,
    value: PropTypes.string,
    classNames: PropTypes.shape({ formControl: PropTypes.string, autocomplete: PropTypes.string }),
};

export default LabelPrinterSelector;
