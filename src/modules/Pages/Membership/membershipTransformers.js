import { MEMBERSHIP_TYPES } from './membershipFieldRules';

/**
 * Moving a membership application between the shape the form holds and the shape the API expects.
 */

// The oldest and youngest an applicant may say they are — a floor on the year list, not a birthday calculation.
export const MINIMUM_AGE = 10;
export const EARLIEST_BIRTH_YEAR = 1916;
export const DAYS_IN_MONTH_MAX = 31;

/**
 * The days offered by the date of birth day select: 1 to 31, regardless of month.
 */
export const getBirthDays = () => Array.from({ length: DAYS_IN_MONTH_MAX }, (_unused, index) => index + 1);

/**
 * The years offered by the date of birth year select, newest first: from ten years ago back to 1916 — so it
 * offers neither a birth year that would make the applicant a child nor one that would make them impossibly old.
 */
export const getBirthYears = (now = new Date()) => {
    const years = [];
    for (let year = now.getFullYear() - MINIMUM_AGE; year >= EARLIEST_BIRTH_YEAR; year--) {
        years.push(year);
    }
    return years;
};

/**
 * Join the three date of birth selects into the single field the API stores. The day is not zero-padded but
 * the month is, because that is what the selects supply: `1-02-1970`.
 */
export const assembleDateOfBirth = ({ date_of_birth_day: day, date_of_birth_month: month, date_of_birth_year: year }) =>
    `${day}-${month}-${year}`;

/**
 * Split a stored date of birth back into the three selects. The month is padded on the way out: the API has
 * records whose month is stored unpadded (`1-2-1970`), which would match none of the select's options and so
 * silently blank the month when a record is loaded back into the form.
 */
export const parseDateOfBirth = dateOfBirth => {
    if (!dateOfBirth || typeof dateOfBirth !== 'string') {
        return {};
    }

    const [day, month, year] = dateOfBirth.split('-');
    if (!day || !month || !year) {
        return {};
    }

    return {
        date_of_birth_day: parseInt(day, 10),
        date_of_birth_month: String(month).padStart(2, '0'),
        date_of_birth_year: parseInt(year, 10),
    };
};

/**
 * Work out what the applicant is paying for, if anything. Community has a single paid option, so it is assigned
 * for them; a type with no paid options sends no code. The amount is resolved by the API and payment gateway
 * from the code, never here.
 */
export const derivePaymentCode = (type, paymentOptions = []) =>
    type === MEMBERSHIP_TYPES.COMMUNITY ? (paymentOptions[0]?.code ?? '') : '';

/**
 * Shape the form's values into the body the API is sent. The three date of birth selects are sent alongside
 * the assembled date — the API is known to receive both.
 */
export const transformRequest = (formValues, { type, paymentOptions = [] } = {}) => {
    const applicationType = type ?? formValues.type;

    return {
        ...formValues,
        type: applicationType,
        date_of_birth: assembleDateOfBirth(formValues),
        payment_code: derivePaymentCode(applicationType, paymentOptions),
    };
};

/**
 * Shape a membership record from the API into values the form can hold.
 */
export const transformResponse = membership => {
    if (!membership) {
        return {};
    }

    return {
        ...membership,
        ...parseDateOfBirth(membership.date_of_birth),
    };
};

/**
 * Whether this record is a renewal rather than a fresh application. The API says so via its status.
 */
export const isRenewal = membership => membership?.status === 'renewing';
