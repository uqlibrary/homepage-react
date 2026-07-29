import locale from './membership.locale';
import { email, maxLength, minLength, phone, postcode } from './membershipValidation';

const { validationErrors } = locale;

describe('membershipValidation', () => {
    describe('postcode', () => {
        it('accepts four digits', () => {
            expect(postcode('4072')).toBeUndefined();
            expect(postcode('0800')).toBeUndefined();
        });

        it('rejects anything else', () => {
            expect(postcode('407')).toBe(validationErrors.postcode);
            expect(postcode('40722')).toBe(validationErrors.postcode);
            expect(postcode('407a')).toBe(validationErrors.postcode);
            expect(postcode('QLD')).toBe(validationErrors.postcode);
        });

        it('leaves an empty value to the required check', () => {
            expect(postcode('')).toBeUndefined();
        });
    });

    describe('phone', () => {
        it('accepts numbers written the way people write them', () => {
            expect(phone('0733654000')).toBeUndefined();
            expect(phone('(07) 3365 4000')).toBeUndefined();
            expect(phone('+61 7 3365-4000')).toBeUndefined();
        });

        // Anchored, so a value that merely contains a digit is rejected rather than passed.
        it('rejects a value that merely contains a digit', () => {
            expect(phone('n/a1')).toBe(validationErrors.phone);
            expect(phone('call me on 1234')).toBe(validationErrors.phone);
            expect(phone('none')).toBe(validationErrors.phone);
        });

        it('leaves an empty value to the required check', () => {
            expect(phone('')).toBeUndefined();
        });
    });

    describe('email', () => {
        it('accepts a valid address', () => {
            expect(email('a.martlew@library.uq.edu.au')).toBeUndefined();
        });

        it('rejects an invalid address', () => {
            expect(email('not an email')).toBe(validationErrors.email);
            expect(email('missing@tld')).toBe(validationErrors.email);
        });
    });

    describe('maxLength / minLength', () => {
        it('reports the membership-specific message rather than a generic one', () => {
            expect(maxLength(3, 'Too long for this field')('abcd')).toBe('Too long for this field');
            expect(maxLength(3, 'Too long for this field')('abc')).toBeUndefined();

            expect(minLength(3, 'Too short for this field')('ab')).toBe('Too short for this field');
            expect(minLength(3, 'Too short for this field')('abc')).toBeUndefined();
        });

        it('leaves an empty value to the required check', () => {
            expect(maxLength(3, 'Too long')('')).toBeUndefined();
            expect(minLength(3, 'Too short')('')).toBeUndefined();
        });
    });
});
