import React from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Chip from '@mui/material/Chip';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import PlaceholderEditor from './PlaceholderEditor';

import locale from 'modules/Pages/Admin/TestTag/testTag.locale';
import { isEmptyStr } from '../../../helpers/helpers';

import { getCleanVarName, getUserVariablePlaceholder } from './utils';

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
                    inputProps={{ ...props.inputProps, maxLength: 255 }}
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
        identifiers: {
            component: ({ InputLabelProps, inputProps, onClick, error, ...props }) => {
                console.log(props);
                return (
                    <Autocomplete
                        renderInput={params => (
                            <TextField
                                variant="standard"
                                {...params}
                                label={locale.pages.manage.printertemplates.form.columns.identifiers.label}
                                required
                                error={error}
                                helperText={
                                    error
                                        ? locale.pages.manage.printertemplates.helperText.identifiers
                                        : locale.pages.general.helperText.maxChars(255)
                                }
                                InputLabelProps={InputLabelProps}
                                inputProps={{
                                    ...params.inputProps,
                                    ...inputProps,
                                }}
                                onClick={onClick}
                            />
                        )}
                        multiple
                        freeSolo
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => {
                                const { key, ...tagProps } = getTagProps({ index });
                                console.log(option, index, key, tagProps);
                                return (
                                    <Chip
                                        variant="outlined"
                                        label={option.printer_template_identifier_value ?? option}
                                        key={key}
                                        {...tagProps}
                                    />
                                );
                            })
                        }
                        {...props}
                    />
                );
            },
            validate: value => value?.length === 0 ?? false,
            fieldParams: {
                canEdit: true,
                renderInTable: false,
                minWidth: 200,
                flex: 1,
                type: 'autocomplete',
                optionKey: 'printer_template_identifier_id',
            },
        },

        identifiers_str: {
            fieldParams: {
                canEdit: false,
                canAdd: false,
                renderInUpdate: false,
                renderInAdd: false,
                minWidth: 200,
                flex: 1,
            },
        },
        vars: {
            component: ({ ...props }) => <PlaceholderEditor {...props} />,
            validate: (_, row) => {
                const userVariables =
                    row?.vars?.reduce?.((acc, variable) => [...acc, variable.printer_template_var_name], []) ?? [];
                const printerTemplateCode = row?.printer_template_code ?? '';
                const missing = userVariables.filter(
                    varName => !printerTemplateCode.includes(getUserVariablePlaceholder(getCleanVarName(varName))),
                );
                return missing.length > 0;
            },
            fieldParams: {
                canEdit: true,
                renderInTable: false,
                minWidth: 200,
                flex: 1,
                type: 'composite',
            },
        },
        printer_template_code: {
            // eslint-disable-next-line no-unused-vars
            component: (props, _, __, action) => (
                <Accordion defaultExpanded={action === 'add'}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                        Printer template code
                    </AccordionSummary>
                    <AccordionDetails>
                        <TextField
                            variant="outlined"
                            {...props}
                            required
                            multiline
                            minRows={4}
                            inputProps={{ ...props.inputProps, maxLength: 1000 }}
                            helperText={
                                props.error
                                    ? locale.pages.manage.printertemplates.helperText.printer_template_code
                                    : locale.pages.general.helperText.maxChars(1000)
                            }
                        />
                    </AccordionDetails>
                </Accordion>
            ),
            validate: value => isEmptyStr(value),
            fieldParams: { renderInTable: false, canAdd: true, canEdit: true, renderInUpdate: true, minWidth: 200 },
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
