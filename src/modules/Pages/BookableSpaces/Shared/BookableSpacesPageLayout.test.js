import React from 'react';

import { rtlRender, screen } from 'test-utils';
import BookableSpacesPageLayout from './BookableSpacesPageLayout';

describe('BookableSpacesPageLayout', () => {
    it('renders children inside the page layout container', () => {
        rtlRender(
            <BookableSpacesPageLayout>
                <div>Bookable spaces content</div>
            </BookableSpacesPageLayout>,
        );

        expect(screen.getByText('Bookable spaces content')).toBeInTheDocument();
    });
});
