import React from 'react';
import { rtlRender } from 'test-utils';
import ReadingLists from './ReadingLists';

const setup = (props = {}) =>
    rtlRender(<ReadingLists courseCode="FREN1010" headingLevel="h2" readingListLoading={false} {...props} />);

describe('ReadingLists component', () => {
    it('shows loader', () => {
        const { getByRole, queryByTestId } = setup({
            readingListLoading: true,
        });

        expect(getByRole('progressbar', { name: 'Loading Reading lists' })).toBeInTheDocument();
        expect(queryByTestId('unavailable-FREN1010')).not.toBeInTheDocument();
        expect(queryByTestId('reading-list-link')).not.toBeInTheDocument();
    });

    it('shows the error state with a manual Talis link', () => {
        const { getByRole, getByTestId, queryByTestId } = setup({
            readingListError: 'Unavailable',
            readingList: { reading_lists: [{ url: 'https://example.com/list', totalCount: 1 }] },
        });

        expect(getByTestId('unavailable-FREN1010')).toHaveTextContent('Reading list currently unavailable');
        expect(getByRole('link', { name: 'Try manually' })).toHaveAttribute(
            'href',
            'https://uq.rl.talis.com/courses/fren1010.html',
        );
        expect(queryByTestId('reading-list-link')).not.toBeInTheDocument();
    });

    it('shows the empty state when reading lists are missing or empty', () => {
        const { getByRole, getByTestId, rerender } = setup();

        expect(getByTestId('no-reading-lists')).toHaveTextContent('No Reading list for this course.');
        expect(getByRole('link', { name: 'View older lists' })).toHaveAttribute(
            'href',
            'https://uq.rl.talis.com/courses/fren1010.html',
        );

        rerender(<ReadingLists courseCode="FREN1010" headingLevel="h2" readingList={{ reading_lists: [] }} />);

        expect(getByTestId('no-reading-lists')).toBeInTheDocument();
    });

    it('renders a single reading list with its item count and URL', () => {
        const readingList = {
            reading_lists: [{ url: 'https://example.com/french-reading-list', totalCount: 1 }],
        };
        const { getByRole, getByTestId } = setup({ readingList });

        expect(getByRole('heading', { name: 'Course reading lists', level: 2 })).toBeInTheDocument();
        expect(getByTestId('reading-list-link')).toHaveTextContent('FREN1010 Reading list (contains 1 item)');
        expect(getByRole('link', { name: 'FREN1010 Reading list (contains 1 item)' })).toHaveAttribute(
            'href',
            'https://example.com/french-reading-list',
        );
    });

    it('renders multiple reading lists with their item count and Talis URL', () => {
        const { getByRole, getByTestId } = setup({
            readingList: {
                reading_lists: [
                    { url: 'https://example.com/list-one', totalCount: 2 },
                    { url: 'https://example.com/list-two', totalCount: 3 },
                ],
            },
        });

        expect(getByTestId('reading-list-link')).toHaveTextContent('FREN1010 (has 2 reading lists)');
        expect(getByRole('link', { name: 'FREN1010 (has 2 reading lists)' })).toHaveAttribute(
            'href',
            'https://uq.rl.talis.com/courses/fren1010.html',
        );
    });
});
