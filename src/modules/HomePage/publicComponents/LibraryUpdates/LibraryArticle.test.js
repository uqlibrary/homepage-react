import React from 'react';
import mediaQuery from 'css-mediaquery';
import { rtlRender, WithRouter, within } from 'test-utils';

import LibraryArticle from './LibraryArticle';

const article = {
    title: 'Library news',
    categories: ['Updates'],
    description: 'A new update.',
    image: '/article.jpg',
    canonical_url: '/about/updates/library-news',
};

function setup(articleindex = 0, width = 1024) {
    window.matchMedia = query => ({
        matches: mediaQuery.match(query, { width }),
        addListener: () => {},
        removeListener: () => {},
    });

    return rtlRender(
        <WithRouter>
            <LibraryArticle article={article} articleindex={articleindex} />
        </WithRouter>,
    );
}

describe('LibraryArticle', () => {
    const originalMatchMedia = window.matchMedia;

    afterEach(() => {
        window.matchMedia = originalMatchMedia;
    });

    it('renders lead article content inside its link on desktop', () => {
        const { getByTestId } = setup();
        const link = getByTestId('drupal-article-0');
        const linkedContent = within(link);

        expect(link).toHaveAttribute('href', article.canonical_url);
        expect(link).toHaveAttribute('data-analyticsid', 'spotlights-link-0');
        expect(linkedContent.getByTestId('article-1-title')).toHaveTextContent(article.title);
        expect(linkedContent.getByText('Updates')).toBeInTheDocument();
        expect(linkedContent.getByText(article.description)).toBeInTheDocument();
        expect(linkedContent.getByRole('img', { name: article.title })).toHaveAttribute('src', article.image);
    });

    it.each([
        ['lead article on mobile', 0, 375],
        ['secondary article on desktop', 1, 1024],
        ['secondary article on mobile', 1, 375],
    ])('renders the content for a %s inside its link', (_, articleindex, width) => {
        const { getByTestId } = setup(articleindex, width);
        const linkedContent = within(getByTestId(`drupal-article-${articleindex}`));

        expect(linkedContent.getByTestId(`article-${articleindex + 1}-title`)).toHaveTextContent(article.title);
        expect(linkedContent.getByRole('img', { name: article.title })).toHaveAttribute('src', article.image);
        if (articleindex !== 0) {
            expect(linkedContent.queryByText(article.description)).not.toBeInTheDocument();
        }
    });
});
