import React from 'react';
import PropTypes from 'prop-types';

import { GridToolbarContainer } from '@mui/x-data-grid';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

const rootId = 'add_toolbar';

const AddToolbar = ({ id, label, onClick, startIcon = <AddIcon /> }) => {
    return (
        <GridToolbarContainer id={`${rootId}-${id}`} data-testid={`${rootId}-${id}`}>
            <Button
                color="primary"
                startIcon={startIcon}
                onClick={onClick}
                id={`${rootId}-${id}-add-button`}
                data-testid={`${rootId}-${id}-add-button`}
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
