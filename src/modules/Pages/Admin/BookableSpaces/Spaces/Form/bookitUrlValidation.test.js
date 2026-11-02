import { getBookitUrlQueryParamError } from './bookitUrlValidation';

describe('bookitUrlValidation', () => {
    it('ignores missing or non-uqbookit values', () => {
        expect(getBookitUrlQueryParamError()).toBeNull();
        expect(getBookitUrlQueryParamError(null)).toBeNull();
        expect(getBookitUrlQueryParamError('https://example.com/app/booking-types/123?group=abc123')).toBeNull();
    });

    it('accepts uqbookit urls without query strings', () => {
        expect(getBookitUrlQueryParamError('https://uqbookit.uq.edu.au/#/app/booking-types/123')).toBeNull();
        expect(getBookitUrlQueryParamError('https://uqbookit.uq.edu.au/app/booking-types/123')).toBeNull();
    });

    it('allows only the lower-case group query parameter', () => {
        expect(
            getBookitUrlQueryParamError('https://uqbookit.uq.edu.au/#/app/booking-types/123?group=abc123'),
        ).toBeNull();
        expect(getBookitUrlQueryParamError('https://uqbookit.uq.edu.au/app/booking-types/123?group=abc123')).toBeNull();
    });

    it('rejects other query string parameters', () => {
        expect(
            getBookitUrlQueryParamError(
                'https://uqbookit.uq.edu.au/#/app/booking-types/123?group=abc123&firstDay=2026-09-21',
            ),
        ).toContain('only the lower-case "group" query parameter is allowed');
        expect(
            getBookitUrlQueryParamError('https://uqbookit.uq.edu.au/app/booking-types/123?firstDay=2026-09-21'),
        ).toContain('only the lower-case "group" query parameter is allowed');
    });

    it('rejects uppercase Group parameters', () => {
        expect(getBookitUrlQueryParamError('https://uqbookit.uq.edu.au/app/booking-types/123?Group=abc123')).toContain(
            'only the lower-case "group" query parameter is allowed',
        );
    });

    it('ignores malformed URLs', () => {
        expect(getBookitUrlQueryParamError('not a valid url')).toBeNull();
    });
});
