import React from 'react';

import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { isEmptyStr } from '../../../helpers/helpers';

export default {
    fields: {
        user_id: {
            label: 'ID',
            fieldParams: { canEdit: false },
        },
        user_uid: {
            label: 'UUID',
            // component: props => <TextField {...props} required />,
            // validate: value => isEmptyStr(value), // should return true if a validation error exists
            fieldParams: { canEdit: false },
        },
        user_name: {
            label: 'Name',
            component: props => <TextField {...props} />,
            fieldParams: { canEdit: true, flex: 1 },
        },
        can_admin: {
            label: 'Admin',
            isBoolean: true,
            component: props => (
                <FormControlLabel control={<Checkbox checked={props.value === 'Yes'} {...props} />} label={'Admin'} />
            ),
            fieldParams: { canEdit: true },
        },
        can_inspect: {
            label: 'Inspect',
            isBoolean: true,
            component: props => (
                <FormControlLabel control={<Checkbox checked={props.value === 'Yes'} {...props} />} label={'Inspect'} />
            ),
            fieldParams: { canEdit: true },
        },
        can_alter: {
            label: 'Alter',
            isBoolean: true,
            component: props => (
                <FormControlLabel control={<Checkbox checked={props.value === 'Yes'} {...props} />} label={'Alter'} />
            ),
            fieldParams: { canEdit: true },
        },
        can_see_reports: {
            label: 'Report',
            isBoolean: true,
            component: props => (
                <FormControlLabel control={<Checkbox checked={props.value === 'Yes'} {...props} />} label={'Report'} />
            ),
            fieldParams: { canEdit: true },
        },
    },
};
