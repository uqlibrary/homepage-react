import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import Icon from '@mui/material/Icon';
import HomeIcon from '@mui/icons-material/Home';

const componentId = 'test_tag_header';

import { pathConfig } from '../../../../../../config/pathConfig';

const StyledBox = styled(Box)(({ theme }) => ({
    paddingBottom: theme.spacing(2),

    '& .link': {
        display: 'flex',
        fontSize: '0.875rem',
    },
    '& .icon': {
        marginRight: theme.spacing(0.5),
        width: 20,
        height: 20,
        fontSize: '1rem',
    },
}));

const TestTagHeader = (
    /* istanbul ignore next*/ { departmentText = '', breadcrumbs = [], className = '', ...props } = {},
) => {
    return (
        <StyledBox className={`header ${className}`} id={componentId} data-testid={componentId} {...props}>
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
                        className={'link'}
                        id={`${componentId}-navigation-dashboard`}
                        data-testid={`${componentId}-navigation-dashboard`}
                    >
                        <HomeIcon
                            className={'icon'}
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
                                className={'link'}
                                key={`breadcrumbLink-${normalisedTitle}`}
                                id={`${componentId}-navigation-${normalisedTitle}`}
                                data-testid={`${componentId}-navigation-${normalisedTitle}`}
                            >
                                {breadcrumb?.icon && index < breadcrumbs.length - 1 ? (
                                    <Icon
                                        className={'icon'}
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
                                className={'link'}
                                key={`breadcrumbLink-${normalisedTitle}`}
                                id={`${componentId}-navigation-current-page`}
                                data-testid={`${componentId}-navigation-current-page`}
                            >
                                {breadcrumb?.icon && index < breadcrumbs.length - 1 ? (
                                    <Icon
                                        className={'icon'}
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
        </StyledBox>
    );
};

TestTagHeader.propTypes = {
    departmentText: PropTypes.string,
    breadcrumbs: PropTypes.array,
    className: PropTypes.string,
};

export default React.memo(TestTagHeader);
