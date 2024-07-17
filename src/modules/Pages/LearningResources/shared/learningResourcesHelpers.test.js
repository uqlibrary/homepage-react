import {
    _courseLink,
    _pluralise,
    a11yProps,
    extractSubjectCodeFromName,
    getHomepageLink,
    reverseA11yProps,
} from './learningResourcesHelpers';
import { getQueryParams, isValidInput } from '../LearningResources';

describe('filterProps helper', () => {
    it('should make plurals of words properly', () => {
        expect(_pluralise('paper', 0)).toBe('papers');
        expect(_pluralise('paper', 1)).toBe('paper');
        expect(_pluralise('paper', 2)).toBe('papers');
        expect(_pluralise('paper', 1234)).toBe('papers');
        expect(_pluralise('paper', 'A')).toBe('papers');
        expect(_pluralise('paper', -8)).toBe('papers');
    });

    it('should create course links properly', () => {
        expect(_courseLink('PHIL1111', 'https://example.com/[courseCode]')).toBe('https://example.com/PHIL1111');
        expect(_courseLink('', 'https://www.example.com/something?stub=')).toBe(
            'https://www.example.com/something?stub=',
        );
    });

    it('should create a11ylinks that are interdependant', () => {
        const a11yProps1 = a11yProps(1, 'top');
        const a11yReverseProps1 = reverseA11yProps(1, 'top');
        expect(a11yProps1.id).toEqual(a11yReverseProps1['aria-labelledby']);
        expect(a11yProps1['aria-controls']).toEqual(a11yReverseProps1.id);

        const a11yProps2 = a11yProps(1);
        expect(a11yProps2.id).toEqual('topmenu-1');

        const a11yReverseProps2 = reverseA11yProps(1);
        expect(a11yReverseProps2.id).toEqual('topmenu-panel-1');
    });

    it('should extract a subject code from a subject name', () => {
        expect(extractSubjectCodeFromName('CRIM1019 - Introduction to Criminal Justice')).toEqual('CRIM1019');
    });

    it('should validate paramters correctly', () => {
        const params = {
            campus: 'St Lucia',
            coursecode: 'FREN1010',
            semester: 'Semester 2 2020',
        };
        expect(isValidInput(params)).toBe(true);

        const params5 = {
            campus: 'St Lucia',
            coursecode: 'FREN1010A', // course code is 4char + 4num OR 4char + 4num + 1char
            semester: 'Semester 2 2020',
        };
        expect(isValidInput(params5)).toBe(true);

        const params6 = {
            campus: 'St Lucia',
            coursecode: 'FREN10104', // invalid course code
            semester: 'Semester 2 2020',
        };
        expect(isValidInput(params6)).toBe(false);

        const params2 = {
            campus: 'St Lucia',
            coursecode: 'FRENA1010', // invalid course code
            semester: 'Semester 2 2020',
        };
        expect(isValidInput(params2)).toBe(false);

        const params3 = {
            campus: 'somewhere', // invalid campus
            coursecode: 'FREN1010',
            semester: 'Semester 2 2020',
        };
        expect(isValidInput(params3)).toBe(false);

        const params4 = {
            campus: 'St Lucia',
            coursecode: 'FREN1010',
            semester: 'alert("hack")', // invalid period
        };
        expect(isValidInput(params4)).toBe(false);

        const params7 = {
            campus: 'St Lucia',
            coursecode: 'FREN1010',
            semester: 'Semester 2 2020',
            other: 'some other option that isnt allowed',
        };
        expect(isValidInput(params7)).toBe(false);

        const params8 = {
            campus: 'some words in front St Lucia',
            coursecode: 'FREN1010',
            semester: 'Semester 2 2020',
        };
        expect(isValidInput(params8)).toBe(true);
    });

    it('should extract parameters from the url  correctly', () => {
        const input1 = '?coursecode=PHIL1002&campus=St%20Lucia&semester=Semester%203%202020';
        const expected1 = {
            coursecode: 'PHIL1002',
            campus: 'St Lucia',
            semester: 'Semester 3 2020',
        };
        expect(getQueryParams(input1)).toEqual(expected1);

        const input2 = '?coursecode=FREN3355&campus=St%20Lucia&semester=Yearlong%202022';
        const expected2 = {
            coursecode: 'FREN3355',
            campus: 'St Lucia',
            semester: 'Yearlong 2022',
        };
        expect(getQueryParams(input2)).toEqual(expected2);

        const input3 = '?coursecode=FREN1010&campus=Gatton&semester=Semester%201%202020';
        const expected3 = {
            coursecode: 'FREN1010',
            campus: 'Gatton',
            semester: 'Semester 1 2020',
        };
        expect(getQueryParams(input3)).toEqual(expected3);

        const input4 = '?coursecode=FREN1020&campus=St%20Lucia&semester=Semester%201%202023';
        const expected4 = {
            coursecode: 'FREN1020',
            campus: 'St Lucia',
            semester: 'Semester 1 2023',
        };
        expect(getQueryParams(input4)).toEqual(expected4);

        const input5 = '?coursecode=FREN1020&campus=St%20Lucia&semester=Summer%202022/23';
        const expected5 = {
            coursecode: 'FREN1020',
            campus: 'St Lucia',
            semester: 'Summer 2022/23',
        };
        expect(getQueryParams(input5)).toEqual(expected5);

        const input =
            '?coursecode=EDUC4634&campus=/%20EDUC4648%20/%20EDUC7648%20Languages%20Curriculum%20Studies%20-%20St%20Lucia&semester=Yearlong%202023';
        const expected = {
            coursecode: 'EDUC4634',
            campus: 'St Lucia',
            semester: 'Yearlong 2023',
        };
        expect(getQueryParams(input)).toEqual(expected);
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
