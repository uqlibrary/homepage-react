import React from 'react';

import { fireEvent, rtlRender, screen, waitFor } from 'test-utils';
import { cleanup } from '@testing-library/react';
import { useCookies } from 'react-cookie';

import { BookableSpacesManageLocations } from './BookableSpacesManageLocations';
import {
    closeDialog,
    displayToastMessage,
    showGenericConfirmAndDeleteDialog,
} from 'modules/Pages/Admin/BookableSpaces/bookableSpacesAdminHelpers';

jest.mock('react-cookie', () => ({
    useCookies: jest.fn(() => [{}, jest.fn()]),
}));

jest.mock('hooks', () => {
    const ReactModule = require('react');
    return {
        useConfirmationState: () => {
            const [isOpen, setIsOpen] = ReactModule.useState(false);
            return [isOpen, () => setIsOpen(true), () => setIsOpen(false)];
        },
    };
});

jest.mock('modules/Pages/Admin/BookableSpaces/bookableSpacesAdminHelpers', () => ({
    addBreadcrumbsToSiteHeader: jest.fn(),
    closeDeletionConfirmation: jest.fn(),
    closeDialog: jest.fn(() => globalThis.document.getElementById('popupDialog')?.close()),
    displayToastMessage: jest.fn(),
    showGenericConfirmAndDeleteDialog: jest.fn(),
    springshareLocations: jest.fn(() => [{ id: 10, display_name: 'Central - Quiet Study' }]),
}));

jest.mock('modules/Pages/Admin/BookableSpaces/SpacesAdminPage', () => ({
    SpacesAdminPage: ({ children }) => <div data-testid="spaces-admin-page">{children}</div>,
}));

jest.mock('modules/Pages/Admin/BookableSpaces/Locations/CampusLocationMap', () => ({
    __esModule: true,
    default: ({ campusCentre }) => <div data-testid="campus-location-map">{JSON.stringify(campusCentre)}</div>,
}));

jest.mock('modules/SharedComponents/Toolbox/ConfirmDialogBox', () => ({
    ConfirmationBox: ({ isOpen, locale, onAction, onClose }) =>
        isOpen ? (
            <div data-testid="confirmation-box">
                <span>{locale?.confirmationTitle}</span>
                <button type="button" data-testid="confirmation-action" onClick={onAction}>
                    Action
                </button>
                <button type="button" data-testid="confirmation-close" onClick={onClose}>
                    Close
                </button>
            </div>
        ) : null,
}));

const campusList = [
    {
        campus_id: 1,
        campus_name: 'St Lucia',
        campus_number: '01',
        campus_latitude: '-27.5',
        campus_longitude: '153.0',
        libraries: [
            {
                library_id: 2,
                library_name: 'Central Library',
                building_name: 'Central Library',
                building_number: '10',
                ground_floor_id: 3,
                library_springshare_id: 10,
                floors: [
                    { floor_id: 3, floor_name: '1', library_name: 'Central Library' },
                    { floor_id: 4, floor_name: '2', library_name: 'Central Library' },
                ],
            },
            {
                library_id: 5,
                building_name: 'Unlabelled Building',
                floors: [],
            },
        ],
    },
];

const buildActions = overrides => ({
    loadBookableSpaceCampusChildren: jest.fn(),
    loadWeeklyHours: jest.fn(),
    addBookableSpaceLocation: jest.fn(() => Promise.resolve({ data: { floor_id: 9 } })),
    updateBookableSpaceLocation: jest.fn(() => Promise.resolve()),
    deleteBookableSpaceLocation: jest.fn(() => Promise.resolve()),
    ...overrides,
});

const renderLocations = overrides =>
    rtlRender(
        <BookableSpacesManageLocations
            actions={buildActions(overrides?.actions)}
            campusList={campusList}
            campusListLoading={false}
            campusListError={false}
            weeklyHours={{ locations: [] }}
            weeklyHoursLoading={false}
            weeklyHoursError={false}
            {...overrides}
        />,
    );

const installDialogMethods = () => {
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
};

describe('BookableSpacesManageLocations', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        installDialogMethods();
        document.body.innerHTML = '';
    });

    afterEach(() => {
        cleanup();
    });

    it('loads dependencies when the location data is initially unavailable', () => {
        const actions = buildActions();
        rtlRender(
            <BookableSpacesManageLocations
                actions={actions}
                campusList={null}
                campusListLoading={null}
                campusListError={null}
                weeklyHours={null}
                weeklyHoursLoading={null}
                weeklyHoursError={null}
            />,
        );

        expect(actions.loadBookableSpaceCampusChildren).toHaveBeenCalled();
        expect(actions.loadWeeklyHours).toHaveBeenCalled();
        expect(screen.getByText('No spaces currently in system.')).toBeInTheDocument();
    });

    it('renders loading, error, and empty states', () => {
        const { rerender } = renderLocations({ campusListLoading: true });
        expect(screen.getByText('Loading')).toBeInTheDocument();

        rerender(
            <BookableSpacesManageLocations
                actions={buildActions()}
                campusList={campusList}
                campusListLoading={false}
                campusListError
                weeklyHours={{ locations: [] }}
                weeklyHoursLoading={false}
                weeklyHoursError={false}
            />,
        );
        expect(screen.getByText('Something went wrong - please try again later.')).toBeInTheDocument();

        rerender(
            <BookableSpacesManageLocations
                actions={buildActions()}
                campusList={[]}
                campusListLoading={false}
                campusListError={false}
                weeklyHours={{ locations: [] }}
                weeklyHoursLoading={false}
                weeklyHoursError={false}
            />,
        );
        expect(screen.getByText('No spaces currently in system.')).toBeInTheDocument();
    });

    it('closes the error confirmation when its action is clicked', async () => {
        const actions = buildActions({
            addBookableSpaceLocation: jest.fn(() => Promise.reject(new Error('save failed'))),
        });
        renderLocations({ actions });

        fireEvent.click(screen.getByTestId('add-new-campus-button'));
        document.getElementById('campusName').value = 'Broken campus';
        document.getElementById('campusNumber').value = '99';
        fireEvent.click(screen.getByTestId('dialog-save-button'));

        await waitFor(() => expect(screen.getByTestId('confirmation-box')).toBeInTheDocument());
        fireEvent.click(screen.getByTestId('confirmation-action'));
        expect(screen.queryByTestId('confirmation-box')).not.toBeInTheDocument();
    });

    it('handles stale campus, library, and floor edit identifiers safely', async () => {
        const invalidCampus = [{ ...campusList[0], campus_id: 0 }];
        renderLocations({ campusList: invalidCampus });

        fireEvent.click(screen.getByTestId('edit-campus-0-button'));
        await waitFor(() => expect(screen.getByTestId('confirmation-box')).toHaveTextContent('Sorry, something went wrong'));
        fireEvent.click(screen.getByTestId('confirmation-close'));

        cleanup();
        const invalidLibrary = [{ ...campusList[0], libraries: [{ ...campusList[0].libraries[0], library_id: 0 }] }];
        renderLocations({ campusList: invalidLibrary });
        fireEvent.click(screen.getByTestId('edit-library-0-button'));
        await waitFor(() => expect(screen.getByTestId('confirmation-box')).toHaveTextContent('Sorry, something went wrong'));
        fireEvent.click(screen.getByTestId('confirmation-close'));

        cleanup();
        const invalidFloor = [{
            ...campusList[0],
            libraries: [{ ...campusList[0].libraries[0], floors: [{ ...campusList[0].libraries[0].floors[0], floor_id: 5 }] }],
        }];
        renderLocations({ campusList: invalidFloor });
        invalidFloor[0].libraries[0].floors = [];
        fireEvent.click(screen.getByTestId('edit-floor-5-button'));
        await waitFor(() => expect(screen.getByTestId('confirmation-box')).toHaveTextContent('Sorry, something went wrong'));
    });

    it('opens campus, library, and floor forms and cancels the dialog', () => {
        renderLocations();

        fireEvent.click(screen.getByTestId('edit-campus-1-button'));
        expect(screen.getByTestId('edit-campus-dialog-heading')).toBeInTheDocument();
        expect(screen.getByTestId('campus-library-list')).toHaveTextContent('Central Library');
        expect(screen.getByTestId('campus-location-map')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('dialog-addnew-button'));
        expect(screen.getByText('Add a library to St Lucia campus')).toBeInTheDocument();
        expect(screen.getByTestId('library-name')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('dialog-cancel-button'));
        fireEvent.click(screen.getByTestId('edit-library-2-button'));
        expect(screen.getByTestId('library-floor-list')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('dialog-addnew-button'));
        expect(screen.getByTestId('floor-name')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('dialog-cancel-button'));
        fireEvent.click(screen.getByTestId('edit-floor-3-button'));
        expect(screen.getByTestId('floor-name')).toHaveTextContent('Level name');
    });

    it('validates and saves a new campus, including the active Cypress cookie path', async () => {
        const setCookie = jest.fn();
        require('react-cookie').useCookies.mockReturnValue([{ CYPRESS_TEST_DATA: 'active' }, setCookie]);
        const actions = buildActions();
        renderLocations({ actions, campusList: [{ ...campusList[0], libraries: [] }] });

        fireEvent.click(screen.getByTestId('add-new-campus-button'));
        fireEvent.click(screen.getByTestId('dialog-save-button'));
        expect(document.getElementById('warningtext')).toHaveTextContent('Please enter campus name and number');

        document.getElementById('campusName').value = 'Gatton';
        document.getElementById('campusNumber').value = '07';
        fireEvent.click(screen.getByTestId('dialog-save-button'));

        await waitFor(() => expect(actions.addBookableSpaceLocation).toHaveBeenCalled());
        expect(actions.addBookableSpaceLocation).toHaveBeenCalledWith(
            expect.objectContaining({ campus_name: 'Gatton', campus_number: '07' }),
            'campus',
        );
        expect(displayToastMessage).toHaveBeenCalledWith('Campus added');
    });

    it('handles campus save failures and edit-campus success', async () => {
        const actions = buildActions({ addBookableSpaceLocation: jest.fn(() => Promise.reject(new Error('failed'))) });
        renderLocations({ actions });
        fireEvent.click(screen.getByTestId('add-new-campus-button'));
        document.getElementById('campusName').value = 'Gatton';
        document.getElementById('campusNumber').value = '07';
        fireEvent.click(screen.getByTestId('dialog-save-button'));
        await waitFor(() => expect(screen.getByText(/BSML-001/)).toBeInTheDocument());

        cleanup();
        const editActions = buildActions();
        renderLocations({ actions: editActions });
        fireEvent.click(screen.getByTestId('edit-campus-1-button'));
        document.getElementById('campusName').value = 'St Lucia Updated';
        document.getElementById('campusNumber').value = '02';
        fireEvent.click(screen.getByTestId('dialog-save-button'));
        await waitFor(() => expect(editActions.updateBookableSpaceLocation).toHaveBeenCalled());
        expect(displayToastMessage).toHaveBeenCalledWith('Change to campus saved');
    });

    it('validates and saves libraries and floors', async () => {
        const actions = buildActions();
        renderLocations({ actions });
        fireEvent.click(screen.getByTestId('edit-campus-1-button'));
        fireEvent.click(screen.getByTestId('dialog-addnew-button'));
        fireEvent.click(screen.getByTestId('dialog-save-button'));
        expect(document.getElementById('warningtext')).toHaveTextContent('Please enter the Library name');

        document.getElementById('libraryName').value = 'New Library';
        document.getElementById('buildingName').value = 'New Building';
        document.getElementById('buildingNumber').value = '8';
        fireEvent.click(screen.getByTestId('dialog-save-button'));
        await waitFor(() => expect(actions.addBookableSpaceLocation).toHaveBeenCalledWith(
            expect.objectContaining({ library_name: 'New Library' }),
            'library',
        ));

        cleanup();
        renderLocations({ actions });
        fireEvent.click(screen.getByTestId('edit-library-2-button'));
        fireEvent.click(screen.getByTestId('dialog-addnew-button'));
        fireEvent.click(screen.getByTestId('dialog-save-button'));
        expect(document.getElementById('warningtext')).toHaveTextContent('Please enter floor name');
        document.getElementById('displayedFloorId').value = '3';
        fireEvent.click(screen.getByTestId('dialog-save-button'));
        await waitFor(() => expect(actions.addBookableSpaceLocation).toHaveBeenCalledWith(
            expect.objectContaining({ floor_name: '3' }),
            'floor',
        ));
    });

    it('handles delete confirmation and deletion failure', async () => {
        const actions = buildActions({ deleteBookableSpaceLocation: jest.fn(() => Promise.reject(new Error('failed'))) });
        renderLocations({ actions });
        fireEvent.click(screen.getByTestId('edit-campus-1-button'));
        fireEvent.click(screen.getByTestId('dialog-delete-button'));
        expect(showGenericConfirmAndDeleteDialog).toHaveBeenCalled();
        fireEvent.click(screen.getByTestId('confirmation-dialog-accept-button'));
        await waitFor(() => expect(screen.getByText(/BSML-004/)).toBeInTheDocument());

        expect(closeDialog).toHaveBeenCalled();
    });

    it('saves edited libraries and floors, including ground-floor assignment', async () => {
        const actions = buildActions();
        renderLocations({ actions });

        fireEvent.click(screen.getByTestId('edit-library-2-button'));
        document.getElementById('libraryName').value = 'Central Updated';
        document.getElementById('buildingName').value = 'Building Updated';
        document.getElementById('buildingNumber').value = '11';
        fireEvent.click(screen.getByTestId('dialog-save-button'));
        await waitFor(() => expect(actions.updateBookableSpaceLocation).toHaveBeenCalledWith(
            expect.objectContaining({ library_name: 'Central Updated' }),
            'library',
            '2',
        ));

        cleanup();
        renderLocations({ actions });
        fireEvent.click(screen.getByTestId('edit-library-2-button'));
        fireEvent.click(screen.getByTestId('dialog-addnew-button'));
        document.getElementById('displayedFloorId').value = '9';
        document.getElementById('isGroundFloor').checked = true;
        fireEvent.click(screen.getByTestId('dialog-save-button'));

        await waitFor(() => expect(actions.addBookableSpaceLocation).toHaveBeenCalledWith(
            { floor_name: '9', floor_library_id: '2' },
            'floor',
        ));
        await waitFor(() => expect(actions.updateBookableSpaceLocation).toHaveBeenCalledWith(
            { ground_floor_id: 9 },
            'library',
            '2',
        ));
        expect(displayToastMessage).toHaveBeenCalledWith('Level added');
    });

    it('covers library and floor save failures and delete success messages', async () => {
        const actions = buildActions({
            updateBookableSpaceLocation: jest.fn(() => Promise.reject(new Error('update failed'))),
            deleteBookableSpaceLocation: jest.fn(() => Promise.resolve()),
        });
        renderLocations({ actions });

        fireEvent.click(screen.getByTestId('edit-library-2-button'));
        document.getElementById('libraryName').value = 'Broken Library';
        document.getElementById('buildingName').value = 'Broken Building';
        document.getElementById('buildingNumber').value = '12';
        fireEvent.click(screen.getByTestId('dialog-save-button'));
        await waitFor(() => expect(screen.getByText(/BSML-005/)).toBeInTheDocument());

        cleanup();
        renderLocations({ actions });
        fireEvent.click(screen.getByTestId('edit-floor-3-button'));
        document.getElementById('displayedFloorId').value = '10';
        fireEvent.click(screen.getByTestId('dialog-save-button'));
        await waitFor(() => expect(screen.getByText(/BSML-007/)).toBeInTheDocument());
        fireEvent.click(screen.getByTestId('confirmation-close'));

        cleanup();
        renderLocations({ actions });
        fireEvent.click(screen.getByTestId('edit-library-2-button'));
        fireEvent.click(screen.getByTestId('dialog-delete-button'));
        fireEvent.click(screen.getByTestId('confirmation-dialog-accept-button'));
        await waitFor(() => expect(displayToastMessage).toHaveBeenCalledWith('Central Library deleted'));

        cleanup();
        renderLocations({ actions });
        fireEvent.click(screen.getByTestId('edit-floor-3-button'));
        fireEvent.click(screen.getByTestId('dialog-delete-button'));
        fireEvent.click(screen.getByTestId('confirmation-dialog-accept-button'));
        await waitFor(() => expect(displayToastMessage).toHaveBeenCalledWith('Level 1 in Central Library deleted'));

        cleanup();
        renderLocations({ actions: buildActions() });
        fireEvent.click(screen.getByTestId('edit-floor-3-button'));
        document.getElementById('displayedFloorId').value = '11';
        fireEvent.click(screen.getByTestId('dialog-save-button'));
        await waitFor(() => expect(displayToastMessage).toHaveBeenCalledWith('Changes to floor saved'));
    });

    it('covers campus, library, and new-floor rejection handlers', async () => {
        const actions = buildActions({
            updateBookableSpaceLocation: jest.fn(() => Promise.reject(new Error('update failed'))),
            addBookableSpaceLocation: jest.fn(() => Promise.reject(new Error('add failed'))),
        });

        renderLocations({ actions });
        fireEvent.click(screen.getByTestId('edit-campus-1-button'));
        document.getElementById('campusName').value = 'Broken campus';
        document.getElementById('campusNumber').value = '99';
        fireEvent.click(screen.getByTestId('dialog-save-button'));
        await waitFor(() => expect(screen.getByText(/BSML-003/)).toBeInTheDocument());

        cleanup();
        renderLocations({ actions });
        fireEvent.click(screen.getByTestId('edit-campus-1-button'));
        fireEvent.click(screen.getByTestId('dialog-addnew-button'));
        document.getElementById('libraryName').value = 'Broken library';
        document.getElementById('buildingName').value = 'Broken building';
        document.getElementById('buildingNumber').value = '99';
        fireEvent.click(screen.getByTestId('dialog-save-button'));
        await waitFor(() => expect(screen.getByText(/BSML-002/)).toBeInTheDocument());

        cleanup();
        renderLocations({ actions });
        fireEvent.click(screen.getByTestId('edit-library-2-button'));
        fireEvent.click(screen.getByTestId('dialog-addnew-button'));
        document.getElementById('displayedFloorId').value = '99';
        fireEvent.click(screen.getByTestId('dialog-save-button'));
        await waitFor(() => expect(screen.getByText(/BSML-006/)).toBeInTheDocument());
    });

    it('covers validation in edited campus, library, and floor forms', () => {
        renderLocations();
        fireEvent.click(screen.getByTestId('edit-campus-1-button'));
        document.getElementById('campusName').value = '';
        fireEvent.click(screen.getByTestId('dialog-save-button'));
        expect(document.getElementById('warningtext')).toHaveTextContent('Please enter campus name and number');

        cleanup();
        renderLocations();
        fireEvent.click(screen.getByTestId('edit-library-2-button'));
        document.getElementById('libraryName').value = '';
        fireEvent.click(screen.getByTestId('dialog-save-button'));
        expect(document.getElementById('warningtext')).toHaveTextContent('Please enter the Library name');

        cleanup();
        renderLocations();
        fireEvent.click(screen.getByTestId('edit-floor-3-button'));
        document.getElementById('displayedFloorId').value = '';
        fireEvent.click(screen.getByTestId('dialog-save-button'));
        expect(document.getElementById('warningtext')).toHaveTextContent('Please enter floor name');
    });
});
