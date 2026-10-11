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
        jest.restoreAllMocks();
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

    it('uses default coordinates when no campus centre is provided and delegates other fetches to the original fetch', async () => {
        const originalFetchMock = jest.fn(() =>
            Promise.resolve(
                new Response(JSON.stringify({ ok: true }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                }),
            ),
        );
        window.fetch = originalFetchMock;

        rtlRender(<CampusLocationMap />);

        const scriptElement = document.body.querySelector('script[src*="mazemap.min.js"]');
        act(() => {
            scriptElement.onload();
        });

        await waitFor(() => {
            expect(window.Mazemap.Map).toHaveBeenCalledWith(
                expect.objectContaining({
                    center: { lng: 153.01329, lat: -27.49751 },
                    zoom: 15,
                }),
            );
        });

        const response = await window.fetch('https://example.com/other');
        expect(originalFetchMock).toHaveBeenCalledWith('https://example.com/other');
        expect(await response.json()).toEqual({ ok: true });
    });

    it('keeps the reset button hidden when the map is still near its initial centre', async () => {
        rtlRender(<CampusLocationMap campusCentre={{ campus_latitude: -27.5, campus_longitude: 153.0 }} />);

        const scriptElement = document.body.querySelector('script[src*="mazemap.min.js"]');
        act(() => {
            scriptElement.onload();
        });

        await waitFor(() => {
            expect(latestMapInstance).not.toBeNull();
        });

        latestMapInstance.getCenter.mockReturnValue({ lng: 153.0, lat: -27.5 });
        act(() => {
            latestMapInstance.listeners.moveend();
        });

        expect(screen.queryByTestId('reset-map-position-button')).not.toBeInTheDocument();
    });

    it('keeps the map reset safe when the map centre or initial view is unavailable', async () => {
        const mazeMapInstanceRef = { current: null };
        const markerRef = { current: null };
        const initialViewRef = { current: { lng: 153.0, lat: -27.5, zoom: 15, zLevel: 1 } };

        let refCallCount = 0;
        jest.spyOn(React, 'useRef').mockImplementation(() => {
            refCallCount += 1;
            if (refCallCount % 3 === 1) return mazeMapInstanceRef;
            if (refCallCount % 3 === 2) return markerRef;
            return initialViewRef;
        });

        rtlRender(<CampusLocationMap campusCentre={{ campus_latitude: -27.5, campus_longitude: 153.0 }} />);

        const scriptElement = document.body.querySelector('script[src*="mazemap.min.js"]');
        act(() => {
            scriptElement.onload();
        });

        await waitFor(() => {
            expect(mazeMapInstanceRef.current).not.toBeNull();
        });

        const map = mazeMapInstanceRef.current;
        map.getCenter.mockReturnValue(undefined);
        act(() => {
            map.listeners.moveend();
        });
        expect(screen.queryByTestId('reset-map-position-button')).not.toBeInTheDocument();

        map.getCenter.mockReturnValue({ lng: 153.25, lat: -27.3 });
        act(() => {
            map.listeners.moveend();
        });

        const resetButton = await screen.findByTestId('reset-map-position-button');
        expect(resetButton).toBeInTheDocument();

        mazeMapInstanceRef.current = null;
        fireEvent.click(resetButton);
        expect(screen.getByTestId('reset-map-position-button')).toBeInTheDocument();

        mazeMapInstanceRef.current = map;
        initialViewRef.current = null;
        fireEvent.click(screen.getByTestId('reset-map-position-button'));
        expect(screen.getByTestId('reset-map-position-button')).toBeInTheDocument();

        initialViewRef.current = { lng: 153.0, lat: -27.5, zoom: 15, zLevel: Number.NaN };
        map.flyTo.mockClear();
        map.setZLevel.mockClear();

        fireEvent.click(screen.getByTestId('reset-map-position-button'));
        expect(map.flyTo).toHaveBeenCalledWith({ center: [153.0, -27.5], zoom: 15 });
        expect(map.setZLevel).not.toHaveBeenCalled();
        expect(screen.queryByTestId('reset-map-position-button')).not.toBeInTheDocument();
    });

    it('ignores map clicks when the campus coordinate inputs are not present', async () => {
        rtlRender(<CampusLocationMap campusCentre={{ campus_latitude: -27.5, campus_longitude: 153.0 }} />);

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

        expect(() => {
            latestMapInstance.listeners.click({ lngLat: { lng: 153.21, lat: -27.12 } });
        }).not.toThrow();
    });
});
