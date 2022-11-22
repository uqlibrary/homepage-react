import { useCallback, useState } from 'react';

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
        [formValues, defaultDateFormat],
    );

    const resetFormValues = newFormValues => {
        const newValues = { ...formValues, ...newFormValues };
        console.log('resetFormValues', { ...newValues });
        setFormValues(newValues);
    };

    return [formValues, resetFormValues, handleChange];
};
