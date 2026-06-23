import React from 'react';
import PropTypes from 'prop-types';

import { breadcrumbs } from 'config/routes';
import { serialiseJourneyUrl } from 'modules/Pages/BookableSpaces/journeyHelpers';

export const removeJourneyBreadcrumbsFromHeader = breadcrumbParent => {
    breadcrumbParent?.querySelectorAll('[data-journey-breadcrumb="true"]').forEach(node => node.remove());
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

export const buildJourneyBreadcrumbItems = ({ view, selectedIntent, selectedIntentId, navigateToView, setSelectedIntentId, setSelectedSpace }) => {
    const buildEntry = (label, nextView, intentId, spaceId, onClick) => ({
        label,
        href: serialiseJourneyUrl({ view: nextView, intentId, spaceId }),
        onClick,
    });

    if (view === 'landing') return [];

    const items = [];

    if (view === 'intent') {
        items.push({ label: 'Choose an experience' });
        return items;
    }

    items.push(
        buildEntry('Choose an experience', 'intent', null, null, () => {
            setSelectedIntentId(null);
            setSelectedSpace(null);
            navigateToView('intent', { intentId: null, spaceId: null });
        }),
    );

    if (view === 'results') {
        items.push({ label: selectedIntent?.label || 'Results' });
        return items;
    }

    if (view === 'details') {
        items.push(
            buildEntry(selectedIntent?.label || 'Results', 'results', selectedIntentId, null, () => {
                setSelectedSpace(null);
                navigateToView('results', { intentId: selectedIntentId, spaceId: null });
            }),
        );
        items.push({ label: 'Space details' });
    }

    return items;
};

const JourneyBreadcrumbs = ({ view, selectedIntent, selectedIntentId, navigateToView, setSelectedIntentId, setSelectedSpace }) => {
    const items = React.useMemo(
        () => buildJourneyBreadcrumbItems({ view, selectedIntent, selectedIntentId, navigateToView, setSelectedIntentId, setSelectedSpace }),
        [view, selectedIntent, selectedIntentId, navigateToView, setSelectedIntentId, setSelectedSpace],
    );

    React.useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        if (!siteHeader) return;

        siteHeader.setAttribute('secondleveltitle', breadcrumbs.bookablespaces.title);
        siteHeader.setAttribute('secondLevelUrl', breadcrumbs.bookablespaces.pathname);

        let intervalId = null;
        let cleanupListeners = [];

        const sync = () => {
            const breadcrumbParent = siteHeader.shadowRoot?.getElementById('breadcrumb_nav');
            if (!breadcrumbParent) return false;

            removeJourneyBreadcrumbsFromHeader(breadcrumbParent);
            if (!items.length) return true;

            buildJourneyBreadcrumbHtml(items).forEach(html => {
                breadcrumbParent.insertAdjacentHTML('beforeend', html);
            });

            cleanupListeners = items.flatMap((item, index) => {
                if (typeof item.onClick !== 'function' || !item.href) return [];
                const el = breadcrumbParent.querySelector(`#journey-site-breadcrumb-${index}`);
                if (!el) return [];
                const handler = e => { e.preventDefault(); item.onClick(); };
                el.addEventListener('click', handler);
                return [() => el.removeEventListener('click', handler)];
            });

            return true;
        };

        if (!sync()) {
            intervalId = window.setInterval(() => { if (sync()) window.clearInterval(intervalId); }, 100);
        }

        return () => {
            if (intervalId) window.clearInterval(intervalId);
            cleanupListeners.forEach(fn => fn());
            const breadcrumbParent = siteHeader.shadowRoot?.getElementById('breadcrumb_nav');
            removeJourneyBreadcrumbsFromHeader(breadcrumbParent);
        };
    }, [items]);

    return null;
};

JourneyBreadcrumbs.propTypes = {
    view: PropTypes.string.isRequired,
    selectedIntent: PropTypes.object,
    selectedIntentId: PropTypes.string,
    navigateToView: PropTypes.func.isRequired,
    setSelectedIntentId: PropTypes.func.isRequired,
    setSelectedSpace: PropTypes.func.isRequired,
};

export default JourneyBreadcrumbs;