/* eslint-disable */
import { api, sessionApi } from 'config';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import { SESSION_COOKIE_NAME } from 'config';
import * as routes from 'repositories/routes';
import * as mockData from './data';
import { spotlights } from './data/spotlights';
import fetchMock from 'fetch-mock';

import exams_FREN1010 from './data/records/examListFREN1010';
import exams_HIST1201 from './data/records/examListHIST1201';
import exams_PHIL1002 from './data/records/examListPHIL1002';
import exams_ACCT1101 from './data/records/examListACCT1101';
import libraryGuides_FREN1010 from './data/records/libraryGuides_FREN1010';
import libraryGuides_HIST1201 from './data/records/libraryGuides_HIST1201';
import libraryGuides_PHIL1002 from './data/records/libraryGuides_PHIL1002';
import libraryGuides_ACCT1101 from './data/records/libraryGuides_ACCT1101';
import courseReadingList_FREN1010 from './data/records/courseReadingList_FREN1010';
import courseReadingList_HIST1201 from './data/records/courseReadingList_HIST1201';
import courseReadingList_PHIL1002 from './data/records/courseReadingList_PHIL1002';
import courseReadingList_ACCT1101 from './data/records/courseReadingList_ACCT1101';
import learningResourceSearchSuggestions from './data/records/learningResourceSearchSuggestions';
import {
    libHours,
    computerAvailability,
    training,
    printBalance,
    loans,
    possibleRecords,
    incompleteNTROs,
} from './data/account';
import { POSSIBLE_RECORDS_API } from 'repositories/routes';

const queryString = require('query-string');
const mock = new MockAdapter(api, { delayResponse: 200});
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

const withDelay = (response) => config => {
    const randomTime = Math.floor(Math.random() * 1) + 1; // Change these values to delay mock API
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve(response);
        }, randomTime);
    });
};

mockSessionApi.onGet(routes.CURRENT_ACCOUNT_API().apiUrl)
    .reply(() => {
        // mock account response
        if (['s2222222', 's3333333'].indexOf(user) > -1) {
            withDelay([200, mockData.accounts[user]]);
        } else if (mockData.accounts[user]) {
            withDelay([403, {}]);
        }
        withDelay([404, {}]);
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

mock.onGet(routes.CURRENT_AUTHOR_API().apiUrl)
    .reply(() => {
        console.log('eSpace Author API hit');
        // mock current author details from fez
        if (user === 'anon') {
            return [403, {}];
        } else if (mockData.currentAuthor[user]) {
            return [200, mockData.currentAuthor[user]];
        }
        return [404, {}];
    });

mock.onGet(routes.AUTHOR_DETAILS_API({ userId: user }).apiUrl)
    .reply(() => {
        console.log('eSpace Author Details API hit');
        // mock current author details
        if (user === 'anon') {
            return [403, {}];
        } else if (mockData.authorDetails[user]) {
            return [200, mockData.authorDetails[user]];
        }
        return [404, {}];
    });

mock.onGet(routes.SPOTLIGHTS_API().apiUrl)
    .reply(withDelay([200, [...spotlights]]));

mock.onGet(routes.CHAT_API().apiUrl)
    .reply(withDelay([200, { online: true }]));

mock.onGet(routes.TRAINING_API(10).apiUrl)
    .reply(withDelay([200, training]));

mock.onGet(routes.PRINTING_API().apiUrl)
    .reply(withDelay([200, printBalance]));

mock.onGet(routes.LOANS_API().apiUrl)
    .reply(withDelay([200, loans]));

mock.onGet(routes.LIB_HOURS_API().apiUrl)
    .reply(withDelay([200, libHours]));

mock.onGet(routes.POSSIBLE_RECORDS_API().apiUrl)
    .reply(withDelay([200, possibleRecords]));

mock.onGet(routes.INCOMPLETE_NTRO_RECORDS_API().apiUrl)
    .reply(withDelay([200, incompleteNTROs]));

mock.onGet(routes.ALERT_API().apiUrl)
    .reply(withDelay([200,
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
        ]
    ));

mock.onGet(routes.COMP_AVAIL_API().apiUrl)
    .reply(withDelay([200, computerAvailability]));

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

mock
    .onGet('course_resources/FREN1010/exams').reply(() => { return [200, exams_FREN1010] })
    .onGet('course_resources/HIST1201/exams').reply(() => { return [200, exams_HIST1201] })
    .onGet('course_resources/PHIL1002/exams').reply(() => { return [200, exams_PHIL1002] })
    .onGet('course_resources/ACCT1101/exams').reply(() => { return [200, exams_ACCT1101] })

    .onGet('library_guides/FREN1010').reply(() => { return [200, libraryGuides_FREN1010] })
    .onGet('library_guides/HIST1201').reply(() => { return [200, libraryGuides_HIST1201] })
    .onGet('library_guides/PHIL1002').reply(() => { return [200, libraryGuides_PHIL1002] })
    .onGet('library_guides/ACCT1101').reply(() => { return [200, libraryGuides_ACCT1101] })

    .onGet('course_resources/FREN1010/St Lucia/Semester%25202%25202020/reading_list')
    .reply(() => {
        return [200, courseReadingList_FREN1010]
    })
    .onGet('course_resources/HIST1201/St Lucia/Semester%25202%25202020/reading_list')
    .reply(() => {
        return [200, courseReadingList_HIST1201]
    })
    .onGet('course_resources/PHIL1002/St Lucia/Semester%25202%25202020/reading_list')
    .reply(() => {
        return [200, courseReadingList_PHIL1002]
    })
    .onGet('course_resources/ACCT1101/St Lucia/Semester%25202%25202020/reading_list')
    .reply(() => {
        return [200, courseReadingList_ACCT1101]
    })
    .onAny()
    .reply(config => {
        console.log('url not mocked...', config);
        return [404, { message: `MOCK URL NOT FOUND: ${config.url}` }];
    });
