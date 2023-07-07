import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'throttle-debounce';
import TextField from '@material-ui/core/TextField';

const rootId = 'debounced_text_field';
const DEBOUNCE_INTERVAL = 250;

const DebouncedTextField = ({ id, onChange, value, interval = DEBOUNCE_INTERVAL, ...rest }) => {
    const componentId = `${rootId}-${id}`;
    const debounceText = useRef(debounce(interval, e => onChange(e))).current;
    const [internalValue, setInternalValue] = useState(value ?? '');

    const debounceChange = useCallback(e => {
        setInternalValue(e.target.value);
        debounceText(e);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (internalValue !== value) {
            // form being reset
            setInternalValue(value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <TextField
            onChange={debounceChange}
            value={internalValue}
            id={`${componentId}-input`}
            InputLabelProps={{ htmlFor: `${componentId}-input` }}
            inputProps={{
                'data-testid': `${componentId}-input`,
            }}
            {...rest}
        />
    );
};

DebouncedTextField.propTypes = {
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    interval: PropTypes.number,
};
export default React.memo(DebouncedTextField);
