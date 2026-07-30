import {
    MONTHS,
    getFieldConfig,
    getFieldOptions,
    getSectionTitle,
    isCheckboxField,
    isSectionDeclaredForType,
    isSelectField,
    membershipFormSections,
} from './membershipFormFields';
import { MEMBERSHIP_TYPES } from './membershipFieldRules';

const { COMMUNITY, ALUMNI, PROXY } = MEMBERSHIP_TYPES;

const formData = {
    titles: ['Mr', 'Ms', 'Dr'],
    hospital: { classifications: ['Nurse'], services: ['RBWH'], types: ['Permanent'] },
    reciprocal: { institutions: ['UQ', 'QUT'] },
};
const current = { payment_options: [{ code: 'AF12', description: '12 months' }] };

describe('membershipFormFields', () => {
    describe('getFieldConfig', () => {
        it('returns a field its presentation config', () => {
            expect(getFieldConfig('mail').label).toBe('Email');
        });
    });

    describe('isSelectField / isCheckboxField', () => {
        it('identifies select fields', () => {
            expect(isSelectField('title')).toBe(true);
            expect(isSelectField('first_name')).toBe(false);
            expect(isSelectField('not_a_field')).toBe(false);
        });

        it('identifies the checkbox field', () => {
            expect(isCheckboxField('accept_mandatory_terms')).toBe(true);
            expect(isCheckboxField('first_name')).toBe(false);
            expect(isCheckboxField('not_a_field')).toBe(false);
        });
    });

    describe('getFieldOptions', () => {
        it('resolves each select field from its option source', () => {
            expect(getFieldOptions('title', formData)).toEqual([
                { value: 'Mr', label: 'Mr' },
                { value: 'Ms', label: 'Ms' },
                { value: 'Dr', label: 'Dr' },
            ]);
            expect(getFieldOptions('date_of_birth_day', formData)).toHaveLength(31);
            expect(getFieldOptions('date_of_birth_month', formData)).toEqual(MONTHS);
            expect(getFieldOptions('date_of_birth_year', formData).length).toBeGreaterThan(0);
            expect(getFieldOptions('alumnifriendshipLevel', formData, current)).toEqual([
                { value: 'AF12', label: '12 months' },
            ]);
            expect(getFieldOptions('hospital_class', formData)).toEqual([{ value: 'Nurse', label: 'Nurse' }]);
            expect(getFieldOptions('hospital_service', formData)).toEqual([{ value: 'RBWH', label: 'RBWH' }]);
            expect(getFieldOptions('hospital_emp_type', formData)).toEqual([
                { value: 'Permanent', label: 'Permanent' },
            ]);
            expect(getFieldOptions('reciprocal_institution', formData)).toEqual([
                { value: 'UQ', label: 'UQ' },
                { value: 'QUT', label: 'QUT' },
            ]);
        });

        it('yields an empty list when the source has no data', () => {
            expect(getFieldOptions('title', {})).toEqual([]);
            expect(getFieldOptions('alumnifriendshipLevel', {})).toEqual([]);
        });

        it('has no options for a plain text field', () => {
            expect(getFieldOptions('first_name', formData)).toEqual([]);
        });
    });

    describe('sections', () => {
        it('declares the ordered set of sections', () => {
            expect(membershipFormSections.map(section => section.id)).toEqual([
                'account',
                'contact',
                'student',
                'employment',
                'uqemployment',
                'organisation',
                'nominated',
                'authorising',
            ]);
        });

        describe('isSectionDeclaredForType', () => {
            const student = membershipFormSections.find(s => s.id === 'student');
            const account = membershipFormSections.find(s => s.id === 'account');

            it('is true for a type the section names, false otherwise', () => {
                expect(isSectionDeclaredForType(student, ALUMNI)).toBe(true);
                expect(isSectionDeclaredForType(student, COMMUNITY)).toBe(false);
            });

            it('is true for every type when the section names none', () => {
                expect(isSectionDeclaredForType(account, COMMUNITY)).toBe(true);
            });
        });

        describe('getSectionTitle', () => {
            const account = membershipFormSections.find(s => s.id === 'account');
            const contact = membershipFormSections.find(s => s.id === 'contact');

            it('uses the per-type title where one is set', () => {
                expect(getSectionTitle(account, PROXY)).toBe('Nominated borrower details');
            });

            it('falls back to the plain title otherwise', () => {
                expect(getSectionTitle(account, COMMUNITY)).toBe('Account Information');
                expect(getSectionTitle(contact, PROXY)).toBe('Contact Information');
            });
        });
    });
});
