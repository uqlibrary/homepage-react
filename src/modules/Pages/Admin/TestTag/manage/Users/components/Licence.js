import React, { useEffect, useRef, useState } from 'react';

import locale from 'modules/Pages/Admin/TestTag/testTag.locale';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Lock, LockOpen } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import Alert from '@mui/material/Alert';
import PropTypes from 'prop-types';

const Licence = ({ data, row, ...props }) => {
    const isNew = data?.user_id === 'Auto';
    const canInspect = !!data?.can_inspect_cb;
    const required = canInspect;

    const initialValue = useRef(props.value);
    const [value, setValue] = useState(props.value);
    const [disabled, setDisabled] = useState(!canInspect);
    const [locked, setLocked] = useState(!isNew);

    const currentValue = value ?? props.value;
    const isDirty = initialValue.current !== currentValue;
    const helperText =
        required && props.error
            ? locale.pages.manage.users.helperText.user_licence_number
            : locale.pages.general.helperText.maxChars(45);

    // update value's local and parent state
    const handleChange = (newValue) => {
        console.log(newValue);
        setValue(newValue);
        props.onChange?.({
            target: {
                name: props.name,
                value: newValue,
            },
        });
    };

    // handles canInspect changes
    useEffect(() => {
        setDisabled(!canInspect);
        if (isNew) return;

        // revert licence changes to avoid undesired updates
        handleChange(initialValue.current);
        setLocked(true);
    }, [isNew, canInspect]);

    if (isNew || disabled) {
        return (
            <TextField
                {...props}
                variant="standard"
                disabled={disabled}
                required={required}
                inputProps={{ ...props.inputProps, maxLength: 45 }}
                helperText={helperText}
            />
        );
    }

    const toggleLock = () => {
        setLocked((prev) => {
            const next = !prev;

            if (next || isDirty) {
                // revert value if user locks the field again
                handleChange(initialValue.current);
            }

            return next;
        });
    };

    return (
        <TextField
            {...props}
            value={currentValue}
            onChange={(e) => handleChange(e.target.value)}
            variant="standard"
            disabled={locked}
            required={required}
            inputProps={{ ...props.inputProps, maxLength: 45 }}
            helperText={
                !props.error && !locked && isDirty ? (
                    <>
                        <div>{helperText}</div>
                        <Alert severity="warning">{locale.pages.manage.users.helperText.licence_update_warning}</Alert>
                    </>
                ) : (
                    helperText
                )
            }
            FormHelperTextProps={{ component: 'div' }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <Tooltip title={locked ? 'Click to update' : 'Click to revert changes'}>
                            <IconButton
                                data-testid={`${props.name}-${locked ? 'unlock' : 'lock'}-button`}
                                edge="end"
                                tabIndex={-1}
                                aria-label={locked ? 'Enable field' : 'Disable field'}
                                onClick={toggleLock}
                            >
                                {locked ? <Lock /> : <LockOpen />}
                            </IconButton>
                        </Tooltip>
                    </InputAdornment>
                ),
            }}
        />
    );
};

Licence.propTypes = {
    data: PropTypes.object,
    row: PropTypes.object,
    name: PropTypes.string,
    value: PropTypes.any,
    error: PropTypes.any,
    onChange: PropTypes.func,
    inputProps: PropTypes.object,
};

export default React.memo(Licence);
