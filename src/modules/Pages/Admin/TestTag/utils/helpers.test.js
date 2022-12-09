import locale from '../testTag.locale.js';
import {
    isEmpty,
    isValidEventDate,
    isValidNextTestDate,
    isValidAssetId,
    isValidOwner,
    isValidRoomId,
    isValidAssetTypeId,
    isValidTestingDeviceId,
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
const testStatusEnum = statusEnum(locale);

const PASS = testStatusEnum.PASSED.value;
const FAIL = testStatusEnum.FAILED.value;
const checkStandardArguments = (callback, expected) => {
    expect(callback(0)).toEqual(expected);
    expect(callback('')).toEqual(expected);
    expect(callback()).toEqual(expected);
    expect(callback([])).toEqual(expected);
    expect(callback({})).toEqual(expected);
};

describe('Helper functions', () => {
    it('isEmpty function validates strings', () => {
        expect(isEmpty('uql12345')).toBe(false);
        checkStandardArguments(isEmpty, true);
    });
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
    it('isValidOwner function validates owners', () => {
        expect(isValidOwner('username')).toBe(true);
        checkStandardArguments(isValidOwner, false);
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
        expect(isValidTestingDeviceId(1, 'PASSED', testStatusEnum)).toBe(true);
        expect(isValidTestingDeviceId(1, 'FAILED', testStatusEnum)).toBe(true);
        expect(isValidTestingDeviceId(-1, undefined, testStatusEnum)).toBe(true);
        expect(isValidTestingDeviceId(-1, null, testStatusEnum)).toBe(true);
        expect(isValidTestingDeviceId(1, undefined, testStatusEnum)).toBe(false);
        expect(isValidTestingDeviceId(1, null, testStatusEnum)).toBe(false);
        expect(isValidTestingDeviceId('text', 'PASSED', testStatusEnum)).toBe(false);
        checkStandardArguments(val => isValidTestingDeviceId(val, 'PASSED', testStatusEnum), false);
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
        expect(isValidInspection({}, testStatusEnum)).toBe(true); // no inspection = valid
        expect(isValidInspection({})).toBe(false);
        expect(isValidInspection(validObject1, testStatusEnum)).toBe(true);
        expect(isValidInspection(validObject2, testStatusEnum)).toBe(true);
        expect(isValidInspection(invalidPassObject1, testStatusEnum)).toBe(false);
        expect(isValidInspection(invalidPassObject2, testStatusEnum)).toBe(false);
        expect(isValidInspection(invalidPassObject3, testStatusEnum)).toBe(false);
        expect(isValidInspection(invalidPassObject4, testStatusEnum)).toBe(false);
        expect(isValidInspection(invalidPassObject5, testStatusEnum)).toBe(false);
        expect(isValidInspection(invalidPassObject6, testStatusEnum)).toBe(false);
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
        const validObject1 = { isRepair: true, repairer_contact_details: 'details' };
        const invalidObject1 = { isRepair: false, repairer_contact_details: 'details' };
        const invalidObject2 = { isRepair: true, repairer_contact_details: '' };
        expect(isValidRepair(validObject1)).toBe(true);
        expect(isValidRepair({})).toBe(false);
        expect(isValidRepair(invalidObject1)).toBe(false);
        expect(isValidRepair(invalidObject2)).toBe(false);
    });
    it('isValidDiscardedDetails function validates discarded details', () => {
        expect(isValidDiscardedDetails('details')).toBe(true);
        checkStandardArguments(isValidDiscardedDetails, false);
    });
    it('isValidDiscard function validates discards', () => {
        const validObject1 = { isDiscarded: true, discard_reason: 'details' };
        const invalidObject1 = { isDiscarded: false, discard_reason: 'details' };
        const invalidObject2 = { isDiscarded: true, discard_reason: '' };
        expect(isValidDiscard(validObject1)).toBe(true);
        expect(isValidDiscard({})).toBe(false);
        expect(isValidDiscard(invalidObject1)).toBe(false);
        expect(isValidDiscard(invalidObject2)).toBe(false);
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
                label: 'FAIL',
                value: 'FAILED',
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
                label: 'PASS',
                value: 'PASSED',
            },
        };
        expect(testStatusEnum).toEqual(expected);
    });
});
