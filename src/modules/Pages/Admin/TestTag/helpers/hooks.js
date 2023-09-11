import { useState, useEffect } from 'react';

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
        let propValue = event?.target?.value ?? event;
        if (prop.indexOf('date') > -1) {
            // console.log('handleChange thinks this is a date', prop, prop.indexOf('date'), propValue);
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

export const useObjectList = (list = [], transform, options = {}) => {
    const [data, _setData] = useState(!!transform ? transform(list) : list);
    const [_options] = useState({ key: 'id', ...options });

    // use setData (no _) to transform data before updating state
    const setData = data => _setData(!!transform ? transform(data) : data);

    const addAt = (index, item) => {
        // Note: Dupes are not allowed
        /* istanbul ignore else */
        if (Array.isArray(item)) {
            const ids = new Set(data.map(d => d[_options.key]));
            setData([...data, ...item.filter(d => !ids.has(d[_options.key]))]);
        } else {
            /* istanbul ignore else */ if (typeof item === 'object') {
                /* istanbul ignore else */ if (data.findIndex(d => d[_options.key] === item[_options.key]) >= 0) return;
                setData([...data.slice(0, index), { ...item }, ...data.slice(index)].flat());
            }
        }
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

export const useConfirmationAlert = ({ duration, onClose = null, errorMessage = null, errorMessageFormatter }) => {
    const [confirmationAlert, setConfirmationAlert] = useState({ message: '', visible: false });

    const closeConfirmationAlert = () => {
        setConfirmationAlert({ message: '', visible: false, type: confirmationAlert.type });
        onClose?.();
    };
    const openConfirmationAlert = (message, type) => {
        setConfirmationAlert({
            message: message,
            visible: true,
            type: !!type ? type : 'info',
            autoHideDuration: duration,
        });
    };

    useEffect(() => {
        if (!!errorMessage) {
            openConfirmationAlert(
                !!errorMessageFormatter ? errorMessageFormatter(errorMessage) : errorMessage,
                'error',
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errorMessage]);

    return { confirmationAlert, openConfirmationAlert, closeConfirmationAlert };
};
