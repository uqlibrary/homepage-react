import {
    canSeeLearningResources,
    canSeeLibraryServices,
    canSeeLoans,
    canSeePrintBalance,
    getHomepageLink,
    getUserServices,
    isAlertsAdminUser,
    isEspaceAuthor,
    isHdrStudent,
    isSpotlightsAdminUser,
} from './access';
import { accounts } from 'data/mock/data';

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

    it('library services are shown to appropriate users', () => {
        expect(canSeeLibraryServices({})).toEqual(false);
        expect(canSeeLibraryServices({ id: 's123456', user_group: 'UG' })).toEqual(true);
        expect(canSeeLibraryServices({ id: 's123456', user_group: 'a different one' })).toEqual(false);
    });

    it('spotlights pages are limited to appropriate users', () => {
        expect(isSpotlightsAdminUser({})).toEqual(false);
        expect(
            isSpotlightsAdminUser({
                id: 'uqstaff',
                groups: [
                    'CN=lib_libapi_SpotlightAdmins,OU=lib-libapi-groups,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                ],
                user_group: 'LIBRARYSTAFFB',
            }),
        ).toEqual(true);
        expect(
            isSpotlightsAdminUser({
                id: 'uqstaffnonpriv',
                groups: ['DC=uq', 'DC=edu', 'DC=au'],
                user_group: 'LIBRARYSTAFFB',
            }),
        ).toEqual(false);
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
    function expectHomePageOfLinkIs(currentUrl, expectedHomepage) {
        const currentUrlParts = new URL(currentUrl);
        const loggedoutHomepageLink = getHomepageLink(
            currentUrlParts.hostname,
            currentUrlParts.protocol,
            currentUrlParts.port,
            currentUrlParts.pathname,
            currentUrlParts.search,
        );
        expect(loggedoutHomepageLink).toEqual(expectedHomepage);
    }

    it('should generate the correct homepage links', () => {
        expectHomePageOfLinkIs('https://www.library.uq.edu.au/', 'https://www.library.uq.edu.au');

        expectHomePageOfLinkIs(
            'https://www.library.uq.edu.au/learning-resources?coursecode=PHYS1001&campus=St%20Lucia&semester=Semester%201%202023',
            'https://www.library.uq.edu.au',
        );

        expectHomePageOfLinkIs(
            'https://homepage-development.library.uq.edu.au/master/#/',
            'https://homepage-development.library.uq.edu.au/master/#/',
        );

        expectHomePageOfLinkIs(
            'https://homepage-development.library.uq.edu.au/master/#/admin/masquerade',
            'https://homepage-development.library.uq.edu.au/master/#/',
        );

        expectHomePageOfLinkIs(
            'https://homepage-staging.library.uq.edu.au/learning-resources?coursecode=FREN1020&campus=St%20Lucia&semester=Semester%202%202023',
            'https://homepage-staging.library.uq.edu.au',
        );

        expectHomePageOfLinkIs(
            'https://homepage-staging.library.uq.edu.au/',
            'https://homepage-staging.library.uq.edu.au',
        );

        expectHomePageOfLinkIs('https://app.library.uq.edu.au/#/', 'https://app.library.uq.edu.au');

        expectHomePageOfLinkIs('https://app.library.uq.edu.au/#/membership/admin', 'https://app.library.uq.edu.au');

        expectHomePageOfLinkIs(
            'http://localhost:2020/admin/spotlights?user=uqstaff',
            'http://localhost:2020/?user=uqstaff',
        );

        // and do a test without param, for completeness (jest thinks its on staging with no https, that's so cute! ;) )
        expect(getHomepageLink()).toEqual('http://homepage-staging.library.uq.edu.au');
    });
});
