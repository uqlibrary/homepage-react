import { getUserPermissions, hasAccess } from './auth';
import { PERMISSIONS } from '../config/auth';
describe('Auth custom hooks', () => {
    it('getUserPermissions operates correctly', () => {
        // test NONE permissions
        expect(getUserPermissions()).toEqual(PERMISSIONS.none);
        const expectedPermissions = {
            can_alter: 1,
        };
        expect(getUserPermissions(expectedPermissions)).toEqual(1);
        expectedPermissions.can_inspect = 1;
        expect(getUserPermissions(expectedPermissions)).toEqual(3);
        expectedPermissions.can_see_reports = 1;
        expect(getUserPermissions(expectedPermissions)).toEqual(7);
        expectedPermissions.can_admin = 1;
        expect(getUserPermissions(expectedPermissions)).toEqual(15);
    });
    it('hasAccess operates correctly', () => {
        // test NONE permissions, no access
        expect(hasAccess(null, [1])).toEqual(false);
        // test NONE permissions, access
        expect(hasAccess(null)).toEqual(true);
        // test can_alter permissions
        expect(hasAccess(PERMISSIONS.can_alter, [1])).toEqual(true);
        expect(hasAccess(PERMISSIONS.can_alter, [2])).toEqual(false);
        // test can_inspect permissions
        expect(hasAccess(PERMISSIONS.can_inspect, [3])).toEqual(true);
        expect(hasAccess(PERMISSIONS.can_inspect, [4])).toEqual(false);
        // test can_see_reports permissions
        expect(hasAccess(PERMISSIONS.can_see_reports, [7])).toEqual(true);
        expect(hasAccess(PERMISSIONS.can_see_reports, [8])).toEqual(false);
        // test can_admin permissions
        expect(hasAccess(PERMISSIONS.can_admin, [15])).toEqual(true);
        expect(hasAccess(PERMISSIONS.can_admin, [16])).toEqual(false);
    });
});
