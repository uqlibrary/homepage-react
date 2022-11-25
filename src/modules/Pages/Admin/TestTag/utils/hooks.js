import { useState } from 'react';
import {
    isValidEventDate,
    isValidAssetId,
    isValidOwner,
    isValidRoomId,
    isValidAssetTypeId,
    isValidInspection,
    isValidRepair,
    isValidDiscard,
    hasTestOrAction,
} from './helpers';
const moment = require('moment');

export const useForm = ({ defaultValues = {}, defaultDateFormat = 'YYYY-MM-DD HH:MM' } = {}) => {
    const [formValues, setFormValues] = useState({ ...defaultValues });

    const handleChange = arg => event => {
        const prop = arg; // .replace('-', '_').replace('.', '_');
        let propValue = event?.target?.value ?? event;
        if (prop.indexOf('date') > -1) {
            propValue = moment(event)
                .format(defaultDateFormat)
                .toString();
        }
        setFormValues(prevState => {
            console.log('handleChange', { ...prevState, [prop]: propValue });
            return { ...prevState, [prop]: propValue };
        });
    };

    const resetFormValues = newFormValues => {
        const newValues = { ...formValues, ...newFormValues };
        console.log('resetFormValues', { ...newValues });
        setFormValues(newValues);
    };

    return [formValues, resetFormValues, handleChange];
};

export const useValidation = ({ testStatusEnum = {} } = {}) => {
    const [isValid, setIsValid] = useState(false);

    const validateValues = currentValues => {
        const val =
            currentValues.user_id > 0 &&
            isValidEventDate(currentValues.action_date) &&
            isValidAssetId(currentValues.asset_barcode) &&
            isValidOwner(currentValues.asset_department_owned_by) &&
            isValidRoomId(currentValues.room_id) &&
            isValidAssetTypeId(currentValues.asset_type_id) &&
            isValidInspection(currentValues, testStatusEnum) &&
            ((!!!currentValues.isRepair && !!!currentValues.isDiscarded) ||
                (!!currentValues.isRepair !== !!currentValues.isDiscarded &&
                    (isValidRepair(currentValues) || isValidDiscard(currentValues)))) &&
            hasTestOrAction(currentValues);

        setIsValid(val);
    };

    return [isValid, validateValues];
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
    return [location, setLocation];
};
