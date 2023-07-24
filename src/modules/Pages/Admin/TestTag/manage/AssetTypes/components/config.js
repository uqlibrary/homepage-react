import React from 'react';

import TextField from '@material-ui/core/TextField';
import { isEmptyStr } from '../../../helpers/helpers';

export default {
    fields: {
        asset_type_id: {
            fieldParams: {
                canEdit: false,
                sortable: false,
                renderInTable: false,
                renderInAdd: false,
                renderInUpdate: false,
            },
        },
        asset_type_name: {
            component: props => <TextField {...props} required />,
            validate: value => isEmptyStr(value), // should return true if a validation error exists
            fieldParams: { canEdit: true, sortable: false, flex: 1 },
        },
        asset_type_class: {
            component: props => <TextField {...props} />,
            fieldParams: { canEdit: true, sortable: false, flex: 1 },
        },
        asset_type_power_rating: {
            component: props => <TextField {...props} />,
            fieldParams: { canEdit: true, sortable: false, flex: 1 },
        },
        asset_type: {
            component: props => <TextField {...props} />,
            fieldParams: { canEdit: true, sortable: false, flex: 1 },
        },
        asset_type_notes: {
            component: props => <TextField multiline minRows={3} {...props} />,
            fieldParams: { canEdit: true, sortable: false, flex: 1 },
        },
        asset_count: {
            fieldParams: { canEdit: false, sortable: false, renderInAdd: false, renderInUpdate: false, flex: 1 },
        },
    },
};
