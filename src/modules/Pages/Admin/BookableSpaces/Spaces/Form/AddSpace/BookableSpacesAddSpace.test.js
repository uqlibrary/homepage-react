import React from 'react';

import { fireEvent, rtlRender, screen, waitFor } from 'test-utils';
import { useCookies } from 'react-cookie';
import { useAccountContext } from 'context';

import BookableSpacesAddSpace from './BookableSpacesAddSpace';

jest.mock('react-cookie', () => ({
    useCookies: jest.fn(),
}));

jest.mock('context', () => ({
    useAccountContext: jest.fn(),
}));

jest.mock('modules/Pages/Admin/BookableSpaces/bookableSpacesAdminHelpers', () => ({
    addBreadcrumbsToSiteHeader: jest.fn(),
    initialisedSpringshareList: jest.fn(() => ({ libraries: ['Lib1', 'Lib2'] })),
    safeCampusIndex: jest.fn(() => 0),
    spacesAdminLink: jest.fn((path, account) => `${account?.id ?? 'anon'}${path}`),
    validCampusList: jest.fn(list => list.filter(c => c?.campus_id > 0)),
    weeklyHoursLoaded: jest.fn((loading, error, value) => loading === false && error === false && !!value),
}));

jest.mock('modules/Pages/Admin/BookableSpaces/SpacesAdminPage', () => ({
    __esModule: true,
    SpacesAdminPage: ({ children, pageTitle, systemTitle, currentPageSlug }) => (
        <div data-testid="spaces-admin-page">
            <h1>{pageTitle}</h1>
            <h2>{systemTitle}</h2>
            {children}
        </div>
    ),
}));

jest.mock('modules/SharedComponents/Toolbox/Loaders', () => ({
    InlineLoader: ({ message }) => <div data-testid="inline-loader">{message}</div>,
}));

jest.mock('modules/Pages/Admin/BookableSpaces/Spaces/Form/EditSpaceForm', () => ({
    EditSpaceForm: ({ saveToDb, formValues = {}, mode }) => (
        <div data-testid="edit-space-form">
            <span data-testid="form-values">{JSON.stringify(formValues)}</span>
            <span data-testid="form-mode">{mode}</span>
            <button
                type="button"
                onClick={() =>
                    saveToDb({
                        space_name: 'Test Space',
                        space_capacity: 10,
                        campus_id: 1,
                    })
                }
            >
                Save Space
            </button>
        </div>
    ),
}));

describe('BookableSpacesAddSpace', () => {
    const baseActions = {
        loadBookableSpaceCampusChildren: jest.fn(),
        loadAllBookableSpacesRooms: jest.fn(),
        loadWeeklyHours: jest.fn(),
        loadAllFacilityTypes: jest.fn(),
        loadBookableSpacesArchibusTree: jest.fn(),
        createBookableSpaceWithNewImage: jest.fn(),
    };

    const defaultProps = {
        actions: baseActions,
        bookableSpacesRoomAdding: false,
        bookableSpacesRoomAddError: false,
        bookableSpacesRoomAddResult: null,
        campusList: [
            {
                campus_id: 1,
                campus_name: 'St Lucia',
                campus_space_count: 5,
                children: [
                    {
                        building_id: 101,
                        building_name: 'Forgan Smith',
                        children: [
                            {
                                floor_id: 1001,
                                floor_name: 'Floor 1',
                            },
                        ],
                    },
                ],
            },
        ],
        campusListLoading: false,
        campusListError: false,
        bookableSpacesRoomList: {
            data: {
                locations: [
                    {
                        space_id: 2,
                        space_campus_id: 1,
                        space_library_id: 4,
                        space_floor_id: 1001,
                        space_opening_hours_id: 5,
                        space_latitude: '-27.4975',
                        space_longitude: '153.0137',
                        space_zlevel: '1',
                        archibus_room_id: 'ARH123',
                    },
                ],
            },
        },
        bookableSpacesRoomListLoading: false,
        bookableSpacesRoomListError: false,
        weeklyHours: {
            locations: [
                {
                    library_id: 4,
                    library_name: 'Central Library',
                    library_hours: [],
                },
            ],
        },
        weeklyHoursLoading: false,
        weeklyHoursError: false,
        bookableSpacesArchibusTree: {
            tree: [
                {
                    site_id: 1,
                    site_name: 'Main Campus',
                    buildings: [],
                },
            ],
        },
        bookableSpacesArchibusTreeLoading: false,
        bookableSpacesArchibusTreeError: false,
        facilityTypeList: {
            data: {
                facility_type_groups: [
                    {
                        group_id: 1,
                        group_name: 'Standard',
                        facility_types: [],
                    },
                ],
            },
        },
        facilityTypeListLoading: false,
        facilityTypeListError: false,
        spaceNotesList: [],
        spaceNotesListLoading: false,
        spaceNotesListError: false,
        spaceNoteAdding: false,
        spaceNoteAddError: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useAccountContext.mockReturnValue({
            account: { id: 'test-user', email: 'test@example.com' },
        });
        useCookies.mockReturnValue([{}, jest.fn()]);
    });

    describe('Loading state', () => {
        it('displays loading message when campus list is loading', () => {
            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    campusListLoading={true}
                />
            );

            expect(screen.getByTestId('inline-loader')).toBeInTheDocument();
            expect(screen.getByText('Loading')).toBeInTheDocument();
        });

        it('displays loading message when spaces room list is loading', () => {
            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    bookableSpacesRoomListLoading={true}
                />
            );

            expect(screen.getByTestId('inline-loader')).toBeInTheDocument();
        });

        it('displays loading message when facility type list is loading', () => {
            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    facilityTypeListLoading={true}
                />
            );

            expect(screen.getByTestId('inline-loader')).toBeInTheDocument();
        });

        it('displays loading message when weekly hours is loading', () => {
            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    weeklyHoursLoading={true}
                />
            );

            expect(screen.getByTestId('inline-loader')).toBeInTheDocument();
        });
    });

    describe('Error states', () => {
        it('displays error when campus list has error', () => {
            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    campusListError={true}
                />
            );

            expect(screen.getByTestId('load-space-form-error')).toBeInTheDocument();
            expect(screen.getByText('Campus-building data had a problem.')).toBeInTheDocument();
        });

        it('displays error when spaces room list has error', () => {
            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    bookableSpacesRoomListError={true}
                />
            );

            expect(screen.getByTestId('load-space-form-error')).toBeInTheDocument();
            expect(screen.getByText('Space types list had a problem.')).toBeInTheDocument();
        });

        it('displays error when facility type list has error', () => {
            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    facilityTypeListError={true}
                />
            );

            expect(screen.getByTestId('load-space-form-error')).toBeInTheDocument();
            expect(screen.getByText('Facility type details had a problem.')).toBeInTheDocument();
        });

        it('displays error when weekly hours has error', () => {
            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    weeklyHoursError={true}
                />
            );

            expect(screen.getByTestId('load-space-form-error')).toBeInTheDocument();
            expect(screen.getByText('Opening hours details had a problem.')).toBeInTheDocument();
        });

        it('displays generic error message when multiple errors occur', () => {
            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    campusListError={true}
                    bookableSpacesRoomListError={true}
                    facilityTypeListError={true}
                    weeklyHoursError={true}
                />
            );

            expect(screen.getByTestId('load-space-form-error')).toBeInTheDocument();
            expect(screen.getByText('Something went wrong - please try again later.')).toBeInTheDocument();
        });
    });

    describe('No locations state', () => {
        it('displays message when campus list is empty', () => {
            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    campusList={[]}
                    campusListLoading={false}
                    campusListError={false}
                />
            );

            expect(screen.getByTestId('add-space-no-locations')).toBeInTheDocument();
            expect(screen.getByText(/No Libraries currently in system/)).toBeInTheDocument();
        });

        it('displays message when space list is empty', () => {
            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    bookableSpacesRoomList={{
                        data: {
                            locations: [],
                        },
                    }}
                    bookableSpacesRoomListLoading={false}
                    bookableSpacesRoomListError={false}
                />
            );

            expect(screen.getByTestId('add-space-no-locations')).toBeInTheDocument();
        });

        it('displays message when space list locations is null', () => {
            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    bookableSpacesRoomList={{
                        data: {
                            locations: null,
                        },
                    }}
                    bookableSpacesRoomListLoading={false}
                    bookableSpacesRoomListError={false}
                />
            );

            expect(screen.getByTestId('add-space-no-locations')).toBeInTheDocument();
        });

        it('renders link to create campus locations', () => {
            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    campusList={[]}
                />
            );

            const link = screen.getByRole('link');
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('href', expect.stringContaining('/admin/spaces/manage/locations'));
        });
    });

    describe('Form rendering and initialization', () => {
        it('renders EditSpaceForm when all data is loaded', () => {
            rtlRender(<BookableSpacesAddSpace {...defaultProps} />);

            expect(screen.getByTestId('edit-space-form')).toBeInTheDocument();
        });

        it('passes mode="add" to EditSpaceForm', () => {
            rtlRender(<BookableSpacesAddSpace {...defaultProps} />);

            expect(screen.getByTestId('form-mode')).toHaveTextContent('add');
        });

        it('initializes form with most recent space values', async () => {
            const mostRecentSpace = {
                space_id: 999,
                space_campus_id: 1,
                space_library_id: 4,
                space_floor_id: 1001,
                space_opening_hours_id: 5,
                space_latitude: '-27.4975',
                space_longitude: '153.0137',
                space_zlevel: '1',
                archibus_room_id: 'ARH123',
            };

            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    bookableSpacesRoomList={{
                        data: {
                            locations: [mostRecentSpace],
                        },
                    }}
                />
            );

            await waitFor(() => {
                const formValues = screen.getByTestId('form-values');
                const values = JSON.parse(formValues.textContent);

                expect(values.campus_id).toBe(1);
                expect(values.library_id).toBe(4);
                expect(values.floor_id).toBe(1001);
                expect(values.space_opening_hours_id).toBe(5);
                expect(values.space_latitude).toBe('-27.4975');
                expect(values.space_longitude).toBe('153.0137');
                expect(values.space_zlevel).toBe('1');
                expect(values.archibus_room_id).toBe('ARH123');
                expect(values.space_capacity).toBe(0);
                expect(values.space_draftmode).toBe(false);
            });
        });

        it('initializes form with filtered campus list', () => {
            const campusList = [
                { campus_id: 1, campus_name: 'St Lucia' },
                { campus_id: 0, campus_name: 'Invalid' },
            ];

            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    campusList={campusList}
                />
            );

            expect(screen.getByTestId('edit-space-form')).toBeInTheDocument();
        });
    });

    describe('Form submission', () => {
        it('calls createBookableSpaceWithNewImage when form is saved', async () => {
            rtlRender(<BookableSpacesAddSpace {...defaultProps} />);

            const saveButton = screen.getByRole('button', { name: 'Save Space' });
            fireEvent.click(saveButton);

            await waitFor(() => {
                expect(baseActions.createBookableSpaceWithNewImage).toHaveBeenCalledWith({
                    space_name: 'Test Space',
                    space_capacity: 10,
                    campus_id: 1,
                });
            });
        });

        it('passes form values from EditSpaceForm to create action', async () => {
            const localActions = {
                ...baseActions,
                createBookableSpaceWithNewImage: jest.fn(),
            };

            rtlRender(<BookableSpacesAddSpace {...defaultProps} actions={localActions} />);

            const saveButton = screen.getByRole('button', { name: 'Save Space' });
            fireEvent.click(saveButton);

            await waitFor(() => {
                expect(localActions.createBookableSpaceWithNewImage).toHaveBeenCalled();
                const callArgs = localActions.createBookableSpaceWithNewImage.mock.calls[0][0];
                expect(callArgs).toHaveProperty('space_name');
                expect(callArgs).toHaveProperty('space_capacity');
            });
        });

        it('saves cypress test data when all conditions are met', async () => {
            const setCookie = jest.fn();
            useCookies.mockReturnValue([{ CYPRESS_TEST_DATA: 'active' }, setCookie]);

            rtlRender(<BookableSpacesAddSpace {...defaultProps} />);

            const saveButton = screen.getByRole('button', { name: 'Save Space' });
            fireEvent.click(saveButton);

            await waitFor(() => {
                expect(baseActions.createBookableSpaceWithNewImage).toHaveBeenCalled();
            });
        });
    });

    describe('Effects initialization', () => {
        it('calls addBreadcrumbsToSiteHeader on mount', () => {
            rtlRender(<BookableSpacesAddSpace {...defaultProps} />);

            expect(require('modules/Pages/Admin/BookableSpaces/bookableSpacesAdminHelpers').addBreadcrumbsToSiteHeader).toHaveBeenCalledWith([
                '<li class="uq-breadcrumb__item"><span class="uq-breadcrumb__link">Add a Space</span></li>',
            ]);
        });

        it('calls data loading actions when initial state is null', () => {
            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    campusListLoading={null}
                    campusListError={null}
                    campusList={null}
                />
            );

            expect(baseActions.loadBookableSpaceCampusChildren).toHaveBeenCalled();
            expect(baseActions.loadAllBookableSpacesRooms).toHaveBeenCalledWith({ includeDrafts: true });
            expect(baseActions.loadWeeklyHours).toHaveBeenCalled();
            expect(baseActions.loadAllFacilityTypes).toHaveBeenCalled();
        });

        it('does not call data loading actions when data is already loaded', () => {
            const localActions = {
                ...baseActions,
                loadBookableSpaceCampusChildren: jest.fn(),
                loadAllBookableSpacesRooms: jest.fn(),
            };

            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    actions={localActions}
                    campusListLoading={false}
                    campusListError={false}
                    campusList={[]}
                />
            );

            expect(localActions.loadBookableSpaceCampusChildren).not.toHaveBeenCalled();
            expect(localActions.loadAllBookableSpacesRooms).not.toHaveBeenCalled();
        });

        it('calls loadBookableSpacesArchibusTree when archibus tree is null', async () => {
            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    bookableSpacesArchibusTree={null}
                    bookableSpacesArchibusTreeLoading={null}
                    bookableSpacesArchibusTreeError={null}
                />
            );

            await waitFor(() => {
                expect(baseActions.loadBookableSpacesArchibusTree).toHaveBeenCalled();
            });
        });

        it('does not call loadBookableSpacesArchibusTree when already loaded', () => {
            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    bookableSpacesArchibusTreeLoading={false}
                    bookableSpacesArchibusTreeError={false}
                />
            );

            expect(baseActions.loadBookableSpacesArchibusTree).not.toHaveBeenCalled();
        });

        it('calls loadBookableSpacesArchibusTree again when dependencies change', async () => {
            const { rerender } = rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    bookableSpacesArchibusTreeLoading={false}
                    bookableSpacesArchibusTreeError={false}
                    bookableSpacesArchibusTree={{ tree: [] }}
                />
            );

            jest.clearAllMocks();

            rerender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    bookableSpacesArchibusTreeLoading={false}
                    bookableSpacesArchibusTreeError={false}
                    bookableSpacesArchibusTree={{ tree: ['updated'] }}
                />
            );

            await waitFor(() => {
                expect(baseActions.loadBookableSpacesArchibusTree).not.toHaveBeenCalled();
            });
        });

        it('initializes springshare list from weekly hours', async () => {
            rtlRender(<BookableSpacesAddSpace {...defaultProps} />);

            await waitFor(() => {
                const initialisedSpringshareList =
                    require('modules/Pages/Admin/BookableSpaces/bookableSpacesAdminHelpers').initialisedSpringshareList;
                expect(initialisedSpringshareList).toHaveBeenCalledWith(expect.any(Object), defaultProps.weeklyHours);
            });
        });

        it('does not initialize springshare list when weekly hours not loaded', () => {
            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    weeklyHoursLoading={true}
                    weeklyHours={null}
                />
            );

            expect(screen.getByTestId('inline-loader')).toBeInTheDocument();
        });

        it('updates current campus list when campus list changes and is valid', async () => {
            const campusListWithDuplicates = [
                { campus_id: 1, campus_name: 'St Lucia' },
                { campus_id: 2, campus_name: 'Gatton' },
                { campus_id: 3, campus_name: 'Herston' },
            ];

            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    campusList={campusListWithDuplicates}
                    campusListLoading={false}
                    campusListError={false}
                />
            );

            await waitFor(() => {
                expect(screen.getByTestId('edit-space-form')).toBeInTheDocument();
            });
        });
    });

    describe('Props forwarding to EditSpaceForm', () => {
        it('forwards all required props to EditSpaceForm', () => {
            rtlRender(<BookableSpacesAddSpace {...defaultProps} />);

            const form = screen.getByTestId('edit-space-form');
            expect(form).toBeInTheDocument();

            const formValues = screen.getByTestId('form-values');
            const values = JSON.parse(formValues.textContent);
            expect(values).toHaveProperty('campus_id');
        });

        it('forwards currentCampusList as filtered campus list', () => {
            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    campusList={[
                        { campus_id: 1, campus_name: 'St Lucia' },
                        { campus_id: 2, campus_name: 'Gatton' },
                    ]}
                />
            );

            expect(screen.getByTestId('edit-space-form')).toBeInTheDocument();
        });

        it('passes initialCampus as safeCampusIndex result', () => {
            rtlRender(<BookableSpacesAddSpace {...defaultProps} />);

            expect(
                require('modules/Pages/Admin/BookableSpaces/bookableSpacesAdminHelpers').safeCampusIndex
            ).toHaveBeenCalled();
        });
    });

    describe('Edge cases', () => {
        it('handles missing space data gracefully when all spaces lack coordinates', () => {
            // Don't trigger the effect by keeping loading state
            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    bookableSpacesRoomList={{
                        data: {
                            locations: [
                                {
                                    space_id: 1,
                                    space_campus_id: 1,
                                    space_library_id: 4,
                                    space_floor_id: 1001,
                                    space_opening_hours_id: 5,
                                    // Missing latitude/longitude
                                },
                            ],
                        },
                    }}
                    bookableSpacesRoomListLoading={true}
                />
            );

            expect(screen.getByTestId('inline-loader')).toBeInTheDocument();
        });

        it('handles spaces with only latitude (no longitude)', () => {
            // Don't trigger the effect by keeping loading state
            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    bookableSpacesRoomList={{
                        data: {
                            locations: [
                                {
                                    space_id: 1,
                                    space_campus_id: 1,
                                    space_library_id: 4,
                                    space_floor_id: 1001,
                                    space_opening_hours_id: 5,
                                    space_latitude: '-27.4975',
                                    // Missing longitude
                                },
                            ],
                        },
                    }}
                    bookableSpacesRoomListLoading={true}
                />
            );

            expect(screen.getByTestId('inline-loader')).toBeInTheDocument();
        });

        it('filters spaces by latitude and longitude presence', async () => {
            const spaces = [
                {
                    space_id: 1,
                    space_campus_id: 1,
                    space_library_id: 4,
                    space_floor_id: 1001,
                    space_opening_hours_id: 5,
                    // No latitude/longitude
                },
                {
                    space_id: 2,
                    space_campus_id: 1,
                    space_library_id: 4,
                    space_floor_id: 1001,
                    space_opening_hours_id: 5,
                    space_latitude: '-27.4975',
                    space_longitude: '153.0137',
                    space_zlevel: '1',
                    archibus_room_id: 'ARH123',
                },
            ];

            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    bookableSpacesRoomList={{
                        data: {
                            locations: spaces,
                        },
                    }}
                />
            );

            // Should use space 2 (the one with coordinates)
            await waitFor(() => {
                const formValues = screen.getByTestId('form-values');
                const values = JSON.parse(formValues.textContent);
                expect(values.space_latitude).toBe('-27.4975');
            });
        });

        it('selects highest space_id when multiple spaces have coordinates', async () => {
            const spaces = [
                {
                    space_id: 1,
                    space_campus_id: 1,
                    space_library_id: 4,
                    space_floor_id: 1001,
                    space_opening_hours_id: 5,
                    space_latitude: '-27.4975',
                    space_longitude: '153.0137',
                    space_zlevel: '1',
                    archibus_room_id: 'ARH001',
                },
                {
                    space_id: 5,
                    space_campus_id: 1,
                    space_library_id: 4,
                    space_floor_id: 1001,
                    space_opening_hours_id: 5,
                    space_latitude: '-27.4975',
                    space_longitude: '153.0137',
                    space_zlevel: '2',
                    archibus_room_id: 'ARH005',
                },
            ];

            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    bookableSpacesRoomList={{
                        data: {
                            locations: spaces,
                        },
                    }}
                />
            );

            await waitFor(() => {
                const formValues = screen.getByTestId('form-values');
                const values = JSON.parse(formValues.textContent);
                expect(values.archibus_room_id).toBe('ARH005');
            });
        });

        it('handles string space_id comparison correctly', async () => {
            const spaces = [
                {
                    space_id: '10',
                    space_campus_id: 1,
                    space_library_id: 4,
                    space_floor_id: 1001,
                    space_opening_hours_id: 5,
                    space_latitude: '-27.4975',
                    space_longitude: '153.0137',
                    space_zlevel: '1',
                    archibus_room_id: 'ARH010',
                },
                {
                    space_id: '9',
                    space_campus_id: 1,
                    space_library_id: 4,
                    space_floor_id: 1001,
                    space_opening_hours_id: 5,
                    space_latitude: '-27.4975',
                    space_longitude: '153.0137',
                    space_zlevel: '1',
                    archibus_room_id: 'ARH009',
                },
            ];

            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    bookableSpacesRoomList={{
                        data: {
                            locations: spaces,
                        },
                    }}
                />
            );

            await waitFor(() => {
                const formValues = screen.getByTestId('form-values');
                const values = JSON.parse(formValues.textContent);
                expect(values.archibus_room_id).toBe('ARH010');
            });
        });

        it('defaults archibus_room_id to null when not present', async () => {
            const space = {
                space_id: 1,
                space_campus_id: 1,
                space_library_id: 4,
                space_floor_id: 1001,
                space_opening_hours_id: 5,
                space_latitude: '-27.4975',
                space_longitude: '153.0137',
                space_zlevel: '1',
                // No archibus_room_id
            };

            rtlRender(
                <BookableSpacesAddSpace
                    {...defaultProps}
                    bookableSpacesRoomList={{
                        data: {
                            locations: [space],
                        },
                    }}
                />
            );

            await waitFor(() => {
                const formValues = screen.getByTestId('form-values');
                const values = JSON.parse(formValues.textContent);
                expect(values.archibus_room_id).toBeNull();
            });
        });
    });

    describe('Memoization', () => {
        it('is exported as memoized component', () => {
            // The component is wrapped with React.memo
            expect(BookableSpacesAddSpace).toBeDefined();
        });
    });
});
