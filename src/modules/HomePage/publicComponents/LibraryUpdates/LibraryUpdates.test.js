import React from 'react';
import LibraryUpdates from './LibraryUpdates';
import { rtlRender, WithRouter, within } from 'test-utils';

function setup(testProps = {}, renderer = rtlRender) {
    return renderer(
        <WithRouter>
            <LibraryUpdates {...testProps} />
        </WithRouter>,
    );
}

describe('Library Updates panel', () => {
    it('renders article text and image together in a linked card', () => {
        const article = {
            title: 'Library news',
            categories: ['Updates'],
            description: 'A new update.',
            image: '/article.jpg',
            canonical_url: '/about/updates/library-news',
        };
        const { getByTestId, getByRole, getByText } = setup({ drupalArticleList: [article] });

        expect(getByTestId('drupal-article-0')).toHaveAttribute('href', article.canonical_url);
        expect(getByRole('img', { name: 'Library news' })).toHaveAttribute('src', article.image);
        expect(getByTestId('article-1-title')).toHaveTextContent(article.title);
        expect(getByText('Updates')).toBeInTheDocument();
        expect(getByText('A new update.')).toBeInTheDocument();
    });

    it('renders up to four distinct articles from the list', () => {
        const articles = Array.from({ length: 5 }, (_, index) => ({
            title: `Library news ${index + 1}`,
            categories: ['Updates'],
            description: `Update ${index + 1}.`,
            image: `/article-${index + 1}.jpg`,
            canonical_url: `/about/updates/library-news-${index + 1}`,
        }));
        const { getAllByTestId, getByTestId, queryByTestId } = setup({ drupalArticleList: articles });

        expect(getAllByTestId(/^drupal-article-\d+$/)).toHaveLength(4);
        articles.slice(0, 4).forEach((article, index) => {
            const link = getByTestId(`drupal-article-${index}`);

            expect(link).toHaveAttribute('href', article.canonical_url);
            expect(within(link).getByRole('heading', { name: article.title })).toBeInTheDocument();
        });
        expect(queryByTestId('drupal-article-4')).not.toBeInTheDocument();
    });

    it('should render loading panel', () => {
        const props = {
            drupalArticlesLoading: true,
            drupalArticlesError: false,
            drupalArticleList: null,
        };
        const { getByTestId } = setup({ ...props });
        expect(getByTestId('drupal-loading')).toBeInTheDocument();
    });
    it('should render error panel', () => {
        const props = {
            drupalArticlesLoading: false,
            drupalArticlesError: true,
            drupalArticleList: null,
        };
        const { getByTestId } = setup({ ...props });
        expect(getByTestId('drupal-error')).toBeInTheDocument();
    });
    it('should render empty panel', () => {
        const props = {
            drupalArticlesLoading: false,
            drupalArticlesError: false,
            drupalArticleList: [],
        };
        const { getByTestId } = setup({ ...props });
        expect(getByTestId('drupal-empty')).toBeInTheDocument();
    });
});
