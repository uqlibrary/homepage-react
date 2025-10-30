import locale from '../../testTag.locale.js';
import {
    isValidEventDate,
    isValidNextTestDate,
    isValidAssetId,
    isValidAssetStatus,
    isValidRoomId,
    isValidAssetTypeId,
    isValidTestingDeviceId,
    isValidTestingDeviceForPassInspection,
    isValidFailReason,
    isValidInspection,
    hasTestOrAction,
    isValidRepairDetails,
    isValidRepair,
    isValidDiscardedDetails,
    isValidDiscard,
    statusEnum,
} from './helpers.js';

const moment = require('moment');
const testStatusEnum = statusEnum(locale.pages.inspect.config);

const PASS = testStatusEnum.PASSED.value;
const FAIL = testStatusEnum.FAILED.value;
const checkStandardArguments = (callback, expected) => {
    expect(callback(0)).toEqual(expected);
    expect(callback('')).toEqual(expected);
    expect(callback(null)).toEqual(expected);
    expect(callback()).toEqual(expected);
    expect(callback([])).toEqual(expected);
    expect(callback({})).toEqual(expected);
};

describe('Helper functions', () => {
    it('isValidEventDate validates dates', () => {
        const today = new moment();
        // valid dates must be in past
        const validDate = today.format();
        // invalid dates are in the future
        const invalidDate = today.add(20, 'year').format();
        expect(isValidEventDate()).toBe(false);
        expect(isValidEventDate(validDate)).toBe(true);
        expect(isValidEventDate(invalidDate)).toBe(false);

        const dateFormat = 'YYYY-M-D HH:mm';
        expect(isValidEventDate('2017-01-01 00:00', dateFormat)).toBe(true); // past
        expect(isValidEventDate('2018-01-01 00:00', dateFormat)).toBe(false); // future
    });
    it('isValidNextTestDate validates dates', () => {
        const today = new moment();
        // valid dates must be in future
        const validDate = today.add(1, 'day').format();
        const validObject1 = { inspection_date_next: validDate, inspection_status: PASS };
        // invalid dates are in the past
        const invalidDate = today.subtract(1, 'day').format();
        const invalidObject1 = { inspection_date_next: validDate, inspection_status: FAIL };
        const invalidObject2 = { inspection_date_next: invalidDate, inspection_status: PASS };
        expect(isValidNextTestDate()).toBe(false);
        expect(isValidNextTestDate(validObject1, PASS)).toBe(true);
        expect(isValidNextTestDate(invalidObject1, PASS)).toBe(false);
        expect(isValidNextTestDate(invalidObject2, PASS)).toBe(false);

        const dateFormat = 'YYYY-M-D HH:mm';
        expect(
            isValidNextTestDate(
                { inspection_date_next: '2017-01-01 00:00', inspection_status: PASS },
                PASS,
                dateFormat,
            ),
        ).toBe(false); // past
        expect(
            isValidNextTestDate(
                { inspection_date_next: '2018-01-01 00:00', inspection_status: PASS },
                PASS,
                dateFormat,
            ),
        ).toBe(true); // future
    });
    it('isValidAssetId function validates asset ids', () => {
        expect(isValidAssetId('uql12345')).toBe(true);
        checkStandardArguments(isValidAssetId, false);
    });
    it('isValidAssetStatus function validates asset status', () => {
        // Valid statuses
        expect(isValidAssetStatus('CURRENT', testStatusEnum)).toBe(true);
        expect(isValidAssetStatus('PASSED', testStatusEnum)).toBe(true);
        expect(isValidAssetStatus('FAILED', testStatusEnum)).toBe(true);
        expect(isValidAssetStatus('OUTFORREPAIR', testStatusEnum)).toBe(true);
        expect(isValidAssetStatus('DISCARDED', testStatusEnum)).toBe(true);
        expect(isValidAssetStatus('INSTORAGE', testStatusEnum)).toBe(true);
        expect(isValidAssetStatus('NONE', testStatusEnum)).toBe(true);

        // Invalid statuses
        expect(isValidAssetStatus('INVALID_STATUS', testStatusEnum)).toBe(false);
        expect(isValidAssetStatus('passed', testStatusEnum)).toBe(false); // case sensitive
        expect(isValidAssetStatus('', testStatusEnum)).toBe(false);
        expect(isValidAssetStatus(null, testStatusEnum)).toBe(false);
        expect(isValidAssetStatus(undefined, testStatusEnum)).toBe(false);
        expect(isValidAssetStatus(123, testStatusEnum)).toBe(false);
        expect(isValidAssetStatus({}, testStatusEnum)).toBe(false);
        expect(isValidAssetStatus([], testStatusEnum)).toBe(false);

        // Invalid testStatusEnum
        expect(isValidAssetStatus('PASSED', null)).toBe(false);
        expect(isValidAssetStatus('PASSED', undefined)).toBe(false);
        expect(isValidAssetStatus('PASSED', {})).toBe(false);
    });
    it('isValidRoomId function validates room ids', () => {
        expect(isValidRoomId(1)).toBe(true);
        expect(isValidRoomId('text')).toBe(false);
        checkStandardArguments(isValidRoomId, false);
    });
    it('isValidAssetTypeId function validates asset type ids', () => {
        expect(isValidAssetTypeId(1)).toBe(true);
        expect(isValidAssetTypeId('text')).toBe(false);
        checkStandardArguments(isValidAssetTypeId, false);
    });
    it('isValidTestingDeviceId function validates testing device ids', () => {
        expect(isValidTestingDeviceId(1, 3, 'PASSED', testStatusEnum)).toBe(true);
        expect(isValidTestingDeviceId(1, 3, 'FAILED', testStatusEnum)).toBe(true);
        expect(isValidTestingDeviceId(-1, 3, undefined, testStatusEnum)).toBe(true);
        expect(isValidTestingDeviceId(-1, 3, null, testStatusEnum)).toBe(true);
        expect(isValidTestingDeviceId(1, 3, undefined, testStatusEnum)).toBe(false);
        expect(isValidTestingDeviceId(1, 3, null, testStatusEnum)).toBe(false);
        expect(isValidTestingDeviceId('text', 3, 'PASSED', testStatusEnum)).toBe(false);
        expect(isValidTestingDeviceId(3, 3, 'PASSED', testStatusEnum)).toBe(false);
        expect(isValidTestingDeviceId(3, 3, 'FAILED', testStatusEnum)).toBe(true);
        checkStandardArguments(val => isValidTestingDeviceId(val, 3, 'PASSED', testStatusEnum), false);
    });
    it('isValidTestingDeviceForPassInspection function validates testing device ids and status', () => {
        expect(isValidTestingDeviceForPassInspection(1, 3, 'PASSED', testStatusEnum)).toBe(true);
        expect(isValidTestingDeviceForPassInspection(1, 3, 'FAILED', testStatusEnum)).toBe(true);
        expect(isValidTestingDeviceForPassInspection(-1, 3, undefined, testStatusEnum)).toBe(true);
        expect(isValidTestingDeviceForPassInspection(-1, 3, null, testStatusEnum)).toBe(true);
        expect(isValidTestingDeviceForPassInspection(1, 3, undefined, testStatusEnum)).toBe(true);
        expect(isValidTestingDeviceForPassInspection(1, 3, null, testStatusEnum)).toBe(true);
        expect(isValidTestingDeviceForPassInspection('text', 3, 'PASSED', testStatusEnum)).toBe(true);
        expect(isValidTestingDeviceForPassInspection(3, 3, 'PASSED', testStatusEnum)).toBe(false);
        expect(isValidTestingDeviceForPassInspection(3, 3, 'FAILED', testStatusEnum)).toBe(true);
        checkStandardArguments(val => isValidTestingDeviceForPassInspection(val, 3, 'PASSED', testStatusEnum), true);
    });
    it('isValidFailReason function validates failed values', () => {
        const validObject1 = { inspection_fail_reason: 'reason', inspection_status: FAIL };
        // fail reason is valid if status isn't FAIL (will be removed in code)
        const invalidObject1 = { inspection_fail_reason: 'reason', inspection_status: PASS };
        const invalidObject2 = { inspection_fail_reason: undefined, inspection_status: FAIL };
        expect(isValidFailReason({})).toBe(false);
        expect(isValidFailReason(validObject1, FAIL)).toBe(true);
        expect(isValidFailReason(invalidObject1, FAIL)).toBe(false);
        expect(isValidFailReason(invalidObject2, FAIL)).toBe(false);
    });
    it('isValidInspection function validates inspection values', () => {
        const validObject1 = {
            inspection_date_next: '2018-01-01 00:00',
            inspection_device_id: 1,
            room_id: 1,
            inspection_status: PASS,
        };
        const validObject2 = {
            inspection_fail_reason: 'reason',
            inspection_status: FAIL,
            inspection_device_id: 1,
            room_id: 1,
        };
        const invalidPassObject1 = {
            inspection_date_next: '2010-01-01 00:00', // invalid
            inspection_device_id: 1,
            room_id: 1,
            inspection_status: PASS,
        };
        const invalidPassObject2 = {
            inspection_device_id: 1,
            room_id: 1,
            inspection_status: PASS,
        };
        const invalidPassObject3 = {
            inspection_date_next: '2018-01-01 00:00',
            room_id: 1,
            inspection_status: PASS,
        };
        const invalidPassObject4 = {
            inspection_date_next: '2018-01-01 00:00',
            inspection_device_id: 1,
            inspection_status: PASS,
        };
        const invalidPassObject5 = {
            inspection_date_next: '2018-01-01 00:00',
            inspection_device_id: 1,
            room_id: 1,
            inspection_status: FAIL,
        };
        const invalidPassObject6 = {
            inspection_fail_reason: '', // invalid
            inspection_status: FAIL,
            inspection_device_id: 1,
            room_id: 1,
        };
        const userPass = { department_visual_inspection_device_id: 3 };
        const userFail = { department_visual_inspection_device_id: 1 };
        // no inspection = invalid
        expect(isValidInspection({}, userPass, testStatusEnum)).toBe(false);
        // no inspection = invalid
        expect(isValidInspection({}, userFail, testStatusEnum)).toBe(false);
        expect(isValidInspection({})).toBe(false);
        expect(isValidInspection(validObject1, userPass, testStatusEnum)).toBe(true);
        expect(isValidInspection(validObject1, userFail, testStatusEnum)).toBe(false);
        expect(isValidInspection(validObject2, userPass, testStatusEnum)).toBe(true);
        expect(isValidInspection(validObject2, userFail, testStatusEnum)).toBe(true);
        expect(isValidInspection(invalidPassObject1, userPass, testStatusEnum)).toBe(false);
        expect(isValidInspection(invalidPassObject2, userPass, testStatusEnum)).toBe(false);
        expect(isValidInspection(invalidPassObject3, userPass, testStatusEnum)).toBe(false);
        expect(isValidInspection(invalidPassObject4, userPass, testStatusEnum)).toBe(false);
        expect(isValidInspection(invalidPassObject5, userPass, testStatusEnum)).toBe(false);
        expect(isValidInspection(invalidPassObject6, userPass, testStatusEnum)).toBe(false);
        expect(isValidInspection(invalidPassObject1, userFail, testStatusEnum)).toBe(false);
        expect(isValidInspection(invalidPassObject2, userFail, testStatusEnum)).toBe(false);
        expect(isValidInspection(invalidPassObject3, userFail, testStatusEnum)).toBe(false);
        expect(isValidInspection(invalidPassObject4, userFail, testStatusEnum)).toBe(false);
        expect(isValidInspection(invalidPassObject5, userFail, testStatusEnum)).toBe(false);
        expect(isValidInspection(invalidPassObject6, userFail, testStatusEnum)).toBe(false);
    });
    it('hasTestOrAction validates for valid submission', () => {
        const validObject1 = { inspection_status: testStatusEnum.PASSED.value };
        const validObject2 = { isRepair: true };
        const validObject3 = { isDiscarded: true };
        const invalidObject1 = {};
        const invalidObject2 = { inspection_status: undefined, isRepair: false, isDiscarded: false };

        expect(hasTestOrAction(validObject1)).toBe(true);
        expect(hasTestOrAction(validObject2)).toBe(true);
        expect(hasTestOrAction(validObject3)).toBe(true);
        expect(hasTestOrAction(invalidObject1)).toBe(false);
        expect(hasTestOrAction(invalidObject2)).toBe(false);
    });
    it('isValidRepairDetails function validates repair details', () => {
        expect(isValidRepairDetails('details')).toBe(true);
        checkStandardArguments(isValidRepairDetails, false);
    });
    it('isValidRepair function validates repairs', () => {
        const isValid = ({ formValues, lastInspection }) =>
            isValidRepair({ ...{ formValues }, ...{ lastInspection }, failed: 'FAILED' });
        const validObject1 = { isRepair: true, repairer_contact_details: 'details', inspection_status: 'FAILED' };
        const validObject2 = { isRepair: true, repairer_contact_details: 'details' };
        const invalidObject1 = { isRepair: true, repairer_contact_details: null, inspection_status: 'FAILED' };
        const invalidObject2 = { isRepair: true, repairer_contact_details: null };
        const invalidObject3 = { isRepair: true, repairer_contact_details: 'details', inspection_status: 'PASSED' };
        const invalidObject5 = { isRepair: false, repairer_contact_details: 'details', inspection_status: 'FAILED' };

        expect(isValid({ formValues: validObject1, lastInspection: {} })).toBe(true);
        expect(isValid({ formValues: validObject2, lastInspection: { inspect_status: 'FAILED' } })).toBe(true);
        expect(isValid({})).toBe(false);
        expect(
            isValid({
                formValues: invalidObject1,
                lastInspection: { inspect_status: 'FAILED' },
            }),
        ).toBe(false);
        expect(isValid({ formValues: invalidObject1, lastInspection: {} })).toBe(false);
        expect(
            isValid({
                formValues: invalidObject2,
                lastInspection: { inspect_status: 'FAILED' },
            }),
        ).toBe(false);
        expect(isValid({ formValues: invalidObject2, lastInspection: {} })).toBe(false);
        expect(
            isValid({
                formValues: invalidObject3,
                lastInspection: { inspect_status: 'PASSED' },
            }),
        ).toBe(false);
        expect(isValid({ formValues: invalidObject3, lastInspection: {} })).toBe(false);
        expect(
            isValid({
                formValues: validObject2,
                lastInspection: { inspect_status: 'PASSED' },
            }),
        ).toBe(false);
        expect(isValid({ formValues: validObject2, lastInspection: {} })).toBe(false);
        expect(isValid({ formValues: invalidObject5, lastInspection: {} })).toBe(false);
    });
    it('isValidDiscardedDetails function validates discarded details', () => {
        expect(isValidDiscardedDetails('details')).toBe(true);
        checkStandardArguments(isValidDiscardedDetails, false);
    });
    it('isValidDiscard function validates discards', () => {
        const isValid = ({ formValues, lastInspection }) =>
            isValidDiscard({ ...{ formValues }, ...{ lastInspection }, passed: 'PASSED', failed: 'FAILED' });
        const validObject1 = { isDiscarded: true, discard_reason: 'details', inspection_status: 'FAILED' };
        const validObject2 = { isDiscarded: true, discard_reason: 'details' };
        const validObject3 = { isDiscarded: true, discard_reason: 'details', inspection_status: 'PASSED' };
        const invalidObject1 = { isDiscarded: true, discard_reason: null, inspection_status: 'FAILED' };
        const invalidObject2 = { isDiscarded: true, discard_reason: null };
        const invalidObject5 = { isDiscarded: false, discard_reason: 'details', inspection_status: 'FAILED' };
        // needs new params { formValues, lastInspection, failed: failValue }
        expect(isValid({ formValues: validObject1, lastInspection: {} })).toBe(true);
        expect(
            isValid({
                formValues: validObject2,
                lastInspection: { inspect_status: 'FAILED' },
            }),
        ).toBe(true);
        expect(
            isValid({
                formValues: validObject3,
                lastInspection: { inspect_status: 'PASSED' },
            }),
        ).toBe(true);

        expect(isValid({})).toBe(false);
        expect(
            isValid({
                formValues: invalidObject1,
                lastInspection: { inspect_status: 'FAILED' },
            }),
        ).toBe(false);
        expect(isValid({ formValues: invalidObject1, lastInspection: {} })).toBe(false);
        expect(
            isValid({
                formValues: invalidObject2,
                lastInspection: { inspect_status: 'FAILED' },
            }),
        ).toBe(false);
        expect(isValid({ formValues: invalidObject2, lastInspection: {} })).toBe(false);
        expect(isValid({ formValues: validObject2, lastInspection: { inspect_status: 'OUTFORREPAIR' } })).toBe(false);
        expect(isValid({ formValues: validObject2, lastInspection: {} })).toBe(false);
        expect(isValid({ formValues: invalidObject5, lastInspection: {} })).toBe(false);
    });
    it('creates a valid enum object', () => {
        const expected = {
            CURRENT: {
                label: 'CURRENT',
                value: 'CURRENT',
            },
            DISCARDED: {
                label: 'DISCARD',
                value: 'DISCARDED',
            },
            FAILED: {
                label: 'Fail',
                value: 'FAILED',
            },
            INSTORAGE: {
                label: 'IN STORAGE',
                value: 'INSTORAGE',
            },
            NONE: {
                label: 'NONE',
                value: 'NONE',
            },
            OUTFORREPAIR: {
                label: 'REPAIR',
                value: 'OUTFORREPAIR',
            },
            PASSED: {
                label: 'Pass',
                value: 'PASSED',
            },
        };
        expect(testStatusEnum).toEqual(expected);
    });
});
