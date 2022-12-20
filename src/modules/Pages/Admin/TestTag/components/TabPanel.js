import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';

const TabPanel = props => {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`scrollable-auto-tabpanel-${index}`} {...other}>
            {value === index && (
                <Box p={3} paddingLeft={0} paddingRight={0}>
                    {children}
                </Box>
            )}
        </div>
    );
};

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

export default React.memo(TabPanel);
