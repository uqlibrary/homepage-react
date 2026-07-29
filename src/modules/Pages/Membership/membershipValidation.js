import { maxLengthValidator, minLengthValidator, patternValidator } from 'helpers/validation';
import locale from './membership.locale';

const { validationErrors } = locale;

/**
 * Membership-specific field validators.
 *
 * Each is built from the generic helpers, so they share the "empty values pass" rule — `required` decides
 * whether a field must be filled in, these decide whether what was typed is acceptable.
 */

// A four digit Australian postcode.
export const postcode = patternValidator(/^[0-9]{4}$/, validationErrors.postcode);

/**
 * A phone number, as digits and the punctuation people write them with. Anchored, so the whole value must be
 * made up of phone characters rather than merely contain one — "n/a1" is rejected. The authoritative check
 * remains server-side, which rejects with a field error.
 */
export const phone = patternValidator(/^[+0-9\-() ]+$/, validationErrors.phone);

export const email = patternValidator(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i, validationErrors.email);

export const maxLength = (max, message) => {
    const validate = maxLengthValidator(max);
    return value => (validate(value) ? message : undefined);
};

export const minLength = (min, message) => {
    const validate = minLengthValidator(min);
    return value => (validate(value) ? message : undefined);
};
