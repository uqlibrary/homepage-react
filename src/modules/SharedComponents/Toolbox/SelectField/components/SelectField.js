import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

/**
 * A MUI Select wired for use as a <Field component={...} /> in our react-hook-form layer.
 *
 * `options` is a list of { value, label }. A `placeholder` adds a leading empty choice, for the selects that
 * open on a prompt rather than on a real value.
 *
 * Ids follow the same convention as our TextField: `selectFieldId` seeds the testids for the select, its
 * input, its label and its helper text.
 *
 * Accessibility: unlike a text input, the element the user focuses is the SelectDisplay div (role=combobox),
 * not the native input - which MUI renders aria-hidden. So the error association and invalid state have to be
 * put on the display element by hand, or a screen reader user is never told the field is wrong.
 */
export const SelectFieldWrapper = React.forwardRef((props, ref) => {
    const {
        selectFieldId,
        state,
        inputRef,
        errorText,
        label,
        hideLabel,
        ariaLabel,
        options,
        placeholder,
        required,
        disabled,
        inputProps,
        SelectDisplayProps,
        MenuProps,
        ...rest
    } = props;

    const id = selectFieldId ?? rest.name;
    const errorMessage = errorText ?? state?.error;
    const helperTextId = `${id}-helper-text`;

    // With no visible label there is nothing for aria-labelledby to point at, so name the display element
    // directly instead of leaving a reference dangling at an element that was never rendered.
    const labelIsVisible = !hideLabel && !!label;
    const accessibleName = ariaLabel ?? (labelIsVisible ? undefined : label);

    return (
        <FormControl variant="standard" fullWidth error={!!errorMessage} required={!!required} disabled={!!disabled}>
            {labelIsVisible && (
                <InputLabel id={`${id}-label`} data-testid={`${id}-label`}>
                    {label}
                </InputLabel>
            )}
            <Select
                {...rest}
                ref={ref}
                inputRef={inputRef}
                labelId={labelIsVisible ? `${id}-label` : undefined}
                value={rest.value ?? ''}
                // Show the placeholder choice in the collapsed control, not just once the menu is open — a
                // select whose label is hidden would otherwise read as blank until a value is picked.
                displayEmpty={!!placeholder}
                // the element the user actually clicks and focuses, so this is where its name, its invalid
                // state and its error association have to live
                SelectDisplayProps={{
                    id: `${id}-select`,
                    'data-testid': `${id}-select`,
                    'data-analyticsid': `${id}-select`,
                    'aria-invalid': !!errorMessage,
                    ...(errorMessage ? { 'aria-describedby': helperTextId } : {}),
                    // With no label to point at, MUI still emits an aria-labelledby referencing the display
                    // element itself, which would out-rank aria-label and leave the field announced as its
                    // own selected value. Clear it so the name we set is the one that is actually used.
                    ...(accessibleName ? { 'aria-label': accessibleName, 'aria-labelledby': undefined } : {}),
                    ...SelectDisplayProps,
                }}
                MenuProps={{
                    id: `${id}-options`,
                    'data-testid': `${id}-options`,
                    ...MenuProps,
                }}
                inputProps={{
                    id: `${id}-input`,
                    'data-testid': `${id}-input`,
                    'data-analyticsid': `${id}-input`,
                    ...inputProps,
                }}
            >
                {!!placeholder && (
                    <MenuItem value="" data-testid={`${id}-option-placeholder`}>
                        {placeholder}
                    </MenuItem>
                )}
                {options.map(option => (
                    <MenuItem key={option.value} value={option.value} data-testid={`${id}-option-${option.value}`}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
            {!!errorMessage && (
                <FormHelperText id={helperTextId} data-testid={helperTextId}>
                    {errorMessage}
                </FormHelperText>
            )}
        </FormControl>
    );
});

SelectFieldWrapper.propTypes = {
    selectFieldId: PropTypes.string,
    name: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.any,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.any.isRequired,
            label: PropTypes.node.isRequired,
        }),
    ),
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    hideLabel: PropTypes.bool,
    // Only needed when the visible label does not name the field well enough. Must contain the visible
    // label's text (WCAG 2.5.3).
    ariaLabel: PropTypes.string,
    // supplied by our react-hook-form Controller
    state: PropTypes.shape({
        error: PropTypes.string,
        defaultValue: PropTypes.any,
    }),
    inputRef: PropTypes.any,
    errorText: PropTypes.string,
    inputProps: PropTypes.object,
    SelectDisplayProps: PropTypes.object,
    MenuProps: PropTypes.object,
};

SelectFieldWrapper.defaultProps = {
    options: [],
};

SelectFieldWrapper.displayName = 'SelectField';

export default SelectFieldWrapper;
