import { ART_TRAIL_MAP_POIS } from '../config/mapPois';
import { MAP_POPUP_MAX_WIDTH } from '../appShellStyles';

const MAZEMAP_SCRIPT_ID = 'art-trail-mazemap-script';
const MAZEMAP_STYLESHEET_ID = 'art-trail-mazemap-stylesheet';
const MAZEMAP_SCRIPT_SRC = 'vendor/mazemap/mazemap.min.js';
const MAZEMAP_STYLESHEET_HREF = 'vendor/mazemap/mazemap.min.css';

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

export const createPoiMarkerElement = (poi, markerClassNames) => {
    const element = document.createElement('div');
    element.setAttribute('aria-label', poi.title || poi.popupTitle || `Trail stop ${poi.trailStepIndex}`);
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
    markerClassNames,
    popupClassNames,
}) => {
    if (!Mazemap?.ZLevelMarker || !map) {
        return [];
    }

    return pois.map(poi => {
        const popup = Mazemap.Popup ? new Mazemap.Popup({ offset: 12, maxWidth: MAP_POPUP_MAX_WIDTH }) : null;
        const markerElement = createPoiMarkerElement(poi, markerClassNames);
        const marker = new Mazemap.ZLevelMarker(markerElement, {
            zLevel: poi.zLevel,
            offset: [0, -9],
        }).setLngLat([poi.lng, poi.lat]);

        if (popup?.setDOMContent) {
            popup.setDOMContent(createPoiPopupContent(poi, onSelectTrailPage, popupClassNames));
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
