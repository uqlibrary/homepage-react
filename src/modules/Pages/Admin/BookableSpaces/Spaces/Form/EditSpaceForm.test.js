import React from 'react';

import { fireEvent, screen } from '@testing-library/react';

import { AccountContext } from 'context';
import { rtlRender } from 'test-utils';
import { displayToastErrorMessage } from 'modules/Pages/Admin/BookableSpaces/bookableSpacesAdminHelpers';

import { EditSpaceForm } from './EditSpaceForm';

jest.mock('modules/Pages/Admin/BookableSpaces/bookableSpacesAdminHelpers', () => ({
    __esModule: true,
    displayToastErrorMessage: jest.fn(),
    spacesAdminLink: jest.fn(() => '/admin/spaces'),
    validLibraryList: list => list,
}));

jest.mock('modules/Pages/Admin/BookableSpaces/SpacesAdminPage', () => ({
    __esModule: true,
    default: ({ children }) => <div>{children}</div>,
}));

jest.mock('modules/Pages/Admin/BookableSpaces/Spaces/Form/SpaceLocationMap', () => ({
    __esModule: true,
    default: ({ formValues, setFormValues }) => (
        <button
            type="button"
            data-testid="location-map-stub"
            onClick={() =>
                setFormValues({
                    ...formValues,
                    space_latitude: -27.5,
                    space_longitude: 153.0,
                    space_zlevel: 1,
                })
            }
        >
            Map
        </button>
    ),
}));

jest.mock('modules/Pages/Admin/BookableSpaces/Spaces/Form/SpaceOutagePanel', () => ({
    __esModule: true,
    default: () => <div data-testid="space-outage-panel">Outage panel</div>,
}));

jest.mock('modules/SharedComponents/RichTextEditor', () => ({
    RichTextEditor: ({ id, testId, value = '', onChange }) => (
        <textarea id={id} data-testid={testId} value={value} onChange={event => onChange(event.target.value)} />
    ),
}));

jest.mock('modules/Pages/Admin/BookableSpaces/Spaces/Form/ImageUploadDropzone', () => ({
    ImageUploadDropzone: ({ onAddFile, onClearFile }) => (
        <div>
            <input
                type="file"
                data-testid="image-upload-dropzone"
                onChange={event => {
                    const file = event.target.files?.[0];
                    if (file) {
                        onAddFile([{ preview: URL.createObjectURL(file), name: file.name }]);
                    }
                }}
            />
            <button type="button" data-testid="clear-image-button" onClick={onClearFile}>
                Clear file
            </button>
        </div>
    ),
}));

jest.mock('modules/Pages/BookableSpaces/SpacesListPage/MapListPage/components/JourneySpaceDetailsView', () => ({
    __esModule: true,
    default: () => <div data-testid="journey-space-details-view" />,
}));

jest.mock('modules/SharedComponents/Toolbox/ConfirmDialogBox', () => ({
    ConfirmationBox: ({ isOpen, onAction, onCancelAction, onAlternateAction, locale }) =>
        isOpen ? (
            <div data-testid="confirmation-box">
                <button type="button" data-testid="confirmation-action" onClick={onAction}>
                    {locale?.success?.confirmButtonLabel || 'Confirm'}
                </button>
                <button type="button" data-testid="confirmation-cancel" onClick={onCancelAction}>
                    {locale?.success?.cancelButtonLabel || 'Cancel'}
                </button>
                {onAlternateAction && (
                    <button type="button" data-testid="confirmation-alt" onClick={onAlternateAction}>
                        {locale?.error?.alternateActionButtonLabel || 'Close'}
                    </button>
                )}
            </div>
        ) : null,
}));

describe('EditSpaceForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.URL.createObjectURL = jest.fn(() => 'blob:mock-preview');
        window.URL.revokeObjectURL = jest.fn();
    });

    const baseCampusList = [
        {
            campus_id: 1,
            campus_name: 'St Lucia',
            libraries: [
                {
                    library_id: 2,
                    library_name: 'Central Library',
                    building_name: 'Central Library',
                    building_number: '2',
                    ground_floor_id: 3,
                    floors: [
                        { floor_id: 3, floor_name: 'Level 3' },
                        { floor_id: 4, floor_name: 'Level 4' },
                    ],
                },
            ],
        },
    ];

    const validFormValues = {
        campus_id: 1,
        library_id: 2,
        floor_id: 3,
        space_name: 'Test Space',
        space_type_id: 10,
        space_type: 'Study room',
        space_latitude: -27.5,
        space_longitude: 153.0,
        space_zlevel: 1,
        space_capacity: 10,
        space_external_book_url: 'https://example.com/book',
        isBookableCheckbox: true,
        space_opening_hours_id: 7,
        space_services_page: 'https://example.com/about',
        space_photo_url: 'https://example.com/photo.jpg',
        space_photo_description: 'A room photo',
        space_description: '<p>Useful description</p>',
        facility_types: [{ facility_type_id: 22, facility_type_name: 'Bookable' }],
        space_precise: 'Near the entrance',
    };

    const buildProps = overrides => ({
        actions: {
            loadBookableSpaceNotes: jest.fn(),
            clearABookableSpace: jest.fn(),
            loadAllBookableSpacesRooms: jest.fn(() => Promise.resolve()),
            updateSpaceDeletedState: jest.fn(),
            createBookableSpaceNote: jest.fn(() => Promise.resolve()),
            loadBookableSpaceOutages: jest.fn(),
            createBookableSpaceOutage: jest.fn(),
            createBookableBulkOutage: jest.fn(),
            updateBookableSpaceOutage: jest.fn(),
            deleteBookableSpaceOutage: jest.fn(),
        },
        bookableSpacesRoomAdding: false,
        bookableSpacesRoomAddError: null,
        bookableSpacesRoomAddResult: null,
        currentCampusList: baseCampusList,
        initialCampus: 0,
        bookableSpacesArchibusTree: { data: { sites: [] } },
        bookableSpacesArchibusTreeLoading: false,
        bookableSpacesArchibusTreeError: null,
        bookableSpacesRoomList: {
            data: {
                known_space_types: [
                    {
                        space_type_id: 10,
                        space_type_name: 'Study room',
                        space_type_description: 'A small study room.',
                    },
                ],
                locations: [],
            },
        },
        bookableSpacesRoomListLoading: false,
        bookableSpacesRoomListError: false,
        facilityTypeList: {
            data: {
                facility_type_groups: [
                    {
                        facility_type_group_id: 1,
                        facility_type_group_name: 'General',
                        facility_type_children: [
                            { facility_type_id: 22, facility_type_name: 'Bookable' },
                            { facility_type_id: 23, facility_type_name: 'Group study' },
                        ],
                    },
                ],
            },
        },
        facilityTypeListLoading: false,
        facilityTypeListError: false,
        formValues: validFormValues,
        setFormValues: jest.fn(),
        saveToDb: jest.fn(),
        pageTitle: 'Add a new Space',
        currentPageSlug: 'add-space',
        weeklyHours: [],
        weeklyHoursLoading: false,
        weeklyHoursError: false,
        springshareList: [{ id: 7, display_name: 'Library hours' }],
        spaceOutageList: [],
        spaceOutageListLoading: false,
        spaceOutageListError: false,
        spaceNotesList: [],
        spaceNotesListLoading: false,
        spaceNotesListError: false,
        spaceNoteAdding: false,
        spaceNoteAddError: null,
        bookableSpacesRoomUpdating: false,
        bookableSpacesRoomUpdateError: null,
        bookableSpacesRoomUpdateResult: null,
        mode: 'add',
        ...overrides,
    });

    it('validates add-mode form values and saves once the final step is reached', () => {
        const saveToDb = jest.fn();
        rtlRender(
            <AccountContext.Provider value={{ account: { id: 'uqtest1' } }}>
                <EditSpaceForm {...buildProps({ saveToDb })} />
            </AccountContext.Provider>,
        );

        fireEvent.click(screen.getByTestId('spaces-form-next-button'));
        fireEvent.click(screen.getByTestId('spaces-form-next-button'));
        fireEvent.click(screen.getByTestId('spaces-form-next-button'));
        fireEvent.click(screen.getByTestId('admin-spaces-save-button-submit'));

        expect(saveToDb).toHaveBeenCalledWith(
            expect.objectContaining({
                space_name: 'Test Space',
                space_type_id: 10,
                space_external_book_url: 'https://example.com/book',
            }),
        );
    });

    it('shows validation errors and blocks invalid saves', () => {
        const saveToDb = jest.fn();
        rtlRender(
            <AccountContext.Provider value={{ account: { id: 'uqtest1' } }}>
                <EditSpaceForm
                    {...buildProps({
                        saveToDb,
                        formValues: {
                            ...validFormValues,
                            space_name: '',
                            space_type_id: '',
                            space_latitude: '',
                            space_longitude: '',
                            space_external_book_url: '',
                            space_capacity: '',
                            isBookableCheckbox: true,
                        },
                    })}
                />
            </AccountContext.Provider>,
        );

        fireEvent.click(screen.getByTestId('spaces-form-next-button'));
        fireEvent.click(screen.getByTestId('spaces-form-next-button'));
        fireEvent.click(screen.getByTestId('spaces-form-next-button'));
        fireEvent.click(screen.getByTestId('admin-spaces-save-button-submit'));

        expect(displayToastErrorMessage).toHaveBeenCalled();
        expect(saveToDb).not.toHaveBeenCalled();
        expect(screen.getByTestId('spaces-button-error-list')).toBeInTheDocument();
    });

    it('shows validation errors when the form has no previously valid data', () => {
        rtlRender(
            <AccountContext.Provider value={{ account: { id: 'uqtest1' } }}>
                <EditSpaceForm
                    {...buildProps({
                        mode: 'edit',
                        formValues: {
                            campus_id: '',
                            library_id: '',
                            floor_id: '',
                            space_name: '',
                            space_type_id: '',
                            space_latitude: '',
                            space_longitude: '',
                            isBookableCheckbox: false,
                            space_external_book_url: '',
                            space_capacity: '',
                            facility_types: [],
                        },
                    })}
                />
            </AccountContext.Provider>,
        );

        expect(screen.getByTestId('spaces-button-error-list')).toBeInTheDocument();
        expect(screen.getAllByText('A campus is required.').length).toBeGreaterThan(0);
        expect(screen.getAllByText('A library is required.').length).toBeGreaterThan(0);
        expect(screen.getAllByText('A Name is required.').length).toBeGreaterThan(0);
    });

    it('handles facility-type toggles, map updates, preview dialog, and form cleanup in edit mode', () => {
        const setFormValues = jest.fn();
        const clearABookableSpace = jest.fn();
        const loadAllBookableSpacesRooms = jest.fn(() => Promise.resolve());
        const actions = {
            ...buildProps().actions,
            clearABookableSpace,
            loadAllBookableSpacesRooms,
        };

        rtlRender(
            <AccountContext.Provider value={{ account: { id: 'uqtest1' } }}>
                <EditSpaceForm
                    {...buildProps({
                        mode: 'edit',
                        setFormValues,
                        actions,
                        formValues: {
                            ...validFormValues,
                            space_id: 123,
                            space_uuid: 'abc-123',
                            space_draftmode: false,
                            space_highlighted: true,
                            uploadedFile: [],
                        },
                    })}
                />
            </AccountContext.Provider>,
        );

        fireEvent.click(screen.getByTestId('tab-facility-types'));
        fireEvent.click(screen.getByTestId('filtertype-23'));
        expect(setFormValues).toHaveBeenCalled();

        fireEvent.click(screen.getByTestId('tab-location-hours'));
        fireEvent.click(screen.getByTestId('location-map-stub'));
        expect(setFormValues).toHaveBeenCalled();

        fireEvent.click(screen.getByTestId('admin-spaces-preview-button'));
        expect(screen.getByTestId('spaces-preview-dialog')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('spaces-preview-dialog-close-button'));
        expect(screen.getByTestId('spaces-preview-dialog-close-button')).toBeInTheDocument();
    });

    it('covers current and upcoming space outage notices and file upload cleanup', () => {
        const setFormValues = jest.fn();
        const props = buildProps({
            mode: 'edit',
            setFormValues,
            formValues: {
                ...validFormValues,
                space_id: 140,
                space_uuid: 'ff-140',
                space_services_page: 'not-a-valid-url',
                uploadedFile: [{ preview: 'blob:preview' }],
            },
            spaceOutageList: [
                {
                    space_outage_id: 2,
                    space_outage_start: '2099-01-02 09:00:00',
                    space_outage_end: '2099-01-02 17:00:00',
                    space_outage_reason: 'Upcoming',
                },
            ],
        });

        rtlRender(
            <AccountContext.Provider value={{ account: { id: 'uqtest1' } }}>
                <EditSpaceForm {...props} />
            </AccountContext.Provider>,
        );

        expect(screen.getByTestId('space-outage-upcoming-notice')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('tab-imagery'));
        fireEvent.change(screen.getByTestId('image-upload-dropzone'), {
            target: { files: [new File(['x'], 'photo.png', { type: 'image/png' })] },
        });
        expect(setFormValues).toHaveBeenCalled();

        fireEvent.click(screen.getByTestId('clear-image-button'));
        expect(setFormValues).toHaveBeenCalled();
    });

    it('renders empty facility groups and archibus error states in the edit tabs', () => {
        rtlRender(
            <AccountContext.Provider value={{ account: { id: 'uqtest1' } }}>
                <EditSpaceForm
                    {...buildProps({
                        mode: 'edit',
                        facilityTypeList: { data: { facility_type_groups: [] } },
                        bookableSpacesArchibusTreeError: 'Archibus unavailable',
                        formValues: {
                            ...validFormValues,
                            space_id: 888,
                            space_uuid: 'arch-888',
                            campus_id: 1,
                            library_id: 2,
                            floor_id: 3,
                        },
                    })}
                />
            </AccountContext.Provider>,
        );

        fireEvent.click(screen.getByTestId('tab-facility-types'));
        expect(screen.getByText('No filter types in system.')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('tab-about'));
        expect(screen.getByText(/Archibus room data could not be loaded/i)).toBeInTheDocument();
    });

    it('clears the booking URL when the bookable checkbox is turned off', () => {
        const setFormValues = jest.fn();
        rtlRender(
            <AccountContext.Provider value={{ account: { id: 'uqtest1' } }}>
                <EditSpaceForm
                    {...buildProps({
                        setFormValues,
                        formValues: {
                            ...validFormValues,
                            isBookableCheckbox: true,
                            space_external_book_url: 'https://example.com/book',
                        },
                    })}
                />
            </AccountContext.Provider>,
        );

        fireEvent.click(screen.getByTestId('space-can-book'));

        expect(setFormValues).toHaveBeenCalled();
        expect(setFormValues.mock.calls.at(-1)[0]).toMatchObject({
            isBookableCheckbox: false,
            space_external_book_url: false,
        });
    });

    it('shows current outage notices and renders note tables with date fallback and parsed content', () => {
        const loadBookableSpaceNotes = jest.fn();
        const pad = value => String(value).padStart(2, '0');
        const formatLocalDateTime = date =>
            `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        const currentStart = formatLocalDateTime(new Date(Date.now() - 60 * 60 * 1000));
        const currentEnd = formatLocalDateTime(new Date(Date.now() + 60 * 60 * 1000));

        rtlRender(
            <AccountContext.Provider value={{ account: { id: 'uqtest1' } }}>
                <EditSpaceForm
                    {...buildProps({
                        mode: 'edit',
                        actions: {
                            ...buildProps().actions,
                            loadBookableSpaceNotes,
                        },
                        formValues: {
                            ...validFormValues,
                            space_id: 777,
                            space_uuid: 'notes-777',
                            space_deleted: false,
                        },
                        spaceOutageList: [
                            {
                                space_outage_id: 9,
                                space_outage_start: currentStart,
                                space_outage_end: currentEnd,
                                space_outage_reason: 'Current closure',
                            },
                        ],
                        spaceNotesList: [
                            {
                                space_note_id: 12,
                                space_note_created_at: 'not-a-date',
                                space_note_user: 'uqtest1',
                                space_note_note: '<strong>Follow up</strong>',
                            },
                        ],
                    })}
                />
            </AccountContext.Provider>,
        );

        expect(screen.getByTestId('space-outage-current-notice')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('tab-notes'));
        expect(screen.getByTestId('space-notes-table')).toBeInTheDocument();
        expect(screen.getByText('not-a-date')).toBeInTheDocument();
        expect(screen.getByText('Follow up')).toBeInTheDocument();
    });

    it('shows the default library about link and image cleanup path in the imagery panel', () => {
        const setFormValues = jest.fn();
        rtlRender(
            <AccountContext.Provider value={{ account: { id: 'uqtest1' } }}>
                <EditSpaceForm
                    {...buildProps({
                        mode: 'edit',
                        setFormValues,
                        formValues: {
                            ...validFormValues,
                            space_id: 333,
                            space_uuid: 'library-333',
                            uploadedFile: [{ preview: 'blob:preview' }],
                            space_photo_url: '',
                        },
                        currentCampusList: [
                            {
                                campus_id: 1,
                                campus_name: 'St Lucia',
                                libraries: [
                                    {
                                        library_id: 2,
                                        library_name: 'Central Library',
                                        building_name: 'Central Library',
                                        library_about_page_default: 'https://example.com/library-info',
                                        floors: [{ floor_id: 3, floor_name: 'Level 3' }],
                                    },
                                ],
                            },
                        ],
                    })}
                />
            </AccountContext.Provider>,
        );

        fireEvent.click(screen.getByTestId('tab-location-hours'));
        expect(screen.getByTestId('add-space-about-page')).toHaveAttribute('href', 'https://example.com/library-info');

        fireEvent.click(screen.getByTestId('tab-imagery'));
        fireEvent.click(screen.getByTestId('clear-image-button'));
        expect(setFormValues).toHaveBeenCalled();
    });

    it('shows invalid page validation in add mode and blocks the save', () => {
        const saveToDb = jest.fn();
        const StatefulForm = () => {
            const [formState, setFormState] = React.useState({
                ...validFormValues,
                space_services_page: 'https://example.com/about',
            });

            return (
                <AccountContext.Provider value={{ account: { id: 'uqtest1' } }}>
                    <EditSpaceForm
                        {...buildProps({
                            mode: 'add',
                            saveToDb,
                            formValues: formState,
                            setFormValues: setFormState,
                        })}
                    />
                </AccountContext.Provider>
            );
        };

        rtlRender(<StatefulForm />);

        fireEvent.click(screen.getByTestId('spaces-form-next-button'));
        fireEvent.click(screen.getByTestId('spaces-form-next-button'));
        fireEvent.change(document.getElementById('space_services_page'), { target: { value: 'bad-url' } });
        fireEvent.click(screen.getByTestId('spaces-form-next-button'));
        fireEvent.click(screen.getByTestId('admin-spaces-save-button-submit'));

        expect(displayToastErrorMessage).toHaveBeenCalled();
        expect(saveToDb).not.toHaveBeenCalled();
    });

    it('creates a note and shows the restore flow in edit mode', async () => {
        const createBookableSpaceNote = jest.fn(() => Promise.resolve());
        const updateSpaceDeletedState = jest.fn();
        rtlRender(
            <AccountContext.Provider value={{ account: { id: 'uqtest1' } }}>
                <EditSpaceForm
                    {...buildProps({
                        mode: 'edit',
                        formValues: {
                            ...validFormValues,
                            space_id: 321,
                            space_uuid: 'def-456',
                            space_deleted: true,
                        },
                        actions: {
                            ...buildProps().actions,
                            createBookableSpaceNote,
                            updateSpaceDeletedState,
                        },
                    })}
                />
            </AccountContext.Provider>,
        );

        fireEvent.click(screen.getByTestId('tab-notes'));
        fireEvent.change(screen.getByTestId('space-note-rich-text'), { target: { value: '<p>Internal note</p>' } });
        fireEvent.click(screen.getByTestId('admin-spaces-add-note-button'));

        expect(createBookableSpaceNote).toHaveBeenCalledWith(
            321,
            expect.objectContaining({ space_note_note: '<p>Internal note</p>' }),
        );

        fireEvent.click(screen.getByTestId('space-undelete-button'));
        fireEvent.click(screen.getByTestId('spaces-undelete-confirm-button'));
        expect(updateSpaceDeletedState).toHaveBeenCalledWith(321, false);
    });

    it('covers campus and library selection branches and invalid URL feedback', () => {
        const saveToDb = jest.fn();
        const StatefulForm = () => {
            const [formState, setFormState] = React.useState({
                ...validFormValues,
                space_id: 77,
                space_uuid: 'campus-branch',
                library_id: 2,
                campus_id: 1,
                space_services_page: 'https://example.com/about',
            });

            return (
                <AccountContext.Provider value={{ account: { id: 'uqtest1' } }}>
                    <EditSpaceForm
                        {...buildProps({
                            mode: 'add',
                            saveToDb,
                            formValues: formState,
                            setFormValues: setFormState,
                            currentCampusList: [
                                {
                                    campus_id: 1,
                                    campus_name: 'St Lucia',
                                    libraries: [
                                        {
                                            library_id: 2,
                                            library_name: 'Central Library',
                                            building_name: 'Central Library',
                                            ground_floor_id: 3,
                                            floors: [
                                                { floor_id: 3, floor_name: 'Level 3' },
                                                { floor_id: 4, floor_name: 'Level 4' },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        })}
                    />
                </AccountContext.Provider>
            );
        };

        rtlRender(<StatefulForm />);

        fireEvent.change(document.getElementById('add-space-select-campus-input'), {
            target: { value: '1' },
        });
        fireEvent.change(document.getElementById('add-space-select-library-input'), {
            target: { value: '2' },
        });
        fireEvent.change(document.getElementById('add-space-select-floor-input'), {
            target: { value: '4' },
        });

        fireEvent.click(screen.getByTestId('spaces-form-next-button'));
        fireEvent.click(screen.getByTestId('spaces-form-next-button'));
        fireEvent.change(document.getElementById('space_services_page'), {
            target: { value: 'bad-url' },
        });
        fireEvent.click(screen.getByTestId('spaces-form-next-button'));
        fireEvent.click(screen.getByTestId('admin-spaces-save-button-submit'));
        expect(displayToastErrorMessage).toHaveBeenCalled();
        expect(saveToDb).not.toHaveBeenCalled();
    });

    it('renders notes without a saved space and shows the out-of-date notices when appropriate', () => {
        rtlRender(
            <AccountContext.Provider value={{ account: { id: 'uqtest1' } }}>
                <EditSpaceForm
                    {...buildProps({
                        mode: 'edit',
                        formValues: {
                            ...validFormValues,
                            space_id: null,
                            space_uuid: 'ghi-789',
                            space_deleted: false,
                        },
                        spaceOutageList: [
                            {
                                space_outage_id: 1,
                                space_outage_start: '2099-01-01 09:00:00',
                                space_outage_end: '2099-01-01 17:00:00',
                                space_outage_reason: 'Maintenance',
                            },
                        ],
                    })}
                />
            </AccountContext.Provider>,
        );

        fireEvent.click(screen.getByTestId('tab-notes'));
        expect(screen.getByTestId('space-notes-requires-save-message')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('tab-unavailability'));
        expect(screen.getByTestId('space-outage-panel')).toBeInTheDocument();
    });
});
