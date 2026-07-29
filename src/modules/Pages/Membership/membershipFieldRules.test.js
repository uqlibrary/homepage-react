import { required } from 'helpers/validation';
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

const COMMUNITY = MEMBERSHIP_TYPES.COMMUNITY;

describe('membershipFieldRules', () => {
    it('exposes community as a known type', () => {
        expect(COMMUNITY).toBe('community');
    });

    describe('isKnownField', () => {
        it('recognises a declared field and rejects an undeclared one', () => {
            expect(isKnownField('title')).toBe(true);
            expect(isKnownField('not_a_field')).toBe(false);
        });
    });

    describe('isFieldVisible', () => {
        it('is true for a field the type asks for', () => {
            expect(isFieldVisible('title', COMMUNITY)).toBe(true);
        });

        it('is false for a type that does not ask for the field', () => {
            expect(isFieldVisible('title', 'somethingelse')).toBe(false);
        });

        it('is false for an unknown field', () => {
            expect(isFieldVisible('not_a_field', COMMUNITY)).toBe(false);
        });
    });

    describe('isFieldRequired', () => {
        it('is true for a mandatory field', () => {
            expect(isFieldRequired('title', COMMUNITY)).toBe(true);
        });

        it('is false for a field that is shown but optional', () => {
            expect(isFieldVisible('home_address_1', COMMUNITY)).toBe(true);
            expect(isFieldRequired('home_address_1', COMMUNITY)).toBe(false);
        });

        it('is false for an unknown field', () => {
            expect(isFieldRequired('not_a_field', COMMUNITY)).toBe(false);
        });
    });

    describe('getFieldValidators', () => {
        it('puts required first, then the field-specific checks', () => {
            const validators = getFieldValidators('phone', COMMUNITY);
            expect(validators[0]).toBe(required);
            expect(validators).toHaveLength(4); // required + phone + minLength + maxLength
        });

        it('returns just required for a mandatory field with no extra checks', () => {
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

    describe('getVisibleFields / getRequiredFields', () => {
        it('lists every field community asks for, in declaration order', () => {
            expect(getVisibleFields(COMMUNITY)).toEqual(ALL_FIELDS);
            expect(getVisibleFields(COMMUNITY)).toHaveLength(13);
        });

        it('lists the mandatory fields, omitting the optional address line', () => {
            const required = getRequiredFields(COMMUNITY);
            expect(required).toHaveLength(12);
            expect(required).not.toContain('home_address_1');
        });
    });
});
