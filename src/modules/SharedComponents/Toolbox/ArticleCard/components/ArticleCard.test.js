import React from 'react';

import { fireEvent, rtlRender, screen } from 'test-utils';
import { useMediaQuery } from '@mui/material';

import ArticleCard, {
    featuredBorderBottom,
    featuredDescriptionText,
    featuredImageMarginBottom,
    featuredImagePaddingBottom,
    featuredTextMarginTop,
    handleImageError,
    hasDescriptionText,
    shouldRenderTextFirst,
    shouldUseRouterLink,
} from './ArticleCard';
import { WithRouter } from 'test-utils';

jest.mock('@mui/material', () => {
    const actual = jest.requireActual('@mui/material');
    return {
        ...actual,
        useMediaQuery: jest.fn(),
    };
});

jest.mock('../../../../../../public/images/article_placeholder.jpg', () => 'test-file-stub');

describe('ArticleCard', () => {
    const baseArticle = {
        title: 'Example article',
        description: 'Example description',
        categories: ['News'],
        canonical_url: '/news/example',
        image: 'https://example.com/article.jpg',
        imagePosition: 'top',
    };

    const renderCard = ({ article = baseArticle, ...props } = {}, withRouter = false) => {
        const card = (
            <ArticleCard
                article={article}
                articleindex={0}
                cardId="article-card-id"
                cardTestId="article-card"
                titleTestId="article-title"
                imageTestId="article-image"
                contentTestId="article-content"
                eyebrowTestId="article-eyebrow"
                textTestId="article-text"
                linkTestId="article-link"
                analyticsId="article-analytics"
                {...props}
            />
        );

        return withRouter ? rtlRender(<WithRouter>{card}</WithRouter>) : rtlRender(card);
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useMediaQuery.mockImplementation(() => false);
    });

    it('renders the non-featured layout with fallback data and a plain anchor link', () => {
        renderCard({
            article: {
                title: undefined,
                description: '',
                categories: [],
                canonical_url: null,
                image: undefined,
                imagePosition: undefined,
            },
            enableFeaturedLayout: false,
            useRouterLink: false,
        });

        expect(screen.getByTestId('article-card-id')).toBeInTheDocument();
        expect(screen.getByText('Library update')).toBeInTheDocument();
        expect(screen.getByText('Services and spaces')).toBeInTheDocument();
        expect(screen.getByTestId('article-link')).toHaveAttribute('data-analyticsid', 'article-analytics');

        const image = screen.getByRole('img', { name: 'Library update' });
        expect(image).toHaveAttribute('src', 'test-file-stub');

        Object.defineProperty(image, 'src', { value: 'https://example.com/bad-image.jpg', writable: true, configurable: true });
        fireEvent.error(image);
        expect(image.getAttribute('src')).toBe('test-file-stub');

        Object.defineProperty(image, 'src', { value: 'test-file-stub', writable: true, configurable: true });
        fireEvent.error(image);
        expect(image.getAttribute('src')).toBe('test-file-stub');
    });

    it('renders the featured layout as text-first for the first item using the router link branch', () => {
        useMediaQuery.mockImplementation(query => String(query).includes('min-width'));

        renderCard(
            {
                article: baseArticle,
                articleindex: 0,
                enableFeaturedLayout: true,
                useRouterLink: true,
            },
            true,
        );

        expect(screen.getByText('Example article')).toBeInTheDocument();
        expect(screen.getByText('News')).toBeInTheDocument();
        expect(screen.getByText('Example description')).toBeInTheDocument();
        expect(screen.getByRole('link')).toHaveAttribute('href', '/news/example');
    });

    it('renders the featured layout as image-first for secondary items and keeps the anchor fallback', () => {
        useMediaQuery.mockImplementation(query => String(query).includes('max-width'));

        renderCard({
            article: { ...baseArticle, description: '   ', categories: ['Events'] },
            articleindex: 1,
            enableFeaturedLayout: true,
            useRouterLink: false,
        });

        expect(screen.getByText('Example article')).toBeInTheDocument();
        expect(screen.getByText('Events')).toBeInTheDocument();
        expect(screen.getByRole('link')).toHaveAttribute('href', '/news/example');
        expect(screen.queryByText('Example description')).not.toBeInTheDocument();
    });

    it('renders the featured layout for a non-first item when the breakpoint is not mobile', () => {
        useMediaQuery.mockImplementation(() => false);

        renderCard({
            article: { ...baseArticle, description: 'Secondary description', categories: ['Research'] },
            articleindex: 1,
            enableFeaturedLayout: true,
            useRouterLink: false,
        });

        expect(screen.getByText('Example article')).toBeInTheDocument();
        expect(screen.getByText('Research')).toBeInTheDocument();
        expect(screen.queryByText('Secondary description')).not.toBeInTheDocument();
    });

    it('keeps the featured anchor fallback when the canonical URL is missing', () => {
        renderCard({
            article: { ...baseArticle, canonical_url: null },
            articleindex: 1,
            enableFeaturedLayout: true,
            useRouterLink: false,
        });

        const link = screen.getByTestId('article-link');
        expect(link).toHaveAttribute('data-analyticsid', 'article-analytics');
        expect(link.getAttribute('href')).toBeNull();
    });

    it('renders the featured layout with image-first ordering when the first item is not on desktop', () => {
        useMediaQuery.mockImplementation(() => false);

        renderCard({
            article: baseArticle,
            articleindex: 0,
            enableFeaturedLayout: true,
            useRouterLink: false,
        });

        expect(screen.getByTestId('article-image')).toBeInTheDocument();
        expect(screen.getByTestId('article-content')).toBeInTheDocument();
    });

    it('covers the pure helper logic used by the featured layout and image fallback behavior', () => {
        expect(hasDescriptionText('Example description')).toBe(true);
        expect(hasDescriptionText('   ')).toBe(false);
        expect(hasDescriptionText('')).toBe(false);

        expect(shouldRenderTextFirst({ articleindex: 0, isSmUp: true, isSm: false })).toBe(true);
        expect(shouldRenderTextFirst({ articleindex: 1, isSmUp: false, isSm: true })).toBe(true);
        expect(shouldRenderTextFirst({ articleindex: 0, isSmUp: false, isSm: false })).toBe(false);
        expect(shouldRenderTextFirst({ articleindex: 1, isSmUp: false, isSm: false })).toBe(false);

        expect(shouldUseRouterLink(true, '/news/example')).toBe(true);
        expect(shouldUseRouterLink(false, '/news/example')).toBe(false);
        expect(shouldUseRouterLink(true, null)).toBe(false);

        expect(featuredImagePaddingBottom(true, 1)).toBe('91.534%');
        expect(featuredImagePaddingBottom(false, 1)).toBe('66.667%');
        expect(featuredImageMarginBottom(true, 1)).toBe('32px');
        expect(featuredImageMarginBottom(false, 1)).toBeNull();

        expect(featuredTextMarginTop(true, 1)).toBe('0');
        expect(featuredTextMarginTop(false, 0)).toBe('0');
        expect(featuredTextMarginTop(false, 1)).toBe('24px');

        expect(featuredDescriptionText(0, 'Example description')).toBe('Example description');
        expect(featuredDescriptionText(1, 'Example description')).toBe('');

        expect(featuredBorderBottom(true)).toBe('1px solid #ddd');
        expect(featuredBorderBottom(false)).toBe('none');

        const image = document.createElement('img');
        image.src = 'https://example.com/other.jpg';
        handleImageError({ currentTarget: image });
        expect(image.src).toContain('test-file-stub');

        const sameImage = document.createElement('img');
        sameImage.src = image.src;
        handleImageError({ currentTarget: sameImage });
        expect(sameImage.src).toBe(image.src);
    });
});
