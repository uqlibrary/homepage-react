import React from 'react';

import { act, rtlRender, waitFor } from 'test-utils';

import JourneyBreadcrumbs, {
    buildJourneyBreadcrumbHtml,
    buildJourneyBreadcrumbItems,
    cleanupJourneyBreadcrumbs,
    getJourneyBreadcrumbSiteHeader,
    removeJourneyBreadcrumbsFromHeader,
    syncJourneyBreadcrumbs,
} from 'modules/Pages/BookableSpaces/SpacesListPage/SimpleListPage/components/JourneyBreadcrumbs';

describe('JourneyBreadcrumbs', () => {
    const setupSiteHeader = () => {
        const siteHeader = document.createElement('uq-site-header');
        const shadowRoot = siteHeader.attachShadow({ mode: 'open' });
        const breadcrumbNav = document.createElement('ol');
        breadcrumbNav.id = 'breadcrumb_nav';
        shadowRoot.appendChild(breadcrumbNav);
        document.body.appendChild(siteHeader);
    };

    afterEach(() => {
        document.querySelectorAll('uq-site-header').forEach(node => node.remove());
    });

    it('builds breadcrumb html with and without hrefs and removes matching nodes safely', () => {
        const items = [
            { label: 'Results', href: '/spaces/results' },
            { label: 'Space details' },
        ];

        const html = buildJourneyBreadcrumbHtml(items);

        expect(html).toHaveLength(2);
        expect(html[0]).toContain('href="/spaces/results"');
        expect(html[1]).toContain('<span class="uq-breadcrumb__link">Space details</span>');

        const parent = document.createElement('div');
        const matchingNode = document.createElement('li');
        matchingNode.setAttribute('data-journey-breadcrumb', 'true');
        const otherNode = document.createElement('li');
        parent.appendChild(matchingNode);
        parent.appendChild(otherNode);

        removeJourneyBreadcrumbsFromHeader(parent);
        expect(parent.querySelectorAll('[data-journey-breadcrumb="true"]').length).toBe(0);
        expect(() => removeJourneyBreadcrumbsFromHeader(null)).not.toThrow();
    });

    it('builds journey breadcrumb items for landing, results, and detail states with safe defaults', () => {
        expect(buildJourneyBreadcrumbItems({ view: 'landing' })).toEqual([]);
        expect(buildJourneyBreadcrumbItems({ view: 'results' })).toEqual([{ label: 'Results' }]);

        const detailsItems = buildJourneyBreadcrumbItems({
            view: 'details',
            selectedIntentId: 'quiet',
            navigateToView: jest.fn(),
            setSelectedSpace: jest.fn(),
        });

        expect(detailsItems).toHaveLength(2);
        expect(detailsItems[0]).toMatchObject({ label: 'Results' });
        expect(detailsItems[0].href).toContain('/spaces/results');
        expect(detailsItems[1]).toEqual({ label: 'Space details' });

        const safeItems = buildJourneyBreadcrumbItems({
            view: 'details',
            selectedIntentId: 'quiet',
        });
        expect(safeItems[0].href).toContain('/spaces/results');
        expect(typeof safeItems[0].onClick).toBe('function');
    });

    it('covers header lookup, cleanup, missing nav, empty items, and listener registration', () => {
        document.body.innerHTML = '';
        expect(getJourneyBreadcrumbSiteHeader()).toBeNull();

        const siteHeaderWithLightCleanup = document.createElement('uq-site-header');
        const cleanupListener = jest.fn();
        document.body.appendChild(siteHeaderWithLightCleanup);
        expect(getJourneyBreadcrumbSiteHeader()).toBe(siteHeaderWithLightCleanup);
        cleanupJourneyBreadcrumbs({ siteHeader: siteHeaderWithLightCleanup, cleanupListeners: [cleanupListener] });
        expect(cleanupListener).toHaveBeenCalledTimes(1);

        const siteHeaderWithoutNav = document.createElement('uq-site-header');
        siteHeaderWithoutNav.attachShadow({ mode: 'open' });
        document.body.appendChild(siteHeaderWithoutNav);
        expect(syncJourneyBreadcrumbs({ items: [], siteHeader: siteHeaderWithoutNav })).toBe(false);

        const withNav = document.createElement('uq-site-header');
        const shadowRoot = withNav.attachShadow({ mode: 'open' });
        const breadcrumbNav = document.createElement('ol');
        breadcrumbNav.id = 'breadcrumb_nav';
        shadowRoot.appendChild(breadcrumbNav);
        document.body.appendChild(withNav);

        expect(syncJourneyBreadcrumbs({ items: [], siteHeader: withNav })).toBe(true);

        const onClick = jest.fn();
        const result = syncJourneyBreadcrumbs({
            items: [
                { label: 'Results', href: '/spaces/results', onClick },
                { label: 'Space details' },
            ],
            siteHeader: withNav,
        });

        expect(result).toEqual({
            cleanupListeners: expect.any(Array),
            success: true,
        });
        expect(withNav.shadowRoot.querySelectorAll('[data-journey-breadcrumb="true"]').length).toBe(2);
        const resultsLink = withNav.shadowRoot.querySelector('#journey-site-breadcrumb-0');
        expect(resultsLink).toBeTruthy();
        resultsLink.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(onClick).toHaveBeenCalledTimes(1);

        const staleNavHeader = document.createElement('uq-site-header');
        const staleShadowRoot = staleNavHeader.attachShadow({ mode: 'open' });
        const staleBreadcrumbNav = document.createElement('ol');
        staleBreadcrumbNav.id = 'breadcrumb_nav';
        staleShadowRoot.appendChild(staleBreadcrumbNav);
        document.body.appendChild(staleNavHeader);
        const staleQuerySelector = staleBreadcrumbNav.querySelector.bind(staleBreadcrumbNav);
        staleBreadcrumbNav.querySelector = jest.fn().mockImplementation(selector => {
            if (selector === '#journey-site-breadcrumb-0') return null;
            return staleQuerySelector(selector);
        });
        const staleResult = syncJourneyBreadcrumbs({
            items: [{ label: 'Retry', href: '/spaces/results', onClick }],
            siteHeader: staleNavHeader,
        });
        expect(staleResult).toEqual({
            cleanupListeners: expect.any(Array),
            success: true,
        });
    });

    it('covers helper defaults and missing-header retry behavior', () => {
        expect(cleanupJourneyBreadcrumbs()).toBe(true);
        expect(syncJourneyBreadcrumbs()).toBe(false);
        expect(syncJourneyBreadcrumbs({ siteHeader: null })).toBe(false);
        expect(buildJourneyBreadcrumbItems({ view: 'unknown' })).toEqual([]);
        expect(buildJourneyBreadcrumbItems({ view: 'landing' })).toEqual([]);
        expect(buildJourneyBreadcrumbItems({ view: 'results' })).toEqual([{ label: 'Results' }]);
        expect(buildJourneyBreadcrumbItems({ view: 'details', selectedIntentId: 'quiet' })).toHaveLength(2);

        jest.useFakeTimers();
        const noHeaderRender = rtlRender(
            <JourneyBreadcrumbs
                view="details"
                selectedIntent={{ id: 'quiet', label: 'Quiet space' }}
                selectedIntentId="quiet"
                navigateToView={jest.fn()}
                setSelectedSpace={jest.fn()}
            />,
        );
        expect(() => noHeaderRender.unmount()).not.toThrow();

        const siteHeader = document.createElement('uq-site-header');
        const shadowRoot = siteHeader.attachShadow({ mode: 'open' });
        document.body.appendChild(siteHeader);

        const setIntervalSpy = jest.spyOn(window, 'setInterval');
        const clearIntervalSpy = jest.spyOn(window, 'clearInterval');

        const { unmount } = rtlRender(
            <JourneyBreadcrumbs
                view="details"
                selectedIntent={{ id: 'quiet', label: 'Quiet space' }}
                selectedIntentId="quiet"
                navigateToView={jest.fn()}
                setSelectedSpace={jest.fn()}
            />,
        );

        expect(setIntervalSpy).toHaveBeenCalled();
        act(() => jest.advanceTimersByTime(100));
        expect(clearIntervalSpy).not.toHaveBeenCalled();

        const breadcrumbNav = document.createElement('ol');
        breadcrumbNav.id = 'breadcrumb_nav';
        shadowRoot.appendChild(breadcrumbNav);

        act(() => jest.advanceTimersByTime(100));
        expect(shadowRoot.querySelectorAll('[data-journey-breadcrumb="true"]').length).toBe(2);

        unmount();
        expect(clearIntervalSpy).toHaveBeenCalled();
        jest.useRealTimers();
    });

    it('handles missing shadow roots and non-function cleanup listeners safely', () => {
        const noShadowSiteHeader = document.createElement('uq-site-header');
        document.body.appendChild(noShadowSiteHeader);

        expect(syncJourneyBreadcrumbs({ items: [{ label: 'Results', href: '/spaces/results' }], siteHeader: noShadowSiteHeader })).toBe(false);
        expect(() =>
            cleanupJourneyBreadcrumbs({
                siteHeader: noShadowSiteHeader,
                cleanupListeners: [null, jest.fn()],
            }),
        ).not.toThrow();

        const navigateToView = jest.fn();
        const setSelectedSpace = jest.fn();

        expect(() => {
            rtlRender(
                <JourneyBreadcrumbs
                    view="results"
                    selectedIntent={{ id: 'quiet', label: 'Quiet space' }}
                    selectedIntentId="quiet"
                    navigateToView={navigateToView}
                    setSelectedSpace={setSelectedSpace}
                />,
            );
        }).not.toThrow();

        expect(document.querySelectorAll('[data-journey-breadcrumb="true"]').length).toBe(0);
    });

    it('does not prevent default navigation for breadcrumb links', async () => {
        const navigateToView = jest.fn();
        const setSelectedIntentId = jest.fn();
        const setSelectedSpace = jest.fn();

        setupSiteHeader();

        rtlRender(
            <JourneyBreadcrumbs
                view="details"
                selectedIntent={{ id: 'quiet', label: 'Quiet space' }}
                selectedIntentId="quiet"
                navigateToView={navigateToView}
                setSelectedIntentId={setSelectedIntentId}
                setSelectedSpace={setSelectedSpace}
            />,
        );

        const breadcrumbLink = await waitFor(() => {
            const node = document
                .querySelector('uq-site-header')
                ?.shadowRoot?.querySelector('#journey-site-breadcrumb-0');
            expect(node).toBeTruthy();
            return node;
        });

        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
        breadcrumbLink.dispatchEvent(clickEvent);

        expect(clickEvent.defaultPrevented).toBe(false);
        expect(setSelectedSpace).toHaveBeenCalledWith(null);
        expect(navigateToView).toHaveBeenCalledWith('results', { intentId: 'quiet', spaceId: null });
    });

    it('waits for the breadcrumb nav to appear and cleans up on unmount', async () => {
        const siteHeader = document.createElement('uq-site-header');
        const shadowRoot = siteHeader.attachShadow({ mode: 'open' });
        document.body.appendChild(siteHeader);

        const navigateToView = jest.fn();
        const setSelectedSpace = jest.fn();

        const { unmount } = rtlRender(
            <JourneyBreadcrumbs
                view="results"
                selectedIntent={{ id: 'quiet', label: 'Quiet space' }}
                selectedIntentId="quiet"
                navigateToView={navigateToView}
                setSelectedSpace={setSelectedSpace}
            />,
        );

        const breadcrumbNav = document.createElement('ol');
        breadcrumbNav.id = 'breadcrumb_nav';
        shadowRoot.appendChild(breadcrumbNav);

        await waitFor(() => {
            expect(shadowRoot.querySelectorAll('[data-journey-breadcrumb="true"]').length).toBe(1);
        });

        expect(shadowRoot.querySelector('[data-journey-breadcrumb="true"]')).toBeTruthy();

        unmount();
        expect(shadowRoot.querySelectorAll('[data-journey-breadcrumb="true"]').length).toBe(0);
    });

    it('does not throw when breadcrumb callbacks are not provided on the standalone detail page', async () => {
        setupSiteHeader();

        rtlRender(
            <JourneyBreadcrumbs
                view="details"
                selectedIntent={{ id: 'quiet', label: 'Quiet space' }}
                selectedIntentId="quiet"
                navigateToView={jest.fn()}
                setSelectedIntentId={jest.fn()}
            />,
        );

        const breadcrumbLink = await waitFor(() => {
            const node = document
                .querySelector('uq-site-header')
                ?.shadowRoot?.querySelector('#journey-site-breadcrumb-0');
            expect(node).toBeTruthy();
            return node;
        });

        expect(() => {
            breadcrumbLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        }).not.toThrow();
    });
});
