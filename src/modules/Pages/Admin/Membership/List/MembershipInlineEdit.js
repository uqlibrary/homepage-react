import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import TextField from 'modules/SharedComponents/Toolbox/TextField/components/TextField';

import { default as locale } from '../membershipAdmin.locale';

const strings = locale.list.inlineEdit;

/**
 * One field of an issued account that can be corrected where it stands - the expiry and the barcode.
 *
 * The value is pattern-checked here rather than only on save because the format is knowable without asking
 * the API, and catching a malformed value locally spares the admin a round trip to learn it.
 *
 * Accessibility: the icon-only trigger is named for the field and the row it belongs to ("Edit the barcode for
 * Mr Jane Smith"), since "Edit" repeated down a column names nothing. Focus moves into the input on open and
 * back to the trigger on cancel, so a keyboard user is never dropped at the top of the page (WCAG 2.4.3).
 */
export const MembershipInlineEdit = ({
    fieldId,
    field,
    label,
    placeholder,
    pattern,
    invalidMessage,
    value,
    name,
    editable,
    saving,
    onSave,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [draft, setDraft] = useState(value ?? '');
    const [touched, setTouched] = useState(false);
    const [returningFocus, setReturningFocus] = useState(false);
    const triggerRef = useRef(null);
    const inputRef = useRef(null);

    // Reopening starts from what is stored now, not from whatever was typed and abandoned last time.
    useEffect(() => {
        if (isOpen) {
            setDraft(value ?? '');
            setTouched(false);
            inputRef.current?.focus();
        }
    }, [isOpen, value]);

    // Focus can only go back to the trigger once the trigger is on the page again, which is a render away
    // from the click that closed the editor - focusing during the click drops the keyboard user on <body>.
    useEffect(() => {
        if (!isOpen && returningFocus) {
            triggerRef.current?.focus();
            setReturningFocus(false);
        }
    }, [isOpen, returningFocus]);

    const close = () => {
        setReturningFocus(true);
        setIsOpen(false);
    };

    const isValid = pattern.test(draft);
    const error = touched && !isValid ? invalidMessage : undefined;

    if (!isOpen) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                <Typography component="span" variant="body2" data-testid={`${fieldId}-value`}>
                    {value || locale.list.row.notSet}
                </Typography>
                {!!editable && (
                    <IconButton
                        ref={triggerRef}
                        size="small"
                        data-testid={`${fieldId}-edit-button`}
                        aria-label={value ? strings.edit(field, name) : strings.add(field, name)}
                        onClick={() => setIsOpen(true)}
                    >
                        {value ? <EditIcon fontSize="inherit" /> : <AddIcon fontSize="inherit" />}
                    </IconButton>
                )}
            </Box>
        );
    }

    return (
        <Box>
            <TextField
                textFieldId={fieldId}
                inputRef={inputRef}
                label={label}
                ariaLabel={`${label} for ${name}`}
                placeholder={placeholder}
                value={draft}
                errorText={error}
                disabled={!!saving}
                onChange={event => setDraft(event.target.value)}
                onBlur={() => setTouched(true)}
            />
            <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
                <Button
                    size="small"
                    variant="contained"
                    disableElevation
                    data-testid={`${fieldId}-save-button`}
                    disabled={!isValid || !!saving}
                    onClick={() => {
                        setIsOpen(false);
                        onSave(draft);
                    }}
                >
                    {saving ? strings.saving : strings.save}
                </Button>
                <Button
                    size="small"
                    data-testid={`${fieldId}-cancel-button`}
                    aria-label={strings.cancelLabel(field, name)}
                    // Cancelling should not first blur the input: a blur flags the field as touched, which
                    // renders the validation message, which grows the field and shifts this button out from
                    // under the pointer - so the cancel click would miss and the admin would have to click
                    // again. Holding focus on the input keeps the layout still, and the click lands first time.
                    onMouseDown={event => event.preventDefault()}
                    onClick={close}
                >
                    {strings.cancel}
                </Button>
            </Box>
        </Box>
    );
};

MembershipInlineEdit.propTypes = {
    fieldId: PropTypes.string.isRequired,
    // The field named in the controls' accessible names, e.g. "barcode".
    field: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    pattern: PropTypes.instanceOf(RegExp).isRequired,
    invalidMessage: PropTypes.string.isRequired,
    value: PropTypes.string,
    name: PropTypes.string.isRequired,
    editable: PropTypes.bool,
    saving: PropTypes.bool,
    onSave: PropTypes.func.isRequired,
};

export default MembershipInlineEdit;
