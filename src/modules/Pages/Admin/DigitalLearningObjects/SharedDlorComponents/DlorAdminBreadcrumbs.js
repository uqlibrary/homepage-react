import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';

import { dlorAdminLink } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import VisitHomepage from 'modules/Pages/Admin/DigitalLearningObjects//SharedDlorComponents/VisitHomepage';

const StyledTitleBox = styled(Box)(() => ({
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
}));

export const DlorAdminBreadcrumbs = ({ breadCrumbList }) => {
    return (
        <Grid container spacing={2} sx={{ marginBottom: '25px' }}>
            <Grid item xs={11}>
                <StyledTitleBox>
                    <Typography component={'p'} variant={'h6'} data-testid="dlor-detailpage-sitelabel">
                        <a data-testid="dlor-breadcrumb-admin-homelink" href={dlorAdminLink()}>
                            Digital Learning Hub admin
                        </a>
                        {breadCrumbList.map((b, index) => {
                            const entryId = !!b.id
                                ? `dlor-breadcrumb-${b.id}`
                                : `dlor-breadcrumb${
                                      typeof b.title === 'string'
                                          ? `-${b.title
                                                .trim()
                                                .replace(/  /g, '-')
                                                .replace(/ /g, '-')
                                                .replace(/_/g, '-')
                                                .replace(/"/g, "'")
                                                .replace(/"/g, ':')
                                                .toLowerCase()}`
                                          : /* istanbul ignore next */ ''
                                  }`;
                            const getDataTestid = thetype => {
                                const shortType = thetype === '' ? /* istanbul ignore next */ '' : `-${thetype}`;
                                return `${entryId}${shortType}-${index}`;
                            };
                            return (
                                <>
                                    <ArrowForwardIcon sx={{ height: '15px' }} />
                                    <span key={`breadcrumb-${index}`} key={`${entryId}-span`}>
                                        {!!b.link ? (
                                            <a data-testid={getDataTestid('link')} href={b.link}>
                                                {b.title}
                                            </a>
                                        ) : (
                                            <span data-testid={getDataTestid('label')}>{b.title}</span>
                                        )}
                                    </span>
                                </>
                            );
                        })}
                    </Typography>
                </StyledTitleBox>
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
