import {
    buildSpaceOutagePayload,
    formatSpaceOutageDateTimeForInput,
    getSpaceOutageShowTimePublic,
    getVisibleSpaceOutage,
    getOverlappingSpaceOutages,
    getSpaceOutageStatus,
    normalizeSpaceOutageList,
    sortSpaceOutages,
    validateSpaceOutageDraft,
} from './spaceOutageHelpers';
import {
    formatSpaceOutageDateTimeForPublicNotice,
    formatSpaceOutageRangeForPublicNotice,
    formatSpaceOutageUntilForPublicNotice,
} from 'modules/Pages/BookableSpaces/Shared/SpaceOutageNotice';

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
        expect(normalizeSpaceOutageList(null)).toEqual([]);
    });

    it('formats dates for datetime-local inputs', () => {
        expect(formatSpaceOutageDateTimeForInput('2026-04-20 08:30:00')).toEqual('2026-04-20T08:30');
    });

    it('formats dates for public outage notices', () => {
        expect(formatSpaceOutageDateTimeForPublicNotice('2026-12-25 13:00:00')).toEqual('25/12/2026 1:00pm');
    });

    it('formats outage ranges for public notices', () => {
        expect(formatSpaceOutageRangeForPublicNotice('2026-12-25 08:00:00', '2026-12-25 13:00:00')).toEqual(
            '8:00am to 1:00pm on 25 December 2026',
        );

        expect(formatSpaceOutageRangeForPublicNotice('2026-12-25 13:00:00', '2026-12-26 17:00:00')).toEqual(
            '1:00pm 25 December to 5:00pm 26 December 2026',
        );

        expect(formatSpaceOutageRangeForPublicNotice('2026-04-24 08:00:00', '2026-05-05 14:00:00', false)).toEqual(
            '24 April to 5 May 2026',
        );
    });

    it('formats current outage until wording for public notices', () => {
        expect(formatSpaceOutageUntilForPublicNotice('2026-12-25 13:00:00', new Date('2026-12-25T09:00:00'))).toEqual(
            '1:00pm on 25 December 2026',
        );

        expect(formatSpaceOutageUntilForPublicNotice('2026-12-26 17:00:00', new Date('2026-12-25T09:00:00'))).toEqual(
            '5:00pm 26 December 2026',
        );

        expect(
            formatSpaceOutageUntilForPublicNotice('2026-12-26 17:00:00', new Date('2026-12-25T09:00:00'), false),
        ).toEqual('26 December 2026');
    });

    it('parses space_outage_show_time_public from mixed values', () => {
        expect(getSpaceOutageShowTimePublic({ space_outage_show_time_public: true })).toBe(true);
        expect(getSpaceOutageShowTimePublic({ space_outage_show_time_public: 1 })).toBe(true);
        expect(getSpaceOutageShowTimePublic({ space_outage_show_time_public: false })).toBe(false);
        expect(getSpaceOutageShowTimePublic({ space_outage_show_time_public: 0 })).toBe(false);
        expect(getSpaceOutageShowTimePublic({ space_outage_show_time_public: 'no' })).toBe(false);
        expect(getSpaceOutageShowTimePublic({})).toBe(true);
    });

    it('sorts outages by start time', () => {
        expect(sortSpaceOutages(sampleOutages).map(outage => outage.space_outage_id)).toEqual([1, 2]);
    });

    it('reports outage status correctly', () => {
        expect(getSpaceOutageStatus(sampleOutages[0], new Date('2026-04-22T10:30:00'))).toEqual('Current');
        expect(getSpaceOutageStatus(sampleOutages[0], new Date('2026-04-22T09:30:00'))).toEqual('Upcoming');
        expect(getSpaceOutageStatus(sampleOutages[0], new Date('2026-04-22T12:30:00'))).toEqual('Past');
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

        const warningValidation = validateSpaceOutageDraft(
            {
                space_outage_start: '2026-04-22 11:00:00',
                space_outage_end: '2026-04-22 13:00:00',
            },
            sampleOutages,
        );
        expect(warningValidation.warnings).toHaveLength(1);
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
    });
});
