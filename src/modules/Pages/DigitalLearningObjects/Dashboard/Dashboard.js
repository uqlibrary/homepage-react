// istanbul ignore file
import React, { useEffect } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { StandardPage } from '../../../App/components/pages';

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

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Title);

import PropTypes from 'prop-types';

export default function Dashboard({ dlorDashboardData, dlorDashboardLoading, dlorDashboardError, actions }) {
    useEffect(() => {
        actions.loadDLORDashboard();
    }, [actions]);
    console.log('DLOR DASHBOARD DATA', dlorDashboardData, dlorDashboardLoading, dlorDashboardError);
    if (dlorDashboardLoading || !dlorDashboardData) {
        return (
            <StandardPage title="Digital Learning Object Repository - Analytics Dashboard">
                <Box sx={{ p: 3 }}>Loading Analytics Charts...</Box>
            </StandardPage>
        );
    } else {
        return (
            <StandardPage title="Digital Learning Object Repository - Analytics Dashboard">
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
                                    <Grid item xs={12}>
                                        <EngagementSummary data={dlorDashboardData} />
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <GenericBreakdownChart
                                            chartData={dlorDashboardData}
                                            dataKey="team_breakdown"
                                            title="Team Breakdown"
                                        />
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <GenericBreakdownChart
                                            chartData={dlorDashboardData}
                                            dataKey="object_type_breakdown"
                                            title="Object Types"
                                        />
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <GenericBreakdownChart
                                            chartData={dlorDashboardData}
                                            dataKey="keyword_breakdown"
                                            title="Keywords"
                                        />
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <GenericBreakdownChart
                                            chartData={dlorDashboardData}
                                            dataKey="review_status"
                                            title="Review Status"
                                        />
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
};
