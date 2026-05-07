import React, { useState } from 'react';
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

import { GridRowModes, DataGrid, GridToolbarContainer, GridActionsCellItem, GridEditInputCell } from '@mui/x-data-grid';

import * as actions from 'data/actions';
import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';
import { useConfirmationAlert } from '../../../helpers/hooks';

import { isEmptyStr } from '../../../helpers/helpers';

import locale from 'modules/Pages/Admin/TestTag/testTag.locale';
import { randomId, getCleanVarName } from './utils';

const FormLabelText = styled(Typography, {
    shouldForwardProp: prop => prop !== 'error',
})(({ error, theme }) => ({
    ...theme.typography.caption,
    color: error ? theme.palette.error.main : theme.palette.text.secondary,
    marginBottom: theme.spacing(0.5),
    display: 'block', // Optional: forces label to own line
}));

const AddToolbar = props => {
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
                isAdded: true,
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
AddToolbar.propTypes = {
    setRowModesModel: PropTypes.func.isRequired,
    rows: PropTypes.array.isRequired,
    setRows: PropTypes.func.isRequired,
};

const PlaceholderEditor = ({ label, onChange, value, error, setIsEditing }) => {
    const [rows, setRows] = React.useState(value);
    const [editRowsModel, setEditRowsModel] = useState({});
    const [rowModesModel, setRowModesModel] = useState({});

    const onCloseConfirmationAlert = () => actions.clearPrinterTemplateListError();
    const { confirmationAlert, openConfirmationAlert, closeConfirmationAlert } = useConfirmationAlert({
        duration: locale.config.alerts.timeout,
        onClose: onCloseConfirmationAlert,
        errorMessage: null,
        errorMessageFormatter: locale.config.alerts.error,
    });

    const processRowUpdate = newRow => {
        console.log('processRowUpdate', newRow);
        const nameInvalid =
            isEmptyStr(newRow.printer_template_var_name) || newRow.printer_template_var_name?.length > 255;
        const labelInvalid =
            isEmptyStr(newRow.printer_template_var_label) || newRow.printer_template_var_label?.length > 255;
        const valueInvalid = !Number.isInteger(Number(newRow.printer_template_var_value));

        if (nameInvalid || labelInvalid || valueInvalid) {
            openConfirmationAlert('All fields must be completed before saving.', 'error');
            throw new Error('All fields must be completed before saving.');
        }

        const updatedRow = { ...newRow, isNew: false };
        const newRows = rows.map(row =>
            row.printer_template_var_id === newRow.printer_template_var_id ? updatedRow : row,
        );
        setRows(newRows);
        onChange(null, newRows);
        setIsEditing?.(false);
        return updatedRow;
    };

    const _onError = error => {
        console.error('datagrid error', error);
        setIsEditing?.(true);
    };
    const handleRowEditStart = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleRowEditStop = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleEditClick = id => () => {
        setIsEditing?.(true);
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
        setIsEditing?.(false);
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
            field: 'printer_template_var_id',
            headerName: 'ID',
            hide: true,
            editable: false,
            type: 'number',
            resizable: false,
        },
        {
            field: 'printer_template_var_name',
            headerName: 'Variable',
            width: 175,
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
            headerName: 'Description',
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
            headerName: 'Value',
            width: 125,
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
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const anyInEditMode = Object.keys(rowModesModel).some(
                    key => rowModesModel[key].mode === GridRowModes.Edit,
                );
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
                if (isInEditMode) {
                    return [
                        <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={handleSaveClick(id)} />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={handleEditClick(id)}
                        color="inherit"
                        disabled={anyInEditMode}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                        disabled={anyInEditMode}
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
                    editRowsModel={editRowsModel}
                    onEditRowsModelChange={model => setEditRowsModel(model)}
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={newModel => setRowModesModel(newModel)}
                    onRowEditStart={handleRowEditStart}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    onProcessRowUpdateError={_onError}
                    components={{
                        Toolbar: AddToolbar,
                    }}
                    componentsProps={{
                        toolbar: { rows, setRows, setRowModesModel },
                    }}
                    disableIgnoreModificationsIfProcessingProps
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
            <ConfirmationAlert
                isOpen={confirmationAlert.visible}
                message={confirmationAlert.message}
                type={confirmationAlert.type}
                closeAlert={closeConfirmationAlert}
                autoHideDuration={confirmationAlert.autoHideDuration}
            />
        </>
    );
};
PlaceholderEditor.propTypes = {
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array.isRequired,
    error: PropTypes.bool,
    setIsEditing: PropTypes.func,
};

export default PlaceholderEditor;
