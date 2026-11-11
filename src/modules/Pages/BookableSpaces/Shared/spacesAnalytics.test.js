import { trackSpacesNavigationClick, trackSpacesPageView } from './spacesAnalytics';

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

    it('pushes navigation click events with the Spaces event defaults', () => {
        trackSpacesNavigationClick({
            click_label: 'Log in',
            click_class: 'dlor-homepage-loginprompt',
            click_url: 'https://auth.library.uq.edu.au/login',
            click_campus: 'St Lucia',
        });

        expect(window.dataLayer).toEqual([
            {
                event: 'library spaces click',
                click_category: 'navigation',
                click_action: 'click',
                click_space_name: null,
                click_campus: 'St Lucia',
                click_library: null,
                click_active_filters: '{}',
                click_label: 'Log in',
                click_class: 'dlor-homepage-loginprompt',
                click_url: 'https://auth.library.uq.edu.au/login',
            },
        ]);
    });
});
