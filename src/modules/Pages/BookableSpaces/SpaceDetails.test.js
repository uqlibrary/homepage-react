import React from 'react';
import MockDate from 'mockdate';

import { rtlRender, screen } from 'test-utils';

jest.mock(
    '../../../../public/images/spaces/hero-jk-murray-library-gatton-students-outdoor-study.jpg',
    () => 'mock-journey-hero-image',
);
jest.mock('../../../../public/images/digital-learning-hub-hero-shot-wide.png', () => 'mock-journey-detail-image');

import SpaceDetails from './SpaceDetails';

describe('SpaceDetails outage notices', () => {
    afterEach(() => {
        MockDate.reset();
    });

    const baseProps = {
        weeklyHours: [],
        weeklyHoursLoading: false,
        weeklyHoursError: null,
        collapsed: false,
        isExpanded: true,
        onToggle: jest.fn(),
        isSelectedSpaceFavourite: false,
    };

    it('renders a red current outage notice and keeps booking link', () => {
        rtlRender(
            <SpaceDetails
                {...baseProps}
                isFavouriteActionInProgress={false}
                bookableSpace={{
                    space_id: 123,
                    space_name: 'Current outage room',
                    space_type_details: { space_type_description: 'A quiet room' },
                    space_external_book_url: 'https://example.com/book',
                    space_outages: [
                        {
                            space_outage_id: 1,
                            space_outage_start: '2000-01-01 09:00:00',
                            space_outage_end: '2999-01-01 10:00:00',
                            space_outage_reason: 'Electrical maintenance',
                        },
                    ],
                }}
            />,
        );

        expect(screen.getByText('Current closure')).toBeInTheDocument();
        expect(screen.getByTestId('space-123-outage-message')).toHaveTextContent(
            'Currently unavailable until 10:00am 1 January 2999.',
        );
        expect(screen.getByTestId('space-123-outage-reason')).toHaveTextContent('Electrical maintenance');
        expect(screen.getByRole('link', { name: /book this space/i })).toBeInTheDocument();
    });

    it('renders same-day current outage using time then date wording', () => {
        MockDate.set('2026-04-24T09:00:00');

        rtlRender(
            <SpaceDetails
                {...baseProps}
                bookableSpace={{
                    space_id: 124,
                    space_name: 'Current outage same day room',
                    space_type_details: { space_type_description: 'A quiet room' },
                    space_external_book_url: 'https://example.com/book',
                    space_outages: [
                        {
                            space_outage_id: 3,
                            space_outage_start: '2026-04-24 08:00:00',
                            space_outage_end: '2026-04-24 13:00:00',
                            space_outage_reason: 'Power works',
                        },
                    ],
                }}
            />,
        );

        expect(screen.getByTestId('space-124-outage-message')).toHaveTextContent(
            'Currently unavailable until 1:00pm on 24 April 2026.',
        );
    });

    it('renders a yellow upcoming outage notice for outages within a week', () => {
        MockDate.set('2026-04-24T10:00:00');

        rtlRender(
            <SpaceDetails
                {...baseProps}
                bookableSpace={{
                    space_id: 456,
                    space_name: 'Upcoming outage room',
                    space_type_details: { space_type_description: 'A project room' },
                    space_external_book_url: 'https://example.com/book',
                    space_outages: [
                        {
                            space_outage_id: 2,
                            space_outage_start: '2026-04-30 09:00:00',
                            space_outage_end: '2026-04-30 17:00:00',
                            space_outage_reason: 'Air conditioning works',
                        },
                    ],
                }}
            />,
        );

        expect(screen.getByText('Upcoming closure')).toBeInTheDocument();
        expect(screen.getByTestId('space-456-outage-message')).toHaveTextContent(
            'Closed 9:00am to 5:00pm on 30 April 2026.',
        );
        expect(screen.getByTestId('space-456-outage-reason')).toHaveTextContent('Air conditioning works');
        expect(screen.getByRole('link', { name: /book this space/i })).toBeInTheDocument();
    });

    it('hides times for upcoming outages when space_outage_show_time_public is false', () => {
        MockDate.set('2026-04-24T10:00:00');

        rtlRender(
            <SpaceDetails
                {...baseProps}
                bookableSpace={{
                    space_id: 457,
                    space_name: 'Upcoming outage room date only',
                    space_type_details: { space_type_description: 'A project room' },
                    space_external_book_url: 'https://example.com/book',
                    space_outages: [
                        {
                            space_outage_id: 4,
                            space_outage_start: '2026-04-26 08:00:00',
                            space_outage_end: '2026-05-05 14:00:00',
                            space_outage_reason: 'Replacing carpet',
                            space_outage_show_time_public: false,
                        },
                    ],
                }}
            />,
        );

        expect(screen.getByTestId('space-457-outage-message')).toHaveTextContent('Closed 26 April to 5 May 2026.');
        expect(screen.getByTestId('space-457-outage-reason')).toHaveTextContent('Replacing carpet');
    });
});
