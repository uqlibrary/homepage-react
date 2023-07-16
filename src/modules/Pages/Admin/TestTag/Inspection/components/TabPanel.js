import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';

const TabPanel = props => {
    const { children, value, index, id, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`${id}-tab-panel-${index}`}
            data-testid={`${id}-tab-panel-${index}`}
            {...other}
        >
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
    id: PropTypes.string.isRequired,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

export default React.memo(TabPanel);
