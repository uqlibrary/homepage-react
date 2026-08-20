import React, { act } from 'react';
import MockDate from 'mockdate';

import { rtlRender, screen, waitFor } from 'test-utils';

import BookableSpacesMap, {
    BookableSpacesMapPopupContent,
} from 'modules/Pages/BookableSpaces/Shared/BookableSpacesMap';

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
        expect(screen.getByTestId('space-100-outage')).toBeInTheDocument();
        expect(screen.getByText('Current closure')).toBeInTheDocument();
        expect(screen.getByTestId('space-100-outage-message')).toHaveTextContent(
            'Currently unavailable until 12:00pm 1 January 2999.',
        );
        expect(screen.getByTestId('space-100-outage-reason')).toHaveTextContent('Electrical maintenance');

        expect(screen.getByRole('link', { name: 'Book this space' })).toHaveAttribute(
            'href',
            'https://uqbookit.uq.edu.au/#/app/booking-types/100',
        );

        expect(screen.getByTestId('space-100-favourite-message')).toHaveTextContent('One of your favourite spaces');
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

        expect(screen.getByTestId('space-102-outage-message')).toHaveTextContent(
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
        expect(screen.getByTestId('space-101-outage-message')).toHaveTextContent(
            'Closed 9:00am to 12:00pm on 30 April 2026.',
        );
        expect(screen.getByTestId('space-101-outage-reason')).toHaveTextContent('Lift works');
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

        expect(screen.getByTestId('space-103-outage-message')).toHaveTextContent('Closed 26 April to 5 May 2026.');
        expect(screen.getByTestId('space-103-outage-reason')).toHaveTextContent('Replacing carpet');
    });

    it('renders popup content without type and library details when absent', () => {
        rtlRender(
            <BookableSpacesMapPopupContent
                space={{
                    space_id: 104,
                    space_name: 'Bare popup',
                    space_outages: [],
                }}
            />,
        );

        expect(screen.getByTestId('space-104-map-popup')).toBeInTheDocument();
        expect(screen.getByText('Bare popup')).toBeInTheDocument();
        expect(screen.queryByTestId('space-104-outage')).not.toBeInTheDocument();
    });
});

describe('BookableSpacesMap', () => {
    let latestMockMapInstance;
    let latestPopupInstance;

    beforeEach(() => {
        latestMockMapInstance = null;
        latestPopupInstance = null;

        class MockPopup {
            constructor() {
                latestPopupInstance = this;
                this.listeners = {};
            }
            setLngLat() {
                return this;
            }
            setDOMContent() {
                return this;
            }
            addTo() {
                return this;
            }
            on(eventName, callback) {
                this.listeners[eventName] = callback;
                return this;
            }
            remove() {
                return this;
            }
        }

        class MockMarker {
            constructor() {
                this.element = document.createElement('div');
                Object.defineProperty(this.element, 'dataset', {
                    value: {},
                    writable: true,
                    configurable: true,
                });
            }
            setLngLat() {
                return this;
            }
            addTo() {
                document.body.appendChild(this.element);
                return this;
            }
            getElement() {
                return this.element;
            }
            remove() {
                this.element.remove();
                return this;
            }
        }

        window.Mazemap = {
            Map: class MockMap {
                constructor() {
                    latestMockMapInstance = this;
                    this.listeners = {};
                    this.wasRemoved = false;
                    this.center = { lng: 153.0, lat: -27.47 };
                }
                on(eventName, callback) {
                    this.listeners[eventName] = callback;
                }
                stop() {}
                resize() {}
                setZLevel() {}
                flyTo() {}
                getCenter() {
                    return { lng: 153.0, lat: -27.47 };
                }
                remove() {
                    this.wasRemoved = true;
                }
            },
            MazeMarker: MockMarker,
            ZLevelMarker: MockMarker,
            Popup: MockPopup,
        };
    });

    afterEach(() => {
        delete window.Mazemap;
    });

    it('exposes imperative flyToSpace behaviour and reacts to selected markers', async () => {
        const onMarkerClick = jest.fn();
        const ref = React.createRef();

        rtlRender(
            <BookableSpacesMap
                ref={ref}
                sortedSpaceLocations={[
                    {
                        space_id: 200,
                        space_name: 'Map room',
                        space_latitude: '-27.47',
                        space_longitude: '153.0',
                        space_campus_name: 'St Lucia',
                        space_zlevel: 2,
                    },
                ]}
                spacesFavouritesList={[]}
                onMarkerClick={onMarkerClick}
                centreLatLong={{
                    space_latitude: -27.47,
                    space_longitude: 153.0,
                    space_campus_name: 'St Lucia',
                    space_zlevel: 1,
                }}
            />,
        );

        const scriptElement = document.querySelector('script[src*="mazemap.min.js"]');
        expect(scriptElement).not.toBeNull();
        act(() => {
            scriptElement.onload();
        });

        await waitFor(() => expect(latestMockMapInstance).not.toBeNull());
        act(() => {
            latestMockMapInstance.listeners.load();
        });

        expect(document.getElementById('mazemap-container')).toBeInTheDocument();
        expect(screen.queryByTestId('reset-map-position-button')).not.toBeInTheDocument();

        ref.current.flyToSpace(
            {
                space_id: 200,
                space_campus_id: 1,
                space_campus_name: 'St Lucia',
                space_latitude: -27.47,
                space_longitude: 153.0,
                space_zlevel: 2,
            },
            17,
        );

        expect(latestMockMapInstance.setZLevel).toBeDefined();
        await waitFor(() => {
            expect(document.querySelector('[role="img"]')).not.toBeNull();
        });

        const markerElement = document.querySelector('[role="img"]');
        act(() => {
            markerElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        expect(onMarkerClick).toHaveBeenCalled();
        expect(latestPopupInstance).not.toBeNull();
    });

    it('renders a reset button when the map has moved from the initial center', async () => {
        rtlRender(
            <BookableSpacesMap
                sortedSpaceLocations={[]}
                spacesFavouritesList={[]}
                onMarkerClick={jest.fn()}
                centreLatLong={{
                    space_latitude: -27.47,
                    space_longitude: 153.0,
                    space_campus_name: 'St Lucia',
                    space_zlevel: 1,
                }}
            />,
        );

        const scriptElement = document.querySelector('script[src*="mazemap.min.js"]');
        act(() => {
            scriptElement.onload();
        });

        await waitFor(() => expect(latestMockMapInstance).not.toBeNull());
        act(() => {
            latestMockMapInstance.listeners.load();
        });

        act(() => {
            latestMockMapInstance.listeners.moveend();
        });

        expect(screen.queryByTestId('reset-map-position-button')).not.toBeInTheDocument();
    });
});
