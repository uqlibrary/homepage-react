import { isEmptyStr } from '../../helpers/helpers';
const moment = require('moment');

export const statusEnum = locale => ({
    CURRENT: { label: locale?.currentLabel, value: 'CURRENT' },
    PASSED: { label: locale?.passLabel, value: 'PASSED' },
    FAILED: { label: locale?.failedLabel, value: 'FAILED' },
    OUTFORREPAIR: { label: locale?.repairLabel, value: 'OUTFORREPAIR' },
    DISCARDED: { label: locale?.discardedLabel, value: 'DISCARDED' },
    INSTORAGE: { label: locale?.inStorageLabel, value: 'INSTORAGE' },
    NONE: { label: locale?.noneLabel, value: 'NONE' },
});

export const isValidEventDate = (date, format) => {
    if (isEmptyStr(date)) return false;
    const today = new moment();
    const formattedToday = today.startOf('day');

    const formattedEventDate = moment(date, format).startOf('day');
    return !!moment(formattedEventDate).isValid() && moment(formattedEventDate).isSameOrBefore(formattedToday);
};
export const isValidNextTestDate = (inspection, passedValue, format) => {
    const date = inspection?.inspection_date_next ?? undefined;
    if (!!!date || isEmptyStr(date)) return false;
    if (inspection.inspection_status !== passedValue) return false;
    const today = new moment();
    const formattedToday = today.startOf('day');

    const formattedNextTestDate = new moment(date, format).startOf('day');
    return !!moment(formattedNextTestDate).isValid() && moment(formattedNextTestDate).isAfter(formattedToday);
};
export const isValidAssetId = assetId => {
    return !isEmptyStr(assetId);
};
export const isValidAssetStatus = (assetStatus, testStatusEnum) => {
    /* istanbul ignore next */
    if (!!!testStatusEnum) return false;

    return (
        !isEmptyStr(assetStatus) &&
        Object.entries(testStatusEnum).findIndex(status => status[1].value === assetStatus) !== -1
    );
};
export const isValidRoomId = roomId => !!roomId && Number.isFinite(roomId) && roomId > 0;
export const isValidAssetTypeId = assetTypeId => !!assetTypeId && Number.isFinite(assetTypeId) && assetTypeId > 0;
export const isValidTestingDeviceForPassInspection = (
    testingDeviceId,
    userVisualTestingDeviceId,
    inspectionStatus,
    enums,
) =>
    inspectionStatus !== enums.PASSED.value ||
    (inspectionStatus === enums.PASSED.value &&
        (!!!userVisualTestingDeviceId || testingDeviceId !== userVisualTestingDeviceId));
export const isValidTestingDeviceId = (testingDeviceId, userVisualTestingDeviceId, inspectionStatus, enums) =>
    ((inspectionStatus === enums.PASSED.value || inspectionStatus === enums.FAILED.value) &&
        !!testingDeviceId &&
        Number.isFinite(testingDeviceId) &&
        testingDeviceId > 0 &&
        isValidTestingDeviceForPassInspection(testingDeviceId, userVisualTestingDeviceId, inspectionStatus, enums)) ||
    ((inspectionStatus === undefined || inspectionStatus === null) &&
        (!Number.isFinite(testingDeviceId) || testingDeviceId === -1));

export const isValidFailReason = (inspection, failedValue) =>
    inspection?.inspection_status === failedValue && !isEmptyStr(inspection?.inspection_fail_reason);
export const isValidInspection = (inspection, user, testStatusEnum) => {
    /* istanbul ignore next */
    if (!!!testStatusEnum) return false;
    return (
        isValidRoomId(inspection.room_id) &&
        isValidTestingDeviceId(
            inspection.inspection_device_id,
            user?.department_visual_inspection_device_id,
            inspection.inspection_status,
            testStatusEnum,
        ) &&
        (isValidNextTestDate(inspection, testStatusEnum.PASSED.value) ||
            isValidFailReason(inspection, testStatusEnum.FAILED.value))
    );
};
export const hasTestOrAction = formValues =>
    !isEmptyStr(formValues.inspection_status) || !!formValues.isRepair || !!formValues.isDiscarded;
export const isValidRepairDetails = repairDetails => !isEmptyStr(repairDetails);
export const isValidRepair = ({ formValues, lastInspection, failed: failValue }) =>
    !!formValues?.isRepair &&
    (formValues.inspection_status === failValue || lastInspection?.inspect_status === failValue) &&
    isValidRepairDetails(formValues.repairer_contact_details);
export const isValidDiscardedDetails = discardedDetails => !isEmptyStr(discardedDetails);
export const isValidDiscard = ({ formValues, lastInspection, passed: passValue, failed: failValue }) =>
    !!formValues?.isDiscarded &&
    (!isEmptyStr(formValues.inspection_status) ||
        lastInspection?.inspect_status === passValue ||
        lastInspection?.inspect_status === failValue) &&
    isValidDiscardedDetails(formValues.discard_reason);
