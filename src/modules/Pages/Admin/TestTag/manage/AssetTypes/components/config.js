import React from 'react';

import TextField from '@material-ui/core/TextField';

import { isEmpty } from '../../../Inspection/utils/helpers';

export default {
    assettypes: {
        asset_type_id: {
            label: 'Id',
            fieldParams: { canEdit: false },
        },
        asset_type_name: {
            label: 'Asset Type Name',
            component: props => <TextField {...props} required />,
            validate: value => isEmpty(value), // should return true if a validation error exists
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
