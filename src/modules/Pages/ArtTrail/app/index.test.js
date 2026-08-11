import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cookies from 'js-cookie';

import ArtTrailApp from './index';

jest.mock('js-cookie', () => ({
    get: jest.fn(),
    set: jest.fn(),
}));

const culturalDisclaimerText =
    'Aboriginal and Torres Strait Islander visitors are advised that the description of the following artwork may contain names of people who are deceased. Permission has been granted from the family for the artwork to be shown as part of the UQ Art Collection.';

describe('ArtTrailApp', () => {
    beforeEach(() => {
        Cookies.get.mockReset();
        Cookies.set.mockReset();
        Cookies.get.mockReturnValue(undefined);
    });

    it('renders the fixed app shell and sets the document title', () => {
        render(<ArtTrailApp />);

        expect(screen.getByTestId('art-trail-app')).toBeInTheDocument();
        expect(screen.getByText(culturalDisclaimerText)).toBeInTheDocument();
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
        expect(screen.getByRole('button', { name: 'About the artwork' })).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Map' }));
        expect(screen.queryByRole('button', { name: 'Previous page' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Next page' })).not.toBeInTheDocument();
        expect(screen.queryByText('Find your way through the trail')).not.toBeInTheDocument();
        expect(screen.getByText('Map component mounts here')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Feedback' }));
        expect(screen.queryByRole('button', { name: 'Previous page' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Next page' })).not.toBeInTheDocument();
        expect(screen.getByText('Feedback form here or something else')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Trail' }));
        expect(screen.getByRole('button', { name: 'Previous page' })).toBeEnabled();
        expect(screen.queryByText('Page 1 of 3')).not.toBeInTheDocument();
        expect(screen.getByText('1 / 3')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'About the artwork' })).toBeInTheDocument();
    });

    it('opens and closes the page drawer from a Trail page', async () => {
        const user = userEvent.setup();

        render(<ArtTrailApp />);

        await user.click(screen.getByRole('button', { name: 'Start the trail' }));
        await user.click(screen.getByRole('button', { name: 'More information about this artwork' }));

        expect(screen.getByRole('heading', { name: /Hector Tjupuru Burton/i })).toBeInTheDocument();
        expect(screen.getByText(/synthetic polymer paint on linen/i)).toBeInTheDocument();

        await user.keyboard('{Escape}');

        expect(screen.queryByRole('heading', { name: /Hector Tjupuru Burton/i })).not.toBeInTheDocument();
    });

    it('dismisses the cultural disclaimer across tabs and persists dismissal in a cookie', async () => {
        const user = userEvent.setup();

        render(<ArtTrailApp />);

        await user.click(screen.getByRole('button', { name: 'Dismiss cultural disclaimer' }));

        expect(Cookies.set).toHaveBeenCalledWith('ART_TRAIL_CULTURAL_DISCLAIMER_SEEN', 'true', { path: '/' });
        expect(screen.queryByText(culturalDisclaimerText)).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Map' }));
        expect(screen.queryByText(culturalDisclaimerText)).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Feedback' }));
        expect(screen.queryByText(culturalDisclaimerText)).not.toBeInTheDocument();
    });

    it('does not render the cultural disclaimer when the dismissal cookie is true', () => {
        Cookies.get.mockReturnValue('true');

        render(<ArtTrailApp />);

        expect(screen.queryByText(culturalDisclaimerText)).not.toBeInTheDocument();
    });
});
