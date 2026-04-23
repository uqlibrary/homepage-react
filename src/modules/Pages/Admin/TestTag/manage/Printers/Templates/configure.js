import React from 'react';

import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

// import { isInvalidTeamSlug, isInvalidTeamDisplayName } from '../../../helpers/helpers';

import locale from 'modules/Pages/Admin/TestTag/testTag.locale';

export const PRINTER_TEMPLATE_USER_VARS = [
    {
        printer_template_var_name: 'VAR_BARCODEX',
        printer_template_var_label: 'Barcode X',
        printer_template_var_default_value: '10',
    },
    {
        printer_template_var_name: 'VAR_BARCODEY',
        printer_template_var_label: 'Barcode Y',
        printer_template_var_default_value: '50',
    },
    {
        printer_template_var_name: 'VAR_DUEDATEX',
        printer_template_var_label: 'Due Date X',
        printer_template_var_default_value: '200',
    },
    {
        printer_template_var_name: 'VAR_DUEDATEY',
        printer_template_var_label: 'Due Date Y',
        printer_template_var_default_value: '90',
    },
    {
        printer_template_var_name: 'VAR_LABELDATEDUEX',
        printer_template_var_label: 'Label Date Due X',
        printer_template_var_default_value: '100',
    },
    {
        printer_template_var_name: 'VAR_LABELDATEDUEY',
        printer_template_var_label: 'Label Date Due Y',
        printer_template_var_default_value: '90',
    },
    {
        printer_template_var_name: 'VAR_LABELDATETESTEDX',
        printer_template_var_label: 'Label Date Tested X',
        printer_template_var_default_value: '100',
    },
    {
        printer_template_var_name: 'VAR_LABELDATETESTEDY',
        printer_template_var_label: 'Label Date Tested Y',
        printer_template_var_default_value: '50',
    },
    {
        printer_template_var_name: 'VAR_LABELTESTEDBYX',
        printer_template_var_label: 'Label Tested By X',
        printer_template_var_default_value: '100',
    },
    {
        printer_template_var_name: 'VAR_LABELTESTEDBYY',
        printer_template_var_label: 'Label Tested By Y',
        printer_template_var_default_value: '10',
    },
    {
        printer_template_var_name: 'VAR_LOGOX',
        printer_template_var_label: 'Logo X',
        printer_template_var_default_value: '10',
    },
    {
        printer_template_var_name: 'VAR_LOGOY',
        printer_template_var_label: 'Logo Y',
        printer_template_var_default_value: '10',
    },
    {
        printer_template_var_name: 'VAR_TESTDATEX',
        printer_template_var_label: 'Test Date X',
        printer_template_var_default_value: '200',
    },
    {
        printer_template_var_name: 'VAR_TESTDATEY',
        printer_template_var_label: 'Test Date Y',
        printer_template_var_default_value: '50',
    },
    {
        printer_template_var_name: 'VAR_USERIDX',
        printer_template_var_label: 'User ID X',
        printer_template_var_default_value: '200',
    },
    {
        printer_template_var_name: 'VAR_USERIDY',
        printer_template_var_label: 'User ID Y',
        printer_template_var_default_value: '10',
    },
];

export default {
    sort: {
        defaultSortColumn: 'printer_template_name',
    },
    fields: {
        printer_template_name: {
            label: locale.pages.manage.printertemplates.form.columns.printer_template_name.label,
            component: (props, data) => (
                <TextField
                    variant="standard"
                    {...props}
                    disabled={data?.isSelf}
                    required
                    inputProps={{ ...props.inputProps, maxLength: 10 }}
                    helperText={
                        props.error
                            ? locale.pages.manage.printertemplates.helperText.printer_template_name
                            : locale.pages.general.helperText.maxChars(255)
                    }
                />
            ),
            // validate: value => isInvalidTeamSlug(value),
            fieldParams: { canEdit: true, canAdd: true, renderInUpdate: true, renderInTable: true, minWidth: 200 },
        },
        identifiers_arr: {
            component: props => (
                <TextField
                    variant="standard"
                    {...props}
                    required
                    helperText={
                        props.error
                            ? locale.pages.manage.printertemplates.helperText.identifiers
                            : locale.pages.general.helperText.maxChars(255)
                    }
                />
            ),
            valueFormatter: identifiers => {
                console.log(identifiers);
                return identifiers?.map(identifier => identifier.printer_template_identifier_value).join(', ');
            },
            // validate: value => isInvalidTeamDisplayName(value),
            fieldParams: { renderInTable: false, canAdd: true, canEdit: true, minWidth: 200 },
        },
        identifiers: {
            fieldParams: {
                canEdit: false,
                canAdd: false,
                renderInUpdate: false,
                renderInAdd: false,
                minWidth: 200,
                flex: 1,
            },
        },
        printer_template_current_flag: {
            fieldParams: { canEdit: false, renderInUpdate: false, renderInAdd: false, minWidth: 115 },
        },
        printer_template_current_flag_cb: {
            component: (props, data) => (
                <FormControlLabel
                    control={<Checkbox color="primary" disabled={data?.isSelf} checked={props.value} {...props} />}
                    label={locale.pages.manage.printertemplates.form.columns.printer_template_current_flag_cb.label}
                />
            ),
            fieldParams: { canEdit: true, renderInTable: false, type: 'checkbox' },
        },
    },
};
