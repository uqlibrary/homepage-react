// istanbul ignore file
import React from 'react';
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

import { dashboardSiteUsage } from '../../../../data/mock/data/dlor/dashboardSiteUsage';

import UsageAnalytics from './UsageAnalytics';
import DLOStatusSummary from './DLOStatusSummary';
import GenericBreakdownChart from './GenericBreakdownChart';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Title);

export default function Dashboard() {
    if (!dashboardSiteUsage) {
        return <Box sx={{ p: 3 }}>Loading Analytics Charts...</Box>;
    }

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
                            <DLOStatusSummary data={dashboardSiteUsage} />
                            <Box sx={{ mt: 2 }}>
                                <UsageAnalytics usageData={dashboardSiteUsage} />
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
                                <Grid item xs={12} md={3}>
                                    <GenericBreakdownChart
                                        chartData={dashboardSiteUsage}
                                        dataKey="team_breakdown"
                                        title="Team Breakdown"
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <GenericBreakdownChart
                                        chartData={dashboardSiteUsage}
                                        dataKey="object_type_breakdown"
                                        title="Object Types"
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <GenericBreakdownChart
                                        chartData={dashboardSiteUsage}
                                        dataKey="keyword_breakdown"
                                        title="Keywords"
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <GenericBreakdownChart
                                        chartData={dashboardSiteUsage}
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
