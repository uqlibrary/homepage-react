import { act, renderHook } from '@testing-library/react-hooks';
import { useForm } from '../../helpers/hooks';
import { useValidation, actionReducer } from './hooks';
import { useLocation } from '../../helpers/hooks';

describe('Tests custom hooks', () => {
    it('useForm manages setting and returning of form value state', () => {
        const defaultValues = { a: -1, b: -1, c: -1 };
        const { result } = renderHook(({ defaultValues }) => useForm({ defaultValues }), {
            initialProps: { defaultValues: defaultValues },
        });

        expect(result.current.formValues).toEqual(defaultValues);

        // change state values one by one
        act(() => {
            result.current.handleChange('a')(100);
        });
        expect(result.current.formValues).toEqual({ a: 100, b: -1, c: -1 });

        act(() => {
            result.current.handleChange('b')(100);
        });
        expect(result.current.formValues).toEqual({ a: 100, b: 100, c: -1 });

        act(() => {
            result.current.handleChange('c')(100);
        });
        expect(result.current.formValues).toEqual({ a: 100, b: 100, c: 100 });

        // reset the state
        act(() => {
            result.current.resetFormValues(defaultValues);
        });
        expect(result.current.formValues).toEqual(defaultValues);

        // test the value passed can come from an event object
        act(() => {
            result.current.handleChange('a')({ target: { value: 200 } });
        });
        expect(result.current.formValues).toEqual({ a: 200, b: -1, c: -1 });

        // test date values are handled
        act(() => {
            result.current.handleChange('a_date')('2022-12-14 13:00');
        });
        expect(result.current.formValues).toEqual({ a: 200, b: -1, c: -1, a_date: '2022-12-14 13:00' });
    });

    it('useValidation validates form values', () => {
        const testStatusEnum = { PASSED: { value: 'PASSED' }, FAILED: { value: 'FAILED' } };
        const { result } = renderHook(({ testStatusEnum }) => useValidation({ testStatusEnum }), {
            initialProps: { testStatusEnum },
        });

        act(() => {
            result.current.validateValues({
                asset_id_displayed: undefined,
                room_id: undefined,
                asset_type_id: undefined,
                action_date: undefined,
                inspection_status: undefined,
                inspection_device_id: undefined,
                inspection_fail_reason: undefined,
                inspection_notes: undefined,
                inspection_date_next: undefined,
                isRepair: false,
                repairer_contact_details: undefined,
                isDiscarded: false,
                discard_reason: undefined,
            });
        });
        expect(result.current.isValid).toBe(false);

        // valid inspection only
        const validPassingInspection = {
            action_date: '2016-12-05 14:22',
            asset_id_displayed: 'UQL310000',
            asset_type_id: 1,
            inspection_date_next: '2018-12-05 14:22',
            inspection_device_id: 1,
            inspection_fail_reason: undefined,
            inspection_notes: 'notes',
            inspection_status: 'PASSED',
            isDiscarded: false,
            discard_reason: undefined,
            isRepair: false,
            repairer_contact_details: undefined,
            room_id: 1,
        };
        act(() => {
            result.current.validateValues(validPassingInspection);
        });
        expect(result.current.isValid).toBe(true);

        // valid inspection with discard
        act(() => {
            result.current.validateValues({
                ...validPassingInspection,
                isDiscarded: true,
                discard_reason: 'details',
            });
        });
        expect(result.current.isValid).toBe(true);

        // invalid repair without inspection
        act(() => {
            result.current.validateValues({
                ...validPassingInspection,
                inspection_date_next: undefined,
                inspection_device_id: undefined,
                inspection_notes: undefined,
                inspection_status: undefined,
                isRepair: true,
                repairer_contact_details: 'details',
                room_id: -1,
            });
        });
        expect(result.current.isValid).toBe(false);

        // invalid discard without inspection
        act(() => {
            result.current.validateValues({
                ...validPassingInspection,
                discard_reason: 'details',
                inspection_date_next: undefined,
                inspection_device_id: undefined,
                inspection_notes: undefined,
                inspection_status: undefined,
                isDiscarded: true,
                room_id: -1,
            });
        });
        expect(result.current.isValid).toBe(false);

        // invalid request without date
        act(() => {
            result.current.validateValues({
                ...validPassingInspection,
                action_date: undefined, // required
            });
        });
        expect(result.current.isValid).toBe(false);

        // invalid request when date is in the future
        act(() => {
            result.current.validateValues({
                ...validPassingInspection,
                action_date: '2018-12-05 14:22', // required to be current or past date
            });
        });
        expect(result.current.isValid).toBe(false);

        // invalid request without asset id
        act(() => {
            result.current.validateValues({
                ...validPassingInspection,
                asset_id_displayed: undefined, // required
            });
        });
        expect(result.current.isValid).toBe(false);

        // invalid request without asset type id
        act(() => {
            result.current.validateValues({
                ...validPassingInspection,
                asset_type_id: undefined, // required
            });
        });
        expect(result.current.isValid).toBe(false);

        // invalid inspection without room id
        act(() => {
            result.current.validateValues({
                ...validPassingInspection,
                room_id: -1, // required
            });
        });
        expect(result.current.isValid).toBe(false);

        // invalid inspection with repair
        act(() => {
            result.current.validateValues({
                ...validPassingInspection,
                isRepair: true,
                repairer_contact_details: undefined, // required when isRepair=true
            });
        });
        expect(result.current.isValid).toBe(false);

        // invalid inspection with discard
        act(() => {
            result.current.validateValues({
                ...validPassingInspection,
                discard_reason: undefined, // required when isDiscarded=true
                isDiscarded: true,
            });
        });
        expect(result.current.isValid).toBe(false);

        // invalid inspection with repair and discard when status === PASSED
        act(() => {
            result.current.validateValues({
                ...validPassingInspection,
                discard_reason: 'details',
                isDiscarded: true, // mutually exclusive only for FAILED
                isRepair: true, // --------^
                repairer_contact_details: 'details',
            });
        });
        expect(result.current.isValid).toBe(false);

        // invalid inspection with repair and discard when status FAILED (can only supply one)
        act(() => {
            result.current.validateValues({
                ...validPassingInspection,
                discard_reason: 'details',
                inspection_status: 'FAILED',
                isDiscarded: true, // mutually exclusive for status=FAILED
                isRepair: true, // --------^
                repairer_contact_details: 'details',
            });
        });
        expect(result.current.isValid).toBe(false);

        // invalid PASS inspection without next inspection date
        act(() => {
            result.current.validateValues({
                ...validPassingInspection,
                inspection_date_next: undefined, // required when inspection_status = PASSED
            });
        });
        expect(result.current.isValid).toBe(false);

        // invalid PASS inspection when next inspection date is in the past
        act(() => {
            result.current.validateValues({
                ...validPassingInspection,
                inspection_date_next: '2010-12-05 14:22', // required to be in the future
            });
        });
        expect(result.current.isValid).toBe(false);

        // invalid PASS inspection without device id
        act(() => {
            result.current.validateValues({
                ...validPassingInspection,
                inspection_date_next: '2017-12-05 14:22',
                inspection_device_id: undefined, // required
            });
        });
        expect(result.current.isValid).toBe(false);

        // invalid PASS inspection without device id
        act(() => {
            result.current.validateValues({
                ...validPassingInspection,
                inspection_date_next: '2017-12-05 14:22',
                inspection_fail_reason: undefined, // required when inspection_status = FAILED
                inspection_status: 'FAILED',
            });
        });
        expect(result.current.isValid).toBe(false);

        // invalid inspection with repair and PASS
        act(() => {
            result.current.validateValues({
                ...validPassingInspection,
                isRepair: true,
                repairer_contact_details: 'details',
            });
        });
        expect(result.current.isValid).toBe(false);
    });

    it('useLocation manages location data', () => {
        const { result } = renderHook(() => useLocation());

        expect(result.current.location).toEqual({
            site: -1,
            building: -1,
            floor: -1,
            room: -1,
        });

        act(() => {
            result.current.setLocation({ site: 100 });
        });
        expect(result.current.location).toEqual({
            site: 100,
            building: -1,
            floor: -1,
            room: -1,
        });

        act(() => {
            result.current.setLocation({ building: 100 });
        });
        expect(result.current.location).toEqual({
            site: 100,
            building: 100,
            floor: -1,
            room: -1,
        });

        act(() => {
            result.current.setLocation({ floor: 100 });
        });
        expect(result.current.location).toEqual({
            site: 100,
            building: 100,
            floor: 100,
            room: -1,
        });

        act(() => {
            result.current.setLocation({ room: 100 });
        });
        expect(result.current.location).toEqual({
            site: 100,
            building: 100,
            floor: 100,
            room: 100,
        });

        act(() => {
            result.current.setLocation({
                site: -1,
                building: -1,
                floor: -1,
                room: -1,
            });
        });
        expect(result.current.location).toEqual({
            site: -1,
            building: -1,
            floor: -1,
            room: -1,
        });
    });
    it('actionReducer operates correctly', () => {
        // test add action
        const testAction = {
            type: 'add',
            title: 'test title',
        };
        const expectedAction = {
            title: 'test title',
            isAdd: true,
            row: { asset_type_id: 'auto' },
        };
        expect(actionReducer(null, testAction)).toEqual(expectedAction);
        const expectedEmpty = { isAdd: false, rows: {}, row: {}, title: '' };
        testAction.type = 'clear';
        expect(actionReducer(null, testAction)).toEqual(expectedEmpty);
        // test if throw is correct
        testAction.type = 'test';
        expect(() => {
            actionReducer(null, testAction);
        }).toThrow();
    });
});
