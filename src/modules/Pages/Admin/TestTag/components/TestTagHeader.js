import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

const TestTagHeader = ({ departmentText = '', requiredText = '' } = {}) => {
    TestTagHeader.propTypes = {
        departmentText: PropTypes.string.isRequired,
        requiredText: PropTypes.string.isRequired,
    };
    return (
        <>
            <Typography component={'h2'} variant={'h5'}>
                {departmentText}
            </Typography>
            <Typography variant={'body1'} component={'p'}>
                {requiredText}
            </Typography>
        </>
    );
};

export default React.memo(TestTagHeader);
