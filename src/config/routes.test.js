import * as routes from './routes';
import * as pages from 'modules/App/components/pages';

describe('Routes getRoutesConfig method', () => {
    describe('Routes getRoutesConfig method', () => {
        it('should return a list of routes for anon user', () => {
            const testRoutes = routes.getRoutesConfig({ components: pages, account: null });
            expect(testRoutes.length).toBeGreaterThan(1);
        });
    });
});
