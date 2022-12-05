import { saveInspectionTransformer } from './saveInspectionTransformer';

describe('saveInspectionTransformer functions work as expected', () => {
    let transformer;

    beforeAll(() => {
        transformer = saveInspectionTransformer('PASSED', 'FAILED');
    });

    it('inspection_status sets object and value', () => {
        expect(
            transformer.inspection_status(
                { with_inspection: { existing: 'value' } },
                { room_id: 1, inspection_status: 'PASSED' },
            ),
        ).toEqual({ with_inspection: { existing: 'value', inspection_status: 'PASSED' } });
    });
    it('inspection_status clears object and value', () => {
        expect(transformer.inspection_status({ with_inspection: { existing: 'value' } }, { room_id: -1 })).toEqual({
            with_inspection: { existing: 'value', inspection_status: undefined },
        });
    });

    it('inspection_device_id sets object and value', () => {
        expect(
            transformer.inspection_device_id(
                { with_inspection: { existing: 'value' } },
                { room_id: 1, inspection_device_id: 1 },
            ),
        ).toEqual({ with_inspection: { existing: 'value', inspection_device_id: 1 } });
    });
    it('inspection_device_id clears object and value', () => {
        expect(transformer.inspection_device_id({ with_inspection: { existing: 'value' } }, { room_id: -1 })).toEqual({
            with_inspection: { existing: 'value', inspection_device_id: undefined },
        });
    });

    it('inspection_fail_reason sets object and value', () => {
        expect(
            transformer.inspection_fail_reason(
                { with_inspection: { existing: 'value' } },
                { room_id: 1, inspection_fail_reason: 'reason' },
            ),
        ).toEqual({ with_inspection: { existing: 'value', inspection_fail_reason: 'reason' } });
    });
    it('inspection_fail_reason clears object and value', () => {
        expect(transformer.inspection_fail_reason({ with_inspection: { existing: 'value' } }, { room_id: -1 })).toEqual(
            {
                with_inspection: { existing: 'value', inspection_fail_reason: undefined },
            },
        );
    });

    it('inspection_notes sets object and value', () => {
        expect(
            transformer.inspection_notes(
                { with_inspection: { existing: 'value' } },
                { room_id: 1, inspection_notes: 'notes' },
            ),
        ).toEqual({ with_inspection: { existing: 'value', inspection_notes: 'notes' } });
    });
    it('inspection_notes clears object and value', () => {
        expect(transformer.inspection_notes({ with_inspection: { existing: 'value' } }, { room_id: -1 })).toEqual({
            with_inspection: { existing: 'value', inspection_notes: undefined },
        });
    });

    it('inspection_date_next sets object and value', () => {
        expect(
            transformer.inspection_date_next(
                { with_inspection: { existing: 'value' } },
                { room_id: 1, inspection_date_next: '2017-01-01 00:00' },
            ),
        ).toEqual({ with_inspection: { existing: 'value', inspection_date_next: '2017-01-01 00:00' } });
    });
    it('inspection_date_next clears object and value', () => {
        expect(transformer.inspection_date_next({ with_inspection: { existing: 'value' } }, { room_id: -1 })).toEqual({
            with_inspection: { existing: 'value', inspection_date_next: undefined },
        });
    });

    it('isRepair sets object and value', () => {
        expect(transformer.isRepair({ with_repair: { existing: 'value' } }, { isRepair: true })).toEqual({
            with_repair: { existing: 'value', isRepair: true },
        });
    });
    it('repairer_contact_details sets object and value', () => {
        expect(
            transformer.repairer_contact_details(
                { with_repair: { existing: 'value' } },
                { repairer_contact_details: 'details' },
            ),
        ).toEqual({
            with_repair: { existing: 'value', repairer_contact_details: 'details' },
        });
    });

    it('isDiscarded sets object and value', () => {
        expect(transformer.isDiscarded({ with_discarded: { existing: 'value' } }, { isDiscarded: true })).toEqual({
            with_discarded: { existing: 'value', isDiscarded: true },
        });
    });
    it('discard_reason sets object and value', () => {
        expect(
            transformer.discard_reason({ with_discarded: { existing: 'value' } }, { discard_reason: 'details' }),
        ).toEqual({
            with_discarded: { existing: 'value', discard_reason: 'details' },
        });
    });

    it('room id ignores object if not -1', () => {
        expect(transformer.room_id(undefined, { room_id: 1 })).toEqual({});
    });
    it('room id clears object if  -1', () => {
        expect(transformer.room_id(undefined, { room_id: -1 })).toEqual({
            room_id: undefined,
        });
    });

    it('with_inspection sets correct status according to values', () => {
        // if status is pass, clear fail reason
        expect(
            transformer.with_inspection({
                with_inspection: { inspection_status: 'PASSED', inspection_fail_reason: 'reason' },
            }),
        ).toEqual({
            with_inspection: { inspection_status: 'PASSED', inspection_fail_reason: undefined },
        });

        // if status is fail, clear next date
        expect(
            transformer.with_inspection({
                with_inspection: { inspection_status: 'FAILED', inspection_date_next: '2017-01-01 00:00' },
            }),
        ).toEqual({
            with_inspection: { inspection_status: 'FAILED', inspection_date_next: undefined },
        });

        // if status is undefined, clear next date
        expect(
            transformer.with_inspection({
                with_inspection: { inspection_status: undefined },
            }),
        ).toEqual({
            with_inspection: undefined,
        });
    });

    it('with_repair modified object based on set flags', () => {
        // clear discard details
        expect(
            transformer.with_repair({
                with_repair: {
                    isRepair: true,
                    repairer_contact_details: 'details',
                },
                with_discarded: { discard_reason: 'reason' },
            }),
        ).toEqual({
            with_repair: {
                repairer_contact_details: 'details',
            },
            with_discarded: {
                discard_reason: undefined,
            },
        });
        // clear repair details
        expect(
            transformer.with_repair({
                with_repair: {
                    isRepair: false,
                    repairer_contact_details: 'details',
                },
                with_discarded: { discard_reason: 'reason' },
            }),
        ).toEqual({
            with_repair: undefined,
            with_discarded: {
                discard_reason: 'reason',
            },
        });
    });

    it('with_discarded modified object based on set flags', () => {
        // clear repair details
        expect(
            transformer.with_discarded({
                with_discarded: {
                    isDiscarded: true,
                    discard_reason: 'details',
                },
                with_repair: {
                    repairer_contact_details: 'details',
                },
            }),
        ).toEqual({
            with_discarded: {
                discard_reason: 'details',
            },
            with_repair: {
                repairer_contact_details: undefined,
            },
        });
        // clear discard details
        expect(
            transformer.with_discarded({
                with_discarded: {
                    isDiscarded: false,
                    discard_reason: 'details',
                },
                with_repair: {
                    repairer_contact_details: 'details',
                },
            }),
        ).toEqual({
            with_discarded: undefined,
            with_repair: {
                repairer_contact_details: 'details',
            },
        });
    });
});
