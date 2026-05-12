import React from 'react';

import { act, fireEvent, rtlRender, screen } from 'test-utils';

jest.mock('../../../../public/images/spaces/hero-jk-murray-library-gatton-students-outdoor-study.jpg', () =>
    'mock-journey-hero-image',
);
jest.mock('../../../../public/images/digital-learning-hub-hero-shot-wide.png', () => 'mock-journey-detail-image');

import BookableSpacesJourney from './BookableSpacesJourney';

jest.mock('modules/Pages/BookableSpaces/BookableSpacesMap', () => {
    return function MockBookableSpacesMap() {
        return <div data-testid="mock-bookable-spaces-map" />;
    };
});

describe('BookableSpacesJourney browser back navigation', () => {
    const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;

    beforeAll(() => {
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
    });

    afterAll(() => {
        window.HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
    });

    const baseSpace = {
        space_id: 101,
        space_name: 'Quiet Study Room A',
        space_library_name: 'Central Library',
        space_type: 'Silent study',
        space_type_details: {
            space_type_name: 'Silent study',
            space_type_description: 'Designed for quiet independent study.',
        },
        space_description: 'A very quiet area for focused work.',
        space_capacity: 8,
        space_latitude: -27.5,
        space_longitude: 153.0,
        space_campus_id: 1,
        space_external_book_url: 'https://example.com/book/quiet-room-a',
        facility_types: [{ facility_type_id: 11, facility_type_name: 'Quiet' }],
    };

    const defaultProps = {
        filteredSpaceLocations: [baseSpace],
        totalSpaceCount: 1,
        highlightedSpace: baseSpace,
        selectedFacilityTypes: [],
        setSelectedFacilityTypes: jest.fn(),
        filteredFacilityTypeList: { data: { facility_type_groups: [] } },
        facilityTypeList: { data: { facility_type_groups: [] } },
        facilityTypeListLoading: false,
        facilityTypeListError: null,
        minimumSpaceCapacity: 1,
        maximumSpaceCapacity: 20,
        capacityFilterValue: [1, 20],
        setCapacityFilterValue: jest.fn(),
        campusList: [{ campus_id: 1, campus_name: 'St Lucia' }],
        selectedCampus: 1,
        handleCampusSelection: jest.fn(),
        activeFilterCount: 0,
        librariesForCampus: [{ library_id: 1, library_name: 'Central Library' }],
        selectedLibrary: 1,
        handleLibrarySelection: jest.fn(),
        weeklyHours: null,
        weeklyHoursLoading: false,
        weeklyHoursError: null,
    };

    it('keeps browser back navigation inside journey steps before leaving the page', () => {
        const pushStateSpy = jest.spyOn(window.history, 'pushState');

        rtlRender(<BookableSpacesJourney {...defaultProps} />);

        fireEvent.click(screen.getByTestId('spaces-journey-landing-get-started'));
        expect(screen.getByText('What sort of space would you like to find?')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /quiet space/i }));
        expect(screen.getByRole('heading', { level: 2, name: /quiet space/i })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /quiet study room a/i }));
        expect(screen.getByRole('button', { name: /back to results/i })).toBeInTheDocument();

        act(() => {
            window.dispatchEvent(new PopStateEvent('popstate', { state: { journeyView: 'results' } }));
        });
        expect(screen.getByRole('heading', { level: 2, name: /quiet space/i })).toBeInTheDocument();

        act(() => {
            window.dispatchEvent(new PopStateEvent('popstate', { state: { journeyView: 'intent' } }));
        });
        expect(screen.getByText('What sort of space would you like to find?')).toBeInTheDocument();

        act(() => {
            window.dispatchEvent(new PopStateEvent('popstate', { state: { journeyView: 'landing' } }));
        });
        expect(screen.getByTestId('spaces-journey-landing-get-started')).toBeInTheDocument();

        expect(pushStateSpy).toHaveBeenCalledTimes(3);
        pushStateSpy.mockRestore();
    });
});
