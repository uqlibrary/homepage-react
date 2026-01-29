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

/**
 * Fills missing dates in a usage data array with zero-usage entries.
 * @param {Array} data - Array of usage objects with activity_date.
 * @param {string} startDate - Inclusive start date (YYYY-MM-DD).
 * @param {string} endDate - Inclusive end date (YYYY-MM-DD).
 * @returns {Array} New array with all dates in range, missing dates filled with zero usage.
 */
function fillMissingDates(data, startDate, endDate) {
    const dateSet = new Set(data.map(d => d.activity_date));
    const result = [];
    const current = new Date(startDate);
    const end = new Date(endDate);
    while (current <= end) {
        const dateStr = current.toISOString().slice(0, 10);
        const found = data.find(d => d.activity_date === dateStr);
        if (found) {
            result.push(found);
        } else {
            result.push({
                activity_date: dateStr,
                total_views: 0,
                viewers_by_group: [],
            });
        }
        current.setDate(current.getDate() + 1);
    }
    return result;
}

export default function UsageAnalytics({ usageData }) {
    const allGroupsStable = getAllUserGroups(usageData);
    const groupColorMap = getGroupColorMap(allGroupsStable);

    // Date range state
    const allDates = usageData.map(d => d.activity_date);
    const minDate = allDates[0];
    const maxDate = allDates[allDates.length - 1];
    const defaultStartDate = allDates.length > 6 ? allDates[allDates.length - 7] : minDate;
    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(maxDate);

    // Fill missing dates for the entire dataset range, not just the selected range
    const globalMinDate = usageData[0]?.activity_date;
    const globalMaxDate = usageData[usageData.length - 1]?.activity_date;
    const filledUsageData = fillMissingDates(usageData, globalMinDate, globalMaxDate);

    // Now filter for the selected range
    const filteredUsageData = filledUsageData.filter(d => d.activity_date >= startDate && d.activity_date <= endDate);

    // Calculate previous period range using the full filledUsageData
    const dateToIndex = Object.fromEntries(filledUsageData.map((d, i) => [d.activity_date, i]));
    const startIdx = dateToIndex[startDate];
    const endIdx = dateToIndex[endDate];
    const periodLength = endIdx - startIdx + 1;
    const prevStartIdx = startIdx - periodLength;
    const prevEndIdx = startIdx - 1;
    let prevPeriodData = [];
    if (prevStartIdx >= 0 && prevEndIdx >= 0) {
        prevPeriodData = filledUsageData.slice(prevStartIdx, prevEndIdx + 1);
    }
    // Per-group totals for previous period
    const prevGroupTotals = {};
    // Ensure all groups are initialized to 0
    allGroupsStable.forEach(group => {
        prevGroupTotals[group] = 0;
    });
    prevPeriodData.forEach(day => {
        day.viewers_by_group.forEach(g => {
            prevGroupTotals[g.user_group] += g.total;
        });
    });

    // Filter usage data by date range (already declared above)
    // const filteredUsageData = filledUsageData.filter(d => d.activity_date >= startDate && d.activity_date <= endDate);
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
                    <Typography variant="subtitle2" sx={{ color: '#ef4444', fontSize: 11, mb: 1 }}>
                        {/* DEBUG PANEL: Remove after diagnosis */}
                        Debug: prevPeriodData.length={prevPeriodData.length}, periodLength={periodLength}
                        <br />
                        prevGroupTotals: {JSON.stringify(prevGroupTotals)}
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, mt: 0.25, mb: 0, listStyle: 'none', p: 0 }}>
                        {allUserGroupsForSummary.map(group => {
                            const count = groupTotals[group] || 0;
                            const prevCount = prevGroupTotals[group] || 0;
                            let groupPercent = 0;
                            // Always show trend, even if no previous period
                            if (prevPeriodData.length === periodLength) {
                                if (prevCount > 0) {
                                    groupPercent = ((count - prevCount) / prevCount) * 100;
                                } else if (prevCount === 0 && count > 0) {
                                    groupPercent = 100;
                                } else if (prevCount > 0 && count === 0) {
                                    groupPercent = -100;
                                } else {
                                    groupPercent = 0;
                                }
                            } else {
                                // Not enough previous data: show N/A or 0%
                                groupPercent = null;
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
                                                    <span
                                                        style={{
                                                            color:
                                                                groupPercent === null
                                                                    ? '#64748b'
                                                                    : groupPercent < 0
                                                                    ? '#ef4444'
                                                                    : groupPercent > 0
                                                                    ? '#10b981'
                                                                    : '#64748b',
                                                            fontWeight: 600,
                                                            marginLeft: 6,
                                                            fontSize: 11,
                                                        }}
                                                    >
                                                        {groupPercent === null
                                                            ? '(N/A)'
                                                            : `(${groupPercent > 0 ? '+' : ''}${groupPercent.toFixed(
                                                                  1,
                                                              )}%)`}
                                                    </span>
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
