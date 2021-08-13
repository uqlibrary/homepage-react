/* eslint-disable */
import { api, SESSION_COOKIE_NAME, sessionApi } from 'config';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import * as routes from 'repositories/routes';
import * as mockData from './data';
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
import examSuggestions from './data/records/examSuggestions';
import {
    computerAvailability,
    incompleteNTROs,
    libHours,
    loans,
    possibleRecords,
    printBalance,
    training_object,
} from './data/account';
import { alertList } from './data/alerts';
// import { spotlights } from './data/spotlights';
import { spotlightsLong as spotlights } from './data/spotlightsLong';

const queryString = require('query-string');
const mock = new MockAdapter(api, { delayResponse: 100 });
const mockSessionApi = new MockAdapter(sessionApi, { delayResponse: 100 });
const escapeRegExp = input => input.replace('.\\*', '.*').replace(/[\-Aler\[\]\{\}\(\)\+\?\\\^\$\|]/g, '\\$&');
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

const withDelay = response => config => {
    const randomTime = Math.floor(Math.random() * 100) + 1; // Change these values to delay mock API
    // const randomTime = 5000;
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve(response);
        }, randomTime);
    });
};

mockSessionApi.onGet(routes.CURRENT_ACCOUNT_API().apiUrl).reply(() => {
    // mock account response
    if (['s2222222', 's3333333'].indexOf(user) > -1) {
        withDelay([200, mockData.accounts[user]]);
    } else if (mockData.accounts[user]) {
        withDelay([403, {}]);
    }
    withDelay([404, {}]);
});

mock.onGet(routes.CURRENT_ACCOUNT_API().apiUrl).reply(() => {
    console.log('Loading Account');
    // mock account response
    if (user === 'public') {
        return [403, {}];
    } else if (mockData.accounts[user]) {
        return [200, mockData.accounts[user]];
    }
    return [404, {}];
});

mock.onGet(routes.CURRENT_AUTHOR_API().apiUrl).reply(() => {
    console.log('Loading eSpace Author');
    // mock current author details from fez
    if (user === 'anon') {
        return [403, {}];
    } else if (mockData.currentAuthor[user]) {
        return [200, mockData.currentAuthor[user]];
    }
    return [404, {}];
});

mock.onGet(routes.AUTHOR_DETAILS_API({ userId: user }).apiUrl).reply(() => {
    console.log('Loading eSpace Author Details');
    // mock current author details
    if (user === 'anon') {
        return [403, {}];
    } else if (mockData.authorDetails[user]) {
        return [200, mockData.authorDetails[user]];
    }
    return [404, {}];
});

mock.onGet(routes.SPOTLIGHTS_API_CURRENT().apiUrl).reply(withDelay([200, [...spotlights]]));

mock.onGet(routes.TRAINING_API(10).apiUrl).reply(withDelay([200, training_object]));
// .reply(withDelay([200, training_array]));
// .reply(withDelay([500, {}]));

mock.onGet(routes.PRINTING_API().apiUrl).reply(withDelay([200, printBalance]));

mock.onGet(routes.LOANS_API().apiUrl).reply(withDelay([200, loans]));

mock.onGet(routes.LIB_HOURS_API().apiUrl).reply(withDelay([200, libHours]));
// .reply(withDelay([500, {}]));

mock.onGet(routes.POSSIBLE_RECORDS_API().apiUrl).reply(withDelay([200, possibleRecords]));

mock.onGet(routes.INCOMPLETE_NTRO_RECORDS_API().apiUrl).reply(withDelay([200, incompleteNTROs]));

mock.onGet(routes.ALERTS_ALL_API().apiUrl).reply(withDelay([200, alertList]));
mock.onAny(routes.ALERT_CREATE_API().apiUrl).reply(
    withDelay([
        200,
        {
            id: '99999-d897-11eb-a27e-df4e46db7245',
            start: '2020-06-07 02:00:03',
            end: '2020-06-07 03:00:03',
            title: 'Updated alert 1',
            body:
                'There may be short periods of disruption during this scheduled maintenance. We apologise for any inconvenience.',
            urgent: 0,
        },
    ]),
);
// mock.onAny(routes.ALERT_CREATE_API().apiUrl).reply(withDelay([500, {}]));
mock.onAny(routes.ALERT_SAVE_API({ id: '1db618c0-d897-11eb-a27e-df4e46db7245' }).apiUrl).reply(
    withDelay([
        200,
        {
            id: '1db618c0-d897-11eb-a27e-df4e46db7245',
            start: '2020-06-07 02:00:03',
            end: '2020-06-07 03:00:03',
            title: 'Updated alert 2',
            body:
                'There may be short periods of disruption during this scheduled maintenance. We apologise for any inconvenience.',
            urgent: 0,
        },
    ]),
);
// mock.onAny(routes.ALERT_SAVE_API({ id: '1db618c0-d897-11eb-a27e-df4e46db7245' }).apiUrl).reply(withDelay([500, {}]));
console.log('delete mock url = ', routes.ALERT_DELETE_API({ id: '1db618c0-d897-11eb-a27e-df4e46db7245' }).apiUrl);
mock.onDelete(routes.ALERT_DELETE_API({ id: '1db618c0-d897-11eb-a27e-df4e46db7245' }).apiUrl).reply(
    withDelay([200, []]),
);
// mock.onDelete(routes.ALERT_DELETE_API({ id: '1db618c0-d897-11eb-a27e-df4e46db7245' }).apiUrl).reply(withDelay([500, []]));
mock.onDelete(routes.ALERT_DELETE_API({ id: 'd23f2e10-d7d6-11eb-a928-71f3ef9d35d9' }).apiUrl).reply(
    withDelay([200, []]),
);
mock.onDelete(routes.ALERT_DELETE_API({ id: 'da181a00-d476-11eb-8596-2540419539a9' }).apiUrl).reply(
    withDelay([200, []]),
);
mock.onDelete(routes.ALERT_DELETE_API({ id: 'cc0ab120-d4a3-11eb-b5ee-6593c1ac8f08' }).apiUrl).reply(
    withDelay([200, []]),
);
mock.onDelete(routes.ALERT_DELETE_API({ id: '0aa12a30-996a-11eb-b009-3f6ded4fdb35' }).apiUrl).reply(
    withDelay([500, []]),
);
mock.onGet(routes.ALERT_BY_ID_API({ id: 'dc64fde0-9969-11eb-8dc3-1d415ccc50ec' }).apiUrl).reply(
    withDelay([
        200,
        {
            id: 'dc64fde0-9969-11eb-8dc3-1d415ccc50ec',
            start: '2021-06-06 00:45:34',
            end: '2021-06-06 05:00:34',
            title: 'Sample alert 2:',
            body: 'Has mock data.',
            urgent: 0,
        },
    ]),
);
// mock.onAny(routes.ALERT_BY_ID_API({ id: 'dc64fde0-9969-11eb-8dc3-1d415ccc50ec' }).apiUrl).reply(withDelay([500, {}]));

mock.onGet(routes.ALERT_BY_ID_API({ id: '1db618c0-d897-11eb-a27e-df4e46db7245' }).apiUrl).reply(
    withDelay([
        200,
        {
            id: '1db618c0-d897-11eb-a27e-df4e46db7245',
            start: '2021-06-29 15:00:34',
            end: '2031-07-02 18:30:34',
            title: 'Example alert:',
            body:
                'This alert can be edited in mock.[permanent][UQ community COVID-19 advice](https://about.uq.edu.au/coronavirus)',
            urgent: 1,
        },
    ]),
);

mock.onGet(routes.COMP_AVAIL_API().apiUrl).reply(withDelay([200, computerAvailability]));
// .reply(withDelay([500, {}]));

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

// Fetchmock docs: http://www.wheresrhys.co.uk/fetch-mock/
fetchMock.mock('begin:https://api.library.uq.edu.au/v1/search_suggestions?type=exam_paper', examSuggestions);

fetchMock.mock(
    'begin:https://api.library.uq.edu.au/v1/search_suggestions?type=learning_resource',
    learningResourceSearchSuggestions,
);

// spotlights
mock.onGet(routes.SPOTLIGHTS_ALL_API().apiUrl).reply(withDelay([200, spotlights]));

mock.onGet('course_resources/FREN1010/exams')
    .reply(() => {
        return [200, exams_FREN1010];
    })
    .onGet('course_resources/HIST1201/exams')
    .reply(() => {
        return [200, exams_HIST1201];
    })
    .onGet('course_resources/PHIL1002/exams')
    .reply(() => {
        return [200, exams_PHIL1002];
    })
    .onGet('course_resources/ACCT1101/exams')
    .reply(() => {
        return [200, exams_ACCT1101];
    })

    .onGet('library_guides/FREN1010')
    .reply(() => {
        return [200, libraryGuides_FREN1010];
    })
    .onGet('library_guides/HIST1201')
    .reply(() => {
        return [200, libraryGuides_HIST1201];
    })
    .onGet('library_guides/PHIL1002')
    .reply(() => {
        return [200, libraryGuides_PHIL1002];
    })
    .onGet('library_guides/ACCT1101')
    .reply(() => {
        return [200, libraryGuides_ACCT1101];
    })

    .onGet('course_resources/FREN1010/St Lucia/Semester%25202%25202020/reading_list')
    .reply(() => {
        return [200, courseReadingList_FREN1010];
    })
    .onGet('course_resources/HIST1201/St Lucia/Semester%25202%25202020/reading_list')
    .reply(() => {
        return [200, courseReadingList_HIST1201];
    })
    .onGet('course_resources/PHIL1002/St Lucia/Semester%25202%25202020/reading_list')
    .reply(() => {
        return [200, courseReadingList_PHIL1002];
    })
    .onGet('course_resources/ACCT1101/St Lucia/Semester%25202%25202020/reading_list')
    .reply(() => {
        return [200, courseReadingList_ACCT1101];
    })
    .onAny()
    .reply(config => {
        console.log('url not mocked...', config);
        return [404, { message: `MOCK URL NOT FOUND: ${config.url}` }];
    });
