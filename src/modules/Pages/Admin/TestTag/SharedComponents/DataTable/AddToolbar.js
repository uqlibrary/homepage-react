import React from 'react';
import PropTypes from 'prop-types';

import { GridToolbarContainer } from '@mui/x-data-grid';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

const AddToolbar = ({ label = '', startIcon = <AddIcon />, onClick = null }) => {
    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={startIcon} onClick={onClick}>
                {label}
            </Button>
        </GridToolbarContainer>
    );
};

AddToolbar.propTypes = {
    label: PropTypes.string.isRequired,
    startIcon: PropTypes.node,
    onClick: PropTypes.func.isRequired,
};

export default React.memo(AddToolbar);
