import {
    getUserServices,
    isHdrStudent,
    seeAlertsAdmin,
    seeCourseResources,
    seeEspace,
    seeLibraryServices,
    seeLoans,
    seePrintBalance,
    seeSpotlightsAdmin,
} from './access';
import { accounts } from '../mock/data';

describe('access', () => {
    it('should get the correct services when the account is missing', () => {
        expect(getUserServices({})).toEqual([]);
    });

    it('should know if an account is for a HDR student', () => {
        expect(isHdrStudent(accounts.s1111111)).toEqual(true);
        expect(isHdrStudent(accounts.uqstaff)).toEqual(false);
    });

    it('should show the correct services to the correct groups', () => {
        // happy path
        expect(getUserServices(accounts.s1111111).length).toEqual(3);

        // coverage: various parameters invalid
        expect(getUserServices(accounts.s1111111, {})).toEqual([]);

        expect(
            getUserServices(accounts.s1111111, {
                LibraryServices: 'x',
            }),
        ).toEqual([]);

        expect(
            getUserServices({
                id: 'dummy',
                user_group: 'unknown',
            }),
        ).toEqual([]);

        expect(
            getUserServices({
                user_group: 'unknown',
            }),
        ).toEqual([]);

        expect(
            getUserServices(accounts.s1111111, {
                LibraryServices: {
                    links: [
                        {
                            // missing id
                            title: 'Title',
                            url: 'https://blah',
                        },
                    ],
                },
            }),
        ).toEqual([]);
    });

    it('only the logged in user can see their loans', () => {
        expect(seeLoans({ id: 's123456' })).toEqual(true);
        expect(seeLoans({})).toEqual(false);
    });

    it('only the logged in user can see their print balance', () => {
        expect(seePrintBalance({ id: 's123456' })).toEqual(true);
        expect(seePrintBalance({})).toEqual(false);
    });

    it('only authors can see espace info', () => {
        expect(seeEspace({ id: 's123456' }, { aut_id: 1086 })).toEqual(true);
        expect(seeEspace({ id: 's123456' }, {})).toEqual(false);
        expect(seeEspace({ id: 's123456' })).toEqual(false);
        expect(seeEspace({})).toEqual(false);
    });

    it('only authorised users can see course resources', () => {
        expect(seeCourseResources({ id: 's123456', user_group: 'UG' })).toEqual(true);
        expect(seeCourseResources({ id: 's123456', user_group: 'STAFF_AWAITING_AURION' })).toEqual(false);
    });

    it('library services are shown to appropriate users', () => {
        expect(seeLibraryServices({})).toEqual(false);
        expect(seeLibraryServices({ id: 's123456', user_group: 'UG' })).toEqual(true);
        expect(seeLibraryServices({ id: 's123456', user_group: 'a different one' })).toEqual(false);
    });

    it('admin pages are limited to appropriate users', () => {
        expect(seeSpotlightsAdmin({})).toEqual(false);
        expect(
            seeSpotlightsAdmin({
                id: 'uqstaff',
                groups: [
                    'CN=lib_libapi_SpotlightAdmins,OU=lib-libapi-groups,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                ],
                user_group: 'LIBRARYSTAFFB',
            }),
        ).toEqual(true);
        expect(
            seeAlertsAdmin({
                id: 'uqstaff',
                groups: [
                    'CN=lib_libapi_SpotlightAdmins,OU=lib-libapi-groups,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                ],
                user_group: 'LIBRARYSTAFFB',
            }),
        ).toEqual(true);
        expect(
            seeAlertsAdmin({
                id: 'uqstaffnonpriv',
                groups: ['DC=uq', 'DC=edu', 'DC=au'],
                user_group: 'LIBRARYSTAFFB',
            }),
        ).toEqual(false);
    });
});
