import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

import { GridToolbarContainer } from '@mui/x-data-grid';

import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

const rootId = 'add_toolbar';

const AddToolbar = ({ id, label, onClick, startIcon = <AddIcon /> }) => {
    const componentId = `${rootId}-${id}`;
    const theme = useTheme();
    return (
        <GridToolbarContainer
            id={`${componentId}`}
            data-testid={`${componentId}`}
            style={{ marginBottom: theme.spacing(2) }}
        >
            <Button
                color="primary"
                variant="contained"
                startIcon={startIcon}
                onClick={onClick}
                id={`${componentId}-add-button`}
                data-testid={`${componentId}-add-button`}
            >
                {label}
            </Button>
        </GridToolbarContainer>
    );
};

AddToolbar.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    startIcon: PropTypes.node,
    onClick: PropTypes.func.isRequired,
};

export default React.memo(AddToolbar);
