import locale from './membership.locale';
import {
    RETIRED_MINIMUM_YEARS,
    email,
    graduatedYear,
    maxLength,
    minLength,
    phone,
    postcode,
    proxyDate,
    retiredYears,
    studentNumber,
} from './membershipValidation';

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

    describe('studentNumber', () => {
        it('accepts an s followed by seven digits', () => {
            expect(studentNumber('s1234567')).toBeUndefined();
        });

        it('rejects anything else', () => {
            expect(studentNumber('1234567')).toBe(validationErrors.studentNumber);
            expect(studentNumber('s123456')).toBe(validationErrors.studentNumber);
            expect(studentNumber('S1234567')).toBe(validationErrors.studentNumber);
        });

        it('leaves an empty value to the required check', () => {
            expect(studentNumber('')).toBeUndefined();
        });
    });

    describe('proxyDate', () => {
        it('accepts a date written as the field asks', () => {
            expect(proxyDate('01-02-2026')).toBeUndefined();
            expect(proxyDate('1-2-2026')).toBeUndefined();
        });

        it('rejects any other shape', () => {
            expect(proxyDate('2026-02-01')).toBe(validationErrors.proxyDate);
            expect(proxyDate('01/02/2026')).toBe(validationErrors.proxyDate);
            expect(proxyDate('01-02-26')).toBe(validationErrors.proxyDate);
        });

        it('leaves an empty value to the required check', () => {
            expect(proxyDate('')).toBeUndefined();
        });
    });

    describe('graduatedYear', () => {
        it('accepts a year', () => {
            expect(graduatedYear('1995')).toBeUndefined();
            expect(graduatedYear(2020)).toBeUndefined();
        });

        it('rejects something that is not a number', () => {
            expect(graduatedYear('last year')).toBe(validationErrors.graduatedYear);
        });

        it('rejects a value that is too short or too long', () => {
            expect(graduatedYear('5')).toBe(validationErrors.graduatedYear);
            expect(graduatedYear('19955')).toBe(validationErrors.graduatedYear);
        });

        it('accepts the same loose two-digit values the form has always accepted', () => {
            expect(graduatedYear('10')).toBeUndefined();
            expect(graduatedYear('99')).toBeUndefined();
        });

        it('leaves an empty value to the required check', () => {
            expect(graduatedYear('')).toBeUndefined();
            expect(graduatedYear(null)).toBeUndefined();
            expect(graduatedYear(undefined)).toBeUndefined();
        });
    });

    describe('retiredYears', () => {
        it('accepts a length of service that meets the eligibility rule', () => {
            expect(retiredYears('10')).toBeUndefined();
            expect(retiredYears('35')).toBeUndefined();
            expect(retiredYears(15)).toBeUndefined();
        });

        it('rejects a length of service below the eligibility rule', () => {
            expect(retiredYears('09')).toBe(validationErrors.retiredYears);
            expect(RETIRED_MINIMUM_YEARS).toBe(10);
        });

        it('rejects a value that is not two digits', () => {
            expect(retiredYears('5')).toBe(validationErrors.retiredYears);
            expect(retiredYears('100')).toBe(validationErrors.retiredYears);
        });

        it('rejects something that is not a number', () => {
            expect(retiredYears('ab')).toBe(validationErrors.retiredYears);
        });

        it('leaves an empty value to the required check', () => {
            expect(retiredYears('')).toBeUndefined();
            expect(retiredYears(null)).toBeUndefined();
        });
    });
});
