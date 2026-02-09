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
/* istanbul ignore next */
function getTopEntries(arr, topN = 5) {
    if (!Array.isArray(arr)) return [];
    return arr
        .filter(item => typeof item.count === 'number' && item.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, topN);
}

export default function FacetSummary({ objectsByFacet }) {
    const { objectsByTopic = [], objectsByAudience = [], objectsByType = [], objectsByFormat = [] } =
        objectsByFacet || {};

    console.log('Objects by facet:', objectsByFacet); // Debug log to check data structure

    const topTopics = getTopEntries(objectsByTopic);
    const topAudiences = getTopEntries(objectsByAudience);
    const topTypes = getTopEntries(objectsByType);
    const topFormats = getTopEntries(objectsByFormat);

    return (
        <Box sx={{ mt: 2, mb: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" component="h2" sx={{ mb: 0.05, textAlign: 'center' }}>
                            Top Topics
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.8, textAlign: 'center', mt: 0 }}>
                            Total: {objectsByTopic.reduce((a, b) => a + (typeof b.count === 'number' ? b.count : 0), 0)}
                        </Typography>
                        <Divider sx={{ my: 0.5, background: '#f5f5f5' }} />
                        {topTopics.map(item => (
                            <Link
                                key={item.id || /* istanbul ignore next */ item.name}
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
                            {objectsByAudience.reduce(
                                (a, b) => a + (typeof b.count === 'number' ? b.count : /* istanbul ignore next */ 0),
                                0,
                            )}
                        </Typography>
                        <Divider sx={{ my: 0.5, background: '#f5f5f5' }} />
                        {topAudiences.map(item => (
                            <Link
                                key={item.id || /* istanbul ignore next */ item.name}
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
                            {objectsByType.reduce(
                                (a, b) => a + (typeof b.count === 'number' ? b.count : /* istanbul ignore next */ 0),
                                0,
                            )}
                        </Typography>
                        <Divider sx={{ my: 0.5, background: '#f5f5f5' }} />
                        {topTypes.map(item => (
                            <Link
                                key={item.id || /* istanbul ignore next */ item.name}
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
                            {objectsByFormat.reduce(
                                (a, b) => a + (typeof b.count === 'number' ? b.count : /* istanbul ignore next */ 0),
                                0,
                            )}
                        </Typography>
                        <Divider sx={{ my: 0.5, background: '#f5f5f5' }} />
                        {topFormats.map(item => (
                            <Link
                                key={item.id || /* istanbul ignore next */ item.name}
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
        objectsByTopic: PropTypes.array,
        objectsByAudience: PropTypes.array,
        objectsByType: PropTypes.array,
        objectsByFormat: PropTypes.array,
        objectsWithCulturalAdvice: PropTypes.number,
    }),
};
