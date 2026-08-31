import React from 'react';
import { rtlRender, userEvent, waitFor } from 'test-utils';
import Cookies from 'js-cookie';

import ArtTrailApp from './index';
import { ART_TRAIL_MAP_POIS } from './config/mapPois';
import { trailPages } from './pages';
import { markerClassNames, popupClassNames } from './appShellStyles';
import trackingEvents from './config/trackingEvents';
import { createMazemapPoiMarkers } from './utils/mapUtils';

jest.mock('js-cookie', () => ({
    get: jest.fn(),
    set: jest.fn(),
}));

const culturalDisclaimerText =
    'Aboriginal and Torres Strait Islander peoples are advised that the following may contain images, voices or names of deceased persons in photographs, film, audio recordings or printed material';

const totalPages = trailPages.length - 1; // subtract initial welcome screen

const setup = () => rtlRender(<ArtTrailApp />);

describe('ArtTrailApp', () => {
    beforeEach(() => {
        delete window.dataLayer;
        Cookies.get.mockReset();
        Cookies.set.mockReset();
        Cookies.get.mockReturnValue(undefined);
    });

    it('tracks each selected Trail and Map page by title', async () => {
        const { getByRole } = setup();

        expect(window.dataLayer).toEqual([
            {
                event: trackingEvents.ART_TRAIL_PAGE_VIEW,
                page_title: trailPages[0].pageTitle,
            },
        ]);

        await userEvent.click(getByRole('button', { name: 'Start the trail' }));
        await userEvent.click(getByRole('button', { name: 'Art Trail by location on a map' }));

        expect(window.dataLayer).toEqual([
            {
                event: trackingEvents.ART_TRAIL_PAGE_VIEW,
                page_title: trailPages[0].pageTitle,
            },
            {
                event: trackingEvents.ART_TRAIL_PAGE_VIEW,
                page_title: trailPages[1].pageTitle,
            },
            {
                event: trackingEvents.ART_TRAIL_PAGE_VIEW,
                page_title: 'Art Trail Map of St Lucia campus',
            },
        ]);
    });

    it('renders the fixed app shell and sets the document title', () => {
        const { getByTestId, getByRole, queryByRole, queryByText } = setup();

        expect(getByTestId('art-trail-app')).toBeInTheDocument();
        expect(getByTestId('culturalDisclaimer')).toHaveTextContent(culturalDisclaimerText);
        expect(getByRole('button', { name: 'open navigation menu' })).toBeInTheDocument();
        expect(getByRole('button', { name: 'Art Trail in sequential order' })).toBeInTheDocument();
        expect(queryByRole('button', { name: 'Previous page' })).not.toBeInTheDocument();
        expect(getByRole('button', { name: 'Start the trail' })).toBeEnabled();
        expect(queryByText(`Page 1 of ${totalPages}`)).not.toBeInTheDocument();
        expect(document.title).toBe('The University of Queensland Indigenous Art and Library Discovery Trail');
    });

    it('moves focus to the page heading on initial load and Map tab navigation', async () => {
        const { getByRole } = setup();

        await waitFor(() =>
            expect(
                getByRole('heading', { level: 1, name: 'Indigenous art and Library discovery trail' }),
            ).toHaveFocus(),
        );

        await userEvent.click(getByRole('button', { name: 'Art Trail by location on a map' }));

        await waitFor(() =>
            expect(getByRole('heading', { level: 1, name: 'Art Trail Map of St Lucia campus' })).toHaveFocus(),
        );
    });

    it('opens the menu and preserves the Trail page state across tab switches', async () => {
        const { getByRole, getByText, getByTestId, queryByRole, queryByText } = setup();

        await userEvent.click(getByRole('button', { name: 'open navigation menu' }));

        expect(getByRole('menuitem', { name: 'Indigenous art and Library discovery trail' })).toBeInTheDocument();
        expect(getByRole('menuitem', { name: /Hector Tjupuru Burton/i }).querySelector('em')).toHaveTextContent(
            'Punu Tjukurpa',
        );
        await userEvent.click(getByRole('menuitem', { name: 'Indigenous art and Library discovery trail' }));

        await userEvent.click(getByRole('button', { name: 'Start the trail' }));
        await waitFor(() => expect(getByRole('heading', { level: 1, name: /Hector Tjupuru Burton/i })).toHaveFocus());
        expect(getByRole('button', { name: 'Previous page' })).toBeEnabled();
        expect(getByRole('button', { name: 'Next page' })).toBeEnabled();
        expect(queryByText(`Page 1 of ${totalPages}`)).not.toBeInTheDocument();
        expect(getByText(`1 / ${totalPages}`)).toBeInTheDocument();
        expect(getByRole('button', { name: 'View more' })).toBeInTheDocument();

        await userEvent.click(getByRole('button', { name: 'Art Trail by location on a map' }));
        expect(queryByRole('button', { name: 'Previous page' })).not.toBeInTheDocument();
        expect(queryByRole('button', { name: 'Next page' })).not.toBeInTheDocument();
        expect(queryByText('Find your way through the trail')).not.toBeInTheDocument();
        expect(getByTestId('mazemap-container')).toBeInTheDocument();

        await userEvent.click(getByRole('button', { name: 'Art Trail in sequential order' }));
        expect(getByRole('button', { name: 'Previous page' })).toBeEnabled();
        expect(queryByText(`Page 1 of ${totalPages}`)).not.toBeInTheDocument();
        expect(getByText(`1 / ${totalPages}`)).toBeInTheDocument();
        expect(getByRole('button', { name: 'View more' })).toBeInTheDocument();
    });

    it('opens and closes the page drawer from a Trail page', async () => {
        const { getByRole, getByText, queryByText } = setup();

        await userEvent.click(getByRole('button', { name: 'Start the trail' }));
        await userEvent.click(getByRole('button', { name: 'More information about this artwork' }));

        expect(getByRole('heading', { name: /Hector Tjupuru Burton/i })).toBeInTheDocument();
        expect(getByText(/synthetic polymer paint on linen/i)).toBeInTheDocument();

        await userEvent.keyboard('{Escape}');

        expect(queryByText(/synthetic polymer paint on linen/i)).not.toBeInTheDocument();
    });

    it('moves focus to the page heading after menu navigation', async () => {
        const { getByRole } = setup();

        await userEvent.click(getByRole('button', { name: 'open navigation menu' }));
        await userEvent.click(getByRole('menuitem', { name: /Lily Kelly Napangardi/i }));

        await waitFor(() => expect(getByRole('heading', { level: 1, name: /Lily Kelly Napangardi/i })).toHaveFocus());
    });

    it('moves focus to the page heading after keyboard navigation', async () => {
        const { getByRole } = setup();
        const startButton = getByRole('button', { name: 'Start the trail' });

        startButton.focus();
        await userEvent.keyboard('{Enter}');

        await waitFor(() => expect(getByRole('heading', { level: 1, name: /Hector Tjupuru Burton/i })).toHaveFocus());
    });

    it('moves focus to the page heading after Space-key navigation', async () => {
        const { getByRole } = setup();
        const startButton = getByRole('button', { name: 'Start the trail' });

        startButton.focus();
        await userEvent.keyboard(' ');

        await waitFor(() => expect(getByRole('heading', { level: 1, name: /Hector Tjupuru Burton/i })).toHaveFocus());
        expect(startButton).not.toHaveFocus();
    });

    it('resets the scroll position when changing Trail pages', async () => {
        const { getByRole, getByTestId } = setup();

        const scrollContainer = getByTestId('art-trail-scroll-container');

        Object.defineProperty(scrollContainer, 'scrollTop', {
            configurable: true,
            writable: true,
            value: 240,
        });

        await userEvent.click(getByRole('button', { name: 'Start the trail' }));

        expect(scrollContainer.scrollTop).toBe(0);

        scrollContainer.scrollTop = 180;

        await userEvent.click(getByRole('button', { name: 'Next page' }));

        expect(scrollContainer.scrollTop).toBe(0);
    });

    it('dismisses the cultural disclaimer across tabs and persists dismissal in a cookie', async () => {
        const { getByRole, queryByText } = setup();

        await userEvent.click(getByRole('button', { name: 'Dismiss cultural disclaimer' }));

        expect(Cookies.set).toHaveBeenCalledWith('ART_TRAIL_CULTURAL_DISCLAIMER_SEEN', 'true', { path: '/' });
        expect(queryByText(culturalDisclaimerText)).not.toBeInTheDocument();

        await userEvent.click(getByRole('button', { name: 'Art Trail by location on a map' }));
        expect(queryByText(culturalDisclaimerText)).not.toBeInTheDocument();
    });

    it('does not render the cultural disclaimer when the dismissal cookie is true', () => {
        Cookies.get.mockReturnValue('true');

        const { queryByText } = setup();

        expect(queryByText(culturalDisclaimerText)).not.toBeInTheDocument();
    });

    it('creates a marker for each hardcoded map POI', () => {
        const onSelectTrailPage = jest.fn();
        const activePopupRef = { current: null };
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
        const popupSetDOMContent = jest.fn(function setDOMContent(content) {
            this.content = content;
            return this;
        });
        const popupRemove = jest.fn(function remove() {
            return this;
        });
        const popupIsOpen = jest.fn(() => true);
        const popupConstructor = jest.fn(function Popup() {
            this.setDOMContent = popupSetDOMContent;
            this.remove = popupRemove;
            this.isOpen = popupIsOpen;
        });
        const map = { id: 'mock-map' };

        const markers = createMazemapPoiMarkers({
            Mazemap: {
                ZLevelMarker: markerConstructor,
                Popup: popupConstructor,
            },
            map,
            onSelectTrailPage,
            activePopupRef,
            markerClassNames,
            popupClassNames,
        });

        expect(markers).toHaveLength(ART_TRAIL_MAP_POIS.length);
        expect(markerConstructor).toHaveBeenCalledTimes(ART_TRAIL_MAP_POIS.length);
        expect(markerConstructor).toHaveBeenNthCalledWith(
            1,
            expect.any(HTMLElement),
            expect.objectContaining({ zLevel: ART_TRAIL_MAP_POIS[0].zLevel, offset: [0, -9] }),
        );
        expect(markerConstructor.mock.calls[0][0].textContent).toBe(`${ART_TRAIL_MAP_POIS[0].trailStepIndex}`);
        expect(markerConstructor.mock.calls[0][0].className).toContain('artTrailMapMarker');
        expect(markerConstructor.mock.calls[0][0].style.getPropertyValue('--art-trail-marker-color')).toBe(
            ART_TRAIL_MAP_POIS[0].color,
        );
        expect(setLngLat).toHaveBeenNthCalledWith(1, [ART_TRAIL_MAP_POIS[0].lng, ART_TRAIL_MAP_POIS[0].lat]);
        expect(addTo).toHaveBeenCalledTimes(ART_TRAIL_MAP_POIS.length);
        expect(addTo).toHaveBeenCalledWith(map);
        expect(popupSetDOMContent).toHaveBeenNthCalledWith(1, expect.any(HTMLElement));
        expect(popupSetDOMContent.mock.calls[0][0].querySelector('img').getAttribute('src')).toBe(
            ART_TRAIL_MAP_POIS[0].popupThumbnailSrc,
        );
        expect(popupSetDOMContent.mock.calls[0][0].textContent).toContain(ART_TRAIL_MAP_POIS[0].menuTitle);
        expect(popupSetDOMContent.mock.calls[0][0].textContent).toContain('Punu Tjukurpa 2013');
        expect(popupSetDOMContent.mock.calls[0][0].textContent).toContain(ART_TRAIL_MAP_POIS[0].popupLevelLabel);
        expect(popupSetDOMContent.mock.calls[0][0].querySelector(`.${'artTrailMapPopupDescription'}`).innerHTML).toBe(
            ART_TRAIL_MAP_POIS[0].popupDescription,
        );
        markerConstructor.mock.calls[0][0].click();
        markerConstructor.mock.calls[1][0].click();
        expect(popupConstructor.mock.instances[0].remove).toHaveBeenCalledTimes(1);
        popupSetDOMContent.mock.calls[0][0].querySelector('a').click();
        expect(onSelectTrailPage).toHaveBeenCalledWith(ART_TRAIL_MAP_POIS[0].trailStepIndex);
    });
});
