import {
    MONTHS,
    getFieldConfig,
    getFieldOptions,
    getSectionTitle,
    isSelectField,
    membershipFormSections,
} from './membershipFormFields';

const formData = { titles: ['Mr', 'Ms', 'Dr'] };

describe('membershipFormFields', () => {
    describe('getFieldConfig', () => {
        it('returns a field its presentation config', () => {
            expect(getFieldConfig('mail').label).toBe('Email');
        });
    });

    describe('isSelectField', () => {
        it('is true for a select and false otherwise', () => {
            expect(isSelectField('title')).toBe(true);
            expect(isSelectField('first_name')).toBe(false);
            expect(isSelectField('not_a_field')).toBe(false);
        });
    });

    describe('getFieldOptions', () => {
        it('maps the titles from the form config', () => {
            expect(getFieldOptions('title', formData)).toEqual([
                { value: 'Mr', label: 'Mr' },
                { value: 'Ms', label: 'Ms' },
                { value: 'Dr', label: 'Dr' },
            ]);
        });

        it('yields an empty list when the form config has no titles', () => {
            expect(getFieldOptions('title', {})).toEqual([]);
        });

        it('offers 31 days', () => {
            expect(getFieldOptions('date_of_birth_day', formData)).toHaveLength(31);
        });

        it('offers the twelve months', () => {
            expect(getFieldOptions('date_of_birth_month', formData)).toEqual(MONTHS);
        });

        it('offers a range of years', () => {
            expect(getFieldOptions('date_of_birth_year', formData).length).toBeGreaterThan(0);
        });

        it('has no options for a plain text field', () => {
            expect(getFieldOptions('first_name', formData)).toEqual([]);
        });
    });

    describe('membershipFormSections / getSectionTitle', () => {
        it('declares the account and contact sections', () => {
            expect(membershipFormSections.map(section => section.id)).toEqual(['account', 'contact']);
        });

        it('reports a section title', () => {
            expect(getSectionTitle(membershipFormSections[0])).toBe('Account Information');
        });
    });
});
