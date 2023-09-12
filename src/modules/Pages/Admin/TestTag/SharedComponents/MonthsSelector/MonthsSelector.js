import React from 'react';

import PropTypes from 'prop-types';

import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

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
    const isMobileView = useMediaQuery(theme.breakpoints.down('sm')) || false;

    const onValueChange = event => {
        onChange?.(event.target.value);
    };

    return (
        <FormControl
            variant="standard"
            className={classNames?.formControl}
            fullWidth
            disabled={disabled}>
            {!!label && (
                <InputLabel
                    shrink
                    required={required}
                    htmlFor={`${componentId}-input`}
                    id={`${componentId}-label`}
                    data-testid={`${componentId}-label`}
                >
                    {label}
                </InputLabel>
            )}
            <Select
                variant="standard"
                id={`${componentId}`}
                data-testid={`${componentId}`}
                MenuProps={{
                    id: `${componentId}-options`,
                    'data-testid': `${componentId}-options`,
                }}
                inputProps={{
                    id: `${componentId}-input`,
                    ['data-testid']: `${componentId}-input`,
                }}
                SelectDisplayProps={{
                    id: `${componentId}-select`,
                    'data-testid': `${componentId}-select`,
                }}
                fullWidth={responsive && isMobileView}
                className={classNames?.select}
                value={currentValue ?? ''}
                onChange={onValueChange}
                required={required}
                {...props}>
                {options?.map((period, index) => (
                    <MenuItem
                        value={period.value}
                        key={period.value}
                        id={`${componentId}-option-${index}`}
                        data-testid={`${componentId}-option-${index}`}
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
