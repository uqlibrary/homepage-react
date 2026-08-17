import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

const MAZEMAP_SCRIPT_ID = 'art-trail-mazemap-script';
const MAZEMAP_STYLESHEET_ID = 'art-trail-mazemap-stylesheet';
const MAZEMAP_SCRIPT_SRC = '/vendor/mazemap/mazemap.min.js';
const MAZEMAP_STYLESHEET_HREF = '/vendor/mazemap/mazemap.min.css';

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

const MapTabContent = ({ active }) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);

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
                    center: { lat: -27.49664388431794, lng: 153.0143995439455 },
                    zoom: 19,
                    zLevel: 1,
                    RTLTextPlugin: null,
                });
            })
            .catch(() => {});
    }, [active]);

    useEffect(() => {
        return () => {
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
                minHeight:
                    'calc(100dvh - var(--art-trail-header-height) - var(--art-trail-footer-height) - var(--art-trail-content-bottom-padding))',
                height: 'calc(100dvh - var(--art-trail-header-height) - var(--art-trail-footer-height) - var(--art-trail-content-bottom-padding))',
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
