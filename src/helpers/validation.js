import { locale } from 'locale';

/**
 * Generic, reusable field validators.
 *
 * Each validator takes a value and returns an error message, or undefined when the value is acceptable. That
 * shape is what `<Field validate={[...]} />` expects, and it lets validators be composed in a list and
 * checked in order. Domain-specific rules belong with the app that owns them, built on top of these.
 *
 * Note that every validator except `required`/`requireChecked` passes an empty value. Whether a field is
 * mandatory is `required`'s job alone, so an optional field can carry a format rule without being forced to
 * have a value.
 */

const EMAIL_PATTERN = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

export const isEmpty = value => value === null || value === undefined || String(value).trim().length === 0;

export const required = value => (isEmpty(value) ? locale.validationErrors.required : undefined);

/**
 * For agreement checkboxes. Accepts the boolean a checkbox reports and the 'on' an unbound input reports.
 */
export const requireChecked = value =>
    value === true || value === 'on' ? undefined : locale.validationErrors.requireChecked;

export const email = value =>
    !isEmpty(value) && !EMAIL_PATTERN.test(value) ? locale.validationErrors.email : undefined;

export const maxLengthValidator = max => value =>
    !isEmpty(value) && String(value).length > max ? locale.validationErrors.maxLength.replace('[max]', max) : undefined;

export const minLengthValidator = min => value =>
    !isEmpty(value) && String(value).trim().length < min
        ? locale.validationErrors.minLength.replace('[min]', min)
        : undefined;

/**
 * Build a validator from a regular expression.
 *
 * Anchor the pattern unless you specifically want a partial match - an unanchored pattern passes as soon as
 * any part of the value matches.
 */
export const patternValidator = (pattern, message) => value =>
    !isEmpty(value) && !pattern.test(String(value)) ? message : undefined;
