import { useState } from 'react';
import {
    isValidEventDate,
    isValidAssetId,
    isValidOwner,
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
            console.log('handleChange', prop, event, propValue, { ...prevState, [prop]: propValue });
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

    const validateValues = currentValues => {
        const val =
            currentValues.user_id > 0 &&
            isValidEventDate(currentValues.action_date) &&
            isValidAssetId(currentValues.asset_id_displayed) &&
            isValidOwner(currentValues.asset_department_owned_by) &&
            isValidAssetTypeId(currentValues.asset_type_id) &&
            isValidInspection(currentValues, testStatusEnum) &&
            ((!!!currentValues.isRepair && !!!currentValues.isDiscarded) ||
                (!!currentValues.isRepair !== !!currentValues.isDiscarded &&
                    (isValidRepair(currentValues) || isValidDiscard(currentValues))) ||
                (!!currentValues.isRepair === !!currentValues.isDiscarded &&
                    currentValues.inspection_status === testStatusEnum.PASSED.value &&
                    isValidDiscard(currentValues))) &&
            hasTestOrAction(currentValues);
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
