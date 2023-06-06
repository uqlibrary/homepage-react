import React from 'react';

import TextField from '@material-ui/core/TextField';

import { createLocationString } from './utils';

export default {
    site: {
        fields: {
            site_id: {
                fieldParams: { canEdit: false },
            },
            site_name: {
                component: props => <TextField {...props} />,
                fieldParams: { canEdit: true, flex: 1 },
            },
            site_id_displayed: {
                component: props => <TextField {...props} inputProps={{ ...props.inputProps, maxLength: 10 }} />,
                fieldParams: { canEdit: true, flex: 1 },
            },
            asset_count: {
                fieldParams: { canEdit: false, renderInUpdate: false },
            },
        },
    },
    building: {
        fields: {
            building_id: {
                fieldParams: { canEdit: false },
            },
            building_location: {
                computedValue: displayLocation => createLocationString(displayLocation),
                computedValueProp: 'displayLocation',
                fieldParams: { canEdit: false, renderInTable: false },
            },
            building_name: {
                component: props => <TextField {...props} />,
                fieldParams: { canEdit: true, flex: 1 },
            },
            building_id_displayed: {
                component: props => <TextField {...props} inputProps={{ ...props.inputProps, maxLength: 10 }} />,
                fieldParams: { canEdit: true, flex: 1 },
            },
            asset_count: {
                fieldParams: { canEdit: false, renderInUpdate: false },
            },
        },
    },
    floor: {
        fields: {
            floor_id: {
                fieldParams: { canEdit: false, flex: 1 },
            },
            floor_location: {
                computedValue: displayLocation => createLocationString(displayLocation),
                computedValueProp: 'displayLocation',
                fieldParams: { canEdit: false, renderInTable: false, flex: 1 },
            },
            floor_id_displayed: {
                component: props => <TextField {...props} inputProps={{ ...props.inputProps, maxLength: 10 }} />,
                fieldParams: { canEdit: true, flex: 1 },
            },
            asset_count: {
                fieldParams: { canEdit: false, renderInUpdate: false },
            },
        },
    },
    room: {
        fields: {
            room_id: {
                fieldParams: { canEdit: false },
            },
            room_location: {
                computedValue: displayLocation => createLocationString(displayLocation),
                computedValueProp: 'displayLocation',
                fieldParams: { canEdit: false, renderInTable: false },
            },
            room_description: {
                component: props => <TextField {...props} />,
                fieldParams: { canEdit: true, flex: 1 },
            },
            room_id_displayed: {
                component: props => <TextField {...props} inputProps={{ ...props.inputProps, maxLength: 10 }} />,
                fieldParams: { canEdit: true, flex: 1 },
            },
            asset_count: {
                fieldParams: { canEdit: false, renderInUpdate: false },
            },
        },
    },
};
