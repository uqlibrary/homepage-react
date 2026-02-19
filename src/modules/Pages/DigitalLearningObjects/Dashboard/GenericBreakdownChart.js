import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';

function generateColorShades(dataArr) {
    const minLightness = 20;
    const maxLightness = 95;
    const purpleHue = 270;
    const blueHue = 220;
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
        const hue = rank % 2 === 0 ? purpleHue : blueHue;
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

    const colors = useMemo(() => generateColorShades(dataArr), [dataArr]);

    const hasData = useMemo(() => {
        if (!Array.isArray(dataArr) || dataArr.length === 0) return false;
        return dataArr.some(value => Number(value) > 0);
    }, [dataArr]);

    const doughnutData = useMemo(
        () => ({
            labels,
            datasets: [
                {
                    label: title,
                    data: dataArr,
                    backgroundColor: colors,
                    borderColor: Array(colors.length).fill('#fefefe'),
                    borderWidth: 2,
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
            <Typography
                variant="h6"
                component="h2"
                gutterBottom={false}
                sx={{ mb: 1 }}
                data-testid="generic-breakdown-chart-title"
            >
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
                {hasData ? (
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
                ) : (
                    <Typography variant="body2" color="text.secondary" data-testid="generic-breakdown-chart-no-data">
                        No Data available
                    </Typography>
                )}
            </Box>
            {hasData && (
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
                        data-testid="generic-breakdown-chart-legend-toggle"
                    >
                        {showLegend ? 'Hide Legend' : 'Show Legend'}
                    </button>
                </Box>
            )}
            {hasData && showLegend && (
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
                            key={label + idx}
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
                            <span
                                style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                                data-testid={`generic-breakdown-chart-label-${idx}`}
                            >
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
