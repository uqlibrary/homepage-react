import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cookies from 'js-cookie';

import ArtTrailApp from './index';
import { createMazemapPoiMarkers } from './MapTabContent';
import { ART_TRAIL_MAP_POIS } from './mapPois';
import { trailPages } from './pages';

jest.mock('js-cookie', () => ({
    get: jest.fn(),
    set: jest.fn(),
}));

const culturalDisclaimerText =
    'Aboriginal and Torres Strait Islander visitors are advised that the description of the following artwork may contain names of people who are deceased. Permission has been granted from the family for the artwork to be shown as part of the UQ Art Collection.';

const totalPages = trailPages.length - 1; // subtract initial welcome screen

describe('ArtTrailApp', () => {
    beforeEach(() => {
        Cookies.get.mockReset();
        Cookies.set.mockReset();
        Cookies.get.mockReturnValue(undefined);
    });

    it('renders the fixed app shell and sets the document title', () => {
        render(<ArtTrailApp />);

        expect(screen.getByTestId('art-trail-app')).toBeInTheDocument();
        expect(screen.getByText(culturalDisclaimerText)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'open navigation menu' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Trail' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Previous page' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Start the trail' })).toBeEnabled();
        expect(screen.queryByText(`Page 1 of ${totalPages}`)).not.toBeInTheDocument();
        expect(document.title).toBe('Art Trail App');
    });

    it('opens the menu and preserves the Trail page state across tab switches', async () => {
        const user = userEvent.setup();

        render(<ArtTrailApp />);

        await user.click(screen.getByRole('button', { name: 'open navigation menu' }));

        expect(
            screen.getByRole('menuitem', { name: 'Indigenous art and Library discovery trail' }),
        ).toBeInTheDocument();
        await user.click(screen.getByRole('menuitem', { name: 'Indigenous art and Library discovery trail' }));

        await user.click(screen.getByRole('button', { name: 'Start the trail' }));
        expect(screen.getByRole('button', { name: 'Previous page' })).toBeEnabled();
        expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled();
        expect(screen.queryByText(`Page 1 of ${totalPages}`)).not.toBeInTheDocument();
        expect(screen.getByText(`1 / ${totalPages}`)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'About the artwork' })).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Map' }));
        expect(screen.queryByRole('button', { name: 'Previous page' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Next page' })).not.toBeInTheDocument();
        expect(screen.queryByText('Find your way through the trail')).not.toBeInTheDocument();
        expect(screen.getByTestId('mazemap-container')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Trail' }));
        expect(screen.getByRole('button', { name: 'Previous page' })).toBeEnabled();
        expect(screen.queryByText(`Page 1 of ${totalPages}`)).not.toBeInTheDocument();
        expect(screen.getByText(`1 / ${totalPages}`)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'About the artwork' })).toBeInTheDocument();
    });

    it('opens and closes the page drawer from a Trail page', async () => {
        const user = userEvent.setup();

        render(<ArtTrailApp />);

        await user.click(screen.getByRole('button', { name: 'Start the trail' }));
        await user.click(screen.getByRole('button', { name: 'More information about this artwork' }));

        expect(screen.getByRole('heading', { name: /Hector Tjupuru Burton/i })).toBeInTheDocument();
        expect(screen.getByText(/synthetic polymer paint on linen/i)).toBeInTheDocument();

        await user.keyboard('{Escape}');

        expect(screen.queryByRole('heading', { name: /Hector Tjupuru Burton/i })).not.toBeInTheDocument();
    });

    it('dismisses the cultural disclaimer across tabs and persists dismissal in a cookie', async () => {
        const user = userEvent.setup();

        render(<ArtTrailApp />);

        await user.click(screen.getByRole('button', { name: 'Dismiss cultural disclaimer' }));

        expect(Cookies.set).toHaveBeenCalledWith('ART_TRAIL_CULTURAL_DISCLAIMER_SEEN', 'true', { path: '/' });
        expect(screen.queryByText(culturalDisclaimerText)).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Map' }));
        expect(screen.queryByText(culturalDisclaimerText)).not.toBeInTheDocument();
    });

    it('does not render the cultural disclaimer when the dismissal cookie is true', () => {
        Cookies.get.mockReturnValue('true');

        render(<ArtTrailApp />);

        expect(screen.queryByText(culturalDisclaimerText)).not.toBeInTheDocument();
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
        expect(popupSetDOMContent.mock.calls[0][0].textContent).toContain(ART_TRAIL_MAP_POIS[0].popupTitle);
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
