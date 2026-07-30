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
 * The years offered by the date of birth year select, newest first.
 *
 * Runs from ten years ago back to 1916 - so it neither offers a birth year that would make the applicant a
 * child, nor one that would make them impossibly old.
 */
export const getBirthYears = (now = new Date()) => {
    const years = [];
    for (let year = now.getFullYear() - MINIMUM_AGE; year >= EARLIEST_BIRTH_YEAR; year--) {
        years.push(year);
    }
    return years;
};

/**
 * Join the three date of birth selects into the single field the API stores.
 *
 * The day is not zero-padded but the month is, because that is what the selects supply: `1-02-1970`.
 */
export const assembleDateOfBirth = ({ date_of_birth_day: day, date_of_birth_month: month, date_of_birth_year: year }) =>
    `${day}-${month}-${year}`;

/**
 * Split a stored date of birth back into the three selects.
 *
 * The month is padded on the way out. The API has records whose month is stored unpadded (`1-2-1970`), and an
 * unpadded month matches none of the select's options, which would silently blank the month on a renewal.
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
 * Work out what the applicant is paying for, if anything.
 *
 * Alumni friends choose a period, so their choice is the code. Community has a single option, so it is
 * assigned for them. Every other type is free and sends no code at all. The amount itself is never decided
 * here - the API and the payment gateway resolve that from the code.
 */
export const derivePaymentCode = (type, formValues = {}, paymentOptions = []) => {
    if (type === MEMBERSHIP_TYPES.ALUMNI_FRIENDS) {
        return formValues.alumnifriendshipLevel ?? '';
    }
    if (type === MEMBERSHIP_TYPES.COMMUNITY) {
        return paymentOptions[0]?.code ?? '';
    }
    return '';
};

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
        payment_code: derivePaymentCode(applicationType, formValues, paymentOptions),
    };
};

/**
 * Whether a type is one of the three alumni flavours - alumni, alumninew, alumnifriends.
 */
export const isAlumniType = type => typeof type === 'string' && type.startsWith('alumni');

/**
 * Shape a membership record from the API into values the form can hold.
 *
 * `retired_years` and `alumni_graduated` are turned back into numbers so those fields behave as number fields
 * when a record is loaded. `alumni_num` is left as the string the API sent — it is a student number like
 * `s1234567`, which is not a number to parse.
 */
export const transformResponse = membership => {
    if (!membership) {
        return {};
    }

    return {
        ...membership,
        ...parseDateOfBirth(membership.date_of_birth),
        ...(membership.type === MEMBERSHIP_TYPES.RETIRED && membership.retired_years !== undefined
            ? { retired_years: parseInt(membership.retired_years, 10) }
            : {}),
        ...(isAlumniType(membership.type) && membership.alumni_graduated !== undefined
            ? { alumni_graduated: parseInt(membership.alumni_graduated, 10) }
            : {}),
    };
};

/**
 * Whether this record is a renewal rather than a fresh application. The API says so via its status.
 */
export const isRenewal = membership => membership?.status === 'renewing';
