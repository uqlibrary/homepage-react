import React from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

export const TabPanel = props => {
    const { children, value, tabId, index, label, ...other } = props;

    return (
        <Grid
            role="tabpanel"
            hidden={value !== index}
            id={tabId || `${label}-${index}`}
            aria-labelledby={tabId || `${label}-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3} style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
                    {children}
                </Box>
            )}
        </Grid>
    );
};

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    tabId: PropTypes.string,
};
