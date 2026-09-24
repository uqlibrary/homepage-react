import React from 'react';

import { fireEvent, rtlRender, screen, waitFor } from 'test-utils';
import { useCookies } from 'react-cookie';
import { useAccountContext } from 'context';
import { useParams } from 'react-router';

import BookableSpacesEditSpace, {
    buildEditSpaceFormValues,
    persistCypressSavedData,
    shouldPersistCypressSavedData,
} from './BookableSpacesEditSpace';

jest.mock('react-cookie', () => ({
    useCookies: jest.fn(),
}));

jest.mock('context', () => ({
    useAccountContext: jest.fn(),
}));

jest.mock('react-router', () => ({
    useParams: jest.fn(),
}));

jest.mock('modules/Pages/Admin/BookableSpaces/bookableSpacesAdminHelpers', () => ({
    addBreadcrumbsToSiteHeader: jest.fn(),
    initialisedSpringshareList: jest.fn(() => ({ libraries: [] })),
    safeCampusIndex: jest.fn(() => 0),
    spacesAdminLink: jest.fn((path, account) => `${account?.id ?? 'anon'}${path}`),
    validCampusList: jest.fn(list => list),
    weeklyHoursLoaded: jest.fn((loading, error, value) => loading === false && error === false && !!value),
}));

jest.mock('modules/Pages/Admin/BookableSpaces/SpacesAdminPage', () => ({
    __esModule: true,
    SpacesAdminPage: ({ children }) => <div data-testid="spaces-admin-page">{children}</div>,
}));

jest.mock('modules/SharedComponents/Toolbox/Loaders', () => ({
    InlineLoader: ({ message }) => <div data-testid="inline-loader">{message}</div>,
}));

jest.mock('modules/Pages/Admin/BookableSpaces/Spaces/Form/EditSpaceForm', () => ({
    EditSpaceForm: ({ saveToDb, formValues = {} }) => (
        <div data-testid="edit-space-form">
            <span data-testid="form-values">{JSON.stringify(formValues)}</span>
            <button type="button" onClick={() => saveToDb({ uploadedFile: 'uploaded-file', foo: 'upload' })}>
                Save with upload
            </button>
            <button type="button" onClick={() => saveToDb({ foo: 'existing' })}>
                Save without upload
            </button>
        </div>
    ),
}));

describe('BookableSpacesEditSpace', () => {
    const baseActions = {
        loadBookableSpaceCampusChildren: jest.fn(),
        loadAllBookableSpacesRooms: jest.fn(),
        loadWeeklyHours: jest.fn(),
        loadAllFacilityTypes: jest.fn(),
        loadBookableSpacesArchibusTree: jest.fn(),
        loadABookableSpacesRoom: jest.fn(),
        loadBookableSpaceOutages: jest.fn(),
        updateBookableSpaceWithNewImage: jest.fn(),
        updateBookableSpaceWithExistingImage: jest.fn(),
    };

    const defaultProps = {
        actions: baseActions,
        bookableSpacesRoomUpdating: false,
        bookableSpacesRoomUpdateError: false,
        bookableSpacesRoomUpdateResult: null,
        campusList: [{ campus_id: 1, campus_name: 'St Lucia', campus_space_count: 5 }],
        campusListLoading: false,
        campusListError: false,
        bookableSpacesRoomList: { data: { locations: [{ space_id: 2, space_campus_id: 1, space_library_id: 4 }] } },
        bookableSpacesRoomListLoading: false,
        bookableSpacesRoomListError: false,
        weeklyHours: { locations: [] },
        weeklyHoursLoading: false,
        weeklyHoursError: false,
        bookableSpacesArchibusTree: { tree: [] },
        bookableSpacesArchibusTreeLoading: false,
        bookableSpacesArchibusTreeError: false,
        facilityTypeList: { data: { facility_type_groups: [] } },
        facilityTypeListLoading: false,
        facilityTypeListError: false,
        bookableSpaceGetting: false,
        bookableSpaceGetError: false,
        bookableSpaceGetResult: {
            data: {
                space_id: 42,
                space_name: 'Quiet Room',
                space_building_name: 'Forgan Smith',
                space_building_number: '10',
                space_library_name: 'Central Library',
                space_library_id: 7,
                space_floor_name: 'Level 3',
                space_floor_id: 9,
                space_campus_name: 'St Lucia',
                space_campus_id: 1,
                space_description: 'A quiet room',
                space_capacity: 4,
                space_highlighted: true,
                space_draftmode: false,
                space_external_book_url: 'https://example.com/book',
                facility_types: [{ facility_type_name: 'Power points' }],
                space_is_ground_floor: false,
                space_latitude: -27.4,
                space_longitude: 152.9,
                space_zlevel: 3,
                space_opening_hours_id: 11,
                space_photo_description: 'Photo',
                space_photo_url: 'https://example.com/photo.jpg',
                space_precise: true,
                space_services_page: '/services',
                archibus_room_id: 100,
                space_type_details: { space_type_name: 'Study room' },
                space_type_id: 3,
                space_uuid: 'space-123',
                space_deleted: false,
                space_deleted_at: null,
            },
        },
        spaceOutageList: [],
        spaceOutageListLoading: false,
        spaceOutageListError: false,
        spaceNotesList: [],
        spaceNotesListLoading: false,
        spaceNotesListError: false,
        spaceNoteAdding: false,
        spaceNoteAddError: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useCookies.mockReturnValue([{}, jest.fn()]);
        useAccountContext.mockReturnValue({ account: { id: 'admin-user' } });
        useParams.mockReturnValue({ spaceUuid: 'space-123' });
        window.history.replaceState({}, '', '/admin/spaces/edit/space-123');
    });

    it('builds edit form values from a space payload and leaves empty payloads safe', () => {
        expect(buildEditSpaceFormValues(defaultProps.bookableSpaceGetResult.data)).toMatchObject({
            space_name: 'Quiet Room',
            campus_id: 1,
            facility_types: [{ facility_type_name: 'Power points' }],
            space_uuid: 'space-123',
        });
        expect(buildEditSpaceFormValues(null)).toEqual({});
    });

    it('loads the required data dependencies and shows the loader while the space is still loading', () => {
        const props = {
            ...defaultProps,
            campusListLoading: null,
            campusListError: null,
            campusList: null,
            bookableSpacesArchibusTreeLoading: null,
            bookableSpacesArchibusTreeError: null,
            bookableSpacesArchibusTree: null,
            bookableSpaceGetting: true,
        };

        rtlRender(<BookableSpacesEditSpace {...props} />);

        expect(baseActions.loadBookableSpaceCampusChildren).toHaveBeenCalledTimes(1);
        expect(baseActions.loadAllBookableSpacesRooms).toHaveBeenCalledWith({ includeDrafts: true });
        expect(baseActions.loadWeeklyHours).toHaveBeenCalledTimes(1);
        expect(baseActions.loadAllFacilityTypes).toHaveBeenCalledTimes(1);
        expect(baseActions.loadBookableSpacesArchibusTree).toHaveBeenCalledTimes(1);
        expect(baseActions.loadABookableSpacesRoom).toHaveBeenCalledWith('space-123', { useAdminEndpoint: true });
        expect(screen.getByTestId('inline-loader')).toHaveTextContent('Loading');
    });

    it('shows the missing record message when the lookup returns an empty object', () => {
        rtlRender(
            <BookableSpacesEditSpace
                {...defaultProps}
                bookableSpaceGetting={false}
                bookableSpaceGetError={false}
                bookableSpaceGetResult={{ data: {} }}
            />,
        );

        expect(screen.getByTestId('missing-record')).toHaveTextContent('There is no Space with ID "space-123"');
    });

    it('shows the error state when data loading fails', () => {
        rtlRender(
            <BookableSpacesEditSpace
                {...defaultProps}
                campusListError
                bookableSpaceGetError
                bookableSpaceGetResult={{ data: { space_id: 42 } }}
            />,
        );

        expect(screen.getByTestId('load-space-form-error')).toHaveTextContent(
            'Something went wrong - please try again later.',
        );
        expect(screen.getByText('Campus-building data had a problem.')).toBeInTheDocument();
        expect(screen.getByText('Space details had a problem.')).toBeInTheDocument();
    });

    it('shows the no-locations state when campus data is empty', () => {
        rtlRender(
            <BookableSpacesEditSpace
                {...defaultProps}
                currentCampusList={[]}
                campusList={[]}
                bookableSpaceGetResult={{ data: { space_id: 42, space_uuid: 'space-123' } }}
            />,
        );

        expect(screen.getByTestId('add-space-no-locations')).toHaveTextContent('No Libraries currently in system');
    });

    it('tracks the cypress save helper for active localhost test runs', () => {
        const setCookie = jest.fn();

        expect(shouldPersistCypressSavedData()).toBe(false);
        expect(shouldPersistCypressSavedData({ CYPRESS_TEST_DATA: 'active' }, 'localhost:2020')).toBe(true);
        expect(shouldPersistCypressSavedData({ CYPRESS_TEST_DATA: 'active' }, 'example.com')).toBe(false);
        expect(shouldPersistCypressSavedData({ CYPRESS_TEST_DATA: 'inactive' }, 'localhost:2020')).toBe(false);

        persistCypressSavedData({
            cookies: { CYPRESS_TEST_DATA: 'active' },
            host: 'localhost:2020',
            setCookie,
            valuesToSend: { uploadedFile: 'uploaded-file', foo: 'upload' },
        });
        expect(setCookie).toHaveBeenCalledWith('CYPRESS_DATA_SAVED', { uploadedFile: 'uploaded-file', foo: 'upload' });

        persistCypressSavedData({
            cookies: { CYPRESS_TEST_DATA: 'inactive' },
            host: 'localhost:2020',
            setCookie,
            valuesToSend: { foo: 'ignored' },
        });
        expect(setCookie).toHaveBeenCalledTimes(1);
    });

    it('shows each remaining data-error message without changing the render flow', async () => {
        rtlRender(
            <BookableSpacesEditSpace
                {...defaultProps}
                bookableSpacesRoomListError
                facilityTypeListError
                weeklyHoursError
                bookableSpaceGetResult={{ data: { space_id: 42, space_uuid: 'space-123' } }}
            />,
        );

        await waitFor(() => {
            expect(screen.getByText('Space types list had a problem.')).toBeInTheDocument();
            expect(screen.getByText('Facility type details had a problem.')).toBeInTheDocument();
            expect(screen.getByText('Opening hours details had a problem.')).toBeInTheDocument();
        });
    });

    it('skips the room load when there is no space uuid route param', () => {
        useParams.mockReturnValue({});

        rtlRender(<BookableSpacesEditSpace {...defaultProps} />);

        expect(baseActions.loadABookableSpacesRoom).not.toHaveBeenCalled();
    });

    it('normalises missing values in the edit form payload', () => {
        expect(
            buildEditSpaceFormValues({
                space_capacity: 0,
                space_opening_hours_id: 0,
                archibus_room_id: 0,
                space_deleted: false,
            }),
        ).toMatchObject({
            space_capacity: 0,
            space_opening_hours_id: -1,
            archibus_room_id: null,
            space_deleted: false,
        });
    });

    it('renders the edit form and calls the correct update action for upload and non-upload saves', async () => {
        rtlRender(<BookableSpacesEditSpace {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByTestId('edit-space-form')).toBeInTheDocument();
        });

        expect(baseActions.loadBookableSpaceOutages).toHaveBeenCalledWith(42);

        fireEvent.click(screen.getByRole('button', { name: /save with upload/i }));
        expect(baseActions.updateBookableSpaceWithNewImage).toHaveBeenCalledWith({
            uploadedFile: 'uploaded-file',
            foo: 'upload',
        });

        fireEvent.click(screen.getByRole('button', { name: /save without upload/i }));
        expect(baseActions.updateBookableSpaceWithExistingImage).toHaveBeenCalledWith({ foo: 'existing' }, 'update');
    });
});
