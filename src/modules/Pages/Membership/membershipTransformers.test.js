import {
    DAYS_IN_MONTH_MAX,
    EARLIEST_BIRTH_YEAR,
    MINIMUM_AGE,
    assembleDateOfBirth,
    derivePaymentCode,
    getBirthDays,
    getBirthYears,
    isAlumniType,
    isRenewal,
    parseDateOfBirth,
    transformRequest,
    transformResponse,
} from './membershipTransformers';

describe('membershipTransformers', () => {
    describe('getBirthDays', () => {
        it('offers 1 to 31', () => {
            const days = getBirthDays();
            expect(days).toHaveLength(DAYS_IN_MONTH_MAX);
            expect(days[0]).toBe(1);
            expect(days[days.length - 1]).toBe(31);
        });
    });

    describe('getBirthYears', () => {
        it('runs from ten years ago back to the earliest allowed year, newest first', () => {
            const years = getBirthYears(new Date('2026-07-28T00:00:00Z'));
            expect(years[0]).toBe(2026 - MINIMUM_AGE);
            expect(years[years.length - 1]).toBe(EARLIEST_BIRTH_YEAR);
            expect(years[0]).toBeGreaterThan(years[1]);
        });

        it('defaults to the current date when none is given', () => {
            expect(getBirthYears().length).toBeGreaterThan(0);
        });
    });

    describe('assembleDateOfBirth', () => {
        it('joins the three selects with an unpadded day and a padded month', () => {
            expect(
                assembleDateOfBirth({ date_of_birth_day: 1, date_of_birth_month: '02', date_of_birth_year: 1970 }),
            ).toBe('1-02-1970');
        });
    });

    describe('parseDateOfBirth', () => {
        it('splits a stored date back into the three selects, padding the month', () => {
            expect(parseDateOfBirth('1-2-1970')).toEqual({
                date_of_birth_day: 1,
                date_of_birth_month: '02',
                date_of_birth_year: 1970,
            });
        });

        it('returns nothing for a missing or non-string value', () => {
            expect(parseDateOfBirth(undefined)).toEqual({});
            expect(parseDateOfBirth(12345)).toEqual({});
        });

        it('returns nothing when a part is missing', () => {
            expect(parseDateOfBirth('1970')).toEqual({});
        });
    });

    describe('derivePaymentCode', () => {
        it('assigns community its single option code', () => {
            expect(derivePaymentCode('community', {}, [{ code: 'COM' }])).toBe('COM');
        });

        it('is empty for community when no options are offered', () => {
            expect(derivePaymentCode('community', {}, [])).toBe('');
        });

        it('uses the alumni friends period chosen on the form', () => {
            expect(derivePaymentCode('alumnifriends', { alumnifriendshipLevel: 'AF24' }, [])).toBe('AF24');
        });

        it('is empty for alumni friends when no period is chosen', () => {
            expect(derivePaymentCode('alumnifriends', {})).toBe('');
        });

        it('is empty for a type that does not pay', () => {
            expect(derivePaymentCode('hospital', {}, [{ code: 'COM' }])).toBe('');
        });

        it('defaults its arguments', () => {
            expect(derivePaymentCode('community')).toBe('');
        });
    });

    describe('isAlumniType', () => {
        it('recognises the three alumni flavours and nothing else', () => {
            expect(isAlumniType('alumni')).toBe(true);
            expect(isAlumniType('alumninew')).toBe(true);
            expect(isAlumniType('alumnifriends')).toBe(true);
            expect(isAlumniType('community')).toBe(false);
            expect(isAlumniType(undefined)).toBe(false);
        });
    });

    describe('transformRequest', () => {
        const values = {
            first_name: 'Ada',
            date_of_birth_day: 1,
            date_of_birth_month: '02',
            date_of_birth_year: 1970,
        };

        it('adds the assembled date, the type and the payment code', () => {
            const request = transformRequest(values, { type: 'community', paymentOptions: [{ code: 'COM' }] });
            expect(request.type).toBe('community');
            expect(request.date_of_birth).toBe('1-02-1970');
            expect(request.payment_code).toBe('COM');
            expect(request.first_name).toBe('Ada');
        });

        it('falls back to the type on the values and defaults options when the context is omitted', () => {
            const request = transformRequest({ ...values, type: 'community' });
            expect(request.type).toBe('community');
            expect(request.payment_code).toBe('');
        });
    });

    describe('transformResponse', () => {
        it('returns nothing for a missing record', () => {
            expect(transformResponse(null)).toEqual({});
        });

        it('splits the stored date of birth back into the selects', () => {
            expect(transformResponse({ type: 'community', first_name: 'Ada', date_of_birth: '1-2-1970' })).toEqual({
                type: 'community',
                first_name: 'Ada',
                date_of_birth: '1-2-1970',
                date_of_birth_day: 1,
                date_of_birth_month: '02',
                date_of_birth_year: 1970,
            });
        });

        it('turns a retired record’s years of service back into a number', () => {
            const result = transformResponse({ type: 'retired', retired_years: '15' });
            expect(result.retired_years).toBe(15);
        });

        it('turns an alumni record’s graduation year back into a number', () => {
            const result = transformResponse({ type: 'alumni', alumni_graduated: '1995' });
            expect(result.alumni_graduated).toBe(1995);
        });

        it('leaves number fields alone when they are not present', () => {
            expect(transformResponse({ type: 'retired' }).retired_years).toBeUndefined();
            expect(transformResponse({ type: 'alumni' }).alumni_graduated).toBeUndefined();
        });
    });

    describe('isRenewal', () => {
        it('is true only for a record the API marks as renewing', () => {
            expect(isRenewal({ status: 'renewing' })).toBe(true);
            expect(isRenewal({ status: 'unconfirmed' })).toBe(false);
            expect(isRenewal(undefined)).toBe(false);
        });
    });
});
