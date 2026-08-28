import { MAP_POPUP_MAX_WIDTH } from '../appShellStyles';
import {
    createMazemapPoiMarkers,
    createPoiMarkerElement,
    createPoiPopupContent,
    createUserLocationControl,
    loadMazemapAssets,
    stripHtml,
} from './mapUtils';

const markerClassNames = {
    marker: 'artTrailMapMarker',
};

const popupClassNames = {
    body: 'artTrailMapPopupBody',
    container: 'artTrailMapPopup',
    description: 'artTrailMapPopupDescription',
    image: 'artTrailMapPopupImage',
    level: 'artTrailMapPopupLevel',
    media: 'artTrailMapPopupMedia',
    title: 'artTrailMapPopupTitle',
    titleLink: 'artTrailMapPopupTitleLink',
};

const samplePoi = {
    color: '#51247a',
    lat: -27.496418,
    lng: 153.014414,
    popupDescription: '<em>Punu Tjukurpa</em> 2013',
    popupAriaLabel: 'Punu Tjukurpa, Duhig Tower, Level 1',
    popupLevelLabel: 'Duhig Tower, Level 1',
    popupThumbnailAlt: 'Punu Tjukurpa artwork thumbnail',
    popupThumbnailSrc: '/images/artwork-thumb.jpg',
    popupTitle: 'Hector Tjupuru Burton, Ray Ken, Mick Wikilyiri & Brenton Ken,',
    tableLinkText: 'Hector Tjupuru Burton, Ray Ken, Mick Wikilyiri and Brenton Ken, <em>Punu Tjukurpa</em>, 2013',
    title: 'Punu Tjukurpa',
    trailStepIndex: 1,
    zLevel: -1,
};

const setupMazemapGlobals = () => {
    const originalMazemap = window.Mazemap;
    const originalPublicPath = process.env.PUBLIC_PATH;

    return {
        restore: () => {
            window.Mazemap = originalMazemap;
            process.env.PUBLIC_PATH = originalPublicPath;
        },
    };
};

describe('mapUtils', () => {
    const originalGeolocation = navigator.geolocation;

    afterEach(() => {
        document.head.innerHTML = '';
        document.body.innerHTML = '';
        window.Mazemap = undefined;
        process.env.PUBLIC_PATH = '';

        if (originalGeolocation) {
            Object.defineProperty(navigator, 'geolocation', {
                configurable: true,
                value: originalGeolocation,
            });
        } else {
            delete navigator.geolocation;
        }
    });

    it('strips HTML from configured map labels', () => {
        expect(stripHtml('Artist, <em>Artwork</em>, 2026')).toBe('Artist, Artwork, 2026');
    });

    it('creates a geolocation control only when Mazemap and browser geolocation are available', () => {
        const GeolocateControl = jest.fn(function GeolocateControl(options) {
            this.options = options;
        });

        Object.defineProperty(navigator, 'geolocation', {
            configurable: true,
            value: {},
        });

        const control = createUserLocationControl({
            mapboxgl: {
                GeolocateControl,
            },
        });

        expect(GeolocateControl).toHaveBeenCalledWith({
            positionOptions: {
                enableHighAccuracy: true,
            },
            showAccuracyCircle: true,
            showUserHeading: true,
            showUserLocation: true,
            trackUserLocation: true,
        });
        expect(control).toBeInstanceOf(GeolocateControl);

        delete navigator.geolocation;

        expect(createUserLocationControl({ mapboxgl: { GeolocateControl } })).toBeNull();
        expect(createUserLocationControl({})).toBeNull();
    });

    it('loads MazeMaps assets once and reuses existing globals when already available', async () => {
        const { restore } = setupMazemapGlobals();

        try {
            const mazemap = { version: 'test' };

            window.Mazemap = mazemap;

            await expect(loadMazemapAssets()).resolves.toBe(mazemap);
            expect(document.querySelector('#art-trail-mazemap-stylesheet')).not.toBeInTheDocument();
            expect(document.querySelector('#art-trail-mazemap-script')).not.toBeInTheDocument();
        } finally {
            restore();
        }
    });

    it('injects stylesheet and script tags, then resolves when the new MazeMaps script loads', async () => {
        const { restore } = setupMazemapGlobals();

        try {
            process.env.PUBLIC_PATH = 'static/';

            const pendingMazemap = { Map: jest.fn() };
            const promise = loadMazemapAssets();
            const stylesheet = document.querySelector('#art-trail-mazemap-stylesheet');
            const script = document.querySelector('#art-trail-mazemap-script');

            expect(stylesheet).toHaveAttribute('href', '/static/vendor/mazemap/mazemap.min.css');
            expect(script).toHaveAttribute('src', '/static/vendor/mazemap/mazemap.min.js');
            expect(script.async).toBe(true);

            window.Mazemap = pendingMazemap;
            script.onload();

            await expect(promise).resolves.toBe(pendingMazemap);
        } finally {
            restore();
        }
    });

    it('waits for an existing MazeMaps script to finish loading before resolving', async () => {
        const { restore } = setupMazemapGlobals();

        try {
            const existingScript = document.createElement('script');
            existingScript.id = 'art-trail-mazemap-script';
            document.body.appendChild(existingScript);

            const promise = loadMazemapAssets();
            const pendingMazemap = { Popup: jest.fn() };

            window.Mazemap = pendingMazemap;
            existingScript.dispatchEvent(new Event('load'));

            await expect(promise).resolves.toBe(pendingMazemap);
            expect(document.querySelectorAll('#art-trail-mazemap-script')).toHaveLength(1);
            expect(document.querySelector('#art-trail-mazemap-stylesheet')).toBeInTheDocument();
        } finally {
            restore();
        }
    });

    it('resolves immediately when MazeMaps becomes available while reusing an existing script', async () => {
        const existingScript = document.createElement('script');
        existingScript.id = 'art-trail-mazemap-script';
        document.body.appendChild(existingScript);
        const mazemap = { Map: jest.fn() };
        const mazemapGetter = jest.fn().mockReturnValueOnce(undefined).mockReturnValue(mazemap);

        Object.defineProperty(window, 'Mazemap', {
            configurable: true,
            get: mazemapGetter,
        });

        await expect(loadMazemapAssets()).resolves.toBe(mazemap);
        expect(mazemapGetter).toHaveBeenCalledTimes(3);

        Object.defineProperty(window, 'Mazemap', {
            configurable: true,
            writable: true,
            value: undefined,
        });
    });

    it('builds marker and popup DOM content with the expected classes, metadata, and link behavior', () => {
        const onSelectTrailPage = jest.fn();
        const markerElement = createPoiMarkerElement(samplePoi, markerClassNames);
        const popupContent = createPoiPopupContent(samplePoi, onSelectTrailPage, popupClassNames);
        const titleLink = popupContent.querySelector('a');
        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
        const stopPropagation = jest.spyOn(clickEvent, 'stopPropagation');

        expect(markerElement).toHaveAttribute('aria-label', samplePoi.popupAriaLabel);
        expect(markerElement).toHaveTextContent(String(samplePoi.trailStepIndex));
        expect(markerElement).toHaveClass(markerClassNames.marker);
        expect(markerElement.style.getPropertyValue('--art-trail-marker-color')).toBe(samplePoi.color);

        expect(popupContent).toHaveClass(popupClassNames.container);
        expect(popupContent.querySelector('img')).toHaveAttribute('src', samplePoi.popupThumbnailSrc);
        expect(popupContent.querySelector('img')).toHaveAttribute('alt', samplePoi.popupThumbnailAlt);
        expect(titleLink).toHaveTextContent(samplePoi.popupTitle);
        expect(titleLink).toHaveAttribute('href', '#');
        expect(titleLink).toHaveAttribute(
            'title',
            'Hector Tjupuru Burton, Ray Ken, Mick Wikilyiri and Brenton Ken, Punu Tjukurpa, 2013',
        );
        expect(titleLink).toHaveAttribute(
            'aria-label',
            'Hector Tjupuru Burton, Ray Ken, Mick Wikilyiri and Brenton Ken, Punu Tjukurpa, 2013',
        );
        expect(titleLink.className).toContain(popupClassNames.title);
        expect(titleLink.className).toContain(popupClassNames.titleLink);
        expect(popupContent.querySelector(`.${popupClassNames.description}`).innerHTML).toBe(
            samplePoi.popupDescription,
        );
        expect(popupContent.querySelector(`.${popupClassNames.level}`)).toHaveTextContent(samplePoi.popupLevelLabel);

        titleLink.dispatchEvent(clickEvent);

        expect(onSelectTrailPage).toHaveBeenCalledWith(samplePoi.trailStepIndex);
        expect(clickEvent.defaultPrevented).toBe(true);
        expect(stopPropagation).toHaveBeenCalledTimes(1);

        titleLink.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter' }));
        titleLink.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: ' ' }));

        expect(onSelectTrailPage).toHaveBeenCalledTimes(3);
    });

    it('falls back to non-link popup titles and default level text when no trail selection callback is available', () => {
        const popupContent = createPoiPopupContent(
            {
                popupTitle: 'Standalone location',
                zLevel: 2,
            },
            undefined,
            popupClassNames,
        );

        expect(popupContent.querySelector('a')).not.toBeInTheDocument();
        expect(popupContent.querySelector(`.${popupClassNames.title}`).tagName).toBe('DIV');
        expect(popupContent.querySelector(`.${popupClassNames.level}`)).toHaveTextContent('Level 2');
    });

    it('falls back through popup thumbnail alt and title options', () => {
        const popupTitleContent = createPoiPopupContent(
            {
                popupThumbnailSrc: '/images/popup-title-thumb.jpg',
                popupTitle: 'Popup title',
                title: 'Artwork title',
            },
            undefined,
            popupClassNames,
        );
        const artworkTitleContent = createPoiPopupContent(
            {
                popupThumbnailSrc: '/images/artwork-title-thumb.jpg',
                title: 'Artwork title',
            },
            undefined,
            popupClassNames,
        );
        const defaultAltContent = createPoiPopupContent(
            {
                popupThumbnailSrc: '/images/default-alt-thumb.jpg',
            },
            undefined,
            popupClassNames,
        );

        expect(popupTitleContent.querySelector('img')).toHaveAttribute('alt', 'Popup title');
        expect(popupTitleContent.querySelector(`.${popupClassNames.title}`)).toHaveTextContent('Popup title');
        expect(artworkTitleContent.querySelector('img')).toHaveAttribute('alt', 'Artwork title');
        expect(artworkTitleContent.querySelector(`.${popupClassNames.title}`)).toHaveTextContent('Artwork title');
        expect(defaultAltContent.querySelector('img')).toHaveAttribute('alt', 'Artwork thumbnail');
    });

    it('returns an empty marker list when Mazemap markers or the map instance are unavailable', () => {
        expect(
            createMazemapPoiMarkers({
                Mazemap: {},
                map: { id: 'map' },
                markerClassNames,
                popupClassNames,
            }),
        ).toEqual([]);

        expect(
            createMazemapPoiMarkers({
                Mazemap: { ZLevelMarker: jest.fn() },
                map: null,
                markerClassNames,
                popupClassNames,
            }),
        ).toEqual([]);
    });

    it('creates markers with text-popup fallback and only removes an older popup when it is open', () => {
        const addTo = jest.fn(function addTo(map) {
            this.map = map;
            return this;
        });
        const setLngLat = jest.fn(function setLngLat(lngLat) {
            this.lngLat = lngLat;
            return this;
        });
        const setPopup = jest.fn(function setPopup(popup) {
            this.popup = popup;
            return this;
        });
        const markerConstructor = jest.fn(function ZLevelMarker(element, options) {
            this.element = element;
            this.options = options;
            this.setLngLat = setLngLat;
            this.setPopup = setPopup;
            this.addTo = addTo;
        });
        const setText = jest.fn(function setText(text) {
            this.text = text;
            return this;
        });
        const popupOne = {
            isOpen: jest.fn(() => false),
            remove: jest.fn(),
            setText,
        };
        const popupTwo = {
            isOpen: jest.fn(() => true),
            remove: jest.fn(),
            setText,
        };
        const Popup = jest
            .fn()
            .mockImplementationOnce(() => popupOne)
            .mockImplementationOnce(() => popupTwo);
        const activePopupRef = { current: null };
        const map = { id: 'mock-map' };
        const pois = [
            {
                ...samplePoi,
                id: 'poi-1',
                popupDescription: undefined,
                popupThumbnailSrc: undefined,
                popupTitle: 'First stop',
                trailStepIndex: undefined,
            },
            {
                ...samplePoi,
                id: 'poi-2',
                popupDescription: undefined,
                popupThumbnailSrc: undefined,
                popupTitle: 'Second stop',
                trailStepIndex: undefined,
            },
        ];

        const markers = createMazemapPoiMarkers({
            Mazemap: {
                Popup,
                ZLevelMarker: markerConstructor,
            },
            activePopupRef,
            map,
            markerClassNames,
            onSelectTrailPage: undefined,
            pois,
            popupClassNames,
        });

        expect(markers).toHaveLength(2);
        expect(Popup).toHaveBeenNthCalledWith(1, { offset: 12, maxWidth: MAP_POPUP_MAX_WIDTH });
        expect(Popup).toHaveBeenNthCalledWith(2, { offset: 12, maxWidth: MAP_POPUP_MAX_WIDTH });
        expect(setText).toHaveBeenNthCalledWith(1, 'First stop');
        expect(setText).toHaveBeenNthCalledWith(2, 'Second stop');

        markerConstructor.mock.calls[0][0].click();
        expect(activePopupRef.current).toBe(popupOne);

        markerConstructor.mock.calls[1][0].click();
        expect(popupOne.remove).not.toHaveBeenCalled();
        expect(activePopupRef.current).toBe(popupTwo);

        popupOne.isOpen.mockReturnValue(true);
        activePopupRef.current = popupOne;

        markerConstructor.mock.calls[1][0].click();
        expect(popupOne.remove).toHaveBeenCalledTimes(1);
    });

    it('falls back to the artwork title for text-only popups', () => {
        const addTo = jest.fn(function addTo(map) {
            this.map = map;
            return this;
        });
        const markerConstructor = jest.fn(function ZLevelMarker() {
            this.setLngLat = jest.fn(() => this);
            this.setPopup = jest.fn(() => this);
            this.addTo = addTo;
        });
        const setText = jest.fn();

        createMazemapPoiMarkers({
            Mazemap: {
                Popup: jest.fn(() => ({ setText })),
                ZLevelMarker: markerConstructor,
            },
            map: { id: 'mock-map' },
            markerClassNames,
            pois: [{ ...samplePoi, popupTitle: undefined, title: 'Artwork title' }],
            popupClassNames,
        });

        expect(setText).toHaveBeenCalledWith('Artwork title');
    });

    it('uses popup titles for marker labels and removes previous popups without isOpen', () => {
        const previousPopup = { remove: jest.fn() };
        const popup = { setDOMContent: jest.fn() };
        const activePopupRef = { current: previousPopup };
        const addTo = jest.fn(function addTo(map) {
            this.map = map;
            return this;
        });
        const markerConstructor = jest.fn(function ZLevelMarker(element) {
            this.element = element;
            this.setLngLat = jest.fn(() => this);
            this.setPopup = jest.fn(() => this);
            this.addTo = addTo;
        });

        createMazemapPoiMarkers({
            Mazemap: {
                Popup: jest.fn(() => popup),
                ZLevelMarker: markerConstructor,
            },
            activePopupRef,
            map: { id: 'mock-map' },
            markerClassNames,
            pois: [{ ...samplePoi, popupAriaLabel: 'Popup title', title: undefined, popupTitle: 'Popup title' }],
            popupClassNames,
        });

        const markerElement = markerConstructor.mock.calls[0][0];
        expect(markerElement).toHaveAttribute('aria-label', 'Popup title');

        markerElement.click();

        expect(previousPopup.remove).toHaveBeenCalledTimes(1);
        expect(activePopupRef.current).toBe(popup);
    });

    it('supports keyboard activation and dismissal of marker popups', () => {
        const popupEventHandlers = {};
        const popupElement = document.createElement('div');
        const closeButton = document.createElement('button');
        closeButton.className = 'mapboxgl-popup-close-button';
        popupElement.appendChild(closeButton);

        const popup = {
            getElement: jest.fn(() => popupElement),
            on: jest.fn((eventName, handler) => {
                popupEventHandlers[eventName] = handler;
            }),
            remove: jest.fn(() => {
                popupEventHandlers.close?.();
                popupElement.remove();
            }),
            setDOMContent: jest.fn(content => popupElement.appendChild(content)),
        };
        const markerConstructor = jest.fn(function ZLevelMarker(element) {
            this.element = element;
            document.body.appendChild(element);
            this.setLngLat = jest.fn(() => this);
            this.setPopup = jest.fn(() => this);
            this.addTo = jest.fn(() => this);
            this.togglePopup = jest.fn(() => {
                document.body.appendChild(popupElement);
                popupEventHandlers.open?.();
            });
        });
        const activePopupRef = { current: null };

        createMazemapPoiMarkers({
            Mazemap: {
                Popup: jest.fn(() => popup),
                ZLevelMarker: markerConstructor,
            },
            activePopupRef,
            map: { id: 'mock-map' },
            markerClassNames,
            onSelectTrailPage: jest.fn(),
            pois: [samplePoi],
            popupClassNames,
        });

        const markerElement = markerConstructor.mock.calls[0][0];
        expect(markerElement).toHaveAttribute('role', 'button');
        expect(markerElement).toHaveAttribute('tabindex', '0');

        document.body.appendChild(popupElement);
        popupEventHandlers.open();

        expect(activePopupRef.current).toBe(popup);
        const popupLink = popupElement.querySelector(`.${popupClassNames.titleLink}`);
        expect(popupLink).toHaveFocus();

        popupLink.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Tab' }));

        expect(closeButton).toHaveFocus();

        markerElement.focus();
        markerElement.dispatchEvent(
            new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Tab', shiftKey: true }),
        );

        expect(closeButton).toHaveFocus();

        markerElement.focus();
        document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Escape' }));

        expect(popup.remove).toHaveBeenCalledTimes(1);
        expect(activePopupRef.current).toBeNull();
        expect(markerElement).toHaveFocus();

        document.body.appendChild(popupElement);
        popupEventHandlers.open();

        expect(activePopupRef.current).toBe(popup);
        expect(popupElement.querySelector(`.${popupClassNames.titleLink}`)).toHaveFocus();
    });
});
