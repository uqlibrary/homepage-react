import React from 'react';

import { fireEvent } from '@testing-library/react';
import { rtlRender, screen } from 'test-utils';
import { useAccountContext } from 'context';

import { AdminButton } from './AdminButton';

jest.mock('context', () => ({
    useAccountContext: jest.fn(),
}));

describe('AdminButton', () => {
    beforeEach(() => {
        useAccountContext.mockReturnValue({
            account: {
                id: 'uqstaff',
                groups: ['lib_libapi_SpacesAdmin'],
            },
        });
    });

    it('opens the admin menu and shows the expected entries', () => {
        rtlRender(<AdminButton currentPageSlug="dashboard" />);

        fireEvent.click(screen.getByTestId('admin-spaces-menu-button'));

        expect(screen.getByTestId('admin-spaces-menu')).toBeInTheDocument();
        expect(screen.getByTestId('admin-spaces-visit-dashboard-button')).toHaveTextContent('Manage Spaces');
        expect(screen.getByTestId('admin-spacetypes-visit-dashboard-button')).toHaveTextContent('Manage Space Types');
        expect(screen.getByTestId('admin-spaces-visit-manage-locations-button')).toHaveTextContent('Manage Locations');
        expect(screen.getByTestId('admin-spaces-visit-add-space-button')).toHaveTextContent('Add new Space');
        expect(screen.getByTestId('admin-spaces-visit-manage-facilities-button')).toHaveTextContent('Manage Facility types');
        expect(screen.getByTestId('admin-spaces-visit-homepage-button')).toHaveTextContent('Visit public Spaces page');
    });

    it('toggles the menu closed when the user clicks the trigger again', () => {
        rtlRender(<AdminButton currentPageSlug="manage-locations" />);

        const button = screen.getByTestId('admin-spaces-menu-button');
        fireEvent.click(button);
        expect(button).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByTestId('admin-spaces-menu')).toBeInTheDocument();

        fireEvent.click(button);
        expect(button).toHaveAttribute('aria-expanded', 'false');
    });
});
