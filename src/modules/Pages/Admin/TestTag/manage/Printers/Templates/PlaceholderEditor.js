import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { GridRowModes, DataGrid } from '@mui/x-data-grid';

import AddToolbar from './AddToolbar';
import * as actions from 'data/actions';
import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';
import { useConfirmationAlert } from '../../../helpers/hooks';

import { placeholderEditorColumns } from './config';

import locale from 'modules/Pages/Admin/TestTag/testTag.locale';
import { validateTemplateUserVariable } from './utils';

const FormLabelText = styled(Typography, {
    shouldForwardProp: prop => prop !== 'error',
})(({ error, theme }) => ({
    ...theme.typography.caption,
    color: error ? theme.palette.error.main : theme.palette.text.secondary,
    marginBottom: theme.spacing(0.5),
    display: 'block', // Optional: forces label to own line
}));

const PlaceholderEditor = ({ label, onChange, value, error, setIsEditing, ...props }) => {
    const [rows, setRows] = React.useState(value);
    const [rowModesModel, setRowModesModel] = useState({});

    const pageLocale = locale.pages.manage.printertemplates;

    const onCloseConfirmationAlert = () => actions.clearPrinterTemplateListError();
    const { confirmationAlert, openConfirmationAlert, closeConfirmationAlert } = useConfirmationAlert({
        duration: locale.config.alerts.timeout,
        onClose: onCloseConfirmationAlert,
        errorMessage: null,
        errorMessageFormatter: locale.config.alerts.error,
    });

    const processRowUpdate = newRow => {
        const invalidRow = validateTemplateUserVariable(newRow);

        if (invalidRow) {
            openConfirmationAlert(pageLocale.placeholderEditor.helperText.validationAllFieldsRequired, 'error');
            throw new Error(pageLocale.placeholderEditor.helperText.validationAllFieldsRequired);
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

    /* istanbul ignore next */
    const handleRowEditStart = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    /* istanbul ignore next */
    const handleRowEditStop = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const columns = useMemo(() => {
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

        return placeholderEditorColumns({
            rowModesModel,
            handleSaveClick,
            handleCancelClick,
            handleEditClick,
            handleDeleteClick,
        });
    }, [onChange, rowModesModel, rows, setIsEditing]);

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
                    {...props}
                />
            </Box>

            {error && (
                <Typography component={'div'} color="error" variant="caption" sx={{ mt: 2 }}>
                    {pageLocale.helperText.vars}
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

export default React.memo(PlaceholderEditor);
