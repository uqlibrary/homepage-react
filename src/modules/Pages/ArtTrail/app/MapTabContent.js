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
    media: 'artTrailMapPopupMedia',
    image: 'artTrailMapPopupImage',
    body: 'artTrailMapPopupBody',
    title: 'artTrailMapPopupTitle',
    titleLink: 'artTrailMapPopupTitleLink',
    description: 'artTrailMapPopupDescription',
    level: 'artTrailMapPopupLevel',
};
const markerClassNames = {
    marker: 'artTrailMapMarker',
};

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
    element.className = markerClassNames.marker;
    element.style.setProperty('--art-trail-marker-color', poi.color);

    return element;
};

const createPoiPopupContent = (poi, onSelectTrailPage) => {
    const container = document.createElement('div');
    container.className = popupClassNames.container;

    if (poi.popupThumbnailSrc) {
        const media = document.createElement('div');
        media.className = popupClassNames.media;

        const image = document.createElement('img');
        image.className = popupClassNames.image;
        image.src = poi.popupThumbnailSrc;
        image.alt = poi.popupThumbnailAlt || poi.popupTitle || poi.title || 'Artwork thumbnail';
        image.loading = 'lazy';
        media.appendChild(image);
        container.appendChild(media);
    }

    const body = document.createElement('div');
    body.className = popupClassNames.body;

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

    body.appendChild(title);

    if (poi.popupDescription) {
        const description = document.createElement('div');
        description.className = popupClassNames.description;
        description.innerHTML = poi.popupDescription;
        body.appendChild(description);
    }

    if (poi.popupLevelLabel || typeof poi.zLevel === 'number') {
        const level = document.createElement('div');
        level.textContent = poi.popupLevelLabel || `Level ${poi.zLevel}`;
        level.className = popupClassNames.level;
        body.appendChild(level);
    }

    container.appendChild(body);

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

    const closeActivePopup = () => {
        activePopupRef.current?.remove?.();
        activePopupRef.current = null;
    };

    useEffect(() => {
        if (!active || /jsdom/i.test(window.navigator.userAgent)) {
            closeActivePopup();
            return;
        }

        const handleSelectTrailPageFromMap = stepIndex => {
            closeActivePopup();
            onSelectTrailPage?.(stepIndex);
        };

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
                    onSelectTrailPage: handleSelectTrailPageFromMap,
                    activePopupRef,
                });
            })
            .catch(() => {});
    }, [active, onSelectTrailPage]);

    useEffect(() => {
        return () => {
            closeActivePopup();
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
                    [`.${markerClassNames.marker}`]: {
                        width: '27px',
                        height: '27px',
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: '50%',
                        backgroundColor: 'var(--art-trail-marker-color)',
                        border: '2px solid #ffffff',
                        color: '#ffffff',
                        fontSize: '15px',
                        fontWeight: 700,
                        lineHeight: 1,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.24)',
                    },
                    [`.${popupClassNames.container}`]: {
                        display: 'grid',
                        gridTemplateColumns: '72px minmax(0, 1fr)',
                        gap: '10px',
                        alignItems: 'start',
                        maxWidth: '280px',
                    },
                    [`.${popupClassNames.media}`]: {
                        width: '72px',
                    },
                    [`.${popupClassNames.image}`]: {
                        display: 'block',
                        width: '72px',
                        height: '72px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                    },
                    [`.${popupClassNames.body}`]: {
                        display: 'grid',
                        gap: '4px',
                        minWidth: 0,
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
                        fontWeight: 400,
                        letterSpacing: '0.04em',
                        lineHeight: 1.2,
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
