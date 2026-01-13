import React from 'react';
import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import Popper from '@mui/material/Popper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const rootId = 'label_printer_selector';

const LabelPrinterSelector = ({
    id,
    list,
    value,
    onChange,
    error,
    disabled,
    disableUnknownPrinters,
    fullWidth = true,
    classNames,
    locale,
}) => {
    const componentId = `${rootId}-${id}`;
    const customPopper = props => (
        <Popper {...props} id={`${componentId}-options`} data-testid={`${componentId}-options`} />
    );
    const hint = React.useRef('');

    return (
        <FormControl variant="standard" className={classNames?.formControl} fullWidth={fullWidth}>
            <Autocomplete
                id={componentId}
                data-testid={componentId}
                onClose={() => {
                    hint.current = '';
                }}
                className={classNames?.autocomplete}
                options={list ?? /* istanbul ignore next */ []}
                value={value ? list.find(option => option.name === value) : null}
                onChange={onChange}
                getOptionLabel={option =>
                    option.noconfig ? `${option.name} (${locale?.unknownPrinter})` : option.name
                }
                {...(disableUnknownPrinters && {
                    getOptionDisabled: option => option.noconfig === true,
                })}
                fullWidth={fullWidth}
                isOptionEqualToValue={(option, value) => option.name === value}
                autoHighlight
                renderInput={params => {
                    return (
                        <Box sx={{ position: 'relative' }}>
                            <Typography
                                sx={{
                                    position: 'absolute',
                                    opacity: 0.5,
                                    left: 14,
                                    top: 16,
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    width: 'calc(100% - 75px)',
                                }}
                            >
                                {hint.current}
                            </Typography>
                            <TextField
                                {...params}
                                variant="standard"
                                InputLabelProps={{ shrink: true, htmlFor: `${componentId}-input` }}
                                inputProps={{
                                    ...params.inputProps,
                                    id: `${componentId}-input`,
                                    'data-testid': `${componentId}-input`,
                                }}
                                label="Printer"
                                error={error}
                            />
                        </Box>
                    );
                }}
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
    error: PropTypes.bool,
    disableUnknownPrinters: PropTypes.bool,
    fullWidth: PropTypes.bool,
    value: PropTypes.string,
    classNames: PropTypes.shape({ formControl: PropTypes.string, autocomplete: PropTypes.string }),
    locale: PropTypes.object,
};

export default LabelPrinterSelector;
