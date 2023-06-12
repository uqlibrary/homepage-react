import React from 'react';

import TextField from '@material-ui/core/TextField';

import { isEmptyStr } from '../../../helpers/helpers';

export default {
    fields: {
        site_id: {
            fieldParams: { canEdit: false },
        },
        site_name: {
            component: props => <TextField {...props} required />,
            validate: value => isEmptyStr(value), // should return true if a validation error exists
            fieldParams: { canEdit: true, flex: 1 },
        },
        site_id_displayed: {
            component: props => <TextField {...props} inputProps={{ ...props.inputProps, maxLength: 10 }} required />,
            validate: value => isEmptyStr(value), // should return true if a validation error exists
            fieldParams: { canEdit: true, flex: 1 },
        },
        asset_count: {
            fieldParams: { canEdit: false, renderInAdd: false, renderInUpdate: false },
        },
    },
};
