export const trackSpacesPageView = pageTitle => {
    window.dataLayer = window.dataLayer || [];
    const trackingData = {
        event: 'library spaces pageview',
        page_title: pageTitle,
    };
    console.log('GA PAGETITLE PUSH', trackingData);
    window.dataLayer.push(trackingData);
};
