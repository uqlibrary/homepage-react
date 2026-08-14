import React from 'react';
import { fireEvent, rtlRender, screen } from '../../../../../utils/test-utils';
import { useAccountContext } from 'context';
import { accounts } from '../../../../data/mock/data/account';
import { AdminButton } from './AdminButton';
import { SpacesAdminPage } from './SpacesAdminPage';
import { BookableSpacesManageSpaceTypes } from './SpaceTypes/BookableSpacesManageSpaceTypes';
import { BookableSpacesManageLocations } from './Locations/BookableSpacesManageLocations';
import { BookableSpacesManageFacilities } from './Facilities/BookableSpacesManageFacilities';

jest.mock('react-cookie', () => ({
    useCookies: () => [{}, jest.fn()],
}));

jest.mock('hooks', () => ({
    useConfirmationState: () => [false, jest.fn(), jest.fn()],
}));

jest.mock('@mui/material/IconButton', () => {
    const React = require('react');
    return ({ children, onClick, onKeyDown, ...props }) => (
        <button
            {...props}
            type="button"
            onClick={event => onClick && onClick(event)}
            onKeyDown={event => onKeyDown && onKeyDown(event)}
        >
            {children}
        </button>
    );
});

jest.mock('context', () => ({
    useAccountContext: jest.fn(),
}));

jest.mock('./bookableSpacesAdminHelpers', () => ({
    spacesAdminLink: jest.fn((path = '', account = null) => {
        if (account && account.id) {
            return `https://localhost${path}?user=${account.id}`;
        }
        return `https://localhost${path}`;
    }),
}));

describe('BookableSpaces admin UI shell', () => {
    beforeEach(() => {
        useAccountContext.mockReturnValue({ account: accounts.libSpaces });
    });

    it('opens the admin menu and renders the admin links for the current page', () => {
        rtlRender(<AdminButton currentPageSlug="dashboard" />);

        fireEvent.click(screen.getByTestId('admin-spaces-menu-button'));

        expect(screen.getByTestId('admin-spaces-menu')).toBeInTheDocument();
        expect(screen.getByTestId('admin-spaces-visit-dashboard-button')).toHaveAttribute(
            'href',
            'https://localhost/admin/spaces?user=libSpaces',
        );
        expect(screen.getByTestId('admin-spaces-visit-manage-locations-button')).toHaveAttribute(
            'href',
            'https://localhost/admin/spaces/manage/locations?user=libSpaces',
        );
        expect(screen.getByTestId('admin-spaces-visit-homepage-button')).toHaveAttribute(
            'href',
            'https://localhost/spaces?user=libSpaces',
        );
    });

    it('toggles the menu state when clicked a second time or via keyboard', () => {
        rtlRender(<AdminButton currentPageSlug="spacetypes" />);

        const button = screen.getByTestId('admin-spaces-menu-button');

        fireEvent.click(button);
        expect(button).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByTestId('admin-spaces-menu')).toBeInTheDocument();

        fireEvent.click(button);
        expect(button).toHaveAttribute('aria-expanded', 'false');
        expect(screen.getByTestId('admin-spaces-menu')).toBeInTheDocument();

        fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
        expect(button).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByTestId('admin-spaces-menu')).toBeInTheDocument();

        fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
        expect(button).toHaveAttribute('aria-expanded', 'false');
        expect(screen.getByTestId('admin-spaces-menu')).toBeInTheDocument();
    });

    it.each([
        ['dashboard', 'admin-spaces-visit-dashboard-button', 'Manage Spaces'],
        ['spacetypes', 'admin-spacetypes-visit-dashboard-button', 'Manage Space Types'],
        ['manage-locations', 'admin-spaces-visit-manage-locations-button', 'Manage Locations'],
        ['add-space', 'admin-spaces-visit-add-space-button', 'Add new Space'],
        ['manage-facilities', 'admin-spaces-visit-manage-facilities-button', 'Manage Facility types'],
    ])('marks the current %s page item as active and keeps other items clickable', (currentPageSlug, activeTestId, activeLabel) => {
        rtlRender(<AdminButton currentPageSlug={currentPageSlug} />);

        fireEvent.click(screen.getByTestId('admin-spaces-menu-button'));

        const activeItem = screen.getByTestId(activeTestId);
        expect(activeItem.querySelector('span:not(.clickable)')).toHaveTextContent(activeLabel);
        expect(activeItem.querySelector('span.clickable')).not.toBeInTheDocument();

        expect(screen.getAllByTestId('GradeIcon')).toHaveLength(1);
        expect(screen.getAllByTestId('ArrowForwardIcon').length).toBeGreaterThan(0);
    });

    it('handles a missing event when the menu button is invoked', () => {
        rtlRender(<AdminButton currentPageSlug="dashboard" />);

        const button = screen.getByTestId('admin-spaces-menu-button');
        button.onclick?.();

        expect(button).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByTestId('admin-spaces-menu')).not.toBeInTheDocument();
    });

    it('renders the main admin page shell with title and child content', () => {
        rtlRender(
            <SpacesAdminPage pageTitle="Manage spaces" currentPageSlug="add-space" standardPageId="standard-page-id">
                <div>Child content</div>
            </SpacesAdminPage>,
        );

        expect(screen.getByTestId('SpacesAdminPage')).toBeInTheDocument();
        expect(screen.getByTestId('SpacesAdminPage-systemTitle')).toHaveTextContent('Spaces');
        expect(screen.getByTestId('admin-spaces-page-title')).toHaveTextContent('Manage spaces');
        expect(screen.getByTestId('admin-spaces-menu-button')).toBeInTheDocument();
        expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('renders the space-types admin page shell with the add button and empty state', () => {
        rtlRender(
            <BookableSpacesManageSpaceTypes
                actions={{
                    loadAllBookableSpacesRooms: jest.fn(),
                    loadWeeklyHours: jest.fn(),
                    loadAllFacilityTypes: jest.fn(),
                    loadBookableSpaceCampusChildren: jest.fn(),
                    updateBookableSpaceType: jest.fn(() => Promise.resolve()),
                    deleteBookableSpaceType: jest.fn(() => Promise.resolve()),
                    createBookableSpaceType: jest.fn(() => Promise.resolve()),
                }}
                bookableSpacesRoomList={{ data: { known_space_types: [] } }}
                bookableSpacesRoomListLoading={false}
                bookableSpacesRoomListError={false}
                weeklyHours={{ locations: [] }}
                weeklyHoursLoading={false}
                weeklyHoursError={false}
                facilityTypeList={{ data: { facility_type_groups: [] } }}
                facilityTypeListLoading={false}
                facilityTypeListError={false}
                campusList={[]}
                campusListLoading={false}
                campusListError={false}
            />,
        );

        expect(screen.getByTestId('space-types-card')).toBeInTheDocument();
        expect(screen.getByTestId('space-types-add-button')).toBeInTheDocument();
        expect(screen.getByTestId('space-types-empty-message')).toHaveTextContent('No space types found.');
    });

    it('renders the locations admin page shell with the page title and empty list state', () => {
        rtlRender(
            <BookableSpacesManageLocations
                actions={{
                    loadBookableSpaceCampusChildren: jest.fn(),
                    loadWeeklyHours: jest.fn(),
                    updateBookableSpaceLocation: jest.fn(() => Promise.resolve()),
                    addBookableSpaceLocation: jest.fn(() => Promise.resolve()),
                    deleteBookableSpaceLocation: jest.fn(() => Promise.resolve()),
                }}
                campusList={[]}
                campusListLoading={false}
                campusListError={false}
                weeklyHours={{ locations: [] }}
                weeklyHoursLoading={false}
                weeklyHoursError={false}
            />,
        );

        expect(screen.getByTestId('SpacesAdminPage')).toBeInTheDocument();
        expect(screen.getByTestId('admin-spaces-page-title')).toHaveTextContent('Location management');
    });

    it('renders the facilities admin page shell with the tabs and empty group state', () => {
        rtlRender(
            <BookableSpacesManageFacilities
                actions={{
                    loadAllFacilityTypes: jest.fn(),
                    loadAllBookableSpacesRooms: jest.fn(),
                    updateSpacesFacilityGroupList: jest.fn(() => Promise.resolve()),
                    updateSpacesFacilityType: jest.fn(() => Promise.resolve()),
                    deleteSpacesFacilityType: jest.fn(() => Promise.resolve()),
                }}
                facilityTypeList={{ data: { facility_type_groups: [] } }}
                facilityTypeListLoading={false}
                facilityTypeListError={false}
                facilityTypeAdding={false}
                facilityTypeAddError={false}
                facilityTypeAdded={null}
                facilityTypeGroupAdding={false}
                facilityTypeAddGroupError={false}
                facilityTypeGroupAdded={null}
                facilityTypeUpdating={false}
                facilityTypeUpdateError={false}
                facilityTypeUpdated={null}
                bookableSpacesRoomList={{ data: { locations: [] } }}
            />,
        );

        expect(screen.getByTestId('SpacesAdminPage')).toBeInTheDocument();
        expect(screen.getByText('Edit groups')).toBeInTheDocument();
    });
});
