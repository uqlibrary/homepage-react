import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Checkbox, FormControlLabel, TextField, Stack, Button, Grid } from '@mui/material';
import { Line } from 'react-chartjs-2';

// Helper to format date as DD/MM/YYYY in Australia/Brisbane timezone
function formatDateBrisbane(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00+10:00');
    return new Intl.DateTimeFormat('en-AU', {
        timeZone: 'Australia/Brisbane',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(date);
}

const groupColors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e42', // orange
    '#ef4444', // red
    '#a855f7', // purple
    '#fbbf24', // yellow
    '#6366f1', // indigo
    '#14b8a6', // teal
    '#eab308', // gold
    '#64748b', // gray
];

// Returns a map: group name -> color (stable across date ranges)
function getGroupColorMap(allGroups) {
    const map = {};
    allGroups.forEach((group, idx) => {
        map[group] = groupColors[(idx + 1) % groupColors.length];
    });
    return map;
}

function getAllUserGroups(data) {
    const groups = Array.from(new Set(data.flatMap(d => d.viewers_by_group.map(g => g.user_group))));
    const guestLabel = 'NOT LOGGED IN';
    const sorted = groups.filter(g => g !== guestLabel).sort((a, b) => a.localeCompare(b));
    if (groups.includes(guestLabel)) sorted.push(guestLabel);
    return sorted;
}

function getUsageData(filteredData, visibleGroups, groupColorMap) {
    const allUserGroups = getAllUserGroups(filteredData);
    return {
        labels: filteredData.map(d => formatDateBrisbane(d.activity_date)),
        datasets: [
            {
                label: 'Total Views',
                data: filteredData.map(d => d.total_views),
                borderColor: '#3b82f6',
                backgroundColor: '#3b82f6',
                tension: 0.2,
                borderWidth: 3,
                pointRadius: 4,
                order: 0,
                hidden: false,
            },
            ...allUserGroups.map(group => ({
                label: group,
                data: filteredData.map(d => {
                    const found = d.viewers_by_group.find(g => g.user_group === group);
                    return found ? found.total : 0;
                }),
                borderColor: groupColorMap[group] || '#64748b',
                backgroundColor: groupColorMap[group] || '#64748b',
                tension: 0.15,
                borderDash: [4, 2],
                borderWidth: 2,
                pointRadius: 3,
                hidden: !visibleGroups[group],
            })),
        ],
    };
}

const chartOptions = {
    responsive: true,
    plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false },
    },
    scales: {
        x: {
            ticks: {
                color: '#64748b',
                maxRotation: 45,
                minRotation: 45,
                font: { size: 11 },
            },
            grid: { display: false },
        },
        y: {
            beginAtZero: true,
            ticks: { color: '#64748b', font: { size: 11 } },
        },
    },
};

export default function UsageAnalytics({ usageData }) {
    const allGroupsStable = getAllUserGroups(usageData);
    const groupColorMap = getGroupColorMap(allGroupsStable);

    const allDates = usageData.map(d => d.activity_date);
    const minDate = allDates[0];
    const maxDate = allDates[allDates.length - 1];
    const defaultStartDate = allDates.length > 6 ? allDates[allDates.length - 7] : minDate;
    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(maxDate);

    const dateToIndex = Object.fromEntries(allDates.map((d, i) => [d, i]));
    const startIdx = dateToIndex[startDate];
    const endIdx = dateToIndex[endDate];
    const periodLength = endIdx - startIdx + 1;
    const prevStartIdx = startIdx - periodLength;
    const prevEndIdx = startIdx - 1;
    let prevPeriodData = [];
    if (prevStartIdx >= 0 && prevEndIdx >= 0) {
        prevPeriodData = usageData.slice(prevStartIdx, prevEndIdx + 1);
    }

    const prevGroupTotals = {};
    prevPeriodData.forEach(day => {
        day.viewers_by_group.forEach(g => {
            prevGroupTotals[g.user_group] = (prevGroupTotals[g.user_group] || 0) + g.total;
        });
    });

    const filteredUsageData = usageData.filter(d => d.activity_date >= startDate && d.activity_date <= endDate);
    const allUserGroups = getAllUserGroups(filteredUsageData);
    const [visibleGroups, setVisibleGroups] = useState(() => {
        const initial = {};
        allUserGroups.forEach(g => {
            initial[g] = false;
        });
        return initial;
    });
    const handleGroupToggle = group => {
        setVisibleGroups(prev => ({ ...prev, [group]: !prev[group] }));
    };

    const chartData = getUsageData(filteredUsageData, visibleGroups, groupColorMap);

    const groupTotals = {};
    let total = 0;
    filteredUsageData.forEach(day => {
        day.viewers_by_group.forEach(g => {
            groupTotals[g.user_group] = (groupTotals[g.user_group] || 0) + g.total;
            total += g.total;
        });
    });

    const totalSelected = Object.entries(groupTotals)
        .filter(([group]) => visibleGroups[group])
        .reduce((sum, [, count]) => sum + count, 0);
    const allUserGroupsForSummary = allGroupsStable;

    const groupPeakDay = {};
    allUserGroupsForSummary.forEach(group => {
        let max = 0;
        let peakDate = '';
        filteredUsageData.forEach(day => {
            const found = day.viewers_by_group.find(g => g.user_group === group);
            if (found && found.total > max) {
                max = found.total;
                peakDate = day.activity_date;
            }
        });
        groupPeakDay[group] = max > 0 ? formatDateBrisbane(peakDate) : '';
    });
    return (
        <>
            <Grid item xs={12} md={8}>
                <Box
                    sx={{
                        border: '1px solid #eee',
                        p: 2,
                        textAlign: 'center',
                        height: '440px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                    }}
                >
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        alignItems="center"
                        sx={{ mb: 1, justifyContent: 'flex-start', width: '100%' }}
                    >
                        <Typography variant="subtitle1" sx={{ minWidth: 120 }}>
                            Usage Date Range:
                        </Typography>
                        <TextField
                            label="Start Date"
                            type="date"
                            size="small"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            inputProps={{ min: minDate, max: endDate }}
                            sx={{ minWidth: 160 }}
                        />
                        <TextField
                            label="End Date"
                            type="date"
                            size="small"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            inputProps={{ min: startDate, max: maxDate }}
                            sx={{ minWidth: 160 }}
                        />
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setStartDate(defaultStartDate);
                                setEndDate(maxDate);
                            }}
                            sx={{ ml: 2 }}
                        >
                            Reset
                        </Button>
                    </Stack>
                    <Box sx={{ flex: 1, minHeight: 0 }}>
                        <Line data={chartData} options={chartOptions} />
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12} md={4}>
                <Box
                    sx={{
                        border: '1px solid #eee',
                        p: 2,
                        height: '440px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        bgcolor: '#f9fafb',
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 0.5, textAlign: 'center' }}>
                        Usage Summary
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, textAlign: 'center', color: '#64748b' }}>
                        Date Range: {formatDateBrisbane(startDate)} to {formatDateBrisbane(endDate)}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.25, textAlign: 'center' }}>
                        Total Users ({total}), Total Selected ({totalSelected})
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, mt: 0.25, mb: 0, listStyle: 'none', p: 0 }}>
                        {allUserGroupsForSummary.map(group => {
                            const count = groupTotals[group] || 0;
                            const prevCount = prevGroupTotals[group] || 0;
                            let groupPercent = null;
                            if (prevPeriodData.length === periodLength && prevCount > 0) {
                                groupPercent = ((count - prevCount) / prevCount) * 100;
                            } else if (prevPeriodData.length === periodLength && prevCount === 0 && count > 0) {
                                groupPercent = 100;
                            } else if (prevPeriodData.length === periodLength && prevCount === 0 && count === 0) {
                                groupPercent = 0;
                            }
                            const color = groupColorMap[group] || '#64748b';
                            const peakDay = groupPeakDay[group];
                            return (
                                <li
                                    key={group}
                                    style={{
                                        marginBottom: 0,
                                        padding: 0,
                                        lineHeight: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        minHeight: 20,
                                    }}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={!!visibleGroups[group]}
                                                onChange={() => handleGroupToggle(group)}
                                                sx={{ p: 0.1, mr: 0.25 }}
                                            />
                                        }
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box
                                                    sx={{
                                                        width: 10,
                                                        height: 10,
                                                        borderRadius: 1,
                                                        bgcolor: color,
                                                        mr: 0.5,
                                                        border: '1px solid #cbd5e1',
                                                    }}
                                                />
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: '#334155',
                                                        fontSize: 11,
                                                        lineHeight: 1,
                                                        p: 0,
                                                        m: 0,
                                                    }}
                                                >
                                                    {group}: <b>{count}</b>
                                                    {typeof groupPercent === 'number' &&
                                                        prevPeriodData.length === periodLength &&
                                                        (() => {
                                                            let percentColor = '#64748b';
                                                            if (groupPercent < 0) percentColor = '#ef4444';
                                                            else if (groupPercent > 0) percentColor = '#10b981';
                                                            return (
                                                                <span
                                                                    style={{
                                                                        color: percentColor,
                                                                        fontWeight: 600,
                                                                        marginLeft: 6,
                                                                        fontSize: 11,
                                                                    }}
                                                                >
                                                                    ({groupPercent > 0 ? '+' : ''}
                                                                    {groupPercent.toFixed(1)}%)
                                                                </span>
                                                            );
                                                        })()}
                                                    {peakDay && (
                                                        <span
                                                            style={{
                                                                color: '#64748b',
                                                                fontWeight: 400,
                                                                marginLeft: 6,
                                                                fontSize: 10,
                                                            }}
                                                        >
                                                            (Peak: {peakDay})
                                                        </span>
                                                    )}
                                                </Typography>
                                            </Box>
                                        }
                                        sx={{ m: 0, p: 0 }}
                                    />
                                </li>
                            );
                        })}
                    </Box>
                </Box>
            </Grid>
        </>
    );
}
UsageAnalytics.propTypes = {
    usageData: PropTypes.arrayOf(
        PropTypes.shape({
            activity_date: PropTypes.string.isRequired,
            total_views: PropTypes.number.isRequired,
            viewers_by_group: PropTypes.arrayOf(
                PropTypes.shape({
                    user_group: PropTypes.string.isRequired,
                    total: PropTypes.number.isRequired,
                }),
            ),
        }),
    ).isRequired,
};
