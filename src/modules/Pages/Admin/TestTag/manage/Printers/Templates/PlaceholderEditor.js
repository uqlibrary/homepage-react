import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { GridRowModes } from '@mui/x-data-grid';

import DataTable, { rootId as dataTableRootId } from '../../../SharedComponents/DataTable/DataTable';
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

const componentId = 'placeholder-editor';

const PlaceholderEditor = ({ label, onChange, value, error, setIsEditing, InputLabelProps, ...props }) => {
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
            setIsEditing?.(false);
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
        <Box
            sx={{
                ...{ ...(error ? { 'div.dataGridRoot .MuiDataGrid-main': { borderColor: 'error.main' } } : {}) },
                '.MuiDataGrid-footerContainer': { display: 'none' },
            }}
        >
            <FormLabelText
                component={'label'}
                className={error ? 'Mui-error' : ''}
                htmlFor={`${dataTableRootId}-${InputLabelProps.htmlFor}`}
                id={`${dataTableRootId}-${InputLabelProps.id}`}
                data-testid={`${dataTableRootId}-${InputLabelProps['data-testid']}`}
                error={error}
            >
                {label}
            </FormLabelText>
            <DataTable
                id={componentId}
                rows={rows}
                columns={columns}
                rowId="printer_template_var_id"
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
                    toolbar: { rows, setRows, setRowModesModel, setIsEditing },
                }}
                disableIgnoreModificationsIfProcessingProps
                experimentalFeatures={{ newEditingApi: true }}
                {...props}
            />
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
        </Box>
    );
};
PlaceholderEditor.propTypes = {
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array.isRequired,
    InputLabelProps: PropTypes.object.isRequired,
    error: PropTypes.bool,
    setIsEditing: PropTypes.func,
};

export default React.memo(PlaceholderEditor);
