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
            fieldParams: {
                minWidth: 150,
                canEdit: true,
                sortable: false,
                flex: 1,
            },
        },
        asset_type_class: {
            component: props => <TextField {...props} />,
            fieldParams: {
                minWidth: 100,
                canEdit: true,
                sortable: false,
            },
        },
        asset_type_power_rating: {
            component: props => <TextField {...props} />,
            fieldParams: {
                minWidth: 150,
                canEdit: true,
                sortable: false,
            },
        },
        asset_type: {
            component: props => <TextField {...props} />,
            fieldParams: {
                minWidth: 150,
                canEdit: true,
                sortable: false,
            },
        },
        asset_type_notes: {
            component: props => <TextField multiline minRows={3} {...props} />,
            fieldParams: {
                minWidth: 200,
                canEdit: true,
                sortable: false,
            },
        },
        asset_count: {
            fieldParams: {
                minWidth: 100,
                canEdit: false,
                sortable: false,
                renderInAdd: false,
                renderInUpdate: false,
            },
        },
    },
};
