import { useCallback, useState } from 'react';
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

    const handleChange = useCallback(
        prop => event => {
            let propValue = event?.target?.value ?? event;
            // if (!!!propValue) return;
            if (prop.indexOf('date') > -1) {
                propValue = moment(event)
                    .format(defaultDateFormat)
                    .toString();
            }

            const propArray = prop.split('.');
            const newFormValues = {
                ...formValues,
                // adapted from https://stackoverflow.com/a/52077261
                // only works for 1 level deep objects i.e. {a:{b:'ok',c:{d:'wont work'}}}
                ...propArray.reduceRight((res, key, idx) => {
                    let retval;
                    if (idx === propArray.length - 1) {
                        retval = { [key]: propValue };
                    } else if (idx === 0) {
                        retval = { [key]: { ...(formValues[key] ?? {}), ...res } };
                    } else retval = { [key]: res };
                    return retval;
                }, {}),
            };
            setFormValues({ ...newFormValues });
            console.log('handleChange', newFormValues);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [defaultDateFormat, formValues],
    );

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
            isValidInspection(currentValues.with_inspection, testStatusEnum) &&
            ((!!!currentValues.with_repair.isRepair && !!!currentValues.with_discarded.isDiscarded) ||
                (!!currentValues.with_repair.isRepair !== !!currentValues.with_discarded.isDiscarded &&
                    (isValidRepair(currentValues.with_repair) || isValidDiscard(currentValues.with_discarded)))) &&
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
