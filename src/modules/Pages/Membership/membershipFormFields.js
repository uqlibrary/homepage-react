import { getBirthDays, getBirthYears } from './membershipTransformers';

/**
 * How each field is presented: what it is called, what it says before it is filled in, and where a select gets
 * its options.
 *
 * Kept apart from membershipFieldRules, which says which fields a type asks for and how they are checked — this
 * file is only about presentation. Every field carries its own `label`, which is always its accessible name.
 * Where a row of controls sits under one heading, the row becomes a fieldset with that text as its legend and
 * each control keeps its own label, hidden but announced.
 */

export const FIELD_TYPES = {
    TEXT: 'text',
    EMAIL: 'email',
    SELECT: 'select',
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
 * Where each select's options come from. Each is handed the form config being applied for and returns
 * `{ value, label }` pairs.
 */
export const OPTION_SOURCES = {
    titles: formData => toOptions(formData?.titles),
    birthDays: () => getBirthDays().map(day => ({ value: day, label: String(day) })),
    birthMonths: () => MONTHS,
    birthYears: () => getBirthYears().map(year => ({ value: year, label: String(year) })),
};

export const membershipFormFields = {
    title: { label: 'Title', type: FIELD_TYPES.SELECT, options: 'titles', placeholder: 'Title' },
    first_name: { label: 'First name and other initials', placeholder: 'First name and other initials' },
    sn: { label: 'Last name', placeholder: 'Last name' },

    date_of_birth_day: { label: 'Day of birth', type: FIELD_TYPES.SELECT, options: 'birthDays', placeholder: 'Day' },
    date_of_birth_month: {
        label: 'Month of birth',
        type: FIELD_TYPES.SELECT,
        options: 'birthMonths',
        placeholder: 'Month',
    },
    date_of_birth_year: {
        label: 'Year of birth',
        type: FIELD_TYPES.SELECT,
        options: 'birthYears',
        placeholder: 'Year',
    },

    mail: { label: 'Email', type: FIELD_TYPES.EMAIL, placeholder: 'Email address' },
    // The street line is long, so it takes a row of its own; the shorter address parts share the row below it.
    home_address_0: {
        label: 'Street number and street name',
        placeholder: 'Street number and street name e.g. 123 Library Way',
        gridSm: 12,
    },
    home_address_1: { label: 'Suburb', placeholder: 'Suburb e.g. St Lucia' },
    home_address_city: { label: 'City', placeholder: 'City' },
    home_address_state: { label: 'State', placeholder: 'State' },
    home_address_postcode: { label: 'Postcode', placeholder: 'Postcode' },
    // A phone number is short, so the field does not need the full-width default.
    phone: { label: 'Contact number', placeholder: 'Home, work or mobile phone number', gridSm: 4 },
};

/**
 * The form's sections, in declaration order. A `row` with a `legend` groups several controls under one heading,
 * as a fieldset; a row without one is a single control wearing its own visible label.
 */
export const membershipFormSections = [
    {
        id: 'account',
        title: 'Account Information',
        rows: [
            { legend: 'Your Name', fields: ['title', 'first_name', 'sn'] },
            { legend: 'Date of Birth', fields: ['date_of_birth_day', 'date_of_birth_month', 'date_of_birth_year'] },
        ],
    },
    {
        id: 'contact',
        title: 'Contact Information',
        rows: [
            { fields: ['mail'] },
            {
                legend: 'Home Address',
                fields: [
                    'home_address_0',
                    'home_address_1',
                    'home_address_city',
                    'home_address_state',
                    'home_address_postcode',
                ],
            },
            { fields: ['phone'] },
        ],
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

export const getSectionTitle = section => section.title;
