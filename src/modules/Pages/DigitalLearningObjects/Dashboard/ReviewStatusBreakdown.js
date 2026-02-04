import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';

/**
 * ReviewStatusBreakdown - Donut/Bar chart for review status breakdown with show/hideable legend and consistent styling.
 * @param {Object} props
 * @param {Object} props.chartData - Chart.js data object
 * @param {Object[]} props.reviewStatusBreakdown - Array of { label, value }
 * @param {string[]} props.colors - Array of color strings for chart slices
 * @param {Object} props.options - Chart.js options object
 * @param {string|number} props.height - Height for the chart container
 */
export default function ReviewStatusBreakdown({ chartData, reviewStatusBreakdown, colors, options, height }) {
    const [showLegend, setShowLegend] = useState(false);

    return (
        <Box
            sx={{
                border: '1px solid #eee',
                p: 1.25,
                textAlign: 'center',
                background: '#fafaff',
                borderRadius: 2,
                boxShadow: '0 2px 8px 0 rgba(120, 90, 200, 0.10)',
            }}
        >
            <Typography variant="h6" component="h2" gutterBottom={false} sx={{ mb: 1 }}>
                Review Status
            </Typography>
            <Box
                sx={{
                    height: '140px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                }}
            >
                <Doughnut
                    data={chartData}
                    options={{
                        plugins: {
                            legend: { display: false },
                            title: { display: false },
                        },
                        cutout: '70%',
                        maintainAspectRatio: false,
                        // Remove all axes for a pure donut
                        scales: undefined,
                    }}
                    aria-label="Doughnut chart showing review status breakdown of digital learning objects"
                />
            </Box>
            <Box sx={{ mt: 0.5, textAlign: 'right' }}>
                <button
                    style={{
                        fontSize: '0.8rem',
                        background: 'none',
                        border: 'none',
                        color: '#1976d2',
                        cursor: 'pointer',
                        padding: 0,
                        marginBottom: '0px',
                    }}
                    onClick={() => setShowLegend(v => !v)}
                    aria-label={showLegend ? 'Hide review status legend' : 'Show review status legend'}
                >
                    {showLegend ? 'Hide Legend' : 'Show Legend'}
                </button>
            </Box>
            {showLegend && (
                <Box
                    sx={{
                        mt: 0.25,
                        mb: 0.25,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        fontSize: '0.78em',
                        color: '#444',
                        background: 'rgba(255,255,255,0.97)',
                        borderRadius: '8px',
                        boxShadow: 1,
                        p: 1,
                        maxHeight: '100px',
                        overflowY: 'auto',
                    }}
                >
                    {reviewStatusBreakdown.map((item, idx) => (
                        <Box
                            key={item.label}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                mb: 0.25,
                                gap: 0.5,
                                width: '100%',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {colors && colors[idx] && (
                                <Box
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        backgroundColor: colors[idx],
                                        borderRadius: '2px',
                                        display: 'inline-block',
                                        mr: 0.5,
                                        flexShrink: 0,
                                    }}
                                />
                            )}
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.label} ({item.value})
                            </span>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}
