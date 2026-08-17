import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import { ART_TRAIL_MAP_POIS } from './mapPois';

const MAZEMAP_SCRIPT_ID = 'art-trail-mazemap-script';
const MAZEMAP_STYLESHEET_ID = 'art-trail-mazemap-stylesheet';
const MAZEMAP_SCRIPT_SRC = 'vendor/mazemap/mazemap.min.js';
const MAZEMAP_STYLESHEET_HREF = 'vendor/mazemap/mazemap.min.css';

const loadMazemapAssets = () => {
    if (window.Mazemap) {
        return Promise.resolve(window.Mazemap);
    }

    if (!document.getElementById(MAZEMAP_STYLESHEET_ID)) {
        const link = document.createElement('link');
        link.id = MAZEMAP_STYLESHEET_ID;
        link.rel = 'stylesheet';
        link.href = `/${process.env.PUBLIC_PATH || ''}${MAZEMAP_STYLESHEET_HREF}`;
        document.head.appendChild(link);
    }

    const existingScript = document.getElementById(MAZEMAP_SCRIPT_ID);

    if (existingScript) {
        return new Promise((resolve, reject) => {
            if (window.Mazemap) {
                resolve(window.Mazemap);
                return;
            }

            existingScript.addEventListener('load', () => resolve(window.Mazemap), { once: true });
            existingScript.addEventListener('error', reject, { once: true });
        });
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.id = MAZEMAP_SCRIPT_ID;
        script.src = `/${process.env.PUBLIC_PATH || ''}${MAZEMAP_SCRIPT_SRC}`;
        script.async = true;
        script.onload = () => resolve(window.Mazemap);
        script.onerror = reject;
        document.body.appendChild(script);
    });
};

const createPoiMarkerElement = poi => {
    const element = document.createElement('div');
    element.setAttribute('aria-label', poi.title);
    element.style.width = '18px';
    element.style.height = '18px';
    element.style.borderRadius = '50%';
    element.style.backgroundColor = poi.color;
    element.style.border = '2px solid #ffffff';
    element.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.24)';

    return element;
};

export const createMazemapPoiMarkers = ({ Mazemap, map, pois = ART_TRAIL_MAP_POIS }) => {
    if (!Mazemap?.ZLevelMarker || !map) {
        return [];
    }

    return pois.map(poi => {
        const popup = Mazemap.Popup ? new Mazemap.Popup({ offset: 12 }).setText(poi.title) : null;
        const marker = new Mazemap.ZLevelMarker(createPoiMarkerElement(poi), {
            zLevel: poi.zLevel,
            offset: [0, -9],
        }).setLngLat([poi.lng, poi.lat]);

        if (popup && marker.setPopup) {
            marker.setPopup(popup);
        }

        return marker.addTo(map);
    });
};

const MapTabContent = ({ active }) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerInstancesRef = useRef([]);

    useEffect(() => {
        if (!active || /jsdom/i.test(window.navigator.userAgent)) {
            return;
        }

        if (mapInstanceRef.current) {
            mapInstanceRef.current.resize?.();
            return;
        }

        loadMazemapAssets()
            .then(Mazemap => {
                if (!mapContainerRef.current || !Mazemap?.Map || mapInstanceRef.current) {
                    return;
                }

                mapInstanceRef.current = new Mazemap.Map({
                    container: mapContainerRef.current,
                    campuses: 'uq',
                    center: { lat: -27.49634, lng: 153.01405 },
                    bearing: -16,
                    zoom: 18.4,
                    zLevel: -1,
                    RTLTextPlugin: null,
                });

                markerInstancesRef.current = createMazemapPoiMarkers({
                    Mazemap,
                    map: mapInstanceRef.current,
                });
            })
            .catch(() => {});
    }, [active]);

    useEffect(() => {
        return () => {
            markerInstancesRef.current.forEach(marker => marker?.remove?.());
            markerInstancesRef.current = [];
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
            <Box
                ref={mapContainerRef}
                data-testid="mazemap-container"
                aria-label="MazeMaps campus map"
                sx={{ position: 'absolute', inset: 0, height: '100%', width: '100%' }}
            />
        </Box>
    );
};

MapTabContent.propTypes = {
    active: PropTypes.bool,
};

export default MapTabContent;
