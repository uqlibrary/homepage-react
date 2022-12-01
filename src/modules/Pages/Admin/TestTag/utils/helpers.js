/* istanbul ignore file */
const moment = require('moment');

export const scrollToTopOfPage = () => {
    const topOfPage = document.getElementById('StandardPage');
    !!topOfPage && topOfPage.scrollIntoView();
};

export const isEmpty = value => {
    return !!!value || value === '' || (!!value.length && value.length === 0);
};
export const isValidEventDate = (date, format) => {
    if (isEmpty(date)) return false;
    const today = new moment();
    const formattedToday = today.startOf('day');

    const formattedEventDate = new moment(date, format).startOf('day');
    const result = !!moment(formattedEventDate).isValid() && moment(formattedEventDate).isSameOrBefore(formattedToday);

    return result;
};
export const isValidNextTestDate = (inspection, passedValue, format) => {
    const date = inspection?.inspection_date_next ?? undefined;
    if (!!!date || isEmpty(date)) return false;
    if (inspection.inspection_status !== passedValue) return true;

    const today = new moment();
    const formattedToday = today.startOf('day');

    const formattedNextTestDate = new moment(date, format).startOf('day');
    const result = !!moment(formattedNextTestDate).isValid() && moment(formattedNextTestDate).isAfter(formattedToday);

    return result;
};
export const isValidAssetId = assetId => !isEmpty(assetId);
export const isValidOwner = owner => !isEmpty(owner);
export const isValidRoomId = roomId => !!roomId && Number.isFinite(roomId) && roomId > 0;
export const isValidAssetTypeId = assetTypeId => !!assetTypeId && Number.isFinite(assetTypeId) && assetTypeId > 0;
export const isValidTestingDeviceId = testingDeviceId =>
    !!testingDeviceId && Number.isFinite(testingDeviceId) && testingDeviceId > 0;
export const isValidFailReason = (inspection, failedValue) =>
    inspection.inspection_status !== failedValue || !isEmpty(inspection.inspection_fail_reason);
export const isValidInspection = (inspection, testStatusEnum) => {
    return (
        inspection.inspection_status === undefined ||
        (isValidRoomId(inspection.room_id) &&
            isValidTestingDeviceId(inspection.inspection_device_id) &&
            (isValidNextTestDate(inspection.inspection_date_next, testStatusEnum.PASSED.value) ||
                isValidFailReason(inspection, testStatusEnum.FAILED.value)))
    );
};
export const hasTestOrAction = currentValues =>
    currentValues.inspection_status !== undefined || !!currentValues.isRepair || !!currentValues.isDiscarded;
export const isValidRepairDetails = repairDetails => !isEmpty(repairDetails);
export const isValidRepair = repair => !!repair.isRepair && isValidRepairDetails(repair.repairer_contact_details);
export const isValidDiscardedDetails = discardedDetails => !isEmpty(discardedDetails);
export const isValidDiscard = discard => !!discard.isDiscarded && isValidDiscardedDetails(discard.discard_reason);
export const isAssetDiscarded = (lastTest, discardedValue) => lastTest.inspect_status === discardedValue;
export const isAssetOutForRepair = (lastTest, outForRepairValue) => lastTest.inspect_status === outForRepairValue;

export const statusEnum = locale => ({
    CURRENT: { label: locale.config.currentLabel, value: 'CURRENT' },
    PASSED: { label: locale.config.passLabel, value: 'PASSED' },
    FAILED: { label: locale.config.failedLabel, value: 'FAILED' },
    OUTFORREPAIR: { label: locale.config.repairLabel, value: 'OUTFORREPAIR' },
    DISCARDED: { label: locale.config.discardedLabel, value: 'DISCARDED' },
    NONE: { label: locale.config.noneLabel, value: 'NONE' },
});
