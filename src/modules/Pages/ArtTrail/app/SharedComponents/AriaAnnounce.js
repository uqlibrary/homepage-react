import React, { useEffect, useState } from 'react';
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
    const [announcement, setAnnouncement] = useState('');

    useEffect(() => {
        setAnnouncement('');

        const timeout = window.setTimeout(() => {
            setAnnouncement(message);
        }, 50);

        return () => window.clearTimeout(timeout);
    }, [message]);

    return (
        <Box
            role="status"
            aria-live="polite"
            aria-atomic="true"
            sx={srOnlyAnnouncementStyle}
            data-testid="aria-announcement"
        >
            {announcement}
        </Box>
    );
};

AriaAnnounce.propTypes = {
    message: PropTypes.node.isRequired,
};

export default AriaAnnounce;
