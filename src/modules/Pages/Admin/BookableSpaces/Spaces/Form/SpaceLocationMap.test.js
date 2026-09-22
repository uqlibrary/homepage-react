import React from 'react';

import { fireEvent, waitFor } from '@testing-library/react';

import { act, rtlRender, screen } from 'test-utils';

import SpaceLocationMap from './SpaceLocationMap';

describe('SpaceLocationMap', () => {
    const createMapInstance = () => {
        const listeners = {};
        const map = {
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
            __trigger(eventName, payload) {
                if (listeners[eventName]) {
                    listeners[eventName](payload);
                }
            },
        };
        return map;
    };

    beforeEach(() => {
        window.Mazemap = {
            Map: jest.fn(() => createMapInstance()),
            ZLevelMarker: jest.fn().mockImplementation((element, options) => ({
                element,
                options,
                setLngLat: jest.fn().mockReturnThis(),
                addTo: jest.fn().mockReturnThis(),
                remove: jest.fn(),
            })),
            Popup: jest.fn().mockImplementation(() => ({
                setLngLat: jest.fn().mockReturnThis(),
                setText: jest.fn().mockReturnThis(),
                addTo: jest.fn().mockReturnThis(),
                remove: jest.fn(),
            })),
        };
    });

    it('loads the map, uses fallback coordinates, handles reset and map-click updates, and covers popup hover behavior', async () => {
        const setFormValues = jest.fn();

        rtlRender(
            <SpaceLocationMap
                formValues={{ space_id: 1, space_zlevel: 'bad-value' }}
                setFormValues={setFormValues}
                campusCoordinateList={[
                    { campus_id: 1, campus_name: 'St Lucia', campus_longitude: 153.0, campus_latitude: -27.5 },
                    { campus_id: 2, campus_name: 'Gatton', campus_longitude: 152.3, campus_latitude: -27.5 },
                ]}
                bookableSpacesRoomList={{
                    data: {
                        locations: [
                            {
                                space_id: 99,
                                space_name: 'Other room',
                                space_latitude: -27.45,
                                space_longitude: 152.95,
                                space_type_details: undefined,
                            },
                        ],
                    },
                }}
            />,
        );

        const scriptElement = document.body.querySelector('script[src*="mazemap.min.js"]');
        act(() => {
            scriptElement.onload();
        });

        await waitFor(() => {
            expect(window.Mazemap.Map).toHaveBeenCalled();
        });

        const map = window.Mazemap.Map.mock.results.at(-1).value;

        act(() => {
            map.__trigger('load');
        });

        expect(window.Mazemap.Map).toHaveBeenCalledWith(
            expect.objectContaining({
                center: { lng: 153.01329, lat: -27.49751 },
                zLevel: 'bad-value',
                zoom: 17,
            }),
        );

        act(() => {
            map.getCenter.mockReturnValue({ lng: 153.2, lat: -27.3 });
            map.__trigger('moveend');
        });

        await waitFor(() => {
            expect(screen.getByTestId('reset-map-position-button')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('reset-map-position-button'));
        expect(map.flyTo).toHaveBeenCalledWith({ center: [153.01329, -27.49751], zoom: 17 });
        expect(map.setZLevel).not.toHaveBeenCalled();

        act(() => {
            map.__trigger('click', { lngLat: { lng: 153.2, lat: -27.6 } });
        });

        expect(setFormValues).toHaveBeenCalled();
        const clickCallback = setFormValues.mock.calls.at(-1)[0];
        expect(clickCallback({ space_id: 1, space_zlevel: 2 })).toEqual(
            expect.objectContaining({ space_latitude: -27.6, space_longitude: 153.2, space_zlevel: 1 }),
        );

        act(() => {
            map.__trigger('zlevel', { zLevel: 4 });
        });

        const zLevelCallback = setFormValues.mock.calls.at(-1)[0];
        expect(zLevelCallback({ space_id: 1, space_zlevel: 2 })).toEqual(
            expect.objectContaining({ space_zlevel: 4 }),
        );

        const popupInstance = window.Mazemap.Popup.mock.results[0].value;
        const markerElement = window.Mazemap.ZLevelMarker.mock.calls[1][0];

        fireEvent.mouseEnter(markerElement);
        expect(popupInstance.setText).toHaveBeenCalledWith('Other room - undefined');
        expect(popupInstance.addTo).toHaveBeenCalledWith(map);

        fireEvent.mouseLeave(markerElement);
        expect(popupInstance.remove).toHaveBeenCalled();
    });

    it('covers the valid reset zLevel path and nullish map/fallback cases', async () => {
        const setFormValues = jest.fn();

        rtlRender(
            <SpaceLocationMap
                formValues={{ space_id: 7, space_zlevel: 3 }}
                setFormValues={setFormValues}
                campusCoordinateList={[
                    { campus_id: 1, campus_name: 'St Lucia', campus_longitude: 153.0, campus_latitude: -27.5 },
                    { campus_id: 2, campus_name: 'Gatton', campus_longitude: 152.3, campus_latitude: -27.5 },
                ]}
                bookableSpacesRoomList={{ data: { locations: [] } }}
            />,
        );

        const scriptElement = document.body.querySelector('script[src*="mazemap.min.js"]');
        act(() => {
            scriptElement.onload();
        });

        await waitFor(() => {
            expect(window.Mazemap.Map).toHaveBeenCalled();
        });

        const map = window.Mazemap.Map.mock.results.at(-1).value;
        act(() => {
            map.getCenter.mockReturnValue({ lng: 153.2, lat: -27.3 });
            map.__trigger('load');
            map.__trigger('moveend');
        });

        await waitFor(() => {
            expect(screen.getByTestId('reset-map-position-button')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('reset-map-position-button'));
        expect(map.flyTo).toHaveBeenCalledWith({ center: [153.01329, -27.49751], zoom: 17 });
        expect(map.setZLevel).toHaveBeenCalledWith(3);

        act(() => {
            map.getCenter.mockReturnValue(undefined);
            map.__trigger('moveend');
            map.__trigger('zlevel', {});
        });

        const zLevelCallback = setFormValues.mock.calls.at(-1)[0];
        expect(zLevelCallback({ space_id: 7, space_zlevel: undefined })).toEqual(
            expect.objectContaining({ space_zlevel: 1 }),
        );

        act(() => {
            map.zLevel = null;
        });

        fireEvent.click(screen.getByRole('tab', { name: 'Gatton' }));
        const campusCallback = setFormValues.mock.calls.at(-1)[0];
        expect(campusCallback({ space_id: 7, space_zlevel: undefined })).toEqual(
            expect.objectContaining({ space_latitude: -27.5, space_longitude: 152.3 }),
        );
    });

    it('switches campuses by tab selection and cleans up on unmount', async () => {
        const setFormValues = jest.fn();

        const { unmount } = rtlRender(
            <SpaceLocationMap
                formValues={{ space_id: 4, space_latitude: -27.5, space_longitude: 153.0, space_zlevel: 3 }}
                setFormValues={setFormValues}
                campusCoordinateList={[
                    { campus_id: 1, campus_name: 'St Lucia', campus_longitude: 153.0, campus_latitude: -27.5 },
                    { campus_id: 2, campus_name: 'Gatton', campus_longitude: 152.3, campus_latitude: -27.5 },
                ]}
                initialCampus={1}
                bookableSpacesRoomList={{ data: { locations: [] } }}
            />,
        );

        const scriptElement = document.body.querySelector('script[src*="mazemap.min.js"]');
        act(() => {
            scriptElement.onload();
        });

        await waitFor(() => {
            expect(window.Mazemap.Map).toHaveBeenCalled();
        });

        const map = window.Mazemap.Map.mock.results.at(-1).value;
        act(() => {
            map.__trigger('load');
        });

        expect(screen.getByRole('tab', { name: 'Gatton' })).toHaveAttribute('aria-selected', 'true');

        fireEvent.click(screen.getByRole('tab', { name: 'St Lucia' }));
        expect(map.flyTo).toHaveBeenCalledWith({ center: { lng: 153.0, lat: -27.5 }, zoom: 17 });
        expect(setFormValues).toHaveBeenCalled();

        unmount();
        expect(map.remove).toHaveBeenCalled();
    });
});
