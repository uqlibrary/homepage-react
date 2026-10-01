import React from 'react';

import { rtlRender, screen } from 'test-utils';
import BookableSpacesLandingPage from './BookableSpacesLandingPage';

jest.mock('modules/Pages/BookableSpaces/BookableSpacesListContainer', () => ({
    __esModule: true,
    default: function MockBookableSpacesListContainer(props) {
        return <div data-testid="bookable-spaces-list-container" data-props={JSON.stringify(props)} />;
    },
}));

describe('BookableSpacesLandingPage', () => {
    it('renders the layout and the list container', () => {
        rtlRender(<BookableSpacesLandingPage someProp="value" />);

        expect(screen.getByTestId('bookable-spaces-list-container')).toBeInTheDocument();
    });
});
