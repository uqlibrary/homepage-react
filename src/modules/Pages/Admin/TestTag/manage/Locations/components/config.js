import React from 'react';

import DebouncedTextField from '../../../SharedComponents/DebouncedTextField/DebouncedTextField';

import locale from '../../../testTag.locale';
import { createLocationString } from '../../../helpers/helpers';
import { isEmptyStr } from '../../../helpers/helpers';

export default {
    site: {
        fields: {
            site_id: {
                fieldParams: { canEdit: false, renderInTable: false, renderInAdd: false, renderInUpdate: false },
            },
            site_name: {
                component: props => <DebouncedTextField {...props} required />,
                validate: value => isEmptyStr(value), // should return true if a validation error exists
                fieldParams: { canEdit: true, flex: 1 },
            },
            site_id_displayed: {
                component: props => (
                    <DebouncedTextField
                        {...props}
                        inputProps={{ ...props.inputProps, maxLength: 10 }}
                        required
                        helperText={locale.pages.general.helperText.maxChars(10)}
                    />
                ),
                validate: value => isEmptyStr(value), // should return true if a validation error exists
                fieldParams: { canEdit: true, flex: 1 },
            },
            asset_count: {
                fieldParams: { canEdit: false, renderInAdd: false, renderInUpdate: false },
            },
        },
    },
    building: {
        fields: {
            building_id: {
                fieldParams: { canEdit: false, renderInTable: false, renderInAdd: false, renderInUpdate: false },
            },
            building_location: {
                computedValue: displayLocation => createLocationString(displayLocation),
                computedValueProp: 'displayLocation',
                fieldParams: { canEdit: false, renderInTable: false },
            },
            building_name: {
                component: props => <DebouncedTextField {...props} required />,
                validate: value => isEmptyStr(value), // should return true if a validation error exists
                fieldParams: { canEdit: true, flex: 1 },
            },
            building_id_displayed: {
                component: props => (
                    <DebouncedTextField
                        {...props}
                        inputProps={{ ...props.inputProps, maxLength: 10 }}
                        required
                        helperText={locale.pages.general.helperText.maxChars(10)}
                    />
                ),
                validate: value => isEmptyStr(value), // should return true if a validation error exists
                fieldParams: { canEdit: true, flex: 1 },
            },
            asset_count: {
                fieldParams: { canEdit: false, renderInAdd: false, renderInUpdate: false },
            },
        },
    },
    floor: {
        fields: {
            floor_id: {
                fieldParams: { canEdit: false, renderInTable: false, renderInAdd: false, renderInUpdate: false },
            },
            floor_location: {
                computedValue: displayLocation => createLocationString(displayLocation),
                computedValueProp: 'displayLocation',
                fieldParams: { canEdit: false, renderInTable: false, flex: 1 },
            },
            floor_id_displayed: {
                component: props => (
                    <DebouncedTextField
                        {...props}
                        inputProps={{ ...props.inputProps, maxLength: 10 }}
                        required
                        helperText={locale.pages.general.helperText.maxChars(10)}
                    />
                ),
                validate: value => isEmptyStr(value), // should return true if a validation error exists
                fieldParams: { canEdit: true, flex: 1 },
            },
            asset_count: {
                fieldParams: { canEdit: false, renderInAdd: false, renderInUpdate: false },
            },
        },
    },
    room: {
        fields: {
            room_id: {
                fieldParams: { canEdit: false, renderInTable: false, renderInAdd: false, renderInUpdate: false },
            },
            room_location: {
                computedValue: displayLocation => createLocationString(displayLocation),
                computedValueProp: 'displayLocation',
                fieldParams: { canEdit: false, renderInTable: false },
            },
            room_description: {
                component: props => <DebouncedTextField {...props} />,
                fieldParams: { canEdit: true, flex: 1 },
            },
            room_id_displayed: {
                component: props => (
                    <DebouncedTextField
                        {...props}
                        inputProps={{ ...props.inputProps, maxLength: 10 }}
                        required
                        helperText={locale.pages.general.helperText.maxChars(10)}
                    />
                ),
                validate: value => isEmptyStr(value), // should return true if a validation error exists
                fieldParams: { canEdit: true, flex: 1 },
            },
            asset_count: {
                fieldParams: { canEdit: false, renderInAdd: false, renderInUpdate: false },
            },
        },
    },
};
