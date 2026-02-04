import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';

/**
 * ObjectTypeBreakdown component
 * Props:
 *   chartData: Chart.js data object for Doughnut chart
 *   objectTypeBreakdown: Array<{ object_type_name: string, object_count: number }>
 *   colors: Array<string> (optional, for legend color indicators)
 */
export default function ObjectTypeBreakdown({ chartData, objectTypeBreakdown, colors }) {
    const [showLegend, setShowLegend] = useState(false);

    return (
        <Box
            sx={{
                border: '1px solid #eee',
                p: 1.25,
                textAlign: 'center',
                backgroundColor: '#fafafa',
                boxShadow: '0 2px 8px 0 rgba(120, 90, 200, 0.10)',
            }}
        >
            <Typography variant="h6" component="h2" gutterBottom={false} sx={{ mb: 1 }}>
                Object Types
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
                    aria-label="Doughnut chart showing object type breakdown of digital learning objects"
                    options={{
                        plugins: {
                            legend: { display: false },
                            title: { display: false, text: 'Objects by Type' },
                        },
                        cutout: '70%',
                        maintainAspectRatio: false,
                    }}
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
                    aria-label={showLegend ? 'Hide object type legend' : 'Show object type legend'}
                >
                    {showLegend ? 'Hide Legend' : 'Show Legend'}
                </button>
            </Box>
            {showLegend && (
                <Box
                    sx={{
                        mt: 0.5,
                        mb: 0.5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        fontSize: '0.78em',
                        color: '#444',
                        background: 'rgba(255,255,255,0.97)',
                        borderRadius: '8px',
                        boxShadow: 1,
                        p: 1,
                        maxHeight: '120px',
                        overflowY: 'auto',
                    }}
                >
                    {objectTypeBreakdown.map((type, idx) => (
                        <Box
                            key={type.object_type_name}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                mb: 0.5,
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
                                {type.object_type_name} ({type.object_count})
                            </span>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}

ObjectTypeBreakdown.propTypes = {
    chartData: PropTypes.object.isRequired,
    objectTypeBreakdown: PropTypes.arrayOf(
        PropTypes.shape({
            object_type_name: PropTypes.string.isRequired,
            object_count: PropTypes.number.isRequired,
        }),
    ).isRequired,
    colors: PropTypes.arrayOf(PropTypes.string),
};
