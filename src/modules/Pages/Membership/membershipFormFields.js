import { MEMBERSHIP_TYPES } from './membershipFieldRules';
import { getBirthDays, getBirthYears } from './membershipTransformers';

/**
 * How each field is presented: what it is called, what it says before it is filled in, and where a select gets
 * its options.
 *
 * Kept apart from membershipFieldRules, which says which fields a type asks for and how they are checked. This
 * file is only about presentation.
 *
 * Every field carries its own `label`, which is always its accessible name. Where a row of several controls
 * sits under one heading, the row becomes a fieldset with that text as its legend and each control keeps its
 * own label, hidden but announced, so every control has an accessible name.
 *
 * `gridSm` is the field's width in twelfths on a small screen and up, set to reflect how much a field is
 * expected to hold — a postcode or a year is narrow, a street or an email is wide. Fields in the same row
 * that together exceed twelve wrap onto the next line. A field without one falls back to two thirds on its
 * own, or an equal share of a captioned row. Below the small breakpoint every field is full width.
 */

const { ALUMNI, ALUMNI_NEW, HOSPITAL, RETIRED, RECIPROCAL, PROXY, FRYER } = MEMBERSHIP_TYPES;

export const FIELD_TYPES = {
    TEXT: 'text',
    EMAIL: 'email',
    NUMBER: 'number',
    SELECT: 'select',
    CHECKBOX: 'checkbox',
};

export const MONTHS = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
];

const toOptions = (values = []) => values.map(value => ({ value, label: value }));

/**
 * Where each select's options come from. Each is handed the form config and the account type being applied for,
 * and returns `{ value, label }` pairs.
 */
export const OPTION_SOURCES = {
    paymentOptions: (formData, current) =>
        (current?.payment_options ?? []).map(option => ({ value: option.code, label: option.description })),
    titles: formData => toOptions(formData?.titles),
    birthDays: () => getBirthDays().map(day => ({ value: day, label: String(day) })),
    birthMonths: () => MONTHS,
    birthYears: () => getBirthYears().map(year => ({ value: year, label: String(year) })),
    hospitalClassifications: formData => toOptions(formData?.hospital?.classifications),
    hospitalServices: formData => toOptions(formData?.hospital?.services),
    hospitalTypes: formData => toOptions(formData?.hospital?.types),
    reciprocalInstitutions: formData => toOptions(formData?.reciprocal?.institutions),
};

export const membershipFormFields = {
    alumnifriendshipLevel: {
        label: 'Period',
        type: FIELD_TYPES.SELECT,
        options: 'paymentOptions',
        placeholder: 'Select',
        gridSm: 4,
    },

    title: { label: 'Title', type: FIELD_TYPES.SELECT, options: 'titles', placeholder: 'Title', gridSm: 2 },
    first_name: { label: 'First name and other initials', placeholder: 'First name and other initials', gridSm: 6 },
    sn: { label: 'Last name', placeholder: 'Last name', gridSm: 4 },
    otherName: { label: 'Other name', placeholder: 'Other Name' },

    date_of_birth_day: {
        label: 'Day of birth',
        type: FIELD_TYPES.SELECT,
        options: 'birthDays',
        placeholder: 'Day',
        gridSm: 2,
    },
    date_of_birth_month: {
        label: 'Month of birth',
        type: FIELD_TYPES.SELECT,
        options: 'birthMonths',
        placeholder: 'Month',
        gridSm: 3,
    },
    date_of_birth_year: {
        label: 'Year of birth',
        type: FIELD_TYPES.SELECT,
        options: 'birthYears',
        placeholder: 'Year',
        gridSm: 2,
    },

    // Email keeps the wide default; the contact number is short, so it does not need to.
    mail: { label: 'Email', type: FIELD_TYPES.EMAIL, placeholder: 'Email address' },
    phone: { label: 'Contact number', placeholder: 'Home, work or mobile phone number', gridSm: 4 },

    // Address lines each take their own line at the wide default, stacking into a block.
    hospital_address_0: { label: 'Department', placeholder: 'Department e.g. Paediatrics', gridSm: 8 },
    hospital_address_1: { label: 'Work location', placeholder: 'Work Location e.g. Block 6, Level 6', gridSm: 8 },
    hospital_address_2: {
        label: 'Hospital, state and postcode',
        placeholder: 'Hospital, State and Postcode e.g. RBWH QLD 4029',
        gridSm: 8,
    },

    associate_address_0: {
        label: 'School, faculty, centre or other',
        placeholder: 'School, Faculty, Centre, other e.g. JKTech pty ltd',
        gridSm: 8,
    },
    associate_address_1: {
        label: 'Street number and street name',
        placeholder: 'Street number and street name e.g. 40 Isles Road',
        gridSm: 8,
    },
    associate_address_2: {
        label: 'Suburb, state and postcode',
        placeholder: 'Suburb, State and Postcode e.g. Indooroopilly, QLD, 4068',
        gridSm: 8,
    },

    awaitingaurion_address_0: {
        label: 'Departmental address line 1',
        placeholder: 'Departmental address line 1',
        gridSm: 8,
    },
    awaitingaurion_address_1: {
        label: 'Departmental address line 2',
        placeholder: 'Departmental address line 2',
        gridSm: 8,
    },
    awaitingaurion_address_2: {
        label: 'Departmental address line 3',
        placeholder: 'Departmental address line 3',
        gridSm: 8,
    },

    // Each home-address control is named individually so it has its own accessible name under the group legend.
    // The street is the longest part, so it takes a line of its own; the rest pack onto the lines that follow,
    // each as wide as it needs — a suburb or city half, a state or postcode narrow.
    home_address_0: {
        label: 'Street number and street name',
        placeholder: 'Street number and street name e.g. 123 Library Way',
        gridSm: 12,
    },
    home_address_1: { label: 'Suburb', placeholder: 'Suburb e.g. St Lucia', gridSm: 6 },
    home_address_city: { label: 'City', placeholder: 'City', gridSm: 6 },
    home_address_state: { label: 'State', placeholder: 'State', gridSm: 3 },
    home_address_postcode: { label: 'Postcode', placeholder: 'Postcode', gridSm: 3 },
    home_address_country: { label: 'Country', placeholder: 'Country', gridSm: 6 },

    departmental_address: {
        label: 'Departmental address (School / Faculty / Institute)',
        placeholder: 'Departmental address',
    },
    home_institution: { label: 'Home institution (if appropriate)', placeholder: 'Home institution (if appropriate)' },

    alumni_num: {
        label: 'Previous student number',
        placeholder: "'s' followed by the first 7 digits of your previous student number",
        help: "'s' followed by the first 7 digits of your previous student number e.g. s1234567",
        gridSm: 3,
    },
    alumni_awards: {
        label: 'Awards',
        placeholder: 'Alumni awards (for example BSc, DipEd, MA)',
        help: 'eg. BSc, DipEd, MA',
        gridSm: 6,
    },
    alumni_graduated: {
        label: 'Year graduated from UQ',
        type: FIELD_TYPES.NUMBER,
        placeholder: 'Year you graduated from UQ',
        gridSm: 3,
    },

    hospital_class: {
        label: 'Classification',
        type: FIELD_TYPES.SELECT,
        options: 'hospitalClassifications',
        placeholder: 'Select',
        gridSm: 6,
    },
    hospital_service: {
        label: 'Hospital / Service',
        type: FIELD_TYPES.SELECT,
        options: 'hospitalServices',
        placeholder: 'Select',
        gridSm: 6,
    },
    hospital_emp_type: {
        label: 'Employee type',
        type: FIELD_TYPES.SELECT,
        options: 'hospitalTypes',
        placeholder: 'Select',
        gridSm: 6,
    },

    retired_pos: { label: 'Retired staff position', placeholder: 'Retired Staff position', gridSm: 6 },
    retired_years: {
        label: 'Years of service',
        type: FIELD_TYPES.NUMBER,
        placeholder: 'Number of years of service',
        gridSm: 3,
    },
    retired_num: { label: 'Staff number', placeholder: 'Staff number', gridSm: 3 },

    reciprocal_institution: {
        label: 'Institution',
        type: FIELD_TYPES.SELECT,
        options: 'reciprocalInstitutions',
        placeholder: 'Please, indicate your home institution',
        gridSm: 6,
    },
    reciprocal_lib_no: {
        label: 'Student/Staff Library No.',
        placeholder: 'Student or Staff Library Number',
        gridSm: 3,
    },

    institution_affiliation: { label: 'Institution / Affiliation', placeholder: 'Institution' },
    project_research_topic: { label: 'Project / Research topic' },

    proxy_org: { label: 'School or Organisational Unit', placeholder: 'School or Organisational Unit', gridSm: 6 },
    proxy_duration_from: { label: 'Authorised from', placeholder: 'DD-MM-YYYY', gridSm: 3 },
    proxy_duration_to: { label: 'Authorised to', placeholder: 'DD-MM-YYYY', gridSm: 3 },
    proxy_auth_name: { label: 'Name', placeholder: 'Name', gridSm: 6 },
    proxy_auth_org: { label: 'School or Organisational Unit', placeholder: 'School or Organisational Unit', gridSm: 6 },

    accept_mandatory_terms: {
        label: 'Checking this box indicates you have read and understand:',
        type: FIELD_TYPES.CHECKBOX,
    },
};

/**
 * The form's sections, in declaration order.
 *
 * A `row` with a `legend` groups several controls under one heading, as a fieldset. A row without one is a
 * single control wearing its own visible label.
 */
export const membershipFormSections = [
    {
        id: 'account',
        title: 'Account Information',
        // Proxy applications are filled in by the authorising borrower about someone else, so the section is
        // about the nominated borrower rather than about "you".
        titleByType: { [PROXY]: 'Nominated borrower details' },
        rows: [
            { fields: ['alumnifriendshipLevel'] },
            { legend: 'Your Name', fields: ['title', 'first_name', 'sn'] },
            { fields: ['otherName'] },
            { legend: 'Date of Birth', fields: ['date_of_birth_day', 'date_of_birth_month', 'date_of_birth_year'] },
        ],
    },
    {
        id: 'contact',
        title: 'Contact Information',
        rows: [
            { fields: ['mail'] },
            { legend: 'Work Address', fields: ['hospital_address_0', 'hospital_address_1', 'hospital_address_2'] },
            {
                legend: 'Work / Departmental Address',
                fields: ['associate_address_0', 'associate_address_1', 'associate_address_2'],
            },
            {
                legend: 'Departmental Address',
                fields: ['awaitingaurion_address_0', 'awaitingaurion_address_1', 'awaitingaurion_address_2'],
            },
            {
                legend: 'Home Address',
                fields: [
                    'home_address_0',
                    'home_address_1',
                    'home_address_city',
                    'home_address_state',
                    'home_address_postcode',
                    'home_address_country',
                ],
            },
            { fields: ['departmental_address'] },
            { fields: ['phone'] },
            { fields: ['home_institution'] },
        ],
    },
    {
        id: 'student',
        title: 'UQ Student Information',
        visibleFor: [ALUMNI, ALUMNI_NEW],
        rows: [{ fields: ['alumni_num'] }, { fields: ['alumni_awards'] }, { fields: ['alumni_graduated'] }],
    },
    {
        id: 'employment',
        title: 'Employment Information',
        visibleFor: [HOSPITAL],
        rows: [{ fields: ['hospital_class'] }, { fields: ['hospital_service'] }, { fields: ['hospital_emp_type'] }],
    },
    {
        id: 'uqemployment',
        title: 'UQ Employment Information',
        visibleFor: [RETIRED],
        rows: [{ fields: ['retired_pos'] }, { fields: ['retired_years'] }, { fields: ['retired_num'] }],
    },
    {
        id: 'organisation',
        title: 'Organisation Information',
        visibleFor: [RECIPROCAL, FRYER],
        rows: [
            { fields: ['reciprocal_institution'] },
            { fields: ['reciprocal_lib_no'] },
            { fields: ['institution_affiliation'] },
            { fields: ['project_research_topic'] },
        ],
    },
    {
        id: 'nominated',
        title: 'Nominated Borrower',
        visibleFor: [PROXY],
        rows: [
            { fields: ['proxy_org'] },
            { legend: 'Duration of Authorisation', fields: ['proxy_duration_from', 'proxy_duration_to'] },
        ],
    },
    {
        id: 'authorising',
        title: 'Authorising Borrower',
        visibleFor: [PROXY],
        rows: [{ fields: ['proxy_auth_name'] }, { fields: ['proxy_auth_org'] }],
    },
];

export const getFieldConfig = field => membershipFormFields[field];

/**
 * The options a select should offer, resolved from the form config for the type being applied for.
 */
export const getFieldOptions = (field, formData, current) => {
    const source = OPTION_SOURCES[getFieldConfig(field)?.options];
    return source ? source(formData, current) : [];
};

export const isSelectField = field => getFieldConfig(field)?.type === FIELD_TYPES.SELECT;

export const isCheckboxField = field => getFieldConfig(field)?.type === FIELD_TYPES.CHECKBOX;

/**
 * Whether a section is declared for this type. A section that is declared may still end up with nothing to
 * show, which the form works out from the field rules.
 */
export const isSectionDeclaredForType = (section, type) => !section.visibleFor || section.visibleFor.includes(type);

export const getSectionTitle = (section, type) => section.titleByType?.[type] ?? section.title;
