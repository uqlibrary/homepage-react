import React from 'react';

import TextField from '@material-ui/core/TextField';

export default {
    fields: {
        asset_id: {
            fieldParams: { canEdit: false, renderInUpdate: false, renderInTable: false },
        },
        asset_id_displayed: {
            fieldParams: { canEdit: false, minWidth: 100 },
        },
        asset_type: { fieldParams: { canEdit: false, renderInUpdate: false, flex: 1 } },
        asset_status: { fieldParams: { canEdit: false, renderInUpdate: false, minWidth: 150 } },
        user_name: { fieldParams: { canEdit: false, renderInUpdate: false, flex: 1 } },
        inspect_date: {
            fieldParams: { canEdit: false, minWidth: 140 },
        },
        inspect_notes: {
            component: props => <TextField {...props} multiline minRows={2} />,
            fieldParams: { canEdit: true, renderInTable: false },
        },
        inspect_fail_reason: {
            component: props => <TextField {...props} multiline minRows={2} />,
            fieldParams: { canEdit: true, renderInTable: false },
        },
        discard_reason: {
            component: props => <TextField {...props} multiline minRows={2} />,
            fieldParams: { canEdit: true, renderInTable: false },
        },
        repairer_name: {
            component: props => <TextField {...props} multiline minRows={2} />,
            fieldParams: { canEdit: true, renderInTable: false },
        },
    },
};
