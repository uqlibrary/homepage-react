import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'throttle-debounce';
import TextField from '@material-ui/core/TextField';

const rootId = 'debounced_text_field';
const DEBOUNCE_INTERVAL = 250;

const DebouncedTextField = ({ id, handleChange, updateKey, value, interval = DEBOUNCE_INTERVAL, ...rest }) => {
    const componentId = `${rootId}-${id}`;
    const debounceText = React.useRef(debounce(interval, (e, key) => handleChange(key)(e))).current;
    const [internalValue, setInternalValue] = React.useState(value ?? '');

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
    handleChange: PropTypes.func.isRequired,
    updateKey: PropTypes.string.isRequired,
    value: PropTypes.string,
    interval: PropTypes.number,
};
export default React.memo(DebouncedTextField);
