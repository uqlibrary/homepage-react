import { trackSpacesPageView } from './spacesAnalytics';

describe('trackSpacesPageView', () => {
    beforeEach(() => {
        delete window.dataLayer;
    });

    it('initializes the data layer and pushes a Spaces pageview', () => {
        trackSpacesPageView('Bookable Spaces - UQ Library');

        expect(window.dataLayer).toEqual([
            {
                event: 'library spaces pageview',
                page_title: 'Bookable Spaces - UQ Library',
            },
        ]);
    });

    it('appends the pageview to an existing data layer', () => {
        window.dataLayer = [{ event: 'existing event' }];

        trackSpacesPageView('Bookable Spaces search results - UQ Library');

        expect(window.dataLayer).toEqual([
            { event: 'existing event' },
            {
                event: 'library spaces pageview',
                page_title: 'Bookable Spaces search results - UQ Library',
            },
        ]);
    });

    it('pushes only once for the same router location key', () => {
        trackSpacesPageView('Bookable Spaces search results - UQ Library', 'location-1');
        trackSpacesPageView('Bookable Spaces search results - UQ Library', 'location-1');

        expect(window.dataLayer).toEqual([
            {
                event: 'library spaces pageview',
                page_title: 'Bookable Spaces search results - UQ Library',
            },
        ]);
    });
});
