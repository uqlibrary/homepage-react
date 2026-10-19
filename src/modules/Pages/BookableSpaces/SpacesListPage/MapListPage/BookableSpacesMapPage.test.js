import React from 'react';

import { rtlRender, screen } from 'test-utils';
import BookableSpacesMapPage from './BookableSpacesMapPage';

const mockUseTitle = jest.fn();

jest.mock('hooks', () => ({
    useTitle: (...args) => mockUseTitle(...args),
}));

jest.mock('modules/Pages/BookableSpaces/BookableSpacesListContainer', () => ({
    __esModule: true,
    default: function MockBookableSpacesListContainer(props) {
        return <div data-testid="map-list-container" data-force-advanced={String(Boolean(props.forceAdvanced))} />;
    },
}));

describe('BookableSpacesMapPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('sets the page title, announces the page, and renders the advanced list view', () => {
        rtlRender(<BookableSpacesMapPage someProp="value" />);

        expect(mockUseTitle).toHaveBeenCalledWith('Bookable Spaces map - UQ Library');
        expect(screen.getByText('Bookable Spaces map')).toBeInTheDocument();
        expect(screen.getByTestId('map-list-container')).toHaveAttribute('data-force-advanced', 'true');
    });
});
