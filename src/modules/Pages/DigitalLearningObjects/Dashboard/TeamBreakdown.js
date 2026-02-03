import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import PropTypes from 'prop-types';

export default function TeamBreakdown({ chartData, teamBreakdown, colors }) {
    const [showLegend, setShowLegend] = useState(false);

    return (
        <Box sx={{ border: '1px solid #eee', p: 2, textAlign: 'center' }}>
            <Typography variant="h6" component="h2" gutterBottom>
                Team Breakdown
            </Typography>
            <Box
                sx={{
                    height: '220px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                }}
            >
                <Doughnut
                    data={chartData}
                    aria-label="Doughnut chart showing team breakdown of digital learning objects"
                    options={{
                        plugins: {
                            legend: { display: false },
                            title: { display: false, text: 'Objects by Team (Including Not Assigned)' },
                        },
                        cutout: '70%',
                        maintainAspectRatio: false,
                    }}
                />
            </Box>
            <Box sx={{ mt: 1, textAlign: 'right' }}>
                <button
                    style={{
                        fontSize: '0.8rem',
                        background: 'none',
                        border: 'none',
                        color: '#1976d2',
                        cursor: 'pointer',
                        padding: 0,
                        marginBottom: '2px',
                    }}
                    onClick={() => setShowLegend(v => !v)}
                    aria-label={showLegend ? 'Hide team legend' : 'Show team legend'}
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
                    {teamBreakdown.map((team, idx) => (
                        <Box
                            key={team.team_name}
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
                                {team.team_name} ({team.total_objects})
                            </span>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}

TeamBreakdown.propTypes = {
    chartData: PropTypes.object.isRequired,
    teamBreakdown: PropTypes.arrayOf(
        PropTypes.shape({
            team_name: PropTypes.string.isRequired,
            total_objects: PropTypes.number.isRequired,
        }),
    ).isRequired,
    colors: PropTypes.arrayOf(PropTypes.string),
};
