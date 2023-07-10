import React from 'react';

import DebouncedTextField from '../../../SharedComponents/DebouncedTextField/DebouncedTextField';
import locale from '../../../testTag.locale';
import { isEmptyStr } from '../../../helpers/helpers';

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
            component: props => {
                return <DebouncedTextField {...props} multiline minRows={2} />;
            },
            fieldParams: { canEdit: true, renderInTable: false },
        },
        inspect_fail_reason: {
            component: (props, row) => {
                return (
                    <DebouncedTextField
                        {...props}
                        multiline
                        minRows={2}
                        disabled={row?.last_inspect_status !== locale.config.inspectStatus.failed ?? false}
                        required={row?.last_inspect_status === locale.config.inspectStatus.failed ?? false}
                    />
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
                <DebouncedTextField
                    {...props}
                    multiline
                    minRows={2}
                    disabled={row?.asset_status !== locale.config.assetStatus.discarded}
                    required={row?.asset_status === locale.config.assetStatus.discarded}
                />
            ),
            validate: (value, row) => {
                // should return true if a validation error exists
                return row?.asset_status === locale.config.assetStatus.discarded && isEmptyStr(value);
            },
            fieldParams: { canEdit: true, renderInTable: false },
        },
        repairer_name: {
            component: (props, row) => (
                <DebouncedTextField
                    {...props}
                    multiline
                    minRows={2}
                    disabled={row?.asset_status !== locale.config.assetStatus.outforrepair}
                    required={row?.asset_status === locale.config.assetStatus.outforrepair}
                />
            ),
            validate: (value, row) => {
                // should return true if a validation error exists
                return row?.asset_status === locale.config.assetStatus.outforrepair && isEmptyStr(value);
            },
            fieldParams: { canEdit: true, renderInTable: false },
        },
    },
};