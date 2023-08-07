import React from 'react';

import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { isEmptyStr, isInvalidUUID } from '../../../helpers/helpers';

import locale from '../../../testTag.locale';

export default {
    sort: {
        defaultSortColumn: 'user_uid',
    },
    fields: {
        user_uid: {
            label: 'User ID',
            component: (props, data) => (
                <TextField
                    {...props}
                    disabled={data?.isSelf}
                    required
                    inputProps={{ ...props.inputProps, maxLength: 15 }}
                    helperText={
                        props.error
                            ? locale.pages.manage.users.helperText.user_uid
                            : locale.pages.general.helperText.maxChars(15)
                    }
                />
            ),
            validate: value => isEmptyStr(value) || isInvalidUUID(value),
            fieldParams: { canEdit: true, canAdd: true, minWidth: 120 },
        },
        user_name: {
            component: props => (
                <TextField
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
                const errorStyle = props.error ? { color: 'red' } : { color: 'primary' };
                return (
                    <FormControlLabel
                        control={<Checkbox {...errorStyle} color="primary" checked={props.value} {...props} />}
                        label={'Inspect'}
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
                        label={'Admin'}
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
                    label={'Alter'}
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
                    label={'Report'}
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
                    label={'Is Current'}
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
