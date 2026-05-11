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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/CheckOutlined';
import CancelIcon from '@mui/icons-material/Close';

import { GridRowModes, GridActionsCellItem, GridEditInputCell } from '@mui/x-data-grid';

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
            validate: value => isEmptyStr(value) || value.length > 255,
            fieldParams: { canEdit: true, canAdd: true, renderInUpdate: true, renderInTable: true, minWidth: 250 },
        },
        identifiers: {
            component: ({ InputLabelProps, inputProps, onClick, error, ...props }) => {
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
            validate: (value, data, rows) => {
                if (value?.length === 0) {
                    return true;
                }
                const values = value.map(val =>
                    typeof val === 'string' ? val : val.printer_template_identifier_value,
                );
                const duplicates = values.filter((val, index) => values.indexOf(val) !== index);
                if (duplicates.length > 0) {
                    return true;
                }
                if (values.some(val => isEmptyStr(val)) || values.some(val => val.length > 255)) {
                    return true;
                }
                return rows
                    ?.filter(row => row.printer_template_id !== data.printer_template_id)
                    .some(row => {
                        const rowValues =
                            row.identifiers?.map(identifier => identifier.printer_template_identifier_value) ?? [];
                        return rowValues.some(val => values.includes(val));
                    });
            },
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
                        {
                            locale.pages.manage.printertemplates.placeholderEditor.form.columns.printer_template_code
                                .label
                        }
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

export const placeholderEditorColumns = ({
    rowModesModel,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    handleDeleteClick,
}) => [
    {
        field: 'printer_template_var_id',
        headerName: locale.pages.manage.printertemplates.placeholderEditor.form.columns.printer_template_var_id.label,
        hide: true,
        editable: false,
        type: 'number',
        resizable: false,
    },
    {
        field: 'printer_template_var_name',
        headerName: locale.pages.manage.printertemplates.placeholderEditor.form.columns.printer_template_var_name.label,
        width: 175,
        minWidth: 150,
        editable: true,
        type: 'string',
        resizable: false,
        valueGetter: params => getCleanVarName(params.row.printer_template_var_name),
        // eslint-disable-next-line no-unused-vars
        renderEditCell: ({ hasChanged, otherFieldsProps, ...params }) => (
            <GridEditInputCell
                {...params}
                inputProps={{
                    maxLength: 255,
                }}
            />
        ),
        preProcessEditCellProps: params => {
            const hasError = isEmptyStr(params.props.value) || params.props.value.length > 255;
            return { ...params.props, error: hasError };
        },
    },
    {
        field: 'printer_template_var_label',
        headerName:
            locale.pages.manage.printertemplates.placeholderEditor.form.columns.printer_template_var_label.label,
        minWidth: 150,
        flex: 1,
        editable: true,
        type: 'string',
        resizable: false,
        // eslint-disable-next-line no-unused-vars
        renderEditCell: ({ hasChanged, otherFieldsProps, ...params }) => (
            <GridEditInputCell
                {...params}
                inputProps={{
                    maxLength: 255,
                }}
            />
        ),
        preProcessEditCellProps: params => {
            const hasError = isEmptyStr(params.props.value) || params.props.value.length > 255;
            return { ...params.props, error: hasError };
        },
    },

    {
        field: 'printer_template_var_value',
        headerName:
            locale.pages.manage.printertemplates.placeholderEditor.form.columns.printer_template_var_value.label,
        width: 100,
        minWidth: 100,
        editable: true,
        type: 'number',
        resizable: false,
        preProcessEditCellProps: params => {
            let hasError = false;
            try {
                hasError = !Number.isInteger(Number(params.props.value));
            } catch (error) {
                hasError = true;
            }
            return { ...params.props, error: hasError };
        },
    },
    {
        field: 'actions',
        type: 'actions',
        headerName: '',
        width: 80,
        minWidth: 80,
        cellClassName: 'actions',
        getActions: ({ id }) => {
            const anyInEditMode = Object.keys(rowModesModel).some(key => rowModesModel[key].mode === GridRowModes.Edit);
            const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
            if (isInEditMode) {
                return [
                    <GridActionsCellItem
                        icon={<SaveIcon />}
                        label={locale.pages.manage.printertemplates.buttons.save.label}
                        onClick={handleSaveClick(id)}
                    />,
                    <GridActionsCellItem
                        icon={<CancelIcon />}
                        label={locale.pages.manage.printertemplates.buttons.cancel.label}
                        onClick={handleCancelClick(id)}
                        color="inherit"
                    />,
                ];
            }

            return [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label={locale.pages.manage.printertemplates.buttons.edit.label}
                    onClick={handleEditClick(id)}
                    color="inherit"
                    disabled={anyInEditMode}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label={locale.pages.manage.printertemplates.buttons.delete.label}
                    onClick={handleDeleteClick(id)}
                    color="inherit"
                    disabled={anyInEditMode}
                />,
            ];
        },
        resizable: false,
    },
];
