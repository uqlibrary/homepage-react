import React from 'react';
import { render, screen } from '@testing-library/react';
import FacetSummary from './FacetSummary';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../Admin/DigitalLearningObjects/dlorAdminHelpers', () => ({
    getUserPostfix: jest.fn(() => ''),
}));

describe('FacetSummary', () => {
    const baseData = {
        objects_by_topic: [
            { id: 't1', name: 'Topic 1', count: 10 },
            { id: 't2', name: 'Topic 2', count: 5 },
            { id: 't3', name: 'Topic 3', count: 3 },
            { id: 't4', name: 'Topic 4', count: 2 },
            { id: 't5', name: 'Topic 5', count: 1 },
            { id: 't6', name: 'Topic 6', count: 0 }, // should be filtered out
        ],
        objects_by_audience: [
            { id: 'a1', name: 'Audience 1', count: 8 },
            { id: 'a2', name: 'Audience 2', count: 4 },
        ],
        objects_by_type: [{ id: 'ty1', name: 'Type 1', count: 7 }],
        objects_by_format: [{ id: 'f1', name: 'Format 1', count: 6 }],
        objects_with_cultural_advice: 2,
    };

    it('renders all top facets and totals', () => {
        render(<FacetSummary objectsByFacet={baseData} />, { wrapper: MemoryRouter });
        expect(screen.getByText('Top Topics')).toBeInTheDocument();
        expect(screen.getByText('Top Audiences')).toBeInTheDocument();
        expect(screen.getByText('Top Types')).toBeInTheDocument();
        expect(screen.getByText('Top Formats')).toBeInTheDocument();
        // Totals
        expect(screen.getByText('Total: 21')).toBeInTheDocument(); // topics
        expect(screen.getByText('Total: 12')).toBeInTheDocument(); // audiences
        expect(screen.getByText('Total: 7')).toBeInTheDocument(); // types
        expect(screen.getByText('Total: 6')).toBeInTheDocument(); // formats
        // Top entries
        expect(screen.getByText('Topic 1: 10')).toBeInTheDocument();
        expect(screen.getByText('Audience 1: 8')).toBeInTheDocument();
        expect(screen.getByText('Type 1: 7')).toBeInTheDocument();
        expect(screen.getByText('Format 1: 6')).toBeInTheDocument();
    });

    it('renders empty arrays and zero totals gracefully', () => {
        render(
            <FacetSummary
                objectsByFacet={{
                    objects_by_topic: [],
                    objects_by_audience: [],
                    objects_by_type: [],
                    objects_by_format: [],
                    objects_with_cultural_advice: 0,
                }}
            />,
            { wrapper: MemoryRouter },
        );
        expect(screen.getAllByText('Total: 0').length).toBe(4);
    });

    it('filters out items with count 0 or missing count', () => {
        render(
            <FacetSummary
                objectsByFacet={{
                    objects_by_topic: [
                        { id: 't1', name: 'Topic 1', count: 0 },
                        { id: 't2', name: 'Topic 2' },
                        { id: 't3', name: 'Topic 3', count: 2 },
                    ],
                    objects_by_audience: [],
                    objects_by_type: [],
                    objects_by_format: [],
                }}
            />,
            { wrapper: MemoryRouter },
        );
        expect(screen.getByText('Topic 3: 2')).toBeInTheDocument();
        expect(screen.queryByText('Topic 1: 0')).not.toBeInTheDocument();
        expect(screen.queryByText('Topic 2:')).not.toBeInTheDocument();
    });

    it('handles missing objectsByFacet prop', () => {
        render(<FacetSummary />, { wrapper: MemoryRouter });
        expect(screen.getAllByText('Total: 0').length).toBe(4);
    });

    it('links have correct URLs', () => {
        render(<FacetSummary objectsByFacet={baseData} />, { wrapper: MemoryRouter });
        const topicLink = screen.getByText('Topic 1: 10').closest('a');
        expect(topicLink).toHaveAttribute('href', expect.stringContaining('filters=t1'));
        const audienceLink = screen.getByText('Audience 1: 8').closest('a');
        expect(audienceLink).toHaveAttribute('href', expect.stringContaining('filters=a1'));
    });
});
