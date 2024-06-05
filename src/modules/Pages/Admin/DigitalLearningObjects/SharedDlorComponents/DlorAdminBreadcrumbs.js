import React from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';

import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';

import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { dlorAdminLink } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import VisitHomepage from 'modules/Pages/Admin/DigitalLearningObjects//SharedDlorComponents/VisitHomepage';

const useStyles = makeStyles(() => ({
    titleBlock: {
        '& p:first-child': {
            display: 'flex',
            alignItems: 'center',
            padding: 0,
            fontSize: 16,
            '& a': {
                color: 'rgba(0, 0, 0, 0.87)',
                textDecoration: 'underline',
            },
        },
    },
}));

export const DlorAdminBreadcrumbs = ({ breadCrumbList }) => {
    const classes = useStyles();

    return (
        <Grid container spacing={2} style={{ marginBottom: 25 }}>
            <Grid item xs={11}>
                <div className={classes.titleBlock}>
                    <Typography component={'p'} variant={'h6'} data-testid="dlor-detailpage-sitelabel">
                        <a data-testid="dlor-breadcrumb--admin-homelink" href={dlorAdminLink()}>
                            Digital Learning Hub admin
                        </a>
                        {breadCrumbList.map((b, index) => {
                            const entryId = !!b.id
                                ? `dlor-breadcrumb--${b.id}`
                                : `dlor-breadcrumb-${
                                      typeof b.title === 'string'
                                          ? `-${b.title
                                                .replace(/ /g, '-')
                                                .replace(/"/g, "'")
                                                .replace(/"/g, ':')
                                                .toLowerCase()}`
                                          : /* istanbul ignore next */ ''
                                  }`;
                            return (
                                <span key={`breadcrumb-${index}`}>
                                    <ArrowForwardIcon style={{ height: 15 }} />
                                    {!!b.link ? (
                                        <a data-testid={`${entryId}-link-${index}`} href={b.link}>
                                            {b.title}
                                        </a>
                                    ) : (
                                        <span data-testid={`${entryId}-label-${index}`}>{b.title}</span>
                                    )}
                                </span>
                            );
                        })}
                    </Typography>
                </div>
            </Grid>
            <Grid item xs={1}>
                <VisitHomepage />
            </Grid>
        </Grid>
    );
};

DlorAdminBreadcrumbs.propTypes = {
    breadCrumbList: PropTypes.array,
};

export default DlorAdminBreadcrumbs;
