import {
    buildSpaceOutagePayload,
    formatSpaceOutageDateTimeForInput,
    getOverlappingSpaceOutages,
    getSpaceOutageStatus,
    normalizeSpaceOutageList,
    sortSpaceOutages,
    validateSpaceOutageDraft,
} from './spaceOutageHelpers';

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

    it('sorts outages by start time', () => {
        expect(sortSpaceOutages(sampleOutages).map(outage => outage.space_outage_id)).toEqual([1, 2]);
    });

    it('reports outage status correctly', () => {
        expect(getSpaceOutageStatus(sampleOutages[0], new Date('2026-04-22T10:30:00'))).toEqual('Current');
        expect(getSpaceOutageStatus(sampleOutages[0], new Date('2026-04-22T09:30:00'))).toEqual('Upcoming');
        expect(getSpaceOutageStatus(sampleOutages[0], new Date('2026-04-22T12:30:00'))).toEqual('Past');
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
        expect(validateSpaceOutageDraft({}, sampleOutages).errors).toHaveLength(2);

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
                },
            }),
        ).toEqual({
            space_id: 123,
            space_outage_start: '2026-04-22 11:00:00',
            space_outage_end: '2026-04-22 12:00:00',
            space_outage_reason: 'HVAC works',
        });
    });
});
