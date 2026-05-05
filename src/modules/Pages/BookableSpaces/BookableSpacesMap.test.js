import React from 'react';
import MockDate from 'mockdate';

import { rtlRender, screen } from 'test-utils';

import { BookableSpacesMapPopupContent } from './BookableSpacesMap';

describe('BookableSpacesMapPopupContent', () => {
    afterEach(() => {
        MockDate.reset();
    });

    it('renders a current outage in the popup using UserAttention styling content', () => {
        rtlRender(
            <BookableSpacesMapPopupContent
                space={{
                    space_id: 100,
                    space_name: 'Popup room',
                    space_type_details: { space_type_name: 'Meeting room' },
                    space_external_book_url: 'https://uqbookit.uq.edu.au/#/app/booking-types/100',
                    space_outages: [
                        {
                            space_outage_id: 1,
                            space_outage_start: '2000-01-01 09:00:00',
                            space_outage_end: '2999-01-01 12:00:00',
                            space_outage_reason: 'Electrical maintenance',
                        },
                    ],
                }}
                isFavourite
            />,
        );

        expect(screen.getByTestId('space-100-map-popup')).toBeInTheDocument();
        expect(screen.getByText('Current closure')).toBeInTheDocument();
        expect(screen.getByTestId('space-100-map-popup-outage-message')).toHaveTextContent(
            'Currently unavailable until 12:00pm 1 January 2999.',
        );
        expect(screen.getByTestId('space-100-map-popup-outage-reason')).toHaveTextContent('Electrical maintenance');
        expect(screen.getByTestId('space-100-map-popup-booking-link')).toHaveAttribute(
            'href',
            'https://uqbookit.uq.edu.au/#/app/booking-types/100',
        );
        expect(screen.getByText('One of your favourite spaces')).toBeInTheDocument();
    });

    it('renders same-day current outage in popup using time then date wording', () => {
        MockDate.set('2026-04-24T09:00:00');

        rtlRender(
            <BookableSpacesMapPopupContent
                space={{
                    space_id: 102,
                    space_name: 'Popup room same day current',
                    space_type_details: { space_type_name: 'Project room' },
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

        expect(screen.getByTestId('space-102-map-popup-outage-message')).toHaveTextContent(
            'Currently unavailable until 1:00pm on 24 April 2026.',
        );
    });

    it('renders an upcoming outage in the popup when it is within the notice window', () => {
        MockDate.set('2026-04-24T10:00:00');

        rtlRender(
            <BookableSpacesMapPopupContent
                space={{
                    space_id: 101,
                    space_name: 'Popup room upcoming',
                    space_type_details: { space_type_name: 'Project room' },
                    space_outages: [
                        {
                            space_outage_id: 2,
                            space_outage_start: '2026-04-30 09:00:00',
                            space_outage_end: '2026-04-30 12:00:00',
                            space_outage_reason: 'Lift works',
                        },
                    ],
                }}
            />,
        );

        expect(screen.getByText('Upcoming closure')).toBeInTheDocument();
        expect(screen.getByTestId('space-101-map-popup-outage-message')).toHaveTextContent(
            'Closed 9:00am to 12:00pm on 30 April 2026.',
        );
        expect(screen.getByTestId('space-101-map-popup-outage-reason')).toHaveTextContent('Lift works');
    });

    it('hides times for popup upcoming outages when space_outage_show_time_public is false', () => {
        MockDate.set('2026-04-24T10:00:00');

        rtlRender(
            <BookableSpacesMapPopupContent
                space={{
                    space_id: 103,
                    space_name: 'Popup room date only',
                    space_type_details: { space_type_name: 'Project room' },
                    space_outages: [
                        {
                            space_outage_id: 5,
                            space_outage_start: '2026-04-26 08:00:00',
                            space_outage_end: '2026-05-05 14:00:00',
                            space_outage_reason: 'Replacing carpet',
                            space_outage_show_time_public: false,
                        },
                    ],
                }}
            />,
        );

        expect(screen.getByTestId('space-103-map-popup-outage-message')).toHaveTextContent(
            'Closed 26 April to 5 May 2026.',
        );
        expect(screen.getByTestId('space-103-map-popup-outage-reason')).toHaveTextContent('Replacing carpet');
    });
});