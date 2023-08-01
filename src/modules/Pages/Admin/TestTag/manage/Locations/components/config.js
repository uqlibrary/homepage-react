import React from 'react';

import TextField from '@material-ui/core/TextField';

import locale from '../../../testTag.locale';
import { createLocationString } from '../../../helpers/helpers';
import { isEmptyStr } from '../../../helpers/helpers';

export default {
    site: {
        sort: {
            defaultSortColumn: 'site_id_displayed',
        },
        fields: {
            site_id: {
                fieldParams: {
                    canEdit: false,
                    renderInTable: false,
                    renderInAdd: false,
                    renderInUpdate: false,
                },
            },
            site_id_displayed: {
                component: props => (
                    <TextField
                        {...props}
                        inputProps={{ ...props.inputProps, maxLength: 10 }}
                        required
                        helperText={locale.pages.general.helperText.maxChars(10)}
                    />
                ),
                validate: value => isEmptyStr(value), // should return true if a validation error exists
                fieldParams: { canEdit: true, minWidth: 150 },
            },
            site_name: {
                component: props => <TextField {...props} required />,
                validate: value => isEmptyStr(value), // should return true if a validation error exists
                fieldParams: { canEdit: true, minWidth: 150, flex: 1 },
            },
            asset_count: {
                fieldParams: { canEdit: false, renderInAdd: false, renderInUpdate: false, minWidth: 120 },
            },
        },
    },
    building: {
        sort: {
            defaultSortColumn: 'building_id_displayed',
        },
        fields: {
            building_id: {
                fieldParams: {
                    canEdit: false,
                    renderInTable: false,
                    renderInAdd: false,
                    renderInUpdate: false,
                },
            },
            building_location: {
                computedValue: displayLocation => createLocationString(displayLocation),
                computedValueProp: 'displayLocation',
                fieldParams: { canAdd: false, canEdit: false, renderInTable: false },
            },
            building_id_displayed: {
                component: props => (
                    <TextField
                        {...props}
                        inputProps={{ ...props.inputProps, maxLength: 10 }}
                        required
                        helperText={locale.pages.general.helperText.maxChars(10)}
                    />
                ),
                validate: value => isEmptyStr(value), // should return true if a validation error exists
                fieldParams: { canEdit: true, minWidth: 150 },
            },
            building_name: {
                component: props => <TextField {...props} required />,
                validate: value => isEmptyStr(value), // should return true if a validation error exists
                fieldParams: { canEdit: true, minWidth: 150, flex: 1 },
            },
            asset_count: {
                fieldParams: { canEdit: false, renderInAdd: false, renderInUpdate: false, minWidth: 120 },
            },
        },
    },
    floor: {
        sort: {
            defaultSortColumn: 'floor_id_displayed',
        },
        fields: {
            floor_id: {
                fieldParams: {
                    canEdit: false,
                    renderInTable: false,
                    renderInAdd: false,
                    renderInUpdate: false,
                },
            },
            floor_location: {
                computedValue: displayLocation => createLocationString(displayLocation),
                computedValueProp: 'displayLocation',
                fieldParams: { canAdd: false, canEdit: false, renderInTable: false, flex: 1 },
            },
            floor_id_displayed: {
                component: props => (
                    <TextField
                        {...props}
                        inputProps={{ ...props.inputProps, maxLength: 10 }}
                        required
                        helperText={locale.pages.general.helperText.maxChars(10)}
                    />
                ),
                validate: value => isEmptyStr(value), // should return true if a validation error exists
                fieldParams: { canEdit: true, minWidth: 150, flex: 1 },
            },
            asset_count: {
                fieldParams: { canEdit: false, renderInAdd: false, renderInUpdate: false, minWidth: 120 },
            },
        },
    },
    room: {
        sort: {
            defaultSortColumn: 'room_id_displayed',
        },
        fields: {
            room_id: {
                fieldParams: {
                    canEdit: false,
                    renderInTable: false,
                    renderInAdd: false,
                    renderInUpdate: false,
                },
            },
            room_location: {
                computedValue: displayLocation => createLocationString(displayLocation),
                computedValueProp: 'displayLocation',
                fieldParams: { canAdd: false, canEdit: false, renderInTable: false },
            },
            room_id_displayed: {
                component: props => (
                    <TextField
                        {...props}
                        inputProps={{ ...props.inputProps, maxLength: 10 }}
                        required
                        helperText={locale.pages.general.helperText.maxChars(10)}
                    />
                ),
                validate: value => isEmptyStr(value), // should return true if a validation error exists
                fieldParams: { canEdit: true, minWidth: 150 },
            },
            room_description: {
                component: props => <TextField {...props} />,
                fieldParams: { canEdit: true, minWidth: 150, flex: 1 },
            },
            asset_count: {
                fieldParams: { canEdit: false, renderInAdd: false, renderInUpdate: false, minWidth: 120 },
            },
        },
    },
};
