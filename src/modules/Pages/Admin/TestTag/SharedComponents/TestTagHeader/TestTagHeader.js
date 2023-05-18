import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Box } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link } from 'react-router-dom';
import Icon from '@material-ui/core/Icon';
import HomeIcon from '@material-ui/icons/Home';
import clsx from 'clsx';

import { pathConfig } from 'config/routes';

const useStyles = makeStyles(theme => ({
    header: {
        paddingBottom: theme.spacing(2),
    },
    link: {
        display: 'flex',
        fontSize: '0.8rem',
    },
    icon: {
        marginRight: theme.spacing(0.5),
        width: 20,
        height: 20,
    },
}));

const TestTagHeader = (
    /* istanbul ignore next*/ {
        departmentText = '',
        requiredText = '',
        breadcrumbs = [],
        className = '',
        ...props
    } = {},
) => {
    const classes = useStyles();

    return (
        <Box className={clsx([classes.header, className])} data-testid="tntHeader" {...props}>
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
            {!!breadcrumbs && breadcrumbs?.length > 0 && (
                <Breadcrumbs aria-label="breadcrumb">
                    <Link
                        color="inherit"
                        to={`${pathConfig.admin.testntagdashboard}?user=uqtesttag`}
                        className={classes.link}
                        data-testid="breadcrumbLinkDashboard"
                    >
                        <HomeIcon className={classes.icon} />
                        Dashboard
                    </Link>
                    {breadcrumbs.map(breadcrumb => {
                        return breadcrumb.link ? (
                            <Link
                                color="inherit"
                                to={`${breadcrumb.link}?user=uqtesttag`}
                                className={classes.link}
                                key={`breadcrumbLink${breadcrumb.title}`}
                                data-testid={`breadcrumbLink${breadcrumb.title}`}
                            >
                                {breadcrumb?.icon ? (
                                    <Icon fontSize={'small'} className={classes.icon}>
                                        {breadcrumb.icon}
                                    </Icon>
                                ) : (
                                    <></>
                                )}
                                {breadcrumb.title}
                            </Link>
                        ) : (
                            <Typography
                                color="textPrimary"
                                className={classes.link}
                                key={`breadcrumbLink${breadcrumb.title}`}
                            >
                                {breadcrumb?.icon ? <Icon className={classes.icon}>{breadcrumb.icon}</Icon> : <></>}
                                {breadcrumb.title}
                            </Typography>
                        );
                    })}
                </Breadcrumbs>
            )}
        </Box>
    );
};

TestTagHeader.propTypes = {
    departmentText: PropTypes.string.isRequired,
    breadcrumbs: PropTypes.array,
    className: PropTypes.string,
    requiredText: PropTypes.string.isRequired,
};

export default React.memo(TestTagHeader);
