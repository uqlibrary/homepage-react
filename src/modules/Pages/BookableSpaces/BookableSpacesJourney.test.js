import React from 'react';

import { act, fireEvent, rtlRender, screen } from 'test-utils';

jest.mock(
    '../../../../public/images/spaces/hero-jk-murray-library-gatton-students-outdoor-study.jpg',
    () => 'mock-journey-hero-image',
);
jest.mock('../../../../public/images/digital-learning-hub-hero-shot-wide.png', () => 'mock-journey-detail-image');

import BookableSpacesJourney from './BookableSpacesJourney';

jest.mock('modules/Pages/BookableSpaces/BookableSpacesMap', () => {
    return function MockBookableSpacesMap() {
        return <div data-testid="mock-bookable-spaces-map" />;
    };
});

describe.skip('BookableSpacesJourney browser back navigation', () => {
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

    beforeEach(() => {
        window.history.replaceState({}, '', '/#/spaces');
    });

    // it('keeps browser back navigation inside journey steps before leaving the page', () => {
    //     const pushStateSpy = jest.spyOn(window.history, 'pushState');

    //     rtlRender(<BookableSpacesJourney {...defaultProps} />);

    //     fireEvent.click(screen.getByTestId('spaces-journey-landing-get-started'));
    //     expect(screen.getByText('What sort of space would you like to find?')).toBeInTheDocument();

    //     fireEvent.click(screen.getByRole('button', { name: /quiet space/i }));
    //     expect(screen.getByRole('heading', { level: 2, name: /quiet space/i })).toBeInTheDocument();

    //     fireEvent.click(screen.getByRole('button', { name: /quiet study room a/i }));
    //     expect(screen.getByRole('heading', { level: 3, name: /space details/i })).toBeInTheDocument();

    //     act(() => {
    //         window.dispatchEvent(new PopStateEvent('popstate', { state: { journeyView: 'results' } }));
    //     });
    //     expect(screen.getByRole('heading', { level: 2, name: /quiet space/i })).toBeInTheDocument();

    //     act(() => {
    //         window.dispatchEvent(new PopStateEvent('popstate', { state: { journeyView: 'intent' } }));
    //     });
    //     expect(screen.getByText('What sort of space would you like to find?')).toBeInTheDocument();

    //     act(() => {
    //         window.dispatchEvent(new PopStateEvent('popstate', { state: { journeyView: 'landing' } }));
    //     });
    //     expect(screen.getByTestId('spaces-journey-landing-get-started')).toBeInTheDocument();

    //     expect(pushStateSpy).toHaveBeenCalledTimes(3);
    //     pushStateSpy.mockRestore();
    // });

    it('writes permalink query params as users progress through the journey', () => {
        rtlRender(<BookableSpacesJourney {...defaultProps} />);

        fireEvent.click(screen.getByTestId('spaces-journey-landing-get-started'));
        expect(window.location.search).toContain('journeyStep=intent');

        fireEvent.click(screen.getByRole('button', { name: /quiet space/i }));
        expect(window.location.search).toContain('journeyStep=results');
        expect(window.location.search).toContain('journeyIntent=quiet');

        fireEvent.click(screen.getByRole('button', { name: /quiet study room a/i }));
        expect(window.location.search).toContain('journeyStep=details');
        expect(window.location.search).toContain('journeyIntent=quiet');
        expect(window.location.search).toContain('journeySpace=101');
    });

    it('restores results and selected intent from permalink params', () => {
        window.history.replaceState({}, '', '/spaces?journeyStep=results&journeyIntent=quiet');

        rtlRender(<BookableSpacesJourney {...defaultProps} />);

        expect(screen.getByRole('heading', { level: 2, name: /quiet space/i })).toBeInTheDocument();
    });

    it('restores details view and selected space from permalink params', () => {
        window.history.replaceState({}, '', '/spaces?journeyStep=details&journeyIntent=quiet&journeySpace=101');

        rtlRender(<BookableSpacesJourney {...defaultProps} />);

        expect(screen.getByRole('heading', { level: 3, name: /space details/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: /quiet study room a/i })).toBeInTheDocument();
    });

    it('shows a booking link in results for bookable spaces', () => {
        rtlRender(<BookableSpacesJourney {...defaultProps} />);

        fireEvent.click(screen.getByTestId('spaces-journey-landing-get-started'));
        fireEvent.click(screen.getByRole('button', { name: /quiet space/i }));

        const bookLink = screen.getByRole('link', { name: /book this space/i });
        expect(bookLink).toHaveAttribute('href', baseSpace.space_external_book_url);
        expect(bookLink).toHaveAttribute('target', '_blank');
    });

    it('hides the landing highlighted space block when no highlighted space is available', () => {
        rtlRender(<BookableSpacesJourney {...defaultProps} highlightedSpace={null} />);

        expect(screen.queryByTestId('spaces-journey-landing-highlight-panel')).not.toBeInTheDocument();
    });

    it.skip('hides blank campus options and excludes spaces on invalid campuses in results', () => {
        const orphanSpace = {
            ...baseSpace,
            space_id: 202,
            space_name: 'Orphaned Space',
            space_campus_id: 999,
        };

        const props = {
            ...defaultProps,
            filteredSpaceLocations: [baseSpace, orphanSpace],
            totalSpaceCount: 2,
            campusList: [
                { campus_id: 1, campus_name: 'St Lucia', campus_space_count: 1 },
                { campus_id: 2, campus_name: 'Gatton', campus_space_count: 1 },
                { campus_id: 999, campus_name: '', campus_space_count: 0 },
            ],
        };

        rtlRender(<BookableSpacesJourney {...props} />);

        fireEvent.click(screen.getByTestId('spaces-journey-landing-get-started'));
        fireEvent.click(screen.getByRole('button', { name: /quiet space/i }));

        const campusSection = screen.getByText('Campus').closest('div');
        expect(campusSection.querySelectorAll('button')).toHaveLength(2);
        expect(screen.getByRole('button', { name: 'St Lucia' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Gatton' })).toBeInTheDocument();

        expect(screen.getByText('Quiet Study Room A')).toBeInTheDocument();
        expect(screen.queryByText('Orphaned Space')).not.toBeInTheDocument();
    });

    it.skip('does not show campuses that have no spaces in the inline campus picker', () => {
        const props = {
            ...defaultProps,
            filteredSpaceLocations: [
                baseSpace,
                {
                    ...baseSpace,
                    space_id: 202,
                    space_name: 'Gatton Space',
                    space_campus_id: 2,
                    space_campus_name: 'Gatton',
                },
            ],
            totalSpaceCount: 2,
            campusList: [
                { campus_id: 1, campus_name: 'St Lucia', campus_space_count: 10 },
                { campus_id: 2, campus_name: 'Gatton', campus_space_count: 4 },
                { campus_id: 3, campus_name: 'Dutton Park', campus_space_count: 0 },
            ],
        };

        rtlRender(<BookableSpacesJourney {...props} />);

        fireEvent.click(screen.getByTestId('spaces-journey-landing-get-started'));
        fireEvent.click(screen.getByRole('button', { name: /quiet space/i }));

        expect(screen.getByRole('button', { name: 'St Lucia' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Gatton' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Dutton Park' })).not.toBeInTheDocument();
    });
});
