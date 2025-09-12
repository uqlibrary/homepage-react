import React from 'react';

import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import { isEmptyStr, isInvalidUUID } from '../../../helpers/helpers';

import locale from '../../../testTag.locale';

export default {
    sort: {
        defaultSortColumn: 'user_uid',
    },
    fields: {
        user_uid: {
            label: locale.pages.manage.users.form.columns.user_uid.label,
            component: (props, data) => (
                <TextField
                    variant="standard"
                    {...props}
                    disabled={data?.isSelf}
                    required
                    inputProps={{ ...props.inputProps, maxLength: 20 }}
                    helperText={
                        props.error
                            ? locale.pages.manage.users.helperText.user_uid
                            : locale.pages.general.helperText.maxChars(20)
                    }
                />
            ),
            validate: value => isEmptyStr(value) || isInvalidUUID(value),
            fieldParams: { canEdit: true, canAdd: true, minWidth: 120 },
        },
        user_name: {
            component: props => (
                <TextField
                    variant="standard"
                    {...props}
                    required
                    helperText={props.error ? locale.pages.manage.users.helperText.user_name : null}
                />
            ),
            validate: value => isEmptyStr(value),
            fieldParams: { canEdit: true, minWidth: 200, flex: 1 },
        },
        can_inspect_cb: {
            component: props => {
                return (
                    <FormControlLabel
                        control={<Checkbox color="primary" checked={props.value} {...props} />}
                        label={locale.pages.manage.users.form.columns.can_inspect_cb.label}
                    />
                );
            },
            fieldParams: { canEdit: true, renderInTable: false, type: 'checkbox' },
            validate: (value, row) => {
                return isEmptyStr(row.user_licence_number) && value;
            },
        },
        user_licence_number: {
            component: (props, data, row) => {
                return (
                    <TextField
                        variant="standard"
                        required={data?.can_inspect_cb}
                        disabled={
                            !data?.can_inspect_cb || (data?.can_inspect_cb && !isEmptyStr(row?.user_licence_number))
                        }
                        {...props}
                        inputProps={{ ...props.inputProps, maxLength: 45 }}
                        helperText={
                            props.error
                                ? locale.pages.manage.users.helperText.user_licence_number
                                : locale.pages.general.helperText.maxChars(45)
                        }
                    />
                );
            },

            fieldParams: {
                canAdd: true,
                canEdit: true,
                sortable: false,
                renderInUpdate: true,
                renderInAdd: true,
                renderInTable: false,
                renderFullWidth: true,
                maxLength: 45,
            },
            validate: (value, row) => {
                return row?.can_inspect_cb && isEmptyStr(value);
            },
        },
        can_admin: {
            fieldParams: { canEdit: false, renderInUpdate: false, renderInAdd: false, minWidth: 110 },
        },
        can_admin_cb: {
            component: (props, data, row) => {
                return (
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="primary"
                                disabled={row?.can_admin_cb && data?.isSelf}
                                checked={props.value}
                                {...props}
                            />
                        }
                        label={locale.pages.manage.users.form.columns.can_admin_cb.label}
                    />
                );
            },
            fieldParams: { canEdit: true, renderInTable: false, type: 'checkbox' },
        },
        can_inspect: {
            fieldParams: { canEdit: false, renderInUpdate: false, renderInAdd: false, minWidth: 115 },
        },
        can_alter: {
            fieldParams: { canEdit: false, renderInUpdate: false, renderInAdd: false, minWidth: 95 },
        },
        can_alter_cb: {
            component: props => (
                <FormControlLabel
                    control={<Checkbox color="primary" checked={props.value} {...props} />}
                    label={locale.pages.manage.users.form.columns.can_alter_cb.label}
                />
            ),
            fieldParams: { canEdit: true, renderInTable: false, type: 'checkbox' },
        },
        can_see_reports: {
            fieldParams: { canEdit: false, renderInUpdate: false, renderInAdd: false, minWidth: 110 },
        },
        can_see_reports_cb: {
            component: props => (
                <FormControlLabel
                    control={<Checkbox color="primary" checked={props.value} {...props} />}
                    label={locale.pages.manage.users.form.columns.can_see_reports_cb.label}
                />
            ),
            fieldParams: { canEdit: true, renderInTable: false, type: 'checkbox' },
        },
        user_current_flag: {
            fieldParams: { canEdit: false, renderInUpdate: false, renderInAdd: false, minWidth: 115 },
        },
        user_current_flag_cb: {
            component: (props, data) => (
                <FormControlLabel
                    control={<Checkbox color="primary" disabled={data?.isSelf} checked={props.value} {...props} />}
                    label={locale.pages.manage.users.form.columns.user_current_flag_cb.label}
                />
            ),
            fieldParams: { canEdit: true, renderInTable: false, type: 'checkbox' },
        },
        actions_count: {
            fieldParams: {
                canEdit: false,
                canAdd: false,
                renderInUpdate: false,
                renderInAdd: false,
                minWidth: 130,
            },
        },
    },
};
