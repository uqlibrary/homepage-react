import React from 'react';

import { fireEvent, waitFor } from '@testing-library/react';

import { rtlRender, screen } from 'test-utils';

import SpaceLocationMap from './SpaceLocationMap';

describe('SpaceLocationMap', () => {
    const mapInstanceFactory = () => {
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
            Map: jest.fn(() => mapInstanceFactory()),
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

    it('renders campus tabs and allows a reset to the initial map position', async () => {
        const setFormValues = jest.fn();

        rtlRender(
            <SpaceLocationMap
                formValues={{ space_id: 1, space_latitude: -27.5, space_longitude: 153.0, space_zlevel: 1 }}
                setFormValues={setFormValues}
                campusCoordinateList={[
                    { campus_id: 1, campus_name: 'St Lucia', campus_longitude: 153.0, campus_latitude: -27.5 },
                    { campus_id: 2, campus_name: 'Gatton', campus_longitude: 152.3, campus_latitude: -27.5 },
                ]}
                initialCampus={0}
                bookableSpacesRoomList={{
                    data: {
                        locations: [
                            {
                                space_id: 99,
                                space_name: 'Other room',
                                space_latitude: -27.45,
                                space_longitude: 152.95,
                                space_type_details: { space_type_name: 'Room' },
                            },
                        ],
                    },
                }}
            />,
        );

        const scriptElement = document.body.querySelector('script[src*="mazemap.min.js"]');
        expect(scriptElement).not.toBeNull();
        scriptElement.onload();

        await waitFor(() => {
            expect(window.Mazemap.Map).toHaveBeenCalled();
        });

        const map = window.Mazemap.Map.mock.results[0].value;
        map.__trigger('load');

        await waitFor(() => {
            expect(screen.getByRole('tab', { name: 'Gatton' })).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('tab', { name: 'Gatton' }));
        expect(map.flyTo).toHaveBeenCalledWith({ center: { lng: 152.3, lat: -27.5 }, zoom: 17 });
    });
});
