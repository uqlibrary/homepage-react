import React from 'react';
import MockDate from 'mockdate';

import useMediaQuery from '@mui/material/useMediaQuery';

import { fireEvent, rtlRender, screen } from 'test-utils';
import { useAccountContext } from 'context';

import JourneySpaceDetailsView from './JourneySpaceDetailsView';

jest.mock('context', () => ({
    useAccountContext: jest.fn(),
}));

jest.mock('@mui/material/useMediaQuery', () => jest.fn(() => false));

jest.mock('modules/Pages/BookableSpaces/Shared/BookableSpacesMap', () => ({
    __esModule: true,
    default: () => <div data-testid="bookable-spaces-map-stub">Map stub</div>,
}));

jest.mock('modules/Pages/BookableSpaces/Shared/BookingLink', () => ({
    BookingLink: () => <div data-testid="booking-link">Book this space</div>,
}));

jest.mock('modules/Pages/BookableSpaces/Shared/SpacesFavouriteIcon', () => ({
    __esModule: true,
    default: () => <div data-testid="favourite-icon">Favourite</div>,
}));

jest.mock('modules/Pages/BookableSpaces/Shared/SpacesOutageNotice', () => ({
    __esModule: true,
    default: ({ visibleOutage }) => <div data-testid="outage-notice">{visibleOutage?.status}</div>,
}));

jest.mock('modules/Pages/BookableSpaces/Shared/SpaceOpenStatusChip', () => ({
    __esModule: true,
    default: () => <div data-testid="open-chip">Open</div>,
}));

jest.mock('modules/Pages/BookableSpaces/Shared/OpeningHoursDown', () => ({
    OpeningHoursDown: () => <div data-testid="opening-hours">Opening hours</div>,
}));

const buildSpace = overrides => ({
    space_id: 101,
    space_name: 'Study pod',
    space_type_details: {
        space_type_name: 'Meeting room',
        space_type_description: 'A quiet room for small teams.',
    },
    space_description: '<p>Perfect for brainstorming.</p>',
    space_campus_name: 'St Lucia',
    space_building_name: 'Forgan Smith',
    space_building_number: '1',
    space_library_name: 'Central Library',
    space_floor_name: 'Level 2',
    space_precise: 'Near the window',
    space_capacity: 4,
    space_photo_url: 'https://example.com/space-photo.jpg',
    space_photo_urls: ['https://example.com/space-photo.jpg', { src: 'https://example.com/other-photo.jpg', alt: 'Other' }],
    space_photos: [{ src: 'https://example.com/space-photo.jpg', description: 'duplicate', alt: 'duplicate alt' }],
    space_images: [{ src: 'https://example.com/space-photo.jpg', space_photo_url: 'https://example.com/space-photo.jpg' }],
    facility_types: [
        { facility_type_id: 1, facility_type_name: 'Whiteboard' },
        { facility_type_id: 2, facility_type_name: 'TV' },
    ],
    space_outages: [],
    ...overrides,
});

describe('JourneySpaceDetailsView', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useAccountContext.mockReturnValue({ account: { id: 42 } });
        useMediaQuery.mockReturnValue(false);
        MockDate.reset();
    });

    afterEach(() => {
        MockDate.reset();
    });

    it('renders nothing when there is no selected space', () => {
        const { container } = rtlRender(<JourneySpaceDetailsView selectedSpace={null} />);

        expect(container).toBeEmptyDOMElement();
    });

    it('renders the full detail layout, favourite button, and image fallback logic', () => {
        const onBack = jest.fn();

        rtlRender(
            <JourneySpaceDetailsView
                actions={{}}
                selectedSpace={buildSpace()}
                weeklyHours={{ locations: [] }}
                showBackButton
                narrowView={false}
                verticalView={false}
                backLabel="Back to results"
                onBack={onBack}
                isFavourite
                showMap
            />,
        );

        const backButton = screen.getByRole('button', { name: 'Back to results' });
        fireEvent.click(backButton);

        expect(onBack).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('heading', { name: /Meeting room Study pod/i })).toBeInTheDocument();
        expect(screen.getByText('A quiet room for small teams.')).toBeInTheDocument();
        expect(screen.getByText('Perfect for brainstorming.')).toBeInTheDocument();
        expect(screen.getByTestId('favourite-icon')).toBeInTheDocument();
        expect(screen.getByTestId('booking-link')).toBeInTheDocument();
        expect(screen.getByTestId('spaces-map-wrapper')).toBeInTheDocument();
        expect(screen.getByTestId('bookable-spaces-map-stub')).toBeInTheDocument();
        expect(screen.getAllByTestId(/space-101-facility/).length).toBeGreaterThan(0);

        const mainImage = screen.getByRole('img');
        expect(mainImage).toHaveAttribute('src', expect.stringContaining('space-photo.jpg'));

        fireEvent.error(mainImage);

        expect(mainImage).toHaveAttribute('src', 'test-file-stub');
    });

    it('does not render the favourite icon when the favourite-state request has an error', () => {
        rtlRender(
            <JourneySpaceDetailsView
                actions={{}}
                selectedSpace={buildSpace({
                    space_name: 'Display room',
                    space_type_details: { space_type_name: 'Study room', space_type_description: 'A small room.' },
                    space_description: 'A quiet room.',
                    facility_types: [{ facility_type_id: 5, facility_type_name: 'Monitor' }],
                })}
                weeklyHours={{ locations: [] }}
                showBackButton={false}
                narrowView={false}
                verticalView={false}
                isFavourite={false}
                spacesFavouritesError
                showMap={false}
            />,
        );

        expect(screen.queryByTestId('favourite-icon')).not.toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Study room Display room/i })).toBeInTheDocument();
    });

    it('uses the default props when optional values are omitted', () => {
        rtlRender(<JourneySpaceDetailsView selectedSpace={buildSpace({ space_name: 'Default room' })} />);

        expect(screen.getByRole('button', { name: 'Back to results' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Meeting room Default room/i })).toBeInTheDocument();
        expect(screen.getByTestId('open-chip')).toBeInTheDocument();
        expect(screen.getByTestId('spaces-map-wrapper')).toBeInTheDocument();
    });

    it('renders the outage notice branch and hides the title when the mobile layout is narrow', () => {
        MockDate.set('2026-04-24T10:00:00');
        useAccountContext.mockReturnValue({ account: null });
        useMediaQuery.mockReturnValue(true);

        rtlRender(
            <JourneySpaceDetailsView
                actions={{}}
                selectedSpace={buildSpace({
                    space_name: 'Quiet room',
                    space_type_details: { space_type_name: 'Meeting room' },
                    space_description: '',
                    space_capacity: 0,
                    facility_types: [],
                    space_outages: [
                        {
                            space_outage_id: 9,
                            space_outage_start: '2026-04-24 08:00:00',
                            space_outage_end: '2026-04-24 18:00:00',
                            space_outage_reason: 'Maintenance',
                        },
                    ],
                })}
                weeklyHours={{ locations: [] }}
                showBackButton={false}
                narrowView
                verticalView={false}
                showMap={false}
            />,
        );

        expect(screen.queryByRole('button', { name: /Back to results/i })).not.toBeInTheDocument();
        expect(screen.queryByTestId('favourite-icon')).not.toBeInTheDocument();
        expect(screen.getByTestId('outage-notice')).toHaveTextContent('Current');
        expect(screen.queryByRole('heading', { name: /Meeting room Quiet room/i })).not.toBeInTheDocument();
        expect(screen.queryByTestId('spaces-map-wrapper')).not.toBeInTheDocument();
        expect(screen.queryByTestId('space-101-capacity')).not.toBeInTheDocument();
        expect(screen.queryByTestId('space-101-facility')).not.toBeInTheDocument();
    });

    it('renders the fallback image path when no photo data is available', () => {
        rtlRender(
            <JourneySpaceDetailsView
                actions={{}}
                selectedSpace={buildSpace({
                    space_photo_url: undefined,
                    space_photo_urls: [],
                    space_photos: [],
                    space_images: [],
                })}
                weeklyHours={{ locations: [] }}
                showBackButton={false}
                narrowView={false}
                verticalView
                showMap={false}
            />,
        );

        const fallbackImage = screen.getByRole('img');
        expect(fallbackImage).toHaveAttribute('alt', 'Placeholder image for this space');
        expect(fallbackImage).toHaveAttribute('src', 'test-file-stub');
    });
});
