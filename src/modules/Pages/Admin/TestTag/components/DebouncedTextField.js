/* istanbul ignore file */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'throttle-debounce';
import TextField from '@material-ui/core/TextField';

const DEBOUNCE_INTERVAL = 750;

const DebouncedTextField = ({ handleChange, updateKey, value, interval = DEBOUNCE_INTERVAL, ...rest } = {}) => {
    const debounceText = React.useRef(debounce(interval, (e, key) => handleChange(key)(e))).current;
    const [internalValue, setInternalValue] = useState(value ?? '');

    const debounceChange = useCallback(e => {
        setInternalValue(e.target.value);
        debounceText(e, updateKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (internalValue !== value) {
            // form being reset
            setInternalValue(value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return <TextField onChange={debounceChange} value={internalValue} {...rest} />;
};

DebouncedTextField.propTypes = {
    handleChange: PropTypes.func.isRequired,
    updateKey: PropTypes.string.isRequired,
    value: PropTypes.string,
    interval: PropTypes.number,
};
export default React.memo(DebouncedTextField);
