import React from 'react';
import PropTypes from 'prop-types';

import { breadcrumbs } from 'config/routes';

import { serialiseJourneyUrl } from 'modules/Pages/BookableSpaces/Shared/spacesHelpers';

export const removeJourneyBreadcrumbsFromHeader = breadcrumbParent => {
    breadcrumbParent?.querySelectorAll('[data-journey-breadcrumb="true"]').forEach(node => node.remove());
};

export const getJourneyBreadcrumbSiteHeader = () => document.querySelector('uq-site-header');

export const cleanupJourneyBreadcrumbs = ({ siteHeader, cleanupListeners = [] } = {}) => {
    cleanupListeners.forEach(listener => {
        if (typeof listener === 'function') {
            listener();
        }
    });

    const breadcrumbParent = siteHeader?.shadowRoot?.getElementById('breadcrumb_nav');
    removeJourneyBreadcrumbsFromHeader(breadcrumbParent);
    return true;
};

export const buildJourneyBreadcrumbHtml = items =>
    items.map((item, index) => {
        const id = `journey-site-breadcrumb-${index}`;
        const commonAttrs = `class="uq-breadcrumb__link" data-journey-breadcrumb-link="true" id="${id}"`;
        if (item.href) {
            return `<li class="uq-breadcrumb__item" data-journey-breadcrumb="true"><a ${commonAttrs} href="${item.href}">${item.label}</a></li>`;
        }
        return `<li class="uq-breadcrumb__item" data-journey-breadcrumb="true"><span class="uq-breadcrumb__link">${item.label}</span></li>`;
    });

export const buildJourneyBreadcrumbItems = ({ view, selectedIntentId, navigateToView, setSelectedSpace }) => {
    const safeNavigateToView =
        typeof navigateToView === 'function' ? navigateToView : /* istanbul ignore next */ () => {};
    const safeSetSelectedSpace = typeof setSelectedSpace === 'function' ? setSelectedSpace : () => {};

    const buildEntry = (label, nextView, intentId, spaceId, onClick) => ({
        label,
        href: serialiseJourneyUrl({ view: nextView, intentId, spaceId }),
        onClick,
    });

    if (view === 'landing') return [];

    const items = [];

    if (view === 'results') {
        items.push({ label: 'Results' });
        return items;
    }

    if (view === 'details') {
        items.push(
            buildEntry('Results', 'results', selectedIntentId, null, () => {
                safeSetSelectedSpace(null);
                safeNavigateToView('results', { intentId: selectedIntentId, spaceId: null });
            }),
        );
        items.push({ label: 'Space details' });
    }

    return items;
};

export const syncJourneyBreadcrumbs = ({ items = [], siteHeader, cleanupListeners = [] } = {}) => {
    if (!siteHeader) {
        return false;
    }

    const breadcrumbParent = siteHeader.shadowRoot?.getElementById('breadcrumb_nav');
    if (!breadcrumbParent) {
        return false;
    }

    removeJourneyBreadcrumbsFromHeader(breadcrumbParent);
    if (!items.length) {
        return true;
    }

    buildJourneyBreadcrumbHtml(items).forEach(html => {
        breadcrumbParent.insertAdjacentHTML('beforeend', html);
    });

    const registeredListeners = items.flatMap((item, index) => {
        if (typeof item.onClick !== 'function' || !item.href) return [];
        const el = breadcrumbParent.querySelector(`#journey-site-breadcrumb-${index}`);
        if (!el) return [];
        const handler = () => item.onClick();
        el.addEventListener('click', handler);
        return [() => el.removeEventListener('click', handler)];
    });

    return {
        success: true,
        cleanupListeners: [...cleanupListeners, ...registeredListeners],
    };
};

const JourneyBreadcrumbs = ({
    view,
    selectedIntent,
    selectedIntentId,
    navigateToView,
    setSelectedIntentId,
    setSelectedSpace,
}) => {
    const items = React.useMemo(
        () =>
            buildJourneyBreadcrumbItems({
                view,
                selectedIntent,
                selectedIntentId,
                navigateToView,
                setSelectedIntentId,
                setSelectedSpace,
            }),
        [view, selectedIntent, selectedIntentId, navigateToView, setSelectedIntentId, setSelectedSpace],
    );

    React.useEffect(() => {
        const siteHeader = getJourneyBreadcrumbSiteHeader();

        let intervalId = null;
        let cleanupListeners = [];

        const cleanup = () => {
            if (intervalId) window.clearInterval(intervalId);
            cleanupJourneyBreadcrumbs({ siteHeader, cleanupListeners });
        };

        if (!siteHeader) {
            return cleanup;
        }

        siteHeader.setAttribute('secondleveltitle', breadcrumbs.bookablespaces.title);
        siteHeader.setAttribute('secondLevelUrl', breadcrumbs.bookablespaces.pathname);

        const sync = () => {
            const synced = syncJourneyBreadcrumbs({ items, siteHeader, cleanupListeners });
            if (synced === false) {
                return false;
            }

            cleanupListeners = synced.cleanupListeners;
            return true;
        };

        if (!sync()) {
            intervalId = window.setInterval(() => {
                if (sync()) window.clearInterval(intervalId);
            }, 100);
        }

        return cleanup;
    }, [items]);

    return null;
};

JourneyBreadcrumbs.propTypes = {
    view: PropTypes.string.isRequired,
    selectedIntent: PropTypes.object,
    selectedIntentId: PropTypes.string,
    navigateToView: PropTypes.func.isRequired,
    setSelectedIntentId: PropTypes.func,
    setSelectedSpace: PropTypes.func,
};

export default JourneyBreadcrumbs;
