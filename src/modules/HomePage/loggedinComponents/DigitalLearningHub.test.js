import React from 'react';
import { rtlRender, WithRouter } from 'test-utils';

import { DigitalLearningHub } from './DigitalLearningHub';

const defaultProps = {
    account: { id: '12345' },
    dlorStatistics: { my_favourites: 2, featured_objects: 3 },
    dlorStatisticsLoading: false,
    dlorStatisticsError: false,
};

function setup(testProps = {}) {
    return rtlRender(
        <WithRouter>
            <DigitalLearningHub {...defaultProps} {...testProps} />
        </WithRouter>,
    );
}

describe('DigitalLearningHub', () => {
    it('shows default content and statistics links when data is available', () => {
        const { getByRole, getByText } = setup();

        expect(getByRole('heading', { name: 'Build digital skills' })).toBeInTheDocument();
        expect(getByText('Find modules, videos and guides for study and teaching')).toBeInTheDocument();
        expect(getByRole('link', { name: 'Digital Learning Hub' })).toHaveAttribute('href', '/digital-learning-hub');
        expect(getByRole('link', { name: 'Your favourites (2)' })).toHaveAttribute(
            'href',
            '/digital-learning-hub?type=favourite',
        );
        expect(getByRole('link', { name: 'Featured objects (3)' })).toHaveAttribute(
            'href',
            '/digital-learning-hub?type=featured',
        );
    });

    it('uses an overridden title and description and displays zero counts', () => {
        const { getByRole, getByText } = setup({
            title: 'Explore digital learning',
            subText: 'Find a learning resource',
            dlorStatistics: { my_favourites: 0, featured_objects: 0 },
        });

        expect(getByRole('heading', { name: 'Explore digital learning' })).toBeInTheDocument();
        expect(getByText('Find a learning resource')).toBeInTheDocument();
        expect(getByRole('link', { name: 'Your favourites (0)' })).toBeInTheDocument();
        expect(getByRole('link', { name: 'Featured objects (0)' })).toBeInTheDocument();
    });

    it.each([
        ['no account', { account: null }],
        ['loading statistics', { dlorStatisticsLoading: true }],
        ['statistics error', { dlorStatisticsError: new Error('Unavailable') }],
    ])('hides favourites for %s but still shows featured objects', (_, props) => {
        const { getByRole, queryByRole } = setup(props);

        expect(queryByRole('link', { name: /Your favourites/ })).not.toBeInTheDocument();
        expect(getByRole('link', { name: 'Featured objects (3)' })).toHaveAttribute(
            'href',
            '/digital-learning-hub?type=featured',
        );
    });

    it('hides favourites but retains the featured link when statistics are unavailable', () => {
        const { getByRole, queryByRole } = setup({ dlorStatistics: null });

        expect(queryByRole('link', { name: /Your favourites/ })).not.toBeInTheDocument();
        expect(getByRole('link', { name: 'Featured objects ()' })).toHaveAttribute(
            'href',
            '/digital-learning-hub?type=featured',
        );
    });
});
