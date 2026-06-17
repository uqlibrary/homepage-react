import React from 'react';

import { fireEvent, rtlRender, screen, waitFor, WithRouter } from 'test-utils';

import { BookableSpacesList } from './BookableSpacesList';

const mockDispatch = jest.fn();
const mockFlyToSpace = jest.fn();
const mockSetCookie = jest.fn();

jest.mock('data/actions/drupalArticlesActions', () => ({
    loadDrupalArticles: () => ({ type: 'LOAD_DRUPAL_ARTICLES' }),
}));

jest.mock('react-redux', () => {
    const actual = jest.requireActual('react-redux');
    return {
        ...actual,
        useDispatch: () => mockDispatch,
    };
});

jest.mock('react-cookie', () => ({
    useCookies: () => [{}, mockSetCookie],
}));

jest.mock('context', () => ({
    useAccountContext: () => ({ account: null }),
}));

jest.mock('@mui/material/useMediaQuery', () => jest.fn(() => false));

jest.mock('modules/Pages/BookableSpaces/SidebarSpacesList', () => () => <div data-testid="mock-spaces-list" />);
jest.mock('modules/Pages/BookableSpaces/BookableSpacesJourney', () => () => <div data-testid="mock-journey" />);

jest.mock('modules/Pages/BookableSpaces/SidebarFilters', () => {
    return function MockSidebarFilters(props) {
        return (
            <button
                data-testid="trigger-campus-change"
                onClick={() => props.handleCampusSelection({ target: { value: '2' } })}
            >
                Trigger campus change
            </button>
        );
    };
});

jest.mock('modules/Pages/BookableSpaces/BookableSpacesMap', () => {
    const ReactModule = jest.requireActual('react');

    return ReactModule.forwardRef(function MockBookableSpacesMap(_props, ref) {
        ReactModule.useImperativeHandle(ref, () => ({
            flyToSpace: mockFlyToSpace,
        }));
        return <div data-testid="mock-bookable-spaces-map" />;
    });
});

describe('BookableSpacesList campus selection', () => {
    const baseProps = {
        actions: {
            loadAllBookableSpacesRooms: jest.fn(),
            loadWeeklyHours: jest.fn(),
            loadAllFacilityTypes: jest.fn(),
            loadSpacesFavourites: jest.fn(),
            addSpaceFavourite: jest.fn(),
            deleteSpaceFavourite: jest.fn(),
        },
        bookableSpacesRoomList: {
            data: {
                locations: [
                    {
                        space_id: 101,
                        space_name: 'St Lucia space',
                        space_latitude: -27.495,
                        space_longitude: 153.013,
                        space_campus_id: 1,
                        space_campus_name: 'St Lucia',
                        space_campus_number: '1',
                        space_building_name: 'Building A',
                        space_building_number: '1',
                        space_library_id: 11,
                        space_library_name: 'Central Library',
                        space_capacity: 4,
                        space_draftmode: false,
                        facility_types: [
                            {
                                facility_type_id: 11,
                                facility_type_name: 'Whiteboard',
                            },
                        ],
                    },
                    {
                        space_id: 201,
                        space_name: 'Gatton space',
                        space_latitude: -27.556,
                        space_longitude: 152.337,
                        space_campus_id: 2,
                        space_campus_name: 'Gatton',
                        space_campus_number: '2',
                        space_building_name: 'Building B',
                        space_building_number: '2',
                        space_library_id: 22,
                        space_library_name: 'Gatton Library',
                        space_capacity: 6,
                        space_draftmode: false,
                        facility_types: [
                            {
                                facility_type_id: 11,
                                facility_type_name: 'Whiteboard',
                            },
                        ],
                    },
                ],
            },
        },
        bookableSpacesRoomListLoading: false,
        bookableSpacesRoomListError: null,
        weeklyHours: { locations: [] },
        weeklyHoursLoading: false,
        weeklyHoursError: null,
        facilityTypeList: {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_id: 1,
                        facility_type_group_name: 'Features',
                        facility_type_group_order: 1,
                        facility_type_group_loads_open: 1,
                        facility_type_children: [
                            {
                                facility_type_id: 11,
                                facility_type_name: 'Whiteboard',
                                filter_display_on: 'both',
                            },
                        ],
                    },
                ],
            },
        },
        facilityTypeListLoading: false,
        facilityTypeListError: null,
        spacesFavouritesList: [],
        drupalArticleList: [],
        drupalArticlesError: null,
        drupalArticlesLoading: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        window.history.replaceState({}, '', '/spaces?advanced=1');
    });

    it('flies to selected campus when campus value is received as a string', async () => {
        rtlRender(
            <WithRouter route="/spaces" initialEntries={['/spaces?advanced=1']}>
                <BookableSpacesList {...baseProps} />
            </WithRouter>,
        );

        fireEvent.click(screen.getByTestId('trigger-campus-change'));

        await waitFor(() => expect(mockFlyToSpace).toHaveBeenCalled());

        const [targetLocation] = mockFlyToSpace.mock.calls[mockFlyToSpace.mock.calls.length - 1];
        expect(targetLocation.space_campus_id).toBe(2);
        expect(targetLocation.space_campus_name).toBe('Gatton');
        expect(mockSetCookie).toHaveBeenCalledWith(
            'UQLspacesPreferredCampus',
            2,
            expect.objectContaining({ expires: expect.any(Date) }),
        );
    });
});
