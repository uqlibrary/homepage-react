import * as routes from './routes';
import * as pages from 'modules/App/components/pages';

describe('Routes getRoutesConfig method', () => {
    describe('Routes getRoutesConfig method', () => {
        it('should return a list of routes for anon user', () => {
            const testRoutes = routes.getRoutesConfig({ components: pages, account: null });
            expect(testRoutes.length).toBeGreaterThan(1);
        });

        it('matches explicit bookable spaces journey URLs', () => {
            const testRoutes = routes.getRoutesConfig({ components: pages, account: null });
            const routeMap = Object.fromEntries(testRoutes.map(route => [route.path, route]));
            const routePaths = testRoutes.map(route => route.path);

            expect(routeMap['/spaces']?.element?.type).toBe(pages.BookableSpacesLandingPage);
            expect(routeMap['/spaces/results']?.element?.type).toBe(pages.BookableSpacesResultsPage);
            expect(routeMap['/spaces/results/:intentToken']?.element?.type).toBe(pages.BookableSpacesResultsPage);
            expect(routeMap['/spaces/mapresults']?.element?.type).toBe(pages.BookableSpacesMapPage);
            expect(routeMap['/spaces/results/map']?.element?.type).toBeUndefined();
            expect(routeMap['/spaces/detail/:spaceId']?.element?.type).toBe(pages.BookableSpacesDetailPage);
            expect(routeMap['/spaces/details/:spaceId']?.element?.type).toBe(pages.BookableSpacesDetailPage);
            expect(routePaths.indexOf('/spaces/mapresults')).toBeLessThan(routePaths.indexOf('/spaces/results/:intentToken'));
        });
    });
});
