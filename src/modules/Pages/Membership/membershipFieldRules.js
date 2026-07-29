import { required as requiredValidator } from 'helpers/validation';
import * as validate from './membershipValidation';
import locale from './membership.locale';

const { validationErrors } = locale;

/**
 * The membership types the API offers. Values are the `account_types[].value` the API returns and the
 * `:type` segment the form is routed on. Further types are added as each type's form is migrated.
 */
export const MEMBERSHIP_TYPES = {
    COMMUNITY: 'community',
};

const { COMMUNITY } = MEMBERSHIP_TYPES;

/**
 * Which fields each type asks for, which of them it insists on, and how each is checked.
 *
 * `visibleFor` / `requiredFor` are lists of types; `validate` is the extra checks a filled-in value must
 * pass. `required` owns whether a value must be present, so the `validate` checks all pass an empty value.
 */
export const membershipFieldRules = {
    // Account information
    title: { visibleFor: [COMMUNITY], requiredFor: [COMMUNITY] },
    first_name: {
        visibleFor: [COMMUNITY],
        requiredFor: [COMMUNITY],
        validate: [validate.maxLength(65, validationErrors.firstName)],
    },
    sn: {
        visibleFor: [COMMUNITY],
        requiredFor: [COMMUNITY],
        validate: [validate.maxLength(65, validationErrors.lastName)],
    },
    date_of_birth_day: { visibleFor: [COMMUNITY], requiredFor: [COMMUNITY] },
    date_of_birth_month: { visibleFor: [COMMUNITY], requiredFor: [COMMUNITY] },
    date_of_birth_year: { visibleFor: [COMMUNITY], requiredFor: [COMMUNITY] },

    // Contact information
    mail: {
        visibleFor: [COMMUNITY],
        requiredFor: [COMMUNITY],
        validate: [validate.email, validate.maxLength(50, validationErrors.tooLong)],
    },
    home_address_0: {
        visibleFor: [COMMUNITY],
        requiredFor: [COMMUNITY],
        validate: [validate.maxLength(250, validationErrors.address)],
    },
    home_address_1: {
        visibleFor: [COMMUNITY],
        requiredFor: [],
        validate: [validate.maxLength(250, validationErrors.address)],
    },
    home_address_city: {
        visibleFor: [COMMUNITY],
        requiredFor: [COMMUNITY],
        validate: [validate.maxLength(100, validationErrors.city)],
    },
    home_address_state: {
        visibleFor: [COMMUNITY],
        requiredFor: [COMMUNITY],
        validate: [validate.maxLength(50, validationErrors.state)],
    },
    home_address_postcode: {
        visibleFor: [COMMUNITY],
        requiredFor: [COMMUNITY],
        validate: [validate.postcode, validate.maxLength(4, validationErrors.postcode)],
    },
    phone: {
        visibleFor: [COMMUNITY],
        requiredFor: [COMMUNITY],
        validate: [
            validate.phone,
            validate.minLength(8, validationErrors.phone),
            validate.maxLength(20, validationErrors.phone),
        ],
    },
};

export const ALL_FIELDS = Object.keys(membershipFieldRules);

const ruleFor = field => membershipFieldRules[field];

export const isKnownField = field => Object.prototype.hasOwnProperty.call(membershipFieldRules, field);

export const isFieldVisible = (field, type) => !!ruleFor(field)?.visibleFor.includes(type);

export const isFieldRequired = (field, type) =>
    isFieldVisible(field, type) && !!ruleFor(field)?.requiredFor.includes(type);

/**
 * Every validator that applies to a field for a given type, `required` first so a missing value is reported
 * as missing rather than as malformed.
 */
export const getFieldValidators = (field, type) => {
    const rule = ruleFor(field);
    if (!rule) {
        return [];
    }
    return [...(isFieldRequired(field, type) ? [requiredValidator] : []), ...(rule.validate ?? [])];
};

/**
 * The fields a given type asks for, in the order the form declares them.
 */
export const getVisibleFields = type => ALL_FIELDS.filter(field => isFieldVisible(field, type));

export const getRequiredFields = type => ALL_FIELDS.filter(field => isFieldRequired(field, type));
