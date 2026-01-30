import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ClearIcon from '@mui/icons-material/Clear';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        },
    },
};

/**
 * @param {string} field
 * @param {Function} setFilterModel
 * @param {number[]} ids
 * @return {Object}
 */
const updateFilter = (field, setFilterModel, ids) =>
    setFilterModel(prev => {
        const items = prev?.items || /* istanbul ignore next */ [];
        const rest = items.filter(i => i?.columnField !== field);
        if (!ids.length) return { ...prev, items: rest };

        return {
            ...prev,
            items: [
                ...rest,
                {
                    columnField: field,
                    operatorValue: 'isAnyOf',
                    operator: 'isAnyOf',
                    value: ids.map(v => String(v)),
                },
            ],
        };
    });

const SelectField = ({ field, options, locale, filterModel, setFilterModel, ...rest }) => {
    const id = _.kebabCase(field);
    const labelById = React.useMemo(() => new Map(options.map(o => [o.id, o.label])), [options]);
    const activeFilterValues = React.useMemo(
        () => filterModel?.items?.find?.(i => i?.columnField === field)?.value.map(i => Number(i)) || [],
        [field, filterModel],
    );
    const selected = React.useMemo(
        () =>
            (options &&
                activeFilterValues?.filter(
                    // filter out no longer available options
                    v => options.find(o => parseInt(o.id, 10) === v),
                )) ||
            /* istanbul ignore next */ [],
        [activeFilterValues, options],
    );

    // handles filter values that were once active but are no longer available within the current options
    /* istanbul ignore next */
    useEffect(() => {
        if (selected.join(',') === activeFilterValues.join(',')) return;
        updateFilter(field, setFilterModel, selected);
    }, [activeFilterValues, selected]);

    const handleChange = e => {
        const ids = e?.target?.value || /* istanbul ignore next */ [];
        updateFilter(field, setFilterModel, Array.isArray(ids) ? ids : [ids]);
    };

    const handleClear = e => {
        e.preventDefault();
        e.stopPropagation();
        updateFilter(field, setFilterModel, []);
    };

    return (
        <FormControl variant="standard" fullWidth>
            <InputLabel id={`${id}-label`} shrink>
                {locale.label}
            </InputLabel>
            <Select
                id={`${id}-select-filter`}
                data-testid={`${id}-select-filter`}
                labelId={`${id}-label`}
                label={locale.label}
                MenuProps={MenuProps}
                onChange={handleChange}
                value={selected}
                displayEmpty
                renderValue={vals => vals?.map?.(v => labelById.get(v)).join(', ') || locale.all}
                endAdornment={
                    selected.length > 0 ? (
                        <InputAdornment position="end">
                            <IconButton
                                edge="end"
                                size="small"
                                sx={{ mr: 3, p: 0.5 }}
                                aria-label="Clear selection"
                                data-testid={`${id}-select-filter-clear-button`}
                                onMouseDown={e => e.stopPropagation()}
                                onClick={handleClear}
                            >
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    ) : null
                }
                {...rest}
            >
                {options.map(o => (
                    <MenuItem key={o.id} value={o.id}>
                        {o.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

SelectField.propTypes = {
    field: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    locale: PropTypes.object.isRequired,
    filterModel: PropTypes.object.isRequired,
    setFilterModel: PropTypes.func.isRequired,
};

export default React.memo(SelectField);
