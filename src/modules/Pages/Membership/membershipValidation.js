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

// A UQ student number: 's' followed by seven digits, e.g. s1234567.
export const studentNumber = patternValidator(/^s[0-9]{7}$/, validationErrors.studentNumber);

/**
 * A phone number, as digits and the punctuation people write them with. Anchored, so the whole value must be
 * made up of phone characters rather than merely contain one — "n/a1" is rejected. The authoritative check
 * remains server-side, which rejects with a field error.
 */
export const phone = patternValidator(/^[+0-9\-() ]+$/, validationErrors.phone);

// A date written the way the proxy borrower fields ask for it.
export const proxyDate = patternValidator(/^[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}$/, validationErrors.proxyDate);

export const email = patternValidator(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i, validationErrors.email);

export const maxLength = (max, message) => {
    const validate = maxLengthValidator(max);
    return value => (validate(value) ? message : undefined);
};

export const minLength = (min, message) => {
    const validate = minLengthValidator(min);
    return value => (validate(value) ? message : undefined);
};

/**
 * A year of graduation, entered as a number. Accepts a 2-to-4 digit number of at least 10 — deliberately loose,
 * matching what the form has always accepted, so values that have long been going through keep going through.
 */
export const graduatedYear = value => {
    if (value === null || value === undefined || String(value).trim().length === 0) {
        return undefined;
    }
    const asString = String(value).trim();
    const asNumber = Number(asString);
    if (Number.isNaN(asNumber) || asString.length < 2 || asString.length > 4 || asNumber < 10) {
        return validationErrors.graduatedYear;
    }
    return undefined;
};

/**
 * Years of service, entered as a number. The minimum of 10 is the eligibility rule for retired staff
 * membership, not a formatting nicety.
 */
export const RETIRED_MINIMUM_YEARS = 10;

export const retiredYears = value => {
    if (value === null || value === undefined || String(value).trim().length === 0) {
        return undefined;
    }
    const asString = String(value).trim();
    const asNumber = Number(asString);
    if (Number.isNaN(asNumber) || asString.length !== 2 || asNumber < RETIRED_MINIMUM_YEARS) {
        return validationErrors.retiredYears;
    }
    return undefined;
};
