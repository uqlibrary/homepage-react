import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

const srOnlyAnnouncementStyle = {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    width: '1px',
};

const AriaAnnounce = ({ message }) => {
    return (
        <Box aria-live="polite" aria-atomic="true" sx={srOnlyAnnouncementStyle} data-testid="aria-announcement">
            {message}
        </Box>
    );
};

AriaAnnounce.propTypes = {
    message: PropTypes.node.isRequired,
};

export default AriaAnnounce;
