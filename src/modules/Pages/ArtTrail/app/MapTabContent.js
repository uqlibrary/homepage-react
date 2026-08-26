import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import { mapClassNames, markerClassNames, popupClassNames } from './appShellStyles';
import { loadMazemapAssets, createMazemapPoiMarkers, createUserLocationControl } from './utils/mapUtils';

const MapTabContent = ({ active, onSelectTrailPage }) => {
    const [mapUnavailable, setMapUnavailable] = useState(false);
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerInstancesRef = useRef([]);
    const activePopupRef = useRef(null);
    const geolocateControlRef = useRef(null);
    const geolocateTriggerTimeoutRef = useRef(null);

    const closeActivePopup = () => {
        activePopupRef.current?.remove?.();
        activePopupRef.current = null;
    };

    useEffect(() => {
        let cancelled = false;
        const cancelInitialization = () => {
            cancelled = true;
        };

        if (!active || /jsdom/i.test(window.navigator.userAgent)) {
            closeActivePopup();
            return cancelInitialization;
        }

        setMapUnavailable(false);

        const handleSelectTrailPageFromMap = stepIndex => {
            closeActivePopup();
            onSelectTrailPage?.(stepIndex);
        };

        if (mapInstanceRef.current) {
            mapInstanceRef.current.resize?.();
            return cancelInitialization;
        }

        loadMazemapAssets()
            .then(Mazemap => {
                /* istanbul ignore if */
                if (cancelled || !mapContainerRef.current || mapInstanceRef.current) {
                    return;
                }

                if (!Mazemap?.Map) {
                    setMapUnavailable(true);
                    return;
                }

                mapInstanceRef.current = new Mazemap.Map({
                    container: mapContainerRef.current,
                    campuses: 'uq',
                    center: { lat: -27.49634, lng: 153.01405 },
                    bearing: -16,
                    zoom: 18.4,
                    zLevel: -1,
                    zLevelControl: false,
                    RTLTextPlugin: null,
                });

                markerInstancesRef.current = createMazemapPoiMarkers({
                    Mazemap,
                    map: mapInstanceRef.current,
                    onSelectTrailPage: handleSelectTrailPageFromMap,
                    activePopupRef,
                    markerClassNames,
                    popupClassNames,
                });

                const geolocateControl = createUserLocationControl(Mazemap);

                if (geolocateControl && mapInstanceRef.current.addControl) {
                    geolocateControlRef.current = geolocateControl;
                    mapInstanceRef.current.addControl(geolocateControl, 'top-right');
                    geolocateControl._container?.classList.add(mapClassNames.hiddenGeolocateControl);
                    geolocateTriggerTimeoutRef.current = window.setTimeout(() => {
                        try {
                            geolocateControl.trigger?.();
                        } catch (error) {
                            // Ignore geolocation failures such as permission denials.
                        }
                    }, 0);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setMapUnavailable(true);
                }
            });

        return cancelInitialization;
    }, [active, onSelectTrailPage]);

    useEffect(() => {
        return () => {
            window.clearTimeout(geolocateTriggerTimeoutRef.current);
            closeActivePopup();
            markerInstancesRef.current.forEach(marker => marker?.remove?.());
            markerInstancesRef.current = [];
            if (geolocateControlRef.current && mapInstanceRef.current?.removeControl) {
                mapInstanceRef.current.removeControl(geolocateControlRef.current);
            }
            geolocateControlRef.current = null;
            mapInstanceRef.current?.remove?.();
            mapInstanceRef.current = null;
        };
    }, []);

    return (
        <Box
            data-testid="pageContent"
            sx={{
                position: 'relative',
                width: '100%',
                minHeight: 'calc(100dvh - var(--art-trail-header-height) - var(--art-trail-footer-height))',
                height: 'calc(100dvh - var(--art-trail-header-height) - var(--art-trail-footer-height))',
                overflow: 'hidden',
            }}
        >
            {mapUnavailable ? (
                <Box role="status" sx={{ height: '100%', display: 'grid', placeItems: 'center', p: 2 }}>
                    Map is unavailable
                </Box>
            ) : (
                <Box
                    ref={mapContainerRef}
                    data-testid="mazemap-container"
                    aria-label="MazeMaps campus map"
                    sx={{ position: 'absolute', inset: 0, height: '100%', width: '100%' }}
                />
            )}
        </Box>
    );
};

MapTabContent.propTypes = {
    active: PropTypes.bool,
    onSelectTrailPage: PropTypes.func,
};

export default MapTabContent;
