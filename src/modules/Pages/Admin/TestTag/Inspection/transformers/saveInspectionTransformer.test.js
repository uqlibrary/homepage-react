import { saveInspectionTransformer } from './saveInspectionTransformer';

describe('saveInspectionTransformer functions work as expected', () => {
    let transformer;

    beforeAll(() => {
        transformer = saveInspectionTransformer('PASSED', 'FAILED');
    });

    it('action_date sets object and value', () => {
        expect(
            transformer.action_date({ data: { isManualDate: false }, params: { dateFormat: 'DD/MM/YYYY' } }),
        ).toEqual({ action_date: '30/06/2017' });

        expect(
            transformer.action_date({
                data: { isManualDate: true, action_date: '01-01-2000 10:00' },
                params: { dateFormat: 'DD/MM/YYYY HH:MM' }, // date format still needed to get time
            }),
        ).toEqual({ action_date: '01-01-2000 00:06' }); // current time replaces supplied time for manual dates
    });

    it('inspection_status sets object and value', () => {
        expect(
            transformer.inspection_status({
                state: { with_inspection: { existing: 'value' } },
                data: { room_id: 1, inspection_status: 'PASSED' },
            }),
        ).toEqual({ with_inspection: { existing: 'value', inspection_status: 'PASSED' } });
    });
    it('inspection_status clears object and value', () => {
        expect(
            transformer.inspection_status({ state: { with_inspection: { existing: 'value' } }, data: { room_id: -1 } }),
        ).toEqual({
            with_inspection: { existing: 'value', inspection_status: undefined },
        });
    });

    it('inspection_device_id sets object and value', () => {
        expect(
            transformer.inspection_device_id({
                state: { with_inspection: { existing: 'value' } },
                data: { room_id: 1, inspection_device_id: 1 },
            }),
        ).toEqual({ with_inspection: { existing: 'value', inspection_device_id: 1 } });
    });
    it('inspection_device_id clears object and value', () => {
        expect(
            transformer.inspection_device_id({
                state: { with_inspection: { existing: 'value' } },
                data: { room_id: -1 },
            }),
        ).toEqual({
            with_inspection: { existing: 'value', inspection_device_id: undefined },
        });
    });

    it('inspection_fail_reason sets object and value', () => {
        expect(
            transformer.inspection_fail_reason({
                state: { with_inspection: { existing: 'value' } },
                data: {
                    room_id: 1,
                    inspection_fail_reason: 'reason',
                },
            }),
        ).toEqual({ with_inspection: { existing: 'value', inspection_fail_reason: 'reason' } });
    });
    it('inspection_fail_reason clears object and value', () => {
        expect(
            transformer.inspection_fail_reason({
                state: { with_inspection: { existing: 'value' } },
                data: { room_id: -1 },
            }),
        ).toEqual({
            with_inspection: { existing: 'value', inspection_fail_reason: undefined },
        });
    });

    it('inspection_notes sets object and value', () => {
        expect(
            transformer.inspection_notes({
                state: { with_inspection: { existing: 'value' } },
                data: { room_id: 1, inspection_notes: 'notes' },
            }),
        ).toEqual({ with_inspection: { existing: 'value', inspection_notes: 'notes' } });
    });
    it('inspection_notes clears object and value', () => {
        expect(
            transformer.inspection_notes({ state: { with_inspection: { existing: 'value' } }, data: { room_id: -1 } }),
        ).toEqual({
            with_inspection: { existing: 'value', inspection_notes: undefined },
        });
    });

    it('inspection_date_next sets object and value', () => {
        expect(
            transformer.inspection_date_next({
                state: { with_inspection: { existing: 'value' } },
                data: { room_id: 1, inspection_date_next: '2017-01-01 00:00' },
            }),
        ).toEqual({ with_inspection: { existing: 'value', inspection_date_next: '2017-01-01 00:00' } });
    });
    it('inspection_date_next clears object and value', () => {
        expect(
            transformer.inspection_date_next({
                state: { with_inspection: { existing: 'value' } },
                data: { room_id: -1 },
            }),
        ).toEqual({
            with_inspection: { existing: 'value', inspection_date_next: undefined },
        });
    });

    it('isRepair sets object and value', () => {
        expect(
            transformer.isRepair({ state: { with_repair: { existing: 'value' } }, data: { isRepair: true } }),
        ).toEqual({
            with_repair: { existing: 'value', isRepair: true },
        });
    });
    it('repairer_contact_details sets object and value', () => {
        expect(
            transformer.repairer_contact_details({
                state: { with_repair: { existing: 'value' } },
                data: { repairer_contact_details: 'details' },
            }),
        ).toEqual({
            with_repair: { existing: 'value', repairer_contact_details: 'details' },
        });
    });

    it('isDiscarded sets object and value', () => {
        expect(
            transformer.isDiscarded({ state: { with_discard: { existing: 'value' } }, data: { isDiscarded: true } }),
        ).toEqual({
            with_discard: { existing: 'value', isDiscarded: true },
        });
    });
    it('discard_reason sets object and value', () => {
        expect(
            transformer.discard_reason({
                state: { with_discard: { existing: 'value' } },
                data: { discard_reason: 'details' },
            }),
        ).toEqual({
            with_discard: { existing: 'value', discard_reason: 'details' },
        });
    });

    it('room id ignores object if not -1', () => {
        expect(transformer.room_id({ data: { room_id: 1 } })).toEqual({});
    });
    it('room id clears object if  -1', () => {
        expect(transformer.room_id({ data: { room_id: -1 } })).toEqual({
            room_id: undefined,
        });
    });

    it('with_inspection sets correct status according to values', () => {
        // if status is pass, clear fail reason
        expect(
            transformer.with_inspection({
                state: {
                    with_inspection: { inspection_status: 'PASSED', inspection_fail_reason: 'reason' },
                },
            }),
        ).toEqual({
            with_inspection: { inspection_status: 'PASSED', inspection_fail_reason: undefined },
        });

        // if status is fail, clear next date
        expect(
            transformer.with_inspection({
                state: { with_inspection: { inspection_status: 'FAILED', inspection_date_next: '2017-01-01 00:00' } },
            }),
        ).toEqual({
            with_inspection: { inspection_status: 'FAILED', inspection_date_next: undefined },
        });

        // if status is undefined, clear next date
        expect(
            transformer.with_inspection({
                state: {
                    with_inspection: { inspection_status: undefined },
                },
            }),
        ).toEqual({
            with_inspection: undefined,
        });
    });

    it('with_repair modified object based on set flags', () => {
        // clear discard details if repair status and inspection failed
        expect(
            transformer.with_repair({
                state: {
                    with_inspection: { inspection_status: 'FAILED' },
                    with_repair: {
                        isRepair: true,
                        repairer_contact_details: 'details',
                    },
                    with_discard: { discard_reason: 'reason' },
                },
            }),
        ).toEqual({
            with_repair: {
                repairer_contact_details: 'details',
            },
            with_discard: undefined,
        });
        // clear discard details if no inspection but last test failed
        expect(
            transformer.with_repair({
                state: {
                    with_repair: {
                        isRepair: true,
                        repairer_contact_details: 'details',
                    },
                    with_discard: { discard_reason: 'reason' },
                },
                params: {
                    lastInspection: { inspect_status: 'FAILED' },
                },
            }),
        ).toEqual({
            with_repair: {
                repairer_contact_details: 'details',
            },
            with_discard: undefined,
        });
        // clear repair details if repair status and inspection PASSED
        expect(
            transformer.with_repair({
                state: {
                    with_inspection: { inspection_status: 'PASSED' },
                    with_repair: {
                        isRepair: true,
                        repairer_contact_details: 'details',
                    },
                    with_discard: { discard_reason: 'reason' },
                },
            }),
        ).toEqual({
            with_repair: undefined,
            with_discard: {
                discard_reason: 'reason',
            },
        });
        // clear repair details if previous test failed but current inspection PASSED
        expect(
            transformer.with_repair({
                state: {
                    with_inspection: { inspection_status: 'PASSED' },
                    with_repair: {
                        isRepair: true,
                        repairer_contact_details: 'details',
                    },
                    with_discard: { discard_reason: 'reason' },
                },
                params: {
                    lastInspection: { inspect_status: 'FAILED' },
                },
            }),
        ).toEqual({
            with_repair: undefined,
            with_discard: {
                discard_reason: 'reason',
            },
        });
        // clear repair details
        expect(
            transformer.with_repair({
                state: {
                    with_repair: {
                        isRepair: false,
                        repairer_contact_details: 'details',
                    },
                    with_discard: { discard_reason: 'reason' },
                },
            }),
        ).toEqual({
            with_repair: undefined,
            with_discard: {
                discard_reason: 'reason',
            },
        });
    });

    it('with_discard modified object based on set flags', () => {
        // clear repair details if inspection status
        expect(
            transformer.with_discard({
                state: {
                    with_inspection: { inspection_status: 'PASSED' },
                    with_discard: {
                        isDiscarded: true,
                        discard_reason: 'details',
                    },
                    with_repair: {
                        repairer_contact_details: 'details',
                    },
                },
            }),
        ).toEqual({
            with_discard: {
                discard_reason: 'details',
            },
            with_repair: undefined,
        });

        // clear repair details if last test status
        expect(
            transformer.with_discard({
                state: {
                    with_discard: {
                        isDiscarded: true,
                        discard_reason: 'details',
                    },
                    with_repair: {
                        repairer_contact_details: 'details',
                    },
                },
                params: {
                    lastInspection: { inspect_status: 'FAILED' },
                },
            }),
        ).toEqual({
            with_discard: {
                discard_reason: 'details',
            },
            with_repair: undefined,
        });

        // clear discard details if isDiscarded is false
        expect(
            transformer.with_discard({
                state: {
                    with_inspection: { inspection_status: 'PASSED' },
                    with_discard: {
                        isDiscarded: false,
                        discard_reason: 'details',
                    },
                    with_repair: {
                        repairer_contact_details: 'details',
                    },
                },
            }),
        ).toEqual({
            with_discard: undefined,
            with_repair: {
                repairer_contact_details: 'details',
            },
        });
        // clear discard details if no inspection status
        expect(
            transformer.with_discard({
                state: {
                    with_discard: {
                        isDiscarded: false,
                        discard_reason: 'details',
                    },
                    with_repair: {
                        repairer_contact_details: 'details',
                    },
                },
            }),
        ).toEqual({
            with_discard: undefined,
            with_repair: {
                repairer_contact_details: 'details',
            },
        });
    });
});
