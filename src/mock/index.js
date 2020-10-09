/* eslint-disable */
import { api, sessionApi } from 'config';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import { SESSION_COOKIE_NAME } from 'config';
import * as routes from 'repositories/routes';
import * as mockData from './data';
import { spotlights } from './data/spotlights';
import fetchMock from 'fetch-mock';

const queryString = require('query-string');
const mock = new MockAdapter(api, { delayResponse: 200 });
const mockSessionApi = new MockAdapter(sessionApi, { delayResponse: 200 });
const escapeRegExp = input => input.replace('.\\*', '.*').replace(/[\-\[\]\{\}\(\)\+\?\\\^\$\|]/g, '\\$&');
// set session cookie in mock mode
Cookies.set(SESSION_COOKIE_NAME, 'abc123');

// Get user from query string
let user = queryString.parse(location.search || location.hash.substring(location.hash.indexOf('?'))).user;

mockData.accounts.uqrdav10 = mockData.uqrdav10.account;
mockData.accounts.uqagrinb = mockData.uqagrinb.account;
if (user && !mockData.accounts[user]) {
    console.warn(
        `API MOCK DATA: User name (${user}) is not found, please use one of the usernames from mock data only...`,
    );
}

// default user is researcher if user is not defined
user = user || 'vanilla';

mockSessionApi.onGet(routes.CURRENT_ACCOUNT_API().apiUrl).reply(() => {
    console.log('Account API hit');
    // mock account response
    if (['s2222222', 's3333333'].indexOf(user) > -1) {
        return [200, mockData.accounts[user]];
    } else if (mockData.accounts[user]) {
        return [403, {}];
    }
    return [404, {}];
});

mock.onGet(routes.CURRENT_ACCOUNT_API().apiUrl).reply(() => {
    console.log('Account API hit');
    // mock account response
    if (user === 'public') {
        return [403, {}];
    } else if (mockData.accounts[user]) {
        return [200, mockData.accounts[user]];
    }
    return [404, {}];
});

mock.onGet(routes.SPOTLIGHTS_API().apiUrl).reply(() => {
    // mock spotlights
    console.log('Spotlights API hit');
    return [200, [...spotlights]];
});

mock.onGet(routes.CHAT_API().apiUrl).reply(() => {
    console.log('Chat status API hit');
    // mock chat status
    // return [200, { online: true }];
    return [200, { online: false }];
});

fetchMock.mock('begin:https://primo-instant-apac.hosted.exlibrisgroup.com/solr/ac', {
    status: 200,
    response: {
        numFound: 1622,
        start: 0,
        maxScore: 16.476818,
        docs: [
            { text: 'beards', score: 16.476818 },
            {
                text: 'beards folklore',
                score: 16.476564,
            },
            { text: 'beards massage', score: 16.476564 },
            {
                text: 'beards fiction',
                score: 16.476564,
            },
            { text: 'beards poetry', score: 16.476564 },
            {
                text: 'beards history',
                score: 16.476564,
            },
            { text: 'beards europe', score: 16.476564 },
            {
                text: 'beards humor',
                score: 16.476564,
            },
            { text: 'beards harold', score: 16.476564 },
            { text: 'beards peter', score: 16.476564 },
        ],
    },
});

fetchMock.mock('begin:https://api.library.uq.edu.au/v1/search_suggestions?type=exam_paper', [
    {
        name: 'ACCT2111',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_Two_Final_Examinations_2019_ACCT2111.pdf',
        type: 'exam_paper',
        course_title: 'Principles of Financial Accounting',
    },
    {
        name: 'ACCT1101',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT1101.pdf',
        type: 'exam_paper',
        course_title: 'Accounting for Decision Making',
    },
    {
        name: 'ACCT7804',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_Two_Final_Examinations_2019_ACCT7804.pdf',
        type: 'exam_paper',
        course_title: 'Accounting and Business Analysis',
    },
    {
        name: 'ACCT2112',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_Two_Final_Examinations_2019_ACCT2112.pdf',
        type: 'exam_paper',
        course_title: 'Financial Accounting for Business',
    },
    {
        name: 'ACCT3101',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT3101.pdf',
        type: 'exam_paper',
        course_title: 'Auditing & Public Practice',
    },
    {
        name: 'ACCT3102',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT3102.pdf',
        type: 'exam_paper',
        course_title: 'External Reporting Issues',
    },
    {
        name: 'ACCT3103',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT3103.pdf',
        type: 'exam_paper',
        course_title: 'Advanced Financial Accounting',
    },
    {
        name: 'ACCT3104',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT3104.pdf',
        type: 'exam_paper',
        course_title: 'Management Accounting',
    },
    {
        name: 'ACCT1110',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT1110.pdf',
        type: 'exam_paper',
        course_title: 'Financial Reporting and Analysis',
    },
    {
        name: 'ACCT2101',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT2101.pdf',
        type: 'exam_paper',
        course_title: 'Financial Reporting',
    },
    {
        name: 'ACCT2102',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT2102.pdf',
        type: 'exam_paper',
        course_title: 'Principles of Management Accounting',
    },
    {
        name: 'ACCT2113',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT2113.pdf',
        type: 'exam_paper',
        course_title: 'Management Accounting Principles',
    },
    {
        name: 'ACCT7101',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT7101.pdf',
        type: 'exam_paper',
        course_title: 'Accounting',
    },
    {
        name: 'ACCT7102',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT7102.pdf',
        type: 'exam_paper',
        course_title: 'Financial Accounting',
    },
    {
        name: 'ACCT7103',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT7103.pdf',
        type: 'exam_paper',
        course_title: 'Auditing',
    },
    {
        name: 'ACCT7104',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT7104.pdf',
        type: 'exam_paper',
        course_title: 'Corporate Accounting',
    },
    {
        name: 'ACCT7106',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT7106.pdf',
        type: 'exam_paper',
        course_title: 'Financial Statement Analysis',
    },
    {
        name: 'ACCT7107',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT7107.pdf',
        type: 'exam_paper',
        course_title: 'Management Accounting and Control',
    },
    {
        name: 'ACCT3105',
        url: 'https://files.library.uq.edu.au/exams/2018/Semester_One_Final_Examinations__2018_ACCT3105.pdf',
        type: 'exam_paper',
        course_title: 'Advanced Management Accounting',
    },
    {
        name: 'ACCT7209',
        url: 'https://files.library.uq.edu.au/exams/2016/Semester_One_Final_Examinations__2016_ACCT7209_Sample.pdf',
        type: 'exam_paper',
        course_title: 'Business Information Systems',
    },
    {
        name: 'ACCT3201',
        url: 'https://files.library.uq.edu.au/exams/2016/Semester_One_Final_Examinations__2016_ACCT3201_Sample.pdf',
        type: 'exam_paper',
        course_title: 'Business Information Systems',
    },
]);

fetchMock.mock('begin:https://api.library.uq.edu.au/v1/search_suggestions?type=learning_resource', [
    {
        name: 'ACCT7804',
        url: 'http://lr.library.uq.edu.au/lists/60758626-F1E5-2A1C-C96B-0B3BCB8863FB',
        type: 'learning_resource',
        course_title: 'Accounting and Business Analysis',
        campus: 'St Lucia',
        period: 'Semester 2 2020',
    },
    {
        name: 'ACCT2102',
        url: 'http://lr.library.uq.edu.au/lists/10B6BFC6-D734-376F-A779-FA9E29D162D4',
        type: 'learning_resource',
        course_title: 'Principles of Management Accounting',
        campus: 'St Lucia',
        period: 'Semester 2 2020',
    },
    {
        name: 'ACCT1101',
        url: 'http://lr.library.uq.edu.au/lists/8DED5E86-60FD-8C20-29F3-0E960FEC791B',
        type: 'learning_resource',
        course_title: 'Accounting for Decision Making',
        campus: 'St Lucia',
        period: 'Semester 2 2020',
    },
    {
        name: 'ACCT7101',
        url: 'http://lr.library.uq.edu.au/lists/B888B026-16C7-F589-8F70-67614268862A',
        type: 'learning_resource',
        course_title: 'Accounting',
        campus: 'St Lucia',
        period: 'Semester 2 2020',
    },
    {
        name: 'ACCT7107',
        url: 'http://lr.library.uq.edu.au/lists/C6A4040F-7111-DB7D-2C9D-855C0B0B77F9',
        type: 'learning_resource',
        course_title: 'Management Accounting and Control',
        campus: 'St Lucia',
        period: 'Semester 2 2020',
    },
    {
        name: 'ACCT2111',
        url: 'http://lr.library.uq.edu.au/lists/5D07E508-E79E-850D-1BE9-1DCD7F7A121F',
        type: 'learning_resource',
        course_title: 'Principles of Financial Accounting',
        campus: 'St Lucia',
        period: 'Semester 2 2020',
    },
    {
        name: 'ACCT7106',
        url: 'http://lr.library.uq.edu.au/lists/503EF651-FF56-2739-478C-CBDC5DFAB8E8',
        type: 'learning_resource',
        course_title: 'Financial Statement Analysis',
        campus: 'St Lucia',
        period: 'Semester 2 2020',
    },
    {
        name: 'ACCT7103',
        url: 'http://lr.library.uq.edu.au/lists/12A921A6-1B6F-2FBC-6952-D85E24132829',
        type: 'learning_resource',
        course_title: 'Auditing',
        campus: 'St Lucia',
        period: 'Semester 2 2020',
    },
    {
        name: 'ACCT2101',
        url: 'http://lr.library.uq.edu.au/lists/4CD00138-EF29-FEA1-1F0C-FC1B1431B68C',
        type: 'learning_resource',
        course_title: 'Financial Reporting',
        campus: 'St Lucia',
        period: 'Semester 2 2020',
    },
    {
        name: 'ACCT3103',
        url: 'http://lr.library.uq.edu.au/lists/9290F8D7-E2CC-77B7-F272-0DD398391E90',
        type: 'learning_resource',
        course_title: 'Advanced Financial Accounting',
        campus: 'St Lucia',
        period: 'Semester 2 2020',
    },
]);
