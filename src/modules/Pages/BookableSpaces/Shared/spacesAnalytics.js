import { action, category, event } from './trackingEvents';

let lastTrackedPageView = null;

export const trackSpacesPageView = (pageTitle, pageViewKey) => {
    window.dataLayer = window.dataLayer || [];
    if (
        pageViewKey &&
        lastTrackedPageView?.dataLayer === window.dataLayer &&
        lastTrackedPageView.pageViewKey === pageViewKey
    ) {
        return;
    }

    const trackingData = {
        event: event.PAGE_VIEW,
        page_title: pageTitle,
    };
    console.log('GA PAGETITLE PUSH', trackingData);
    window.dataLayer.push(trackingData);
    lastTrackedPageView = pageViewKey ? { dataLayer: window.dataLayer, pageViewKey } : null;
};

export const trackSpacesNavigationClick = parameters => {
    window.dataLayer = window.dataLayer || [];
    const trackingData = {
        event: event.CLICK,
        click_category: category.NAVIGATION,
        click_action: action.CLICK,
        click_space_name: null,
        click_campus: null,
        click_library: null,
        click_active_filters: '{}',
        ...parameters,
    };
    console.log('GA SPACES CLICK PUSH', JSON.stringify(trackingData, null, 2));
    window.dataLayer.push(trackingData);
};
