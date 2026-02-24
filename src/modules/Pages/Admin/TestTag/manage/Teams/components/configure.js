import React from 'react';

import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import { isEmptyStr, isInvalidTeamSlug } from '../../../helpers/helpers';

import locale from 'modules/Pages/Admin/TestTag/testTag.locale';

export default {
    sort: {
        defaultSortColumn: 'team_slug',
    },
    fields: {
        team_slug: {
            label: locale.pages.manage.teams.form.columns.team_slug.label,
            component: (props, data) => (
                <TextField
                    variant="standard"
                    {...props}
                    disabled={data?.isSelf}
                    required
                    inputProps={{ ...props.inputProps, maxLength: 10 }}
                    helperText={
                        props.error
                            ? locale.pages.manage.teams.helperText.team_slug
                            : locale.pages.general.helperText.maxChars(10)
                    }
                />
            ),
            validate: value => isInvalidTeamSlug(value),
            fieldParams: { canEdit: false, canAdd: true, minWidth: 100 },
        },
        team_display_name: {
            component: props => (
                <TextField
                    variant="standard"
                    {...props}
                    required
                    helperText={props.error ? locale.pages.manage.teams.helperText.team_display_name : null}
                />
            ),
            validate: value => isEmptyStr(value),
            fieldParams: { canEdit: true, minWidth: 200, flex: 1 },
        },
        team_current_flag: {
            fieldParams: { canEdit: false, renderInUpdate: false, renderInAdd: false, minWidth: 115 },
        },
        team_current_flag_cb: {
            component: (props, data) => (
                <FormControlLabel
                    control={<Checkbox color="primary" disabled={data?.isSelf} checked={props.value} {...props} />}
                    label={locale.pages.manage.teams.form.columns.team_current_flag_cb.label}
                />
            ),
            fieldParams: { canEdit: true, renderInTable: false, type: 'checkbox' },
        },
        users_count: {
            fieldParams: {
                canEdit: false,
                canAdd: false,
                renderInUpdate: false,
                renderInAdd: false,
                minWidth: 130,
            },
        },
    },
};
