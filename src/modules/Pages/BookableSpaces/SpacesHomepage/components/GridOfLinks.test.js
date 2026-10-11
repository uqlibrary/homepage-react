import React from 'react';

import { render } from '@testing-library/react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createMemoryRouter, RouterProvider } from 'react-router';

import { mui1theme } from 'config/theme';
import { rtlRender, screen, WithRouter } from 'test-utils';

import { GridOfLinks } from './GridOfLinks';

describe('GridOfLinks', () => {
    it('renders the heading and supports both external and internal link styles', () => {
        const links = [
            {
                key: 'book-space',
                label: 'Book a library study space',
                href: 'https://example.com/book',
                target: '_blank',
                rel: 'noopener noreferrer',
            },
            {
                key: 'find-space',
                label: 'Find a study space',
                to: '/spaces/results',
            },
            {
                label: 'Fallback route',
            },
        ];

        rtlRender(
            <WithRouter>
                <GridOfLinks title="Using library spaces" links={links} />
            </WithRouter>,
        );

        expect(screen.getByRole('heading', { name: 'Using library spaces' })).toBeInTheDocument();

        const externalLink = screen.getByRole('link', { name: 'Book a library study space' });
        expect(externalLink).toHaveAttribute('href', 'https://example.com/book');
        expect(externalLink).toHaveAttribute('target', '_blank');
        expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');

        const internalLink = screen.getByRole('link', { name: 'Find a study space' });
        expect(internalLink).toHaveAttribute('href', '/spaces/results');

        const fallbackLink = screen.getByRole('link', { name: 'Fallback route' });
        expect(fallbackLink).toBeInTheDocument();
    });

    it('does not render a title or links when the section is empty', () => {
        rtlRender(
            <WithRouter>
                <GridOfLinks />
            </WithRouter>,
        );

        expect(screen.queryByRole('heading')).not.toBeInTheDocument();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('renders a title without list items when the links array is empty', () => {
        rtlRender(
            <WithRouter>
                <GridOfLinks title="Available links" links={[]} />
            </WithRouter>,
        );

        expect(screen.getByRole('heading', { name: 'Available links' })).toBeInTheDocument();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('uses the fallback divider and empty label branch when a link is missing its label or theme divider', () => {
        const router = createMemoryRouter(
            [
                {
                    path: '/',
                    element: (
                        <GridOfLinks
                            title="Fallback paths"
                            links={[{ key: 'blank', label: '', href: 'https://example.com/blank' }]}
                        />
                    ),
                },
            ],
            {
                initialEntries: ['/'],
            },
        );

        render(
            <MuiThemeProvider theme={{ ...mui1theme, palette: { ...mui1theme.palette, divider: undefined } }}>
                <RouterProvider router={router} />
            </MuiThemeProvider>,
        );

        expect(screen.getByRole('heading', { name: 'Fallback paths' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: '' })).toBeInTheDocument();
    });
});
