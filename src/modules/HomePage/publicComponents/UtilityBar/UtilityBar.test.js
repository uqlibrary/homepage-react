import React from 'react';
import { act, fireEvent, rtlRender } from 'test-utils';

import UtilityBar from './UtilityBar';

jest.mock('./Locations', () => ({
    __esModule: true,
    default: () => (
        <div data-testid="locations-panel">
            <a className="locationLink" href="/locations">
                First location
            </a>
            <a id="homepage-hours-weeklyhours-link" href="/hours">
                See all hours
            </a>
        </div>
    ),
}));

function setup(props = {}) {
    // Need a Suspense wrapper because the component lazy loads ./Locations
    return rtlRender(
        <React.Suspense fallback={<div data-testid="locations-loading" />}>
            <UtilityBar
                libHours={null}
                libHoursLoading={false}
                libHoursError={false}
                vemcount={null}
                vemcountLoading={false}
                vemcountError={false}
                {...props}
            />
        </React.Suspense>,
    );
}

describe('UtilityBar', () => {
    afterEach(() => {
        document.querySelector('uq-site-header')?.remove();
    });

    it('renders its closed location panel controls', async () => {
        const { findByRole, findByTestId, getByTestId } = setup();
        const controller = await findByRole('button', { name: 'Show/hide Locations and hours panel' });

        expect(controller).toHaveAttribute('aria-expanded', 'false');
        expect(getByTestId('locations-wrapper')).toHaveAttribute('inert', 'true');
        expect(getByTestId('homepage-hours-bookit-link')).toHaveAttribute(
            'href',
            'https://uqbookit.uq.edu.au/#/app/booking-types/77b52dde-d704-4b6d-917e-e820f7df07cb',
        );
        expect(await findByTestId('locations-panel')).toBeInTheDocument();
    });

    it('removes second-level header attributes on mount', async () => {
        const siteHeader = document.createElement('uq-site-header');
        siteHeader.setAttribute('secondleveltitle', 'Library');
        siteHeader.setAttribute('secondLevelUrl', '/library');
        document.body.appendChild(siteHeader);

        const { findByRole } = setup();

        await findByRole('button', { name: 'Show/hide Locations and hours panel' });

        expect(siteHeader).not.toHaveAttribute('secondleveltitle');
        expect(siteHeader).not.toHaveAttribute('secondLevelUrl');
    });

    it('opens and closes the location panel when its controller is clicked', () => {
        const { getByRole, getByTestId } = setup();
        const controller = getByRole('button', { name: 'Show/hide Locations and hours panel' });
        const panel = getByTestId('locations-wrapper');

        fireEvent.click(controller);

        expect(controller).toHaveAttribute('aria-expanded', 'true');
        expect(controller).toHaveClass('panel-open');
        expect(panel).not.toHaveAttribute('inert');
        expect(panel).toHaveClass('locations-wrapper-open');

        fireEvent.click(controller);

        expect(controller).toHaveAttribute('aria-expanded', 'false');
        expect(controller).toHaveClass('panel-closed');
        expect(panel).toHaveAttribute('inert', 'true');
        expect(panel).not.toHaveClass('locations-wrapper-open');
    });

    it('opens with Enter and moves focus to the first location link', async () => {
        const { findByRole } = setup();
        const controller = await findByRole('button', { name: 'Show/hide Locations and hours panel' });
        const locationLink = await findByRole('link', { name: 'First location' });

        jest.useFakeTimers();

        fireEvent.keyDown(controller, { key: 'Enter' });
        act(() => {
            jest.runOnlyPendingTimers();
        });

        expect(controller).toHaveAttribute('aria-expanded', 'true');
        expect(locationLink).toHaveFocus();
        jest.useRealTimers();
    });

    it('keeps polling when the location link has not loaded yet', async () => {
        const { findByRole } = setup();
        const controller = await findByRole('button', { name: 'Show/hide Locations and hours panel' });
        const locationLink = await findByRole('link', { name: 'First location' });
        locationLink.remove();

        jest.useFakeTimers();
        fireEvent.keyDown(controller, { key: 'Enter' });
        act(() => {
            jest.advanceTimersByTime(100);
        });

        expect(controller).toHaveAttribute('aria-expanded', 'true');
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    it('ignores other controller keys and closes an open panel with Enter', async () => {
        const { findByRole, findByTestId } = setup();
        const controller = await findByRole('button', { name: 'Show/hide Locations and hours panel' });
        const panel = await findByTestId('locations-wrapper');

        fireEvent.keyDown(controller, { key: 'ArrowDown' });
        expect(controller).toHaveAttribute('aria-expanded', 'false');

        jest.useFakeTimers();
        fireEvent.keyDown(controller, { key: 'Enter' });
        act(() => {
            jest.runOnlyPendingTimers();
        });
        expect(controller).toHaveAttribute('aria-expanded', 'true');

        fireEvent.keyDown(controller, { key: 'Enter' });
        expect(controller).toHaveAttribute('aria-expanded', 'false');
        expect(panel).toHaveAttribute('inert', 'true');
        jest.useRealTimers();
    });

    it('closes on Tab from the final location link and focuses Book a room', () => {
        const { getByRole } = setup();
        const controller = getByRole('button', { name: 'Show/hide Locations and hours panel' });
        const lastLocationLink = getByRole('link', { name: 'See all hours' });
        const bookRoomLink = getByRole('link', { name: 'Find library study spaces' });

        fireEvent.click(controller);
        fireEvent.keyDown(lastLocationLink, { key: 'Tab' });

        expect(controller).toHaveAttribute('aria-expanded', 'false');
        expect(bookRoomLink).toHaveFocus();
    });

    it('keeps the panel open for clicks on its controller and non-Tab keys on the final link', async () => {
        const { findByRole } = setup();
        const controller = await findByRole('button', { name: 'Show/hide Locations and hours panel' });
        const lastLocationLink = await findByRole('link', { name: 'See all hours' });

        fireEvent.click(controller);
        fireEvent.mouseDown(controller);
        fireEvent.keyDown(lastLocationLink, { key: 'ArrowDown' });

        expect(controller).toHaveAttribute('aria-expanded', 'true');
    });

    it.each([
        ['outside click', () => fireEvent.mouseDown(document.body)],
        ['Escape key', () => fireEvent.keyDown(document, { key: 'Escape' })],
    ])('closes an open panel on %s', (_, closePanel) => {
        const { getByRole, getByTestId } = setup();
        const controller = getByRole('button', { name: 'Show/hide Locations and hours panel' });
        const panel = getByTestId('locations-wrapper');

        fireEvent.click(controller);
        closePanel();

        expect(controller).toHaveAttribute('aria-expanded', 'false');
        expect(panel).toHaveAttribute('inert', 'true');
    });
});
