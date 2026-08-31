import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const LocationButton = ({ onClick, sx, ...props }) => {
    return (
        <IconButton
            size="large"
            aria-label="Location information about this artwork"
            onClick={onClick}
            sx={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                padding: 0,
                ...sx,
            }}
            {...props}
        >
            <LocationOnIcon
                fontSize="large"
                sx={{
                    stroke: '#000',
                    strokeWidth: 1,
                    color: '#fff',
                    fontSize: '3rem',
                    filter: 'drop-shadow(2px 2px 1px rgba(0,0,0,0.5))',
                }}
            />
        </IconButton>
    );
};
LocationButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    sx: PropTypes.object,
};

export default LocationButton;
