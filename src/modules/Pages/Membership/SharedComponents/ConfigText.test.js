import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { mui1theme } from 'config';

import ConfigText, { NEW_WINDOW_WARNING, isSafeHref } from './ConfigText';

const setup = props =>
    render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={mui1theme}>
                <ConfigText data-testid="config-text" {...props} />
            </ThemeProvider>
        </StyledEngineProvider>,
    );

describe('ConfigText', () => {
    describe('the words themselves', () => {
        it('renders plain prose', () => {
            setup({ text: 'For members of the general public. Membership costs $25 per year.' });

            expect(screen.getByTestId('config-text')).toHaveTextContent(
                'For members of the general public. Membership costs $25 per year.',
            );
        });

        it('renders nothing at all when there is nothing to say', () => {
            const { container } = setup({ text: '' });
            expect(container).toBeEmptyDOMElement();

            setup({ text: undefined });
            expect(screen.queryByTestId('config-text')).not.toBeInTheDocument();
        });

        it('can be asked to render as a different element', () => {
            setup({ text: 'Some conditions', component: 'div' });

            expect(screen.getByTestId('config-text').tagName).toBe('DIV');
        });
    });

    describe('the links the config writes', () => {
        it('renders a link, keeping its words and its destination', () => {
            setup({
                text: 'Free membership for eligible <a href="https://web.library.uq.edu.au/find-and-borrow">staff and students</a> from a University.',
            });

            const link = screen.getByRole('link', { name: /staff and students/ });
            expect(link).toHaveAttribute('href', 'https://web.library.uq.edu.au/find-and-borrow');
            expect(screen.getByTestId('config-text')).toHaveTextContent(
                'Free membership for eligible staff and students from a University.',
            );
        });

        it('renders a mailto link, which the upload instructions rely on', () => {
            setup({ text: 'emailed to <a href="mailto:hhsl@library.uq.edu.au">hhsl@library.uq.edu.au</a>.' });

            expect(screen.getByRole('link', { name: 'hhsl@library.uq.edu.au' })).toHaveAttribute(
                'href',
                'mailto:hhsl@library.uq.edu.au',
            );
        });

        it('warns that a link opens a new window before it is followed', () => {
            setup({ text: '<a target="_blank" href="https://web.library.uq.edu.au/rules">borrowing rules</a>' });

            expect(screen.getByRole('link', { name: `borrowing rules${NEW_WINDOW_WARNING}` })).toBeInTheDocument();
        });

        // A target="_blank" link with no rel lets the opened page rewrite ours, so rel must be added.
        it('stops a new-window link from being able to rewrite the page that opened it', () => {
            setup({ text: '<a target="_blank" href="https://example.org/x">somewhere</a>' });

            expect(screen.getByRole('link', { name: /somewhere/ })).toHaveAttribute('rel', 'noopener noreferrer');
        });

        it('leaves a same-window link alone', () => {
            setup({ text: '<a href="https://example.org/x">somewhere</a>' });

            const link = screen.getByRole('link', { name: 'somewhere' });
            expect(link).not.toHaveAttribute('rel');
            expect(link).not.toHaveAttribute('target');
        });

        it('renders several links in the one piece of text', () => {
            setup({
                text: 'eligible <a href="https://a.example/1">staff</a> from a member of the <a href="https://b.example/2">agreement</a>.',
            });

            expect(screen.getAllByRole('link')).toHaveLength(2);
        });
    });

    describe('markup that is not on the allowlist', () => {
        it('keeps the words of a tag it does not render, and drops the tag', () => {
            setup({ text: '<p>Please allow <strong>5 working days</strong> for processing.</p>' });

            const rendered = screen.getByTestId('config-text');
            expect(rendered).toHaveTextContent('Please allow 5 working days for processing.');
            expect(rendered.querySelector('strong')).not.toBeInTheDocument();
            expect(rendered.querySelector('p')).not.toBeInTheDocument();
        });

        it('does not put a script on the page', () => {
            setup({ text: 'Membership costs $25.<script>window.pwned = true;</script>' });

            expect(screen.getByTestId('config-text').querySelector('script')).not.toBeInTheDocument();
            expect(window.pwned).toBeUndefined();
        });

        it('does not put an image with an error handler on the page', () => {
            setup({ text: '<img src="x" onerror="window.pwned = true" />' });

            const rendered = screen.getByTestId('config-text');
            expect(rendered.querySelector('img')).not.toBeInTheDocument();
            expect(rendered).not.toHaveAttribute('onerror');
            expect(window.pwned).toBeUndefined();
        });

        it('does not carry an event handler across from a link', () => {
            setup({ text: '<a href="https://example.org/x" onclick="window.pwned = true">click</a>' });

            expect(screen.getByRole('link', { name: 'click' })).not.toHaveAttribute('onclick');
        });

        it('does not render an iframe', () => {
            setup({ text: '<iframe src="https://evil.example"></iframe>' });

            expect(screen.getByTestId('config-text').querySelector('iframe')).not.toBeInTheDocument();
        });

        it('drops a comment without rendering it', () => {
            setup({ text: 'Membership costs $25.<!-- a comment -->' });

            expect(screen.getByTestId('config-text')).toHaveTextContent('Membership costs $25.');
            expect(screen.getByTestId('config-text')).not.toHaveTextContent('a comment');
        });
    });

    describe('links that could navigate somewhere dangerous', () => {
        it('refuses to render a javascript: link as a link, but keeps its words', () => {
            setup({ text: '<a href="javascript:window.pwned = true">click me</a>' });

            expect(screen.queryByRole('link')).not.toBeInTheDocument();
            expect(screen.getByTestId('config-text')).toHaveTextContent('click me');
        });

        it('is not fooled by whitespace or case in the scheme', () => {
            setup({ text: '<a href="  JaVaScRiPt:alert(1)">click me</a>' });

            expect(screen.queryByRole('link')).not.toBeInTheDocument();
        });

        it('refuses to render a data: link', () => {
            setup({ text: '<a href="data:text/html,<h1>hi</h1>">click me</a>' });

            expect(screen.queryByRole('link')).not.toBeInTheDocument();
        });

        it('refuses to render a link with no destination', () => {
            setup({ text: '<a>click me</a>' });

            expect(screen.queryByRole('link')).not.toBeInTheDocument();
            expect(screen.getByTestId('config-text')).toHaveTextContent('click me');
        });
    });

    describe('isSafeHref', () => {
        it('allows the schemes the config actually uses', () => {
            expect(isSafeHref('https://web.library.uq.edu.au/x')).toBe(true);
            expect(isSafeHref('http://www.caul.edu.au/x')).toBe(true);
            expect(isSafeHref('mailto:hhsl@library.uq.edu.au')).toBe(true);
        });

        it('allows a relative link, judged on the scheme it would navigate to', () => {
            expect(isSafeHref('/membership/form/alumninew')).toBe(true);
        });

        it('refuses a scheme that can run code or carry a payload', () => {
            expect(isSafeHref('javascript:alert(1)')).toBe(false);
            expect(isSafeHref('data:text/html,<h1>hi</h1>')).toBe(false);
            expect(isSafeHref('vbscript:msgbox(1)')).toBe(false);
        });

        it('refuses nothing at all, and refuses something that is not a URL', () => {
            expect(isSafeHref('')).toBe(false);
            expect(isSafeHref(null)).toBe(false);
            expect(isSafeHref(undefined)).toBe(false);
            expect(isSafeHref('http://[not a url')).toBe(false);
        });
    });
});
