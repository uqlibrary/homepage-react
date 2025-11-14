import { isValidRoomId, isValidAssetTypeId, isValidAssetStatus } from '../../../Inspection/utils/helpers';
import { isEmptyObject, isEmptyStr } from '../../../helpers/helpers';

import locale from 'modules/Pages/Admin/TestTag/testTag.locale';

const validAssetStatusOptions = locale.pages.manage.bulkassetupdate.config.validAssetStatusOptions;

export const validateFormValues = formValues => {
    const validLocation =
        !formValues.hasLocation ||
        (!isEmptyObject(formValues.location) &&
            isValidRoomId(formValues.location?.room ?? /* istanbul ignore next */ 0));

    const validDiscardStatus = !formValues.hasDiscardStatus || !isEmptyStr(formValues.discard_reason);

    const validAssetType =
        !formValues.hasAssetType ||
        (!isEmptyObject(formValues.asset_type) &&
            isValidAssetTypeId(formValues.asset_type?.asset_type_id ?? /* istanbul ignore next */ 0));

    const validAssetStatus =
        !formValues.hasAssetStatus ||
        (!isEmptyObject(formValues.asset_status) &&
            isValidAssetStatus(formValues.asset_status?.value, validAssetStatusOptions));

    const isValid =
        (formValues.hasLocation ||
            formValues.hasDiscardStatus ||
            formValues.hasAssetType ||
            formValues.hasClearNotes ||
            formValues.hasAssetStatus) &&
        validLocation &&
        validDiscardStatus &&
        validAssetType &&
        validAssetStatus;

    return isValid;
};
