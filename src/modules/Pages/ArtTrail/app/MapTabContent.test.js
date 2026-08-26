import React from 'react';
import { act, rtlRender, waitFor } from 'test-utils';

import MapTabContent from './MapTabContent';
import { mapClassNames, markerClassNames, popupClassNames } from './appShellStyles';
import { createMazemapPoiMarkers, createUserLocationControl, loadMazemapAssets } from './utils/mapUtils';

jest.mock('./utils/mapUtils', () => ({
    createMazemapPoiMarkers: jest.fn(),
    createUserLocationControl: jest.fn(),
    loadMazemapAssets: jest.fn(),
}));

const setup = (props = {}) => rtlRender(<MapTabContent active={false} onSelectTrailPage={jest.fn()} {...props} />);

const setNavigatorUserAgent = userAgent => {
    Object.defineProperty(window.navigator, 'userAgent', {
        configurable: true,
        value: userAgent,
    });
};

describe('MapTabContent', () => {
    const originalUserAgent = window.navigator.userAgent;

    beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllMocks();
        setNavigatorUserAgent(originalUserAgent);
        createMazemapPoiMarkers.mockReturnValue([]);
        createUserLocationControl.mockReturnValue(null);
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        setNavigatorUserAgent(originalUserAgent);
    });

    it('renders the map container and skips MazeMaps initialization while inactive', () => {
        const { getByLabelText, getByTestId } = setup();

        expect(getByTestId('pageContent')).toBeInTheDocument();
        expect(getByLabelText('MazeMaps campus map')).toBeInTheDocument();
        expect(loadMazemapAssets).not.toHaveBeenCalled();
    });

    it('initializes MazeMaps, markers, and geolocation when active outside jsdom', async () => {
        setNavigatorUserAgent('Mozilla/5.0');

        const onSelectTrailPage = jest.fn();
        const addControl = jest.fn();
        const mapInstance = {
            addControl,
            remove: jest.fn(),
            removeControl: jest.fn(),
            resize: jest.fn(),
        };
        const MapConstructor = jest.fn(() => mapInstance);
        const geolocateControl = {
            _container: document.createElement('div'),
            trigger: jest.fn(),
        };

        loadMazemapAssets.mockResolvedValue({
            Map: MapConstructor,
        });
        createUserLocationControl.mockReturnValue(geolocateControl);

        const { getByTestId } = setup({ active: true, onSelectTrailPage });

        await waitFor(() => {
            expect(loadMazemapAssets).toHaveBeenCalledTimes(1);
        });

        expect(MapConstructor).toHaveBeenCalledWith(
            expect.objectContaining({
                container: getByTestId('mazemap-container'),
                campuses: 'uq',
                center: { lat: -27.49634, lng: 153.01405 },
                bearing: -16,
                zoom: 18.4,
                zLevel: -1,
                zLevelControl: false,
                RTLTextPlugin: null,
            }),
        );
        expect(createMazemapPoiMarkers).toHaveBeenCalledWith(
            expect.objectContaining({
                Mazemap: expect.objectContaining({ Map: MapConstructor }),
                map: mapInstance,
                activePopupRef: expect.any(Object),
                markerClassNames,
                popupClassNames,
                onSelectTrailPage: expect.any(Function),
            }),
        );
        expect(addControl).toHaveBeenCalledWith(geolocateControl, 'top-right');
        expect(geolocateControl._container.classList.contains(mapClassNames.hiddenGeolocateControl)).toBe(true);

        act(() => {
            jest.runOnlyPendingTimers();
        });

        expect(geolocateControl.trigger).toHaveBeenCalledTimes(1);

        const handleSelectTrailPageFromMap = createMazemapPoiMarkers.mock.calls[0][0].onSelectTrailPage;

        handleSelectTrailPageFromMap(3);

        expect(onSelectTrailPage).toHaveBeenCalledWith(3);
    });

    it('shows an unavailable message when MazeMaps fails to load', async () => {
        setNavigatorUserAgent('Mozilla/5.0');
        loadMazemapAssets.mockRejectedValue(new Error('MazeMaps unavailable'));

        const { findByRole, queryByTestId } = setup({ active: true });

        expect(await findByRole('status')).toHaveTextContent('Map is unavailable');
        expect(queryByTestId('mazemap-container')).not.toBeInTheDocument();
    });

    it('shows an unavailable message when loaded MazeMaps assets do not provide a Map constructor', async () => {
        setNavigatorUserAgent('Mozilla/5.0');
        loadMazemapAssets.mockResolvedValue({});

        const { findByRole, queryByTestId } = setup({ active: true });

        expect(await findByRole('status')).toHaveTextContent('Map is unavailable');
        expect(queryByTestId('mazemap-container')).not.toBeInTheDocument();
    });

    it('ignores a MazeMaps load failure after initialization is cancelled', async () => {
        setNavigatorUserAgent('Mozilla/5.0');
        let rejectLoad;
        loadMazemapAssets.mockReturnValue(
            new Promise((resolve, reject) => {
                rejectLoad = reject;
            }),
        );

        const { unmount } = setup({ active: true });

        expect(loadMazemapAssets).toHaveBeenCalledTimes(1);
        unmount();

        await act(async () => {
            rejectLoad(new Error('MazeMaps unavailable'));
        });
    });

    it('resizes the existing map when the tab becomes active again', async () => {
        setNavigatorUserAgent('Mozilla/5.0');

        const mapInstance = {
            addControl: jest.fn(),
            remove: jest.fn(),
            removeControl: jest.fn(),
            resize: jest.fn(),
        };
        const MapConstructor = jest.fn(() => mapInstance);

        loadMazemapAssets.mockResolvedValue({
            Map: MapConstructor,
        });

        const onSelectTrailPage = jest.fn();
        const { rerender } = setup({ active: true, onSelectTrailPage });

        await waitFor(() => {
            expect(MapConstructor).toHaveBeenCalledTimes(1);
        });

        rerender(<MapTabContent active={false} onSelectTrailPage={onSelectTrailPage} />);
        rerender(<MapTabContent active onSelectTrailPage={onSelectTrailPage} />);

        expect(mapInstance.resize).toHaveBeenCalledTimes(1);
        expect(loadMazemapAssets).toHaveBeenCalledTimes(1);
    });

    it('removes markers, geolocation control, and the map on unmount', async () => {
        setNavigatorUserAgent('Mozilla/5.0');

        const markerOne = { remove: jest.fn() };
        const markerTwo = { remove: jest.fn() };
        const geolocateControl = {
            _container: document.createElement('div'),
            trigger: jest.fn(),
        };
        const mapInstance = {
            addControl: jest.fn(),
            remove: jest.fn(),
            removeControl: jest.fn(),
            resize: jest.fn(),
        };
        const MapConstructor = jest.fn(() => mapInstance);

        loadMazemapAssets.mockResolvedValue({
            Map: MapConstructor,
        });
        createMazemapPoiMarkers.mockReturnValue([markerOne, markerTwo]);
        createUserLocationControl.mockReturnValue(geolocateControl);

        const { unmount } = setup({ active: true, onSelectTrailPage: jest.fn() });

        await waitFor(() => {
            expect(MapConstructor).toHaveBeenCalledTimes(1);
        });

        unmount();

        expect(markerOne.remove).toHaveBeenCalledTimes(1);
        expect(markerTwo.remove).toHaveBeenCalledTimes(1);
        expect(mapInstance.removeControl).toHaveBeenCalledWith(geolocateControl);
        expect(mapInstance.remove).toHaveBeenCalledTimes(1);
    });
});
