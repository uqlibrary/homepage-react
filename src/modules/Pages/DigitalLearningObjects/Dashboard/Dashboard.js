// istanbul ignore file
import React, { useState, useEffect } from 'react';
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

// Mocking data for chart.
import { dashboardSiteUsage } from '../../../../data/mock/data/dlor/dashboardSiteUsage';

import UsageAnalytics from './UsageAnalytics';
import DLOStatusSummary from './DLOStatusSummary';
import TeamBreakdown from './TeamBreakdown';
import ObjectTypeBreakdown from './ObjectTypeBreakdown';
import KeywordBreakdown from './KeywordBreakdown';
import ReviewStatusBreakdown from './ReviewStatusBreakdown';
// ...existing code...

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Title);

// =========================================================
//                     REACT COMPONENT
// =========================================================

export default function Dashboard() {
    if (!dashboardSiteUsage) {
        return <Box sx={{ p: 3 }}>Loading Analytics Charts...</Box>;
    }

    // Determine dynamic heights

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
                {/* 1. Object Distribution Chart - Fixed Stacked */}
                {/* <Grid item xs={12} md={4}>
                    <Box sx={{ border: '1px solid #eee', p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            Object Distribution
                        </Typography>
                        <Box sx={{ height: '100px' }}>
                            {' '}
                            <Bar
                                data={objectData}
                                options={{
                                    ...fixedStackedOptions,
                                    plugins: {
                                        ...fixedStackedOptions.plugins,
                                        title: {
                                            display: true,
                                            text: `Individual Metrics vs. Other Objects (Total: ${totalObjects})`,
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                </Grid> */}
                {/* FEEDBACK - overview of objects */}
                {/* <Grid container>
                    <Grid item xs={12} md={4}>
                        <Bar
                            aria-label="Bar chart showing object distribution metrics"
                            data={objectData}
                            options={{
                                ...fixedStackedOptions,
                                plugins: {
                                    ...fixedStackedOptions.plugins,
                                    title: {
                                        display: true,
                                        text: `Individual Metrics vs. Other Objects (Total: ${totalObjects})`,
                                    },
                                },
                            }}
                        />
                    </Grid>
                </Grid> */}

                {/* 2. Team Breakdown Chart - Fixed Stacked */}

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
                                    <TeamBreakdown chartData={dashboardSiteUsage} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <ObjectTypeBreakdown chartData={dashboardSiteUsage} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <KeywordBreakdown chartData={dashboardSiteUsage} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <ReviewStatusBreakdown chartData={dashboardSiteUsage} />
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </Grid>

                {/* 5. Filter Breakdown Chart - Dynamic Height */}
                {/* {filterData && (
                    <Grid item xs={12} md={4}>
                        <Box sx={{ border: '1px solid #eee', p: 2, textAlign: 'center' }}>
                            <Typography variant="h6" component="h2" gutterBottom>
                                Filter Breakdown
                            </Typography>
                            <Box sx={{ height: filterHeight }}>
                                <Bar
                                    data={filterData}
                                    options={filterOptions}
                                    role="img"
                                    aria-label="Bar chart showing filter breakdown of digital learning objects"
                                />
                            </Box>
                        </Box>
                    </Grid>
                )} */}

                {/* 6. Series Breakdown Chart - Dynamic Height */}
                {/* {seriesData && (
                    <Grid item xs={12} md={4}>
                        <Box sx={{ border: '1px solid #eee', p: 2, textAlign: 'center' }}>
                            <Typography variant="h6" component="h2" gutterBottom>
                                Series Breakdown
                            </Typography>
                            <Box sx={{ height: seriesHeight }}>
                                <Bar
                                    data={seriesData}
                                    options={seriesOptions}
                                    role="img"
                                    aria-label="Bar chart showing series breakdown of digital learning objects"
                                />
                            </Box>
                        </Box>
                    </Grid>
                )} */}
            </Grid>
        </StandardPage>
    );
}
