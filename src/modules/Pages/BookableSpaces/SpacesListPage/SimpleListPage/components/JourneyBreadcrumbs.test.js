import React from 'react';

import { rtlRender, waitFor } from 'test-utils';

import JourneyBreadcrumbs from 'modules/Pages/BookableSpaces/SpacesListPage/SimpleListPage/components/JourneyBreadcrumbs';

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

    it('persists return filter state target before navigating to results', async () => {
        const navigateToView = jest.fn();
        const setSelectedIntentId = jest.fn();
        const setSelectedSpace = jest.fn();
        const persistJourneyReturnFilterState = jest.fn();

        setupSiteHeader();

        rtlRender(
            <JourneyBreadcrumbs
                view="details"
                selectedIntent={{ id: 'quiet', label: 'Quiet space' }}
                selectedIntentId="quiet"
                navigateToView={navigateToView}
                setSelectedIntentId={setSelectedIntentId}
                setSelectedSpace={setSelectedSpace}
                persistJourneyReturnFilterState={persistJourneyReturnFilterState}
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

        expect(persistJourneyReturnFilterState).toHaveBeenCalledTimes(1);
        expect(persistJourneyReturnFilterState.mock.calls[0][0]).toContain('/spaces/results/filters=quiet');
    });
});
