import React from 'react';

import TextField from '@material-ui/core/TextField';

import { isEmptyStr } from '../../../helpers/helpers';

export default {
    fields: {
        asset_type_id: {
            label: 'Id',
            fieldParams: { canEdit: false },
        },
        asset_type_name: {
            label: 'Asset Type Name',
            component: props => <TextField {...props} required />,
            validate: value => isEmptyStr(value), // should return true if a validation error exists
            fieldParams: { canEdit: true, flex: 1 },
        },
        asset_type_class: {
            label: 'Class',
            component: props => <TextField {...props} />,
            fieldParams: { canEdit: true, flex: 1 },
        },
        asset_type_power_rating: {
            label: 'Power Rating',
            component: props => <TextField {...props} />,
            fieldParams: { canEdit: true, flex: 1 },
        },
        asset_type: {
            label: 'Type',
            component: props => <TextField {...props} />,
            fieldParams: { canEdit: true, flex: 1 },
        },
        asset_type_notes: {
            label: 'Notes',
            component: props => <TextField multiline minRows={3} {...props} />,
            fieldParams: { canEdit: true, flex: 1 },
        },
        asset_count: {
            label: 'Usage',
            fieldParams: { canEdit: false, renderInAdd: false, renderInUpdate: false, flex: 1 },
        },
    },
};
