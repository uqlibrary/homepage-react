import { act, renderHook } from 'test-utils';

import { action, category, event } from '../config/trackingEvents';
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
            result.current.trackButtonClick({ button_text: 'Start the trail' });
        });

        expect(window.dataLayer).toEqual([
            {
                event: event.CLICK,
                button_text: 'Start the trail',
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
                event: event.CLICK,
                click_category: category.ACCORDION,
                click_action: action.EXPAND,
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
                event: event.CLICK,
                click_category: category.MAP_POI,
                click_action: action.CLICK,
                poi_title: 'Punu Tjukurpa',
            },
        ]);
    });

    it('tracks navigation, audio, and information interactions', () => {
        const { result } = renderHook(() => useGoogleAnalytics());

        act(() => {
            result.current.trackNavigationClick({ click_label: 'Next' });
            result.current.trackAudioPlayerClick({ click_label: 'Listen to this page' });
            result.current.trackAudioPlayerComplete({ click_class: 'AudioComplete' });
            result.current.trackInformationDrawerClick({ click_label: 'More information' });
        });

        expect(window.dataLayer).toEqual([
            {
                event: event.CLICK,
                click_category: category.NAVIGATION,
                click_action: action.CLICK,
                click_label: 'Next',
            },
            {
                event: event.CLICK,
                click_category: category.AUDIO_PLAYER,
                click_action: action.CLICK,
                click_label: 'Listen to this page',
            },
            {
                event: event.CLICK,
                click_category: category.AUDIO_PLAYER,
                click_action: action.COMPLETE,
                click_label: 'listen to this page',
                click_class: 'AudioComplete',
            },
            {
                event: event.CLICK,
                click_category: category.INFORMATION,
                click_action: action.CLICK,
                click_label: 'More information',
            },
        ]);
    });

    it('tracks page views with the supplied page title', () => {
        const { result } = renderHook(() => useGoogleAnalytics());

        act(() => {
            result.current.trackPageView('Artwork title', 4);
        });

        expect(window.dataLayer).toEqual([
            {
                event: event.PAGE_VIEW,
                page_title: 'Artwork title',
                page_number: 4,
            },
        ]);
    });
});
