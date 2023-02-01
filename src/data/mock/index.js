/* eslint-disable */
import { api, SESSION_COOKIE_NAME, SESSION_USER_GROUP_COOKIE_NAME, sessionApi } from 'config';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import * as routes from 'repositories/routes';
import * as mockData from './data';
import fetchMock from 'fetch-mock';

import exams_FREN1010 from './data/records/examListFREN1010';
import exams_FREN1011 from './data/records/examListFREN1011';
import exams_HIST1201 from './data/records/examListHIST1201';
import exams_PHIL1002 from './data/records/examListPHIL1002';
import exams_ACCT1101 from './data/records/examListACCT1101';
import libraryGuides_FREN1010 from './data/records/libraryGuides_FREN1010';
import libraryGuides_HIST1201 from './data/records/libraryGuides_HIST1201';
import libraryGuides_PHIL1002 from './data/records/libraryGuides_PHIL1002';
import libraryGuides_ACCT1101 from './data/records/libraryGuides_ACCT1101';
import courseReadingList_FREN1010 from './data/records/courseReadingList_FREN1010';
import courseReadingList_FREN1011 from './data/records/courseReadingList_FREN1011';
import courseReadingList_HIST1201 from './data/records/courseReadingList_HIST1201';
import courseReadingList_PHIL1002 from './data/records/courseReadingList_PHIL1002';
import courseReadingList_ACCT1101 from './data/records/courseReadingList_ACCT1101';
import learningResourceSearchSuggestions from './data/records/learningResourceSearchSuggestions';
import examSuggestion_FREN from './data/records/examSuggestion_FREN';
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
import { spotlights as spotlightsHomepage } from './data/spotlights';
import { spotlightsLong } from './data/spotlightsLong';
import examSearch_FREN from './data/records/examSearch_FREN';
import examSearch_DENT80 from './data/records/examSearch_DENT80';
import testTag_onLoad from './data/records/test_tag_onLoad';
//import testTag_siteList from './data/records/test_tag_sites';
import testTag_floorList from './data/records/test_tag_floors';
import testTag_roomList from './data/records/test_tag_rooms';
//import testTag_assetTypes from './data/records/test_tag_asset_types';
import testTag_testDevices from './data/records/test_tag_test_devices';
import testTag_assets from './data/records/test_tag_assets';

const moment = require('moment');

const queryString = require('query-string');
const mock = new MockAdapter(api, { delayResponse: 1000 });
const mockSessionApi = new MockAdapter(sessionApi, { delayResponse: 1000 });
const escapeRegExp = input => input.replace('.\\*', '.*').replace(/[\-Aler\[\]\{\}\(\)\+\?\\\^\$\|]/g, '\\$&');
// set session cookie in mock mode

// Get user from query string
let user = queryString.parse(location.search || location.hash.substring(location.hash.indexOf('?'))).user;

if (!!user && user.length > 0 && user !== 'public') {
    Cookies.set(SESSION_COOKIE_NAME, 'abc123');
    Cookies.set(SESSION_USER_GROUP_COOKIE_NAME, 'LIBRARYSTAFFB');
}
mockData.accounts.uqrdav10 = mockData.uqrdav10.account;
mockData.accounts.uqagrinb = mockData.uqagrinb.account;
if (user && !mockData.accounts[user]) {
    console.warn(
        `API MOCK DATA: User name ${user} is not found, please use one of the usernames from mock data only...`,
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
    // mock account response
    if (user === 'public') {
        return [403, {}];
    } else if (mockData.accounts[user]) {
        return [200, mockData.accounts[user]];
    }
    return [404, {}];
});

mock.onGet(routes.CURRENT_AUTHOR_API().apiUrl).reply(() => {
    // mock current author details from fez
    if (user === 'anon') {
        return [403, {}];
    } else if (mockData.currentAuthor[user]) {
        return [200, mockData.currentAuthor[user]];
    }
    return [404, {}];
});

mock.onGet(routes.SPOTLIGHTS_API_CURRENT().apiUrl).reply(withDelay([200, [...spotlightsHomepage]]));

mock.onPost(routes.SPOTLIGHT_SAVE_API({ id: '1e7a5980-d7d6-11eb-a4f2-fd60c7694898' }).apiUrl).reply(
    withDelay([
        500,
        {
            id: '1e7a5980-d7d6-11eb-a4f2-fd60c7694898',
            start: '2021-06-29 01:00:00',
            end: '2031-07-30 06:00:00',
            title: 'Have you got your mask? COVID-19',
            url: 'https://about.uq.edu.au/coronavirus',
            img_url: 'http://localhost:2020/public/images/spotlights/babcccc0-e0e4-11ea-b159-6dfe174e1a21.jpg',
            img_alt: 'Have you got your mask? Please continue to maintain physically distancing.',
            weight: 30,
            active: 1,
            admin_notes: '',
        },
    ]),
);
mock.onPost(routes.SPOTLIGHT_SAVE_API({ id: '3fa92cc0-6ab9-11e7-839f-a1392c2927cc' }).apiUrl).reply(
    withDelay([
        200,
        {
            id: '3fa92cc0-6ab9-11e7-839f-a1392c2927cc',
            start: '2021-01-08 15:05:00',
            end: '2021-01-18 18:00:00',
            title: 'Has been dragged to position #2',
            url: 'https://web.library.uq.edu.au/library-services/covid-19',
            img_url: 'https://app.library.uq.edu.au/file/public/4d2dce40-5175-11eb-8aa1-fbc04f4f5310.jpg',
            img_alt: 'Our spaces and collections are closed temporarily. Read more Library COVID-19 Updates.',
            weight: 20,
            active: 0,
            admin_notes: '',
        },
    ]),
);
mock.onPost(routes.SPOTLIGHT_SAVE_API({ id: 'fba95ec0-77f5-11eb-8c73-9734f9d4b368' }).apiUrl).reply(
    withDelay([
        200,
        {
            id: 'fba95ec0-77f5-11eb-8c73-9734f9d4b368',
            start: '2021-03-01 00:01:00',
            end: '2099-12-07 23:59:00',
            title: 'Study outdoors in Duhig Place - Study space',
            url: 'http://bit.ly/3uBIK7C',
            img_url: 'http://localhost:2020/public/images/spotlights/52d3e090-d096-11ea-916e-092f3af3e8ac.jpg',
            img_alt: 'Study outdoors in Duhig Place. Shade, wifi, tables, bubbler, fairy lights and fresh air.',
            weight: 10,
            active: 0,
            admin_notes: '',
        },
    ]),
);
mock.onPost(routes.SPOTLIGHT_SAVE_API({ id: '480c5c20-6df0-11e7-86d1-31e8626e095b' }).apiUrl).reply(
    withDelay([
        200,
        {
            id: '480c5c20-6df0-11e7-86d1-31e8626e095b',
            start: '2021-01-08 15:05:00',
            end: '2021-01-18 18:00:00',
            title: 'was in pos #2, dragging #1 moved this',
            url: 'https://web.library.uq.edu.au/library-services/covid-19',
            img_url: 'https://app.library.uq.edu.au/file/public/4d2dce40-5175-11eb-8aa1-fbc04f4f5310.jpg',
            img_alt: 'Our spaces and collections are closed temporarily. Read more Library COVID-19 Updates.',
            weight: 10,
            active: 0,
            admin_notes: '',
        },
    ]),
);
mock.onGet(routes.SPOTLIGHT_GET_BY_ID_API({ id: '9eab3aa0-82c1-11eb-8896-eb36601837f5' }).apiUrl).reply(
    withDelay([
        200,
        {
            id: '9eab3aa0-82c1-11eb-8896-eb36601837f5',
            start: '2021-03-15 00:02:00',
            end: '2099-03-21 23:59:00',
            title: 'Can be deleted and edited',
            url: 'https://web.library.uq.edu.au/locations-hours/dorothy-hill-engineering-and-sciences-library',
            img_url: 'http://localhost:2020/public/images/spotlights/babcccc0-e0e4-11ea-b159-6dfe174e1a21.jpg',
            img_alt:
                'Dorothy Hill Engineering & Sciences Library. Meeting rooms, low-light spaces, quiet spaces & more.',
            weight: 10,
            active: 1,
            admin_notes: 'sample admin note',
        },
    ]),
);
mock.onGet(routes.SPOTLIGHT_GET_BY_ID_API({ id: 'fba95ec0-77f5-11eb-8c73-9734f9d4b368' }).apiUrl).reply(
    withDelay([
        200,
        {
            id: 'fba95ec0-77f5-11eb-8c73-9734f9d4b368',
            start: '2021-03-15 00:02:00',
            end: '2099-03-21 23:59:00',
            title: 'Can be deleted and edited',
            url: 'https://web.library.uq.edu.au/locations-hours/dorothy-hill-engineering-and-sciences-library',
            img_url: 'http://localhost:2020/public/images/spotlights/52d3e090-d096-11ea-916e-092f3af3e8ac.jpg',
            img_alt:
                'Dorothy Hill Engineering & Sciences Library. Meeting rooms, low-light spaces, quiet spaces & more.',
            weight: 20,
            active: 1,
            admin_notes: 'Admin note 2',
        },
    ]),
);
mock.onGet(routes.SPOTLIGHT_GET_BY_ID_API({ id: '1e7a5980-d7d6-11eb-a4f2-fd60c7694898' }).apiUrl).reply(
    withDelay([
        200,
        {
            id: '1e7a5980-d7d6-11eb-a4f2-fd60c7694898',
            start: '2021-03-15 00:02:00',
            end: '2099-03-21 23:59:00',
            title: 'Can be deleted and edited',
            url: 'https://web.library.uq.edu.au/locations-hours/dorothy-hill-engineering-and-sciences-library',
            img_url: 'http://localhost:2020/public/images/spotlights/babcccc0-e0e4-11ea-b159-6dfe174e1a21.jpg',
            img_alt:
                'Dorothy Hill Engineering & Sciences Library. Meeting rooms, low-light spaces, quiet spaces & more.',
            weight: 30,
            active: 1,
            admin_notes: '',
        },
    ]),
);
mock.onGet(routes.SPOTLIGHT_GET_BY_ID_API({ id: '38cbf430-8693-11e9-98ab-9d52a58e86ca' }).apiUrl).reply(
    withDelay([
        200,
        {
            id: '38cbf430-8693-11e9-98ab-9d52a58e86ca',
            start: '2021-03-15 00:02:00',
            end: '2099-03-21 23:59:00',
            title: 'Can be deleted and edited',
            url: 'https://web.library.uq.edu.au/locations-hours/dorothy-hill-engineering-and-sciences-library',
            img_url: 'http://localhost:2020/public/images/spotlights/f9ff71b0-d77e-11ea-8881-93befcabdbc2.jpg',
            img_alt:
                'Dorothy Hill Engineering & Sciences Library. Meeting rooms, low-light spaces, quiet spaces & more.',
            weight: 40,
            active: 1,
            admin_notes: '',
        },
    ]),
);
mock.onGet(routes.SPOTLIGHT_GET_BY_ID_API({ id: '298288b0-605c-11eb-ad87-357f112348ef' }).apiUrl).reply(
    withDelay([
        200,
        {
            id: '298288b0-605c-11eb-ad87-357f112348ef',
            start: '2031-01-27 00:01:00',
            end: '2099-02-07 23:59:00',
            title: 'Changes to Library loans and rules (can be edited)',
            url: 'https://web.library.uq.edu.au/borrowing-requesting/how-borrow/borrowing-rules',
            img_url: 'http://localhost:2020/public/images/spotlights/52d3e090-d096-11ea-916e-092f3af3e8ac.jpg',
            img_alt: 'Changes to Library loans and rules',
            weight: 50,
            active: 0,
            admin_notes: '',
        },
    ]),
);
mock.onAny(routes.SPOTLIGHT_GET_BY_ID_API({ id: '1e1b0e10-c400-11e6-a8f0-47525a49f469' }).apiUrl).reply(
    withDelay([
        200,
        {
            id: '1e1b0e10-c400-11e6-a8f0-47525a49f469',
            start: '2016-12-17 12:24:00',
            end: '2021-02-28 23:59:00',
            title: 'Can be viewed or deleted past #1',
            url: 'https://web.library.uq.edu.au/blog/2016/12/your-feedback-july-september-2016',
            img_url: 'http://localhost:2020/public/images/spotlights/52d3e090-d096-11ea-916e-092f3af3e8ac.jpg',
            img_alt: 'Feedback on library services',
            weight: 0,
            active: 0,
            admin_notes: 'sample admin note 2',
        },
    ]),
);
mock.onPost(routes.SPOTLIGHT_SAVE_API({ id: '9eab3aa0-82c1-11eb-8896-eb36601837f5' }).apiUrl).reply(
    withDelay([
        200,
        {
            id: '9eab3aa0-82c1-11eb-8896-eb36601837f5',
            start: '2021-03-15 00:02:00',
            end: '2099-03-21 23:59:00',
            title: 'Can be deleted and edited',
            url: 'https://web.library.uq.edu.au/locations-hours/dorothy-hill-engineering-and-sciences-library',
            img_url: 'http://localhost:2020/public/images/spotlights/babcccc0-e0e4-11ea-b159-6dfe174e1a21.jpg',
            img_alt:
                'Dorothy Hill Engineering & Sciences Library. Meeting rooms, low-light spaces, quiet spaces & more.',
            weight: 10,
            active: 1,
            admin_notes: '',
        },
    ]),
);
mock.onPost(routes.SPOTLIGHT_SAVE_API({ id: '298288b0-605c-11eb-ad87-357f112348ef' }).apiUrl).reply(
    withDelay([
        200,
        {
            id: '298288b0-605c-11eb-ad87-357f112348ef',
            start: '2031-01-27 00:01:00',
            end: '2099-02-07 23:59:00',
            title: 'Changes to Library loans and rules (can be edited)',
            url: 'https://web.library.uq.edu.au/borrowing-requesting/how-borrow/borrowing-rules',
            img_url: 'http://localhost:2020/public/images/spotlights/52d3e090-d096-11ea-916e-092f3af3e8ac.jpg',
            img_alt: 'Changes to Library loans and rules',
            weight: 50,
            active: 0,
            admin_notes: '',
        },
    ]),
);
mock.onPost(routes.SPOTLIGHT_SAVE_API({ id: '729df1a0-7dd0-11e9-a3a7-5fd844715207' }).apiUrl).reply(
    withDelay([
        200,
        {
            id: '729df1a0-7dd0-11e9-a3a7-5fd844715207',
            start: '2021-01-25 00:00:00',
            end: '2021-02-07 23:59:00',
            title: 'Find past exam papers',
            url: 'https://web.library.uq.edu.au/library-services/students/past-exam-papers',
            img_url: 'http://localhost:2020/public/images/spotlights/52d3e090-d096-11ea-916e-092f3af3e8ac.jpg',
            img_alt: 'Preparing for exams? Search past exam papers.',
            weight: 20,
            active: 1,
            admin_notes: '',
        },
    ]),
);

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
            priority_type: 'info',
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
            priority_type: 'info',
        },
    ]),
);
// mock.onAny(routes.ALERT_SAVE_API({ id: '1db618c0-d897-11eb-a27e-df4e46db7245' }).apiUrl).reply(withDelay([500, {}]));
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
            priority_type: 'info',
            systems: ['primo', 'homepage'],
            created_by: '?',
            updated_by: 'uqtest2',
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
            priority_type: 'urgent',
            systems: ['homepage'],
            created_by: 'uqtest1',
            updated_by: 'uqtest2',
        },
    ]),
);
mock.onGet(routes.ALERT_BY_ID_API({ id: 'd23f2e10-d7d6-11eb-a928-71f3ef9d35d9' }).apiUrl).reply(
    withDelay([
        200,
        {
            id: 'd23f2e10-d7d6-11eb-a928-71f3ef9d35d9',
            start: '2021-06-28 16:02:54',
            end: '2021-06-29 15:00:54',
            title: 'Face masks in the Library:',
            body:
                'Test Extreme alert with a longish body content.[permanent][UQ community COVID-19 advice](https://about.uq.edu.au/coronavirus)',
            priority_type: 'extreme',
            created_by: '?',
            updated_by: null,
        },
    ]),
);
mock.onGet(routes.ALERT_BY_ID_API({ id: '0aa12a30-996a-11eb-b009-3f6ded4fdb35' }).apiUrl).reply(
    withDelay([
        200,
        {
            id: '0aa12a30-996a-11eb-b009-3f6ded4fdb35',
            start: '2031-09-04 02:00:55',
            end: '2032-09-04 03:00:55',
            title: 'Example alert:',
            body: 'This alert will return an error if deleted in mock',
            priority_type: 'info',
            created_by: '?',
            updated_by: null,
        },
    ]),
);

mock.onGet(routes.ALERT_BY_ID_API({ id: 'cc0ab120-d4a3-11eb-b5ee-6593c1ac8f08' }).apiUrl).reply(
    withDelay([
        200,
        {
            id: 'cc0ab120-d4a3-11eb-b5ee-6593c1ac8f08',
            start: '2021-06-27 14:00:57',
            end: '2021-06-27 14:50:57',
            title: 'Network outage, Duhig Tower, 2.30-2.45pm today.',
            body:
                'There will be a short network outage in the Duhig Tower this afternoon (Sunday 27 June) for network maintenance. During this time the internet, library computers and printers will be affected. We apologise for any inconvenience.',
            priority_type: 'extreme',
            created_by: 'uqtest1',
            updated_by: 'uqtest2',
        },
    ]),
);

mock.onGet(routes.COMP_AVAIL_API().apiUrl).reply(withDelay([200, computerAvailability]));
// .reply(withDelay([500, {}]));

// Fetchmock docs: http://www.wheresrhys.co.uk/fetch-mock/
fetchMock.mock(
    'begin:https://api.library.uq.edu.au/staging/learning_resources/suggestions?hint=',
    learningResourceSearchSuggestions,
);

// spotlights
mock.onGet(routes.SPOTLIGHTS_ALL_API().apiUrl).reply(
    withDelay([
        200,
        spotlightsLong.map(r => {
            // the first entry ends today
            return r.id === '9eab3aa0-82c1-11eb-8896-eb36601837f5'
                ? {
                      ...r,
                      end: moment()
                          .endOf('day')
                          .format('YYYY-MM-DDTHH:mm'),
                  }
                : r;
        }),
    ]),
);

mock.onAny(routes.SPOTLIGHT_CREATE_API().apiUrl).reply(
    withDelay([
        200,
        {
            id: '5bc14170-e1e9-11ea-b88d-9bb67d805fd9',
            start: '2020-08-19 00:01:32',
            end: '2020-08-30 23:59:00',
            title: 'Announcing the 2020 Fryer Library Fellow - Dr N.A.J. Taylor',
            url: 'https://web.library.uq.edu.au/blog/2020/08/announcing-2020-fryer-library-fellow',
            img_url: 'http://localhost:2020/public/images/spotlights/43f8c480-e1e9-11ea-8b42-656cb34d5c84.jpg',
            img_alt: 'Announcing the 2020 Fryer Library Fellow - Dr N.A.J. Taylor',
            weight: 4,
            active: 1,
        },
    ]),
);

mock.onDelete(routes.SPOTLIGHT_DELETE_BULK_API().apiUrl).reply(withDelay([200, []]));

mock.onPost(new RegExp(escapeRegExp(routes.UPLOAD_PUBLIC_FILES_API().apiUrl))).reply(200, [
    {
        key: '123456-123456-123456-123456-123456',
        type: 'mimetype',
        name: 'name',
        size: 9999,
    },
]);

mock.onGet('exams/course/FREN1010/summary')
    .reply(() => {
        return [200, exams_FREN1010];
    })
    .onGet('exams/course/FREN1011/summary')
    .reply(() => {
        return [200, exams_FREN1011];
    })
    .onGet('exams/course/HIST1201/summary')
    .reply(() => {
        return [200, exams_HIST1201];
    })
    .onGet('exams/course/PHIL1002/summary')
    .reply(() => {
        return [200, exams_PHIL1002];
    })
    .onGet('exams/course/ACCT1101/summary')
    .reply(() => {
        return [200, exams_ACCT1101];
    })

    .onGet('library_guides/FREN1010')
    .reply(() => {
        return [200, libraryGuides_FREN1010];
    })
    .onGet('library_guides/FREN1011')
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

    .onGet('learning_resources/reading_list/summary/FREN1010/St Lucia/Semester%25202%25202020')
    .reply(() => {
        return [200, courseReadingList_FREN1010];
    })
    .onGet('learning_resources/reading_list/summary/FREN1011//Semester%25202%25202020')
    .reply(() => {
        return [200, courseReadingList_FREN1011];
    })
    .onGet('learning_resources/reading_list/summary/HIST1201/St Lucia/Semester%25202%25202020')
    .reply(() => {
        return [200, courseReadingList_HIST1201];
    })
    .onGet('learning_resources/reading_list/summary/PHIL1002/St Lucia/Semester%25203%25202020')
    .reply(() => {
        return [200, courseReadingList_PHIL1002];
    })
    .onGet('learning_resources/reading_list/summary/ACCT1101/St Lucia/Semester%25202%25202020')
    .reply(() => {
        return [200, courseReadingList_ACCT1101];
    })
    .onGet('exams/suggestions/fr')
    .reply(() => {
        return [200, examSuggestion_FREN];
    })
    .onGet('exams/suggestions/fre')
    .reply(() => {
        return [200, examSuggestion_FREN];
    })
    .onGet('exams/suggestions/fren')
    .reply(() => {
        return [200, examSuggestion_FREN];
    })
    .onGet('exams/suggestions/fren1')
    .reply(() => {
        return [200, examSuggestion_FREN];
    })
    .onGet('exams/suggestions/fren10')
    .reply(() => {
        return [200, examSuggestion_FREN];
    })
    .onGet('exams/suggestions/fren101')
    .reply(() => {
        return [200, examSuggestion_FREN];
    })
    .onGet('exams/suggestions/fren1010')
    .reply(() => {
        return [200, examSuggestion_FREN];
    })
    .onGet('exams/suggestions/em') // this course code fragment does not return any results - mnemonic: empty
    .reply(() => {
        return [200, []];
    })
    .onGet('exams/suggestions/fa') // so dev can start typing in fail without it being weird
    .reply(() => {
        return [200, []];
    })
    .onGet('exams/suggestions/fai')
    .reply(() => {
        return [200, []];
    })
    .onGet('exams/suggestions/fail')
    .reply(() => {
        return [500, []];
    })
    .onGet('exams/suggestions/XYZA')
    .reply(() => {
        return [200, []];
    })
    .onGet('exams/search/FREN')
    .reply(() => {
        return [200, examSearch_FREN];
    })
    .onGet('exams/search/fr')
    .reply(() => {
        return [200, examSearch_FREN];
    })
    .onGet('exams/search/fre')
    .reply(() => {
        return [200, examSearch_FREN];
    })
    .onGet('exams/search/fren')
    .reply(() => {
        return [200, examSearch_FREN];
    })
    .onGet('exams/search/fren1')
    .reply(() => {
        return [200, examSearch_FREN];
    })
    .onGet('exams/search/fren10')
    .reply(() => {
        return [200, examSearch_FREN];
    })
    .onGet('exams/search/fren101')
    .reply(() => {
        return [200, examSearch_FREN];
    })
    .onGet('exams/search/fren1010')
    .reply(() => {
        return [200, examSearch_FREN];
    })
    .onGet('exams/search/dent')
    .reply(() => {
        return [200, examSearch_DENT80];
    })
    .onGet('exams/search/empt') // this course code fragment does not return any results - mnemonic: empty
    .reply(() => {
        return [
            200,
            {
                minYear: 2017,
                maxYear: 2022,
                periods: [],
                papers: [],
            },
        ];
    })

    /** TEST AND TAG ROUTES **/

    // CONFIG
    .onGet('test_and_tag/onload')
    .reply(() => {
        return [200, testTag_onLoad];
    })

    // T&T FLOORS
    .onGet(/test_and_tag\/building\/\d+\/current/)
    .reply(config => {
        const r = /\d+/;
        const id = parseInt(config.url.match(r)?.[0], 10 ?? 0);
        return [200, testTag_floorList.find(floor => floor.building_id === id)];
    })

    // T&T ROOMS
    .onGet(/test_and_tag\/floor\/\d+\/current/)
    .reply(config => {
        const r = /\d+/;
        const id = parseInt(config.url.match(r)?.[0], 10 ?? 0);
        return [200, testTag_roomList.find(room => room.floor_id === id)];
    })

    // ASSETS (with pattern matching)
    .onGet(/test_and_tag\/asset\/search\/current\/*/)
    .reply(config => {
        const pattern = config.url.split('/').pop();
        // filter array to matching asset id's
        return [
            200,
            testTag_assets.filter(asset => asset.asset_id_displayed.toUpperCase().startsWith(pattern.toUpperCase())),
        ];
    })

    .onPost(routes.TEST_TAG_ASSET_ACTION().apiUrl)
    // .reply(() => [200, {data: {
    //     asset_status: 'FAILED',
    //     asset_id_displayed:'UQL000298',
    //     user_licence_number: '13962556',
    //     action_date: '2022-11-16',
    //     asset_next_test_due_date: '2023Nov16',
    //     }}]
    // )
    .reply(() => [
        200,
        {
            data: {
                asset_status: 'CURRENT',
                asset_id_displayed: 'UQL000298',
                user_licence_number: '13962556',
                action_date: '2022-11-16',
                asset_next_test_due_date: '2023Nov16',
            },
        },
    ])

    .onGet('exams/search/fail')
    .reply(() => {
        return [500, []];
    })
    .onAny()
    .reply(function(config) {
        console.log('url not mocked...', config);
        return [404, { message: `MOCK URL NOT FOUND: ${config.url}` }];
    });
