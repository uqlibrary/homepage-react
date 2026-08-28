import { useCallback } from 'react';

import trackingEvents from '../config/trackingEvents';

const useGoogleAnalytics = () => {
    const _track = useCallback((...args) => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(...args);
    }, []);

    const trackEvent = useCallback(
        (event, /* istanbul ignore next */ parameters = {}) => {
            _track({
                event,
                ...parameters,
            });
        },
        [_track],
    );

    /* convenience methods */

    const trackButtonClick = useCallback(
        (event = trackingEvents.ART_TRAIL_BUTTON_CLICK, /* istanbul ignore next */ parameters = {}) => {
            trackEvent(event, {
                ...parameters,
            });
        },
        [trackEvent],
    );

    const trackAccordionExpand = useCallback(
        (/* istanbul ignore next */ parameters = {}) => {
            trackEvent(trackingEvents.ART_TRAIL_ACCORDION_EXPAND, {
                ...parameters,
            });
        },
        [trackEvent],
    );

    const trackMapPoiClick = useCallback(
        (/* istanbul ignore next */ parameters = {}) => {
            trackEvent(trackingEvents.ART_TRAIL_MAP_POI_CLICK, {
                ...parameters,
            });
        },
        [trackEvent],
    );

    const trackPageView = useCallback(
        (/* istanbul ignore next */ parameters = {}) => {
            trackEvent(trackingEvents.ART_TRAIL_PAGE_VIEW, {
                page_title: document.title,
                page_location: window.location.href,
                page_path: window.location.pathname,
                ...parameters,
            });
        },
        [trackEvent],
    );

    return { trackEvent, trackButtonClick, trackAccordionExpand, trackMapPoiClick, trackPageView };
};

export default useGoogleAnalytics;
