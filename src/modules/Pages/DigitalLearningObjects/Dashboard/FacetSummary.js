import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Grid, Paper, Divider, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { getUserPostfix } from '../../Admin/DigitalLearningObjects/dlorAdminHelpers';
function buildFacetSummaryUrl(filterId) {
    const baseUrl = '/digital-learning-hub';
    const postfix = getUserPostfix();
    let url = baseUrl;
    if (postfix) {
        url += postfix;
    }
    if (url.includes('?')) {
        url += `&filters=${encodeURIComponent(filterId)}`;
    } else {
        url += `?filters=${encodeURIComponent(filterId)}`;
    }
    return url;
}

function getTopEntries(arr, topN = 5) {
    if (!Array.isArray(arr)) return [];
    return arr
        .filter(item => typeof item.count === 'number' && item.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, topN);
}

export default function FacetSummary({ objectsByFacet }) {
    const {
        objects_by_topic = [],
        objects_by_audience = [],
        objects_by_type = [],
        objects_by_format = [],
        objects_with_cultural_advice = 0,
    } = objectsByFacet || {};

    const topTopics = getTopEntries(objects_by_topic);
    const topAudiences = getTopEntries(objects_by_audience);
    const topTypes = getTopEntries(objects_by_type);
    const topFormats = getTopEntries(objects_by_format);

    return (
        <Box sx={{ mt: 2, mb: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" component="h2" sx={{ mb: 0.05, textAlign: 'center' }}>
                            Top Topics
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.8, textAlign: 'center', mt: 0 }}>
                            Total:{' '}
                            {objects_by_topic.reduce((a, b) => a + (typeof b.count === 'number' ? b.count : 0), 0)}
                        </Typography>
                        <Divider sx={{ my: 0.5, background: '#f5f5f5' }} />
                        {topTopics.map(item => (
                            <Link
                                key={item.id || item.name}
                                component={RouterLink}
                                to={buildFacetSummaryUrl(item.id)}
                                underline="hover"
                                variant="body2"
                                sx={{ display: 'block', mb: 0.5 }}
                            >
                                {item.name}: {item.count}
                            </Link>
                        ))}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" component="h2" sx={{ mb: 0.05, textAlign: 'center' }}>
                            Top Audiences
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.8, textAlign: 'center', mt: 0 }}>
                            Total:{' '}
                            {objects_by_audience.reduce((a, b) => a + (typeof b.count === 'number' ? b.count : 0), 0)}
                        </Typography>
                        <Divider sx={{ my: 0.5, background: '#f5f5f5' }} />
                        {topAudiences.map(item => (
                            <Link
                                key={item.id || item.name}
                                component={RouterLink}
                                to={buildFacetSummaryUrl(item.id)}
                                underline="hover"
                                variant="body2"
                                sx={{ display: 'block', mb: 0.5 }}
                            >
                                {item.name}: {item.count}
                            </Link>
                        ))}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" component="h2" sx={{ mb: 0.05, textAlign: 'center' }}>
                            Top Types
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.8, textAlign: 'center', mt: 0 }}>
                            Total:{' '}
                            {objects_by_type.reduce((a, b) => a + (typeof b.count === 'number' ? b.count : 0), 0)}
                        </Typography>
                        <Divider sx={{ my: 0.5, background: '#f5f5f5' }} />
                        {topTypes.map(item => (
                            <Link
                                key={item.id || item.name}
                                component={RouterLink}
                                to={buildFacetSummaryUrl(item.id)}
                                underline="hover"
                                variant="body2"
                                sx={{ display: 'block', mb: 0.5 }}
                            >
                                {item.name}: {item.count}
                            </Link>
                        ))}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" component="h2" sx={{ mb: 0.05, textAlign: 'center' }}>
                            Top Formats
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.8, textAlign: 'center', mt: 0 }}>
                            Total:{' '}
                            {objects_by_format.reduce((a, b) => a + (typeof b.count === 'number' ? b.count : 0), 0)}
                        </Typography>
                        <Divider sx={{ my: 0.5, background: '#f5f5f5' }} />
                        {topFormats.map(item => (
                            <Link
                                key={item.id || item.name}
                                component={RouterLink}
                                to={buildFacetSummaryUrl(item.id)}
                                underline="hover"
                                variant="body2"
                                sx={{ display: 'block', mb: 0.5 }}
                            >
                                {item.name}: {item.count}
                            </Link>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

FacetSummary.propTypes = {
    objectsByFacet: PropTypes.shape({
        objects_by_topic: PropTypes.object,
        objects_by_audience: PropTypes.object,
        objects_by_type: PropTypes.object,
        objects_by_format: PropTypes.object,
        objects_with_cultural_advice: PropTypes.number,
    }).isRequired,
};
