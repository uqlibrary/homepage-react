import { locale } from 'locale';
import {
    email,
    isEmpty,
    maxLengthValidator,
    minLengthValidator,
    patternValidator,
    requireChecked,
    required,
} from './validation';

describe('validation helpers', () => {
    describe('isEmpty', () => {
        it('treats missing and blank values as empty', () => {
            expect(isEmpty(null)).toBe(true);
            expect(isEmpty(undefined)).toBe(true);
            expect(isEmpty('')).toBe(true);
            expect(isEmpty('   ')).toBe(true);
        });

        it('treats anything with content as not empty', () => {
            expect(isEmpty('a')).toBe(false);
            expect(isEmpty(0)).toBe(false);
            expect(isEmpty(false)).toBe(false);
        });
    });

    describe('required', () => {
        it('rejects a missing value', () => {
            expect(required('')).toBe(locale.validationErrors.required);
            expect(required('   ')).toBe(locale.validationErrors.required);
            expect(required(null)).toBe(locale.validationErrors.required);
            expect(required(undefined)).toBe(locale.validationErrors.required);
        });

        it('accepts a value', () => {
            expect(required('Jane')).toBeUndefined();
        });

        it('accepts values that are falsy but present', () => {
            expect(required(0)).toBeUndefined();
            expect(required(false)).toBeUndefined();
        });
    });

    describe('requireChecked', () => {
        it('accepts a ticked checkbox', () => {
            expect(requireChecked(true)).toBeUndefined();
            expect(requireChecked('on')).toBeUndefined();
        });

        it('rejects anything else', () => {
            expect(requireChecked(false)).toBe(locale.validationErrors.requireChecked);
            expect(requireChecked(undefined)).toBe(locale.validationErrors.requireChecked);
            expect(requireChecked('')).toBe(locale.validationErrors.requireChecked);
        });
    });

    describe('email', () => {
        it('accepts valid addresses', () => {
            expect(email('a.martlew@library.uq.edu.au')).toBeUndefined();
            expect(email('JANE+tag@example.co')).toBeUndefined();
            expect(email('first.last%test_1-2@sub.domain.org')).toBeUndefined();
        });

        it('rejects invalid addresses', () => {
            expect(email('not an email')).toBe(locale.validationErrors.email);
            expect(email('missing@tld')).toBe(locale.validationErrors.email);
            expect(email('@nolocalpart.com')).toBe(locale.validationErrors.email);
            expect(email('spaces in@example.com')).toBe(locale.validationErrors.email);
            expect(email('trailing@example.c')).toBe(locale.validationErrors.email);
        });

        it('leaves an empty value to the required validator', () => {
            expect(email('')).toBeUndefined();
            expect(email(undefined)).toBeUndefined();
        });
    });

    describe('maxLengthValidator', () => {
        const maxOf5 = maxLengthValidator(5);

        it('accepts a value at or under the limit', () => {
            expect(maxOf5('12345')).toBeUndefined();
            expect(maxOf5('1234')).toBeUndefined();
        });

        it('rejects a value over the limit, naming the limit', () => {
            expect(maxOf5('123456')).toBe('Must be 5 characters or less');
        });

        it('leaves an empty value to the required validator', () => {
            expect(maxOf5('')).toBeUndefined();
            expect(maxOf5(null)).toBeUndefined();
        });
    });

    describe('minLengthValidator', () => {
        const minOf3 = minLengthValidator(3);

        it('accepts a value at or over the limit', () => {
            expect(minOf3('abc')).toBeUndefined();
            expect(minOf3('abcd')).toBeUndefined();
        });

        it('rejects a value under the limit, naming the limit', () => {
            expect(minOf3('ab')).toBe('Must be at least 3 characters');
        });

        it('leaves an empty value to the required validator', () => {
            expect(minOf3('')).toBeUndefined();
            expect(minOf3(undefined)).toBeUndefined();
        });
    });

    describe('patternValidator', () => {
        const postcode = patternValidator(/^[0-9]{4}$/, 'This postcode is not valid');

        it('accepts a value matching the pattern', () => {
            expect(postcode('4072')).toBeUndefined();
        });

        it('rejects a value not matching the pattern', () => {
            expect(postcode('407')).toBe('This postcode is not valid');
            expect(postcode('40722')).toBe('This postcode is not valid');
            expect(postcode('abcd')).toBe('This postcode is not valid');
        });

        it('leaves an empty value to the required validator', () => {
            expect(postcode('')).toBeUndefined();
            expect(postcode(null)).toBeUndefined();
        });

        it('coerces a non-string value before testing it', () => {
            expect(postcode(4072)).toBeUndefined();
            expect(postcode(407)).toBe('This postcode is not valid');
        });
    });
});
