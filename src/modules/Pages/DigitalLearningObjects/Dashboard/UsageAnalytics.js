import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Checkbox, FormControlLabel, TextField, Stack, Button, Grid } from '@mui/material';
import { Line } from 'react-chartjs-2';

// This component is dedicated to Jack. Farewell, buddy. Good Boy. I love you - Grandpa.

// ## CHART CONFIGURATIONS ##
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
    elements: {
        line: {
            fill: true,
        },
    },
};

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
    '#ff6f91', // pink
    '#00bcd4', // cyan
    '#8bc34a', // light green
    '#ff9800', // deep orange
    '#795548', // brown
    '#64748b', // gray
];

// ## HELPER FUNCTIONS ##
function getTrendDisplay(groupPercent) {
    let trendColor = '#64748b';
    if (groupPercent === null) {
        trendColor = '#64748b';
    } else if (groupPercent < 0) {
        trendColor = '#ef4444';
    } else if (groupPercent > 0) {
        trendColor = '#10b981';
    }
    const trendText = groupPercent === null ? '(N/A)' : `(${groupPercent > 0 ? '+' : ''}${groupPercent.toFixed(1)}%)`;
    return { trendColor, trendText };
}

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
    return {
        labels: filteredData.map(d => formatDateBrisbane(d.activity_date)),
        datasets: [
            {
                label: 'Total Views',
                data: filteredData.map(d => d.total_views),
                borderColor: '#e0e7ef',
                fillColor: 'rgba(59,130,246,0.25)',
                fill: true,
                pointRadius: 0,
                borderWidth: 3,
                hidden: false,
            },
            ...arguments[3].map(group => ({
                label: group === 'public' ? 'Not logged in' : group,
                data: filteredData.map(d => {
                    const found = d.viewers_by_group.find(g => g.user_group === group);
                    return found ? found.total : 0;
                }),
                borderColor: groupColorMap[group] || '#64748b',
                backgroundColor: groupColorMap[group] || '#64748b',
                tension: 0.15,
                borderDash: [],
                borderWidth: 2,
                pointRadius: 0,
                hidden: !visibleGroups[group],
            })),
        ],
    };
}

function fillMissingDates(data, startDate, endDate) {
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

// ## COMPONENT START ##
// Toggle to enable/disable generated mock data for stress testing
const USE_MOCK_DATA = false;

// Mock data generator for 4 years of daily data - This is ONLY for local testing purposes.
function generateMockUsageData() {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 4);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0);
    const groups = [
        'ALUMNI',
        'ATH',
        'COMMU',
        'CWPG',
        'FRYVISITOR',
        'HON',
        'HOSP',
        'ICTE',
        'LIBRARYSTAFFB',
        'REMRHD',
        'REMUG',
        'RHD',
        'STAFF',
        'UG',
        'public',
    ];
    const nonPublicGroups = groups.filter(g => g !== 'public');
    const data = [];
    const current = new Date(startDate);
    while (current <= endDate) {
        const dateStr = current.toISOString().slice(0, 10);

        let viewersByGroup = nonPublicGroups.map(g => ({
            user_group: g,
            total: Math.floor(Math.random() * 10), // 0-9 random views per group
        }));

        viewersByGroup = viewersByGroup.map(groupObj => {
            if (Math.random() < 0.015) {
                // 200%+ spike
                return { ...groupObj, total: groupObj.total * 3 + 10 };
            }
            return groupObj;
        });

        const usedNonPublic = viewersByGroup.filter(g => g.total > 0);
        if (usedNonPublic.length < 4) {
            const shuffled = [...nonPublicGroups].sort(() => Math.random() - 0.5);
            for (let i = 0; i < 4; i++) {
                const idx = viewersByGroup.findIndex(g => g.user_group === shuffled[i]);
                viewersByGroup[idx].total = Math.max(viewersByGroup[idx].total, 1);
            }
        }

        let publicUsage = Math.floor(Math.random() * 10);
        if (Math.random() < 0.015) {
            publicUsage = publicUsage * 3 + 10;
        }
        viewersByGroup.push({ user_group: 'public', total: publicUsage });

        viewersByGroup = viewersByGroup.filter(g => g.total > 0 || g.user_group === 'public');
        const totalViews = viewersByGroup.reduce((sum, g) => sum + g.total, 0);
        data.push({
            activity_date: dateStr,
            total_views: totalViews,
            viewers_by_group: viewersByGroup,
        });
        current.setDate(current.getDate() + 1);
    }
    return data;
}
export default function UsageAnalytics({ usageData }) {
    // Extract usage analytics array from the API data (handle array or object)
    // Only use site_usage from the API data
    const analyticsArray = React.useMemo(() => {
        const arr = Array.isArray(usageData) ? usageData : usageData.site_usage || [];
        return Array.isArray(arr) ? arr : [];
    }, [usageData]);

    const allGroupsStable = getAllUserGroups(analyticsArray);
    const groupColorMap = getGroupColorMap(allGroupsStable);

    const allUserGroupsForSummary = allGroupsStable.includes('public')
        ? allGroupsStable.filter(g => g !== 'public').concat('public')
        : allGroupsStable;

    const allDates = analyticsArray.map(d => d.activity_date);
    const minDate = allDates[0];
    const maxDate = allDates[allDates.length - 1];
    const defaultStartDate = allDates.length > 6 ? allDates[allDates.length - 7] : minDate;
    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(maxDate);

    const globalMinDate = analyticsArray[0]?.activity_date;
    const globalMaxDate = analyticsArray[analyticsArray.length - 1]?.activity_date;
    const filledUsageData = fillMissingDates(analyticsArray, globalMinDate, globalMaxDate);

    const filteredUsageData = filledUsageData.filter(d => d.activity_date >= startDate && d.activity_date <= endDate);

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

    const prevGroupTotals = {};
    allGroupsStable.forEach(group => {
        prevGroupTotals[group] = 0;
    });
    prevPeriodData.forEach(day => {
        day.viewers_by_group.forEach(g => {
            prevGroupTotals[g.user_group] += g.total;
        });
    });

    const [visibleGroups, setVisibleGroups] = useState(() => {
        const initial = {};
        allGroupsStable.forEach(g => {
            initial[g] = false;
        });
        return initial;
    });

    React.useEffect(() => {
        setVisibleGroups(prev => {
            const updated = { ...prev };
            let changed = false;
            allGroupsStable.forEach(g => {
                if (!(g in updated)) {
                    updated[g] = false;
                    changed = true;
                }
            });
            return changed ? updated : prev;
        });
    }, [allGroupsStable]);
    const handleGroupToggle = group => {
        setVisibleGroups(prev => ({ ...prev, [group]: !prev[group] }));
    };

    const chartData = getUsageData(filteredUsageData, visibleGroups, groupColorMap, allGroupsStable);

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
            <Grid container sx={{ boxShadow: '0 2px 8px 0 rgba(120, 90, 200, 0.30)' }}>
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
                            backgroundColor: '#fafafa',
                        }}
                    >
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            alignItems="center"
                            sx={{ mb: 1, justifyContent: 'flex-start', width: '100%' }}
                        >
                            <Typography variant="subtitle1" sx={{ minWidth: 120, pl: 3 }}>
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
                        <Typography variant="h6" sx={{ mb: 0.2, textAlign: 'center' }}>
                            Usage Summary
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.2, mt: 0, textAlign: 'center', color: '#64748b' }}>
                            Date Range: {formatDateBrisbane(startDate)} to {formatDateBrisbane(endDate)}
                        </Typography>
                        {(() => {
                            let peakTotal = 0;
                            let peakDate = '';
                            let totalCurrentPeriod = 0;
                            let totalPrevPeriod = 0;
                            filteredUsageData.forEach(day => {
                                totalCurrentPeriod += day.total_views;
                                if (day.total_views > peakTotal) {
                                    peakTotal = day.total_views;
                                    peakDate = day.activity_date;
                                }
                            });
                            prevPeriodData.forEach(day => {
                                totalPrevPeriod += day.total_views;
                            });
                            let totalTrend = null;
                            if (prevPeriodData.length === periodLength) {
                                if (totalPrevPeriod > 0) {
                                    totalTrend = ((totalCurrentPeriod - totalPrevPeriod) / totalPrevPeriod) * 100;
                                } else if (totalPrevPeriod === 0 && totalCurrentPeriod > 0) {
                                    totalTrend = totalCurrentPeriod * 100;
                                } else if (totalPrevPeriod > 0 && totalCurrentPeriod === 0) {
                                    totalTrend = -100;
                                } else {
                                    totalTrend = 0;
                                }
                            }
                            const { trendColor, trendText } = getTrendDisplay(totalTrend);
                            return (
                                <>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 700, mb: 0, textAlign: 'center', fontSize: 13 }}
                                    >
                                        Total: {total}
                                        {totalTrend !== null && (
                                            <span
                                                style={{
                                                    color: trendColor,
                                                    fontWeight: 600,
                                                    marginLeft: 4,
                                                    fontSize: '0.9em',
                                                    verticalAlign: 'middle',
                                                }}
                                            >
                                                {trendText}
                                            </span>
                                        )}
                                        <span style={{ fontSize: 13, marginLeft: 6 }}> Selected: {totalSelected}</span>
                                    </Typography>
                                    {peakTotal > 0 && (
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                mt: -0.5,
                                                mb: 0.25,
                                                textAlign: 'center',
                                                color: '#64748b',
                                                display: 'block',
                                                fontSize: 10,
                                            }}
                                        >
                                            Peak - {formatDateBrisbane(peakDate)} ({peakTotal} views)
                                        </Typography>
                                    )}
                                    <Box sx={{ borderBottom: '1px solid #e0e0e0', width: '100%', my: 0.5 }} />
                                </>
                            );
                        })()}
                        <Box component="ul" sx={{ pl: 2, mt: 0.25, mb: 0, listStyle: 'none', p: 0 }}>
                            {allUserGroupsForSummary.map(group => {
                                const count = groupTotals[group] || 0;
                                const prevCount = prevGroupTotals[group] || 0;
                                let groupPercent = 0;
                                if (prevPeriodData.length === periodLength) {
                                    if (prevCount > 0) {
                                        groupPercent = ((count - prevCount) / prevCount) * 100;
                                    } else if (prevCount === 0 && count > 0) {
                                        groupPercent = count * 100;
                                    } else if (prevCount > 0 && count === 0) {
                                        groupPercent = -100;
                                    } else {
                                        groupPercent = 0;
                                    }
                                } else {
                                    groupPercent = null;
                                }
                                const color = groupColorMap[group] || '#64748b';
                                const peakDay = groupPeakDay[group];
                                const { trendColor, trendText } = getTrendDisplay(groupPercent);
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
                                                        {group === 'public' ? 'Not logged in' : group}: <b>{count}</b>
                                                        <span
                                                            style={{
                                                                color: trendColor,
                                                                fontWeight: 600,
                                                                marginLeft: 6,
                                                                fontSize: 11,
                                                            }}
                                                        >
                                                            {trendText}
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
            </Grid>
        </>
    );
}
UsageAnalytics.propTypes = {
    usageData: PropTypes.oneOfType([
        PropTypes.arrayOf(
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
        ),
        PropTypes.shape({
            site_usage: PropTypes.arrayOf(
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
            ),
        }),
    ]).isRequired,
};
