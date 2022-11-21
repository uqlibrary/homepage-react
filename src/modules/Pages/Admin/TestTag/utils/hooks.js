import { useCallback, useState } from 'react';

const moment = require('moment');

export const useForm = ({ defaultValues = {}, defaultDateFormat = 'YYYY-MM-DD HH:MM' } = {}) => {
    const [formValues, setFormValues] = useState({ ...defaultValues });

    const handleChange = useCallback(
        prop => event => {
            console.log('handleChange args', prop, event);
            let propValue = event?.target?.value ?? event;
            console.log('propValue', propValue);
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
                        // console.log('propValue', propValue);
                        retval = { [key]: propValue };
                    } else if (idx === 0) {
                        // console.log('currrentkey', formValues[key]);
                        retval = { [key]: { ...(formValues[key] ?? {}), ...res } };
                    } else retval = { [key]: res };
                    // console.log('res', res);
                    // console.log('key', key);
                    // console.log('idx', idx);
                    // console.log('retval', retval);
                    return retval;
                }, {}),
            };
            setFormValues({ ...newFormValues });
            console.log('handleChange', newFormValues);
            // setSelectedAsset({
            //     ...selectedAsset,
            //     ...propArray.reduceRight(
            //         (res, key, idx) => (idx === propArray.length - 1 ? { [key]: propValue } : { [key]: res }),
            //         {},
            //     ),
            // });
        },
        [formValues, defaultDateFormat],
    );

    const resetFormValues = newFormValues => {
        const newValues = { ...formValues, ...newFormValues };
        console.log('resetFormValues', { ...newValues });
        setFormValues(newValues);
    };

    return [formValues, resetFormValues, handleChange];
};
