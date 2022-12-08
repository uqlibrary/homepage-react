import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { Box } from '@material-ui/core';

const TestTagHeader = (/* istanbul ignore next*/ { departmentText = '', requiredText = '', ...rest } = {}) => {
    TestTagHeader.propTypes = {
        departmentText: PropTypes.string.isRequired,
        requiredText: PropTypes.string.isRequired,
    };
    return (
        <Box {...rest}>
            <Typography component={'h2'} variant={'h5'}>
                {departmentText}
            </Typography>
            <Typography variant={'body1'} component={'p'}>
                {requiredText}
            </Typography>
        </Box>
    );
};

export default React.memo(TestTagHeader);
