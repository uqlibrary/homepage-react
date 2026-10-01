import React from 'react';
import PropTypes from 'prop-types';
import Controller from './Controller';

/**
 * Run `value` through each validator in turn and return the first error message, if any.
 *
 * Validators are awaited, so an async validator (e.g. one that hits an API) can be mixed into the array.
 * A validator signals "valid" by returning anything that is not a non-empty string.
 */
export const validateHandler = async (value, formValues, validators) => {
    if (!Array.isArray(validators)) {
        return undefined;
    }

    for (const validator of validators) {
        if (typeof validator !== 'function') {
            continue;
        }
        let result = await validator(value, formValues);
        if (typeof result !== 'string') {
            continue;
        }
        result = result.trim();
        if (result.length > 0) {
            return result;
        }
    }
    return undefined;
};

/**
 * A Higher-Order Component that wires a plain field component up to react-hook-form.
 *
 * Props notes:
 * - validate: an array of validators, checked against the field's value sequentially, in left-to-right order.
 * - normalize: function called with every change event's value, before it is written to form state.
 * - controller: swap in a Controller that extends the default one, for cases needing extra behaviour.
 */
const Field = ({
    name,
    control,
    rules,
    component: Component,
    validate,
    normalize,
    controller: ControllerComponent = Controller,
    ...childProps
}) => (
    <ControllerComponent
        name={name}
        control={control}
        rules={{
            ...rules,
            validate: (value, formValues) => validateHandler(value, formValues, validate ?? []),
        }}
        render={({ field }) => {
            if (typeof field.onChange === 'function' && typeof normalize === 'function') {
                const originalOnChange = field.onChange;
                field.onChange = event => originalOnChange(normalize(event?.target ? event.target.value : event));
            }
            return <Component {...childProps} {...field} />;
        }}
    />
);

Field.propTypes = {
    name: PropTypes.string.isRequired,
    control: PropTypes.object.isRequired,
    rules: PropTypes.object,
    component: PropTypes.elementType.isRequired,
    validate: PropTypes.arrayOf(PropTypes.func),
    normalize: PropTypes.func,
    controller: PropTypes.elementType,
};

export default Field;
