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
                    helperText={locale.pages.general.helperText.maxChars(20)}
                />
            ),
            validate: value => isEmptyStr(value),
            fieldParams: { canEdit: true, canAdd: true },
        },
        user_name: {
            component: props => <TextField {...props} required />,
            validate: value => isEmptyStr(value),
            fieldParams: { canEdit: true, flex: 1 },
        },
        user_licence_number: {
            component: (props, data) => (
                <TextField
                    required={data?.can_inspect_cb}
                    {...props}
                    inputProps={{ ...props.inputProps, maxLength: 45 }}
                    helperText={locale.pages.general.helperText.maxChars(45)}
                />
            ),
            fieldParams: {
                canAdd: true,
                canEdit: false,
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
            fieldParams: { canEdit: false, renderInUpdate: false, renderInAdd: false },
        },
        can_admin_cb: {
            component: props => (
                <FormControlLabel
                    control={<Checkbox color="primary" checked={props.value} {...props} />}
                    label={'Admin'}
                />
            ),
            fieldParams: { canEdit: true, renderInTable: false, type: 'checkbox' },
        },
        can_inspect: {
            fieldParams: { canEdit: false, renderInUpdate: false, renderInAdd: false },
        },
        can_inspect_cb: {
            component: props => (
                <FormControlLabel
                    control={<Checkbox color="primary" checked={props.value} {...props} />}
                    label={'Inspect'}
                />
            ),
            fieldParams: { canEdit: true, renderInTable: false, type: 'checkbox' },
        },
        can_alter: {
            fieldParams: { canEdit: false, renderInUpdate: false, renderInAdd: false },
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
            fieldParams: { canEdit: false, renderInUpdate: false, renderInAdd: false },
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
            fieldParams: { canEdit: false, renderInUpdate: false, renderInAdd: false },
        },
        user_current_flag_cb: {
            component: props => (
                <FormControlLabel
                    control={<Checkbox color="primary" checked={props.value} {...props} />}
                    label={'Is Current'}
                />
            ),
            fieldParams: { canEdit: true, renderInTable: false, type: 'checkbox' },
        },
        actions_count: {
            fieldParams: { canEdit: false, canAdd: false, renderInUpdate: false, renderInAdd: false, minWidth: 110 },
        },
    },
};
