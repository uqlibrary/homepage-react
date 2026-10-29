import React from 'react';

import { rtlRender, screen } from 'test-utils';

import { SpacesAdminPage } from './SpacesAdminPage';

describe('SpacesAdminPage', () => {
    it('renders the admin layout and page title with the navigation button', () => {
        rtlRender(
            <SpacesAdminPage
                pageTitle="Manage facilities"
                currentPageSlug="manage-facilities"
                standardPageId="spaces-admin-page-test"
            >
                <div>Child content</div>
            </SpacesAdminPage>,
        );

        expect(screen.getByTestId('spaces-admin-page-test')).toBeInTheDocument();
        expect(screen.getByTestId('SpacesAdminPage')).toBeInTheDocument();
        expect(screen.getByTestId('SpacesAdminPage-systemTitle')).toHaveTextContent('Spaces');
        expect(screen.getByTestId('admin-spaces-page-title')).toHaveTextContent('Manage facilities');
        expect(screen.getByText('Child content')).toBeInTheDocument();
    });
});
