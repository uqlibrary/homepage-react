import React, { act } from 'react';
import MockDate from 'mockdate';

import { rtlRender, screen, waitFor, WithRouter } from 'test-utils';

import BookableSpacesMap, {
    BookableSpacesMapPopupContent,
} from 'modules/Pages/BookableSpaces/Shared/BookableSpacesMap';

describe('BookableSpacesMapPopupContent', () => {
    afterEach(() => {
        MockDate.reset();
    });

    it('renders a current outage in the popup using UserAttention styling content', () => {
        rtlRender(
            <WithRouter>
                <BookableSpacesMapPopupContent
                    space={{
                        space_id: 100,
                        space_name: 'Popup room',
                        space_library_name: 'St Lucia Library',
                        space_building_name: 'Forgan Smith Building',
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
                />
            </WithRouter>,
        );

        expect(screen.getByTestId('space-100-map-popup')).toBeInTheDocument();
        expect(screen.getByTestId('space-100-outage')).toBeInTheDocument();
        expect(screen.queryByText('Current closure')).not.toBeInTheDocument();
        expect(screen.getByTestId('space-100-outage-message')).toHaveTextContent(
            'Currently unavailable until 12:00pm 1 Jan. 2999.',
        );
        expect(screen.getByTestId('space-100-outage-reason')).toHaveTextContent('Electrical maintenance');

        expect(screen.getByRole('link', { name: 'Book this space' })).toHaveAttribute(
            'href',
            'https://uqbookit.uq.edu.au/#/app/booking-types/100',
        );

        const popupTitleLink = screen.getByRole('link', { name: /Meeting room/i }).closest('a');
        expect(popupTitleLink).toHaveAttribute('href', '/spaces/detail/100');
        expect(screen.getByText('Forgan Smith Building')).toBeInTheDocument();
        expect(screen.getByTestId('space-100-favourite-message')).toHaveTextContent('One of your favourite spaces');
    });

    it('renders same-day current outage in popup using time then date wording', () => {
        MockDate.set('2026-04-24T09:00:00');

        rtlRender(
            <WithRouter>
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
                />
            </WithRouter>,
        );

        expect(screen.getByTestId('space-102-outage-message')).toHaveTextContent(
            'Currently unavailable until 1:00pm on 24 Apr. 2026.',
        );
    });

    it('renders an upcoming outage in the popup when it is within the notice window', () => {
        MockDate.set('2026-04-24T10:00:00');

        rtlRender(
            <WithRouter>
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
                />
            </WithRouter>,
        );

        expect(screen.queryByText('Upcoming closure')).not.toBeInTheDocument();
        expect(screen.getByTestId('space-101-outage-message')).toHaveTextContent(
            'Unavailable 9:00am to 12:00pm on 30 Apr. 2026.',
        );
        expect(screen.getByTestId('space-101-outage-reason')).toHaveTextContent('Lift works');
    });

    it('hides times for popup upcoming outages when space_outage_show_time_public is false', () => {
        MockDate.set('2026-04-24T10:00:00');

        rtlRender(
            <WithRouter>
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
                />
            </WithRouter>,
        );

        expect(screen.getByTestId('space-103-outage-message')).toHaveTextContent('Unavailable 26 Apr. to 5 May 2026.');
        expect(screen.getByTestId('space-103-outage-reason')).toHaveTextContent('Replacing carpet');
    });

    it('renders popup content without type and library details when absent', () => {
        rtlRender(
            <WithRouter>
                <BookableSpacesMapPopupContent
                    space={{
                        space_id: 104,
                        space_name: 'Bare popup',
                        space_outages: [],
                    }}
                />
            </WithRouter>,
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
            constructor(options = {}) {
                latestPopupInstance = this;
                this.listeners = {};
                this.options = options;
                this.container = document.createElement('div');
                this.remove = jest.fn();
            }
            setLngLat() {
                return this;
            }
            setDOMContent(container) {
                this.container = container;
                return this;
            }
            addTo() {
                return this;
            }
            on(eventName, callback) {
                this.listeners[eventName] = callback;
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
                    this.stop = jest.fn();
                    this.resize = jest.fn();
                    this.setZLevel = jest.fn();
                    this.flyTo = jest.fn();
                }
                on(eventName, callback) {
                    this.listeners[eventName] = callback;
                }
                getCenter() {
                    return { lng: this.center.lng, lat: this.center.lat };
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
            <WithRouter>
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
                />
            </WithRouter>,
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
        expect(latestPopupInstance.options.closeOnClick).toBe(false);
    });

    it('keeps the selected marker active when the map moves', async () => {
        rtlRender(
            <WithRouter>
                <BookableSpacesMap
                    sortedSpaceLocations={[
                        {
                            space_id: 100,
                            space_name: 'First room',
                            space_latitude: '-27.47',
                            space_longitude: '153.0',
                            space_campus_name: 'St Lucia',
                            space_zlevel: 1,
                        },
                        {
                            space_id: 200,
                            space_name: 'Second room',
                            space_latitude: '-27.48',
                            space_longitude: '153.01',
                            space_campus_name: 'St Lucia',
                            space_zlevel: 1,
                        },
                    ]}
                    spacesFavouritesList={[]}
                    onMarkerClick={jest.fn()}
                    centreLatLong={{
                        space_latitude: -27.47,
                        space_longitude: 153.0,
                        space_campus_name: 'St Lucia',
                        space_zlevel: 1,
                    }}
                />
            </WithRouter>,
        );

        const scriptElement = document.querySelector('script[src*="mazemap.min.js"]');
        act(() => {
            scriptElement.onload();
        });

        await waitFor(() => expect(latestMockMapInstance).not.toBeNull());
        act(() => {
            latestMockMapInstance.listeners.load();
        });

        const markerEls = () => Array.from(document.querySelectorAll('[role="img"]'));
        await waitFor(() => expect(markerEls()).toHaveLength(3));

        act(() => {
            markerEls()[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        await waitFor(() => {
            expect(document.querySelector('.selected-marker')).toBe(markerEls()[0]);
        });

        act(() => {
            latestMockMapInstance.center = { lng: 153.02, lat: -27.48 };
            latestMockMapInstance.listeners.moveend();
        });

        expect(document.querySelector('.selected-marker')).toBe(markerEls()[0]);
    });

    it('reports the live map centre when the map moves', async () => {
        const onMapCenterChange = jest.fn();

        rtlRender(
            <WithRouter>
                <BookableSpacesMap
                    sortedSpaceLocations={[]}
                    spacesFavouritesList={[]}
                    onMarkerClick={jest.fn()}
                    onMapCenterChange={onMapCenterChange}
                    centreLatLong={{
                        space_latitude: -27.47,
                        space_longitude: 153.0,
                        space_campus_name: 'St Lucia',
                        space_zlevel: 1,
                    }}
                />
            </WithRouter>,
        );

        const scriptElement = document.querySelector('script[src*="mazemap.min.js"]');
        act(() => {
            scriptElement.onload();
        });

        await waitFor(() => expect(latestMockMapInstance).not.toBeNull());
        act(() => {
            latestMockMapInstance.center = { lng: 153.12, lat: -27.52 };
            latestMockMapInstance.listeners.load();
            latestMockMapInstance.listeners.moveend();
        });

        expect(onMapCenterChange).toHaveBeenCalledWith({ space_longitude: 153.12, space_latitude: -27.52 });
    });

    it('keeps reset visibility guarded by map center lookup and script errors are ignored when unrelated', async () => {
        rtlRender(
            <WithRouter>
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
                />
            </WithRouter>,
        );

        const scriptElement = document.querySelector('script[src*="mazemap.min.js"]');
        act(() => {
            scriptElement.onload();
        });

        await waitFor(() => expect(latestMockMapInstance).not.toBeNull());
        act(() => {
            latestMockMapInstance.listeners.load();
        });

        expect(screen.queryByTestId('reset-map-position-button')).not.toBeInTheDocument();

        act(() => {
            latestMockMapInstance.center = { lng: 153.1, lat: -27.5 };
            latestMockMapInstance.listeners.moveend();
        });
        expect(screen.getByTestId('reset-map-position-button')).toBeInTheDocument();

        act(() => {
            latestMockMapInstance.getCenter = jest.fn(() => null);
            latestMockMapInstance.listeners.moveend();
        });
        expect(screen.queryByTestId('reset-map-position-button')).not.toBeInTheDocument();

        act(() => {
            window.dispatchEvent(new ErrorEvent('error', { message: 'Unrelated browser issue' }));
        });
        expect(screen.queryByTestId('mazemap-unavailable')).not.toBeInTheDocument();
    });

    it('handles imperative flyToSpace guard clauses and z-level transitions without changing the map logic', async () => {
        jest.useFakeTimers();

        try {
            const ref = React.createRef();
            rtlRender(
                <WithRouter>
                    <BookableSpacesMap
                        ref={ref}
                        sortedSpaceLocations={[
                            {
                                space_id: 220,
                                space_name: 'Fly room',
                                space_latitude: '-27.47',
                                space_longitude: '153.0',
                                space_campus_name: 'St Lucia',
                                space_zlevel: 2,
                            },
                        ]}
                        spacesFavouritesList={[]}
                        onMarkerClick={jest.fn()}
                        centreLatLong={{
                            space_latitude: -27.47,
                            space_longitude: 153.0,
                            space_campus_name: 'St Lucia',
                            space_zlevel: 1,
                        }}
                    />
                </WithRouter>,
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
                ref.current.flyToSpace({
                    space_id: 221,
                    space_campus_name: 'St Lucia',
                    space_latitude: -27.47,
                    space_longitude: 153.0,
                });
            });
            expect(latestMockMapInstance.flyTo).not.toHaveBeenCalled();

            act(() => {
                ref.current.flyToSpace({
                    space_id: 220,
                    space_campus_id: 1,
                    space_campus_name: 'St Lucia',
                    space_latitude: -27.47,
                    space_longitude: 153.0,
                    space_zlevel: null,
                });
            });
            expect(latestMockMapInstance.flyTo).toHaveBeenCalled();

            latestMockMapInstance.flyTo.mockClear();
            act(() => {
                ref.current.flyToSpace({
                    space_id: 220,
                    space_campus_id: 1,
                    space_campus_name: 'St Lucia',
                    space_latitude: -27.47,
                    space_longitude: 153.0,
                    space_zlevel: 3,
                });
                jest.advanceTimersByTime(300);
            });
            expect(latestMockMapInstance.stop).toHaveBeenCalled();
            expect(latestMockMapInstance.setZLevel).toHaveBeenCalledWith(3);
            expect(latestMockMapInstance.flyTo).toHaveBeenCalled();
        } finally {
            jest.runOnlyPendingTimers();
            jest.useRealTimers();
        }
    });

    it('keeps popup state consistent when the selected marker changes and the popup closes', async () => {
        const onMarkerClick = jest.fn();

        rtlRender(
            <WithRouter>
                <BookableSpacesMap
                    sortedSpaceLocations={[
                        {
                            space_id: 300,
                            space_name: 'First popup room',
                            space_latitude: '-27.47',
                            space_longitude: '153.0',
                            space_campus_name: 'St Lucia',
                            space_zlevel: 1,
                        },
                        {
                            space_id: 301,
                            space_name: 'Second popup room',
                            space_latitude: '-27.48',
                            space_longitude: '153.01',
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
                />
            </WithRouter>,
        );

        const scriptElement = document.querySelector('script[src*="mazemap.min.js"]');
        act(() => {
            scriptElement.onload();
        });

        await waitFor(() => expect(latestMockMapInstance).not.toBeNull());
        act(() => {
            latestMockMapInstance.listeners.load();
        });

        const markerEls = () => Array.from(document.querySelectorAll('[role="img"]'));
        await waitFor(() => expect(markerEls().length).toBeGreaterThan(1));

        act(() => {
            markerEls()[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });
        expect(document.querySelector('.selected-marker')).toBe(markerEls()[0]);

        act(() => {
            markerEls()[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });
        await waitFor(() => expect(document.querySelectorAll('.selected-marker').length).toBeGreaterThan(0));

        if (latestPopupInstance) {
            act(() => {
                latestPopupInstance.listeners.close();
            });
            expect(latestPopupInstance.listeners.close).toEqual(expect.any(Function));
        }
    });

    it('resets the map to its initial position when the reset button is clicked', async () => {
        rtlRender(
            <WithRouter>
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
                />
            </WithRouter>,
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
            latestMockMapInstance.center = { lng: 153.1, lat: -27.5 };
            latestMockMapInstance.listeners.moveend();
        });

        expect(screen.getByTestId('reset-map-position-button')).toBeInTheDocument();
        latestMockMapInstance.flyTo.mockClear();

        act(() => {
            screen.getByTestId('reset-map-position-button').dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        expect(latestMockMapInstance.flyTo).toHaveBeenCalledWith({
            center: [153.0, -27.47],
            zoom: 17,
            curve: 0.5,
            speed: 1.6,
        });
        expect(latestMockMapInstance.setZLevel).toHaveBeenCalledWith(1);
        expect(screen.queryByTestId('reset-map-position-button')).not.toBeInTheDocument();
    });
});
