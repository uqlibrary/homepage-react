import React from 'react';

import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import locale from 'modules/Pages/Admin/TestTag/testTag.locale';
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
                        variant="standard"
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
                component: props => <TextField variant="standard" {...props} required />,
                validate: value => isEmptyStr(value), // should return true if a validation error exists
                fieldParams: { canEdit: true, minWidth: 200, flex: 1 },
            },
            asset_count: {
                fieldParams: { canEdit: false, renderInAdd: false, renderInUpdate: false, minWidth: 140 },
            },
            site_excluded: {
                fieldParams: { canEdit: false, renderInAdd: false, renderInUpdate: false, minWidth: 100 },
            },
            site_excluded_cb: {
                component: props => {
                    return (
                        <FormControlLabel
                            control={<Checkbox color="primary" checked={props.value} {...props} />}
                            label={locale.pages.manage.locations.form.columns.site.site_excluded_cb.label}
                        />
                    );
                },
                fieldParams: { canEdit: true, renderInTable: false, minWidth: 150 },
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
                        variant="standard"
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
                component: props => <TextField variant="standard" {...props} required />,
                validate: value => isEmptyStr(value), // should return true if a validation error exists
                fieldParams: { canEdit: true, minWidth: 200, flex: 1 },
            },
            asset_count: {
                fieldParams: { canEdit: false, renderInAdd: false, renderInUpdate: false, minWidth: 140 },
            },
            building_excluded: {
                fieldParams: { canEdit: false, renderInAdd: false, renderInUpdate: false, minWidth: 100 },
            },
            building_excluded_cb: {
                component: (props, _, row) => {
                    return (
                        <FormControlLabel
                            control={<Checkbox color="primary" checked={props.value} {...props} />}
                            label={
                                row.parent_excluded
                                    ? locale.pages.manage.locations.form.columns.building.building_excluded_cb.labelAlt
                                    : locale.pages.manage.locations.form.columns.building.building_excluded_cb.label
                            }
                            disabled={row.parent_excluded}
                        />
                    );
                },
                fieldParams: { canEdit: true, renderInTable: false, minWidth: 150 },
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
                        variant="standard"
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
                fieldParams: { canEdit: false, renderInAdd: false, renderInUpdate: false, minWidth: 140 },
            },
            floor_excluded: {
                fieldParams: { canEdit: false, renderInAdd: false, renderInUpdate: false, minWidth: 100 },
            },
            floor_excluded_cb: {
                component: (props, _, row) => {
                    return (
                        <FormControlLabel
                            control={<Checkbox color="primary" checked={props.value} {...props} />}
                            label={
                                row.parent_excluded
                                    ? locale.pages.manage.locations.form.columns.floor.floor_excluded_cb.labelAlt
                                    : locale.pages.manage.locations.form.columns.floor.floor_excluded_cb.label
                            }
                            disabled={row.parent_excluded}
                        />
                    );
                },
                fieldParams: { canEdit: true, renderInTable: false, minWidth: 150 },
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
                computedValue: displayLocation =>
                    `${locale.pages.general.locationPicker.floor.label} ${createLocationString(displayLocation)}`,
                computedValueProp: 'displayLocation',
                fieldParams: { canAdd: false, canEdit: false, renderInTable: false },
            },
            room_id_displayed: {
                component: props => (
                    <TextField
                        variant="standard"
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
                component: props => <TextField variant="standard" {...props} />,
                fieldParams: { canEdit: true, minWidth: 200, flex: 1 },
            },
            asset_count: {
                fieldParams: { canEdit: false, renderInAdd: false, renderInUpdate: false, minWidth: 140 },
            },
            room_excluded: {
                fieldParams: { canEdit: false, renderInAdd: false, renderInUpdate: false, minWidth: 100 },
            },
            room_excluded_cb: {
                component: (props, _, row) => {
                    return (
                        <FormControlLabel
                            control={<Checkbox color="primary" checked={props.value} {...props} />}
                            label={
                                row.parent_excluded
                                    ? locale.pages.manage.locations.form.columns.room.room_excluded_cb.labelAlt
                                    : locale.pages.manage.locations.form.columns.room.room_excluded_cb.label
                            }
                            disabled={row.parent_excluded}
                        />
                    );
                },
                fieldParams: { canEdit: true, renderInTable: false, minWidth: 150 },
            },
        },
    },
};
