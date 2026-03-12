import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';

const AddButton = ({ id, label, ...props }) => {
    const theme = useTheme();
    return (
        <Button
            sx={{ mb: theme.spacing(2) }}
            id={`${id}-add-button`}
            data-testid={`${id}-add-button`}
            color="primary"
            variant="contained"
            startIcon={<AddIcon />}
            {...props}
        >
            {label}
        </Button>
    );
};

AddButton.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
};

export default React.memo(AddButton);
