// istanbul ignore file
import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { StandardPage } from '../../../App/components/pages';

import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    ArcElement,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Import the new UsageAnalytics component
import UsageAnalytics from './UsageAnalytics';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Title);

// =========================================================
//                  CHART CONFIGURATION TOGGLES
// =========================================================
// Set to 'true' for stacked bars (single wide bar, NO left labels)
// Set to 'false' for grouped/side-by-side bars (multiple thin bars, WITH left labels)
const STACK_REVIEW_CHART = true;
const STACK_FILTER_CHART = true;
const STACK_SERIES_CHART = true;

// =========================================================
//                   COLOR UTILITY AND CONSTANTS
// =========================================================

/**
 * Generates a specified number of highly saturated, distinct RGBA colors
 * with alternating lightness for guaranteed contrast between adjacent slices.
 * @param {number} count - The number of colors to generate.
 * @param {number} opacity - The alpha value for the RGBA string (e.g., 0.6 or 0.7).
 * @returns {string[]} An array of RGBA color strings.
 */
const generateRandomColors = (count, opacity = 0.7) => {
    const colors = [];
    const hueStep = 360 / (count > 0 ? count : 1);

    const hslToRgb = (h, sIn, lIn, alpha) => {
        const s = sIn / 100;
        const l = lIn / 100;
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = l - c / 2;
        let r = 0;
        let g = 0;
        let b = 0;

        if (h >= 0 && h < 60) {
            r = c;
            g = x;
        } else if (h >= 60 && h < 120) {
            r = x;
            g = c;
        } else if (h >= 120 && h < 180) {
            g = c;
            b = x;
        } else if (h >= 180 && h < 240) {
            g = x;
            b = c;
        } else if (h >= 240 && h < 300) {
            r = x;
            b = c;
        } else if (h >= 300 && h < 360) {
            r = c;
            b = x;
        }

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const startingHue = Math.floor(Math.random() * 360);

    for (let i = 0; i < count; i++) {
        const hue = (startingHue + i * hueStep) % 360;
        const saturation = 90 + Math.random() * 10;

        let lightness;
        if (i % 2 === 0) {
            lightness = 40 + Math.random() * 15;
        } else {
            lightness = 65 + Math.random() * 15;
        }

        colors.push(hslToRgb(hue, saturation, lightness, 0.7));
    }
    return colors;
};

const OBJECT_KEYS_TO_CHART = [
    'new_objects',
    'featured_objects',
    'my_objects',
    'total_favourites',
    'my_subscriptions',
    'my_alerts',
    'cultural_advice_objects',
];
const OBJECT_LABELS_MAP = {
    new_objects: 'New Objects',
    my_objects: 'My Objects',
    featured_objects: 'Featured Objects',
    total_favourites: 'Total Favourites',
    my_subscriptions: 'Subscriptions',
    my_alerts: 'Alerts',
    cultural_advice_objects: 'Cultural Advice',
};

const CONSISTENT_OTHER_COLOR = 'rgba(128, 128, 128, 0.7)';

const REVIEW_STATUS_COLORS = {
    UPCOMING: 'rgba(75, 192, 192, 0.7)',
    DUE: 'rgba(255, 159, 64, 0.7)',
    OVERDUE: 'rgba(255, 99, 132, 0.7)',
};

const MAX_CHART_ITEMS = 15;
const KEYWORD_LIMIT = 10;

// Mock data generator for 28 days and 15 user groups
const MOCK_USER_GROUPS = [
    'STAFF',
    'UG',
    'LIBRARYSTAFFB',
    'RHD',
    'CWPG',
    'HON',
    'ATH',
    'REMUG',
    'ICTE',
    'REMRHD',
    'ALUMNI',
    'HOSP',
    'COMMU',
    'FRYVISITOR',
    'NOT LOGGED IN',
];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const MOCK_SITE_USAGE_DATA = Array.from({ length: 28 }, (_, i) => {
    const date = new Date(2026, 0, 28 - i); // Jan 28, 2026 backwards
    // Each day, randomly select 3-7 groups to have activity
    const groupsToday = [...MOCK_USER_GROUPS].sort(() => 0.5 - Math.random()).slice(0, getRandomInt(3, 7));
    const viewers_by_group = groupsToday.map(group => ({
        user_group: group,
        total: getRandomInt(1, 8),
    }));
    const total_views = viewers_by_group.reduce((sum, g) => sum + g.total, 0) + getRandomInt(0, 3);
    const unique_viewers = viewers_by_group.length + getRandomInt(0, 2);
    return {
        activity_date: date.toISOString().slice(0, 10),
        total_views,
        unique_viewers,
        viewers_by_group,
    };
}).reverse();

const chartData = [...MOCK_SITE_USAGE_DATA];

// Collect all unique user groups across all days
// Helper to get all user groups from a data array
const getAllUserGroups = data => Array.from(new Set(data.flatMap(d => d.viewers_by_group.map(g => g.user_group))));

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

// Helper to format date as DD/MM/YYYY in Australia/Brisbane timezone
function formatDateBrisbane(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00+10:00');
    // Use Intl.DateTimeFormat for 'en-AU' and 'Australia/Brisbane'
    return new Intl.DateTimeFormat('en-AU', {
        timeZone: 'Australia/Brisbane',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(date);
}

function getUsageData(filteredData) {
    const allUserGroups = getAllUserGroups(filteredData);

    return visibleGroupsArg => ({
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
                order: 0, // Draw on top
                hidden: false, // Always visible
            },
            ...allUserGroups.map((group, idx) => ({
                label: group,
                data: filteredData.map(d => {
                    const found = d.viewers_by_group.find(g => g.user_group === group);
                    return found ? found.total : 0;
                }),
                borderColor: groupColors[(idx + 1) % groupColors.length],
                backgroundColor: groupColors[(idx + 1) % groupColors.length],
                tension: 0.15,
                borderDash: [4, 2],
                borderWidth: 2,
                pointRadius: 3,
                order: 1,
                hidden: visibleGroupsArg ? !visibleGroupsArg[group] : true,
            })),
        ],
    });
}

const UsageOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: true,
            text: 'Digital Object Usage by User Group',
            font: { size: 14, weight: 'bold', family: 'Inter, system-ui, sans-serif' }, // Smaller title
            color: '#1e293b',
            padding: { top: 4, bottom: 10 },
        },
        tooltip: {
            enabled: true,
            backgroundColor: '#1e293b', // Matches legend text color
            padding: 12,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 },
            cornerRadius: 8,
            displayColors: true,
            boxPadding: 6,
        },
    },
    scales: {
        x: {
            ticks: {
                color: '#64748b', // Clearer grey for dates
                maxRotation: 45,
                minRotation: 45,
                font: { size: 11 },
            },
            grid: {
                display: false, // Keeps the focus on the lines
            },
        },
        y: {
            beginAtZero: true,
            ticks: {
                color: '#64748b',
                font: { size: 11 },
            },
            grid: {
                color: '#f1f5f9', // Very subtle horizontal lines
                drawBorder: false,
            },
        },
    },
};
// =========================================================
//                  DYNAMIC HEIGHT CALCULATION
// =========================================================
/**
 * Calculates the height in pixels needed for an unstacked chart
 * to prevent bars from being squished.
 * @param {number} numLabels - The number of categories/bars in the chart.
 * @returns {string} The calculated height in pixels (e.g., '300px').
 */
const getDynamicChartHeight = numLabels => {
    // 60px base for title, padding, and X-axis.
    // 30px per bar/category is a good estimate for readable text labels.
    const height = 60 + numLabels * 30;
    return `${height}px`;
};

// =========================================================
//                  DATA TRANSFORMATION LOGIC
// =========================================================

function formatObjectDistributionData(apiData) {
    const labels = [];
    const chartValues = [];
    let sumOfParts = 0;
    const grandTotal = apiData.total_objects || 0;

    OBJECT_KEYS_TO_CHART.forEach(key => {
        const value = apiData[key] || 0;
        labels.push(OBJECT_LABELS_MAP[key]);
        chartValues.push(value);
        sumOfParts += value;
    });

    const otherObjectsValue = grandTotal - sumOfParts;

    if (otherObjectsValue > 0) {
        labels.push('Other Objects');
        chartValues.push(otherObjectsValue);
    }

    const finalColors = generateRandomColors(labels.length, 0.6);

    if (otherObjectsValue > 0) {
        finalColors[finalColors.length - 1] = CONSISTENT_OTHER_COLOR;
    }

    return {
        labels: ['Total Objects'],
        datasets: labels.map((label, index) => ({
            label: label,
            data: [chartValues[index]],
            backgroundColor: finalColors[index],
            borderColor: finalColors[index].replace(', 0.6)', ', 1)').replace(', 0.7)', ', 1)'),
            borderWidth: 1,
        })),
    };
}

function formatTeamBreakdownData(apiData) {
    const labels = [];
    const chartValues = [];
    let sumOfTeamObjects = 0;
    const grandTotal = apiData.total_objects || 0;

    apiData.team_breakdown.forEach(item => {
        labels.push(item.team_name);
        chartValues.push(item.total_objects);
        sumOfTeamObjects += item.total_objects;
    });

    const otherTeamsValue = grandTotal - sumOfTeamObjects;

    const finalColors = generateRandomColors(labels.length, 0.7);

    if (otherTeamsValue > 0) {
        labels.push('Not Assigned');
        chartValues.push(otherTeamsValue);
        finalColors.push(CONSISTENT_OTHER_COLOR);
    }

    return {
        labels: ['Total Objects'],
        datasets: labels.map((label, index) => ({
            label: label,
            data: [chartValues[index]],
            backgroundColor: finalColors[index],
            borderColor: finalColors[index].replace(', 0.7)', ', 1)').replace(', 0.6)', ', 1)'),
            borderWidth: 1,
        })),
    };
}

function formatKeywordBreakdownData(apiData) {
    const sortedData = apiData.keyword_breakdown.sort((a, b) => b.object_count - a.object_count);

    const topItems = sortedData.slice(0, KEYWORD_LIMIT);
    const otherItems = sortedData.slice(KEYWORD_LIMIT);

    const labels = topItems.map(item => item.keyword);
    const chartValues = topItems.map(item => item.object_count);

    const otherCount = otherItems.reduce((sum, item) => sum + item.object_count, 0);

    const finalColors = generateRandomColors(labels.length, 0.7);

    if (otherCount > 0) {
        labels.push('Other Keywords');
        chartValues.push(otherCount);
        finalColors.push(CONSISTENT_OTHER_COLOR);
    }

    return {
        labels: ['Keywords'],
        datasets: labels.map((label, index) => ({
            label: label,
            data: [chartValues[index]],
            backgroundColor: finalColors[index],
            borderColor: finalColors[index].replace(', 0.7)', ', 1)'),
            borderWidth: 1,
        })),
    };
}

function formatReviewStatusData(apiData) {
    const statusData = apiData.review_status.review_status;

    const labels = ['Upcoming', 'Due', 'Overdue'];
    const chartValues = [statusData.upcoming || 0, statusData.due || 0, statusData.overdue || 0];

    const finalColors = [REVIEW_STATUS_COLORS.UPCOMING, REVIEW_STATUS_COLORS.DUE, REVIEW_STATUS_COLORS.OVERDUE];

    const totalStatusObjects = chartValues.reduce((sum, value) => sum + value, 0);

    if (STACK_REVIEW_CHART) {
        // Stacked View: Single category label slot, multiple datasets
        return {
            labels: [' '],
            datasets: labels.map((label, index) => ({
                label: label,
                data: [chartValues[index]],
                backgroundColor: finalColors[index],
                borderColor: finalColors[index].replace(', 0.7)', ', 1)'),
                borderWidth: 1,
            })),
        };
    } else {
        // Unstacked View: Multiple category labels, single dataset
        return {
            labels: labels,
            datasets: [
                {
                    label: `Total for Review: ${totalStatusObjects}`,
                    data: chartValues,
                    backgroundColor: finalColors,
                    borderColor: finalColors.map(color => color.replace(', 0.7)', ', 1)')),
                    borderWidth: 1,
                },
            ],
        };
    }
}

function formatFilterBreakdownData(apiData) {
    const breakdown = apiData.filter_breakdown;

    const sortedData = Object.keys(breakdown)
        .map(key => ({ label: key, count: breakdown[key] }))
        .sort((a, b) => b.count - a.count);

    const topItems = sortedData.slice(0, MAX_CHART_ITEMS);
    const otherItems = sortedData.slice(MAX_CHART_ITEMS);

    const labels = topItems.map(item => item.label);
    const chartValues = topItems.map(item => item.count);

    const otherCount = otherItems.reduce((sum, item) => sum + item.count, 0);

    const finalColors = generateRandomColors(labels.length, 0.6);

    if (otherCount > 0) {
        labels.push('Other Filters');
        chartValues.push(otherCount);
        finalColors.push(CONSISTENT_OTHER_COLOR);
    }

    const totalCount = chartValues.reduce((sum, value) => sum + value, 0);

    if (STACK_FILTER_CHART) {
        // Stacked View: Single category label slot, multiple datasets
        return {
            labels: [' '],
            datasets: labels.map((label, index) => ({
                label: label,
                data: [chartValues[index]],
                backgroundColor: finalColors[index],
                borderColor: finalColors[index].replace(', 0.6)', ', 1)'),
                borderWidth: 1,
            })),
        };
    } else {
        // Unstacked View: Multiple category labels, single dataset
        return {
            labels: labels,
            datasets: [
                {
                    label: `Filters (Total: ${totalCount})`,
                    data: chartValues,
                    backgroundColor: finalColors,
                    borderColor: finalColors.map(color => color.replace(', 0.6)', ', 1)')),
                    borderWidth: 1,
                },
            ],
        };
    }
}

function formatSeriesBreakdownData(apiData) {
    const breakdown = apiData.series_breakdown;

    const sortedData = Object.keys(breakdown)
        .map(key => ({ label: key, count: breakdown[key] }))
        .sort((a, b) => b.count - a.count);

    const topItems = sortedData.slice(0, MAX_CHART_ITEMS);
    const otherItems = sortedData.slice(MAX_CHART_ITEMS);

    const labels = topItems.map(item => item.label);
    const chartValues = topItems.map(item => item.count);

    const otherCount = otherItems.reduce((sum, item) => sum + item.object_count, 0);

    const finalColors = generateRandomColors(labels.length, 0.6);

    const noSeriesIndex = labels.indexOf('No Series');
    if (noSeriesIndex !== -1) {
        finalColors[noSeriesIndex] = CONSISTENT_OTHER_COLOR;
    }

    if (otherCount > 0) {
        labels.push('Other Series');
        chartValues.push(otherCount);
        finalColors.push(CONSISTENT_OTHER_COLOR);
    }

    const totalCount = chartValues.reduce((sum, value) => sum + value, 0);

    if (STACK_SERIES_CHART) {
        // Stacked View: Single category label slot, multiple datasets
        return {
            labels: [' '],
            datasets: labels.map((label, index) => ({
                label: label,
                data: [chartValues[index]],
                backgroundColor: finalColors[index],
                borderColor: finalColors[index].replace(', 0.6)', ', 1)'),
                borderWidth: 1,
            })),
        };
    } else {
        // Unstacked View: Multiple category labels, single dataset
        return {
            labels: labels,
            datasets: [
                {
                    label: `Series (Total: ${totalCount})`,
                    data: chartValues,
                    backgroundColor: finalColors,
                    borderColor: finalColors.map(color => color.replace(', 0.6)', ', 1)')),
                    borderWidth: 1,
                },
            ],
        };
    }
}

// =========================================================
//                     REACT COMPONENT
// =========================================================

export default function AnalyticsDashboard() {
    // Helper to format date as DD/MM/YYYY in Australia/Brisbane timezone
    function formatDateBrisbane(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr + 'T00:00:00+10:00');
        // Use Intl.DateTimeFormat for 'en-AU' and 'Australia/Brisbane'
        return new Intl.DateTimeFormat('en-AU', {
            timeZone: 'Australia/Brisbane',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(date);
    }

    const [objectData, setObjectData] = useState(null);
    const [teamData, setTeamData] = useState(null);
    const [keywordData, setKeywordData] = useState(null);
    const [reviewData, setReviewData] = useState(null);
    const [filterData, setFilterData] = useState(null);
    const [seriesData, setSeriesData] = useState(null);
    const [totalObjects, setTotalObjects] = useState(0);

    useEffect(() => {
        // --- Mock API Data ---
        const apiResponse = {
            total_objects: 181,
            featured_objects: 6,
            new_objects: 0,
            my_objects: 5,
            total_favourites: 23,
            my_subscriptions: 4,
            total_subscriptions: 14,
            my_alerts: 0,
            cultural_advice_objects: 4,
            team_breakdown: [
                { team_name: 'Faculty Services Librarians', total_objects: 98 },
                { team_name: 'CDS DX Digital Content updated', total_objects: 64 },
                { team_name: 'Technology Training', total_objects: 14 },
                { team_name: 'kias team', total_objects: 3 },
                { team_name: 'Library Indigenous Enquiries', total_objects: 1 },
                { team_name: 'Research Data Services', total_objects: 1 },
                { team_name: 'Team member test updated', total_objects: 1 },
            ],
            keyword_breakdown: [
                { keyword: 'data', object_count: 13 },
                { keyword: 'Search skills', object_count: 12 },
                { keyword: 'Reference, cite and acknowledge', object_count: 12 },
                { keyword: 'Subject resources', object_count: 10 },
                { keyword: 'data analysis', object_count: 9 },
                { keyword: 'Digital tools and skills', object_count: 9 },
                { keyword: 'search strategy', object_count: 9 },
                { keyword: 'R language', object_count: 8 },
                { keyword: 'R software', object_count: 8 },
                { keyword: 'systematic review', object_count: 8 },
            ],
            review_status: { review_status: { upcoming: 1, due: 0, overdue: 28 } },
            filter_breakdown: {
                'H5P (Media format)': 8,
                'Influential communicators (Graduate attributes)': 68,
                'Accomplished scholars (Graduate attributes)': 76,
                'Referencing (Topic)': 17,
                'Software (Topic)': 20,
                'Module (Item type)': 29,
                'All (Cross-disciplinary) (Subject)': 69,
                'CC BY-NC Attribution NonCommercial (Licence)': 108,
                'Courageous thinkers (Graduate attributes)': 9,
                'CC BY Attribution (Licence)': 25,
                'Guide (Item type)': 93,
                'Webpage (Media format)': 90,
                'Training recording (Item type)': 4,
                'Video (Media format)': 14,
                'Assignments (Topic)': 92,
                'Law (Subject)': 5,
                'Social Sciences (Subject)': 7,
                'Humanities; Arts (Subject)': 6,
                'Digital skills (Topic)': 22,
                'Pressbook (Media format)': 22,
                'Health; Behavioural Sciences (Subject)': 20,
                'Video guide (Item type)': 9,
                'Research (Topic)': 36,
                'Business; Economics (Subject)': 11,
                'Science (Subject)': 12,
                'Engineering, Architecture and Information Technology (Subject)': 14,
                'Culturally capable (Graduate attributes)': 2,
                'Aboriginal and Torres Strait Islander (Topic)': 5,
                'CC BY-NC-SA Attribution NonCommercial Share Alike (Licence)': 2,
                'Interactive (Item type)': 18,
                'Connected citizens (Graduate attributes)': 7,
                'Respectful leaders (Graduate attributes)': 5,
                'Medicine; Biomedical Sciences (Subject)': 9,
                'Undergraduate (Audience)': 73,
                'Honours (Audience)': 54,
                'Higher degree by research (Audience)': 52,
                'Teaching staff (Audience)': 6,
                'Beginner (Level)': 30,
                'Advanced (Level)': 3,
                'Audio (Media format)': 2,
                'Other (Licence)': 2,
                'Other (Item type)': 2,
                'Spreadsheet (Media format)': 1,
                'Hospital staff (Audience)': 6,
                'Researchers (Audience)': 4,
                'Other (Media format)': 2,
                'UQ copyright (Licence)': 1,
                'Instructional object (Item type)': 1,
                'Business, Economics and Law (Subject)': 3,
                'Health, Medicine and Behavioural Sciences (Subject)': 2,
                'CC BY-ND Attribution No-Derivatives (Licence)': 1,
                'PDF (Media format)': 1,
                'Intermediate (Level)': 2,
            },
            series_breakdown: {
                'Digital Essentials': 19,
                EndNote: 8,
                'R with RStudio': 8,
                'Systematic reviews': 6,
                Python: 5,
                'Indigenising curriculum': 4,
                'Advanced literature searching': 2,
                'Test series version 2': 2,
                'Microsoft software': 2,
                'No Series': 125,
            },
        };

        setTotalObjects(apiResponse.total_objects);
        setObjectData(formatObjectDistributionData(apiResponse));
        setTeamData(formatTeamBreakdownData(apiResponse));
        setKeywordData(formatKeywordBreakdownData(apiResponse));
        setReviewData(formatReviewStatusData(apiResponse));
        setFilterData(formatFilterBreakdownData(apiResponse));
        setSeriesData(formatSeriesBreakdownData(apiResponse));
    }, []);

    // Base options for charts (common properties)
    const baseChartOptions = {
        responsive: true,
        maintainAspectRatio: false, // CRITICAL: Allows height to be controlled by the container (Box)
        indexAxis: 'y',
        plugins: { legend: { position: 'bottom', display: false }, title: { display: true } },
    };

    // Fixed scale options for charts tied to total_objects (Object, Team, Keyword)
    const fixedStackedOptions = {
        ...baseChartOptions,
        datasets: { bar: { barPercentage: 1.0, categoryPercentage: 1.0 } },
        scales: {
            x: { stacked: true, grid: { display: true }, padding: 0, max: 200 },
            y: {
                stacked: true,
                grid: { display: false },
                ticks: { display: false },
                offset: false,
                min: -0.5,
                max: 0.5,
            },
        },
        layout: { padding: { top: 10, bottom: 10, left: 0 } },
    };

    // Fixed scale options for Keywords (max: 100)
    const keywordOptions = {
        ...fixedStackedOptions,
        scales: { ...fixedStackedOptions.scales, x: { ...fixedStackedOptions.scales.x, max: 100 } },
        plugins: { ...baseChartOptions.plugins, title: { display: true, text: `Top ${KEYWORD_LIMIT} Keywords` } },
    };

    // Function to dynamically generate options based on stacking preference
    const getDynamicBarOptions = (title, isStacked) => {
        return {
            ...baseChartOptions,
            datasets: {
                bar: {
                    barPercentage: isStacked ? 1.0 : 0.9,
                    categoryPercentage: isStacked ? 1.0 : 0.9,
                },
            },
            scales: {
                x: {
                    stacked: isStacked,
                    grid: { display: true },
                    padding: 0,
                },
                y: {
                    stacked: isStacked,
                    grid: { display: false },
                    ticks: { display: !isStacked }, // Ticks are only shown when unstacked

                    offset: !isStacked,
                    min: isStacked ? -0.5 : undefined,
                    max: isStacked ? 0.5 : undefined,
                },
            },
            layout: { padding: { top: 10, bottom: 10, left: isStacked ? 0 : 10 } },
            plugins: { ...baseChartOptions.plugins, title: { display: true, text: title } },
        };
    };
    // Generate specific options
    const reviewOptions = getDynamicBarOptions('Objects by Review Status', STACK_REVIEW_CHART);
    const filterOptions = getDynamicBarOptions(`Top ${MAX_CHART_ITEMS} Filters`, STACK_FILTER_CHART);
    const seriesOptions = getDynamicBarOptions(`Top ${MAX_CHART_ITEMS} Series`, STACK_SERIES_CHART);

    if (!objectData || !teamData || !keywordData || !reviewData || !filterData || !seriesData) {
        return <Box sx={{ p: 3 }}>Loading Analytics Charts...</Box>;
    }

    // Determine dynamic heights
    const reviewHeight = STACK_REVIEW_CHART ? '100px' : getDynamicChartHeight(reviewData.labels.length);
    const filterHeight = STACK_FILTER_CHART ? '100px' : getDynamicChartHeight(filterData.labels.length);
    const seriesHeight = STACK_SERIES_CHART ? '100px' : getDynamicChartHeight(seriesData.labels.length);

    return (
        <StandardPage title="Digital Learning Object Repository - Analytics Dashboard">
            <Grid container spacing={3}>
                {/* 1. Object Distribution Chart - Fixed Stacked */}
                {/* <Grid item xs={12} md={4}>
                    <Box sx={{ border: '1px solid #eee', p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            Object Distribution
                        </Typography>
                        <Box sx={{ height: '100px' }}>
                            {' '}
                            <Bar
                                data={objectData}
                                options={{
                                    ...fixedStackedOptions,
                                    plugins: {
                                        ...fixedStackedOptions.plugins,
                                        title: {
                                            display: true,
                                            text: `Individual Metrics vs. Other Objects (Total: ${totalObjects})`,
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                </Grid> */}
                {/* FEEDBACK - overview of objects */}
                <Grid container>
                    <Grid item xs={12} md={4}>
                        <Bar
                            aria-label="Bar chart showing object distribution metrics"
                            data={objectData}
                            options={{
                                ...fixedStackedOptions,
                                plugins: {
                                    ...fixedStackedOptions.plugins,
                                    title: {
                                        display: true,
                                        text: `Individual Metrics vs. Other Objects (Total: ${totalObjects})`,
                                    },
                                },
                            }}
                        />
                    </Grid>
                </Grid>

                {/* 2. Team Breakdown Chart - Fixed Stacked */}
                <Grid item xs={12} md={4}>
                    <Box sx={{ border: '1px solid #eee', p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            Team Breakdown
                        </Typography>
                        <Box sx={{ height: '100px' }}>
                            {' '}
                            {/* Fixed height */}
                            <Bar
                                data={teamData}
                                aria-label="Bar chart showing team breakdown of digital learning objects"
                                options={{
                                    ...fixedStackedOptions,
                                    plugins: {
                                        ...fixedStackedOptions.plugins,
                                        title: { display: true, text: 'Objects by Team (Including Not Assigned)' },
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                </Grid>

                {/* 3. Keyword Breakdown Chart - Fixed Stacked */}
                <Grid item xs={12} md={4}>
                    <Box sx={{ border: '1px solid #eee', p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            Keywords
                        </Typography>
                        <Box sx={{ height: '100px' }}>
                            {' '}
                            {/* Fixed height */}
                            <Bar
                                data={keywordData}
                                options={keywordOptions}
                                role="img"
                                aria-label="Bar chart showing keyword breakdown of digital learning objects"
                            />
                        </Box>
                    </Box>
                </Grid>

                {/* 4. Review Status Chart - Dynamic Height */}
                {reviewData && (
                    <Grid item xs={12} md={4}>
                        <Box sx={{ border: '1px solid #eee', p: 2, textAlign: 'center' }}>
                            <Typography variant="h6" component="h2" gutterBottom>
                                Review Status
                            </Typography>
                            {/* Conditional Height */}
                            <Box sx={{ height: reviewHeight }}>
                                <Bar
                                    data={reviewData}
                                    options={reviewOptions}
                                    role="img"
                                    aria-label="Bar chart showing review breakdown of digital learning objects"
                                />
                            </Box>
                        </Box>
                    </Grid>
                )}

                {/* 5. Filter Breakdown Chart - Dynamic Height */}
                {filterData && (
                    <Grid item xs={12} md={4}>
                        <Box sx={{ border: '1px solid #eee', p: 2, textAlign: 'center' }}>
                            <Typography variant="h6" component="h2" gutterBottom>
                                Filter Breakdown
                            </Typography>
                            {/* Conditional Height */}
                            <Box sx={{ height: filterHeight }}>
                                <Bar
                                    data={filterData}
                                    options={filterOptions}
                                    role="img"
                                    aria-label="Bar chart showing filter breakdown of digital learning objects"
                                />
                            </Box>
                        </Box>
                    </Grid>
                )}

                {/* 6. Series Breakdown Chart - Dynamic Height */}
                {seriesData && (
                    <Grid item xs={12} md={4}>
                        <Box sx={{ border: '1px solid #eee', p: 2, textAlign: 'center' }}>
                            <Typography variant="h6" component="h2" gutterBottom>
                                Series Breakdown
                            </Typography>
                            {/* Conditional Height */}
                            <Box sx={{ height: seriesHeight }}>
                                <Bar
                                    data={seriesData}
                                    options={seriesOptions}
                                    role="img"
                                    aria-label="Bar chart showing series breakdown of digital learning objects"
                                />
                            </Box>
                        </Box>
                    </Grid>
                )}

                <UsageAnalytics usageData={chartData} />
            </Grid>
        </StandardPage>
    );
}
