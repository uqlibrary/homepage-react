import React from 'react';

import PropTypes from 'prop-types';

import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const moment = require('moment');

const MonthsSelector = ({
    id = 'monthsSelector',
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
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('xs')) || false;

    const onValueChange = event => {
        onChange?.(event.target.value);
    };

    return (
        <FormControl className={classNames.formControl} fullWidth={responsive && isMobileView}>
            {!!label && (
                <InputLabel shrink required={required}>
                    {label}
                </InputLabel>
            )}
            <Select
                id={id}
                data-testid={id}
                fullWidth={responsive && isMobileView}
                className={classNames.select}
                value={currentValue}
                onChange={onValueChange}
                required={required}
                disabled={disabled}
                inputProps={{ id: `${id}-input`, 'data-testid': `${id}-input` }}
                {...props}
            >
                {options?.map(period => (
                    <MenuItem
                        value={period.value}
                        key={period.value}
                        id={`${id}-option-${period.value}`}
                        data-testid={`${id}-option-${period.value}`}
                    >
                        {period.label}
                    </MenuItem>
                ))}
            </Select>
            {!!nextDateTextFormatter && (
                <Typography component={'span'} data-testid={`${id}-nextdate-label`}>
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
