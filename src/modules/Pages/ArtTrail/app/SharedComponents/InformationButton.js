import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

const InformationButton = ({ title, onClick, sx, ...props }) => {
    const ariaLabel = `More information about ${title}`;
    return (
        <IconButton
            size="large"
            onClick={onClick}
            aria-label={ariaLabel}
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
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    sx: PropTypes.object,
};

export default InformationButton;
