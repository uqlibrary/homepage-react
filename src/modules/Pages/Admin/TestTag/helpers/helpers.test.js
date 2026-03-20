import {
    capitaliseLeadingChar,
    isEmptyStr,
    isEmptyObject,
    createLocationString,
    isInvalidUUID,
    isInvalidTeamSlug,
    isValidDateRange,
} from './helpers';

import moment from 'moment';

describe('helpers', () => {
    it('capitaliseLeadingChar operates correctly', () => {
        expect(capitaliseLeadingChar('test')).toEqual('Test');
        expect(capitaliseLeadingChar('Test')).toEqual('Test');
        expect(capitaliseLeadingChar('TesT')).toEqual('Test');
        expect(capitaliseLeadingChar('TEST')).toEqual('Test');
    });
    it('isEmptyStr operates correctly', () => {
        expect(isEmptyStr('test')).toEqual(false);
        expect(isEmptyStr('')).toEqual(true);
        expect(isEmptyStr(null)).toEqual(true);
        expect(isEmptyStr(undefined)).toEqual(true);
        expect(isEmptyStr([])).toEqual(true);
        expect(isEmptyStr({})).toEqual(true);
        expect(isEmptyStr(['a'])).toEqual(true);
        expect(isEmptyStr({ a: 'a' })).toEqual(true);
    });
    it('isEmptyObject operates correctly', () => {
        expect(isEmptyObject('test')).toEqual(true);
        expect(isEmptyObject('')).toEqual(true);
        expect(isEmptyObject(null)).toEqual(true);
        expect(isEmptyObject(undefined)).toEqual(true);
        expect(isEmptyObject([])).toEqual(true);
        expect(isEmptyObject({})).toEqual(true);
        expect(isEmptyObject(['a'])).toEqual(true);
        expect(isEmptyObject({ a: 'a' })).toEqual(false);
    });
    it('createLocationString operates correctly', () => {
        expect(createLocationString({ site: 'test1', building: 'test2', floor: 'test3', room: 'test4' })).toEqual(
            'test3-test4 test2, test1',
        );
    });
    it('isInvalidUUID operates correctly', () => {
        expect(isInvalidUUID('A')).toEqual(true);
        expect(isInvalidUUID('a')).toEqual(false);
        expect(isInvalidUUID('123456789012345678901')).toEqual(true);
    });
    it('isInvalidTeamSlug operates correctly', () => {
        expect(isInvalidTeamSlug('')).toEqual(true);
        expect(isInvalidTeamSlug(null)).toEqual(true);
        expect(isInvalidTeamSlug(undefined)).toEqual(true);
        expect(isInvalidTeamSlug('abcdefghijk')).toEqual(true); // 11 chars, exceeds 10
        expect(isInvalidTeamSlug('abcdefghij')).toEqual(false); // exactly 10 chars
    });

    describe('isValidDateRange', () => {
        const format = 'YYYY-MM-DD';
        const min = moment('2020-01-01');
        const max = moment('2025-12-31');

        it('validates dates correctly', () => {
            // valid + within range
            expect(isValidDateRange('2023-06-15', format, min, max)).toBe(true);
            // inclusive boundaries
            expect(isValidDateRange('2020-01-01', format, min, max)).toBe(true);
            expect(isValidDateRange('2025-12-31', format, min, max)).toBe(true);
            // out of range
            expect(isValidDateRange('2019-12-31', format, min, max)).toBe(false);
            expect(isValidDateRange('2026-01-01', format, min, max)).toBe(false);
            // invalid date
            expect(isValidDateRange('2023-02-30', format, min, max)).toBe(false);
        });

        it('handles invalid or non-standard input as valid (by design)', () => {
            expect(isValidDateRange('', format, min, max)).toBe(true);
            expect(isValidDateRange(null, format, min, max)).toBe(true);
            expect(isValidDateRange('15/06/2023', format, min, max)).toBe(true);
            expect(isValidDateRange('2023-6-1', format, min, max)).toBe(true);
        });
    });
});
