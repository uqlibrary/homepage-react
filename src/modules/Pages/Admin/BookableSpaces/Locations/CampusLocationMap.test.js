import React from 'react';

import { fireEvent, waitFor } from '@testing-library/react';

import { act, rtlRender, screen } from 'test-utils';

import CampusLocationMap from './CampusLocationMap';

describe('CampusLocationMap', () => {
    const originalFetch = window.fetch;
    let latestMapInstance;

    const createMapInstance = () => {
        const listeners = {};
        const map = {
            listeners,
            on: jest.fn((eventName, callback) => {
                listeners[eventName] = callback;
                return map;
            }),
            flyTo: jest.fn(),
            resize: jest.fn(),
            remove: jest.fn(),
            setZLevel: jest.fn(),
            getCenter: jest.fn(() => ({ lng: 153.0, lat: -27.5 })),
            zLevel: 1,
        };
        latestMapInstance = map;
        return map;
    };

    beforeEach(() => {
        latestMapInstance = null;
        global.Response = class MockResponse {
            constructor(body, init = {}) {
                this.body = body;
                this.status = init.status || 200;
                this.headers = init.headers || {};
            }
            json() {
                return JSON.parse(this.body);
            }
        };
        window.Mazemap = {
            Map: jest.fn(() => createMapInstance()),
            ZLevelMarker: jest.fn().mockImplementation((element, options) => ({
                element,
                options,
                setLngLat: jest.fn().mockReturnThis(),
                addTo: jest.fn().mockReturnThis(),
                remove: jest.fn(),
            })),
        };
        window.fetch = jest.fn(() =>
            Promise.resolve(
                new Response(JSON.stringify({ campuses: [] }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                }),
            ),
        );
    });

    afterEach(() => {
        window.fetch = originalFetch;
        delete window.Mazemap;
        delete global.Response;
    });

    it('loads the MazeMap script and initialises the map with the supplied campus centre', async () => {
        rtlRender(<CampusLocationMap campusCentre={{ campus_latitude: -27.1, campus_longitude: 153.2 }} />);

        const scriptElement = document.body.querySelector('script[src*="mazemap.min.js"]');
        expect(scriptElement).not.toBeNull();
        expect(scriptElement.type).toBe('text/javascript');

        act(() => {
            scriptElement.onload();
        });

        await waitFor(() => {
            expect(window.Mazemap.Map).toHaveBeenCalled();
        });

        expect(window.Mazemap.Map).toHaveBeenCalledWith(
            expect.objectContaining({
                campuses: 'uq',
                center: { lng: 153.2, lat: -27.1 },
                zoom: 15,
            }),
        );
    });

    it('shows the reset button when the map moves away from the initial centre and resets it on click', async () => {
        rtlRender(<CampusLocationMap campusCentre={{ campus_latitude: -27.5, campus_longitude: 153.0 }} />);

        const scriptElement = document.body.querySelector('script[src*="mazemap.min.js"]');
        act(() => {
            scriptElement.onload();
        });

        await waitFor(() => {
            expect(latestMapInstance).not.toBeNull();
        });

        latestMapInstance.getCenter.mockReturnValue({ lng: 153.25, lat: -27.3 });
        act(() => {
            latestMapInstance.listeners.moveend();
        });

        await waitFor(() => {
            expect(screen.getByTestId('reset-map-position-button')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('reset-map-position-button'));

        expect(latestMapInstance.flyTo).toHaveBeenCalledWith({ center: [153.0, -27.5], zoom: 15 });
        expect(latestMapInstance.setZLevel).toHaveBeenCalledWith(1);
    });

    it('updates the campus coordinate fields when a user clicks on the map and intercepts MazeMap API traffic', async () => {
        rtlRender(<CampusLocationMap campusCentre={{ campus_latitude: -27.5, campus_longitude: 153.0 }} />);

        const latitudeField = document.createElement('input');
        latitudeField.id = 'campus_latitude';
        latitudeField.value = '-27.5';
        document.body.appendChild(latitudeField);

        const longitudeField = document.createElement('input');
        longitudeField.id = 'campus_longitude';
        longitudeField.value = '153.0';
        document.body.appendChild(longitudeField);

        const scriptElement = document.body.querySelector('script[src*="mazemap.min.js"]');
        act(() => {
            scriptElement.onload();
        });

        await waitFor(() => {
            expect(latestMapInstance).not.toBeNull();
        });

        act(() => {
            latestMapInstance.listeners.load();
        });

        act(() => {
            latestMapInstance.listeners.click({ lngLat: { lng: 153.21, lat: -27.12 } });
        });

        expect(latitudeField.value).toBe('-27.12');
        expect(longitudeField.value).toBe('153.21');

        const mockedApiResponse = await window.fetch('https://api.mazemap.com/test?campus=uq');
        const payload = await mockedApiResponse.json();
        expect(payload).toEqual({ campuses: [] });
    });
});
