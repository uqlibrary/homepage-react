import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Grid, Divider } from '@mui/material';
import { getUserPostfix } from '../../Admin/DigitalLearningObjects/dlorAdminHelpers';

export default function ObjectManagement({ data }) {
    const stats = data?.object_management_stats || {};
    const metrics = [
        {
            label: 'Updated in last 28 days',
            value: stats.last_updated_28_days ?? 0,
            color: '#3b82f6',
            param: 'lastupdated28days',
        },
        {
            label: 'Due for review in next 28 days',
            value: stats.due_review_28_days ?? 0,
            color: '#f59e42',
            param: 'duereview28days',
        },
        {
            label: 'Due to be unpublished',
            value: stats.due_unpublish ?? 0,
            color: '#ef4444',
            param: 'dueunpublish',
        },
    ];

    function buildObjectManagementUrl(param) {
        const baseUrl = '/digital-learning-hub';
        const postfix = getUserPostfix();
        let url = baseUrl;
        if (postfix) {
            url += postfix;
        }
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
                                    variant="h6"
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
                                        href={buildObjectManagementUrl(m.param)}
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

ObjectManagement.propTypes = {
    data: PropTypes.object,
};
