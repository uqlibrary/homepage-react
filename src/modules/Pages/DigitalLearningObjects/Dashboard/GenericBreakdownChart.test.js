jest.mock('react-chartjs-2', () => ({
    Bar: () => <div data-testid="mock-bar-chart">Bar Chart</div>,
    Pie: () => <div data-testid="mock-pie-chart">Pie Chart</div>,
    Doughnut: () => <div data-testid="mock-doughnut-chart">Doughnut Chart</div>,
    defaults: {},
}));

beforeAll(() => {
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
        value: () => ({
            fillRect: () => {},
            clearRect: () => {},
            getImageData: () => ({ data: [] }),
            putImageData: () => {},
            createImageData: () => [],
            setTransform: () => {},
            drawImage: () => {},
            save: () => {},
            fillText: () => {},
            restore: () => {},
            beginPath: () => {},
            moveTo: () => {},
            lineTo: () => {},
            closePath: () => {},
            stroke: () => {},
            translate: () => {},
            scale: () => {},
            rotate: () => {},
            arc: () => {},
            arcTo: () => {},
            quadraticCurveTo: () => {},
            bezierCurveTo: () => {},
            isPointInPath: () => false,
            isPointInStroke: () => false,
            measureText: () => ({ width: 0 }),
            transform: () => {},
            rect: () => {},
            clip: () => {},
        }),
    });
});
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GenericBreakdownChart from './GenericBreakdownChart';

describe('GenericBreakdownChart', () => {
    it('renders fallback else branch with empty label', () => {
        const chartData = {
            custom_breakdown: [{ count: 5 }, { label: 'Labeled', count: 2 }, { name: 'Named', count: 3 }],
        };
        render(<GenericBreakdownChart chartData={chartData} dataKey="custom_breakdown" title="Custom Breakdown" />);
        fireEvent.click(screen.getByRole('button', { name: /show custom breakdown legend/i }));

        expect(
            screen.getByText((content, element) => {
                return element.tagName.toLowerCase() === 'span' && element.textContent.trim() === '(5)';
            }),
        ).toBeInTheDocument();
        expect(screen.getByText('Labeled (2)')).toBeInTheDocument();
        expect(screen.getByText('Named (3)')).toBeInTheDocument();
    });
    it('renders Not Assigned when total_objects > sum', () => {
        const chartData = {
            team_breakdown: [
                { team_name: 'Team A', total_objects: 2 },
                { team_name: 'Team B', total_objects: 3 },
            ],
            total_objects: 10,
        };
        render(<GenericBreakdownChart chartData={chartData} dataKey="team_breakdown" title="Team Breakdown" />);
        fireEvent.click(screen.getByRole('button', { name: /show team breakdown legend/i }));
        expect(screen.getByText('Not Assigned (5)')).toBeInTheDocument();
    });

    it('renders object_type_breakdown', () => {
        const chartData = {
            object_type_breakdown: [
                { object_type_name: 'Type X', object_count: 7 },
                { object_type_name: 'Type Y', object_count: 8 },
            ],
        };
        render(
            <GenericBreakdownChart
                chartData={chartData}
                dataKey="object_type_breakdown"
                title="Object Type Breakdown"
            />,
        );
        fireEvent.click(screen.getByRole('button', { name: /show object type breakdown legend/i }));
        expect(screen.getByText('Type X (7)')).toBeInTheDocument();
        expect(screen.getByText('Type Y (8)')).toBeInTheDocument();
    });

    it('renders keyword_breakdown', () => {
        const chartData = {
            keyword_breakdown: [
                { keyword: 'Keyword1', object_count: 4 },
                { keyword: 'Keyword2', object_count: 6 },
            ],
        };
        render(<GenericBreakdownChart chartData={chartData} dataKey="keyword_breakdown" title="Keyword Breakdown" />);
        fireEvent.click(screen.getByRole('button', { name: /show keyword breakdown legend/i }));
        expect(screen.getByText('Keyword1 (4)')).toBeInTheDocument();
        expect(screen.getByText('Keyword2 (6)')).toBeInTheDocument();
    });

    it('renders default breakdown branch', () => {
        const chartData = {
            custom_breakdown: [{ label: 'Custom1', count: 1 }, { name: 'Custom2', count: 2 }, { count: 3 }],
        };
        render(<GenericBreakdownChart chartData={chartData} dataKey="custom_breakdown" title="Custom Breakdown" />);
        fireEvent.click(screen.getByRole('button', { name: /show custom breakdown legend/i }));
        expect(screen.getByText('Custom1 (1)')).toBeInTheDocument();
        expect(screen.getByText('Custom2 (2)')).toBeInTheDocument();
        expect(
            screen.getByText((content, element) => {
                return element.tagName.toLowerCase() === 'span' && element.textContent.trim() === '(3)';
            }),
        ).toBeInTheDocument();
    });
    const baseProps = {
        chartData: {
            team_breakdown: [
                { team_name: 'Team A', total_objects: 10 },
                { team_name: 'Team B', total_objects: 5 },
            ],
            object_type_breakdown: [
                { object_type_name: 'Type X', object_count: 7 },
                { object_type_name: 'Type Y', object_count: 8 },
            ],
            keyword_breakdown: [
                { keyword: 'Keyword1', object_count: 4 },
                { keyword: 'Keyword2', object_count: 6 },
            ],
            review_status: {
                upcoming: 3,
                due: 2,
                overdue: 1,
            },
            total_objects: 15,
        },
        dataKey: 'team_breakdown',
        title: 'Team Breakdown',
    };

    it('renders chart title', () => {
        render(<GenericBreakdownChart {...baseProps} />);
        expect(screen.getByTestId('generic-breakdown-chart-title')).toHaveTextContent('Team Breakdown');
    });

    it('shows and hides legend on button click', () => {
        render(<GenericBreakdownChart {...baseProps} />);
        const button = screen.getByRole('button', { name: /show team breakdown legend/i });
        fireEvent.click(button);
        expect(screen.getByText('Team A (10)')).toBeInTheDocument();
        expect(screen.getByText('Team B (5)')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /hide team breakdown legend/i }));
        expect(screen.queryByText('Team A (10)')).toBeNull();
        expect(screen.queryByText('Team B (5)')).toBeNull();
    });

    it('renders with empty data', () => {
        render(<GenericBreakdownChart chartData={{}} dataKey="team_breakdown" title="Team Breakdown" />);
        expect(screen.getByTestId('generic-breakdown-chart-title')).toBeInTheDocument();
    });

    it('renders review status breakdown', () => {
        render(<GenericBreakdownChart chartData={baseProps.chartData} dataKey="review_status" title="Review Status" />);
        expect(screen.getByTestId('generic-breakdown-chart-title')).toHaveTextContent('Review Status');
    });

    it('generateColorShades covers n === 1 branch', () => {
        render(
            <GenericBreakdownChart
                chartData={{ custom_breakdown: [{ label: 'Only', count: 7 }] }}
                dataKey="custom_breakdown"
                title="Custom Breakdown"
            />,
        );
        fireEvent.click(screen.getByRole('button', { name: /show custom breakdown legend/i }));
        expect(screen.getByText('Only (7)')).toBeInTheDocument();
    });

    it('covers review_status branch and 0 fallback', () => {
        render(
            <GenericBreakdownChart
                chartData={{ review_status: { upcoming: 0, due: 0, overdue: 0 } }}
                dataKey="review_status"
                title="Review Status"
            />,
        );
        fireEvent.click(screen.getByRole('button', { name: /show review status legend/i }));
        expect(screen.getByText('Upcoming (0)')).toBeInTheDocument();
        expect(screen.getByText('Due (0)')).toBeInTheDocument();
        expect(screen.getByText('Overdue (0)')).toBeInTheDocument();
    });

    it('covers review_status branch when review_status is missing', () => {
        render(<GenericBreakdownChart chartData={{}} dataKey="review_status" title="Review Status" />);
        fireEvent.click(screen.getByRole('button', { name: /show review status legend/i }));
        expect(screen.getByText('Upcoming (0)')).toBeInTheDocument();
        expect(screen.getByText('Due (0)')).toBeInTheDocument();
        expect(screen.getByText('Overdue (0)')).toBeInTheDocument();
    });

    it('covers item.count || 0 fallback', () => {
        render(
            <GenericBreakdownChart
                chartData={{ custom_breakdown: [{ label: 'NoCount' }] }}
                dataKey="custom_breakdown"
                title="Custom Breakdown"
            />,
        );
        fireEvent.click(screen.getByRole('button', { name: /show custom breakdown legend/i }));
        expect(screen.getByText('NoCount (0)')).toBeInTheDocument();
    });
});
