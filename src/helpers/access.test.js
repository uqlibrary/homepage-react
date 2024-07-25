import {
    canSeeLearningResources,
    canSeeLoans,
    canSeePrintBalance,
    getUserServices,
    isAlertsAdminUser,
    isEspaceAuthor,
    isHdrStudent,
} from './access';
import { accounts } from 'data/mock/data';

describe('access', () => {
    it('should know if an account is for a HDR student', () => {
        expect(isHdrStudent(accounts.s1111111)).toEqual(true);
        expect(isHdrStudent(accounts.uqstaff)).toEqual(false);
    });

    it('only the logged in user can see their loans', () => {
        expect(canSeeLoans({ id: 's123456' })).toEqual(true);
        expect(canSeeLoans({})).toEqual(false);
    });

    it('only the logged in user can see their print balance', () => {
        expect(canSeePrintBalance({ id: 's123456' })).toEqual(true);
        expect(canSeePrintBalance({})).toEqual(false);
    });

    it('only authors can see espace info', () => {
        expect(isEspaceAuthor({ id: 's123456' }, { aut_id: 1086 })).toEqual(true);
        expect(isEspaceAuthor({ id: 's123456' }, {})).toEqual(false);
        expect(isEspaceAuthor({ id: 's123456' })).toEqual(false);
        expect(isEspaceAuthor({})).toEqual(false);
    });

    it('only authorised users can see learning resources', () => {
        expect(canSeeLearningResources({ id: 's123456', user_group: 'UG' })).toEqual(true);
        expect(canSeeLearningResources({ id: 's123456', user_group: 'STAFF_AWAITING_AURION' })).toEqual(false);
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
});
