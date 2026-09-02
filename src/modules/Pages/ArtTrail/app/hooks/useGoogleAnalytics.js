import { useCallback } from 'react';

import { event, category, action } from '../config/trackingEvents';

const useGoogleAnalytics = () => {
    const _track = useCallback((...args) => {
        console.log('Tracking event:', ...args);
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
        (/* istanbul ignore next */ parameters = {}) => {
            trackEvent(event.CLICK, {
                ...parameters,
            });
        },
        [trackEvent],
    );

    const trackAccordionExpand = useCallback(
        (/* istanbul ignore next */ parameters = {}) => {
            trackEvent(event.CLICK, {
                click_category: category.ACCORDION,
                click_action: action.EXPAND,
                ...parameters,
            });
        },
        [trackEvent],
    );

    const trackNavigationClick = useCallback(
        (/* istanbul ignore next */ parameters = {}) => {
            trackEvent(event.CLICK, {
                click_category: category.NAVIGATION,
                click_action: action.CLICK,
                ...parameters,
            });
        },
        [trackEvent],
    );

    const trackMapPoiClick = useCallback(
        (/* istanbul ignore next */ parameters = {}) => {
            trackEvent(event.CLICK, {
                click_category: category.MAP_POI,
                click_action: action.OPEN,
                ...parameters,
            });
        },
        [trackEvent],
    );

    const trackAudioPlayerClick = useCallback(
        (/* istanbul ignore next */ parameters = {}) => {
            trackEvent(event.CLICK, {
                click_category: category.AUDIO_PLAYER,
                click_action: action.CLICK,
                ...parameters,
            });
        },
        [trackEvent],
    );

    const trackAudioPlayerComplete = useCallback(
        (/* istanbul ignore next */ parameters = {}) => {
            trackEvent(event.CLICK, {
                click_category: category.AUDIO_PLAYER,
                click_action: action.COMPLETE,
                click_label: 'listen to this page',
                ...parameters,
            });
        },
        [trackEvent],
    );

    const trackInformationDrawerClick = useCallback(
        (/* istanbul ignore next */ parameters = {}) => {
            trackEvent(event.CLICK, {
                click_category: category.INFORMATION,
                click_action: action.CLICK,
                ...parameters,
            });
        },
        [trackEvent],
    );

    const trackPageView = useCallback(
        (pageTitle, pageNumber) => {
            trackEvent(event.PAGE_VIEW, {
                page_title: pageTitle,
                page_number: pageNumber,
            });
        },
        [trackEvent],
    );

    return {
        trackEvent,
        trackButtonClick,
        trackAccordionExpand,
        trackNavigationClick,
        trackMapPoiClick,
        trackAudioPlayerClick,
        trackAudioPlayerComplete,
        trackInformationDrawerClick,
        trackPageView,
    };
};

export default useGoogleAnalytics;
