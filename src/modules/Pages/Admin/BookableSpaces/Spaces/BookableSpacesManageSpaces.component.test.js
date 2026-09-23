import React from 'react';

import { fireEvent, rtlRender, screen, waitFor } from 'test-utils';
import { useCookies } from 'react-cookie';
import { useAccountContext } from 'context';

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
    ConfirmationBox: ({ isOpen, locale, onAction, onClose, hideActionButton }) =>
        isOpen ? (
            <div data-testid="confirmation-box">
                <div>{locale?.confirmationTitle}</div>
                {!hideActionButton && locale?.confirmButtonLabel && (
                    <button
                        type="button"
                        data-testid="confirmation-box-action"
                        onClick={() => {
                            onClose?.();
                            onAction?.();
                        }}
                    >
                        {locale.confirmButtonLabel}
                    </button>
                )}
            </div>
        ) : null,
}));

import BookableSpacesManageSpaces from './BookableSpacesManageSpaces';

describe('BookableSpacesManageSpaces local confirmation mock', () => {
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

    it('hits the bulk-save failure confirmation action path with a dedicated local mock file', async () => {
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
});
