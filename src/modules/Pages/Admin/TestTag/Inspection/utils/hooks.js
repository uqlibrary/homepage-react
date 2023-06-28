import { useState } from 'react';
import {
    isValidEventDate,
    isValidAssetId,
    isValidAssetTypeId,
    isValidInspection,
    isValidRepair,
    isValidDiscard,
    hasTestOrAction,
} from './helpers';

export const useValidation = (/* istanbul ignore next */ { testStatusEnum = {} } = {}) => {
    const [isValid, setIsValid] = useState(false);

    const validateValues = (formValues, lastInspection) => {
        const val =
            isValidEventDate(formValues.action_date) &&
            isValidAssetId(formValues.asset_id_displayed) &&
            isValidAssetTypeId(formValues.asset_type_id) &&
            isValidInspection(formValues, testStatusEnum) &&
            ((!!!formValues.isRepair && !!!formValues.isDiscarded) ||
                (!!formValues.isRepair !== !!formValues.isDiscarded &&
                    (isValidRepair({
                        formValues,
                        lastInspection,
                        passed: testStatusEnum.PASSED.value,
                        failed: testStatusEnum.FAILED.value,
                    }) ||
                        isValidDiscard({
                            formValues,
                            lastInspection,
                            passed: testStatusEnum.PASSED.value,
                            failed: testStatusEnum.FAILED.value,
                        })))) &&
            hasTestOrAction(formValues);
        setIsValid(val);
    };

    return { isValid, validateValues };
};
