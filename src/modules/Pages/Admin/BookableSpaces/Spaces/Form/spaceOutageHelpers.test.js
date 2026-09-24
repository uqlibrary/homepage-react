import moment from 'moment';

import {
    buildBulkOutagePayload,
    buildSpaceOutagePayload,
    formatSpaceOutageDateTimeForDisplay,
    formatSpaceOutageDateTimeForInput,
    formatSpaceOutageDateTimeForPayload,
    getSpaceOutageShowTimePublic,
    getVisibleSpaceOutage,
    getOverlappingSpaceOutages,
    getSpaceOutageStatus,
    normalizeSpaceOutageList,
    parseSpaceOutageDate,
    sortSpaceOutages,
    validateSpaceOutageDraft,
} from './spaceOutageHelpers';
import {
    formatSpaceOutageDateTimeForPublicNotice,
    formatSpaceOutageRangeForPublicNotice,
    formatSpaceOutageUntilForPublicNotice,
} from 'modules/Pages/BookableSpaces/Shared/SpacesOutageNotice';

describe('spaceOutageHelpers', () => {
    const sampleOutages = [
        {
            space_outage_id: 2,
            space_outage_start: '2026-04-22 10:00:00',
            space_outage_end: '2026-04-22 12:00:00',
            space_outage_reason: 'AV maintenance',
        },
        {
            space_outage_id: 1,
            space_outage_start: '2026-04-20 08:00:00',
            space_outage_end: '2026-04-20 09:00:00',
            space_outage_reason: 'Cleaning',
        },
    ];

    it('normalises outage lists from supported shapes', () => {
        expect(normalizeSpaceOutageList(sampleOutages)).toEqual(sampleOutages);
        expect(normalizeSpaceOutageList({ data: sampleOutages })).toEqual(sampleOutages);
        expect(normalizeSpaceOutageList({ data: { space_outages: sampleOutages } })).toEqual(sampleOutages);
        expect(normalizeSpaceOutageList({ space_outages: sampleOutages })).toEqual(sampleOutages);
        expect(normalizeSpaceOutageList(null)).toEqual([]);
    });

    it('handles empty or invalid date parsing and display fallbacks', () => {
        expect(parseSpaceOutageDate()).toBeNull();
        expect(parseSpaceOutageDate('not-a-date')).toBeNull();
        expect(formatSpaceOutageDateTimeForInput(null)).toEqual('');
        expect(formatSpaceOutageDateTimeForInput('not-a-date')).toEqual('');
        expect(formatSpaceOutageDateTimeForPayload(null)).toBeNull();
        expect(formatSpaceOutageDateTimeForPayload('')).toBeNull();
        expect(formatSpaceOutageDateTimeForPayload('not-a-date')).toBeNull();
        expect(formatSpaceOutageDateTimeForDisplay(null)).toEqual('Not set');
        expect(formatSpaceOutageDateTimeForDisplay('not-a-date')).toEqual('Not set');
    });

    it('formats dates for datetime-local inputs', () => {
        expect(formatSpaceOutageDateTimeForInput('2026-04-20 08:30:00')).toEqual('2026-04-20T08:30');
    });

    it('formats dates for public outage notices', () => {
        expect(formatSpaceOutageDateTimeForPublicNotice('2026-12-25 13:00:00')).toEqual('25/12/2026 1:00pm');
    });

    it('formats outage ranges for public notices', () => {
        expect(formatSpaceOutageRangeForPublicNotice('2026-12-25 08:00:00', '2026-12-25 13:00:00')).toEqual(
            '8:00am to 1:00pm on 25 Dec. 2026',
        );

        expect(formatSpaceOutageRangeForPublicNotice('2026-12-25 13:00:00', '2026-12-26 17:00:00')).toEqual(
            '1:00pm 25 Dec. to 5:00pm 26 Dec. 2026',
        );

        expect(formatSpaceOutageRangeForPublicNotice('2026-04-24 08:00:00', '2026-05-05 14:00:00', false)).toEqual(
            '24 Apr. to 5 May 2026',
        );
    });

    it('handles invalid or empty display values for outage dates', () => {
        expect(formatSpaceOutageDateTimeForDisplay('')).toEqual('Not set');
        expect(formatSpaceOutageDateTimeForDisplay(undefined)).toEqual('Not set');
        expect(formatSpaceOutageDateTimeForDisplay('2026-04-20 08:30:00')).toEqual(
            new Intl.DateTimeFormat('en-AU', {
                dateStyle: 'medium',
                timeStyle: 'short',
            }).format(moment('2026-04-20 08:30:00', 'YYYY-MM-DD HH:mm:ss').toDate()),
        );
    });

    it('formats current outage until wording for public notices', () => {
        expect(formatSpaceOutageUntilForPublicNotice('2026-12-25 13:00:00', new Date('2026-12-25T09:00:00'))).toEqual(
            '1:00pm on 25 Dec. 2026',
        );

        expect(formatSpaceOutageUntilForPublicNotice('2026-12-26 17:00:00', new Date('2026-12-25T09:00:00'))).toEqual(
            '5:00pm 26 Dec. 2026',
        );

        expect(
            formatSpaceOutageUntilForPublicNotice('2026-12-26 17:00:00', new Date('2026-12-25T09:00:00'), false),
        ).toEqual('26 Dec. 2026');
    });

    it('parses space_outage_show_time_public from mixed values', () => {
        expect(getSpaceOutageShowTimePublic({ space_outage_show_time_public: true })).toBe(true);
        expect(getSpaceOutageShowTimePublic({ space_outage_show_time_public: 1 })).toBe(true);
        expect(getSpaceOutageShowTimePublic({ space_outage_show_time_public: false })).toBe(false);
        expect(getSpaceOutageShowTimePublic({ space_outage_show_time_public: 0 })).toBe(false);
        expect(getSpaceOutageShowTimePublic({ space_outage_show_time_public: 'no' })).toBe(false);
        expect(getSpaceOutageShowTimePublic({ space_outage_show_time_public: 'yes' })).toBe(true);
        expect(getSpaceOutageShowTimePublic({})).toBe(true);
    });

    it('sorts outages by start time', () => {
        expect(sortSpaceOutages(sampleOutages).map(outage => outage.space_outage_id)).toEqual([1, 2]);
        expect(
            sortSpaceOutages([
                { space_outage_id: 8, space_outage_start: 'not-a-date' },
                { space_outage_id: 9, space_outage_start: '2026-04-22 10:00:00' },
            ]).map(outage => outage.space_outage_id),
        ).toEqual([8, 9]);
        expect(
            sortSpaceOutages([
                { space_outage_id: 10, space_outage_start: '2026-04-22 10:00:00' },
                { space_outage_id: 11, space_outage_start: 'not-a-date' },
            ]).map(outage => outage.space_outage_id),
        ).toEqual([11, 10]);
    });

    it('uses default time and blank reason fallbacks when no explicit value is supplied', () => {
        const now = moment();
        const futureStart = now.clone().add(1, 'day').hour(9).minute(0).second(0);
        const futureEnd = futureStart.clone().add(3, 'hours');
        const currentStart = now.clone().subtract(1, 'hour');
        const currentEnd = now.clone().add(1, 'hour');

        expect(
            getSpaceOutageStatus({
                space_outage_start: futureStart.format('YYYY-MM-DD HH:mm:ss'),
                space_outage_end: futureEnd.format('YYYY-MM-DD HH:mm:ss'),
            }),
        ).toEqual('Upcoming');

        expect(
            getVisibleSpaceOutage(
                [
                    {
                        space_outage_id: 10,
                        space_outage_start: futureStart.format('YYYY-MM-DD HH:mm:ss'),
                        space_outage_end: futureEnd.format('YYYY-MM-DD HH:mm:ss'),
                        space_outage_reason: '   ',
                    },
                ],
                undefined,
                7,
            ),
        ).toMatchObject({
            status: 'Upcoming',
            tone: 'warning',
            reason: '',
        });

        expect(
            getVisibleSpaceOutage(
                [
                    {
                        space_outage_id: 11,
                        space_outage_start: currentStart.format('YYYY-MM-DD HH:mm:ss'),
                        space_outage_end: currentEnd.format('YYYY-MM-DD HH:mm:ss'),
                        space_outage_reason: '   ',
                    },
                ],
                now.toDate(),
                7,
            ),
        ).toMatchObject({
            status: 'Current',
            tone: 'error',
            reason: '',
        });
    });

    it('reports outage status correctly', () => {
        expect(getSpaceOutageStatus(sampleOutages[0], new Date('2026-04-22T10:30:00'))).toEqual('Current');
        expect(getSpaceOutageStatus(sampleOutages[0], new Date('2026-04-22T09:30:00'))).toEqual('Upcoming');
        expect(getSpaceOutageStatus(sampleOutages[0], new Date('2026-04-22T12:30:00'))).toEqual('Past');
        expect(getSpaceOutageStatus({ space_outage_start: 'not-a-date' }, new Date('2026-04-22T12:30:00'))).toEqual(
            'Invalid',
        );
        expect(getSpaceOutageStatus({ space_outage_start: '2026-04-22 10:00:00', space_outage_end: '2026-04-22 09:00:00' }, new Date('2026-04-22T10:30:00'))).toEqual('Past');
    });

    it('returns the current outage notice before upcoming ones', () => {
        const visibleOutage = getVisibleSpaceOutage(
            [
                {
                    space_outage_id: 3,
                    space_outage_start: '2026-04-25 09:00:00',
                    space_outage_end: '2026-04-25 12:00:00',
                    space_outage_reason: 'Future outage',
                },
                sampleOutages[0],
            ],
            new Date('2026-04-22T10:30:00'),
        );

        expect(visibleOutage).toMatchObject({
            status: 'Current',
            tone: 'error',
            reason: 'AV maintenance',
        });
        expect(visibleOutage.outage.space_outage_id).toEqual(2);
    });

    it('returns the nearest upcoming outage within the notice window', () => {
        const visibleOutage = getVisibleSpaceOutage(
            [
                {
                    space_outage_id: 4,
                    space_outage_start: '2026-04-30 09:00:00',
                    space_outage_end: '2026-04-30 12:00:00',
                    space_outage_reason: 'Lift works',
                },
            ],
            new Date('2026-04-24T10:30:00'),
        );

        expect(visibleOutage).toMatchObject({
            status: 'Upcoming',
            tone: 'warning',
            reason: 'Lift works',
        });
        expect(visibleOutage.outage.space_outage_id).toEqual(4);
    });

    it('ignores upcoming outages outside the notice window', () => {
        expect(
            getVisibleSpaceOutage(
                [
                    {
                        space_outage_id: 5,
                        space_outage_start: '2026-05-05 09:00:00',
                        space_outage_end: '2026-05-05 12:00:00',
                        space_outage_reason: 'Remote works',
                    },
                ],
                new Date('2026-04-24T10:30:00'),
            ),
        ).toBeNull();
    });

    it('skips invalid items before finding the next valid upcoming outage', () => {
        const visibleOutage = getVisibleSpaceOutage(
            [
                {
                    space_outage_id: 6,
                    space_outage_start: 'not-a-date',
                    space_outage_end: 'still-not-a-date',
                    space_outage_reason: 'Broken record',
                },
                {
                    space_outage_id: 7,
                    space_outage_start: '2026-05-01 09:00:00',
                    space_outage_end: '2026-05-01 12:00:00',
                    space_outage_reason: 'Planned maintenance',
                },
            ],
            new Date('2026-04-24T10:30:00'),
        );

        expect(visibleOutage).toMatchObject({
            status: 'Upcoming',
            tone: 'warning',
            reason: 'Planned maintenance',
        });
        expect(visibleOutage.outage.space_outage_id).toEqual(7);
    });

    it('finds overlapping outages excluding the edited row', () => {
        const overlapping = getOverlappingSpaceOutages(
            {
                space_outage_start: '2026-04-22 11:00:00',
                space_outage_end: '2026-04-22 13:00:00',
            },
            sampleOutages,
        );

        expect(overlapping).toHaveLength(1);
        expect(overlapping[0].space_outage_id).toEqual(2);

        const excludedOverlap = getOverlappingSpaceOutages(
            {
                space_outage_start: '2026-04-22 11:00:00',
                space_outage_end: '2026-04-22 13:00:00',
            },
            sampleOutages,
            2,
        );
        expect(excludedOverlap).toEqual([]);

        expect(
            getOverlappingSpaceOutages(
                { space_outage_start: 'not-a-date', space_outage_end: '2026-04-22 13:00:00' },
                sampleOutages,
            ),
        ).toEqual([]);

        expect(
            getOverlappingSpaceOutages(
                { space_outage_start: '2026-04-22 11:00:00', space_outage_end: '2026-04-22 13:00:00' },
                [
                    { space_outage_start: 'not-a-date', space_outage_end: '2026-04-22 12:30:00' },
                    { space_outage_start: '2026-04-22 12:00:00', space_outage_end: '2026-04-22 12:30:00' },
                ],
            ),
        ).toHaveLength(1);

        expect(
            getOverlappingSpaceOutages({
                space_outage_start: '2026-04-22 11:00:00',
                space_outage_end: '2026-04-22 13:00:00',
            }),
        ).toEqual([]);
    });

    it('validates required fields and ordering while warning on overlap', () => {
        expect(validateSpaceOutageDraft({}, sampleOutages).errors).toHaveLength(3);

        const validation = validateSpaceOutageDraft(
            {
                space_outage_start: '2026-04-22 11:00:00',
                space_outage_end: '2026-04-22 10:00:00',
            },
            sampleOutages,
        );
        expect(validation.errors[0].message).toEqual('The end date and time must be after the start.');

        const invalidDateValidation = validateSpaceOutageDraft(
            {
                space_outage_start: 'not-a-date',
                space_outage_end: '2026-04-22 13:00:00',
                space_outage_reason: '  ',
            },
            sampleOutages,
        );
        expect(invalidDateValidation.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ field: 'space_outage_start', message: 'The start date and time is invalid.' }),
                expect.objectContaining({ field: 'space_outage_reason', message: 'A reason is required.' }),
            ]),
        );

        const warningValidation = validateSpaceOutageDraft(
            {
                space_outage_start: '2026-04-22 11:00:00',
                space_outage_end: '2026-04-22 13:00:00',
            },
            sampleOutages,
        );
        expect(warningValidation.warnings).toHaveLength(1);

        const invalidEndValidation = validateSpaceOutageDraft(
            {
                space_outage_start: '2026-04-22 11:00:00',
                space_outage_end: 'not-a-date',
                space_outage_reason: 'Lab maintenance',
            },
            sampleOutages,
        );
        expect(invalidEndValidation.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ field: 'space_outage_end', message: 'The end date and time is invalid.' }),
            ]),
        );

        expect(
            validateSpaceOutageDraft({
                space_outage_start: '2026-04-22 11:00:00',
                space_outage_end: '2026-04-22 13:00:00',
                space_outage_reason: 'Maintenance',
            }),
        ).toEqual({
            errors: [],
            warnings: [],
        });
    });

    it('builds the API payload shape', () => {
        expect(
            buildSpaceOutagePayload({
                spaceId: 123,
                draft: {
                    space_outage_start: '2026-04-22T11:00',
                    space_outage_end: '2026-04-22T12:00',
                    space_outage_reason: '  HVAC works  ',
                    space_outage_show_time_public: false,
                },
            }),
        ).toEqual({
            space_id: 123,
            space_outage_start: '2026-04-22 11:00:00',
            space_outage_end: '2026-04-22 12:00:00',
            space_outage_reason: 'HVAC works',
            space_outage_show_time_public: false,
        });

        expect(
            buildSpaceOutagePayload({
                spaceId: 456,
                draft: {
                    space_outage_start: '',
                    space_outage_end: null,
                    space_outage_reason: '   ',
                    space_outage_show_time_public: undefined,
                },
            }),
        ).toEqual({
            space_id: 456,
            space_outage_start: null,
            space_outage_end: null,
            space_outage_reason: null,
            space_outage_show_time_public: false,
        });

        expect(
            buildBulkOutagePayload({
                draft: {
                    space_outage_start: '2026-04-22T11:00',
                    space_outage_end: '2026-04-22T12:00',
                    space_outage_reason: '  Bulk works  ',
                    space_outage_show_time_public: true,
                },
            }),
        ).toEqual({
            space_outage_start: '2026-04-22 11:00:00',
            space_outage_end: '2026-04-22 12:00:00',
            space_outage_reason: 'Bulk works',
            space_outage_show_time_public: true,
        });

        expect(
            buildBulkOutagePayload({
                draft: {
                    space_outage_start: '',
                    space_outage_end: undefined,
                    space_outage_reason: '',
                    space_outage_show_time_public: '1',
                },
            }),
        ).toEqual({
            space_outage_start: null,
            space_outage_end: null,
            space_outage_reason: null,
            space_outage_show_time_public: true,
        });
    });
});
