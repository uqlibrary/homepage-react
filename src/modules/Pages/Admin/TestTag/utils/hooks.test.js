import { renderHook, act } from '@testing-library/react-hooks';
import { useForm, useValidation, useLocation } from './hooks';

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
                user_id: undefined,
                asset_department_owned_by: undefined,
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
        const valid1 = {
            action_date: '2016-12-05 14:22',
            asset_department_owned_by: 'UQL-WSS',
            asset_id_displayed: 'UQL310000',
            asset_type_id: 1,
            discard_reason: undefined,
            inspection_date_next: '2018-12-05 14:22',
            inspection_device_id: 1,
            inspection_fail_reason: undefined,
            inspection_notes: 'notes',
            inspection_status: 'PASSED',
            isDiscarded: false,
            isRepair: false,
            repairer_contact_details: undefined,
            room_id: 1,
            user_id: 3,
        };
        act(() => {
            result.current.validateValues(valid1);
        });
        expect(result.current.isValid).toBe(true);

        // valid repair without inspection
        const valid2 = {
            action_date: '2016-12-05 14:22',
            asset_department_owned_by: 'UQL-WSS',
            asset_id_displayed: 'UQL310000',
            asset_type_id: 1,
            discard_reason: undefined,
            inspection_date_next: undefined,
            inspection_device_id: undefined,
            inspection_fail_reason: undefined,
            inspection_notes: undefined,
            inspection_status: undefined,
            isDiscarded: false,
            isRepair: true,
            repairer_contact_details: 'details',
            room_id: -1,
            user_id: 3,
        };
        act(() => {
            result.current.validateValues(valid2);
        });
        expect(result.current.isValid).toBe(true);

        // valid discard without inspection
        const valid3 = {
            action_date: '2016-12-05 14:22',
            asset_department_owned_by: 'UQL-WSS',
            asset_id_displayed: 'UQL310000',
            asset_type_id: 1,
            discard_reason: 'details',
            inspection_date_next: undefined,
            inspection_device_id: undefined,
            inspection_fail_reason: undefined,
            inspection_notes: undefined,
            inspection_status: undefined,
            isDiscarded: true,
            isRepair: false,
            repairer_contact_details: undefined,
            room_id: -1,
            user_id: 3,
        };
        act(() => {
            result.current.validateValues(valid3);
        });
        expect(result.current.isValid).toBe(true);

        // valid inspection with repair
        const valid4 = {
            action_date: '2016-12-05 14:22',
            asset_department_owned_by: 'UQL-WSS',
            asset_id_displayed: 'UQL310000',
            asset_type_id: 1,
            discard_reason: undefined,
            inspection_date_next: '2018-12-05 14:22',
            inspection_device_id: 1,
            inspection_fail_reason: undefined,
            inspection_notes: 'notes',
            inspection_status: 'PASSED',
            isDiscarded: false,
            isRepair: true,
            repairer_contact_details: 'details',
            room_id: 1,
            user_id: 3,
        };
        act(() => {
            result.current.validateValues(valid4);
        });
        expect(result.current.isValid).toBe(true);

        // valid inspection with discard
        const valid5 = {
            action_date: '2016-12-05 14:22',
            asset_department_owned_by: 'UQL-WSS',
            asset_id_displayed: 'UQL310000',
            asset_type_id: 1,
            discard_reason: 'details',
            inspection_date_next: '2018-12-05 14:22',
            inspection_device_id: 1,
            inspection_fail_reason: undefined,
            inspection_notes: 'notes',
            inspection_status: 'PASSED',
            isDiscarded: true,
            isRepair: false,
            repairer_contact_details: undefined,
            room_id: 1,
            user_id: 3,
        };
        act(() => {
            result.current.validateValues(valid5);
        });
        expect(result.current.isValid).toBe(true);

        // invalid request without date
        const invalid1 = {
            action_date: undefined, // required
            asset_department_owned_by: 'UQL-WSS',
            asset_id_displayed: 'UQL310000',
            asset_type_id: 1,
            discard_reason: undefined,
            inspection_date_next: '2018-12-05 14:22',
            inspection_device_id: 1,
            inspection_fail_reason: undefined,
            inspection_notes: 'notes',
            inspection_status: 'PASSED',
            isDiscarded: false,
            isRepair: false,
            repairer_contact_details: undefined,
            room_id: 1,
            user_id: 3,
        };
        act(() => {
            result.current.validateValues(invalid1);
        });
        expect(result.current.isValid).toBe(false);

        // invalid request when date is in the future
        const invalid1b = {
            action_date: '2018-12-05 14:22', // required to be current or past date
            asset_department_owned_by: 'UQL-WSS',
            asset_id_displayed: 'UQL310000',
            asset_type_id: 1,
            discard_reason: undefined,
            inspection_date_next: '2018-12-05 14:22',
            inspection_device_id: 1,
            inspection_fail_reason: undefined,
            inspection_notes: 'notes',
            inspection_status: 'PASSED',
            isDiscarded: false,
            isRepair: false,
            repairer_contact_details: undefined,
            room_id: 1,
            user_id: 3,
        };
        act(() => {
            result.current.validateValues(invalid1b);
        });
        expect(result.current.isValid).toBe(false);

        // invalid request without owner
        const invalid2 = {
            action_date: '2016-12-05 14:22',
            asset_department_owned_by: undefined, // required
            asset_id_displayed: 'UQL310000',
            asset_type_id: 1,
            discard_reason: undefined,
            inspection_date_next: '2018-12-05 14:22',
            inspection_device_id: 1,
            inspection_fail_reason: undefined,
            inspection_notes: 'notes',
            inspection_status: 'PASSED',
            isDiscarded: false,
            isRepair: false,
            repairer_contact_details: undefined,
            room_id: 1,
            user_id: 3,
        };
        act(() => {
            result.current.validateValues(invalid2);
        });
        expect(result.current.isValid).toBe(false);

        // invalid request without asset id
        const invalid3 = {
            action_date: '2016-12-05 14:22',
            asset_department_owned_by: 'UQL-WSS',
            asset_id_displayed: undefined, // required
            asset_type_id: 1,
            discard_reason: undefined,
            inspection_date_next: '2018-12-05 14:22',
            inspection_device_id: 1,
            inspection_fail_reason: undefined,
            inspection_notes: 'notes',
            inspection_status: 'PASSED',
            isDiscarded: false,
            isRepair: false,
            repairer_contact_details: undefined,
            room_id: 1,
            user_id: 3,
        };
        act(() => {
            result.current.validateValues(invalid3);
        });
        expect(result.current.isValid).toBe(false);

        // invalid request without asset type id
        const invalid4 = {
            action_date: '2016-12-05 14:22',
            asset_department_owned_by: 'UQL-WSS',
            asset_id_displayed: 'UQL310000',
            asset_type_id: undefined, // required
            discard_reason: undefined,
            inspection_date_next: '2018-12-05 14:22',
            inspection_device_id: 1,
            inspection_fail_reason: undefined,
            inspection_notes: 'notes',
            inspection_status: 'PASSED',
            isDiscarded: false,
            isRepair: false,
            repairer_contact_details: undefined,
            room_id: 1,
            user_id: 3,
        };
        act(() => {
            result.current.validateValues(invalid4);
        });
        expect(result.current.isValid).toBe(false);

        // invalid request without user id
        const invalid6 = {
            action_date: '2016-12-05 14:22',
            asset_department_owned_by: 'UQL-WSS',
            asset_id_displayed: 'UQL310000',
            asset_type_id: 1,
            discard_reason: undefined,
            inspection_date_next: '2018-12-05 14:22',
            inspection_device_id: 1,
            inspection_fail_reason: undefined,
            inspection_notes: 'notes',
            inspection_status: 'PASSED',
            isDiscarded: false,
            isRepair: false,
            repairer_contact_details: undefined,
            room_id: 1,
            user_id: -1, // required
        };
        act(() => {
            result.current.validateValues(invalid6);
        });
        expect(result.current.isValid).toBe(false);

        // invalid inspection without room id
        const invalid5 = {
            action_date: '2016-12-05 14:22',
            asset_department_owned_by: 'UQL-WSS',
            asset_id_displayed: 'UQL310000',
            asset_type_id: 1,
            discard_reason: undefined,
            inspection_date_next: '2018-12-05 14:22',
            inspection_device_id: 1,
            inspection_fail_reason: undefined,
            inspection_notes: 'notes',
            inspection_status: 'PASSED',
            isDiscarded: false,
            isRepair: false,
            repairer_contact_details: undefined,
            room_id: -1, // required
            user_id: 3,
        };
        act(() => {
            result.current.validateValues(invalid5);
        });
        expect(result.current.isValid).toBe(false);

        // invalid inspection with repair
        const invalid7 = {
            action_date: '2016-12-05 14:22',
            asset_department_owned_by: 'UQL-WSS',
            asset_id_displayed: 'UQL310000',
            asset_type_id: 1,
            discard_reason: undefined,
            inspection_date_next: '2018-12-05 14:22',
            inspection_device_id: 1,
            inspection_fail_reason: undefined,
            inspection_notes: 'notes',
            inspection_status: 'PASSED',
            isDiscarded: false,
            isRepair: true,
            repairer_contact_details: undefined, // required when isRepair=true
            room_id: 1,
            user_id: 3,
        };
        act(() => {
            result.current.validateValues(invalid7);
        });
        expect(result.current.isValid).toBe(false);

        // invalid inspection with discard
        const invalid8 = {
            action_date: '2016-12-05 14:22',
            asset_department_owned_by: 'UQL-WSS',
            asset_id_displayed: 'UQL310000',
            asset_type_id: 1,
            discard_reason: undefined, // required when isDiscarded=true
            inspection_date_next: '2018-12-05 14:22',
            inspection_device_id: 1,
            inspection_fail_reason: undefined,
            inspection_notes: 'notes',
            inspection_status: 'PASSED',
            isDiscarded: true,
            isRepair: false,
            repairer_contact_details: undefined,
            room_id: 1,
            user_id: 3,
        };
        act(() => {
            result.current.validateValues(invalid8);
        });
        expect(result.current.isValid).toBe(false);

        // invalid inspection with repair and discard (can only supply one)
        const invalid8b = {
            action_date: '2016-12-05 14:22',
            asset_department_owned_by: 'UQL-WSS',
            asset_id_displayed: 'UQL310000',
            asset_type_id: 1,
            discard_reason: 'details',
            inspection_date_next: '2018-12-05 14:22',
            inspection_device_id: 1,
            inspection_fail_reason: undefined,
            inspection_notes: 'notes',
            inspection_status: 'PASSED',
            isDiscarded: true, // mutually exclusive
            isRepair: true, // --------^
            repairer_contact_details: 'details',
            room_id: 1,
            user_id: 3,
        };
        act(() => {
            result.current.validateValues(invalid8b);
        });
        expect(result.current.isValid).toBe(false);

        // invalid PASS inspection without next inspection date
        const invalid9 = {
            action_date: '2016-12-05 14:22',
            asset_department_owned_by: 'UQL-WSS',
            asset_id_displayed: 'UQL310000',
            asset_type_id: 1,
            discard_reason: undefined,
            inspection_date_next: undefined, // required when inspection_status = PASSED
            inspection_device_id: 1,
            inspection_fail_reason: undefined,
            inspection_notes: 'notes',
            inspection_status: 'PASSED',
            isDiscarded: false,
            isRepair: false,
            repairer_contact_details: undefined,
            room_id: 1,
            user_id: 3,
        };
        act(() => {
            result.current.validateValues(invalid9);
        });
        expect(result.current.isValid).toBe(false);

        // invalid PASS inspection when next inspection date is in the past
        const invalid10 = {
            action_date: '2016-12-05 14:22',
            asset_department_owned_by: 'UQL-WSS',
            asset_id_displayed: 'UQL310000',
            asset_type_id: 1,
            discard_reason: undefined,
            inspection_date_next: '2010-12-05 14:22', // required to be in the future
            inspection_device_id: 1,
            inspection_fail_reason: undefined,
            inspection_notes: 'notes',
            inspection_status: 'PASSED',
            isDiscarded: false,
            isRepair: false,
            repairer_contact_details: undefined,
            room_id: 1,
            user_id: 3,
        };
        act(() => {
            result.current.validateValues(invalid10);
        });
        expect(result.current.isValid).toBe(false);

        // invalid PASS inspection without device id
        const invalid11 = {
            action_date: '2016-12-05 14:22',
            asset_department_owned_by: 'UQL-WSS',
            asset_id_displayed: 'UQL310000',
            asset_type_id: 1,
            discard_reason: undefined,
            inspection_date_next: '2017-12-05 14:22',
            inspection_device_id: undefined, // required
            inspection_fail_reason: undefined,
            inspection_notes: 'notes',
            inspection_status: 'PASSED',
            isDiscarded: false,
            isRepair: false,
            repairer_contact_details: undefined,
            room_id: 1,
            user_id: 3,
        };
        act(() => {
            result.current.validateValues(invalid11);
        });
        expect(result.current.isValid).toBe(false);

        // invalid PASS inspection without device id
        const invalid12 = {
            action_date: '2016-12-05 14:22',
            asset_department_owned_by: 'UQL-WSS',
            asset_id_displayed: 'UQL310000',
            asset_type_id: 1,
            discard_reason: undefined,
            inspection_date_next: '2017-12-05 14:22',
            inspection_device_id: 1,
            inspection_fail_reason: undefined, // required when inspection_status = FAILED
            inspection_notes: 'notes',
            inspection_status: 'FAILED',
            isDiscarded: false,
            isRepair: false,
            repairer_contact_details: undefined,
            room_id: 1,
            user_id: 3,
        };
        act(() => {
            result.current.validateValues(invalid12);
        });
        expect(result.current.isValid).toBe(false);
    });

    it('useLocation manages location data', () => {
        const { result } = renderHook(() => useLocation());

        expect(result.current.location).toEqual({
            formSiteId: -1,
            formBuildingId: -1,
            formFloorId: -1,
            formRoomId: -1,
        });

        act(() => {
            result.current.setLocation({ formSiteId: 100 });
        });
        expect(result.current.location).toEqual({
            formSiteId: 100,
            formBuildingId: -1,
            formFloorId: -1,
            formRoomId: -1,
        });

        act(() => {
            result.current.setLocation({ formBuildingId: 100 });
        });
        expect(result.current.location).toEqual({
            formSiteId: 100,
            formBuildingId: 100,
            formFloorId: -1,
            formRoomId: -1,
        });

        act(() => {
            result.current.setLocation({ formFloorId: 100 });
        });
        expect(result.current.location).toEqual({
            formSiteId: 100,
            formBuildingId: 100,
            formFloorId: 100,
            formRoomId: -1,
        });

        act(() => {
            result.current.setLocation({ formRoomId: 100 });
        });
        expect(result.current.location).toEqual({
            formSiteId: 100,
            formBuildingId: 100,
            formFloorId: 100,
            formRoomId: 100,
        });

        act(() => {
            result.current.setLocation({
                formSiteId: -1,
                formBuildingId: -1,
                formFloorId: -1,
                formRoomId: -1,
            });
        });
        expect(result.current.location).toEqual({
            formSiteId: -1,
            formBuildingId: -1,
            formFloorId: -1,
            formRoomId: -1,
        });
    });
});
