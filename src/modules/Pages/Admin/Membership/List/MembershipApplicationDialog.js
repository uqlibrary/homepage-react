import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';

import { Field, useForm } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';
import { required, email as emailValidator } from 'helpers/validation';

import { getFieldConfig, getFieldOptions, isSelectField } from 'modules/Pages/Membership/membershipFormFields';
import { phone as phoneValidator, postcode as postcodeValidator } from 'modules/Pages/Membership/membershipValidation';
import {
    formatDate,
    formatDateTime,
    fullName,
    hasFailedPayment,
    hasReceipt,
    statusText,
} from './MembershipApplicationCard';
import { default as locale } from '../membershipAdmin.locale';

const strings = locale.list.viewDialog;

// The applicant's identity, contact and address - the fields an admin corrects here. Everything else on the
// record is shown for context but not editable from this view.
export const EDITABLE_FIELDS = [
    'title',
    'first_name',
    'sn',
    'mail',
    'phone',
    'home_address_0',
    'home_address_1',
    'home_address_city',
    'home_address_state',
    'home_address_postcode',
    'home_address_country',
];

// How each editable field is checked. A name and an email are expected; the rest are corrections an admin can
// leave blank. The server checks these again and rejects with its own field messages, so this only catches the
// obvious before a round trip.
export const FIELD_VALIDATORS = {
    first_name: [required],
    sn: [required],
    mail: [required, emailValidator],
    phone: [phoneValidator],
    home_address_postcode: [postcodeValidator],
};

// Pull just the editable fields off a record, as the values the form starts from.
export const editableValues = membership =>
    EDITABLE_FIELDS.reduce((values, field) => ({ ...values, [field]: membership?.[field] ?? '' }), {});

/**
 * One read-only fact of the record, drawn as a term-and-definition pair so a screen reader reads "Status,
 * Confirmed" rather than two loose strings. A fact that was never recorded still shows, as empty-but-present.
 */
export const DetailRow = ({ label, children }) => (
    <>
        <Box component="dt" sx={{ typography: 'caption', color: 'text.secondary' }}>
            {label}
        </Box>
        <Box component="dd" sx={{ typography: 'body2', margin: 0 }}>
            {children || strings.details.none}
        </Box>
    </>
);

DetailRow.propTypes = { label: PropTypes.string, children: PropTypes.node };

/**
 * One editable field of the record, wired to react-hook-form. Its look and label come from the shared form
 * config, so it reads the same as the application form the applicant filled in.
 */
export const EditableField = ({ field, control, membershipFormData }) => {
    const config = getFieldConfig(field);
    const common = {
        name: field,
        control,
        validate: FIELD_VALIDATORS[field],
        label: config.label,
        required: (FIELD_VALIDATORS[field] ?? []).includes(required),
    };

    if (isSelectField(field)) {
        return (
            <Field
                {...common}
                component={SelectField}
                selectFieldId={field}
                options={getFieldOptions(field, membershipFormData)}
                placeholder={config.placeholder}
            />
        );
    }

    return (
        <Field
            {...common}
            component={TextField}
            textFieldId={field}
            type={config.type ?? 'text'}
            placeholder={config.placeholder}
        />
    );
};

EditableField.propTypes = {
    field: PropTypes.string.isRequired,
    control: PropTypes.object.isRequired,
    membershipFormData: PropTypes.object,
};

// How a payment reads at a glance: a refusal in words, a payment that went through as "Paid", and nothing where
// none was ever taken.
export const paymentSummary = membership => {
    if (hasFailedPayment(membership)) {
        return strings.details.paymentFailed;
    }
    if (hasReceipt(membership) || membership?.payment_amount) {
        return strings.details.paid;
    }
    return '';
};

/**
 * The full record, opened from a card to read it whole and correct the applicant's contact details.
 *
 * The dialog traps focus while it is open and returns it to the control that opened it on close, so a keyboard
 * user is not dropped back at the top of the queue (WCAG 2.4.3). It stays mounted across a close so that return
 * happens; the record it last showed is held locally to render through the closing frame.
 */
export const MembershipApplicationDialog = ({
    membership,
    membershipFormData,
    typeTitles,
    open,
    saving,
    onSave,
    onClose,
}) => {
    // The record last shown, kept so the dialog still has something to draw as it closes and control returns.
    const [record, setRecord] = useState(membership);
    const { control, formState, handleSubmit, reset } = useForm();

    useEffect(() => {
        if (membership) {
            setRecord(membership);
            reset(editableValues(membership));
        }
    }, [membership, reset]);

    const name = fullName(record);
    const titleId = `${strings.dialogId}-title`;
    const hasPayment = !!record?.payment_response || hasReceipt(record) || !!record?.payment_amount;

    const submit = handleSubmit(values => onSave({ ...record, ...values }));

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby={titleId}
            maxWidth="sm"
            fullWidth
            // The caller returns focus to the control the dialog was opened from, once the page behind it is no
            // longer hidden, so the dialog does not also restore focus and land it on a still-hidden element.
            disableRestoreFocus
            data-testid={`dialogbox-${strings.dialogId}`}
        >
            <DialogTitle id={titleId} sx={{ paddingRight: 6 }}>
                {`${strings.title} — ${name}`}
                <IconButton
                    aria-label={strings.cancel}
                    onClick={onClose}
                    data-testid={`close-${strings.dialogId}`}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Typography component="h3" variant="subtitle2" sx={{ marginBottom: 1 }}>
                    {strings.detailsHeading}
                </Typography>
                <Box
                    component="dl"
                    data-testid={`${strings.dialogId}-details`}
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        columnGap: 2,
                        rowGap: 0.5,
                        margin: 0,
                    }}
                >
                    <DetailRow label={strings.details.type}>{typeTitles?.[record?.type] ?? record?.type}</DetailRow>
                    <DetailRow label={strings.details.status}>{statusText(record?.status)}</DetailRow>
                    <DetailRow label={strings.details.submitted}>
                        {record?.submitted_on && formatDateTime(record.submitted_on)}
                    </DetailRow>
                    <DetailRow label={strings.details.dateOfBirth}>
                        {record?.date_of_birth && formatDate(record.date_of_birth)}
                    </DetailRow>
                    <DetailRow label={strings.details.confirmed}>
                        {record?.confirmed_on && formatDate(record.confirmed_on)}
                    </DetailRow>
                    <DetailRow label={strings.details.expiry}>{record?.expires_on}</DetailRow>
                    <DetailRow label={strings.details.barcode}>{record?.barcode}</DetailRow>
                    {hasPayment && (
                        <>
                            <DetailRow label={strings.details.payment}>{paymentSummary(record)}</DetailRow>
                            <DetailRow label={strings.details.paymentAmount}>{record?.payment_amount}</DetailRow>
                            <DetailRow label={strings.details.paymentReceipt}>
                                {hasReceipt(record) && record.payment_receipt}
                            </DetailRow>
                        </>
                    )}
                </Box>

                <Divider sx={{ marginY: 2 }} />

                <Typography component="h3" variant="subtitle2" sx={{ marginBottom: 1 }}>
                    {strings.editHeading}
                </Typography>
                <Box
                    component="form"
                    onSubmit={submit}
                    data-testid={`${strings.dialogId}-form`}
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                        gap: 2,
                    }}
                >
                    {EDITABLE_FIELDS.map(field => (
                        <EditableField
                            key={field}
                            field={field}
                            control={control}
                            membershipFormData={membershipFormData}
                        />
                    ))}
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} data-testid={`cancel-${strings.dialogId}`}>
                    {strings.cancel}
                </Button>
                <Button
                    variant="contained"
                    disableElevation
                    onClick={submit}
                    disabled={!!saving || formState.hasValidationError}
                    data-testid={`save-${strings.dialogId}`}
                >
                    {saving ? strings.saving : strings.save}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

MembershipApplicationDialog.propTypes = {
    membership: PropTypes.object,
    membershipFormData: PropTypes.object,
    typeTitles: PropTypes.object,
    open: PropTypes.bool,
    saving: PropTypes.bool,
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default MembershipApplicationDialog;
