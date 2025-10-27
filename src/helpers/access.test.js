import {
    canSeeLearningResourcesPage,
    canSeeLearningResourcesPanel,
    isAlertsAdminUser,
    isEspaceAuthor,
    isHdrStudent,
    isTestTagUser,
} from './access';
import { accounts } from 'data/mock/data';

describe('access', () => {
    it('should know if an account is for a HDR student', () => {
        expect(isHdrStudent(accounts.s1111111)).toEqual(true);
        expect(isHdrStudent(accounts.uqstaff)).toEqual(false);
    });

    it('only authors can see espace info', () => {
        expect(isEspaceAuthor({ id: 's123456' }, { aut_id: 1086 })).toEqual(true);
        expect(isEspaceAuthor({ id: 's123456' }, {})).toEqual(false);
        expect(isEspaceAuthor({ id: 's123456' })).toEqual(false);
        expect(isEspaceAuthor({})).toEqual(false);
    });

    it('only authorised users can see learning resources', () => {
        expect(canSeeLearningResourcesPage({ id: 's123456', user_group: 'UG' })).toEqual(true);
        expect(canSeeLearningResourcesPage({ id: 's123456', user_group: 'STAFF_AWAITING_AURION' })).toEqual(false);
        expect(canSeeLearningResourcesPage({ id: 's123456', user_group: 'RHD' })).toEqual(true);

        expect(canSeeLearningResourcesPanel({ id: 's123456', user_group: 'UG' })).toEqual(true);
        expect(canSeeLearningResourcesPanel({ id: 's123456', user_group: 'STAFF_AWAITING_AURION' })).toEqual(false);
        expect(canSeeLearningResourcesPanel({ id: 's123456', user_group: 'RHD', current_classes: [] })).toEqual(false);
        expect(
            canSeeLearningResourcesPanel({ id: 's123456', user_group: 'RHD', current_classes: [{ SUBJECT: 'FREN' }] }),
        ).toEqual(true);
        expect(canSeeLearningResourcesPanel({})).toEqual(false);
    });

    it('alerts pages are limited to appropriate users', () => {
        expect(isAlertsAdminUser({})).toEqual(false);
        expect(
            isAlertsAdminUser({
                id: 'uqstaff',
                groups: [
                    'CN=lib_libapi_SpotlightAdmins,OU=lib-libapi-groups,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                ],
                user_group: 'LIBRARYSTAFFB',
            }),
        ).toEqual(true);
        expect(
            isAlertsAdminUser({
                id: 'uqstaffnonpriv',
                groups: ['DC=uq', 'DC=edu', 'DC=au'],
                user_group: 'LIBRARYSTAFFB',
            }),
        ).toEqual(false);
    });

    it('should identify TestTag users correctly', () => {
        // Valid TestTag user with tnt data
        expect(
            isTestTagUser({
                id: 'uqstaff',
                tnt: {
                    id: 123,
                    privileges: { read: 1 },
                },
            }),
        ).toEqual(true);

        // No account provided
        expect(isTestTagUser(null)).toEqual(false);
        expect(isTestTagUser(undefined)).toEqual(false);
        expect(isTestTagUser()).toEqual(false);

        // Empty account object
        expect(isTestTagUser({})).toEqual(false);

        // Account without id (not logged in)
        expect(
            isTestTagUser({
                tnt: { id: 123 },
            }),
        ).toEqual(false);

        // Account without tnt property
        expect(
            isTestTagUser({
                id: 'uqstaff',
            }),
        ).toEqual(false);

        // Account with empty tnt object
        expect(
            isTestTagUser({
                id: 'uqstaff',
                tnt: {},
            }),
        ).toEqual(false);

        // Account with tnt as null
        expect(
            isTestTagUser({
                id: 'uqstaff',
                tnt: null,
            }),
        ).toEqual(false);

        // Account with tnt as undefined
        expect(
            isTestTagUser({
                id: 'uqstaff',
                tnt: undefined,
            }),
        ).toEqual(false);
    });
});
