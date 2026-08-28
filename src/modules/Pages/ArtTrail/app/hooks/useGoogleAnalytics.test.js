import { act, renderHook } from 'test-utils';

import trackingEvents from '../config/trackingEvents';
import useGoogleAnalytics from './useGoogleAnalytics';

describe('useGoogleAnalytics', () => {
    const originalTitle = document.title;

    beforeEach(() => {
        delete window.dataLayer;
        window.history.replaceState({}, '', '/art-trail/app?step=2');
        document.title = 'Art Trail';
    });

    afterEach(() => {
        delete window.dataLayer;
        window.history.replaceState({}, '', '/');
        document.title = originalTitle;
    });

    it('tracks an event and appends it to the existing data layer', () => {
        const existingEvent = { event: 'existing-event' };
        window.dataLayer = [existingEvent];
        const { result } = renderHook(() => useGoogleAnalytics());

        act(() => {
            result.current.trackEvent('custom-event', { custom_value: 'value' });
        });

        expect(window.dataLayer).toEqual([
            existingEvent,
            {
                event: 'custom-event',
                custom_value: 'value',
            },
        ]);
    });

    it('tracks button clicks with the default event', () => {
        const { result } = renderHook(() => useGoogleAnalytics());

        act(() => {
            result.current.trackButtonClick(undefined, { button_text: 'Start the trail' });
        });

        expect(window.dataLayer).toEqual([
            {
                event: trackingEvents.ART_TRAIL_BUTTON_CLICK,
                button_text: 'Start the trail',
            },
        ]);
    });

    it('tracks button clicks with a supplied event', () => {
        const { result } = renderHook(() => useGoogleAnalytics());

        act(() => {
            result.current.trackButtonClick(trackingEvents.ART_TRAIL_AUDIOPLAYER_PLAY, {
                button_text: 'Play',
            });
        });

        expect(window.dataLayer).toEqual([
            {
                event: trackingEvents.ART_TRAIL_AUDIOPLAYER_PLAY,
                button_text: 'Play',
            },
        ]);
    });

    it('tracks accordion expands', () => {
        const { result } = renderHook(() => useGoogleAnalytics());

        act(() => {
            result.current.trackAccordionExpand({ accordion_title: 'About the artwork' });
        });

        expect(window.dataLayer).toEqual([
            {
                event: trackingEvents.ART_TRAIL_ACCORDION_EXPAND,
                accordion_title: 'About the artwork',
            },
        ]);
    });

    it('tracks map POI clicks', () => {
        const { result } = renderHook(() => useGoogleAnalytics());

        act(() => {
            result.current.trackMapPoiClick({ poi_title: 'Punu Tjukurpa' });
        });

        expect(window.dataLayer).toEqual([
            {
                event: trackingEvents.ART_TRAIL_MAP_POI_CLICK,
                poi_title: 'Punu Tjukurpa',
            },
        ]);
    });

    it('tracks page views with the supplied page title', () => {
        const { result } = renderHook(() => useGoogleAnalytics());

        act(() => {
            result.current.trackPageView({ page_type: 'art-trail', page_title: 'Artwork title' });
        });

        expect(window.dataLayer).toEqual([
            {
                event: trackingEvents.ART_TRAIL_PAGE_VIEW,
                page_title: 'Artwork title',
                page_type: 'art-trail',
            },
        ]);
    });
});
