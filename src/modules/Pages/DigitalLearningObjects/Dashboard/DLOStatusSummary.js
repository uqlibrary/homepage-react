import React from 'react';
import { Box, Typography, Grid, Divider } from '@mui/material';
import { getUserPostfix } from '../../Admin/DigitalLearningObjects/dlorAdminHelpers';
import PropTypes from 'prop-types';

const statusConfig = [
    { label: 'New / Draft', key: 'new_objects', color: '#1976d2', param: 'new' },
    { label: 'Published', key: 'published_objects', color: '#388e3c', param: 'current' },
    { label: 'Rejected', key: 'rejected_objects', color: '#d32f2f', param: 'rejected' },
    { label: 'Deprecated', key: 'deprecated_objects', color: '#ca930a', param: 'deprecated' },
    { label: 'User Submitted', key: 'user_submitted_objects', color: '#7b1fa2', param: 'usersubmitted' },
];

function buildDLOStatusUrl(param) {
    // helper function to preserve dloradmn context between pages. Local only - not used on stage or prod.
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

const DLOStatusSummary = ({ data }) => (
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
            {statusConfig.map((status, idx) => (
                <React.Fragment key={status.key}>
                    <Grid item xs zeroMinWidth sx={{ p: 0, m: 0 }}>
                        <Box sx={{ textAlign: 'center', p: 0, m: 0 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: status.color,
                                    fontWeight: 600,
                                    fontSize: '1.5rem',
                                    lineHeight: 1,
                                    m: 0,
                                    p: 0,
                                }}
                                data-testid={`count-${status.key}`}
                            >
                                <a
                                    href={buildDLOStatusUrl(status.param)}
                                    style={{ textDecoration: 'none', color: status.color }}
                                    aria-label={`View ${status.label} objects`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {data?.[status.key] ?? 0}
                                </a>
                            </Typography>
                            <Typography
                                variant="caption"
                                color="textSecondary"
                                sx={{ fontSize: '0.8rem', lineHeight: 1, m: 0, p: 0 }}
                            >
                                {status.label}
                            </Typography>
                        </Box>
                    </Grid>
                    {idx < statusConfig.length - 1 && <Divider orientation="vertical" flexItem sx={{ mx: 0, my: 0 }} />}
                </React.Fragment>
            ))}
        </Grid>
    </Box>
);

DLOStatusSummary.propTypes = {
    data: PropTypes.object,
};

export default DLOStatusSummary;
