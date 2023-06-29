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
            isClicked: true,
            // component: props => <TextField {...props} />,
            component: props => {
                console.log('TEST', props);
                return <FormControlLabel control={<Checkbox checked={props.value === 'Yes'} />} label={'Admin'} />;
            },
            fieldParams: { canEdit: true },
        },
        can_inspect: {
            label: 'Inspect',
            component: props => <TextField {...props} />,
            fieldParams: { canEdit: true },
        },
        can_alter: {
            label: 'Alter',
            component: props => <TextField {...props} />,
            fieldParams: { canEdit: true },
        },
        can_see_reports: {
            label: 'Report',
            component: props => <TextField {...props} />,
            fieldParams: { canEdit: true },
        },
    },
};
