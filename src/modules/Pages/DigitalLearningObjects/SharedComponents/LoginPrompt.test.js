import React from 'react';
import { render, screen } from '@testing-library/react';

import LoginPrompt from './LoginPrompt';

describe('LoginPrompt', () => {
    it('supports spaces-specific messaging without rendering a default help link', () => {
        render(
            <LoginPrompt
                isLoggedIn={false}
                prompt="to save your favourite study spaces"
                helpUrl=""
                helpAriaLabel="Learn more about bookable spaces"
            />,
        );

        expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute(
            'href',
            expect.stringContaining('auth.library.uq.edu.au/login'),
        );
        expect(screen.getByText(/to save your favourite study spaces/i)).toBeInTheDocument();
        expect(screen.queryByLabelText(/learn more about/i)).not.toBeInTheDocument();
    });
});
