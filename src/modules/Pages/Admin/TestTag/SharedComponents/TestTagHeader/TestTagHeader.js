import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link } from 'react-router-dom';
import Icon from '@material-ui/core/Icon';
import HomeIcon from '@material-ui/icons/Home';
import clsx from 'clsx';

const componentId = 'test_tag_header';

import { pathConfig } from '../../../../../../config/pathConfig';

const useStyles = makeStyles(theme => ({
    header: {
        paddingBottom: theme.spacing(2),
    },
    link: {
        display: 'flex',
        fontSize: '0.875rem',
    },
    icon: {
        marginRight: theme.spacing(0.5),
        width: 20,
        height: 20,
        fontSize: '1rem',
    },
}));

const TestTagHeader = (
    /* istanbul ignore next*/ { departmentText = '', breadcrumbs = [], className = '', ...props } = {},
) => {
    const classes = useStyles();

    return (
        <Box className={clsx([classes.header, className])} id={componentId} data-testid={componentId} {...props}>
            <Typography component={'h2'} variant={'h5'}>
                {!!departmentText && departmentText.length > 0 ? (
                    departmentText
                ) : (
                    <Skeleton animation="wave" id={`${componentId}-skeleton`} data-testid={`${componentId}-skeleton`} />
                )}
            </Typography>

            {!!breadcrumbs && breadcrumbs?.length > 0 && (
                <Breadcrumbs
                    aria-label="breadcrumb"
                    id={`${componentId}-navigation`}
                    data-testid={`${componentId}-navigation`}
                    separator={<>&rsaquo;</>}
                >
                    <Link
                        color="inherit"
                        to={`${pathConfig.admin.testntagdashboard}`}
                        className={classes.link}
                        id={`${componentId}-navigation-dashboard`}
                        data-testid={`${componentId}-navigation-dashboard`}
                    >
                        <HomeIcon
                            className={classes.icon}
                            id={`${componentId}-navigation-dashboard-icon`}
                            data-testid={`${componentId}-navigation-dashboard-icon`}
                        />
                        Dashboard
                    </Link>
                    {breadcrumbs.map((breadcrumb, index) => {
                        const normalisedTitle = breadcrumb.title.replace(/ /g, '-').toLowerCase();
                        return breadcrumb.link ? (
                            <Link
                                color="inherit"
                                to={`${breadcrumb.link}`}
                                className={classes.link}
                                key={`breadcrumbLink-${normalisedTitle}`}
                                id={`${componentId}-navigation-${normalisedTitle}`}
                                data-testid={`${componentId}-navigation-${normalisedTitle}`}
                            >
                                {breadcrumb?.icon && index < breadcrumbs.length - 1 ? (
                                    <Icon
                                        className={classes.icon}
                                        id={`${componentId}-navigation-${normalisedTitle}-icon`}
                                        data-testid={`${componentId}-navigation-${normalisedTitle}-icon`}
                                    >
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
                                key={`breadcrumbLink-${normalisedTitle}`}
                                id={`${componentId}-navigation-current-page`}
                                data-testid={`${componentId}-navigation-current-page`}
                            >
                                {breadcrumb?.icon && index < breadcrumbs.length - 1 ? (
                                    <Icon
                                        className={classes.icon}
                                        id={`${componentId}-navigation-current-page-icon`}
                                        data-testid={`${componentId}-navigation-current-page-icon`}
                                    >
                                        {breadcrumb.icon}
                                    </Icon>
                                ) : (
                                    <></>
                                )}
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
    departmentText: PropTypes.string,
    breadcrumbs: PropTypes.array,
    className: PropTypes.string,
};

export default React.memo(TestTagHeader);
