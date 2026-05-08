import React from 'react';
import PropTypes from 'prop-types';

import { GridRowModes, GridToolbarContainer } from '@mui/x-data-grid';

import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

import { randomId } from './utils';

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

export default React.memo(AddToolbar);
