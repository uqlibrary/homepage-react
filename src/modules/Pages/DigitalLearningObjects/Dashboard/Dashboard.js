// istanbul ignore file
import React, { useEffect } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import { StandardPage } from '../../../App/components/pages';
import { isDlorAdminUser } from '../../../../helpers/access';
import { getPathRoot } from 'modules/Pages/DigitalLearningObjects/dlorHelpers';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    ArcElement,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import UsageAnalytics from './UsageAnalytics';
import DLOStatusSummary from './DLOStatusSummary';
import GenericBreakdownChart from './GenericBreakdownChart';
import EngagementSummary from './EngagementSummary';
import ObjectManagement from './ObjectManagement';
import FacetSummary from './FacetSummary';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Title);

import PropTypes from 'prop-types';

const StyledTitleBlockDiv = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    marginTop: '16px',
    '& p:first-child': {
        padding: 0,
        fontSize: 16,
        '& a': {
            color: 'rgba(0, 0, 0, 0.87)',
        },
    },
    '& svg': {
        width: 10,
        marginInline: '6px',
    },
    '& > p:nth-child(2)': {
        padding: 0,
    },
}));

const StyledDashboardTitleWrapper = styled('div')(({ theme }) => ({
    marginLeft: -58,
    marginBottom: 24,
    [theme.breakpoints.down('md')]: {
        marginLeft: -20,
        marginBottom: 8,
    },
}));

const StyledDashboardTitle = styled(Typography)(({ theme }) => ({
    color: '#51247A',
    overflowWrap: 'break-word !important',
    maxWidth: 1200,
    width: '90%',
    marginTop: 12,
    marginBottom: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 0,
    [theme.breakpoints.down('md')]: {
        margin: '0 auto 12px auto',
    },
}));

function getTitleBlock(detailTitle = 'Analytics dashboard') {
    return (
        <StyledTitleBlockDiv>
            <Typography component={'p'} variant={'h6'} data-testid="dlor-dashboard-sitelabel">
                <a href={`${getPathRoot()}/digital-learning-hub`}>Find a digital learning object</a>
            </Typography>
            <ArrowForwardIcon />
            <Typography>{detailTitle}</Typography>
        </StyledTitleBlockDiv>
    );
}

export default function Dashboard({ dlorDashboardData, dlorDashboardLoading, dlorDashboardError, actions, account }) {
    useEffect(() => {
        actions.loadDLORDashboard();
    }, [actions]);
    console.log('DLOR DASHBOARD DATA', dlorDashboardData, dlorDashboardLoading, dlorDashboardError);
    if (dlorDashboardLoading || !dlorDashboardData) {
        return (
            <StandardPage>
                {getTitleBlock()}
                <StyledDashboardTitleWrapper>
                    <StyledDashboardTitle component={'h1'} variant={'h4'} data-testid="dlor-dashboard-title">
                        Digital Learning Object Repository - Analytics Dashboard
                    </StyledDashboardTitle>
                </StyledDashboardTitleWrapper>
                <Box sx={{ p: 3 }}>Loading Analytics Charts...</Box>
            </StandardPage>
        );
    } else {
        return (
            <StandardPage>
                {getTitleBlock()}
                <StyledDashboardTitleWrapper>
                    <StyledDashboardTitle component={'h1'} variant={'h4'} data-testid="dlor-dashboard-title">
                        Digital Learning Object Repository - Analytics Dashboard
                    </StyledDashboardTitle>
                </StyledDashboardTitleWrapper>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Accordion defaultExpanded sx={{ background: 'rgba(120, 90, 200, 0.08)', borderRadius: 2 }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="site-stats-content"
                                id="site-stats-header"
                            >
                                <Typography variant="h6">Site Statistics</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <DLOStatusSummary data={dlorDashboardData} />
                                <Box sx={{ mt: 2 }}>
                                    <UsageAnalytics usageData={dlorDashboardData} />
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                    <Grid item xs={12}>
                        <Accordion defaultExpanded sx={{ background: 'rgba(120, 90, 200, 0.08)', borderRadius: 2 }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="object-analytics-content"
                                id="object-analytics-header"
                            >
                                <Typography variant="h6">Object Breakdown</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} data-testid="engagement-summary-section">
                                        <EngagementSummary data={dlorDashboardData} />
                                    </Grid>

                                    {/* Only show Team Breakdown chart for DLOR admin */}
                                    {isDlorAdminUser(account) && (
                                        <Grid item xs={6} md={3} data-testid="team-breakdown-chart-section">
                                            <GenericBreakdownChart
                                                chartData={dlorDashboardData}
                                                dataKey="team_breakdown"
                                                title="Team Breakdown"
                                            />
                                        </Grid>
                                    )}

                                    <Grid
                                        item
                                        xs={6}
                                        md={isDlorAdminUser(account) ? 3 : 4}
                                        data-testid="object-types-chart-section"
                                    >
                                        <GenericBreakdownChart
                                            chartData={dlorDashboardData}
                                            dataKey="object_type_breakdown"
                                            title="Object Types"
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={6}
                                        md={isDlorAdminUser(account) ? 3 : 4}
                                        data-testid="keywords-chart-section"
                                    >
                                        <GenericBreakdownChart
                                            chartData={dlorDashboardData}
                                            dataKey="keyword_breakdown"
                                            title="Keywords"
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={6}
                                        md={isDlorAdminUser(account) ? 3 : 4}
                                        data-testid="review-status-chart-section"
                                    >
                                        <GenericBreakdownChart
                                            chartData={dlorDashboardData}
                                            dataKey="review_status"
                                            title="Review Status"
                                        />
                                    </Grid>
                                    <Grid item xs={12} data-testid="object-management-section">
                                        <ObjectManagement data={dlorDashboardData} />
                                    </Grid>
                                    <Grid item xs={12} data-testid="facet-summary-section">
                                        {dlorDashboardData?.objects_by_facet && (
                                            <FacetSummary objectsByFacet={dlorDashboardData.objects_by_facet} />
                                        )}
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>
            </StandardPage>
        );
    }
}

Dashboard.propTypes = {
    dlorDashboardData: PropTypes.object,
    dlorDashboardLoading: PropTypes.bool,
    dlorDashboardError: PropTypes.any,
    actions: PropTypes.shape({
        loadDLORDashboard: PropTypes.func.isRequired,
    }).isRequired,
    account: PropTypes.object,
};
