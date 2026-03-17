import React, { useRef, useState } from 'react';

import locale from 'modules/Pages/Admin/TestTag/testTag.locale';
import TextField from '@mui/material/TextField';
import { isEmptyStr } from '../../../helpers/helpers';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Lock, LockOpen } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import Alert from '@mui/material/Alert';
import PropTypes from 'prop-types';

const Licence = ({ data, row, ...props }) => {
    const isNew = data?.user_id === 'Auto';
    const initialValue = useRef(props.value);
    const [value, setValue] = useState(props.value);
    const [disabled, setDisabled] = useState(
        !isNew && (!data?.can_inspect_cb || !isEmptyStr(row?.user_licence_number)),
    );
    const currentValue = value ?? props.value;
    const isDirty = initialValue.current !== currentValue;
    const required = !!data?.can_inspect_cb;
    const helperText =
        required && props.error
            ? locale.pages.manage.users.helperText.user_licence_number
            : locale.pages.general.helperText.maxChars(45);

    if (isNew) {
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

    const handleChange = e => {
        const newValue = e.target.value;

        setValue(newValue);
        props.onChange?.({
            target: {
                name: props.name,
                value: newValue,
            },
        });
    };

    const toggleDisabled = () => {
        setDisabled(prev => {
            const next = !prev;
            if (!next || !isDirty) return next;

            // revert value if user locks the field again
            setValue(initialValue.current);
            props.onChange?.({
                target: {
                    name: props.name,
                    value: initialValue.current,
                },
            });
            return next;
        });
    };

    return (
        <TextField
            {...props}
            value={currentValue}
            onChange={handleChange}
            variant="standard"
            disabled={disabled}
            required={required}
            inputProps={{ ...props.inputProps, maxLength: 45 }}
            helperText={
                !props.error && !disabled && isDirty ? (
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
                        <Tooltip title={disabled ? 'Click to update' : 'Click to revert changes'}>
                            <IconButton
                                data-testid={`${props.name}-${disabled ? 'enable' : 'disable'}-button`}
                                edge="end"
                                tabIndex={-1}
                                aria-label={disabled ? 'Enable field' : 'Disable field'}
                                onClick={toggleDisabled}
                            >
                                {disabled ? <Lock /> : <LockOpen />}
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
