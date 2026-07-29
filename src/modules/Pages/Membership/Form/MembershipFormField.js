import React from 'react';
import PropTypes from 'prop-types';

import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';

import { getFieldValidators, isFieldRequired, isFieldVisible } from '../membershipFieldRules';
import { getFieldConfig, getFieldOptions, isSelectField } from '../membershipFormFields';

/**
 * One field of the application form, drawn from the config rather than hand-written.
 *
 * What it looks like comes from membershipFormFields; whether it is shown at all, whether it is required and
 * how it is checked come from membershipFieldRules. Nothing here decides any of that.
 */
export const MembershipFormField = ({ field, control, type, formData, current, hideLabel }) => {
    const config = getFieldConfig(field);

    // A field this type never asks for is simply not drawn, so it can neither be filled in nor validated.
    if (!config || !isFieldVisible(field, type)) {
        return null;
    }

    const required = isFieldRequired(field, type);

    // A grouped field hides its label, so the required asterisk MUI would put on the label has nowhere to
    // show — mark it in the placeholder instead. A field with a visible label already shows the asterisk there.
    const placeholder = required && hideLabel ? `${config.placeholder} *` : config.placeholder;

    const common = {
        name: field,
        control,
        validate: getFieldValidators(field, type),
        label: config.label,
        hideLabel: !!hideLabel,
        required,
    };

    if (isSelectField(field)) {
        return (
            <Field
                {...common}
                component={SelectField}
                selectFieldId={field}
                options={getFieldOptions(field, formData, current)}
                placeholder={placeholder}
            />
        );
    }

    return (
        <Field
            {...common}
            component={TextField}
            textFieldId={field}
            type={config.type ?? 'text'}
            placeholder={placeholder}
            helpText={config.help}
        />
    );
};

MembershipFormField.propTypes = {
    field: PropTypes.string.isRequired,
    control: PropTypes.object.isRequired,
    type: PropTypes.string,
    formData: PropTypes.object,
    current: PropTypes.object,
    hideLabel: PropTypes.bool,
};

export default MembershipFormField;
