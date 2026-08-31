import { ART_TRAIL_MAP_POIS } from '../config/mapPois';
import { MAP_POPUP_MAX_WIDTH } from '../appShellStyles';

const MAZEMAP_SCRIPT_ID = 'art-trail-mazemap-script';
const MAZEMAP_STYLESHEET_ID = 'art-trail-mazemap-stylesheet';
const MAZEMAP_SCRIPT_SRC = 'vendor/mazemap/mazemap.min.js';
const MAZEMAP_STYLESHEET_HREF = 'vendor/mazemap/mazemap.min.css';

export const stripHtml = html => {
    const container = document.createElement('div');
    container.innerHTML = html;
    return container.textContent || /* istanbul ignore next */ '';
};

export const createUserLocationControl = Mazemap => {
    if (!Mazemap?.mapboxgl?.GeolocateControl || !navigator.geolocation) {
        return null;
    }

    return new Mazemap.mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true,
        },
        showAccuracyCircle: true,
        showUserHeading: true,
        showUserLocation: true,
        trackUserLocation: true,
    });
};

export const loadMazemapAssets = () => {
    if (window.Mazemap) {
        return Promise.resolve(window.Mazemap);
    }

    /* istanbul ignore else */
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
        script.src = `/${process.env.PUBLIC_PATH || /* istanbul ignore next */ ''}${MAZEMAP_SCRIPT_SRC}`;
        script.async = true;
        script.onload = () => resolve(window.Mazemap);
        script.onerror = reject;
        document.body.appendChild(script);
    });
};

export const createPoiMarkerElement = (poi, markerClassNames) => {
    const element = document.createElement('div');
    element.setAttribute('aria-label', poi.popupAriaLabel);
    element.setAttribute('role', 'button');
    element.tabIndex = 0;
    element.textContent = typeof poi.trailStepIndex === 'number' ? `${poi.trailStepIndex}` : '';
    element.className = markerClassNames.marker;
    element.style.setProperty('--art-trail-marker-color', poi.color);

    return element;
};

export const createPoiPopupContent = (poi, onSelectTrailPage, popupClassNames) => {
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
    title.textContent = poi.popupTitle || poi.menuTitle || poi.title;
    title.className =
        typeof poi.trailStepIndex === 'number' && onSelectTrailPage
            ? `${popupClassNames.title} ${popupClassNames.titleLink}`
            : popupClassNames.title;

    if (title.tagName === 'A') {
        const linkLabel = stripHtml(poi.tableLinkText);
        const selectTrailPage = event => {
            event.preventDefault();
            event.stopPropagation();
            onSelectTrailPage(poi.trailStepIndex);
        };
        title.href = '#';
        title.title = linkLabel;
        title.setAttribute('aria-label', linkLabel);
        title.addEventListener('click', selectTrailPage);
        title.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                selectTrailPage(event);
            }
        });
    }

    body.appendChild(title);

    if (poi.popupDescription) {
        const description = document.createElement('div');
        description.className = popupClassNames.description;
        description.innerHTML = poi.popupDescription;
        body.appendChild(description);
    }

    /* istanbul ignore else */
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
    markerClassNames,
    popupClassNames,
}) => {
    if (!Mazemap?.ZLevelMarker || !map) {
        return [];
    }

    return pois.map(poi => {
        const popup = Mazemap.Popup
            ? new Mazemap.Popup({ offset: 12, maxWidth: MAP_POPUP_MAX_WIDTH })
            : /* istanbul ignore next */ null;
        const markerElement = createPoiMarkerElement(poi, markerClassNames);
        const marker = new Mazemap.ZLevelMarker(markerElement, {
            zLevel: poi.zLevel,
            offset: [0, -9],
        }).setLngLat([poi.lng, poi.lat]);

        if (popup?.setDOMContent) {
            popup.setDOMContent(createPoiPopupContent(poi, onSelectTrailPage, popupClassNames));
        } else {
            /* istanbul ignore else */
            if (popup?.setText) {
                popup.setText(poi.popupTitle || poi.menuTitle || poi.title);
            }
        }

        /* istanbul ignore else */
        if (popup && marker.setPopup) {
            marker.setPopup(popup);
        }

        /* istanbul ignore else */
        if (popup && activePopupRef) {
            const handleMarkerKeyDown = event => {
                const activePopupCloseButton = activePopupRef.current
                    ?.getElement?.()
                    ?.querySelector('.mapboxgl-popup-close-button');

                if (event.key === 'Tab' && event.shiftKey && activePopupCloseButton) {
                    event.preventDefault();
                    activePopupCloseButton.focus();
                }
            };
            const handleEscapeKeyDown = event => {
                if (event.key !== 'Escape' || activePopupRef.current !== popup) {
                    return;
                }

                event.preventDefault();
                popup.remove?.();
            };
            const handlePopupLinkKeyDown = event => {
                if (event.key !== 'Tab' || event.shiftKey) {
                    return;
                }

                const popupCloseButton = popup.getElement?.()?.querySelector('.mapboxgl-popup-close-button');

                /* istanbul ignore else */
                if (popupCloseButton) {
                    event.preventDefault();
                    popupCloseButton.focus();
                }
            };
            const handlePopupOpen = () => {
                const previousPopup = activePopupRef.current;
                const popupElement = popup.getElement?.();
                const popupLink = popupElement?.querySelector(`.${popupClassNames.titleLink}`);

                activePopupRef.current = popup;
                if (previousPopup && previousPopup !== popup && (!previousPopup.isOpen || previousPopup.isOpen())) {
                    previousPopup.remove?.();
                }

                document.addEventListener('keydown', handleEscapeKeyDown);
                popupLink?.addEventListener('keydown', handlePopupLinkKeyDown);
                popupLink?.focus();
            };
            const handlePopupClose = () => {
                document.removeEventListener('keydown', handleEscapeKeyDown);
                popup
                    .getElement?.()
                    ?.querySelector(`.${popupClassNames.titleLink}`)
                    ?.removeEventListener('keydown', handlePopupLinkKeyDown);
                const shouldRestoreMarkerFocus = activePopupRef.current === popup;

                if (shouldRestoreMarkerFocus) {
                    activePopupRef.current = null;
                    markerElement.focus();
                }
            };

            markerElement.addEventListener('keydown', handleMarkerKeyDown);

            if (popup.on) {
                popup.on('open', handlePopupOpen);
                popup.on('close', handlePopupClose);
            } else {
                markerElement.addEventListener('click', handlePopupOpen);
            }
        }

        return marker.addTo(map);
    });
};
