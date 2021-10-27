import React from 'react';
import locale from 'locale/validationErrors';
import Immutable from 'immutable';

// Max Length
export const maxLength = max => value =>
    value && value.toString().replace(/\s/g, '').length > max
        ? locale.validationErrors.maxLength.replace('[max]', max)
        : undefined;
export const maxLengthWithWhitespace = max => value =>
    (value && value.plainText && value.plainText.length > max) || (!value.plainText && value.length > max + 7)
        ? locale.validationErrors.maxLength.replace('[max]', max)
        : undefined;
export const maxLength9 = maxLength(9);
export const maxLength10 = maxLength(10);
export const maxLength255 = maxLength(255);
export const maxLength800 = maxLength(800);
export const maxLength1000 = maxLength(1000);
export const maxLength2000 = maxLength(2000); // URL's must be under 2000 characters

// Min Length
export const minLength = min => value =>
    (value !== null || value !== undefined) && value.trim().length < min
        ? locale.validationErrors.minLength.replace('[min]', min)
        : undefined;
export const minLength10 = minLength(10);

// Public Search Validation rules
export const maxLength500 = maxLength(500);

export const isValidPid = value => {
    const isValid = /^uq:[a-z0-9]+$/i;
    return isValid.test(value.toString().trim());
};

// Generic
export const required = value => (value ? undefined : locale.validationErrors.required);

export const requiredList = value => {
    return ((value instanceof Immutable.List && value.toJS()) || value || []).length > 0
        ? undefined
        : locale.validationErrors.required;
};

export const email = value =>
    !value || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? locale.validationErrors.email : undefined;
export const url = value =>
    value && !/^(http[s]?|ftp[s]?)(:\/\/){1}(.*)$/i.test(value) ? locale.validationErrors.url : maxLength2000(value);
export const pid = value => (!!value && !isValidPid(value) ? locale.validationErrors.pid : undefined);

export const translateFormErrorsToText = formErrors => {
    if (!formErrors) return null;

    let errorMessagesList = [];

    Object.keys(formErrors).map(key => {
        const value = formErrors[key];
        if (typeof value === 'object') {
            const errorMessage = translateFormErrorsToText(value);
            if (errorMessage) {
                errorMessagesList = errorMessagesList.concat(errorMessage);
            }
        }

        if (locale.validationErrorsSummary.hasOwnProperty(key)) {
            errorMessagesList.push(locale.validationErrorsSummary[key]);
        }
    });

    return errorMessagesList.length > 0 ? errorMessagesList : null;
};

export const getErrorAlertProps = ({
    submitting = false,
    error,
    formErrors,
    submitSucceeded = false,
    alertLocale = {},
}) => {
    let alertProps = null;
    if (submitting) {
        alertProps = { ...alertLocale.progressAlert };
    } else if (submitSucceeded) {
        alertProps = { ...alertLocale.successAlert };
    } else {
        if (error) {
            let message = error;
            if (alertLocale.errorAlert.message) {
                message =
                    typeof alertLocale.errorAlert.message === 'function'
                        ? alertLocale.errorAlert.message(error)
                        : alertLocale.errorAlert.message;
            }
            // error is set by submit failed, it's reset once form is re-validated (updated for re-submit)
            alertProps = {
                ...alertLocale.errorAlert,
                message: message,
            };
        } else if (formErrors && formErrors.size === undefined) {
            // formErrors is set by form validation or validate method, it's reset once form is re-validated
            const errorMessagesList = formErrors ? translateFormErrorsToText(formErrors) : null;
            const keyPrefix = `validation-${alertLocale.validationAlert.type || 'warning'}`;
            const message = (
                <span>
                    {alertLocale.validationAlert.message}
                    <ul>
                        {errorMessagesList &&
                            errorMessagesList.length > 0 &&
                            errorMessagesList.map((item, index) => (
                                <li key={`${keyPrefix}-${index}`} data-testid={`${keyPrefix}-${index}`}>
                                    {item}
                                </li>
                            ))}
                    </ul>
                </span>
            );
            alertProps = { ...alertLocale.validationAlert, message: message };
        }
    }
    return alertProps;
};
