import React, { useEffect, useRef, useState } from 'react';

import locale from 'modules/Pages/Admin/TestTag/testTag.locale';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Lock, LockOpen } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import Alert from '@mui/material/Alert';
import PropTypes from 'prop-types';
import { isEmptyStr } from '../../../helpers/helpers';

const Licence = ({ data, onChange: parentOnChange, ...props }) => {
    const userId = data?.user_id;
    const isNew = userId === 'Auto';
    const canInspect = !!data?.can_inspect_cb;
    const required = canInspect;
    const helperText =
        required && props.error
            ? locale.pages.manage.users.helperText.user_licence_number
            : locale.pages.general.helperText.maxChars(45);

    const [value, setValue] = useState(props.value ?? '');
    const initialValue = useRef(props.value ?? '');
    const [disabled, setDisabled] = useState(!canInspect);
    const [locked, setLocked] = useState(!isNew);
    const [isDirty, setDirty] = useState(initialValue.current !== value);

    const onChange = newValue => {
        setDirty(newValue !== initialValue.current);
        setValue(newValue);
        parentOnChange({ target: { name: props.name, value: newValue } });
    };

    const toggleLock = () => setLocked(prev => !prev);

    // Handles user changes
    useEffect(() => {
        setValue(props.value ?? '');
        initialValue.current = props.value ?? '';
    }, [userId]);

    // Handles canInspect changes
    useEffect(() => {
        setDisabled(!canInspect);
        if (isNew) return;
        setLocked(true);
    }, [canInspect]);

    // Handles disable, lock changes
    useEffect(() => {
        if (isNew || !isDirty) return;
        // reset changes
        onChange(initialValue.current);
    }, [disabled, locked]);

    if (isNew || disabled || isEmptyStr(initialValue.current)) {
        return (
            <TextField
                {...props}
                onChange={e => onChange(e.target.value)}
                value={value}
                variant="standard"
                disabled={disabled}
                required={required}
                inputProps={{ ...props.inputProps, maxLength: 45 }}
                helperText={helperText}
            />
        );
    }

    return (
        <TextField
            {...props}
            onChange={e => onChange(e.target.value)}
            value={value}
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
    name: PropTypes.string,
    value: PropTypes.any,
    error: PropTypes.any,
    onChange: PropTypes.func,
    inputProps: PropTypes.object,
};

export default React.memo(Licence);
