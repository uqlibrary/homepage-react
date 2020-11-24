/* eslint-disable */
import { api, sessionApi } from 'config';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import { SESSION_COOKIE_NAME } from 'config';
import * as routes from 'repositories/routes';
import * as mockData from './data';
import { spotlights } from './data/spotlights';
import fetchMock from 'fetch-mock';

import learningResources_FREN1010 from './data/records/learningResources_FREN1010';
import learningResources_HIST1201 from './data/records/learningResources_HIST1201';
import learningResources_PHIL1002 from './data/records/learningResources_PHIL1002';
import libraryGuides_FREN1010 from './data/records/libraryGuides_FREN1010';
import libraryGuides_HIST1201 from './data/records/libraryGuides_HIST1201';
import libraryGuides_PHIL1002 from './data/records/libraryGuides_PHIL1002';
import courseReadingList_6888AB68 from './data/records/courseReadingList_6888AB68-0681-FD77-A7D9-F7B3DEE7B29F';
import courseReadingList_2109F2EC from './data/records/courseReadingList_2109F2EC-AB0B-482F-4D30-1DD3531E46BE';
import learningResourceSearchSuggestions from './data/records/learningResourceSearchSuggestions';
import { libHours, computerAvailability, training } from './data/account';

const queryString = require('query-string');
const mock = new MockAdapter(api, { delayResponse: 200 });
const mockSessionApi = new MockAdapter(sessionApi, { delayResponse: 200 });
const escapeRegExp = input => input.replace('.\\*', '.*')
    .replace(/[\-\[\]\{\}\(\)\+\?\\\^\$\|]/g, '\\$&');
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

mockSessionApi.onGet(routes.CURRENT_ACCOUNT_API().apiUrl)
    .reply(() => {
        console.log('Account API hit');
        // mock account response
        if (['s2222222', 's3333333'].indexOf(user) > -1) {
            return [200, mockData.accounts[user]];
        } else if (mockData.accounts[user]) {
            return [403, {}];
        }
        return [404, {}];
    });

mock.onGet(routes.CURRENT_ACCOUNT_API().apiUrl)
    .reply(() => {
        console.log('Account API hit');
        // mock account response
        if (user === 'public') {
            return [403, {}];
        } else if (mockData.accounts[user]) {
            return [200, mockData.accounts[user]];
        }
        return [404, {}];
    });

mock.onGet(routes.SPOTLIGHTS_API().apiUrl)
    .reply(() => {
        // mock spotlights
        console.log('Spotlights API hit');
        return [200, [...spotlights]];
    });

mock.onGet(routes.CHAT_API().apiUrl)
    .reply(() => {
        console.log('Chat status API hit');
        // mock chat status
        return [200, { online: true }];
        // return [200, { online: false }];
    });

mock.onGet(routes.TRAINING_API(10).apiUrl)
    .reply(() => {
        console.log('Training events API hit');
        // mock training evemts
        return [200, training];
    });

mock.onGet(routes.LIB_HOURS_API().apiUrl)
    .reply(() => {
        console.log('Library Hours API hit');
        // mock library hours
        return [200, libHours];
    });

mock.onGet(routes.ALERT_API().apiUrl)
    .reply(() => {
        console.log('Alert status API hit');
        // mock alerts status
        return [200,
            [
                {
                'id': 'e895b270-d62b-11e7-954e-57c2cc19d151',
                'start': '2020-10-12 09:58:02',
                'end': '2020-11-22 09:58:02',
                'title': 'Test urgent alert 2',
                'body': '[urgent link description](http:\/\/www.somelink.com) Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                'urgent': 1,
                },
            ],
        ];
    });

mock.onGet(routes.COMP_AVAIL_API.apiUrl)
    .reply(() => {
        console.log('Computer availability API hit');
        // mock computer availability
        return [200, computerAvailability];
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

fetchMock.mock(
    'begin:https://api.library.uq.edu.au/v1/search_suggestions?type=learning_resource',
    learningResourceSearchSuggestions
);

fetchMock.mock('https://api.library.uq.edu.au/v1/learning_resources/FREN1010', learningResources_FREN1010);
fetchMock.mock('https://api.library.uq.edu.au/v1/learning_resources/HIST1201', learningResources_HIST1201);
fetchMock.mock('https://api.library.uq.edu.au/v1/learning_resources/PHIL1002', learningResources_PHIL1002);

fetchMock.mock('https://api.library.uq.edu.au/v1/library_guides/FREN1010', libraryGuides_FREN1010);
fetchMock.mock('https://api.library.uq.edu.au/v1/library_guides/HIST1201', libraryGuides_HIST1201);
fetchMock.mock('https://api.library.uq.edu.au/v1/library_guides/PHIL1002', libraryGuides_PHIL1002);

// fetchMock.mock('https://api.library.uq.edu.au/v1/course_reading_list/FE54098F-2CB3-267D-50F8-4B2895FE94B9', courseReadingList_FE54098F);
fetchMock.mock('https://api.library.uq.edu.au/v1/course_reading_list/6888AB68-0681-FD77-A7D9-F7B3DEE7B29F', courseReadingList_6888AB68);
fetchMock.mock('https://api.library.uq.edu.au/v1/course_reading_list/2109F2EC-AB0B-482F-4D30-1DD3531E46BE', courseReadingList_2109F2EC);
