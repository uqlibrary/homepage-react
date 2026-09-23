import React from 'react';

import { fireEvent, rtlRender, screen, waitFor } from 'test-utils';
import { useCookies } from 'react-cookie';
import { useAccountContext } from 'context';

import { spacesAdminLink } from 'modules/Pages/Admin/BookableSpaces/bookableSpacesAdminHelpers';
import BookableSpacesManageSpaces, {
    getSafeSpaceName,
    getSafeSpaceTypeName,
    getSafeLibraryName,
    getSafeFloorName,
    getSafeSpaceTypeLabel,
    getSortedSpaces,
    showSpaceByPagination,
    isSpaceDeleted,
    getDateEpoch,
    doesSpaceShow,
    getNextSelectedFilters,
    prefilterFacilityData,
    handleOpenEditSpacePage,
    performDeleteSpaceAction,
    hideConfirmationDialog,
    closeDeleteDialog,
    getFilterValue,
    getLibraryFilterDisplayValue,
    getLibraryFilterOptions,
    getFloorFilterDisplayValue,
    getFloorFilterOptions,
    shouldSaveCypressBulkFilterTypeData,
} from './BookableSpacesManageSpaces';

jest.mock('react-cookie', () => ({
    useCookies: jest.fn(),
}));

jest.mock('context', () => ({
    useAccountContext: jest.fn(),
}));

jest.mock('modules/Pages/Admin/BookableSpaces/bookableSpacesAdminHelpers', () => ({
    addBreadcrumbsToSiteHeader: jest.fn(),
    displayToastMessage: jest.fn(),
    spacesAdminLink: jest.fn((path, account) => `/admin/${account?.id ?? 'anon'}${path}`),
}));

jest.mock('modules/Pages/Admin/BookableSpaces/SpacesAdminPage', () => ({
    __esModule: true,
    default: ({ children }) => <div data-testid="spaces-admin-page">{children}</div>,
}));

jest.mock('modules/SharedComponents/Toolbox/Loaders', () => ({
    InlineLoader: ({ message }) => <div data-testid="inline-loader">{message}</div>,
}));

jest.mock('modules/SharedComponents/Toolbox/StandardCard', () => ({
    StandardCard: ({ children, ...props }) => (
        <div data-testid="standard-card" {...props}>
            {children}
        </div>
    ),
}));

jest.mock('modules/SharedComponents/Toolbox/ConfirmDialogBox', () => ({
    ConfirmationBox: ({ isOpen, locale, onAction, onClose }) =>
        isOpen ? (
            <div data-testid="confirmation-box">
                <button type="button" data-testid="confirmation-box-action" onClick={onAction}>
                    {locale?.confirmationTitle}
                </button>
                <button type="button" data-testid="confirmation-box-close" onClick={onClose}>
                    {locale?.confirmButtonLabel || 'OK'}
                </button>
            </div>
        ) : null,
}));

describe('BookableSpacesManageSpaces helper fallbacks', () => {
    it('returns safe values for populated and missing metadata', () => {
        expect(getSafeSpaceName({ space_name: 'Alpha room' })).toBe('Alpha room');
        expect(getSafeSpaceName({})).toBe('');

        expect(getSafeSpaceTypeName({ space_type_details: { space_type_name: 'Meeting room' } })).toBe('Meeting room');
        expect(getSafeSpaceTypeName({})).toBe('');

        expect(getSafeLibraryName({ library_name: 'Central Library' })).toBe('Central Library');
        expect(getSafeLibraryName({})).toBe('Show all libraries');

        expect(getSafeFloorName({ floor_name: 'Level 2' })).toBe('Level 2');
        expect(getSafeFloorName({})).toBe('Show all levels');

        expect(getSafeSpaceTypeLabel({ label: 'Study room' })).toBe('Study room');
        expect(getSafeSpaceTypeLabel({})).toBe('Show all space types');
    });
});

describe('BookableSpacesManageSpaces shared helper logic', () => {
    it('calculates date epochs, pagination visibility, and sort order defaults', () => {
        expect(getDateEpoch(null)).toBe(0);
        expect(getDateEpoch('not-a-date')).toBe(0);
        expect(getDateEpoch('2024-02-04T00:00:00Z')).toBeGreaterThan(0);

        expect(showSpaceByPagination(0, 0, 5)).toBe(true);
        expect(showSpaceByPagination(5, 0, 5)).toBe(false);
        expect(showSpaceByPagination(6, 1, 5)).toBe(true);

        const spaces = [
            { space_name: 'Beta room', created_at: '2024-03-02T00:00:00Z', updated_at: '2024-03-03T00:00:00Z' },
            { space_name: 'Alpha room', created_at: '2024-03-01T00:00:00Z', updated_at: '2024-03-04T00:00:00Z' },
        ];
        expect(getSortedSpaces(undefined).map(space => space.space_name)).toEqual([]);
        expect(getSortedSpaces(spaces).map(space => space.space_name)).toEqual(['Alpha room', 'Beta room']);
        expect(getSortedSpaces(spaces, 'created', 'desc').map(space => space.space_name)).toEqual([
            'Beta room',
            'Alpha room',
        ]);
        expect(getSortedSpaces(spaces, 'updated').map(space => space.space_name)).toEqual(['Beta room', 'Alpha room']);
        expect(getFloorFilterOptions(undefined)).toEqual([]);
    });

    it('applies filter logic for campus, library, floor, space type, draft and deleted states', () => {
        const space = {
            space_id: 10,
            space_name: 'Study nook',
            space_campus_id: 2,
            space_library_id: 22,
            space_floor_id: 3,
            space_type_id: 7,
            space_type_details: { space_type_name: 'Study room' },
            space_draftmode: true,
            space_deleted: false,
        };

        expect(
            doesSpaceShow(space, [
                { filterType: 'campus', filterValue: 2 },
                { filterType: 'library', filterValue: 22 },
                { filterType: 'floor', filterValue: 3 },
                { filterType: 'spaceType', filterValue: '7' },
                { filterType: 'draftOnly', filterValue: true },
                { filterType: 'showDeleted', filterValue: false },
            ]),
        ).toBe(true);

        expect(
            doesSpaceShow(space, [
                { filterType: 'campus', filterValue: 1 },
                { filterType: 'showDeleted', filterValue: false },
            ]),
        ).toBe(false);

        expect(
            doesSpaceShow({ ...space, space_type_id: null, space_type_details: { space_type_name: 'Meeting room' } }, [
                { filterType: 'spaceType', filterValue: 'Meeting room' },
            ]),
        ).toBe(true);

        expect(
            doesSpaceShow({ ...space, space_draftmode: false }, [{ filterType: 'draftOnly', filterValue: true }]),
        ).toBe(false);

        expect(
            doesSpaceShow({ ...space, space_deleted: 'true' }, [{ filterType: 'showDeleted', filterValue: false }]),
        ).toBe(false);
    });

    it('resets selected filter types and orders facility groups consistently', () => {
        const filters = [
            { filterType: 'campus', filterValue: 2 },
            { filterType: 'library', filterValue: 22 },
            { filterType: 'floor', filterValue: 3 },
            { filterType: 'spaceType', filterValue: 'Study room' },
        ];

        expect(getNextSelectedFilters(filters, 'campus', 2)).toEqual([
            { filterType: 'spaceType', filterValue: 'Study room' },
            { filterType: 'campus', filterValue: 2 },
            { filterType: 'library', filterValue: '' },
            { filterType: 'floor', filterValue: '' },
        ]);

        expect(
            prefilterFacilityData({
                facility_type_groups: [
                    {
                        facility_type_group_order: 2,
                        facility_type_group_name: 'Later',
                        facility_type_children: [
                            { facility_type_id: 20, facility_type_name: 'Zoom' },
                            { facility_type_id: 10, facility_type_name: 'Board' },
                        ],
                    },
                    {
                        facility_type_group_order: 1,
                        facility_type_group_name: 'Earlier',
                        facility_type_children: [{ facility_type_id: 30, facility_type_name: 'Audio' }],
                    },
                ],
            }),
        ).toEqual([
            {
                facility_type_group_name: 'Earlier',
                facility_type_group_order: 1,
                facility_type_children: [{ facility_type_id: 30, facility_type_name: 'Audio', overall_order: 1 }],
            },
            {
                facility_type_group_name: 'Later',
                facility_type_group_order: 2,
                facility_type_children: [
                    { facility_type_id: 10, facility_type_name: 'Board', overall_order: 2 },
                    { facility_type_id: 20, facility_type_name: 'Zoom', overall_order: 3 },
                ],
            },
        ]);
    });

    it('handles deleted-space detection and edit/delete helper flows', async () => {
        expect(isSpaceDeleted({ space_deleted: true })).toBe(true);
        expect(isSpaceDeleted({ space_deleted: 1 })).toBe(true);
        expect(isSpaceDeleted({ space_deleted: '1' })).toBe(true);
        expect(isSpaceDeleted({ space_deleted: 'true' })).toBe(true);
        expect(isSpaceDeleted({ space_deleted: false })).toBe(false);

        const hide = jest.fn();
        hideConfirmationDialog(hide);
        expect(hide).toHaveBeenCalledWith(0);

        const setDelete = jest.fn();
        closeDeleteDialog(setDelete);
        expect(setDelete).toHaveBeenCalledWith(null);

        expect(getFilterValue({ target: { checked: true } })).toBe(true);
        expect(getFilterValue({ target: { value: '22' } })).toBe('22');

        expect(
            getLibraryFilterDisplayValue('', { libraries: [{ library_id: 11, library_name: 'Central Library' }] }),
        ).toBe('Show all libraries');
        expect(
            getLibraryFilterDisplayValue('11', { libraries: [{ library_id: 11, library_name: 'Central Library' }] }),
        ).toBe('Central Library');

        expect(getFloorFilterDisplayValue('', [{ floor_id: 2, floor_name: 'Level 2' }])).toBe('Show all levels');
        expect(getFloorFilterDisplayValue('2', [{ floor_id: 2, floor_name: 'Level 2' }])).toBe('Level 2');
        expect(
            getLibraryFilterOptions({
                libraries: [
                    { library_id: 99, library_name: 'B' },
                    { library_id: 11, library_name: 'A' },
                ],
            }),
        ).toEqual([
            { library_id: 11, library_name: 'A' },
            { library_id: 99, library_name: 'B' },
        ]);
        expect(
            getFloorFilterOptions([
                { floor_id: 2, floor_name: 'Level 2' },
                { floor_id: 1, floor_name: 'Level 1' },
            ]),
        ).toEqual([
            { floor_id: 1, floor_name: 'Level 1' },
            { floor_id: 2, floor_name: 'Level 2' },
        ]);

        expect(shouldSaveCypressBulkFilterTypeData('active', 'localhost:2020', 'active')).toBe(true);
        expect(shouldSaveCypressBulkFilterTypeData('active', 'localhost:3000', 'active')).toBe(false);
        expect(shouldSaveCypressBulkFilterTypeData(null, 'localhost:2020', 'active')).toBe(false);

        const actions = {
            updateSpaceDeletedState: jest.fn().mockResolvedValue({}),
            loadAllBookableSpacesRooms: jest.fn(),
        };
        const displayToastMessage = jest.fn();

        await performDeleteSpaceAction({
            deleteCandidate: { spaceId: 101 },
            actions,
            displayToastMessage,
        });

        expect(actions.updateSpaceDeletedState).toHaveBeenCalledWith(101, true);
        expect(actions.loadAllBookableSpacesRooms).toHaveBeenCalledWith({
            includeDrafts: true,
            includeDeleted: true,
            useAdminEndpoint: true,
        });
        expect(displayToastMessage).toHaveBeenCalledWith('Space has been deleted.', true, null);

        const errorActions = {
            updateSpaceDeletedState: jest.fn().mockRejectedValue(new Error('delete failed')),
            loadAllBookableSpacesRooms: jest.fn(),
        };
        await performDeleteSpaceAction({
            deleteCandidate: { spaceId: 404 },
            actions: errorActions,
            displayToastMessage,
        });
        expect(displayToastMessage).toHaveBeenLastCalledWith(
            'Error deleting space. Please try again.',
            false,
            expect.any(Error),
        );

        await performDeleteSpaceAction({
            deleteCandidate: null,
            actions,
            displayToastMessage,
        });
        expect(actions.updateSpaceDeletedState).toHaveBeenCalledTimes(1);

        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        handleOpenEditSpacePage(
            { target: { closest: jest.fn(() => ({ getAttribute: jest.fn(() => null) })) } },
            { id: 42 },
        );
        expect(logSpy).toHaveBeenCalledWith('no valid button clicked');
        logSpy.mockRestore();

        const editEvent = {
            target: {
                closest: jest.fn(() => ({
                    getAttribute: jest.fn(() => 'uuid-77'),
                })),
            },
        };
        handleOpenEditSpacePage(editEvent, { id: 42 });
        expect(spacesAdminLink).toHaveBeenCalledWith('/admin/spaces/edit/uuid-77', { id: 42 });

        const space = {
            space_id: 12,
            space_campus_id: 2,
            space_library_id: 22,
            space_floor_id: 4,
            space_type_id: null,
            space_type_details: { space_type_name: 'Study room' },
            space_deleted: false,
            space_draftmode: false,
        };
        expect(doesSpaceShow(space, [{ filterType: 'campus', filterValue: 9 }])).toBe(false);
        expect(doesSpaceShow(space, [{ filterType: 'library', filterValue: 9 }])).toBe(false);
        expect(doesSpaceShow(space, [{ filterType: 'floor', filterValue: 9 }])).toBe(false);
        expect(doesSpaceShow(space, [{ filterType: 'spaceType', filterValue: 'Meeting room' }])).toBe(false);
        expect(doesSpaceShow(space, [{ filterType: 'showDeleted', filterValue: false }])).toBe(true);
        expect(
            doesSpaceShow({ ...space, space_deleted: 'true' }, [{ filterType: 'showDeleted', filterValue: false }]),
        ).toBe(false);

        expect(getNextSelectedFilters([{ filterType: 'campus', filterValue: 2 }], 'library', 22)).toEqual([
            { filterType: 'campus', filterValue: 2 },
            { filterType: 'library', filterValue: 22 },
            { filterType: 'floor', filterValue: '' },
        ]);
        expect(getNextSelectedFilters([{ filterType: 'campus', filterValue: 2 }], 'campus', 3)).toEqual([
            { filterType: 'campus', filterValue: 3 },
            { filterType: 'library', filterValue: '' },
            { filterType: 'floor', filterValue: '' },
        ]);
    });
});

describe('BookableSpacesManageSpaces', () => {
    const setCookie = jest.fn();

    const buildSpace = overrides => ({
        space_id: 101,
        space_uuid: 'uuid-101',
        space_name: 'Alpha room',
        space_type_id: 9,
        space_type_details: { space_type_name: 'Meeting room' },
        space_campus_id: 1,
        space_library_id: 11,
        space_floor_id: 2,
        space_draftmode: false,
        space_deleted: false,
        space_outages: [],
        facility_types: [{ facility_type_id: 1, facility_type_name: 'Whiteboard' }],
        ...overrides,
    });

    const buildDefaultProps = overrides => ({
        actions: {
            loadAllBookableSpacesRooms: jest.fn(),
            loadWeeklyHours: jest.fn(),
            loadAllFacilityTypes: jest.fn(),
            loadBookableSpaceCampusChildren: jest.fn(),
            saveBulkFilterTypes: jest.fn().mockResolvedValue({ status: 'ok' }),
            updateSpaceDeletedState: jest.fn().mockResolvedValue({}),
            ...overrides?.actions,
        },
        bookableSpacesRoomList: {
            data: {
                locations: [
                    buildSpace({
                        space_id: 101,
                        space_name: 'Alpha room',
                        space_type_id: 9,
                        space_type_details: { space_type_name: 'Meeting room' },
                        facility_types: [{ facility_type_id: 1, facility_type_name: 'Whiteboard' }],
                    }),
                    buildSpace({
                        space_id: 102,
                        space_name: 'Beta room',
                        space_type_id: 4,
                        space_type_details: { space_type_name: 'Study room' },
                        space_campus_id: 2,
                        space_library_id: 22,
                        space_floor_id: 3,
                        space_draftmode: true,
                        facility_types: [{ facility_type_id: 2, facility_type_name: 'Screen' }],
                    }),
                ],
                known_space_types: [
                    { space_type_id: 9, space_type_name: 'Meeting room' },
                    { space_type_id: 4, space_type_name: 'Study room' },
                ],
            },
        },
        bookableSpacesRoomListLoading: false,
        bookableSpacesRoomListError: false,
        weeklyHours: { locations: [] },
        weeklyHoursLoading: false,
        weeklyHoursError: false,
        facilityTypeList: {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_name: 'Room features',
                        facility_type_group_order: 1,
                        facility_type_children: [
                            { facility_type_id: 1, facility_type_name: 'Whiteboard' },
                            { facility_type_id: 2, facility_type_name: 'Screen' },
                        ],
                    },
                ],
            },
        },
        facilityTypeListLoading: false,
        facilityTypeListError: false,
        campusList: [
            {
                campus_id: 1,
                campus_name: 'St Lucia',
                campus_number: '1',
                libraries: [
                    {
                        library_id: 11,
                        library_name: 'Central Library',
                        floors: [{ floor_id: 2, floor_name: 'Level 2' }],
                    },
                ],
            },
            {
                campus_id: 2,
                campus_name: 'Gatton',
                campus_number: '2',
                libraries: [
                    {
                        library_id: 22,
                        library_name: 'Gatton Library',
                        floors: [{ floor_id: 3, floor_name: 'Level 3' }],
                    },
                ],
            },
        ],
        campusListLoading: false,
        campusListError: false,
        ...overrides,
    });

    beforeEach(() => {
        jest.clearAllMocks();
        useCookies.mockReturnValue([{}, setCookie]);
        useAccountContext.mockReturnValue({ account: { id: 42 } });
    });

    it('loads the admin data on mount and renders the table', async () => {
        const actions = {
            loadAllBookableSpacesRooms: jest.fn(),
            loadWeeklyHours: jest.fn(),
            loadAllFacilityTypes: jest.fn(),
            loadBookableSpaceCampusChildren: jest.fn(),
            saveBulkFilterTypes: jest.fn().mockResolvedValue({ status: 'ok' }),
            updateSpaceDeletedState: jest.fn().mockResolvedValue({}),
        };

        rtlRender(
            <BookableSpacesManageSpaces
                {...buildDefaultProps({
                    actions,
                    bookableSpacesRoomList: { data: { locations: [] } },
                    weeklyHours: null,
                    weeklyHoursLoading: null,
                    weeklyHoursError: null,
                    facilityTypeList: null,
                    facilityTypeListLoading: null,
                    facilityTypeListError: null,
                    campusList: null,
                    campusListLoading: null,
                    campusListError: null,
                })}
            />,
        );

        await waitFor(() => {
            expect(actions.loadAllBookableSpacesRooms).toHaveBeenCalledTimes(1);
            expect(actions.loadWeeklyHours).toHaveBeenCalledTimes(1);
            expect(actions.loadAllFacilityTypes).toHaveBeenCalledTimes(1);
        });

        expect(screen.getByText('No spaces currently in system - please try again soon.')).toBeInTheDocument();
    });

    it('shows loading, error, and empty states', () => {
        const { rerender } = rtlRender(
            <BookableSpacesManageSpaces {...buildDefaultProps({ bookableSpacesRoomListLoading: true })} />,
        );

        expect(screen.getByTestId('inline-loader')).toHaveTextContent('Loading');

        rerender(
            <BookableSpacesManageSpaces
                {...buildDefaultProps({ bookableSpacesRoomListError: true, facilityTypeListError: true })}
            />,
        );
        expect(screen.getByText('Something went wrong - please try again later.')).toBeInTheDocument();

        rerender(
            <BookableSpacesManageSpaces
                {...buildDefaultProps({
                    bookableSpacesRoomList: { data: { locations: [] } },
                    bookableSpacesRoomListError: false,
                    facilityTypeListError: false,
                })}
            />,
        );
        expect(screen.getByText('No spaces currently in system - please try again soon.')).toBeInTheDocument();
    });

    it('changes filters, shows deleted and draft flags, and expands row details', async () => {
        rtlRender(<BookableSpacesManageSpaces {...buildDefaultProps()} />);

        await waitFor(() => {
            expect(screen.getByTestId('space-101-name')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('checkbox', { name: /Show drafts only/i }));
        expect(screen.getByRole('checkbox', { name: /Show drafts only/i })).toBeChecked();

        fireEvent.click(screen.getByRole('checkbox', { name: /Show deleted spaces/i }));
        expect(screen.getByRole('checkbox', { name: /Show deleted spaces/i })).toBeChecked();

        fireEvent.click(screen.getByTestId('space-102-expand-button'));
        expect(screen.getByTestId('space-description-102')).toHaveStyle({ display: 'block' });

        fireEvent.click(screen.getByTestId('space-102-collapse-button'));
        expect(screen.getByTestId('space-description-102')).toHaveStyle({ display: 'none' });
    });

    it('sorts rows and changes rows-per-page', async () => {
        rtlRender(<BookableSpacesManageSpaces {...buildDefaultProps()} />);

        await waitFor(() => {
            expect(screen.getByTestId('spaces-sort-button')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('spaces-sort-button'));
        fireEvent.click(screen.getByRole('menuitem', { name: /Sort by creation date/i }));
        expect(screen.getByTestId('spaces-sort-button')).toHaveTextContent('Sort by creation date');

        fireEvent.click(screen.getByTestId('spaces-sort-button'));
        fireEvent.click(screen.getByRole('menuitem', { name: /Sort by name/i }));
        expect(screen.getByTestId('spaces-sort-button')).toHaveTextContent('Sort by name');

        fireEvent.click(screen.getByTestId('spaces-sort-button'));
        fireEvent.click(screen.getByRole('menuitem', { name: /Sort by name/i }));
        expect(screen.getByTestId('spaces-sort-button')).toHaveTextContent('Sort by name');

        const paginatorSelect = document.querySelector('[data-testid="admin-spaces-list-paginator-select"]');
        fireEvent.change(paginatorSelect, { target: { value: '10' } });
        expect(setCookie).toHaveBeenCalledWith('spaces-list-paginator', 10, expect.any(Object));

        fireEvent.change(paginatorSelect, { target: { value: '1' } });
        fireEvent.click(screen.getByRole('button', { name: /next page/i }));

        useCookies.mockReturnValue([{ 'spaces-list-paginator': '10' }, setCookie]);
        rtlRender(<BookableSpacesManageSpaces {...buildDefaultProps()} />);
        await waitFor(() => {
            expect(screen.getByTestId('space-101-name')).toBeInTheDocument();
        });
    });

    it('applies campus, library, level and space type filters and the draft/deleted toggles', async () => {
        rtlRender(<BookableSpacesManageSpaces {...buildDefaultProps()} />);

        await waitFor(() => {
            expect(screen.getByTestId('space-101-name')).toBeInTheDocument();
        });

        fireEvent.mouseDown(document.getElementById('filter-by-campus'));
        fireEvent.click(screen.getByRole('option', { name: 'St Lucia' }));
        fireEvent.mouseDown(document.getElementById('filter-by-library'));
        fireEvent.click(screen.getByRole('option', { name: 'Central Library' }));
        fireEvent.mouseDown(document.getElementById('filter-by-floor'));
        fireEvent.click(screen.getByRole('option', { name: 'Level 2' }));
        fireEvent.mouseDown(document.getElementById('filter-by-space-type'));
        fireEvent.click(screen.getByRole('option', { name: 'Meeting room' }));

        fireEvent.click(screen.getByRole('checkbox', { name: /Show drafts only/i }));
        expect(screen.getByRole('checkbox', { name: /Show drafts only/i })).toBeChecked();

        fireEvent.click(screen.getByRole('checkbox', { name: /Show deleted spaces/i }));
        expect(screen.getByRole('checkbox', { name: /Show deleted spaces/i })).toBeChecked();
    });

    it('expands and collapses rows and the table, and edits a facility column before cancelling', async () => {
        rtlRender(<BookableSpacesManageSpaces {...buildDefaultProps()} />);

        await waitFor(() => {
            expect(screen.getByTestId('space-101-name')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('space-101-expand-button'));
        expect(document.getElementById('space-description-101')).toHaveStyle({ display: 'block' });

        fireEvent.click(screen.getByTestId('space-101-collapse-button'));
        expect(document.getElementById('space-description-101')).toHaveStyle({ display: 'none' });

        fireEvent.click(screen.getByTestId('table-pushout-button'));
        expect(document.getElementById('wrappedTableList')).toHaveClass('expanded');

        fireEvent.click(screen.getByTestId('table-pushin-button'));
        expect(document.getElementById('wrappedTableList')).not.toHaveClass('expanded');

        fireEvent.click(screen.getByTestId('facility-type-column-edit-1'));
        expect(screen.getByTestId('facility-type-column-edit-2')).toBeDisabled();

        const checkbox = document.getElementById('facility-type-column-editing-101-1');
        fireEvent.click(checkbox);

        fireEvent.click(screen.getByTestId('facility-type-column-cancel-1'));
        expect(screen.getByTestId('facility-type-column-edit-1')).toBeInTheDocument();
    });

    it('loads campus data when the initial campus list is still null', async () => {
        const actions = {
            ...buildDefaultProps().actions,
        };

        rtlRender(
            <BookableSpacesManageSpaces
                {...buildDefaultProps({
                    actions,
                    campusList: null,
                    campusListLoading: null,
                    campusListError: null,
                    bookableSpacesRoomList: {
                        data: {
                            locations: [buildSpace({ space_id: 101, space_name: 'Alpha room' })],
                            known_space_types: [{ space_type_id: 9, space_type_name: 'Meeting room' }],
                        },
                    },
                })}
            />,
        );

        await waitFor(() => {
            expect(actions.loadBookableSpaceCampusChildren).toHaveBeenCalledTimes(1);
        });
    });

    it('renders a bookable-space tick and keeps the default no-campus state stable', async () => {
        const actions = {
            ...buildDefaultProps().actions,
        };
        const bookableSpace = buildSpace({
            space_id: 105,
            space_uuid: 'uuid-105',
            space_name: 'Bookable room',
            space_campus_id: 2,
            space_library_id: 22,
            space_floor_id: 3,
            space_external_book_url: 'https://example.com/book',
        });

        rtlRender(
            <BookableSpacesManageSpaces
                {...buildDefaultProps({
                    actions,
                    bookableSpacesRoomList: {
                        data: {
                            locations: [bookableSpace],
                            known_space_types: [{ space_type_id: 9, space_type_name: 'Meeting room' }],
                        },
                    },
                })}
            />,
        );

        await waitFor(() => {
            expect(screen.getByTestId('space-105-name')).toBeInTheDocument();
        });
        expect(screen.getByTestId('tick-105-facilitytype-bookable')).toBeInTheDocument();
        expect(document.getElementById('filter-by-campus')).toBeInTheDocument();
    });

    it('covers edge-case space metadata, sort fallback paths, and draft/deleted filters', async () => {
        const edgeCaseSpaces = [
            buildSpace({
                space_id: 103,
                space_name: 'Gamma room',
                space_type_id: null,
                space_type_details: { space_type_name: 'Meeting room' },
                space_draftmode: true,
                space_deleted: 'true',
                space_campus_id: 1,
                space_library_id: 11,
                space_floor_id: 2,
                created_at: null,
                updated_at: null,
                space_outages: [
                    {
                        space_outage_start: '2026-09-23T10:00:00Z',
                        space_outage_end: '2026-09-24T10:00:00Z',
                    },
                ],
            }),
            buildSpace({
                space_id: 104,
                space_name: 'Delta room',
                space_type_id: null,
                space_type_details: { space_type_name: 'Display wall' },
                space_draftmode: false,
                space_deleted: false,
                created_at: '2024-02-01T00:00:00Z',
                updated_at: '2024-02-03T00:00:00Z',
                space_campus_id: 2,
                space_library_id: 22,
                space_floor_id: 3,
            }),
        ];

        rtlRender(
            <BookableSpacesManageSpaces
                {...buildDefaultProps({
                    bookableSpacesRoomList: {
                        data: {
                            locations: [
                                ...buildDefaultProps().bookableSpacesRoomList.data.locations,
                                ...edgeCaseSpaces,
                            ],
                            known_space_types: [
                                { space_type_id: 9, space_type_name: 'Meeting room' },
                                { space_type_id: 4, space_type_name: 'Study room' },
                            ],
                        },
                    },
                })}
            />,
        );

        await waitFor(() => {
            expect(screen.getByTestId('space-101-name')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('checkbox', { name: /Show drafts only/i }));
        fireEvent.click(screen.getByRole('checkbox', { name: /Show deleted spaces/i }));
        fireEvent.change(document.getElementById('filter-by-space-type-input'), {
            target: { value: 'Meeting room' },
        });

        await waitFor(() => {
            expect(screen.getByTestId('space-103-name')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('spaces-sort-button'));
        fireEvent.click(screen.getByRole('menuitem', { name: /Sort by creation date/i }));
        expect(screen.getByTestId('spaces-sort-button')).toHaveTextContent('Sort by creation date');

        fireEvent.click(screen.getByTestId('spaces-sort-button'));
        fireEvent.click(screen.getByRole('menuitem', { name: /Sort by last changed/i }));
        expect(screen.getByTestId('spaces-sort-button')).toHaveTextContent('Sort by last changed');

        expect(screen.getByTestId('space-103-deleted-chip')).toBeInTheDocument();
        expect(screen.getByTestId('space-103-draftmode-icon')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('space-103-expand-button'));
        expect(document.getElementById('space-description-103')).toHaveStyle({ display: 'block' });
    });

    it('opens the bulk facility edit workflow and saves a change', async () => {
        const actions = {
            ...buildDefaultProps().actions,
            saveBulkFilterTypes: jest.fn().mockResolvedValue({ status: 'ok' }),
        };

        rtlRender(<BookableSpacesManageSpaces {...buildDefaultProps({ actions })} />);

        fireEvent.click(screen.getByTestId('facility-type-column-edit-1'));
        fireEvent.click(screen.getByTestId('facility-type-column-save-1'));

        await waitFor(() => {
            expect(actions.saveBulkFilterTypes).toHaveBeenCalledTimes(1);
        });

        expect(actions.loadAllBookableSpacesRooms).toHaveBeenCalledTimes(2);
    });

    it('shows the bulk save error dialog when the save request fails', async () => {
        const actions = {
            ...buildDefaultProps().actions,
            saveBulkFilterTypes: jest.fn().mockRejectedValue(new Error('bulk save failed')),
        };

        rtlRender(<BookableSpacesManageSpaces {...buildDefaultProps({ actions })} />);

        fireEvent.click(screen.getByTestId('facility-type-column-edit-1'));
        fireEvent.click(screen.getByTestId('facility-type-column-save-1'));

        await waitFor(() => {
            expect(screen.getByTestId('confirmation-box')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('confirmation-box-action'));
        await waitFor(() => {
            expect(screen.queryByTestId('confirmation-box')).not.toBeInTheDocument();
        });
    });

    it('shows the bulk save error dialog when the server returns a non-ok status', async () => {
        const actions = {
            ...buildDefaultProps().actions,
            saveBulkFilterTypes: jest.fn().mockResolvedValue({ status: 'error', message: 'server rejected' }),
        };

        rtlRender(<BookableSpacesManageSpaces {...buildDefaultProps({ actions })} />);

        fireEvent.click(screen.getByTestId('facility-type-column-edit-1'));
        fireEvent.click(screen.getByTestId('facility-type-column-save-1'));

        await waitFor(() => {
            expect(screen.getByTestId('confirmation-box')).toBeInTheDocument();
        });
    });

    it('opens and confirms the delete dialog', async () => {
        const actions = {
            ...buildDefaultProps().actions,
            updateSpaceDeletedState: jest.fn().mockResolvedValue({}),
        };

        rtlRender(<BookableSpacesManageSpaces {...buildDefaultProps({ actions })} />);

        fireEvent.click(screen.getByTestId('delete-space-101-button'));
        expect(screen.getByTestId('spaces-delete-dialog')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('spaces-delete-cancel-button'));
        await waitFor(() => {
            expect(screen.queryByTestId('spaces-delete-dialog')).not.toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('delete-space-101-button'));
        fireEvent.click(screen.getByTestId('spaces-delete-confirm-button'));

        await waitFor(() => {
            expect(actions.updateSpaceDeletedState).toHaveBeenCalledWith(101, true);
        });
    });

    it('saves bulk filter data and renders selected campus library and floor values', async () => {
        const actions = {
            ...buildDefaultProps().actions,
            saveBulkFilterTypes: jest.fn().mockResolvedValue({ status: 'ok' }),
        };
        useCookies.mockReturnValue([{ CYPRESS_TEST_DATA: 'active' }, setCookie]);

        rtlRender(<BookableSpacesManageSpaces {...buildDefaultProps({ actions })} />);

        await waitFor(() => {
            expect(screen.getByTestId('space-101-name')).toBeInTheDocument();
        });

        fireEvent.mouseDown(document.getElementById('filter-by-campus'));
        fireEvent.click(screen.getByRole('option', { name: 'St Lucia' }));

        await waitFor(() => {
            expect(screen.getByText('St Lucia')).toBeInTheDocument();
        });

        fireEvent.mouseDown(document.getElementById('filter-by-library'));
        fireEvent.click(screen.getByRole('option', { name: 'Central Library' }));

        await waitFor(() => {
            expect(screen.getByText('Central Library')).toBeInTheDocument();
        });

        fireEvent.mouseDown(document.getElementById('filter-by-floor'));
        fireEvent.click(screen.getByRole('option', { name: 'Level 2' }));

        await waitFor(() => {
            expect(screen.getByText('Level 2')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('facility-type-column-edit-1'));
        fireEvent.click(screen.getByTestId('facility-type-column-save-1'));

        await waitFor(() => {
            expect(actions.saveBulkFilterTypes).toHaveBeenCalledTimes(1);
            expect(setCookie).not.toHaveBeenCalledWith('CYPRESS_DATA_SAVED', expect.any(Array));
        });
    });

    it('shows the delete error path when the delete request fails', async () => {
        const actions = {
            ...buildDefaultProps().actions,
            updateSpaceDeletedState: jest.fn().mockRejectedValue(new Error('delete failed')),
        };

        rtlRender(<BookableSpacesManageSpaces {...buildDefaultProps({ actions })} />);

        fireEvent.click(screen.getByTestId('delete-space-101-button'));
        fireEvent.click(screen.getByTestId('spaces-delete-confirm-button'));

        await waitFor(() => {
            expect(actions.updateSpaceDeletedState).toHaveBeenCalledWith(101, true);
        });
    });

    it('opens the edit page with the selected space uuid', async () => {
        rtlRender(<BookableSpacesManageSpaces {...buildDefaultProps()} />);

        await waitFor(() => {
            expect(screen.getByTestId('edit-space-101-button')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('edit-space-101-button'));

        expect(spacesAdminLink).toHaveBeenCalledWith('/admin/spaces/edit/uuid-101', { id: 42 });
    });
});
