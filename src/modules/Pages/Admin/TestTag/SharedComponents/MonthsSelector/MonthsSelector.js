import React from 'react';

import PropTypes from 'prop-types';

import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';

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

    const onValueChange = event => {
        onChange?.(event.target.value);
    };

    return (
        <FormControl className={classNames.formControl} fullWidth={responsive && isMobileView}>
            {!!label && (
                <InputLabel shrink required={required} id={`${componentId}-label`} data-testid={`${componentId}-label`}>
                    {label}
                </InputLabel>
            )}
            <Select
                id={`${componentId}`}
                data-testid={`${componentId}`}
                fullWidth={responsive && isMobileView}
                className={classNames.select}
                value={currentValue}
                onChange={onValueChange}
                required={required}
                disabled={disabled}
                inputProps={{ id: `${componentId}-input`, 'data-testid': `${componentId}-input` }}
                {...props}
            >
                {options?.map(period => (
                    <MenuItem
                        value={period.value}
                        key={period.value}
                        id={`${componentId}-option-${period.value}`}
                        data-testid={`${componentId}-option-${period.value}`}
                    >
                        {period.label}
                    </MenuItem>
                ))}
            </Select>
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
