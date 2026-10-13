import React from 'react';
import { render, screen } from '@testing-library/react';

import LoginPrompt from './LoginPrompt';

describe('LoginPrompt', () => {
    it('supports spaces-specific messaging without rendering a default help link', () => {
        render(
            <LoginPrompt
                isLoggedIn={false}
                prompt="to save your favourite study spaces."
                helpUrl=""
                helpAriaLabel="Learn more about bookable spaces"
            />,
        );

        expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute(
            'href',
            expect.stringContaining('auth.library.uq.edu.au/login'),
        );
        expect(screen.getByText(/to save your favourite study spaces\./i)).toBeInTheDocument();
        expect(screen.queryByLabelText(/learn more about/i)).not.toBeInTheDocument();
    });

    it('renders the default help link and adds punctuation when the prompt is missing it', () => {
        render(
            <LoginPrompt
                isLoggedIn={false}
                prompt="for extra features"
                narrower
                helpUrl="https://guides.library.uq.edu.au/learn-more"
                helpAriaLabel="Learn more about bookable spaces"
            />,
        );

        expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute(
            'href',
            expect.stringContaining('auth.library.uq.edu.au/login'),
        );
        expect(screen.getByText(/for extra features\./i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Learn more about bookable spaces' })).toHaveAttribute(
            'href',
            'https://guides.library.uq.edu.au/learn-more',
        );
    });

    it('falls back to the default prompt when the supplied prompt is blank', () => {
        render(<LoginPrompt isLoggedIn={false} prompt="   " helpUrl="" />);

        expect(screen.getByText(/for extra features\./i)).toBeInTheDocument();
    });

    it('does not render when the user is already logged in', () => {
        const { container } = render(<LoginPrompt isLoggedIn />);

        expect(container).toBeEmptyDOMElement();
    });

    it('does not render when the provided account object is active', () => {
        const { container } = render(<LoginPrompt account={{ id: 123 }} />);

        expect(container).toBeEmptyDOMElement();
    });

    it('renders when an account object exists but has no current identity', () => {
        render(<LoginPrompt account={{}} />);

        expect(screen.getByRole('link', { name: 'Log in' })).toBeInTheDocument();
    });
});
