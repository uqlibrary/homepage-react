/* istanbul ignore file */

import React from 'react';

import TextField from '@mui/material/TextField';

import locale from '../../../testTag.locale';
import { isEmptyStr } from '../../../helpers/helpers';

export default {
    sort: {
        defaultSortColumn: 'asset_id_displayed',
    },
    fields: {
        asset_id: {
            fieldParams: { canEdit: false, renderInUpdate: false, renderInTable: false },
        },
        asset_id_displayed: {
            fieldParams: { canEdit: false, minWidth: 120 },
        },
        asset_type: { fieldParams: { canEdit: false, renderInUpdate: false, minWidth: 150, flex: 1 } },
        asset_status: { fieldParams: { canEdit: false, renderInUpdate: false, minWidth: 150 } },
        user_name: { fieldParams: { canEdit: false, renderInUpdate: false, minWidth: 180 } },
        inspect_date: {
            fieldParams: { canEdit: false, minWidth: 200 },
        },
        inspect_notes: {
            component: props => {
                return <TextField variant="standard" {...props} multiline minRows={3} />;
            },
            fieldParams: { canEdit: true, renderInTable: false },
        },
        inspect_fail_reason: {
            component: (props, row) => {
                return (
                    <TextField
                        variant="standard"
                        {...props}
                        multiline
                        minRows={3}
                        disabled={row?.last_inspect_status !== locale.config.inspectStatus.failed ?? false}
                        required={row?.last_inspect_status === locale.config.inspectStatus.failed ?? false} />
                );
            },

            validate: (value, row) => {
                // should return true if a validation error exists
                return row?.last_inspect_status === locale.config.inspectStatus.failed && isEmptyStr(value);
            },
            fieldParams: { canEdit: true, renderInTable: false },
        },
        discard_reason: {
            component: (props, row) => (
                <TextField
                    variant="standard"
                    {...props}
                    multiline
                    minRows={3}
                    disabled={row?.asset_status !== locale.config.assetStatus.discarded}
                    required={row?.asset_status === locale.config.assetStatus.discarded} />
            ),
            validate: (value, row) => {
                // should return true if a validation error exists
                return row?.asset_status === locale.config.assetStatus.discarded && isEmptyStr(value);
            },
            fieldParams: { canEdit: true, renderInTable: false },
        },
        repairer_name: {
            component: (props, row) => (
                <TextField
                    variant="standard"
                    {...props}
                    multiline
                    minRows={3}
                    disabled={row?.asset_status !== locale.config.assetStatus.outforrepair}
                    required={row?.asset_status === locale.config.assetStatus.outforrepair} />
            ),
            validate: (value, row) => {
                // should return true if a validation error exists
                return row?.asset_status === locale.config.assetStatus.outforrepair && isEmptyStr(value);
            },
            fieldParams: { canEdit: true, renderInTable: false },
        },
    },
};
