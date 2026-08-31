import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

const InformationButton = ({ onClick, sx, ...props }) => {
    return (
        <IconButton
            size="large"
            aria-label="More information about this artwork"
            onClick={onClick}
            sx={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                padding: 0,
                ...sx,
            }}
            {...props}
        >
            <InfoIcon
                fontSize="large"
                sx={{
                    color: '#fff',
                    fontSize: '3rem',
                    filter: 'drop-shadow(2px 2px 1px rgba(0,0,0,0.5))',
                    stroke: '#000',
                    strokeWidth: 1,
                }}
            />
        </IconButton>
    );
};
InformationButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    sx: PropTypes.object,
};

export default InformationButton;
