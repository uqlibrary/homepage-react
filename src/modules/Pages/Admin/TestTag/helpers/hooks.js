import { useState } from 'react';

const moment = require('moment');

export const useLocation = (defaultSiteId = -1, defaultBuildingId = -1, defaultFloorId = -1, defaultRoomId = -1) => {
    const [location, _setLocation] = useState({
        site: defaultSiteId,
        building: defaultBuildingId,
        floor: defaultFloorId,
        room: defaultRoomId,
    });

    const setLocation = update => {
        _setLocation({ ...location, ...update });
    };
    return { location, setLocation };
};
export const useForm = (
    /* istanbul ignore next */ { defaultValues = {}, defaultDateFormat = 'YYYY-MM-DD HH:mm' } = {},
) => {
    const [formValues, setFormValues] = useState({ ...defaultValues });

    const handleChange = prop => event => {
        console.log({ prop, event });
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

export const useObjectList = (list = [], transform) => {
    const [data, _setData] = useState(!!transform ? transform(list) : list);

    console.log('useObjectlist', data);
    const setData = data => _setData(!!transform ? transform(data) : data);

    const addAt = (index, item) => {
        if (!Array.isArray(item) && typeof item !== 'object') return;
        setData([...data.slice(0, index), ...item, ...data.slice(index)].flat());
    };

    const addStart = item => {
        addAt(0, item);
    };

    const addEnd = item => {
        addAt(data.length, item);
    };

    const deleteAt = index => {
        _setData([...data.slice(0, index), ...(index <= data.length - 1 ? data.slice(index + 1) : [])]);
    };

    const deleteWith = (key, value) => {
        const index = data.findIndex(item => item[key] === value);
        index > -1 && deleteAt(index);
    };

    const clear = () => {
        _setData([]);
    };

    return { data, addAt, addStart, addEnd, deleteAt, deleteWith, clear };
};
