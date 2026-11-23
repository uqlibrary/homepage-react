import React from 'react';

import { fireEvent, rtlRender, screen } from 'test-utils';

import SidebarSpacesList from './SidebarSpacesList';

jest.mock('helpers/general', () => ({
    StyledSkipLinkAnchor: ({ href, children, ...props }) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
}));

jest.mock('modules/Pages/BookableSpaces/SpacesListPage/MapListPage/components/MapSpaceDetails', () => ({
    __esModule: true,
    default: ({ bookableSpace, onToggle, isExpanded }) => (
        <div data-testid={`map-space-details-${bookableSpace?.space_id}`}>
            <button
                type="button"
                data-testid={`toggle-space-${bookableSpace?.space_id}`}
                onClick={() => onToggle?.(bookableSpace, isExpanded)}
            >
                Toggle details
            </button>
        </div>
    ),
}));

jest.mock('modules/Pages/BookableSpaces/Shared/SpacesFavouriteIcon', () => ({
    __esModule: true,
    default: ({ bookableSpace }) => <span data-testid={`favourite-icon-${bookableSpace?.space_id}`}>Favourite</span>,
}));

const buildSpace = overrides => ({
    space_id: 101,
    space_uuid: 'st-lucia-space-uuid',
    space_name: 'Room A',
    space_type_details: { space_type_name: 'Meeting room' },
    space_library_name: 'Central Library',
    ...overrides,
});

const StyledCard = ({ title, children, fullHeight, squareTop, subCard, ...rest }) => (
    <div data-testid="styled-card" {...rest}>
        {title}
        {children}
    </div>
);

describe('SidebarSpacesList', () => {
    const baseProps = {
        actions: {},
        filteredSpaceLocations: [buildSpace(), buildSpace({ space_id: 102, space_name: 'Room B' })],
        totalSpaceCount: 5,
        activeFilterCount: 1,
        weeklyHours: { locations: [] },
        weeklyHoursLoading: false,
        weeklyHoursError: null,
        StyledStandardCard: StyledCard,
    };

    it('renders the empty-state message when no spaces match the filters', () => {
        rtlRender(
            <SidebarSpacesList {...baseProps} filteredSpaceLocations={[]} totalSpaceCount={5} activeFilterCount={2} />,
        );

        expect(screen.getByTestId('no-spaces-visible')).toBeInTheDocument();
        expect(screen.getByText(/No Spaces match these filters/i)).toBeInTheDocument();
    });

    it('renders space counts, handles selection, and shows the expanded details action', () => {
        const onSpaceSelect = jest.fn();
        const onSpaceExpandClick = jest.fn(event => {
            expect(event.currentTarget).toHaveAttribute('data-analytics-id', 'space-101-name');
        });
        const onSpaceToggle = jest.fn();

        rtlRender(
            <SidebarSpacesList
                {...baseProps}
                onSpaceSelect={onSpaceSelect}
                onSpaceExpandClick={onSpaceExpandClick}
                onSpaceToggle={onSpaceToggle}
                expandedSpaceId={101}
                suppliedClassName="custom-sidebar"
                spacesFavouritesList={[{ space_id: 101 }]}
            />,
        );

        expect(screen.getByTestId('space-space-count')).toBeInTheDocument();
        expect(screen.getByText('Available Spaces')).toBeInTheDocument();
        expect(screen.getByText('(2)')).toBeInTheDocument();
        expect(screen.getByTestId('space-wrapper')).toHaveClass('custom-sidebar');

        const title = screen.getByTestId('space-101-name');
        expect(title).toHaveStyle({ cursor: 'pointer' });
        expect(title).toHaveAttribute('data-analytics-id', 'space-101-name');
        fireEvent.click(title);
        fireEvent.keyDown(title, { key: 'Enter' });

        expect(onSpaceExpandClick).toHaveBeenCalledTimes(1);
        expect(onSpaceExpandClick.mock.calls[0][1]).toBe(baseProps.filteredSpaceLocations[0]);
        expect(onSpaceSelect).toHaveBeenCalledTimes(2);
        expect(onSpaceSelect).toHaveBeenNthCalledWith(1, baseProps.filteredSpaceLocations[0]);
        expect(onSpaceSelect).toHaveBeenNthCalledWith(2, baseProps.filteredSpaceLocations[0]);

        fireEvent.click(screen.getByTestId('toggle-space-101'));
        expect(onSpaceToggle).toHaveBeenCalledWith(baseProps.filteredSpaceLocations[0], true);

        expect(screen.getByTestId('space-101-details')).toBeInTheDocument();
    });

    it('forwards detail-button clicks to the navigation analytics handler', () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        const trackedClick = jest.fn(event => {
            expect(event.currentTarget).toHaveAttribute('href', '/spaces/detail/st-lucia-space-uuid');
        });

        rtlRender(<SidebarSpacesList {...baseProps} onSpaceDetailsClick={trackedClick} expandedSpaceId={101} />);

        fireEvent.click(screen.getByTestId('space-101-details'));

        expect(trackedClick).toHaveBeenCalledTimes(1);
        expect(trackedClick).toHaveBeenCalledWith(expect.anything(), baseProps.filteredSpaceLocations[0]);
        consoleError.mockRestore();
    });

    it('uses default values when optional props are omitted', () => {
        rtlRender(
            <SidebarSpacesList
                actions={{}}
                filteredSpaceLocations={[buildSpace({ space_id: 303, space_name: 'Room C' })]}
                totalSpaceCount={1}
                activeFilterCount={0}
                weeklyHours={{ locations: [] }}
                weeklyHoursLoading={false}
                weeklyHoursError={null}
                StyledStandardCard={StyledCard}
            />,
        );

        expect(screen.getByText('Available Spaces')).toBeInTheDocument();
        expect(screen.getByTestId('space-303')).toBeInTheDocument();
        expect(screen.getByTestId('space-303-name')).toBeInTheDocument();
        expect(screen.getByTestId('toggle-space-303')).toBeInTheDocument();
    });
});
