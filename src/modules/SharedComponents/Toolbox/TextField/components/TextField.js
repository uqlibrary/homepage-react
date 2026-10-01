import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';

/**
 * A MUI TextField wired for use as a <Field component={...} /> in our react-hook-form layer.
 *
 * It takes the decorated field react-hook-form hands over (name/value/onChange/onBlur/inputRef/state) and
 * keeps the parts that are not DOM attributes - `state` and `inputRef` - away from the underlying input.
 *
 * Every id is derived from `textFieldId`, which seeds `data-testid` and `data-analyticsid` for the field, its
 * input, its label and its helper text. Tests and analytics both depend on those being predictable.
 *
 * Accessibility: MUI associates the label (`for`), the error (`aria-describedby`) and `aria-invalid` off the
 * `id` we pass, so those come for free. What does not come for free is the accessible name - see `ariaLabel`.
 */
export const TextFieldWrapper = React.forwardRef((props, ref) => {
    const {
        textFieldId,
        state,
        inputRef,
        errorText,
        helpText,
        hideLabel,
        ariaLabel,
        inputProps,
        InputLabelProps,
        FormHelperTextProps,
        label,
        ...rest
    } = props;

    const id = textFieldId ?? rest.name;
    // an error passed in explicitly wins over the one react-hook-form reports, so a form-level error can be
    // pushed onto a field
    const errorMessage = errorText ?? state?.error;
    // Standing guidance and the error share the helper slot, so whichever is showing is the one MUI points
    // aria-describedby at. An error replaces the guidance rather than sitting beside it, because by then the
    // guidance has already been read and not followed.
    const helperText = errorMessage || helpText || undefined;

    // A visible label already names the input via `for`/`id`, and an aria-label would silently replace it -
    // so only fall back to one when there is no visible label to rely on. Where `ariaLabel` is given
    // deliberately (to say "Date of birth day" for a field labelled "Day"), WCAG 2.5.3 requires it to
    // contain the visible label's text, or speech-input users cannot address the field by what they can see.
    const labelIsVisible = !hideLabel && !!label;
    const accessibleName = ariaLabel ?? (labelIsVisible ? undefined : label);

    return (
        <TextField
            variant="standard"
            fullWidth
            {...rest}
            // A hidden label is not rendered at all rather than rendered and hidden. MUI shifts an input down
            // by 16px to make room for its label using a sibling selector, which a display:none label still
            // matches - so a hidden one reserved space for itself and left the field sitting below the selects
            // beside it. The field keeps its name via aria-label.
            label={labelIsVisible ? label : undefined}
            ref={ref}
            inputRef={inputRef}
            id={id}
            data-testid={id}
            value={rest.value ?? ''}
            error={!!errorMessage}
            helperText={helperText}
            inputProps={{
                id: `${id}-input`,
                'data-testid': `${id}-input`,
                'data-analyticsid': `${id}-input`,
                ...(accessibleName ? { 'aria-label': accessibleName } : {}),
                ...inputProps,
            }}
            InputLabelProps={{
                id: `${id}-label`,
                'data-testid': `${id}-label`,
                htmlFor: `${id}-input`,
                ...InputLabelProps,
            }}
            FormHelperTextProps={{
                'data-testid': `${id}-helper-text`,
                ...FormHelperTextProps,
            }}
        />
    );
});

TextFieldWrapper.propTypes = {
    textFieldId: PropTypes.string,
    name: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.any,
    // supplied by our react-hook-form Controller
    state: PropTypes.shape({
        error: PropTypes.string,
        defaultValue: PropTypes.any,
    }),
    inputRef: PropTypes.any,
    errorText: PropTypes.string,
    // Standing guidance shown under the field until an error needs the space.
    helpText: PropTypes.string,
    hideLabel: PropTypes.bool,
    // Only needed when the visible label does not name the field well enough. Must contain the visible
    // label's text (WCAG 2.5.3).
    ariaLabel: PropTypes.string,
    inputProps: PropTypes.object,
    InputLabelProps: PropTypes.object,
    FormHelperTextProps: PropTypes.object,
};

TextFieldWrapper.displayName = 'TextField';

export default TextFieldWrapper;
