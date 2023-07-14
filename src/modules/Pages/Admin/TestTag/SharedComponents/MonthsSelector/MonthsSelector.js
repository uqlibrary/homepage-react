import React from 'react';

import PropTypes from 'prop-types';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Popper from '@material-ui/core/Popper';

const rootId = 'months_selector';

const moment = require('moment');

const MonthsSelector = ({
    id,
    label,
    options,
    currentValue,
    onChange,
    required = false,
    responsive = true,
    disabled = false,
    nextDateTextFormatter,
    fromDate,
    fromDateFormat,
    dateDisplayFormat,
    classNames,
    ...props
}) => {
    const componentId = `${rootId}-${id}`;
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('xs')) || false;

    const handleChange = (_event, option) => {
        onChange?.(option.value);
    };

    const customPopper = props => (
        <Popper {...props} id={`${componentId}-popper`} data-testid={`${componentId}-popper`} />
    );

    return (
        <FormControl className={classNames.formControl} fullWidth={responsive && isMobileView}>
            <Autocomplete
                id={`${componentId}`}
                data-testid={`${componentId}`}
                fullWidth={responsive && isMobileView}
                options={options ?? []}
                value={options?.find(option => option.value === currentValue) ?? null}
                onChange={handleChange}
                getOptionLabel={option => {
                    console.log(option);
                    return option.label ?? /* istanbul ignore next */ null;
                }}
                getOptionSelected={(option, value) => option.value === value}
                autoHighlight
                renderInput={params => (
                    <TextField
                        {...params}
                        {...(!!label ? { label: label } : {})}
                        required={required}
                        variant="standard"
                        InputLabelProps={{ shrink: true, htmlFor: `${componentId}` }}
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
                autoSelect={false}
                {...props}
            />

            {!!nextDateTextFormatter && (
                <Typography
                    component={'span'}
                    id={`${componentId}-next-date-label`}
                    data-testid={`${componentId}-next-date-label`}
                >
                    {nextDateTextFormatter(
                        moment(fromDate, fromDateFormat)
                            .add(currentValue, 'months')
                            .format(dateDisplayFormat),
                    )}
                </Typography>
            )}
        </FormControl>
    );
};

MonthsSelector.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    options: PropTypes.array,
    currentValue: PropTypes.string,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    responsive: PropTypes.bool,
    disabled: PropTypes.bool,
    nextDateTextFormatter: PropTypes.func,
    fromDate: PropTypes.string,
    fromDateFormat: PropTypes.string,
    dateDisplayFormat: PropTypes.string,
    classNames: PropTypes.shape({ formControl: PropTypes.string, select: PropTypes.string }),
};

export default React.memo(MonthsSelector);
