import React from 'react';

import { fireEvent, rtlRender, screen, waitFor } from 'test-utils';
import { useCookies } from 'react-cookie';

import { displayToastErrorMessage, displayToastMessage } from 'modules/Pages/Admin/BookableSpaces/bookableSpacesAdminHelpers';
import BookableSpacesManageSpaceTypes, {
    getBookableSpaceTypeRows,
    getKnownSpaceTypes,
    getNormalizedDisplayValue,
    getRowsPerPage,
    getSpaceRowsByPagination,
    showSpaceByPagination,
} from './BookableSpacesManageSpaceTypes';

jest.mock('react-cookie', () => ({
    useCookies: jest.fn(),
}));

jest.mock('modules/Pages/Admin/BookableSpaces/bookableSpacesAdminHelpers', () => ({
    addBreadcrumbsToSiteHeader: jest.fn(),
    displayToastMessage: jest.fn(),
    displayToastErrorMessage: jest.fn(),
}));

jest.mock('modules/Pages/Admin/BookableSpaces/SpacesAdminPage', () => ({
    __esModule: true,
    default: ({ children }) => <div data-testid="spaces-admin-page">{children}</div>,
}));

jest.mock('modules/SharedComponents/Toolbox/Loaders', () => ({
    InlineLoader: ({ message }) => <div data-testid="inline-loader">{message}</div>,
}));

jest.mock('modules/SharedComponents/Toolbox/StandardCard', () => ({
    StandardCard: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

describe('BookableSpacesManageSpaceTypes', () => {
    const getInput = testId => {
        const field = screen.getByTestId(testId);
        return field.querySelector('input, textarea');
    };

    const buildDefaultProps = overrides => ({
        actions: {
            loadAllBookableSpacesRooms: jest.fn(),
            loadWeeklyHours: jest.fn(),
            loadAllFacilityTypes: jest.fn(),
            loadBookableSpaceCampusChildren: jest.fn(),
            updateBookableSpaceType: jest.fn().mockResolvedValue({}),
            deleteBookableSpaceType: jest.fn().mockResolvedValue({}),
            createBookableSpaceType: jest.fn().mockResolvedValue({}),
            ...overrides?.actions,
        },
        bookableSpacesRoomList: {
            data: {
                locations: [{ space_id: 1 }],
                known_space_types: [
                    {
                        space_type_id: 1,
                        space_type_name: 'Quiet room',
                        space_type_description: 'Study room',
                        spaces_count: 0,
                    },
                    {
                        space_type_id: 2,
                        space_type_name: 'Meeting room',
                        space_type_description: 'Group room',
                        spaces_count: 2,
                    },
                ],
            },
        },
        bookableSpacesRoomListLoading: false,
        bookableSpacesRoomListError: false,
        weeklyHours: { locations: [] },
        weeklyHoursLoading: false,
        weeklyHoursError: false,
        facilityTypeList: { data: { facility_type_groups: [] } },
        facilityTypeListLoading: false,
        facilityTypeListError: false,
        campusList: null,
        campusListLoading: null,
        campusListError: null,
        ...overrides,
    });

    beforeEach(() => {
        jest.clearAllMocks();
        useCookies.mockReturnValue([{ 'spaces-list-paginator': '10' }, jest.fn()]);

        if (!HTMLDialogElement.prototype.showModal) {
            HTMLDialogElement.prototype.showModal = function showModal() {
                this.setAttribute('open', 'open');
            };
        }
        if (!HTMLDialogElement.prototype.close) {
            HTMLDialogElement.prototype.close = function close() {
                this.removeAttribute('open');
            };
        }
    });

    const renderComponent = props => rtlRender(<BookableSpacesManageSpaceTypes {...buildDefaultProps(props)} />);

    it('loads the needed admin data on mount', () => {
        const actions = {
            loadAllBookableSpacesRooms: jest.fn(),
            loadWeeklyHours: jest.fn(),
            loadAllFacilityTypes: jest.fn(),
            loadBookableSpaceCampusChildren: jest.fn(),
        };

        renderComponent({
            actions,
            bookableSpacesRoomList: null,
            weeklyHours: null,
            facilityTypeList: null,
            bookableSpacesRoomListLoading: null,
            weeklyHoursLoading: null,
            facilityTypeListLoading: null,
            bookableSpacesRoomListError: null,
            weeklyHoursError: null,
            facilityTypeListError: null,
            campusList: null,
            campusListLoading: null,
            campusListError: null,
        });

        expect(actions.loadAllBookableSpacesRooms).toHaveBeenCalledTimes(1);
        expect(actions.loadWeeklyHours).toHaveBeenCalledTimes(1);
        expect(actions.loadAllFacilityTypes).toHaveBeenCalledTimes(1);
    });

    it('uses the default rows-per-page when the paginator cookie is missing', () => {
        useCookies.mockReturnValue([{}, jest.fn()]);

        renderComponent();

        expect(screen.getByTestId('space-types-table')).toBeInTheDocument();
    });

    it('normalizes missing values and cookie defaults for the guard branches', () => {
        expect(getRowsPerPage(undefined)).toBe(5);
        expect(getRowsPerPage({})).toBe(5);
        expect(getRowsPerPage({ 'spaces-list-paginator': '7' })).toBe(7);
        expect(getNormalizedDisplayValue('   ', 'Fallback value')).toBe('Fallback value');
        expect(getNormalizedDisplayValue('  Value  ', 'Fallback value')).toBe('Value');
        expect(getNormalizedDisplayValue(null, 'Fallback value')).toBe('Fallback value');
        expect(getKnownSpaceTypes(undefined)).toEqual([]);
        expect(getKnownSpaceTypes({ data: {} })).toEqual([]);
        expect(getSpaceRowsByPagination(undefined, 0, 5)).toEqual([]);
        expect(getSpaceRowsByPagination({ data: { locations: [{ space_id: 1 }, { space_id: 2 }, { space_id: 3 }] } }, 0, 2)).toEqual([
            { spaceId: 1, showSpace: true },
            { spaceId: 2, showSpace: true },
            { spaceId: 3, showSpace: false },
        ]);
        expect(showSpaceByPagination(0, 0, 5)).toBe(true);
        expect(showSpaceByPagination(10, 1, 5)).toBe(false);
        expect(getBookableSpaceTypeRows({
            data: {
                known_space_types: [{ space_type_id: 9, space_type_name: 'No count', space_type_description: 'Missing count' }],
            },
        })).toEqual([
            {
                spaceTypeId: 9,
                spaceTypeName: 'No count',
                spaceTypeDescription: 'Missing count',
                spacesCount: 0,
            },
        ]);
    });

    it('shows the loading state while admin data is still loading', () => {
        renderComponent({
            bookableSpacesRoomListLoading: true,
            weeklyHoursLoading: false,
            facilityTypeListLoading: false,
        });

        expect(screen.getByTestId('space-types-loading')).toBeInTheDocument();
        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('shows the generic error state when data loading fails', () => {
        renderComponent({
            bookableSpacesRoomListError: true,
            facilityTypeListError: true,
            bookableSpacesRoomListLoading: false,
            facilityTypeListLoading: false,
        });

        expect(screen.getByTestId('space-types-error')).toBeInTheDocument();
        expect(screen.getByText('Something went wrong - please try again later.')).toBeInTheDocument();
    });

    it('shows the no spaces state when the system has no rooms', () => {
        renderComponent({
            bookableSpacesRoomList: { data: { locations: [] } },
        });

        expect(screen.getByTestId('space-types-no-spaces')).toBeInTheDocument();
        expect(screen.getByText('No spaces currently in system - please try again soon.')).toBeInTheDocument();
    });

    it('skips the room-location map when the location list is absent and still allows valid rows to render when present', () => {
        const actions = {
            loadBookableSpaceCampusChildren: jest.fn(),
            loadAllBookableSpacesRooms: jest.fn(),
            loadWeeklyHours: jest.fn(),
            loadAllFacilityTypes: jest.fn(),
            updateBookableSpaceType: jest.fn(),
            deleteBookableSpaceType: jest.fn(),
            createBookableSpaceType: jest.fn(),
        };

        const { rerender } = renderComponent({
            actions,
            campusList: [{ campus_id: 1, campus_name: 'Campus 1' }],
            campusListLoading: false,
            campusListError: false,
            bookableSpacesRoomList: { data: {} },
        });

        expect(actions.loadBookableSpaceCampusChildren).not.toHaveBeenCalled();

        rerender(
            <BookableSpacesManageSpaceTypes
                {...buildDefaultProps({
                    actions,
                    campusList: [{ campus_id: 1, campus_name: 'Campus 1' }],
                    campusListLoading: false,
                    campusListError: false,
                    bookableSpacesRoomList: {
                        data: {
                            locations: [{ space_id: 1 }],
                            known_space_types: [
                                {
                                    space_type_id: '',
                                    space_type_name: 'Blank id',
                                    space_type_description: 'No id here',
                                    spaces_count: 0,
                                },
                                {
                                    space_type_name: 'Missing id',
                                    space_type_description: 'No id here',
                                    spaces_count: 0,
                                },
                                {
                                    space_type_id: 2,
                                    space_type_name: 'Meeting room',
                                    space_type_description: 'Group room',
                                    spaces_count: 2,
                                },
                            ],
                        },
                    },
                })}
            />,
        );

        expect(screen.getByTestId('space-type-row-2-name')).toHaveTextContent('Meeting room');
        expect(screen.queryByText('Blank id')).not.toBeInTheDocument();
        expect(screen.queryByText('Missing id')).not.toBeInTheDocument();
    });

    it('loads campus children when the room list is ready and the campus list is still unset', () => {
        const actions = {
            loadBookableSpaceCampusChildren: jest.fn(),
            loadAllBookableSpacesRooms: jest.fn(),
            loadWeeklyHours: jest.fn(),
            loadAllFacilityTypes: jest.fn(),
            updateBookableSpaceType: jest.fn(),
            deleteBookableSpaceType: jest.fn(),
            createBookableSpaceType: jest.fn(),
        };

        renderComponent({
            actions,
            campusList: null,
            campusListLoading: null,
            campusListError: null,
            bookableSpacesRoomList: {
                data: {
                    locations: [{ space_id: 1 }],
                    known_space_types: [{ space_type_id: 5, space_type_name: 'Campus room', spaces_count: 1 }],
                },
            },
            bookableSpacesRoomListLoading: false,
            bookableSpacesRoomListError: false,
        });

        expect(actions.loadBookableSpaceCampusChildren).toHaveBeenCalledTimes(1);
    });

    it('skips campus loading once campus data has already been loaded', () => {
        const actions = {
            loadBookableSpaceCampusChildren: jest.fn(),
            loadAllBookableSpacesRooms: jest.fn(),
            loadWeeklyHours: jest.fn(),
            loadAllFacilityTypes: jest.fn(),
            updateBookableSpaceType: jest.fn(),
            deleteBookableSpaceType: jest.fn(),
            createBookableSpaceType: jest.fn(),
        };

        renderComponent({
            actions,
            campusList: [{ campus_id: 1, campus_name: 'Campus 1' }],
            campusListLoading: false,
            campusListError: false,
        });

        expect(actions.loadBookableSpaceCampusChildren).not.toHaveBeenCalled();
    });

    it('renders the list of known space types and supports inline edits', async () => {
        const actions = {
            updateBookableSpaceType: jest.fn().mockResolvedValue({}),
            loadBookableSpaceCampusChildren: jest.fn(),
            loadAllBookableSpacesRooms: jest.fn(),
            loadWeeklyHours: jest.fn(),
            loadAllFacilityTypes: jest.fn(),
        };

        renderComponent({
            actions,
            campusList: null,
            campusListLoading: null,
            campusListError: null,
        });

        expect(screen.getByTestId('space-types-table')).toBeInTheDocument();
        expect(screen.getByTestId('space-type-row-1-name')).toHaveTextContent('Quiet room');
        expect(screen.getByTestId('space-type-row-2-count')).toHaveTextContent('2');

        fireEvent.click(screen.getByTestId('space-type-row-1-edit-button'));

        const nameInput = getInput('space-type-row-1-name-input');
        const descriptionInput = getInput('space-type-row-1-description-input');

        fireEvent.change(nameInput, { target: { value: '  Quiet room updated  ' } });
        fireEvent.change(descriptionInput, { target: { value: '  Updated desc  ' } });
        fireEvent.click(screen.getByTestId('space-type-row-1-save-button'));

        await waitFor(() => {
            expect(actions.updateBookableSpaceType).toHaveBeenCalledWith(
                {
                    space_type_name: 'Quiet room updated',
                    space_type_description: 'Updated desc',
                },
                '1',
            );
        });

        expect(displayToastMessage).toHaveBeenCalledWith('Space type updated');
    });

    it('cancels an inline edit without saving changes', () => {
        renderComponent();

        fireEvent.click(screen.getByTestId('space-type-row-1-edit-button'));
        fireEvent.change(getInput('space-type-row-1-name-input'), { target: { value: 'Changed name' } });
        fireEvent.click(screen.getByTestId('space-type-row-1-cancel-button'));

        expect(screen.getByTestId('space-type-row-1-name')).toHaveTextContent('Quiet room');
        expect(screen.queryByTestId('space-type-row-1-name-input')).not.toBeInTheDocument();
    });

    it('uses default display values when inline-edit fields are blank', async () => {
        const actions = {
            updateBookableSpaceType: jest.fn().mockResolvedValue({}),
            loadBookableSpaceCampusChildren: jest.fn(),
            loadAllBookableSpacesRooms: jest.fn(),
            loadWeeklyHours: jest.fn(),
            loadAllFacilityTypes: jest.fn(),
            deleteBookableSpaceType: jest.fn(),
            createBookableSpaceType: jest.fn(),
        };

        renderComponent({ actions });

        fireEvent.click(screen.getByTestId('space-type-row-1-edit-button'));
        fireEvent.change(getInput('space-type-row-1-name-input'), { target: { value: '   ' } });
        fireEvent.change(getInput('space-type-row-1-description-input'), { target: { value: '   ' } });
        fireEvent.click(screen.getByTestId('space-type-row-1-save-button'));

        await waitFor(() => {
            expect(actions.updateBookableSpaceType).toHaveBeenCalledWith(
                {
                    space_type_name: 'Unspecified',
                    space_type_description: '-',
                },
                '1',
            );
        });
    });

    it('shows the empty row state when there are no known space types', () => {
        renderComponent({
            bookableSpacesRoomList: {
                data: {
                    locations: [{ space_id: 1 }],
                    known_space_types: [],
                },
            },
        });

        expect(screen.getByTestId('space-types-empty-row')).toBeInTheDocument();
        expect(screen.getByTestId('space-types-empty-message')).toHaveTextContent('No space types found.');
    });

    it('opens, cancels, and submits the add-space-type dialog', async () => {
        const actions = {
            createBookableSpaceType: jest.fn().mockResolvedValue({}),
            loadAllBookableSpacesRooms: jest.fn(),
            loadWeeklyHours: jest.fn(),
            loadAllFacilityTypes: jest.fn(),
            loadBookableSpaceCampusChildren: jest.fn(),
            updateBookableSpaceType: jest.fn(),
            deleteBookableSpaceType: jest.fn(),
        };

        renderComponent({ actions });

        fireEvent.click(screen.getByTestId('space-types-add-button'));
        expect(screen.getByTestId('space-types-add-dialog')).toBeInTheDocument();

        fireEvent.change(getInput('space-types-add-name-input'), { target: { value: '   Draft value  ' } });
        fireEvent.change(getInput('space-types-add-description-input'), { target: { value: '  Draft description  ' } });
        fireEvent.click(screen.getByTestId('space-types-add-cancel-button'));

        fireEvent.click(screen.getByTestId('space-types-add-button'));
        expect(getInput('space-types-add-name-input')).toHaveValue('');
        expect(getInput('space-types-add-description-input')).toHaveValue('');

        const okButton = screen.getByTestId('space-types-add-ok-button');
        Object.defineProperty(okButton, 'disabled', { value: false, configurable: true });
        fireEvent.click(okButton);
        expect(actions.createBookableSpaceType).not.toHaveBeenCalled();

        fireEvent.change(getInput('space-types-add-name-input'), { target: { value: '   Lecture room  ' } });
        fireEvent.change(getInput('space-types-add-description-input'), { target: { value: '  Shared teaching room  ' } });
        fireEvent.click(screen.getByTestId('space-types-add-ok-button'));

        await waitFor(() => {
            expect(actions.createBookableSpaceType).toHaveBeenCalledWith({
                space_type_name: 'Lecture room',
                space_type_description: 'Shared teaching room',
            });
        });

        expect(displayToastMessage).toHaveBeenCalledWith('Space type created');
        expect(actions.loadAllBookableSpacesRooms).toHaveBeenCalled();
    });

    it('uses empty-string defaults when the add-space-type description is blank', async () => {
        const actions = {
            createBookableSpaceType: jest.fn().mockResolvedValue({}),
            loadAllBookableSpacesRooms: jest.fn(),
            loadWeeklyHours: jest.fn(),
            loadAllFacilityTypes: jest.fn(),
            loadBookableSpaceCampusChildren: jest.fn(),
            updateBookableSpaceType: jest.fn(),
            deleteBookableSpaceType: jest.fn(),
        };

        renderComponent({ actions });

        fireEvent.click(screen.getByTestId('space-types-add-button'));
        fireEvent.change(getInput('space-types-add-name-input'), { target: { value: 'New type' } });
        fireEvent.change(getInput('space-types-add-description-input'), { target: { value: '   ' } });
        fireEvent.click(screen.getByTestId('space-types-add-ok-button'));

        await waitFor(() => {
            expect(actions.createBookableSpaceType).toHaveBeenCalledWith({
                space_type_name: 'New type',
                space_type_description: '',
            });
        });
    });

    it('loads campus data once room data is available and disables deletes for allocated space types', () => {
        const actions = {
            loadBookableSpaceCampusChildren: jest.fn(),
            loadAllBookableSpacesRooms: jest.fn(),
            loadWeeklyHours: jest.fn(),
            loadAllFacilityTypes: jest.fn(),
            updateBookableSpaceType: jest.fn(),
            deleteBookableSpaceType: jest.fn(),
            createBookableSpaceType: jest.fn(),
        };

        renderComponent({ actions, campusList: null, campusListLoading: null, campusListError: null });

        expect(actions.loadBookableSpaceCampusChildren).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId('space-type-row-2-delete-button')).toBeDisabled();
    });

    it('opens the delete dialog and cancels without deleting', async () => {
        const actions = {
            deleteBookableSpaceType: jest.fn().mockResolvedValue({}),
            loadAllBookableSpacesRooms: jest.fn(),
            loadWeeklyHours: jest.fn(),
            loadAllFacilityTypes: jest.fn(),
            loadBookableSpaceCampusChildren: jest.fn(),
            updateBookableSpaceType: jest.fn(),
            createBookableSpaceType: jest.fn(),
        };

        renderComponent({ actions });

        fireEvent.click(screen.getByTestId('space-type-row-1-delete-button'));
        expect(screen.getByTestId('space-types-delete-dialog')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('space-types-delete-cancel-button'));
        expect(actions.deleteBookableSpaceType).not.toHaveBeenCalled();
        expect(screen.getByTestId('space-types-delete-cancel-button')).toBeInTheDocument();
    });

    it('opens the delete dialog and confirms a delete action', async () => {
        const actions = {
            deleteBookableSpaceType: jest.fn().mockResolvedValue({}),
            loadAllBookableSpacesRooms: jest.fn(),
            loadWeeklyHours: jest.fn(),
            loadAllFacilityTypes: jest.fn(),
            loadBookableSpaceCampusChildren: jest.fn(),
            updateBookableSpaceType: jest.fn(),
            createBookableSpaceType: jest.fn(),
        };

        renderComponent({ actions });

        fireEvent.click(screen.getByTestId('space-type-row-1-delete-button'));
        expect(screen.getByTestId('space-types-delete-dialog')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('space-types-delete-confirm-button'));

        await waitFor(() => {
            expect(actions.deleteBookableSpaceType).toHaveBeenCalledWith(1);
        });

        expect(displayToastMessage).toHaveBeenCalledWith('Space type deleted');
        expect(actions.loadAllBookableSpacesRooms).toHaveBeenCalled();
    });

    it('shows an error toast when inline update fails', async () => {
        const actions = {
            updateBookableSpaceType: jest.fn().mockRejectedValue(new Error('boom')),
            loadAllBookableSpacesRooms: jest.fn(),
            loadWeeklyHours: jest.fn(),
            loadAllFacilityTypes: jest.fn(),
            loadBookableSpaceCampusChildren: jest.fn(),
            deleteBookableSpaceType: jest.fn(),
            createBookableSpaceType: jest.fn(),
        };

        renderComponent({ actions });

        fireEvent.click(screen.getByTestId('space-type-row-1-edit-button'));
        fireEvent.change(getInput('space-type-row-1-name-input'), { target: { value: 'Updated name' } });
        fireEvent.click(screen.getByTestId('space-type-row-1-save-button'));

        await waitFor(() => {
            expect(displayToastErrorMessage).toHaveBeenCalledWith(
                'Sorry, an error occurred - updating the Space type failed.',
            );
        });
    });

    it('shows an error toast when delete fails', async () => {
        const actions = {
            deleteBookableSpaceType: jest.fn().mockRejectedValue(new Error('bad delete')),
            loadAllBookableSpacesRooms: jest.fn(),
            loadWeeklyHours: jest.fn(),
            loadAllFacilityTypes: jest.fn(),
            loadBookableSpaceCampusChildren: jest.fn(),
            updateBookableSpaceType: jest.fn(),
            createBookableSpaceType: jest.fn(),
        };

        renderComponent({ actions });

        fireEvent.click(screen.getByTestId('space-type-row-1-delete-button'));
        fireEvent.click(screen.getByTestId('space-types-delete-confirm-button'));

        await waitFor(() => {
            expect(displayToastErrorMessage).toHaveBeenCalledWith(
                'Sorry, an error occurred - the Space type was not deleted.',
            );
        });
    });

    it('shows an error toast when add fails', async () => {
        const actions = {
            createBookableSpaceType: jest.fn().mockRejectedValue(new Error('bad create')),
            loadAllBookableSpacesRooms: jest.fn(),
            loadWeeklyHours: jest.fn(),
            loadAllFacilityTypes: jest.fn(),
            loadBookableSpaceCampusChildren: jest.fn(),
            updateBookableSpaceType: jest.fn(),
            deleteBookableSpaceType: jest.fn(),
        };

        renderComponent({ actions });

        fireEvent.click(screen.getByTestId('space-types-add-button'));
        fireEvent.change(getInput('space-types-add-name-input'), { target: { value: 'New type' } });
        fireEvent.change(getInput('space-types-add-description-input'), { target: { value: 'A new type' } });
        fireEvent.click(screen.getByTestId('space-types-add-ok-button'));

        await waitFor(() => {
            expect(displayToastErrorMessage).toHaveBeenCalledWith(
                'Sorry, an error occurred - the Space type was not created.',
            );
        });
    });
});
