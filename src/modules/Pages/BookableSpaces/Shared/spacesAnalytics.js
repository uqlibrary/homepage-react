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
        event: 'library spaces pageview',
        page_title: pageTitle,
    };
    console.log('GA PAGETITLE PUSH', trackingData);
    window.dataLayer.push(trackingData);
    lastTrackedPageView = pageViewKey ? { dataLayer: window.dataLayer, pageViewKey } : null;
};
