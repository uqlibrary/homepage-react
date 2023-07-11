import React from 'react';

// import TextField from '@material-ui/core/TextField';
import DebouncedTextField from '../../../SharedComponents/DebouncedTextField/DebouncedTextField';
import { isEmptyStr } from '../../../helpers/helpers';

export default {
    fields: {
        asset_type_id: {
            fieldParams: { canEdit: false, renderInTable: false, renderInAdd: false, renderInUpdate: false },
        },
        asset_type_name: {
            component: props => <DebouncedTextField {...props} required />,
            validate: value => isEmptyStr(value), // should return true if a validation error exists
            fieldParams: { canEdit: true, flex: 1 },
        },
        asset_type_class: {
            component: props => <DebouncedTextField {...props} />,
            fieldParams: { canEdit: true, flex: 1 },
        },
        asset_type_power_rating: {
            component: props => <DebouncedTextField {...props} />,
            fieldParams: { canEdit: true, flex: 1 },
        },
        asset_type: {
            component: props => <DebouncedTextField {...props} />,
            fieldParams: { canEdit: true, flex: 1 },
        },
        asset_type_notes: {
            component: props => <DebouncedTextField multiline minRows={3} {...props} />,
            fieldParams: { canEdit: true, flex: 1 },
        },
        asset_count: {
            fieldParams: { canEdit: false, renderInAdd: false, renderInUpdate: false, flex: 1 },
        },
    },
};
