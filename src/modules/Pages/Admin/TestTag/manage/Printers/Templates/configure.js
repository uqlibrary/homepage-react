import React from 'react';
import PropTypes from 'prop-types';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Chip from '@mui/material/Chip';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

import { GridRowModes, DataGrid, GridToolbarContainer, GridActionsCellItem } from '@mui/x-data-grid';

import locale from 'modules/Pages/Admin/TestTag/testTag.locale';
import { isEmptyStr } from '../../../helpers/helpers';

export const PRINTER_TEMPLATE_USER_VARS = [
    {
        printer_template_var_name: 'BARCODEX',
        printer_template_var_label: 'Barcode X',
        printer_template_var_default_value: '0',
    },
    {
        printer_template_var_name: 'BARCODEY',
        printer_template_var_label: 'Barcode Y',
        printer_template_var_default_value: '0',
    },
    {
        printer_template_var_name: 'DUEDATEX',
        printer_template_var_label: 'Due Date X',
        printer_template_var_default_value: '0',
    },
    {
        printer_template_var_name: 'DUEDATEY',
        printer_template_var_label: 'Due Date Y',
        printer_template_var_default_value: '0',
    },
    {
        printer_template_var_name: 'LABELDATEDUEX',
        printer_template_var_label: 'Label Date Due X',
        printer_template_var_default_value: '0',
    },
    {
        printer_template_var_name: 'LABELDATEDUEY',
        printer_template_var_label: 'Label Date Due Y',
        printer_template_var_default_value: '0',
    },
    {
        printer_template_var_name: 'LABELDATETESTEDX',
        printer_template_var_label: 'Label Date Tested X',
        printer_template_var_default_value: '0',
    },
    {
        printer_template_var_name: 'LABELDATETESTEDY',
        printer_template_var_label: 'Label Date Tested Y',
        printer_template_var_default_value: '0',
    },
    {
        printer_template_var_name: 'LABELTESTEDBYX',
        printer_template_var_label: 'Label Tested By X',
        printer_template_var_default_value: '0',
    },
    {
        printer_template_var_name: 'LABELTESTEDBYY',
        printer_template_var_label: 'Label Tested By Y',
        printer_template_var_default_value: '0',
    },
    {
        printer_template_var_name: 'LOGOX',
        printer_template_var_label: 'Logo X',
        printer_template_var_default_value: '0',
    },
    {
        printer_template_var_name: 'LOGOY',
        printer_template_var_label: 'Logo Y',
        printer_template_var_default_value: '0',
    },
    {
        printer_template_var_name: 'TESTDATEX',
        printer_template_var_label: 'Test Date X',
        printer_template_var_default_value: '0',
    },
    {
        printer_template_var_name: 'TESTDATEY',
        printer_template_var_label: 'Test Date Y',
        printer_template_var_default_value: '0',
    },
    {
        printer_template_var_name: 'USERIDX',
        printer_template_var_label: 'User ID X',
        printer_template_var_default_value: '0',
    },
    {
        printer_template_var_name: 'USERIDY',
        printer_template_var_label: 'User ID Y',
        printer_template_var_default_value: '0',
    },
];

export const randomId = rows => Math.max(...(rows?.map?.(row => row.printer_template_var_id) ?? [0])) + 1;
function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = randomId();
        setRows(oldRows => [
            ...oldRows,
            {
                printer_template_var_id: id,
                printer_template_var_label: '',
                printer_template_var_value: '',
                isNew: true,
            },
        ]);
        setRowModesModel(oldModel => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'printer_template_var_label' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add template variable
            </Button>
        </GridToolbarContainer>
    );
}
EditToolbar.propTypes = {
    setRowModesModel: PropTypes.func.isRequired,
    setRows: PropTypes.func.isRequired,
};

export const getCleanVarName = params => {
    const varName = params.row.printer_template_var_name;
    return varName?.replaceAll(/[\s{}]/g, '').toUpperCase() ?? '';
};

// eslint-disable-next-line react/prop-types
export const VarsComponent = ({ InputLabelProps, inputProps, onClick, onChange, value, error, ...props }) => {
    const [rows, setRows] = React.useState(value);
    const [rowModesModel, setRowModesModel] = React.useState({});

    const _onChange = props => {
        console.log('datagrid _onchange', props);
    };
    const handleDeleteClick = id => () => {
        setRows(rows.filter(row => row.id !== id));
    };
    const handleRowEditStart = (params, event) => {
        event.defaultMuiPrevented = true;
    };
    const handleRowEditStop = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const columns = [
        {
            field: 'printer_template_var_name',
            headerName: 'Variable name',
            flex: 1,
            editable: true,
            type: 'number',
            resizable: false,
            valueGetter: getCleanVarName,
        },
        {
            field: 'printer_template_var_value',
            headerName: 'Variable value',
            width: 150,
            editable: true,
            type: 'number',
            resizable: false,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: '',
            width: 50,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        color="inherit"
                        onClick={handleDeleteClick(id)}
                    />,
                ];
            },
            resizable: false,
        },
    ];

    return (
        <Box
            sx={{
                height: 500,
                width: '100%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
            }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                getRowId={row => row.printer_template_var_id}
                rowModesModel={rowModesModel}
                onRowEditStart={handleRowEditStart}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={_onChange}
                components={{
                    Toolbar: EditToolbar,
                }}
                componentsProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
                experimentalFeatures={{ newEditingApi: true }}
            />
        </Box>
    );
    // return (
    //     <Autocomplete
    //         renderInput={params => (
    //             <TextField
    //                 variant="standard"
    //                 {...params}
    //                 label={locale.pages.manage.printertemplates.form.columns.vars.label}
    //                 required
    //                 error={error}
    //                 helperText={error ? locale.pages.manage.printertemplates.helperText.vars : ''}
    //                 InputLabelProps={InputLabelProps}
    //                 inputProps={{
    //                     ...params.inputProps,
    //                     ...inputProps,
    //                 }}
    //                 onClick={onClick}
    //             />
    //         )}
    //         multiple
    //         freeSolo
    //         renderTags={(value, getTagProps) =>
    //             value.map((option, index) => {
    //                 const { key, ...tagProps } = getTagProps({ index });
    //                 console.log(option, index, key, tagProps);
    //                 return (
    //                     <Chip
    //                         variant="outlined"
    //                         label={option.printer_template_identifier_value ?? option}
    //                         key={key}
    //                         {...tagProps}
    //                     />
    //                 );
    //             })
    //         }
    //         {...props}
    //     />
    // );
};

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
            component: ({ ...props }) => <VarsComponent {...props} />,
            validate: value => value?.length === 0 ?? false,
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
