import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/CheckOutlined';
import CancelIcon from '@mui/icons-material/Close';

import { GridRowModes, DataGrid, GridToolbarContainer, GridActionsCellItem } from '@mui/x-data-grid';

import locale from 'modules/Pages/Admin/TestTag/testTag.locale';
import { randomId, getCleanVarName } from './utils';

const FormLabelText = styled(Typography)(({ error, theme }) => ({
    // Matches InputLabel styles
    ...theme.typography.caption,
    color: error ? theme.palette.error.main : theme.palette.text.secondary,
    marginBottom: theme.spacing(0.5),
    display: 'block', // Optional: forces label to own line
}));

const EditToolbar = props => {
    const { rows, setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = randomId(rows);
        setRows(oldRows => [
            {
                printer_template_var_id: id,
                printer_template_var_name: '',
                printer_template_var_label: '',
                printer_template_var_value: '',
                isNew: true,
            },
            ...oldRows,
        ]);
        setRowModesModel(oldModel => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'printer_template_var_name' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add template variable
            </Button>
        </GridToolbarContainer>
    );
};
EditToolbar.propTypes = {
    setRowModesModel: PropTypes.func.isRequired,
    rows: PropTypes.array.isRequired,
    setRows: PropTypes.func.isRequired,
};

const PlaceholderEditor = ({ label, onChange, value, error, ...props }) => {
    const [rows, setRows] = React.useState(value);
    const [rowModesModel, setRowModesModel] = React.useState({});

    const processRowUpdate = newRow => {
        const updatedRow = { ...newRow, isNew: false };
        const newRows = rows.map(row =>
            row.printer_template_var_id === newRow.printer_template_var_id ? updatedRow : row,
        );
        console.log('validate vars processRowUpdate', newRow);
        setRows(newRows);
        onChange(null, newRows);
        return updatedRow;
    };

    const _onError = error => {
        console.error('datagrid error', error);
    };
    const handleRowEditStart = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleRowEditStop = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleEditClick = id => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = id => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };
    const handleDeleteClick = id => () => {
        const newRows = rows.filter(row => row.printer_template_var_id !== id);
        setRows(newRows);
        onChange(null, newRows);
    };
    const handleCancelClick = id => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find(row => row.printer_template_var_id === id);
        if (editedRow.isNew) {
            setRows(rows.filter(row => row.printer_template_var_id !== id));
        }
    };

    const columns = [
        {
            field: 'printer_template_var_name',
            headerName: 'Variable',
            width: 175,
            editable: true,
            type: 'string',
            resizable: false,
            valueGetter: params => getCleanVarName(params.row.printer_template_var_name),
        },
        {
            field: 'printer_template_var_label',
            headerName: 'Description',
            flex: 1,
            editable: true,
            type: 'string',
            resizable: false,
        },
        {
            field: 'printer_template_var_value',
            headerName: 'Value',
            width: 125,
            editable: true,
            type: 'number',
            resizable: false,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: '',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={handleSaveClick(id)} />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
            resizable: false,
        },
    ];

    return (
        <>
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
                    pb: 1,
                    mb: 1,
                    ...{ ...(error ? { '.MuiDataGrid-root': { borderColor: 'error.main' } } : {}) },
                }}
            >
                <FormLabelText error={error}>{label}</FormLabelText>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    editMode="row"
                    getRowId={row => row.printer_template_var_id}
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={newModel => setRowModesModel(newModel)}
                    onRowEditStart={handleRowEditStart}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    onProcessRowUpdateError={_onError}
                    components={{
                        Toolbar: EditToolbar,
                    }}
                    componentsProps={{
                        toolbar: { rows, setRows, setRowModesModel },
                    }}
                    experimentalFeatures={{ newEditingApi: true }}
                    disableDensitySelector
                    disableColumnMenu
                    disableColumnFilter
                    disableColumnSelector
                    disableSelectionOnClick
                />
            </Box>

            {error && (
                <Typography component={'div'} color="error" variant="caption" sx={{ mt: 2 }}>
                    {locale.pages.manage.printertemplates.helperText.vars}
                </Typography>
            )}
        </>
    );
};
PlaceholderEditor.propTypes = {
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array.isRequired,
    error: PropTypes.bool,
};

export default PlaceholderEditor;
