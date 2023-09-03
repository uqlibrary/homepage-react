import moment from 'moment';
import { actionReducer, formatDateStrings, transformAddRequest, transformUpdateRequest, transformRow } from './utils';
describe('Utils', () => {
    describe('actionReducer', () => {
        const dateFormat = 'YYYY-MM-DD';
        const emptyActionState = { isAdd: false, isEdit: false, isDelete: false, title: '', row: {} };

        it('should return the correct state for the "add" action', () => {
            const action = {
                type: 'add',
                row: {},
                title: 'Test Title',
            };
            const expectedState = {
                isAdd: true,
                isEdit: false,
                isDelete: false,
                row: {
                    device_id: 'auto',
                    device_calibrated_date_last: moment().format(dateFormat),
                    device_calibration_due_date: moment()
                        .add(1, 'd')
                        .format(dateFormat),
                },
                title: 'Test Title',
                props: {},
            };
            const result = actionReducer(undefined, action);
            expect(result).toEqual(expectedState);
        });

        it('should return the correct state for the "edit" action', () => {
            const action = {
                type: 'edit',
                row: {
                    test: 'result',
                },
                title: 'Test Title',
            };
            const expectedState = {
                isAdd: false,
                isEdit: true,
                isDelete: false,
                row: {
                    test: 'result',
                },
                title: 'Test Title',
                props: {},
            };
            const result = actionReducer(undefined, action);
            expect(result).toEqual(expectedState);
        });

        it('should return the correct state for the "delete" action', () => {
            const action = {
                type: 'delete',
                row: {
                    test: 'value',
                },
                title: 'Test Title',
            };
            const expectedState = {
                isAdd: false,
                isEdit: false,
                isDelete: true,
                row: {
                    test: 'value',
                },
                title: 'Test Title',
                props: {
                    /* ...other props */
                },
            };
            const result = actionReducer(undefined, action);
            expect(result).toEqual(expectedState);
        });

        it('should return the correct state for the "clear" action', () => {
            const action = {
                type: 'clear',
            };
            const expectedState = { ...emptyActionState };
            const result = actionReducer(undefined, action);
            expect(result).toEqual(expectedState);
        });

        it('should throw an error for an unknown action type', () => {
            const action = {
                type: 'unknown',
            };
            expect(() => {
                actionReducer(undefined, action);
            }).toThrow("Unknown action 'unknown'");
        });
    });

    describe('formatDateStrings', () => {
        it('should append suffix to date strings with missing time', () => {
            const row = {
                device_calibrated_date_last: '2022-01-01',
                device_calibration_due_date: '2022-02-01',
            };
            const suffix = '00:00:00';
            const expectedRow = {
                device_calibrated_date_last: '2022-01-01 00:00:00',
                device_calibration_due_date: '2022-02-01 00:00:00',
            };
            const result = formatDateStrings(row, suffix);
            expect(result).toEqual(expectedRow);
        });

        it('should not modify date strings with existing time', () => {
            const row = {
                device_calibrated_date_last: '2022-01-01 12:34:56',
                device_calibration_due_date: '2022-02-01 23:59:59',
            };
            const suffix = '00:00:00';
            const expectedRow = {
                device_calibrated_date_last: '2022-01-01 12:34:56',
                device_calibration_due_date: '2022-02-01 23:59:59',
            };
            const result = formatDateStrings(row, suffix);
            expect(result).toEqual(expectedRow);
        });
    });

    describe('transformAddRequest', () => {
        it('should transform the request object correctly', () => {
            const request = {
                device_id: '123',
                device_name: 'Test Device',
                device_current_flag: true,
                device_calibrated_date_last: '2022-01-01 12:34:56',
                device_calibration_due_date: '2022-02-01 23:59:59',
            };
            const user = {
                user_department: 'Test Department',
            };
            const expectedResponse = {
                device_name: 'Test Device',
                device_department: 'Test Department',
                device_calibrated_date_last: '2022-01-01 12:34:56',
                device_calibration_due_date: '2022-02-01 23:59:59',
            };
            const result = transformAddRequest(request, user);
            expect(result).toEqual(expectedResponse);
        });
    });

    describe('transformUpdateRequest', () => {
        test('should transform the request object correctly', () => {
            const request = {
                device_id: '123',
                device_name: 'Test Device',
                device_current_flag: true,
                device_calibrated_date_last: '2022-01-01 12:34:56',
                device_calibration_due_date: '2022-02-01 23:59:59',
            };
            const expectedResponse = {
                device_id: '123',
                device_name: 'Test Device',
                device_calibrated_date_last: '2022-01-01 12:34:56',
                device_calibration_due_date: '2022-02-01 23:59:59',
            };
            const result = transformUpdateRequest(request);
            expect(result).toEqual(expectedResponse);
        });
    });

    describe('transformRow', () => {
        test('should transform the row correctly', () => {
            const row = [
                {
                    device_id: '1',
                    device_calibrated_date_last: '2022-01-01 12:34:56',
                    device_calibration_due_date: '2022-02-01 23:59:59',
                },
                {
                    device_id: '2',
                    device_calibrated_date_last: '2022-03-01 09:00:00',
                    device_calibration_due_date: '2022-04-01 18:00:00',
                },
            ];
            const expectedRow = [
                {
                    device_id: '1',
                    device_calibrated_date_last: '2022-01-01',
                    device_calibration_due_date: '2022-02-01',
                },
                {
                    device_id: '2',
                    device_calibrated_date_last: '2022-03-01',
                    device_calibration_due_date: '2022-04-01',
                },
            ];
            const result = transformRow(row);
            expect(result).toEqual(expectedRow);
        });
    });
});
