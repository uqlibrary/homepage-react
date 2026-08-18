import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import GlobalStyles from '@mui/material/GlobalStyles';

import { ART_TRAIL_MAP_POIS } from './mapPois';

const MAZEMAP_SCRIPT_ID = 'art-trail-mazemap-script';
const MAZEMAP_STYLESHEET_ID = 'art-trail-mazemap-stylesheet';
const MAZEMAP_SCRIPT_SRC = 'vendor/mazemap/mazemap.min.js';
const MAZEMAP_STYLESHEET_HREF = 'vendor/mazemap/mazemap.min.css';

const popupClassNames = {
    container: 'artTrailMapPopup',
    title: 'artTrailMapPopupTitle',
    titleLink: 'artTrailMapPopupTitleLink',
    description: 'artTrailMapPopupDescription',
    level: 'artTrailMapPopupLevel',
};
const MARKER_SIZE_PX = 27;
const MARKER_FONT_SIZE_PX = 15;

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
    element.setAttribute('aria-label', poi.title || poi.popupTitle || `Trail stop ${poi.trailStepIndex}`);
    element.textContent = typeof poi.trailStepIndex === 'number' ? `${poi.trailStepIndex}` : '';
    element.style.width = `${MARKER_SIZE_PX}px`;
    element.style.height = `${MARKER_SIZE_PX}px`;
    element.style.display = 'grid';
    element.style.placeItems = 'center';
    element.style.borderRadius = '50%';
    element.style.backgroundColor = poi.color;
    element.style.border = '2px solid #ffffff';
    element.style.color = '#ffffff';
    element.style.fontSize = `${MARKER_FONT_SIZE_PX}px`;
    element.style.fontWeight = '700';
    element.style.lineHeight = '1';
    element.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.24)';

    return element;
};

const createPoiPopupContent = (poi, onSelectTrailPage) => {
    const container = document.createElement('div');
    container.className = popupClassNames.container;

    const title = document.createElement(typeof poi.trailStepIndex === 'number' && onSelectTrailPage ? 'a' : 'div');
    title.textContent = poi.popupTitle || poi.title;
    title.className =
        typeof poi.trailStepIndex === 'number' && onSelectTrailPage
            ? `${popupClassNames.title} ${popupClassNames.titleLink}`
            : popupClassNames.title;

    if (title.tagName === 'A') {
        title.href = '#';
        title.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            onSelectTrailPage(poi.trailStepIndex);
        });
    }

    container.appendChild(title);

    if (poi.popupDescription) {
        const description = document.createElement('div');
        description.className = popupClassNames.description;
        description.innerHTML = poi.popupDescription;
        container.appendChild(description);
    }

    if (poi.popupLevelLabel || typeof poi.zLevel === 'number') {
        const level = document.createElement('div');
        level.textContent = poi.popupLevelLabel || `Level ${poi.zLevel}`;
        level.className = popupClassNames.level;
        container.appendChild(level);
    }

    return container;
};

export const createMazemapPoiMarkers = ({
    Mazemap,
    map,
    pois = ART_TRAIL_MAP_POIS,
    onSelectTrailPage,
    activePopupRef,
}) => {
    if (!Mazemap?.ZLevelMarker || !map) {
        return [];
    }

    return pois.map(poi => {
        const popup = Mazemap.Popup ? new Mazemap.Popup({ offset: 12 }) : null;
        const markerElement = createPoiMarkerElement(poi);
        const marker = new Mazemap.ZLevelMarker(markerElement, {
            zLevel: poi.zLevel,
            offset: [0, -9],
        }).setLngLat([poi.lng, poi.lat]);

        if (popup?.setDOMContent) {
            popup.setDOMContent(createPoiPopupContent(poi, onSelectTrailPage));
        } else if (popup?.setText) {
            popup.setText(poi.popupTitle || poi.title);
        }

        if (popup && marker.setPopup) {
            marker.setPopup(popup);
        }

        if (popup && activePopupRef) {
            markerElement.addEventListener('click', () => {
                const previousPopup = activePopupRef.current;

                if (previousPopup && previousPopup !== popup && (!previousPopup.isOpen || previousPopup.isOpen())) {
                    previousPopup.remove?.();
                }

                activePopupRef.current = popup;
            });
        }

        return marker.addTo(map);
    });
};

const MapTabContent = ({ active, onSelectTrailPage }) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerInstancesRef = useRef([]);
    const activePopupRef = useRef(null);

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
                    onSelectTrailPage,
                    activePopupRef,
                });
            })
            .catch(() => {});
    }, [active, onSelectTrailPage]);

    useEffect(() => {
        return () => {
            activePopupRef.current?.remove?.();
            activePopupRef.current = null;
            markerInstancesRef.current.forEach(marker => marker?.remove?.());
            markerInstancesRef.current = [];
            mapInstanceRef.current?.remove?.();
            mapInstanceRef.current = null;
        };
    }, []);

    return (
        <>
            <GlobalStyles
                styles={{
                    [`.${popupClassNames.container}`]: {
                        display: 'grid',
                        gap: '4px',
                        maxWidth: '220px',
                    },
                    [`.${popupClassNames.title}`]: {
                        fontSize: '14px',
                        fontWeight: 700,
                        lineHeight: 1.35,
                    },
                    [`.${popupClassNames.titleLink}`]: {
                        color: '#51247a',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        textDecorationThickness: '0.08em',
                        textUnderlineOffset: '0.12em',
                    },
                    [`.${popupClassNames.description}`]: {
                        fontSize: '12px',
                        lineHeight: 1.4,
                    },
                    [`.${popupClassNames.description} em`]: {
                        fontStyle: 'italic',
                    },
                    [`.${popupClassNames.level}`]: {
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        opacity: 0.72,
                    },
                }}
            />
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
        </>
    );
};

MapTabContent.propTypes = {
    active: PropTypes.bool,
    onSelectTrailPage: PropTypes.func,
};

export default MapTabContent;
