import { getTrendDisplay } from './UsageAnalytics';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
jest.mock('react-chartjs-2', () => ({
    Line: () => <div data-testid="mock-line-chart" />,
}));

export default function getMockUsageData() {
    const today = new Date();
    const format = d => d.toISOString().slice(0, 10);
    const days = [0, 1, 2]
        .map(offset => {
            const date = new Date(today);
            date.setDate(today.getDate() - offset);
            return format(date);
        })
        .reverse();
    return [
        {
            activity_date: days[0],
            total_views: 10,
            viewers_by_group: [
                { user_group: 'students', total: 6 },
                { user_group: 'staff', total: 4 },
            ],
        },
        {
            activity_date: days[1],
            total_views: 20,
            viewers_by_group: [
                { user_group: 'students', total: 15 },
                { user_group: 'staff', total: 5 },
            ],
        },
        {
            activity_date: days[2],
            total_views: 5,
            viewers_by_group: [
                { user_group: 'students', total: 2 },
                { user_group: 'staff', total: 3 },
            ],
        },
    ];
}

import UsageAnalytics from './UsageAnalytics';
describe('Analysis', () => {
    describe('getTrendDisplay', () => {
        it('returns gray and (N/A) for null', () => {
            const result = getTrendDisplay(null);
            expect(result.trendColor).toBe('#64748b');
            expect(result.trendText).toBe('(N/A)');
        });
        it('returns red and negative percent for < 0', () => {
            const result = getTrendDisplay(-12.34);
            expect(result.trendColor).toBe('#ef4444');
            expect(result.trendText).toBe('(-12.3%)');
        });
        it('returns green and positive percent for > 0', () => {
            const result = getTrendDisplay(5.67);
            expect(result.trendColor).toBe('#10b981');
            expect(result.trendText).toBe('(+5.7%)');
        });
        it('returns gray and zero percent for 0', () => {
            const result = getTrendDisplay(0);
            expect(result.trendColor).toBe('#64748b');
            expect(result.trendText).toBe('(0.0%)');
        });
    });

    describe('components', () => {
        it('renders summary and chart', () => {
            render(<UsageAnalytics usageData={getMockUsageData()} />);
            expect(screen.getByText(/Usage Summary/i)).toBeInTheDocument();
            expect(screen.getByTestId('start-date')).toBeInTheDocument();
            expect(screen.getByTestId('end-date')).toBeInTheDocument();
            expect(screen.getByTestId('reset-button')).toBeInTheDocument();
            expect(screen.getByText(/Total:/i)).toBeInTheDocument();
        });

        it('shows correct date range in summary', () => {
            const mockData = getMockUsageData();
            render(<UsageAnalytics usageData={mockData} />);
            const minDateStr = mockData[0].activity_date;
            const maxDateStr = mockData[mockData.length - 1].activity_date;
            const format = d => {
                const date = new Date(d);
                return date.toLocaleDateString('en-AU');
            };
            const expected = `Date Range: ${format(minDateStr)} to ${format(maxDateStr)}`;
            const summary = screen.queryByText(content => content.includes('Date Range:'));
            expect(summary).toBeTruthy();
            expect(summary.textContent).toContain(expected);
        });

        it('toggles group visibility', () => {
            render(<UsageAnalytics usageData={getMockUsageData()} />);
            const studentsCheckboxWrapper = screen.getByTestId('group-checkbox-students');
            const staffCheckboxWrapper = screen.getByTestId('group-checkbox-staff');
            expect(studentsCheckboxWrapper).toBeInTheDocument();
            expect(staffCheckboxWrapper).toBeInTheDocument();
            const studentsCheckbox = studentsCheckboxWrapper.querySelector('input[type="checkbox"]');
            fireEvent.click(studentsCheckbox);
            expect(studentsCheckbox).toBeChecked();
        });

        it('resets date range when Reset is clicked', () => {
            render(<UsageAnalytics usageData={getMockUsageData()} />);
            const startDateWrapper = screen.getByTestId('start-date');
            const endDateWrapper = screen.getByTestId('end-date');
            const startDateInput = startDateWrapper.querySelector('input');
            const endDateInput = endDateWrapper.querySelector('input');
            fireEvent.change(startDateInput, { target: { value: '2000-01-01' } });
            fireEvent.change(endDateInput, { target: { value: '2000-01-02' } });
            fireEvent.click(screen.getByTestId('reset-button'));
            expect(startDateInput.value).not.toBe('2000-01-01');
            expect(endDateInput.value).not.toBe('2000-01-02');
        });
    });
    describe('UsageAnalytics coverage edge cases', () => {
        it('fills missing dates and handles short data', () => {
            const mockData = [
                { activity_date: '2026-02-04', total_views: 5, viewers_by_group: [] },
                { activity_date: '2026-02-06', total_views: 10, viewers_by_group: [] },
            ];
            render(<UsageAnalytics usageData={mockData} />);
            expect(screen.getByText(/Date Range:/)).toBeInTheDocument();
        });

        it('calculates previous group totals for multiple groups', () => {
            const mockData = [
                {
                    activity_date: '2026-02-04',
                    total_views: 5,
                    viewers_by_group: [
                        { user_group: 'students', total: 2 },
                        { user_group: 'staff', total: 1 },
                    ],
                },
                {
                    activity_date: '2026-02-05',
                    total_views: 10,
                    viewers_by_group: [
                        { user_group: 'students', total: 3 },
                        { user_group: 'staff', total: 2 },
                    ],
                },
                {
                    activity_date: '2026-02-06',
                    total_views: 8,
                    viewers_by_group: [
                        { user_group: 'students', total: 4 },
                        { user_group: 'staff', total: 3 },
                    ],
                },
            ];
            render(<UsageAnalytics usageData={mockData} />);
            expect(screen.getByText(/Usage Summary/)).toBeInTheDocument();
        });

        it('updates visibleGroups when new group appears', () => {
            const { rerender } = render(
                <UsageAnalytics
                    usageData={[
                        {
                            activity_date: '2026-02-06',
                            total_views: 1,
                            viewers_by_group: [{ user_group: 'students', total: 1 }],
                        },
                    ]}
                />,
            );
            rerender(
                <UsageAnalytics
                    usageData={[
                        {
                            activity_date: '2026-02-06',
                            total_views: 1,
                            viewers_by_group: [
                                { user_group: 'students', total: 1 },
                                { user_group: 'staff', total: 1 },
                            ],
                        },
                    ]}
                />,
            );
            expect(screen.getByTestId('group-checkbox-staff')).toBeInTheDocument();
        });

        it('calculates summary trend logic for all cases', () => {
            const mockData = [
                { activity_date: '2026-02-04', total_views: 10, viewers_by_group: [] },
                { activity_date: '2026-02-05', total_views: 0, viewers_by_group: [] },
                { activity_date: '2026-02-06', total_views: 5, viewers_by_group: [] },
            ];
            render(<UsageAnalytics usageData={mockData} />);
            expect(screen.getByText(/Usage Summary/)).toBeInTheDocument();
        });

        it('calculates group percent trend logic for all cases', () => {
            const mockData = [
                {
                    activity_date: '2026-02-04',
                    total_views: 10,
                    viewers_by_group: [{ user_group: 'students', total: 5 }],
                },
                {
                    activity_date: '2026-02-05',
                    total_views: 0,
                    viewers_by_group: [{ user_group: 'students', total: 0 }],
                },
                {
                    activity_date: '2026-02-06',
                    total_views: 5,
                    viewers_by_group: [{ user_group: 'students', total: 10 }],
                },
            ];
            render(<UsageAnalytics usageData={mockData} />);
            expect(screen.getByTestId('group-checkbox-students')).toBeInTheDocument();
        });
    });
    describe('UsageAnalytics additional coverage', () => {
        it('handles defaultStartDate for short data', () => {
            const mockData = [
                { activity_date: '2026-02-06', total_views: 1, viewers_by_group: [] },
                { activity_date: '2026-02-07', total_views: 2, viewers_by_group: [] },
            ];
            render(<UsageAnalytics usageData={mockData} />);
            expect(screen.getByTestId('start-date')).toBeInTheDocument();
        });
        it('updates prevGroupTotals', () => {
            const mockData = [
                {
                    activity_date: '2026-02-04',
                    total_views: 5,
                    viewers_by_group: [{ user_group: 'students', total: 2 }],
                },
                {
                    activity_date: '2026-02-05',
                    total_views: 10,
                    viewers_by_group: [{ user_group: 'students', total: 3 }],
                },
                {
                    activity_date: '2026-02-06',
                    total_views: 8,
                    viewers_by_group: [{ user_group: 'students', total: 4 }],
                },
            ];
            render(<UsageAnalytics usageData={mockData} />);
            expect(screen.getByText(/Usage Summary/)).toBeInTheDocument();
        });

        it('covers summary trend branches', () => {
            const mockData = [
                { activity_date: '2026-02-04', total_views: 0, viewers_by_group: [] },
                { activity_date: '2026-02-05', total_views: 0, viewers_by_group: [] },
                { activity_date: '2026-02-06', total_views: 0, viewers_by_group: [] },
            ];
            render(<UsageAnalytics usageData={mockData} />);
            expect(screen.getByText(/Usage Summary/)).toBeInTheDocument();
        });

        it('covers group percent trend branches', () => {
            const mockData = [
                {
                    activity_date: '2026-02-04',
                    total_views: 10,
                    viewers_by_group: [{ user_group: 'students', total: 0 }],
                },
                {
                    activity_date: '2026-02-05',
                    total_views: 0,
                    viewers_by_group: [{ user_group: 'students', total: 0 }],
                },
                {
                    activity_date: '2026-02-06',
                    total_views: 5,
                    viewers_by_group: [{ user_group: 'students', total: 0 }],
                },
            ];
            render(<UsageAnalytics usageData={mockData} />);
            expect(screen.getByTestId('group-checkbox-students')).toBeInTheDocument();
        });
    });
    describe('UsageAnalytics targeted coverage', () => {
        it('covers defaultStartDate for short data', () => {
            const mockData = [
                { activity_date: '2026-02-06', total_views: 1, viewers_by_group: [] },
                { activity_date: '2026-02-07', total_views: 2, viewers_by_group: [] },
            ];
            render(<UsageAnalytics usageData={mockData} />);
            expect(screen.getByTestId('start-date')).toBeInTheDocument();
        });

        it('covers prevGroupTotals update', () => {
            const mockData = [
                {
                    activity_date: '2026-02-04',
                    total_views: 5,
                    viewers_by_group: [{ user_group: 'students', total: 2 }],
                },
                {
                    activity_date: '2026-02-05',
                    total_views: 10,
                    viewers_by_group: [{ user_group: 'students', total: 3 }],
                },
                {
                    activity_date: '2026-02-06',
                    total_views: 8,
                    viewers_by_group: [{ user_group: 'students', total: 4 }],
                },
            ];
            render(<UsageAnalytics usageData={mockData} />);
            expect(screen.getByText(/Usage Summary/)).toBeInTheDocument();
        });

        it('covers summary trend branches', () => {
            const mockData = [
                { activity_date: '2026-02-04', total_views: 0, viewers_by_group: [] },
                { activity_date: '2026-02-05', total_views: 0, viewers_by_group: [] },
                { activity_date: '2026-02-06', total_views: 0, viewers_by_group: [] },
            ];
            render(<UsageAnalytics usageData={mockData} />);
            expect(screen.getByText(/Usage Summary/)).toBeInTheDocument();
        });

        it('covers group percent trend branches', () => {
            const mockData = [
                {
                    activity_date: '2026-02-04',
                    total_views: 10,
                    viewers_by_group: [{ user_group: 'students', total: 0 }],
                },
                {
                    activity_date: '2026-02-05',
                    total_views: 0,
                    viewers_by_group: [{ user_group: 'students', total: 0 }],
                },
                {
                    activity_date: '2026-02-06',
                    total_views: 5,
                    viewers_by_group: [{ user_group: 'students', total: 0 }],
                },
            ];
            render(<UsageAnalytics usageData={mockData} />);
            expect(screen.getByTestId('group-checkbox-students')).toBeInTheDocument();
        });
    });
    describe('UsageAnalytics full branch coverage', () => {
        it('defaultStartDate uses minDate when data <= 6', () => {
            const mockData = [
                { activity_date: '2026-02-01', total_views: 1, viewers_by_group: [] },
                { activity_date: '2026-02-02', total_views: 2, viewers_by_group: [] },
                { activity_date: '2026-02-03', total_views: 3, viewers_by_group: [] },
                { activity_date: '2026-02-04', total_views: 4, viewers_by_group: [] },
                { activity_date: '2026-02-05', total_views: 5, viewers_by_group: [] },
                { activity_date: '2026-02-06', total_views: 6, viewers_by_group: [] },
            ];
            render(<UsageAnalytics usageData={mockData} />);
            expect(screen.getByTestId('start-date')).toBeInTheDocument();
        });

        it('prevGroupTotals stays zero when prevPeriodData empty', () => {
            const mockData = [
                {
                    activity_date: '2026-02-01',
                    total_views: 1,
                    viewers_by_group: [{ user_group: 'students', total: 1 }],
                },
                {
                    activity_date: '2026-02-02',
                    total_views: 2,
                    viewers_by_group: [{ user_group: 'students', total: 2 }],
                },
            ];
            render(<UsageAnalytics usageData={mockData} />);
            expect(screen.getByTestId('group-checkbox-students')).toBeInTheDocument();
        });

        it('summary trend: prevPeriodData.length !== periodLength', () => {
            const mockData = [
                { activity_date: '2026-02-01', total_views: 1, viewers_by_group: [] },
                { activity_date: '2026-02-02', total_views: 2, viewers_by_group: [] },
            ];
            render(<UsageAnalytics usageData={mockData} />);
            expect(screen.getByText(/Usage Summary/)).toBeInTheDocument();
        });

        it('summary trend: totalPrevPeriod > 0', () => {
            const mockData = [
                { activity_date: '2026-02-01', total_views: 10, viewers_by_group: [] },
                { activity_date: '2026-02-02', total_views: 20, viewers_by_group: [] },
                { activity_date: '2026-02-03', total_views: 30, viewers_by_group: [] },
                { activity_date: '2026-02-04', total_views: 40, viewers_by_group: [] },
                { activity_date: '2026-02-05', total_views: 50, viewers_by_group: [] },
                { activity_date: '2026-02-06', total_views: 60, viewers_by_group: [] },
                { activity_date: '2026-02-07', total_views: 70, viewers_by_group: [] },
            ];
            render(<UsageAnalytics usageData={mockData} />);
            expect(screen.getByText(/Usage Summary/)).toBeInTheDocument();
        });

        it('summary trend: totalPrevPeriod === 0, totalCurrentPeriod > 0', () => {
            const mockData = [
                { activity_date: '2026-02-01', total_views: 0, viewers_by_group: [] },
                { activity_date: '2026-02-02', total_views: 0, viewers_by_group: [] },
                { activity_date: '2026-02-03', total_views: 10, viewers_by_group: [] },
                { activity_date: '2026-02-04', total_views: 20, viewers_by_group: [] },
                { activity_date: '2026-02-05', total_views: 30, viewers_by_group: [] },
                { activity_date: '2026-02-06', total_views: 40, viewers_by_group: [] },
                { activity_date: '2026-02-07', total_views: 50, viewers_by_group: [] },
            ];
            render(<UsageAnalytics usageData={mockData} />);
            expect(screen.getByText(/Usage Summary/)).toBeInTheDocument();
        });

        it('summary trend: totalPrevPeriod > 0, totalCurrentPeriod === 0', () => {
            const mockData = [
                { activity_date: '2026-02-01', total_views: 10, viewers_by_group: [] },
                { activity_date: '2026-02-02', total_views: 20, viewers_by_group: [] },
                { activity_date: '2026-02-03', total_views: 0, viewers_by_group: [] },
                { activity_date: '2026-02-04', total_views: 0, viewers_by_group: [] },
                { activity_date: '2026-02-05', total_views: 0, viewers_by_group: [] },
                { activity_date: '2026-02-06', total_views: 0, viewers_by_group: [] },
                { activity_date: '2026-02-07', total_views: 0, viewers_by_group: [] },
            ];
            render(<UsageAnalytics usageData={mockData} />);
            expect(screen.getByText(/Usage Summary/)).toBeInTheDocument();
        });

        it('summary trend: totalPrevPeriod === 0, totalCurrentPeriod === 0', () => {
            const mockData = [
                { activity_date: '2026-02-01', total_views: 0, viewers_by_group: [] },
                { activity_date: '2026-02-02', total_views: 0, viewers_by_group: [] },
                { activity_date: '2026-02-03', total_views: 0, viewers_by_group: [] },
                { activity_date: '2026-02-04', total_views: 0, viewers_by_group: [] },
                { activity_date: '2026-02-05', total_views: 0, viewers_by_group: [] },
                { activity_date: '2026-02-06', total_views: 0, viewers_by_group: [] },
                { activity_date: '2026-02-07', total_views: 0, viewers_by_group: [] },
            ];
            render(<UsageAnalytics usageData={mockData} />);
            expect(screen.getByText(/Usage Summary/)).toBeInTheDocument();
        });

        it('group percent trend: prevCount > 0', () => {
            const mockData = [
                {
                    activity_date: '2026-02-01',
                    total_views: 1,
                    viewers_by_group: [{ user_group: 'students', total: 1 }],
                },
                {
                    activity_date: '2026-02-02',
                    total_views: 2,
                    viewers_by_group: [{ user_group: 'students', total: 2 }],
                },
                {
                    activity_date: '2026-02-03',
                    total_views: 3,
                    viewers_by_group: [{ user_group: 'students', total: 3 }],
                },
                {
                    activity_date: '2026-02-04',
                    total_views: 4,
                    viewers_by_group: [{ user_group: 'students', total: 4 }],
                },
                {
                    activity_date: '2026-02-05',
                    total_views: 5,
                    viewers_by_group: [{ user_group: 'students', total: 5 }],
                },
                {
                    activity_date: '2026-02-06',
                    total_views: 6,
                    viewers_by_group: [{ user_group: 'students', total: 6 }],
                },
                {
                    activity_date: '2026-02-07',
                    total_views: 7,
                    viewers_by_group: [{ user_group: 'students', total: 7 }],
                },
            ];
            render(<UsageAnalytics usageData={mockData} />);
            expect(screen.getByTestId('group-checkbox-students')).toBeInTheDocument();
        });

        it('group percent trend: prevCount === 0, count > 0', () => {
            const mockData = [
                {
                    activity_date: '2026-02-01',
                    total_views: 0,
                    viewers_by_group: [{ user_group: 'students', total: 0 }],
                },
                {
                    activity_date: '2026-02-02',
                    total_views: 0,
                    viewers_by_group: [{ user_group: 'students', total: 0 }],
                },
                {
                    activity_date: '2026-02-03',
                    total_views: 1,
                    viewers_by_group: [{ user_group: 'students', total: 1 }],
                },
                {
                    activity_date: '2026-02-04',
                    total_views: 2,
                    viewers_by_group: [{ user_group: 'students', total: 2 }],
                },
                {
                    activity_date: '2026-02-05',
                    total_views: 3,
                    viewers_by_group: [{ user_group: 'students', total: 3 }],
                },
                {
                    activity_date: '2026-02-06',
                    total_views: 4,
                    viewers_by_group: [{ user_group: 'students', total: 4 }],
                },
                {
                    activity_date: '2026-02-07',
                    total_views: 5,
                    viewers_by_group: [{ user_group: 'students', total: 5 }],
                },
            ];
            render(<UsageAnalytics usageData={mockData} />);
            expect(screen.getByTestId('group-checkbox-students')).toBeInTheDocument();
        });

        it('group percent trend: prevCount > 0, count === 0', () => {
            const mockData = [
                {
                    activity_date: '2026-02-01',
                    total_views: 1,
                    viewers_by_group: [{ user_group: 'students', total: 1 }],
                },
                {
                    activity_date: '2026-02-02',
                    total_views: 2,
                    viewers_by_group: [{ user_group: 'students', total: 2 }],
                },
                {
                    activity_date: '2026-02-03',
                    total_views: 0,
                    viewers_by_group: [{ user_group: 'students', total: 0 }],
                },
                {
                    activity_date: '2026-02-04',
                    total_views: 0,
                    viewers_by_group: [{ user_group: 'students', total: 0 }],
                },
                {
                    activity_date: '2026-02-05',
                    total_views: 0,
                    viewers_by_group: [{ user_group: 'students', total: 0 }],
                },
                {
                    activity_date: '2026-02-06',
                    total_views: 0,
                    viewers_by_group: [{ user_group: 'students', total: 0 }],
                },
                {
                    activity_date: '2026-02-07',
                    total_views: 0,
                    viewers_by_group: [{ user_group: 'students', total: 0 }],
                },
            ];
            render(<UsageAnalytics usageData={mockData} />);
            expect(screen.getByTestId('group-checkbox-students')).toBeInTheDocument();
        });

        it('group percent trend: prevCount === 0, count === 0', () => {
            const mockData = [
                {
                    activity_date: '2026-02-01',
                    total_views: 0,
                    viewers_by_group: [{ user_group: 'students', total: 0 }],
                },
                {
                    activity_date: '2026-02-02',
                    total_views: 0,
                    viewers_by_group: [{ user_group: 'students', total: 0 }],
                },
                {
                    activity_date: '2026-02-03',
                    total_views: 0,
                    viewers_by_group: [{ user_group: 'students', total: 0 }],
                },
                {
                    activity_date: '2026-02-04',
                    total_views: 0,
                    viewers_by_group: [{ user_group: 'students', total: 0 }],
                },
                {
                    activity_date: '2026-02-05',
                    total_views: 0,
                    viewers_by_group: [{ user_group: 'students', total: 0 }],
                },
                {
                    activity_date: '2026-02-06',
                    total_views: 0,
                    viewers_by_group: [{ user_group: 'students', total: 0 }],
                },
                {
                    activity_date: '2026-02-07',
                    total_views: 0,
                    viewers_by_group: [{ user_group: 'students', total: 0 }],
                },
            ];
            render(<UsageAnalytics usageData={mockData} />);
            expect(screen.getByTestId('group-checkbox-students')).toBeInTheDocument();
        });
    });
    it('explicitly covers prevPeriodData.forEach for group totals', () => {
        const mockData = [
            {
                activity_date: '2026-02-01',
                total_views: 5,
                viewers_by_group: [
                    { user_group: 'students', total: 2 },
                    { user_group: 'staff', total: 1 },
                ],
            },
            {
                activity_date: '2026-02-02',
                total_views: 10,
                viewers_by_group: [
                    { user_group: 'students', total: 3 },
                    { user_group: 'staff', total: 2 },
                ],
            },
            {
                activity_date: '2026-02-03',
                total_views: 8,
                viewers_by_group: [
                    { user_group: 'students', total: 4 },
                    { user_group: 'staff', total: 3 },
                ],
            },
            {
                activity_date: '2026-02-04',
                total_views: 7,
                viewers_by_group: [
                    { user_group: 'students', total: 5 },
                    { user_group: 'staff', total: 2 },
                ],
            },
            {
                activity_date: '2026-02-05',
                total_views: 6,
                viewers_by_group: [
                    { user_group: 'students', total: 1 },
                    { user_group: 'staff', total: 5 },
                ],
            },
            {
                activity_date: '2026-02-06',
                total_views: 9,
                viewers_by_group: [
                    { user_group: 'students', total: 3 },
                    { user_group: 'staff', total: 6 },
                ],
            },
            {
                activity_date: '2026-02-07',
                total_views: 11,
                viewers_by_group: [
                    { user_group: 'students', total: 7 },
                    { user_group: 'staff', total: 4 },
                ],
            },
        ];
        render(<UsageAnalytics usageData={mockData} />);
        expect(screen.getByText(/Usage Summary/)).toBeInTheDocument();
    });
});
