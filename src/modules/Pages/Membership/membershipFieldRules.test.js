import { required, requireChecked } from 'helpers/validation';
import {
    ALL_FIELDS,
    MEMBERSHIP_TYPES,
    getFieldValidators,
    getRequiredFields,
    getVisibleFields,
    isFieldRequired,
    isFieldVisible,
    isKnownField,
} from './membershipFieldRules';

const {
    ALUMNI,
    ALUMNI_NEW,
    ALUMNI_FRIENDS,
    COMMUNITY,
    HOSPITAL,
    RETIRED,
    RECIPROCAL,
    PROXY,
    ASSOCIATE,
    AWAITING_AURION,
    VISITORS,
    FRYER,
} = MEMBERSHIP_TYPES;

// The fields every type asks for.
const SHARED = [
    'title',
    'first_name',
    'sn',
    'date_of_birth_day',
    'date_of_birth_month',
    'date_of_birth_year',
    'mail',
    'phone',
];

// The signature fields that identify each type (beyond the shared set / home address).
const SIGNATURE = {
    [COMMUNITY]: [],
    [ALUMNI]: ['alumni_num', 'alumni_awards', 'alumni_graduated', 'accept_mandatory_terms', 'home_address_country'],
    [ALUMNI_NEW]: ['alumni_num', 'alumni_awards', 'alumni_graduated', 'accept_mandatory_terms', 'home_address_country'],
    [ALUMNI_FRIENDS]: ['alumnifriendshipLevel', 'home_address_country'],
    [HOSPITAL]: ['hospital_address_0', 'hospital_class', 'hospital_service', 'hospital_emp_type'],
    [RETIRED]: ['retired_pos', 'retired_years', 'retired_num'],
    [RECIPROCAL]: ['reciprocal_institution', 'reciprocal_lib_no'],
    [PROXY]: ['proxy_org', 'proxy_duration_from', 'proxy_duration_to', 'proxy_auth_name', 'proxy_auth_org'],
    [ASSOCIATE]: ['associate_address_0', 'home_address_country'],
    [AWAITING_AURION]: ['awaitingaurion_address_0', 'home_address_country'],
    [VISITORS]: ['departmental_address', 'home_institution'],
    [FRYER]: ['institution_affiliation', 'project_research_topic'],
};

describe('membershipFieldRules', () => {
    it('exposes all twelve membership types', () => {
        expect(Object.values(MEMBERSHIP_TYPES).sort()).toEqual(
            [
                'alumni',
                'alumninew',
                'alumnifriends',
                'community',
                'hospital',
                'retired',
                'reciprocal',
                'proxy',
                'associate',
                'awaitingaurion',
                'visitors',
                'fryer',
            ].sort(),
        );
    });

    describe('isKnownField', () => {
        it('recognises a declared field and rejects an undeclared one', () => {
            expect(isKnownField('title')).toBe(true);
            expect(isKnownField('otherName')).toBe(true); // declared but shown to no type
            expect(isKnownField('not_a_field')).toBe(false);
        });
    });

    describe('the type field matrix', () => {
        it.each(Object.values(MEMBERSHIP_TYPES))('gives %s the shared fields plus its signature fields', type => {
            const visible = getVisibleFields(type);
            // shared fields for every type
            SHARED.forEach(field => expect(visible).toContain(field));
            // this type's signature fields
            SIGNATURE[type].forEach(field => expect(visible).toContain(field));
            // another type's signature fields are not shown here
            Object.entries(SIGNATURE)
                .filter(([other]) => other !== type)
                .flatMap(([, fields]) => fields)
                .filter(field => !SIGNATURE[type].includes(field))
                .forEach(field => expect(visible).not.toContain(field));
        });

        it('shows a home address to every type except fryer', () => {
            expect(getVisibleFields(COMMUNITY)).toContain('home_address_0');
            expect(getVisibleFields(HOSPITAL)).toContain('home_address_0');
            expect(getVisibleFields(FRYER)).not.toContain('home_address_0');
        });

        it('keeps date of birth for fryer', () => {
            expect(getVisibleFields(FRYER)).toContain('date_of_birth_day');
        });

        it('never shows otherName', () => {
            Object.values(MEMBERSHIP_TYPES).forEach(type => expect(getVisibleFields(type)).not.toContain('otherName'));
        });
    });

    describe('isFieldVisible / isFieldRequired', () => {
        it('is visible and required for a mandatory field', () => {
            expect(isFieldVisible('title', COMMUNITY)).toBe(true);
            expect(isFieldRequired('title', COMMUNITY)).toBe(true);
        });

        it('is visible but optional where the type does not insist', () => {
            expect(isFieldVisible('home_address_1', COMMUNITY)).toBe(true);
            expect(isFieldRequired('home_address_1', COMMUNITY)).toBe(false);
        });

        it('does not require state/postcode of the overseas-capable types', () => {
            expect(isFieldVisible('home_address_postcode', ALUMNI)).toBe(true);
            expect(isFieldRequired('home_address_postcode', ALUMNI)).toBe(false);
        });

        it('is false for a type that does not ask for the field, and for an unknown field', () => {
            expect(isFieldVisible('hospital_class', COMMUNITY)).toBe(false);
            expect(isFieldRequired('hospital_class', COMMUNITY)).toBe(false);
            expect(isFieldVisible('not_a_field', COMMUNITY)).toBe(false);
            expect(isFieldRequired('not_a_field', COMMUNITY)).toBe(false);
        });
    });

    describe('getFieldValidators', () => {
        it('puts the default required validator first, then the field checks', () => {
            const validators = getFieldValidators('first_name', COMMUNITY);
            expect(validators[0]).toBe(required);
            expect(validators).toHaveLength(2); // required + maxLength
        });

        it('uses a field-specific required validator where one is set (terms checkbox)', () => {
            const validators = getFieldValidators('accept_mandatory_terms', ALUMNI);
            expect(validators[0]).toBe(requireChecked);
        });

        it('returns just the default required validator for a mandatory field with no extra checks', () => {
            expect(getFieldValidators('title', COMMUNITY)).toEqual([required]);
        });

        it('omits required for a shown-but-optional field', () => {
            const validators = getFieldValidators('home_address_1', COMMUNITY);
            expect(validators).not.toContain(required);
            expect(validators).toHaveLength(1); // maxLength only
        });

        it('returns nothing for an unknown field', () => {
            expect(getFieldValidators('not_a_field', COMMUNITY)).toEqual([]);
        });
    });

    describe('getRequiredFields', () => {
        it('lists the mandatory fields for a type, omitting shown-but-optional ones', () => {
            const requiredFields = getRequiredFields(COMMUNITY);
            expect(requiredFields).toContain('title');
            expect(requiredFields).not.toContain('home_address_1');
        });
    });

    it('ALL_FIELDS lists every declared field', () => {
        expect(ALL_FIELDS).toContain('title');
        expect(ALL_FIELDS).toContain('proxy_auth_org');
        expect(ALL_FIELDS.length).toBeGreaterThan(30);
    });
});
