import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Grid, Divider } from '@mui/material';
import { getUserPostfix } from '../../Admin/DigitalLearningObjects/dlorAdminHelpers';

export default function EngagementSummary({ data }) {
    const metrics = [
        {
            label: 'Favourited objects',
            value: data.total_favourites ?? 0,
            color: '#f59e42',
            param: 'isafavourite',
        },
        {
            label: 'Subscribed objects',
            value: data.total_subscriptions ?? 0,
            color: '#3b82f6',
            param: 'subscribed',
        },
        {
            label: 'Cultural Advice items',
            value: data.cultural_advice_objects ?? 0,
            color: '#10b981',
            param: 'culturaladvice',
        },
        {
            label: 'Popular objects',
            value: Array.isArray(data.popular_objects) ? data.popular_objects.length : data.popular_objects ?? 0,
            color: '#ef4444',
            param: 'popular',
        },
    ];

    function buildEngagementUrl(param) {
        const baseUrl = '/digital-learning-hub';
        const postfix = getUserPostfix();
        let url = baseUrl;
        if (postfix) {
            url += postfix;
        }

        // Check if there is already a query string
        if (url.includes('?')) {
            url += `&type=${encodeURIComponent(param)}`;
        } else {
            url += `?type=${encodeURIComponent(param)}`;
        }
        return url;
    }
    return (
        <Box
            sx={{
                mt: 1,
                pt: 0.5,
                mb: 0,
                pb: 0,
                px: 0,
                border: '1px solid #eee',
                backgroundColor: '#fafafa',
                borderRadius: 1,
                boxShadow: '0 2px 8px 0 rgba(120, 90, 200, 0.30)',
            }}
        >
            <Grid container spacing={0.5} alignItems="center" justifyContent="center" wrap="nowrap">
                {metrics.map((m, idx) => (
                    <React.Fragment key={m.label}>
                        <Grid item xs zeroMinWidth sx={{ p: 0, m: 0 }}>
                            <Box sx={{ textAlign: 'center', p: 0, m: 0 }}>
                                <Typography
                                    variant="h3"
                                    component="h3"
                                    sx={{
                                        color: m.color,
                                        fontWeight: 600,
                                        fontSize: '1.5rem',
                                        lineHeight: 1,
                                        m: 0,
                                        p: 0,
                                    }}
                                >
                                    <a
                                        href={buildEngagementUrl(m.param)}
                                        style={{ textDecoration: 'none', color: m.color }}
                                        aria-label={`View ${m.label}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {m.value}
                                    </a>
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="textSecondary"
                                    sx={{ fontSize: '0.8rem', lineHeight: 1, m: 0, p: 0 }}
                                >
                                    {m.label}
                                </Typography>
                            </Box>
                        </Grid>
                        {idx < metrics.length - 1 && <Divider orientation="vertical" flexItem sx={{ mx: 0, my: 0 }} />}
                    </React.Fragment>
                ))}
            </Grid>
        </Box>
    );
}
EngagementSummary.propTypes = {
    data: PropTypes.shape({
        total_favourites: PropTypes.number,
        total_subscriptions: PropTypes.number,
        cultural_advice_objects: PropTypes.number,
        popular_objects: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    }).isRequired,
};
