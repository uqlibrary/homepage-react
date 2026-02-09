import React from 'react';
import { render, screen } from '@testing-library/react';
import EngagementSummary from './EngagementSummary';

// Mock getUserPostfix to control URL output
jest.mock('../../Admin/DigitalLearningObjects/dlorAdminHelpers', () => ({
    getUserPostfix: jest.fn(() => ''),
}));

describe('EngagementSummary', () => {
    const baseData = {
        total_favourites: 5,
        total_subscriptions: 3,
        cultural_advice_objects: 2,
        popular_objects: [1, 2, 3],
    };

    it('renders all metrics with correct values', () => {
        render(<EngagementSummary data={baseData} />);
        expect(screen.getByText('Favourited objects')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('Subscribed objects')).toBeInTheDocument();
        // There are two '3's: one for Subscribed objects, one for Popular objects
        const threes = screen.getAllByText('3');
        // Subscribed objects
        expect(threes[0].closest('a')).toHaveAttribute('aria-label', 'View Subscribed objects');
        // Popular objects
        expect(threes[1].closest('a')).toHaveAttribute('aria-label', 'View Popular objects');
        expect(screen.getByText('Cultural Advice items')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('Popular objects')).toBeInTheDocument();
    });

    it('renders 0 for missing or null values', () => {
        render(<EngagementSummary data={{}} />);
        expect(screen.getAllByText('0').length).toBeGreaterThan(0);
    });

    it('handles popular_objects as a number', () => {
        render(<EngagementSummary data={{ ...baseData, popular_objects: 7 }} />);
        expect(screen.getByText('7')).toBeInTheDocument();
    });

    it('links have correct hrefs', () => {
        render(<EngagementSummary data={baseData} />);
        const links = screen.getAllByRole('link');
        expect(links[0]).toHaveAttribute('href', expect.stringContaining('type=isafavourite'));
        expect(links[1]).toHaveAttribute('href', expect.stringContaining('type=subscribed'));
        expect(links[2]).toHaveAttribute('href', expect.stringContaining('type=culturaladvice'));
        expect(links[3]).toHaveAttribute('href', expect.stringContaining('type=popular'));
    });
});
