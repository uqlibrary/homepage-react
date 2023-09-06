import moment from 'moment';
import { transformRow, transformUpdateRequest, emptyActionState, actionReducer } from './utils';

describe('Utils Test', () => {
    describe('transFormRow', () => {
        it('should return row if username is declared', () => {
            const row = [
                {
                    user_name: 'test',
                    asset_id: 1,
                },
            ];
            const transformedRow = transformRow(row);
            expect(transformedRow).toEqual([
                {
                    asset_id: 1,
                    user_name: 'test',
                },
            ]);
        });
        it('should transform the row correctly', () => {
            const row = [
                {
                    asset_id: 1,
                    asset_id_displayed: 'A001',
                    asset_type: { asset_type_name: 'Type A' },
                    asset_status: 'current',
                    last_inspection: {
                        user_name: 'John Doe',
                        inspect_date: '2022-01-01',
                        inspect_notes: 'Some notes',
                        inspect_fail_reason: 'Failed reason',
                        inspect_status: 'status',
                    },
                    last_discard: {
                        discard_reason: 'Discard reason',
                    },
                    last_repair: {
                        repairer_name: 'Repairer A',
                    },
                },
            ];

            const transformedRow = transformRow(row);

            expect(transformedRow).toEqual([
                {
                    asset_id: 1,
                    asset_id_displayed: 'A001',
                    asset_status: 'current',
                    user_name: 'John Doe',
                    asset_type: 'Type A',
                    inspect_date: moment('2022-01-01').format('YYYY-MM-DD'),
                    inspect_notes: 'Some notes',
                    inspect_fail_reason: 'Failed reason',
                    discard_reason: 'Discard reason',
                    repairer_name: 'Repairer A',
                    last_inspect_status: 'status',
                },
            ]);
        });
        it('should transform the row if LAST data is missing', () => {
            const row = [
                {
                    asset_id: 1,
                    asset_id_displayed: 'A001',
                    asset_type: { asset_type_name: 'Type A' },
                    asset_status: 'current',
                },
            ];

            const transformedRow = transformRow(row);

            expect(transformedRow).toEqual([
                {
                    asset_id: 1,
                    asset_id_displayed: 'A001',
                    asset_status: 'current',
                    asset_type: 'Type A',
                    discard_reason: '',
                    inspect_date: '',
                    inspect_fail_reason: '',
                    inspect_notes: '',
                    last_inspect_status: '',
                    repairer_name: '',
                    user_name: undefined,
                },
            ]);
        });
    });
    describe('transformUpdateRequest', () => {
        it('should transform the request correctly for assetStatus "current"', () => {
            const request = {
                asset_status: 'CURRENT',
                inspect_notes: 'Some notes',
            };

            const transformedRequest = transformUpdateRequest(request);

            expect(transformedRequest).toEqual({ inspect_notes: 'Some notes' });
        });

        it('should transform the request correctly for assetStatus "failed"', () => {
            const request = {
                asset_status: 'FAILED',
                inspect_notes: 'Some notes',
                inspect_fail_reason: 'Failed reason',
            };

            const transformedRequest = transformUpdateRequest(request);

            expect(transformedRequest).toEqual({ inspect_fail_reason: 'Failed reason', inspect_notes: 'Some notes' });
        });

        it('should transform the request correctly for assetStatus "outforrepair"', () => {
            const request = {
                asset_status: 'OUTFORREPAIR',
                inspect_notes: 'Some notes',
                inspect_fail_reason: 'Failed reason',
                repairer_name: 'Repairer A',
            };

            const transformedRequest = transformUpdateRequest(request);

            expect(transformedRequest).toEqual({
                inspect_notes: 'Some notes',
                inspect_fail_reason: 'Failed reason',
                repairer_name: 'Repairer A',
            });
        });

        it('should transform the request correctly for assetStatus "discarded" and lastInspectStatus "failed"', () => {
            const request = {
                asset_status: 'DISCARDED',
                inspect_notes: 'Some notes',
                inspect_fail_reason: 'Failed reason',
                discard_reason: 'Discard reason',
                last_inspect_status: 'FAILED',
            };

            const transformedRequest = transformUpdateRequest(request);

            expect(transformedRequest).toEqual({
                inspect_notes: 'Some notes',
                inspect_fail_reason: 'Failed reason',
                discard_reason: 'Discard reason',
            });
        });

        it('should transform the request correctly for assetStatus "discarded" and lastInspectStatus not "failed"', () => {
            const request = {
                asset_status: 'DISCARDED',
                inspect_notes: 'Some notes',
                inspect_fail_reason: 'Failed reason',
                discard_reason: 'Discard reason',
                last_inspect_status: 'PASSED',
            };

            const transformedRequest = transformUpdateRequest(request);

            expect(transformedRequest).toEqual({
                inspect_notes: 'Some notes',
                discard_reason: 'Discard reason',
            });
        });

        it('should return the original request for unknown assetStatus', () => {
            const request = {
                asset_status: 'unknown',
                inspect_notes: 'Some notes',
            };

            const transformedRequest = transformUpdateRequest(request);

            expect(transformedRequest).toEqual(request);
        });
    });

    describe('actionReducer', () => {
        it('should handle "edit" action correctly', () => {
            const state = {};
            const action = {
                type: 'edit',
                title: 'Edit Action',
                row: { id: 1, name: 'Item A' },
            };

            const newState = actionReducer(state, action);

            expect(newState).toEqual({
                title: 'Edit Action',
                isEdit: true,
                row: { id: 1, name: 'Item A' },
            });
        });

        it('should handle "clear" action correctly', () => {
            const state = {
                title: 'Edit Action',
                isEdit: true,
                row: { id: 1, name: 'Item A' },
            };
            const action = {
                type: 'clear',
            };

            const newState = actionReducer(state, action);

            expect(newState).toEqual(emptyActionState);
        });

        it('should throw an error for unknown action type', () => {
            const state = {};
            const action = {
                type: 'unknown',
            };

            expect(() => actionReducer(state, action)).toThrow("Unknown action 'unknown'");
        });
    });
});
