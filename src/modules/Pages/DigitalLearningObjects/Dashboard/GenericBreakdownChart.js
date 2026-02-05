import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';

function generatePurpleShades(dataArr) {
    const minLightness = 30;
    const maxLightness = 85;
    const hue = 270;
    const saturation = 80;
    const n = dataArr.length;
    if (n === 0) return [];
    const sortedIndices = dataArr
        .map((v, i) => ({ v, i }))
        .sort((a, b) => b.v - a.v)
        .map(obj => obj.i);
    const lightnessSteps =
        n === 1
            ? [minLightness]
            : Array.from({ length: n }, (_, idx) => minLightness + ((maxLightness - minLightness) * idx) / (n - 1));
    const colors = [];
    for (let rank = 0; rank < n; rank++) {
        const idx = sortedIndices[rank];
        const lightness = lightnessSteps[rank];
        colors[idx] = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }
    return colors;
}

export default function GenericBreakdownChart({ chartData, dataKey, title }) {
    const [showLegend, setShowLegend] = useState(false);

    const { labels, dataArr } = useMemo(() => {
        let labels = [];
        let dataArr = [];
        if (dataKey === 'review_status') {
            const reviewStatus = chartData.review_status || {};
            labels = ['Upcoming', 'Due', 'Overdue'];
            dataArr = [reviewStatus.upcoming || 0, reviewStatus.due || 0, reviewStatus.overdue || 0];
        } else {
            const breakdown = chartData[dataKey] || [];
            if (dataKey === 'team_breakdown') {
                labels = breakdown.map(item => item.team_name);
                dataArr = breakdown.map(item => item.total_objects);
                const totalObjects = chartData.total_objects || 0;
                const sum = dataArr.reduce((a, b) => a + b, 0);
                if (totalObjects > sum) {
                    labels.push('Not Assigned');
                    dataArr.push(totalObjects - sum);
                }
            } else if (dataKey === 'object_type_breakdown') {
                labels = breakdown.map(item => item.object_type_name);
                dataArr = breakdown.map(item => item.object_count);
            } else if (dataKey === 'keyword_breakdown') {
                labels = breakdown.map(item => item.keyword);
                dataArr = breakdown.map(item => item.object_count);
            } else {
                labels = breakdown.map(item => item.label || item.name || '');
                dataArr = breakdown.map(item => item.count || 0);
            }
        }
        return { labels, dataArr };
    }, [chartData, dataKey]);

    const colors = useMemo(() => generatePurpleShades(dataArr), [dataArr]);

    const doughnutData = useMemo(
        () => ({
            labels,
            datasets: [
                {
                    label: title,
                    data: dataArr,
                    backgroundColor: colors,
                    borderColor: colors.map(c => c.replace(')', ', 1)')),
                    borderWidth: 1,
                },
            ],
        }),
        [labels, dataArr, colors, title],
    );

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
                {title}
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
                    data={doughnutData}
                    aria-label={`Doughnut chart showing ${title.toLowerCase()} of digital learning objects`}
                    options={{
                        plugins: {
                            legend: { display: false },
                            title: { display: false, text: title },
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
                    aria-label={showLegend ? `Hide ${title} legend` : `Show ${title} legend`}
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
                        overflowY: 'auto',
                    }}
                >
                    {labels.map((label, idx) => (
                        <Box
                            key={label}
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
                                {label} ({dataArr[idx]})
                            </span>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}

GenericBreakdownChart.propTypes = {
    chartData: PropTypes.object.isRequired,
    dataKey: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};
