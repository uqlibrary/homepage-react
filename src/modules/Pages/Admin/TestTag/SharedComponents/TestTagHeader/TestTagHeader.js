import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Box } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
    header: {
        paddingBottom: theme.spacing(2),
    },
}));

const TestTagHeader = (/* istanbul ignore next*/ { departmentText = '', requiredText = '', ...props } = {}) => {
    TestTagHeader.propTypes = {
        departmentText: PropTypes.string.isRequired,
        requiredText: PropTypes.string.isRequired,
    };
    const classes = useStyles();
    const {className, ...rest} = props;
    return (
        <Box className={clsx([classes.header, className])} {...rest}>
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
