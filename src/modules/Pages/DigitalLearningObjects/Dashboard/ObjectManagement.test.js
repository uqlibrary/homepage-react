import React from 'react';
import { render, screen } from '@testing-library/react';
import ObjectManagement from './ObjectManagement';

jest.mock('../../Admin/DigitalLearningObjects/dlorAdminHelpers', () => ({
    getUserPostfix: jest.fn(() => ''),
}));

describe('ObjectManagement', () => {
    const baseData = {
        object_management_stats: {
            last_updated_28_days: 7,
            due_review_28_days: 3,
            due_unpublish: 2,
        },
    };

    it('renders all metrics with correct values', () => {
        render(<ObjectManagement data={baseData} />);
        expect(screen.getByText('Updated in last 28 days')).toBeInTheDocument();
        expect(screen.getByText('7')).toBeInTheDocument();
        expect(screen.getByText('Due for review in next 28 days')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('Due to be unpublished')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('renders 0 for missing or null values', () => {
        render(<ObjectManagement data={{ object_management_stats: {} }} />);
        expect(screen.getAllByText('0').length).toBe(3);
    });

    it('handles missing data prop', () => {
        render(<ObjectManagement />);
        expect(screen.getAllByText('0').length).toBe(3);
    });

    it('links have correct hrefs', () => {
        render(<ObjectManagement data={baseData} />);
        const links = screen.getAllByRole('link');
        expect(links[0]).toHaveAttribute('href', expect.stringContaining('type=lastupdated28days'));
        expect(links[1]).toHaveAttribute('href', expect.stringContaining('type=duereview28days'));
        expect(links[2]).toHaveAttribute('href', expect.stringContaining('type=dueunpublish'));
    });
});
