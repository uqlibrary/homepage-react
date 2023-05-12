import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Box } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
    header: {
        paddingBottom: theme.spacing(2),
    },
}));

const TestTagHeader = (/* istanbul ignore next*/ { departmentText = '', requiredText = '', ...props } = {}) => {
    TestTagHeader.propTypes = {
        departmentText: PropTypes.string.isRequired,
        className: PropTypes.string,
        requiredText: PropTypes.string.isRequired,
    };
    const classes = useStyles();
    const { className, ...rest } = props;
    return (
        <Box className={clsx([classes.header, className])} data-testid="tntHeader" {...rest}>
            {!!departmentText && departmentText.length > 0 && (
                <Typography component={'h2'} variant={'h5'}>
                    {!!!departmentText ? (
                        <Skeleton animation="wave" data-testid="tntHeaderSkeletonDepartmentTextLoading" />
                    ) : (
                        departmentText
                    )}
                </Typography>
            )}
            {!!requiredText && requiredText.length > 0 && (
                <Typography variant={'body1'} component={'p'}>
                    {!!!requiredText ? (
                        <Skeleton animation="wave" data-testid="tntHeaderSkeletonRequiredTextLoading" />
                    ) : (
                        requiredText
                    )}
                </Typography>
            )}
        </Box>
    );
};

export default React.memo(TestTagHeader);
