import { required as requiredValidator, requireChecked } from 'helpers/validation';
import * as validate from './membershipValidation';
import locale from './membership.locale';

const { validationErrors } = locale;

/**
 * The twelve membership types the API offers. The values are the `account_types[].value` the API returns and
 * the `:type` segment the form is routed on.
 */
export const MEMBERSHIP_TYPES = {
    ALUMNI: 'alumni',
    ALUMNI_NEW: 'alumninew',
    ALUMNI_FRIENDS: 'alumnifriends',
    COMMUNITY: 'community',
    HOSPITAL: 'hospital',
    RETIRED: 'retired',
    RECIPROCAL: 'reciprocal',
    PROXY: 'proxy',
    ASSOCIATE: 'associate',
    AWAITING_AURION: 'awaitingaurion',
    VISITORS: 'visitors',
    FRYER: 'fryer',
};

export const ALL_TYPES = Object.values(MEMBERSHIP_TYPES);

const exceptTypes = (...types) => ALL_TYPES.filter(type => !types.includes(type));

const {
    ALUMNI,
    ALUMNI_NEW,
    ALUMNI_FRIENDS,
    HOSPITAL,
    RETIRED,
    RECIPROCAL,
    PROXY,
    ASSOCIATE,
    AWAITING_AURION,
    VISITORS,
    FRYER,
} = MEMBERSHIP_TYPES;

/**
 * Which fields each type asks for, which of them it insists on, and how each is checked.
 *
 * `visibleFor` / `requiredFor` are lists of types. `never` marks a field that no type shows — see otherName.
 */
export const membershipFieldRules = {
    alumnifriendshipLevel: {
        visibleFor: [ALUMNI_FRIENDS],
        requiredFor: [ALUMNI_FRIENDS],
    },

    // Account information
    title: { visibleFor: ALL_TYPES, requiredFor: ALL_TYPES },
    first_name: {
        visibleFor: ALL_TYPES,
        requiredFor: ALL_TYPES,
        validate: [validate.maxLength(65, validationErrors.firstName)],
    },
    sn: {
        visibleFor: ALL_TYPES,
        requiredFor: ALL_TYPES,
        validate: [validate.maxLength(65, validationErrors.lastName)],
    },
    // Never shown to any type — kept so nothing that depends on it is lost, but no type reaches it.
    otherName: {
        visibleFor: [],
        requiredFor: [],
        never: true,
        validate: [validate.maxLength(65, validationErrors.otherName)],
    },
    date_of_birth_day: { visibleFor: ALL_TYPES, requiredFor: ALL_TYPES },
    date_of_birth_month: { visibleFor: ALL_TYPES, requiredFor: ALL_TYPES },
    date_of_birth_year: { visibleFor: ALL_TYPES, requiredFor: ALL_TYPES },

    // Contact information
    mail: {
        visibleFor: ALL_TYPES,
        requiredFor: ALL_TYPES,
        validate: [validate.email, validate.maxLength(50, validationErrors.tooLong)],
    },
    phone: {
        visibleFor: ALL_TYPES,
        requiredFor: ALL_TYPES,
        validate: [
            validate.phone,
            validate.minLength(8, validationErrors.phone),
            validate.maxLength(20, validationErrors.phone),
        ],
    },

    hospital_address_0: {
        visibleFor: [HOSPITAL],
        requiredFor: [HOSPITAL],
        validate: [validate.maxLength(250, validationErrors.address)],
    },
    hospital_address_1: {
        visibleFor: [HOSPITAL],
        requiredFor: [],
        validate: [validate.maxLength(250, validationErrors.address)],
    },
    hospital_address_2: {
        visibleFor: [HOSPITAL],
        requiredFor: [],
        validate: [validate.maxLength(250, validationErrors.address)],
    },

    associate_address_0: {
        visibleFor: [ASSOCIATE],
        requiredFor: [ASSOCIATE],
        validate: [validate.maxLength(250, validationErrors.address)],
    },
    associate_address_1: {
        visibleFor: [ASSOCIATE],
        requiredFor: [],
        validate: [validate.maxLength(250, validationErrors.address)],
    },
    associate_address_2: {
        visibleFor: [ASSOCIATE],
        requiredFor: [],
        validate: [validate.maxLength(250, validationErrors.address)],
    },

    awaitingaurion_address_0: {
        visibleFor: [AWAITING_AURION],
        requiredFor: [AWAITING_AURION],
        validate: [validate.maxLength(250, validationErrors.address)],
    },
    awaitingaurion_address_1: {
        visibleFor: [AWAITING_AURION],
        requiredFor: [],
        validate: [validate.maxLength(250, validationErrors.address)],
    },
    awaitingaurion_address_2: {
        visibleFor: [AWAITING_AURION],
        requiredFor: [],
        validate: [validate.maxLength(250, validationErrors.address)],
    },

    // Fryer visitors get access to Fryer material only, so no home address is collected from them.
    home_address_0: {
        visibleFor: exceptTypes(FRYER),
        requiredFor: exceptTypes(FRYER),
        validate: [validate.maxLength(250, validationErrors.address)],
    },
    home_address_1: {
        visibleFor: exceptTypes(FRYER),
        requiredFor: [],
        validate: [validate.maxLength(250, validationErrors.address)],
    },
    home_address_city: {
        visibleFor: exceptTypes(FRYER),
        requiredFor: exceptTypes(FRYER),
        validate: [validate.maxLength(100, validationErrors.city)],
    },
    // The types that may be applying from overseas are not held to an Australian state and postcode.
    home_address_state: {
        visibleFor: exceptTypes(FRYER),
        requiredFor: exceptTypes(FRYER, ALUMNI, ALUMNI_NEW, ALUMNI_FRIENDS, ASSOCIATE, AWAITING_AURION),
        validate: [validate.maxLength(50, validationErrors.state)],
    },
    home_address_postcode: {
        visibleFor: exceptTypes(FRYER),
        requiredFor: exceptTypes(FRYER, ALUMNI, ALUMNI_NEW, ALUMNI_FRIENDS, ASSOCIATE, AWAITING_AURION),
        validate: [validate.postcode, validate.maxLength(4, validationErrors.postcode)],
    },
    home_address_country: {
        visibleFor: [ALUMNI, ALUMNI_FRIENDS, ALUMNI_NEW, ASSOCIATE, AWAITING_AURION],
        requiredFor: [],
        validate: [validate.maxLength(50, validationErrors.country)],
    },

    departmental_address: {
        visibleFor: [VISITORS],
        requiredFor: [VISITORS],
        validate: [validate.maxLength(250, validationErrors.departmentalAddress)],
    },
    home_institution: {
        visibleFor: [VISITORS],
        requiredFor: [],
        validate: [validate.maxLength(250, validationErrors.homeInstitution)],
    },

    // UQ student information — one field per detail, shown to both alumni types.
    alumni_num: {
        visibleFor: [ALUMNI, ALUMNI_NEW],
        requiredFor: [ALUMNI, ALUMNI_NEW],
        validate: [validate.studentNumber, validate.maxLength(10, validationErrors.studentNumber)],
    },
    alumni_awards: {
        visibleFor: [ALUMNI, ALUMNI_NEW],
        requiredFor: [ALUMNI, ALUMNI_NEW],
        validate: [validate.maxLength(100, validationErrors.award)],
    },
    alumni_graduated: {
        visibleFor: [ALUMNI, ALUMNI_NEW],
        requiredFor: [ALUMNI, ALUMNI_NEW],
        validate: [validate.graduatedYear],
    },

    // Employment information
    hospital_class: { visibleFor: [HOSPITAL], requiredFor: [HOSPITAL] },
    hospital_service: { visibleFor: [HOSPITAL], requiredFor: [HOSPITAL] },
    hospital_emp_type: { visibleFor: [HOSPITAL], requiredFor: [HOSPITAL] },

    retired_pos: {
        visibleFor: [RETIRED],
        requiredFor: [RETIRED],
        validate: [validate.maxLength(100, validationErrors.retiredPosition)],
    },
    retired_years: { visibleFor: [RETIRED], requiredFor: [RETIRED], validate: [validate.retiredYears] },
    retired_num: {
        visibleFor: [RETIRED],
        requiredFor: [RETIRED],
        validate: [validate.maxLength(10, validationErrors.retiredNumber)],
    },

    // Organisation information
    reciprocal_institution: { visibleFor: [RECIPROCAL], requiredFor: [RECIPROCAL] },
    reciprocal_lib_no: {
        visibleFor: [RECIPROCAL],
        requiredFor: [RECIPROCAL],
        validate: [validate.maxLength(20, validationErrors.reciprocalLibraryNumber)],
    },
    institution_affiliation: {
        visibleFor: [FRYER],
        requiredFor: [],
        validate: [validate.maxLength(255, validationErrors.institutionAffiliation)],
    },
    project_research_topic: {
        visibleFor: [FRYER],
        requiredFor: [],
        validate: [validate.maxLength(255, validationErrors.projectResearchTopic)],
    },

    // Nominated / authorising borrower
    proxy_org: {
        visibleFor: [PROXY],
        requiredFor: [PROXY],
        validate: [validate.maxLength(100, validationErrors.organisationName)],
    },
    proxy_duration_from: { visibleFor: [PROXY], requiredFor: [PROXY], validate: [validate.proxyDate] },
    proxy_duration_to: { visibleFor: [PROXY], requiredFor: [PROXY], validate: [validate.proxyDate] },
    proxy_auth_name: {
        visibleFor: [PROXY],
        requiredFor: [PROXY],
        validate: [validate.maxLength(100, validationErrors.organisationName)],
    },
    proxy_auth_org: {
        visibleFor: [PROXY],
        requiredFor: [PROXY],
        validate: [validate.maxLength(100, validationErrors.organisationName)],
    },

    // Only these two types must tick the agreement; for every other type submitting the form is the agreement.
    accept_mandatory_terms: {
        visibleFor: [ALUMNI, ALUMNI_NEW],
        requiredFor: [ALUMNI, ALUMNI_NEW],
        requiredValidator: requireChecked,
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
    return [
        ...(isFieldRequired(field, type) ? [rule.requiredValidator ?? requiredValidator] : []),
        ...(rule.validate ?? []),
    ];
};

/**
 * The fields a given type asks for, in the order the form declares them.
 */
export const getVisibleFields = type => ALL_FIELDS.filter(field => isFieldVisible(field, type));

export const getRequiredFields = type => ALL_FIELDS.filter(field => isFieldRequired(field, type));
