import React, { useState } from 'react';

import PropTypes from 'prop-types';

import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

const rootId = 'team_selector';

const TeamSelector = ({
    id,
    label,
    options,
    currentValue,
    onChange,
    required = false,
    responsive = true,
    disabled = false,
    hasAllOption = false,
    classNames,
    ...props
}) => {
    const componentId = `${rootId}-${id}`;
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('sm')) || false;
    const initOptions = () => (!!hasAllOption ? [{ value: -1, label: 'All teams' }, ...options] : options);
    const [optionList] = useState(initOptions);

    const onValueChange = event => {
        onChange?.(event.target.value);
    };

    return (
        <FormControl variant="standard" className={classNames?.formControl} fullWidth disabled={disabled}>
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
                    'aria-label': label,
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
                {...props}
            >
                {optionList?.map((option, index) => (
                    <MenuItem
                        value={option.value}
                        key={option.value}
                        id={`${componentId}-option-${index}`}
                        data-testid={`${componentId}-option-${index}`}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

TeamSelector.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.string.isRequired,
        }),
    ),
    currentValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    required: PropTypes.bool,
    responsive: PropTypes.bool,
    disabled: PropTypes.bool,
    hasAllOption: PropTypes.bool,
    classNames: PropTypes.shape({
        formControl: PropTypes.string,
        select: PropTypes.string,
    }),
};

export default React.memo(TeamSelector);
