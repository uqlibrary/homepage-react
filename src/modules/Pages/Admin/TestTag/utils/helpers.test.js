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
        expect(isEmpty('uql12345')).toEqual(false);
        checkStandardArguments(isEmpty, true);
    });
    it('isValidEventDate validates dates', () => {
        const today = new moment();
        // valid dates must be in past
        const validDate = today.format();
        // invalid dates are in the future
        const invalidDate = today.add(20, 'year').format();
        expect(isValidEventDate()).toEqual(false);
        expect(isValidEventDate(validDate)).toEqual(true);
        expect(isValidEventDate(invalidDate)).toEqual(false);

        const dateFormat = 'YYYY-M-D HH:mm';
        expect(isValidEventDate('2017-01-01 00:00', dateFormat)).toEqual(true); // past
        expect(isValidEventDate('2018-01-01 00:00', dateFormat)).toEqual(false); // future
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
        expect(isValidNextTestDate()).toEqual(false);
        expect(isValidNextTestDate(validObject1, PASS)).toEqual(true);
        expect(isValidNextTestDate(invalidObject1, PASS)).toEqual(false);
        expect(isValidNextTestDate(invalidObject2, PASS)).toEqual(false);

        const dateFormat = 'YYYY-M-D HH:mm';
        expect(
            isValidNextTestDate(
                { inspection_date_next: '2017-01-01 00:00', inspection_status: PASS },
                PASS,
                dateFormat,
            ),
        ).toEqual(false); // past
        expect(
            isValidNextTestDate(
                { inspection_date_next: '2018-01-01 00:00', inspection_status: PASS },
                PASS,
                dateFormat,
            ),
        ).toEqual(true); // future
    });
    it('isValidAssetId function validates asset ids', () => {
        expect(isValidAssetId('uql12345')).toEqual(true);
        checkStandardArguments(isValidAssetId, false);
    });
    it('isValidOwner function validates owners', () => {
        expect(isValidOwner('username')).toEqual(true);
        checkStandardArguments(isValidOwner, false);
    });
    it('isValidRoomId function validates room ids', () => {
        expect(isValidRoomId(1)).toEqual(true);
        expect(isValidRoomId('text')).toEqual(false);
        checkStandardArguments(isValidRoomId, false);
    });
    it('isValidAssetTypeId function validates asset type ids', () => {
        expect(isValidAssetTypeId(1)).toEqual(true);
        expect(isValidAssetTypeId('text')).toEqual(false);
        checkStandardArguments(isValidAssetTypeId, false);
    });
    it('isValidTestingDeviceId function validates testing device ids', () => {
        expect(isValidTestingDeviceId(1)).toEqual(true);
        expect(isValidTestingDeviceId('text')).toEqual(false);
        checkStandardArguments(isValidTestingDeviceId, false);
    });
    it('isValidFailReason function validates failed values', () => {
        const validObject1 = { inspection_fail_reason: 'reason', inspection_status: FAIL };
        // fail reason is valid if status isn't FAIL (will be removed in code)
        const invalidObject1 = { inspection_fail_reason: 'reason', inspection_status: PASS };
        const invalidObject2 = { inspection_fail_reason: undefined, inspection_status: FAIL };
        expect(isValidFailReason({})).toEqual(false);
        expect(isValidFailReason(validObject1, FAIL)).toEqual(true);
        expect(isValidFailReason(invalidObject1, FAIL)).toEqual(false);
        expect(isValidFailReason(invalidObject2, FAIL)).toEqual(false);
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
        expect(isValidInspection({}, testStatusEnum)).toEqual(true); // no inspection = valid
        expect(isValidInspection({})).toEqual(false);
        expect(isValidInspection(validObject1, testStatusEnum)).toEqual(true);
        expect(isValidInspection(validObject2, testStatusEnum)).toEqual(true);
        expect(isValidInspection(invalidPassObject1, testStatusEnum)).toEqual(false);
        expect(isValidInspection(invalidPassObject2, testStatusEnum)).toEqual(false);
        expect(isValidInspection(invalidPassObject3, testStatusEnum)).toEqual(false);
        expect(isValidInspection(invalidPassObject4, testStatusEnum)).toEqual(false);
        expect(isValidInspection(invalidPassObject5, testStatusEnum)).toEqual(false);
        expect(isValidInspection(invalidPassObject6, testStatusEnum)).toEqual(false);
    });
    it('hasTestOrAction validates for valid submission', () => {
        const validObject1 = { inspection_status: testStatusEnum.PASSED.value };
        const validObject2 = { isRepair: true };
        const validObject3 = { isDiscarded: true };
        const invalidObject1 = {};
        const invalidObject2 = { inspection_status: undefined, isRepair: false, isDiscarded: false };

        expect(hasTestOrAction(validObject1)).toEqual(true);
        expect(hasTestOrAction(validObject2)).toEqual(true);
        expect(hasTestOrAction(validObject3)).toEqual(true);
        expect(hasTestOrAction(invalidObject1)).toEqual(false);
        expect(hasTestOrAction(invalidObject2)).toEqual(false);
    });
    it('isValidRepairDetails function validates repair details', () => {
        expect(isValidRepairDetails('details')).toEqual(true);
        checkStandardArguments(isValidRepairDetails, false);
    });
    it('isValidRepair function validates repairs', () => {
        const validObject1 = { isRepair: true, repairer_contact_details: 'details' };
        const invalidObject1 = { isRepair: false, repairer_contact_details: 'details' };
        const invalidObject2 = { isRepair: true, repairer_contact_details: '' };
        expect(isValidRepair(validObject1)).toEqual(true);
        expect(isValidRepair({})).toEqual(false);
        expect(isValidRepair(invalidObject1)).toEqual(false);
        expect(isValidRepair(invalidObject2)).toEqual(false);
    });
    it('isValidDiscardedDetails function validates discarded details', () => {
        expect(isValidDiscardedDetails('details')).toEqual(true);
        checkStandardArguments(isValidDiscardedDetails, false);
    });
    it('isValidDiscard function validates discards', () => {
        const validObject1 = { isDiscarded: true, discard_reason: 'details' };
        const invalidObject1 = { isDiscarded: false, discard_reason: 'details' };
        const invalidObject2 = { isDiscarded: true, discard_reason: '' };
        expect(isValidDiscard(validObject1)).toEqual(true);
        expect(isValidDiscard({})).toEqual(false);
        expect(isValidDiscard(invalidObject1)).toEqual(false);
        expect(isValidDiscard(invalidObject2)).toEqual(false);
    });
});
