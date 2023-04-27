import { useState } from 'react';
import {
    isValidEventDate,
    isValidAssetId,
    isValidUserDepartment,
    isValidAssetTypeId,
    isValidInspection,
    isValidRepair,
    isValidDiscard,
    hasTestOrAction,
} from './helpers';
const moment = require('moment');

export const useForm = (
    /* istanbul ignore next */ { defaultValues = {}, defaultDateFormat = 'YYYY-MM-DD HH:mm' } = {},
) => {
    const [formValues, setFormValues] = useState({ ...defaultValues });

    const handleChange = prop => event => {
        let propValue = event?.target?.value ?? event;
        if (prop.indexOf('date') > -1) {
            propValue = moment(propValue).format(defaultDateFormat);
        }
        setFormValues(prevState => {
            return { ...prevState, [prop]: propValue };
        });
    };

    const resetFormValues = newFormValues => {
        const newValues = { ...formValues, ...newFormValues };
        setFormValues(newValues);
    };

    return { formValues, resetFormValues, handleChange };
};

export const useValidation = (/* istanbul ignore next */ { testStatusEnum = {} } = {}) => {
    const [isValid, setIsValid] = useState(false);

    const validateValues = (formValues, lastInspection) => {
        const val =
            formValues.user_id > 0 &&
            isValidEventDate(formValues.action_date) &&
            isValidAssetId(formValues.asset_id_displayed) &&
            isValidUserDepartment(formValues.asset_department_owned_by) &&
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

export const useLocation = (defaultSiteId = -1, defaultBuildingId = -1, defaultFloorId = -1, defaultRoomId = -1) => {
    const [location, _setLocation] = useState({
        formSiteId: defaultSiteId,
        formBuildingId: defaultBuildingId,
        formFloorId: defaultFloorId,
        formRoomId: defaultRoomId,
    });

    const setLocation = update => {
        _setLocation({ ...location, ...update });
    };
    return { location, setLocation };
};
