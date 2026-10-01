import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import UserAttention from './UserAttention';

describe('UserAttention Component', () => {
    const theme = createTheme({
        palette: {
            primary: { main: '#51247a' },
            designSystem: {
                headingColor: '#333',
                alert: {
                    warning: '#fdf2d7',
                    error: '#f0f0f0',
                },
            },
        },
    });

    const renderWithTheme = (props) =>
        render(
            <ThemeProvider theme={theme}>
                <UserAttention {...props} />
            </ThemeProvider>,
        );

    describe('Legacy variant', () => {
        it('renders with title and warning tone (default)', () => {
            renderWithTheme({
                titleText: 'Warning Title',
                children: <p>Warning content</p>,
            });

            expect(screen.getByText('Warning Title')).toBeInTheDocument();
            expect(screen.getByText('Warning content')).toBeInTheDocument();
        });

        it('renders without title when hasTitle is false', () => {
            renderWithTheme({
                titleText: 'Hidden Title',
                children: <p>Content visible</p>,
                hasTitle: false,
            });

            expect(screen.queryByText('Hidden Title')).not.toBeInTheDocument();
            expect(screen.getByText('Content visible')).toBeInTheDocument();
        });

        it('renders without title when titleText is not provided', () => {
            renderWithTheme({
                children: <p>Content only</p>,
            });

            expect(screen.getByText('Content only')).toBeInTheDocument();
        });

        it('renders with error tone', () => {
            const { container } = renderWithTheme({
                titleText: 'Error Title',
                children: <p>Error content</p>,
                tone: 'error',
            });

            expect(screen.getByText('Error Title')).toBeInTheDocument();
            expect(container.querySelector('div')).toBeInTheDocument();
        });

        it('renders with custom heading level', () => {
            renderWithTheme({
                titleText: 'Custom Heading',
                children: <p>Content</p>,
                headingLevel: 'h3',
            });

            expect(screen.getByText('Custom Heading')).toBeInTheDocument();
        });

        it('renders with default h4 heading level', () => {
            renderWithTheme({
                titleText: 'Default Heading',
                children: <p>Content</p>,
            });

            expect(screen.getByText('Default Heading')).toBeInTheDocument();
        });

        it('renders with complex children', () => {
            renderWithTheme({
                titleText: 'Complex Title',
                children: (
                    <div>
                        <p>Paragraph 1</p>
                        <p>Paragraph 2</p>
                        <ul>
                            <li>Item 1</li>
                        </ul>
                    </div>
                ),
            });

            expect(screen.getByText('Complex Title')).toBeInTheDocument();
            expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
            expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
            expect(screen.getByText('Item 1')).toBeInTheDocument();
        });
    });

    describe('Aligned variant', () => {
        it('renders with title and warning tone', () => {
            renderWithTheme({
                variant: 'aligned',
                titleText: 'Aligned Warning',
                children: <p>Aligned content</p>,
            });

            expect(screen.getByText('Aligned Warning')).toBeInTheDocument();
            expect(screen.getByText('Aligned content')).toBeInTheDocument();
        });

        it('renders without title when hasTitle is false', () => {
            renderWithTheme({
                variant: 'aligned',
                titleText: 'Hidden Aligned Title',
                children: <p>Content visible</p>,
                hasTitle: false,
            });

            expect(screen.queryByText('Hidden Aligned Title')).not.toBeInTheDocument();
            expect(screen.getByText('Content visible')).toBeInTheDocument();
        });

        it('renders without title when titleText is not provided', () => {
            renderWithTheme({
                variant: 'aligned',
                children: <p>Aligned content only</p>,
            });

            expect(screen.getByText('Aligned content only')).toBeInTheDocument();
        });

        it('renders with error tone', () => {
            renderWithTheme({
                variant: 'aligned',
                titleText: 'Aligned Error',
                children: <p>Error content</p>,
                tone: 'error',
            });

            expect(screen.getByText('Aligned Error')).toBeInTheDocument();
            expect(screen.getByText('Error content')).toBeInTheDocument();
        });

        it('renders with custom heading level', () => {
            renderWithTheme({
                variant: 'aligned',
                titleText: 'Aligned Custom Heading',
                children: <p>Content</p>,
                headingLevel: 'h3',
            });

            expect(screen.getByText('Aligned Custom Heading')).toBeInTheDocument();
        });

        it('renders with default h4 heading level', () => {
            renderWithTheme({
                variant: 'aligned',
                titleText: 'Aligned Default Heading',
                children: <p>Content</p>,
            });

            expect(screen.getByText('Aligned Default Heading')).toBeInTheDocument();
        });

        it('renders icon in accessibility-hidden container', () => {
            const { container } = renderWithTheme({
                variant: 'aligned',
                titleText: 'With Icon',
                children: <p>Content</p>,
            });

            const iconContainer = container.querySelector('.uq-userattention-icon');
            expect(iconContainer).toHaveAttribute('aria-hidden', 'true');
        });

        it('renders with grid layout structure', () => {
            const { container } = renderWithTheme({
                variant: 'aligned',
                titleText: 'Grid Layout',
                children: <p>Content</p>,
            });

            const row = container.querySelector('.uq-userattention-row');
            expect(row).toBeInTheDocument();
            expect(row.querySelector('.uq-userattention-icon')).toBeInTheDocument();
            expect(row.querySelector('.uq-userattention-content')).toBeInTheDocument();
        });
    });

    describe('PropTypes', () => {
        it('has correct propTypes defined', () => {
            expect(UserAttention.propTypes).toBeDefined();
            expect(UserAttention.propTypes.titleText).toBeDefined();
            expect(UserAttention.propTypes.children).toBeDefined();
            expect(UserAttention.propTypes.tone).toBeDefined();
            expect(UserAttention.propTypes.variant).toBeDefined();
            expect(UserAttention.propTypes.headingLevel).toBeDefined();
            expect(UserAttention.propTypes.hasTitle).toBeDefined();
        });
    });

    describe('Default values', () => {
        it('uses warning tone as default', () => {
            const { container } = renderWithTheme({
                titleText: 'Default Tone',
                children: <p>Content</p>,
            });

            expect(container.querySelector('div')).toBeInTheDocument();
        });

        it('uses legacy variant as default', () => {
            const { container } = renderWithTheme({
                titleText: 'Default Variant',
                children: <p>Content</p>,
            });

            // Legacy variant renders without the grid structure
            const row = container.querySelector('.uq-userattention-row');
            expect(row).not.toBeInTheDocument();
        });

        it('uses true as default for hasTitle', () => {
            renderWithTheme({
                titleText: 'Should Render',
                children: <p>Content</p>,
            });

            expect(screen.getByText('Should Render')).toBeInTheDocument();
        });
    });

    describe('Edge cases', () => {
        it('renders with empty children', () => {
            const { container } = renderWithTheme({
                titleText: 'Title Only',
            });

            expect(screen.getByText('Title Only')).toBeInTheDocument();
            expect(container).toBeInTheDocument();
        });

        it('renders with only children, no title', () => {
            renderWithTheme({
                titleText: 'Ignored',
                hasTitle: false,
                children: <p>Only content</p>,
            });

            expect(screen.queryByText('Ignored')).not.toBeInTheDocument();
            expect(screen.getByText('Only content')).toBeInTheDocument();
        });

        it('handles titleText as empty string', () => {
            renderWithTheme({
                titleText: '',
                children: <p>Content</p>,
            });

            expect(screen.getByText('Content')).toBeInTheDocument();
        });
    });
});
