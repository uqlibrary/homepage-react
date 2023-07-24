import React from 'react';

import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { isEmptyStr, isInvalidUUID } from '../../../helpers/helpers';

import locale from '../../../testTag.locale';

export default {
    fields: {
        user_uid: {
            label: 'UUID',
            component: props => (
                <TextField
                    {...props}
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
            fieldParams: { canEdit: true, sortable: false, canAdd: true },
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
            fieldParams: { canEdit: true, sortable: false, flex: 1 },
        },
        can_inspect_cb: {
            component: props => (
                <FormControlLabel
                    control={
                        <Checkbox
                            color="primary"
                            checked={props.value}
                            helperText={
                                props.error
                                    ? locale.pages.manage.users.helperText.user_uid
                                    : locale.pages.general.helperText.maxChars(20)
                            }
                            {...props}
                        />
                    }
                    label={'Inspect'}
                />
            ),
            fieldParams: { canEdit: true, sortable: false, renderInTable: false, type: 'checkbox' },
            validate: (value, row) => {
                return isEmptyStr(row.user_licence_number) && value;
            },
        },
        user_licence_number: {
            component: (props, data) => {
                return (
                    <TextField
                        required={data?.can_inspect_cb}
                        disabled={!data?.can_inspect_cb}
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
                canEdit: false,
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
            fieldParams: { canEdit: false, sortable: false, renderInUpdate: false, renderInAdd: false },
        },
        can_admin_cb: {
            component: props => (
                <FormControlLabel
                    control={<Checkbox color="primary" checked={props.value} {...props} />}
                    label={'Admin'}
                />
            ),
            fieldParams: { canEdit: true, sortable: false, renderInTable: false, type: 'checkbox' },
        },
        can_inspect: {
            fieldParams: { canEdit: false, sortable: false, renderInUpdate: false, renderInAdd: false },
        },
        can_alter: {
            fieldParams: { canEdit: false, sortable: false, renderInUpdate: false, renderInAdd: false },
        },
        can_alter_cb: {
            component: props => (
                <FormControlLabel
                    control={<Checkbox color="primary" checked={props.value} {...props} />}
                    label={'Alter'}
                />
            ),
            fieldParams: { canEdit: true, sortable: false, renderInTable: false, type: 'checkbox' },
        },
        can_see_reports: {
            fieldParams: { canEdit: false, sortable: false, renderInUpdate: false, renderInAdd: false },
        },
        can_see_reports_cb: {
            component: props => (
                <FormControlLabel
                    control={<Checkbox color="primary" checked={props.value} {...props} />}
                    label={'Report'}
                />
            ),
            fieldParams: { canEdit: true, sortable: false, renderInTable: false, type: 'checkbox' },
        },
        user_current_flag: {
            fieldParams: { canEdit: false, sortable: false, renderInUpdate: false, renderInAdd: false },
        },
        user_current_flag_cb: {
            component: props => (
                <FormControlLabel
                    control={<Checkbox color="primary" checked={props.value} {...props} />}
                    label={'Is Current'}
                />
            ),
            fieldParams: { canEdit: true, sortable: false, renderInTable: false, type: 'checkbox' },
        },
        actions_count: {
            fieldParams: {
                canEdit: false,
                sortable: false,
                canAdd: false,
                renderInUpdate: false,
                renderInAdd: false,
                minWidth: 110,
            },
        },
    },
};
