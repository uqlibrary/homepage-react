import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ArtTrailApp from './index';

describe('ArtTrailApp', () => {
    it('renders the fixed app shell and sets the document title', () => {
        render(<ArtTrailApp />);

        expect(screen.getByTestId('art-trail-app')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'open navigation menu' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Trail' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Previous page' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Start the trail' })).toBeEnabled();
        expect(screen.queryByText('Page 1 of 3')).not.toBeInTheDocument();
        expect(document.title).toBe('Art Trail App');
    });

    it('opens the menu and preserves the Trail page state across tab switches', async () => {
        const user = userEvent.setup();

        render(<ArtTrailApp />);

        await user.click(screen.getByRole('button', { name: 'open navigation menu' }));

        expect(screen.getByRole('menuitem', { name: 'Trail overview' })).toBeInTheDocument();
        await user.click(screen.getByRole('menuitem', { name: 'Trail overview' }));

        await user.click(screen.getByRole('button', { name: 'Start the trail' }));
        expect(screen.getByRole('button', { name: 'Previous page' })).toBeEnabled();
        expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled();
        expect(screen.queryByText('Page 1 of 3')).not.toBeInTheDocument();
        expect(screen.getByText('1 / 3')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Featured artwork' })).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Map' }));
        expect(screen.queryByRole('button', { name: 'Previous page' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Next page' })).not.toBeInTheDocument();
        expect(screen.queryByText('Find your way through the trail')).not.toBeInTheDocument();
        expect(screen.getByText('Map component mounts here')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Map overview' })).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Feedback' }));
        expect(screen.queryByRole('button', { name: 'Previous page' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Next page' })).not.toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Quick response' })).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Trail' }));
        expect(screen.getByRole('button', { name: 'Previous page' })).toBeEnabled();
        expect(screen.queryByText('Page 1 of 3')).not.toBeInTheDocument();
        expect(screen.getByText('1 / 3')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Featured artwork' })).toBeInTheDocument();
    });
});
