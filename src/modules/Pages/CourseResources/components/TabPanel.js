import React from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

export const TabPanel = props => {
    const { children, value, tabId, index, ...other } = props;

    return (
        <Grid
            role="tabpanel"
            hidden={value !== index}
            id={tabId || `tabpanel-${index}`}
            aria-labelledby={tabId || `tabpanel-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3} style={{ paddingLeft: 0, paddingRight: 0 }}>
                    {children}
                </Box>
            )}
        </Grid>
    );
};

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
    tabId: PropTypes.string,
};
