import React from 'react';

import TextField from '@material-ui/core/TextField';
import { isEmptyStr } from '../../../helpers/helpers';

export default {
    sort: {
        defaultSortColumn: 'asset_type_name',
    },
    fields: {
        asset_type_id: {
            fieldParams: {
                canEdit: false,

                renderInTable: false,
                renderInAdd: false,
                renderInUpdate: false,
            },
        },
        asset_type_name: {
            component: props => <TextField {...props} required />,
            validate: value => isEmptyStr(value), // should return true if a validation error exists
            fieldParams: {
                minWidth: 180,
                canEdit: true,

                flex: 1,
            },
        },
        asset_type_class: {
            component: props => <TextField {...props} />,
            fieldParams: {
                minWidth: 100,
                canEdit: true,
            },
        },
        asset_type_power_rating: {
            component: props => <TextField {...props} />,
            fieldParams: {
                minWidth: 150,
                canEdit: true,
            },
        },
        asset_type: {
            component: props => <TextField {...props} />,
            fieldParams: {
                minWidth: 150,
                canEdit: true,
            },
        },
        asset_type_notes: {
            component: props => <TextField multiline minRows={3} {...props} />,
            fieldParams: {
                minWidth: 200,
                canEdit: true,
                flex: 1,
            },
        },
        asset_count: {
            fieldParams: {
                minWidth: 120,
                canEdit: false,

                renderInAdd: false,
                renderInUpdate: false,
            },
        },
    },
};
