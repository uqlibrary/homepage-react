import * as routes from './routes';

describe('Routes getRoutesConfig method', () => {
    describe('Routes getRoutesConfig method', () => {
        it('should return a list of routes for anon user', () => {
            const testRoutes = routes.getRoutesConfig({ components: {}, account: null });
            expect(testRoutes.length).to.be.greaterThan(1);
        });
    });
});
