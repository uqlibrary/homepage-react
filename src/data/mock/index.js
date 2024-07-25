/* eslint-disable */
import { api, SESSION_COOKIE_NAME, SESSION_USER_GROUP_COOKIE_NAME, sessionApi } from 'config';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import * as routes from 'repositories/routes';
import * as mockData from './data';
import fetchMock from 'fetch-mock';

import exams_FREN1010 from './data/records/learningResources/examListFREN1010';
import exams_FREN1011 from './data/records/learningResources/examListFREN1011';
import exams_HIST1201 from './data/records/learningResources/examListHIST1201';
import exams_PHIL1002 from './data/records/learningResources/examListPHIL1002';
import exams_ACCT1101 from './data/records/learningResources/examListACCT1101';
import libraryGuides_FREN1010 from './data/records/learningResources/libraryGuides_FREN1010';
import libraryGuides_HIST1201 from './data/records/learningResources/libraryGuides_HIST1201';
import libraryGuides_PHIL1002 from './data/records/learningResources/libraryGuides_PHIL1002';
import libraryGuides_ACCT1101 from './data/records/learningResources/libraryGuides_ACCT1101';
import courseReadingList_FREN1010 from './data/records/learningResources/courseReadingList_FREN1010';
import courseReadingList_FREN1011 from './data/records/learningResources/courseReadinglist_FREN1011';
import courseReadingList_HIST1201 from './data/records/learningResources/courseReadingList_HIST1201';
import courseReadingList_PHIL1002 from './data/records/learningResources/courseReadingList_PHIL1002';
import courseReadingList_ACCT1101 from './data/records/learningResources/courseReadingList_ACCT1101';
import learningResourceSearchSuggestions from './data/records/learningResources/learningResourceSearchSuggestions';
import examSuggestion_FREN from './data/records/learningResources/examSuggestion_FREN';
import { computerAvailability } from './data/computerAvailability';
import { libHours } from './data/libHours';
import { training_object } from './data/training';
import { espaceSearchResponse, loans, printBalance } from './data/general';
import { alertList } from './data/alertsLong';
import examSearch_FREN from './data/records/learningResources/examSearch_FREN';
import examSearch_DENT80 from './data/records/learningResources/examSearch_DENT80';
import testTag_user from './data/records/testAndTag/test_tag_user';
import testTag_user_UQPF from './data/records/testAndTag/test_tag_userUQPF';
import test_tag_user_permissions from './data/records/testAndTag/test_tag_user_permissions';
import testTag_dashboardOnLoad from './data/records/testAndTag/test_tag_dashboardOnLoad';
import testTag_inspectionOnLoad from './data/records/testAndTag/test_tag_inspectionOnLoad';
import testTag_onLoadUQPF from './data/records/testAndTag/test_tag_onLoadUQPF';
import testTag_siteList from './data/records/testAndTag/test_tag_sites';
import testTag_floorList from './data/records/testAndTag/test_tag_floors';
import testTag_roomList from './data/records/testAndTag/test_tag_rooms';
import testTag_inspectionDevices from './data/records/testAndTag/test_tag_inspection_devices';
import testTag_assets from './data/records/testAndTag/test_tag_assets';
import test_tag_asset_types from './data/records/testAndTag/test_tag_asset_types';
import test_tag_pending_inspections from './data/records/testAndTag/test_tag_pending_inspections';
import test_tag_pending_inspections_site from './data/records/testAndTag/test_tag_pending_inspections_site';
import test_tag_pending_inspections_building from './data/records/testAndTag/test_tag_pending_inspections_building';
import test_tag_pending_inspections_floor from './data/records/testAndTag/test_tag_pending_inspections_floor';
import test_tag_pending_inspections_room from './data/records/testAndTag/test_tag_pending_inspections_room';
import test_tag_inspections_by_licenced_user from './data/records/testAndTag/test_tag_inspections_by_licenced_user';
import test_tag_licenced_inspectors from './data/records/testAndTag/test_tag_licenced_inspectors';
import test_tag_tagged_building_list from './data/records/testAndTag/test_tag_tagged_building_list';
import test_tag_assets_report_assets from './data/records/testAndTag/test_tag_assets_report_assets';
import test_tag_assets_mine from './data/records/testAndTag/test_tag_assets_mine';
import test_tag_user_list from './data/records/testAndTag/test_tag_user_list';

import dlor_all from './data/records/dlor/dlor_all';
import dlor_filter_list from './data/records/dlor/dlor_filter_list';
import dlor_team_list from './data/records/dlor/dlor_team_list';
import dlor_file_type_list from './data/records/dlor/dlor_file_type_list';
import dlor_series_all from './data/records/dlor/dlor_series_all';

const moment = require('moment');

const mock = new MockAdapter(api, { delayResponse: 1000 });
const mockSessionApi = new MockAdapter(sessionApi, { delayResponse: 1000 });
const escapeRegExp = input => input.replace('.\\*', '.*').replace(/[\-Aler\[\]\{\}\(\)\+\?\\\^\$\|]/g, '\\$&');
const panelRegExp = input => input.replace('.\\*', '.*').replace(/[\-\{\}\+\\\$\|]/g, '\\$&');

const queryString = new URLSearchParams(window.location.search);
let user = !!queryString
    ? queryString.get('user')
    : window.location.hash.substring(window.location.hash.indexOf('?')).user;
user = user || 'vanilla';
let responseType = !!queryString
    ? queryString.get('responseType')
    : window.location.hash.substring(window.location.hash.indexOf('?')).responseType;
responseType = responseType || 'ok';

// set session cookie in mock mode
if (!!user && user.length > 0 && user !== 'public') {
    const userCookie = () => {
        switch (user) {
            case 'uqpf':
            case 'uqttadmin':
            case 'uqttreport':
            case 'uqttinspect':
            case 'uqttalter':
                return user;
            default:
                return 'abc123';
        }
    };
    Cookies.set(SESSION_COOKIE_NAME, userCookie());
    Cookies.set(SESSION_USER_GROUP_COOKIE_NAME, 'LIBRARYSTAFFB');
}
mockData.accounts.uqrdav10 = mockData.uqrdav10.account;
mockData.accounts.uqagrinb = mockData.uqagrinb.account;
if (user && !mockData.accounts[user]) {
    console.warn(
        `API MOCK DATA: User name ${user} is not found, please use one of the usernames from mock data only...`,
    );
}

const withDelay = response => config => {
    const randomTime = Math.floor(Math.random() * 100) + 100; // Change these values to delay mock API
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

mock.onGet(routes.TRAINING_API(10).apiUrl).reply(withDelay([200, training_object]));
// .reply(withDelay([200, training_array]));
// .reply(withDelay([500, {}]));

mock.onGet(routes.LIB_HOURS_API().apiUrl).reply(withDelay([200, libHours]));
// .reply(withDelay([500, {}]));

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

mock.onPost(new RegExp(escapeRegExp(routes.UPLOAD_PUBLIC_FILES_API().apiUrl))).reply(200, [
    {
        key: '123456-123456-123456-123456-123456',
        type: 'mimetype',
        name: 'name',
        size: 9999,
    },
]);

function getSpecificTeam(teamId) {
    return (
        !!dlor_team_list &&
        !!dlor_team_list.data &&
        dlor_team_list.data.length > 0 &&
        dlor_team_list.data.find(team => team.team_id === teamId)
    );
}
function getSpecificDlorObject(dlorId) {
    const arrayOfOneRecord = dlor_all.data.filter(o => o.object_public_uuid === dlorId);
    const singleRecord = arrayOfOneRecord.length > 0 ? arrayOfOneRecord.pop() : null;
    !!singleRecord && (singleRecord.object_link_types = dlor_file_type_list.data);
    const currentTeamDetails = getSpecificTeam(singleRecord?.object_owning_team_id);
    if (!!singleRecord && !!currentTeamDetails) {
        singleRecord.owner.team_name = currentTeamDetails.team_name;
        singleRecord.owner.team_email = currentTeamDetails.team_email;
        singleRecord.owner.team_manager = currentTeamDetails.team_manager;
    }

    return singleRecord === null ? [404, {}] : [200, { data: singleRecord }];
}

mock.onGet(/dlor\/public\/find\/.*/)
    .reply(config => {
        const urlparts = config.url.split('/').pop();
        const dlorId = urlparts.split('?')[0];
        if (responseType === 'error') {
            return [500, {}];
        } else if (dlorId === 'missingRecord') {
            return [200, { data: {} }]; // this would more likely be a 404
        } else if (dlorId === 'object_404') {
            return [404, { status: 'error', message: 'No records found for that UUID' }];
        } else {
            return getSpecificDlorObject(dlorId);
        }
    })
    .onGet(/dlor\/admin\/team\/.*/)
    .reply(config => {
        const urlparts = config.url.split('/').pop();
        const teamId = urlparts.split('?')[0];
        if (responseType === 'error') {
            return [500, {}];
        } else if (teamId === 'missingRecord') {
            return [200, { data: {} }]; // this would more likely be a 404
        } else if (teamId === 'object_404') {
            return [404, { status: 'error', message: 'No records found for that UUID' }];
        } else {
            return [200, { data: dlor_team_list.data.find(team => team.team_id === Number(teamId)) }];
        }
    })
    .onPut(/dlor\/admin\/object\/.*/)
    .reply(config => {
        const urlparts = config.url.split('/').pop();
        const dlorId = urlparts.split('?')[0];
        if (responseType === 'saveError') {
            return [400, {}];
        } else if (dlorId === 'missingRecord') {
            return [200, { data: {} }]; // this would more likely be a 404
        } else {
            return getSpecificDlorObject(dlorId);
        }
    })
    .onGet('dlor/public/list/full')
    .reply(() => {
        if (responseType === 'fullListError') {
            return [500, {}];
        } else if (responseType === 'emptyResult') {
            return [200, { data: [] }]; // this would more likely be a 404
        } else {
            const currentRecords = dlor_all.data.map(d => {
                const newObj = { ...d }; // Create a shallow copy of the object
                delete newObj.object_series; // Delete the 'series' property
                return newObj;
            });
            return [200, { data: currentRecords }];
        }
    })
    .onGet('dlor/public/list/current')
    .reply(() => {
        if (responseType === 'error') {
            return [500, {}];
        } else if (responseType === 'emptyResult') {
            return [200, { data: [] }]; // this would more likely be a 404
        } else {
            const currentRecords = dlor_all.data
                .map(d => {
                    const newObj = { ...d }; // Create a shallow copy of the object
                    delete newObj.object_series; // Delete the 'series' property
                    return newObj;
                })
                .filter(o => o.object_status === 'current');
            return [200, { data: currentRecords }];
        }
    })
    .onGet('dlor/public/facet/list')
    .reply(() => {
        if (responseType === 'filtererror') {
            return [500, {}];
        } else if (responseType === 'filterLoadError') {
            return [500, { error: 'Filter api did not load' }];
        } else if (responseType === 'filterLoadEmpty') {
            return [200, []];
        } else {
            return [200, dlor_filter_list];
        }
    })
    .onGet('dlor/public/teams/list')
    .reply(() => {
        if (responseType === 'teamsLoadError') {
            return [500, { error: 'Teams api did not load' }];
        } else if (responseType === 'emptyResult') {
            return [200, { data: [] }]; // this should really be a 404?
        } else {
            return [200, dlor_team_list];
        }
    })
    .onPost('dlor/admin/team')
    .reply(() => {
        if (responseType === 'saveError') {
            return [400, {}];
        } else {
            return [
                200,
                {
                    data: {
                        objects_count: 0,
                        team_email: 'someone@example.com',
                        team_id: dlor_team_list.data.length + 1,
                        team_manager: '',
                        team_name: 'New Team name',
                    },
                },
            ];
        }
    })
    .onPut(/dlor\/admin\/team\/.*/)
    .reply(config => {
        const urlparts = config.url.split('/').pop();
        const teamId = urlparts.split('?')[0];
        // if (responseType === 'error') {
        //     return [500, {}];
        // } else if (teamId === 'missingRecord') {
        //     return [200, { data: {} }]; // this would more likely be a 404
        // } else if (teamId === 'object_404') {
        // return [404, { status: 'error', message: 'No records found for that UUID' }];
        // } else {
        return [200, { data: dlor_team_list.data.find(team => team.team_id === Number(teamId)) }];
        // }
    })
    .onDelete(/dlor\/admin\/team\/.*/)
    .reply(() => {
        if (responseType === 'saveError') {
            return [500, {}];
        } else {
            return [200, {}];
        }
    })
    .onPost('dlor/admin/object')
    .reply(() => {
        if (responseType === 'saveError') {
            return [500, {}];
        } else {
            // return [200, { data: getSpecificDlorObject('98j3-fgf95-8j34') }]; //any old id
            return getSpecificDlorObject('98j3-fgf95-8j34'); //any old id
        }
    })
    .onDelete(/dlor\/admin\/object\/.*/)
    .reply(config => {
        if (responseType === 'deleteError') {
            return [500, {}];
            // } else if (responseType === 'saveError') {
            //     return [500, {}];
        } else {
            return [200, {}];
        }
    })
    .onGet(/dlor\/admin\/file_types\/list/)
    .reply(config => {
        if (responseType === 'error') {
            return [500, {}];
            // } else if (responseType === 'missingRecord') {
            //     return [200, { data: {} }]; // this would more likely be a 404
            // } else if (responseType === 'object_404') {
            //     return [404, { status: 'error', message: 'No records found' }];
        } else {
            return [200, dlor_file_type_list];
        }
    })

    .onGet(/dlor\/public\/series\/list/)
    .reply(config => {
        if (responseType === 'error') {
            return [500, {}];
        } else {
            return [200, dlor_series_all];
        }
    })
    .onDelete(/dlor\/admin\/series\/.*/)
    .reply(() => {
        if (responseType === 'saveError') {
            return [500, {}];
        } else {
            return [200, { status: 'OK' }];
        }
    })
    .onPut(/dlor\/admin\/series\/.*/)
    .reply(config => {
        const urlparts = config.url.split('/').pop();
        const seriesId = urlparts.split('?')[0];
        if (responseType === 'saveError') {
            return [500, {}];
        } else {
            return [200, { data: dlor_series_all.data.find(series => series.series_id === Number(seriesId)) }];
        }
    })
    .onPost('dlor/admin/series')
    .reply(() => {
        if (responseType === 'saveError') {
            return [400, {}];
        } else {
            return [200, { data: { objects_count: 0, series_name: 'New Series name' } }];
        }
    })
    .onPost(routes.DLOR_DEMOGRAPHICS_SAVE_API().apiUrl)
    .reply(() => {
        if (responseType === 'notifyError') {
            return [500, {}];
        } else if (responseType === 'alreadysubscribed') {
            return [200, { status: 'OK', data: { demographics: true, subscription: false } }];
        } else {
            return [200, { status: 'OK', data: { demographics: true, subscription: true } }];
        }
    })
    .onGet(routes.DLOR_SUBSCRIPTION_CONFIRMATION_API({ id: 'a_conf_code_that_is_known' }).apiUrl)
    .reply(() => {
        return [
            200,
            {
                data: {
                    response: 'ok',
                    object_public_uuid: '938h_4986_654f',
                    object_title: 'Artificial Intelligence - Digital Essentials',
                },
            },
        ];
    })
    .onGet(routes.DLOR_SUBSCRIPTION_CONFIRMATION_API({ id: 'error' }).apiUrl)
    .reply(() => {
        return [
            500,
            {
                status: 'error',
                error: 'something went wrong',
            },
        ];
    })
    .onGet(routes.DLOR_SUBSCRIPTION_CONFIRMATION_API({ id: 'a_conf_code_that_has_already_been_used' }).apiUrl)
    .reply(() => {
        return [
            200,
            {
                data: {
                    response: 'used',
                    object_public_uuid: '938h_4986_654f',
                    object_title: 'Artificial Intelligence - Digital Essentials',
                },
            },
        ];
    })
    .onGet(/dlor\/public\/.*\/confirm\/unsubscribe/)
    .reply(config => {
        const urlparts = config.url.split('/');
        const confirmationId = urlparts[2];
        if (confirmationId === 'unsubscribeError') {
            return [500, {}];
        } else {
            return [200, { data: { response: 'ok' } }];
        }
    })
    .onGet(/dlor\/public\/.*\/confirm\/find/)
    .reply(config => {
        const urlparts = config.url.split('/');
        const confirmationId = urlparts[2];
        if (['unsubscribeExpired', 'duplicateclick', 'noSuchConf'].includes(confirmationId)) {
            return [404, { status: 'error', message: 'Subscription not found with that hash' }];
        } else if (confirmationId === 'unsubscribeFindError') {
            return [500, {}];
        } else {
            return [
                200,
                {
                    data: {
                        subscription_id: 2,
                        object_uuid: '938h_4986_654f',
                        subscription_email: 'someone@example.com',
                        object: {
                            object_id: 1,
                            object_public_uuid: '938h_4986_654f',
                            object_title: 'Artificial Intelligence - Digital Essentials',
                        },
                        // etc
                    },
                },
            ];
        }
    })
    .onGet(routes.DLOR_SUBSCRIPTION_CONFIRMATION_API({ id: 'a_known_conf_code_that_has_expired' }).apiUrl)
    .reply(() => {
        return [
            200,
            {
                data: {
                    response: 'expired',
                    object_public_uuid: '938h_4986_654f',
                    object_title: 'Artificial Intelligence - Digital Essentials',
                },
            },
        ];
        // includes when they resubscribe on one they have already clicked?
    })
    .onGet(routes.DLOR_SUBSCRIPTION_CONFIRMATION_API({ id: 'an_unexpected_response_type' }).apiUrl)
    .reply(() => {
        return [
            200,
            {
                data: {
                    response: 'something_unexpected',
                    object_public_uuid: '938h_4986_654f',
                    object_title: 'Artificial Intelligence - Digital Essentials',
                },
            },
        ];
        // includes when they resubscribe on one they have already clicked?
    })
    .onGet(routes.DLOR_SUBSCRIPTION_CONFIRMATION_API({ id: 'a_conf_code_that_is_not_known' }).apiUrl)
    .reply(() => {
        return [200, { data: { response: 'missing', object_public_uuid: null, object_title: null } }];
    })
    .onGet(routes.DLOR_SUBSCRIPTION_CONFIRMATION_API({ id: 'wrong_data' }).apiUrl)
    .reply(() => {
        return [200, { data: { response: 'something unexpected', object_public_uuid: null, object_title: null } }];
    })
    .onGet(routes.DLOR_SUBSCRIPTION_CONFIRMATION_API({ id: 'a_conf_code_that_throws_an_error' }).apiUrl)
    .reply(() => {
        return [400, { error: 'something went wrong' }];
    });

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

    .onGet('learning_resources/reading_list/count/FREN1010/St Lucia/Semester%25202%25202020')
    .reply(() => {
        return [200, courseReadingList_FREN1010];
    })
    .onGet('learning_resources/reading_list/count/PHYS1101E/UQ College/Semester%25202%25202020')
    .reply(() => {
        return [404, 'Unable to retrieve this course list: Title for PHYS1101E not available'];
    })
    .onGet('library_guides/PHYS1101E')
    .reply(() => {
        return [200, []];
    })
    .onGet('exams/course/PHYS1101E/summary')
    .reply(() => {
        return [200, []];
    })
    .onGet('learning_resources/reading_list/count/FREN1011//Semester%25202%25202020')
    .reply(() => {
        return [200, courseReadingList_FREN1011];
    })
    .onGet('learning_resources/reading_list/count/HIST1201/St Lucia/Semester%25202%25202020')
    .reply(() => {
        return [200, courseReadingList_HIST1201];
    })
    .onGet('learning_resources/reading_list/count/PHIL1002/St Lucia/Semester%25203%25202020')
    .reply(() => {
        return [200, courseReadingList_PHIL1002];
    })
    .onGet('learning_resources/reading_list/count/ACCT1101/St Lucia/Semester%25202%25202020')
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
    .onGet('exams/search/mock404')
    .reply(() => {
        return [404, []];
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
    .onGet('exams/search/fail')
    .reply(() => {
        return [500, []];
    })

    /** TEST AND TAG ROUTES **/

    // user
    .onGet(routes.TEST_TAG_USER_API().apiUrl)
    .reply(config => {
        const userVal = () => {
            switch (user) {
                case 'uqpf':
                    return testTag_user_UQPF;
                case 'uqttadmin':
                    return test_tag_user_permissions.uqttadmin;
                case 'uqttreport':
                    return test_tag_user_permissions.uqttreport;
                case 'uqttinspect':
                    return test_tag_user_permissions.uqttinspect;
                case 'uqttalter':
                    return test_tag_user_permissions.uqttalter;
                default:
                    return testTag_user;
            }
        };
        return [200, userVal()];
    })

    // dashboard CONFIG
    .onGet(routes.TEST_TAG_ONLOAD_DASHBOARD_API().apiUrl)
    .reply(config => {
        if (user === 'uqpf') {
            return [400, { status: 'Test Error' }];
        }
        return [200, testTag_dashboardOnLoad];
    })

    // inspection CONFIG
    .onGet(routes.TEST_TAG_ONLOAD_INSPECT_API().apiUrl)
    .reply(config => {
        return [200, config?.headers['X-Uql-Token'] === 'uqpf' ? testTag_onLoadUQPF : testTag_inspectionOnLoad];
    })

    // T&T SITES
    .onGet(routes.TEST_TAG_SITE_API().apiUrl)
    .reply(config => {
        return [200, testTag_siteList];
    })

    // T&T BUILDINGS

    // T&T FLOORS
    .onGet(/test-and-tag\/building\/\d+\/current/)
    .reply(config => {
        const r = /\d+/;
        const id = parseInt(config.url.match(r)?.[0], 10 ?? 0);
        return [200, { data: testTag_floorList.data.find(floor => floor.building_id === id) }];
    })

    // T&T ROOMS
    .onGet(/test-and-tag\/floor\/\d+\/current/)
    .reply(config => {
        const r = /\d+/;
        const id = parseInt(config.url.match(r)?.[0], 10 ?? 0);
        return [200, { data: testTag_roomList.data.find(room => room.floor_id === id) }];
    })

    // T&T LOCATIONS
    .onPost(routes.TEST_TAG_ADD_LOCATION_API('site').apiUrl)
    .reply(() => [200, { status: 'OK' }])
    .onPut(new RegExp(panelRegExp(routes.TEST_TAG_MODIFY_LOCATION_API({ type: 'site', id: '.*' }).apiUrl)))
    .reply(() => [200, { status: 'OK' }])
    .onPost(routes.TEST_TAG_ADD_LOCATION_API('building').apiUrl)
    .reply(() => [200, { status: 'OK' }])
    .onPut(new RegExp(panelRegExp(routes.TEST_TAG_MODIFY_LOCATION_API({ type: 'building', id: '.*' }).apiUrl)))
    .reply(() => [200, { status: 'OK' }])
    .onPost(routes.TEST_TAG_ADD_LOCATION_API('floor').apiUrl)
    .reply(() => [200, { status: 'OK' }])
    .onPut(new RegExp(panelRegExp(routes.TEST_TAG_MODIFY_LOCATION_API({ type: 'floor', id: '.*' }).apiUrl)))
    .reply(() => [200, { status: 'OK' }])
    .onPost(routes.TEST_TAG_ADD_LOCATION_API('room').apiUrl)
    .reply(() => [200, { status: 'OK' }])
    .onPut(new RegExp(panelRegExp(routes.TEST_TAG_MODIFY_LOCATION_API({ type: 'room', id: '.*' }).apiUrl)))
    .reply(() => [200, { status: 'OK' }])
    .onDelete(/test-and-tag\/site|building|floor\/2/)
    .reply(() => [200, { status: 'OK' }])
    .onDelete(/test-and-tag\/site|building|floor\/.*/)
    .reply(() => [400, { message: '52 is a test error', status: 'error' }])
    // T&T MANAGE INSPECTION DEVICES
    .onGet(routes.TEST_TAG_INSPECTION_DEVICE_API().apiUrl)
    .reply(() => {
        return [200, testTag_inspectionDevices];
    })
    .onPost(routes.TEST_TAG_ADD_INSPECTION_DEVICE_API().apiUrl)
    .reply(() => [200, { status: 'OK' }])
    .onPut(new RegExp(panelRegExp(routes.TEST_TAG_MODIFY_INSPECTION_DEVICE_API('.*').apiUrl)))
    .reply(() => [200, { status: 'OK' }])
    .onDelete(new RegExp(panelRegExp(routes.TEST_TAG_MODIFY_INSPECTION_DEVICE_API('.*').apiUrl)))
    .reply(() => [200, { status: 'OK' }])

    .onGet(/test-and-tag\/asset\/search\/current\/.*[?]without_discards=1/)
    .reply(config => {
        const patternTmp = config.url.split('/').pop();
        const pattern = patternTmp.split('?')[0];
        // filter array to matching asset id's
        return [
            200,
            {
                data: testTag_assets.data.filter(
                    asset =>
                        asset.asset_id_displayed.toUpperCase().startsWith(pattern.toUpperCase()) &&
                        asset.asset_status !== 'DISCARDED',
                ),
            },
        ];
    })

    // ASSETS (with pattern matching)
    .onGet(/test-and-tag\/asset\/search\/current\/*/)
    .reply(config => {
        const pattern = config.url.split('/').pop();
        // filter array to matching asset id's
        return [
            200,
            {
                data: testTag_assets.data.filter(asset =>
                    asset.asset_id_displayed.toUpperCase().startsWith(pattern.toUpperCase()),
                ),
            },
        ];
    })

    .onPost(routes.TEST_TAG_ASSET_ACTION().apiUrl)
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
    .onPost(routes.TEST_TAG_ASSETTYPE_ADD().apiUrl)
    // .reply(() => {
    //     return [500, []];
    // })
    .reply(() => [
        200,
        {
            status: 'ok',
            data: {
                asset_type_id: 99999,
                asset_type_name: 'PWRC13-10',
                asset_type_class: 'Cable',
                asset_type_power_rating: '10',
                asset_type: 'IEC C13 Power Cable (10 Amp)',
                asset_type_notes: 'Standard Computer Type Cable',
            },
        },
    ])

    // Test and Tag Asset Types
    .onGet(routes.TEST_TAG_ASSETTYPE_API().apiUrl)
    .reply(() => [
        200,
        {
            status: 'OK',
            data: test_tag_asset_types.data,
        },
    ])
    .onPost(routes.TEST_TAG_ADD_ASSET_TYPE_API().apiUrl)
    .reply(() => [
        200,
        {
            status: 'OK',
        },
    ])
    .onPut(/test-and-tag\/asset-type\/\d+/)
    .reply(
        withDelay([
            200,
            {
                status: 'OK',
            },
        ]),
    )
    .onPost(routes.TEST_TAG_DELETE_REASSIGN_ASSETTYPE_API().apiUrl)
    .reply(() => [
        200,
        {
            status: 'OK',
            data: {
                effected_assets: 1,
                effected_asset_types: 1,
            },
        },
    ])
    .onDelete(/test-and-tag\/asset-type\/52/)
    .reply(() => {
        return [
            400,
            {
                status: 'error',
                message: '52 is a test error',
            },
        ];
    })
    .onDelete(/test-and-tag\/asset-type\/\d+/)
    .reply(() => {
        return [200, { status: 'OK' }];
    })
    .onGet(routes.TEST_TAG_REPORT_INSPECTIONS_DUE_API({ period: '3', periodType: 'month' }).apiUrl)
    .reply(() => [200, test_tag_pending_inspections])
    .onGet(
        routes.TEST_TAG_REPORT_INSPECTIONS_DUE_API({
            period: '3',
            periodType: 'month',
            locationId: '1',
            locationType: 'site',
        }).apiUrl,
    )
    .reply(() => [200, test_tag_pending_inspections_site])
    .onGet(
        routes.TEST_TAG_REPORT_INSPECTIONS_DUE_API({
            period: '3',
            periodType: 'month',
            locationId: '1',
            locationType: 'building',
        }).apiUrl,
    )
    .reply(() => [200, test_tag_pending_inspections_building])
    .onGet(
        routes.TEST_TAG_REPORT_INSPECTIONS_DUE_API({
            period: '3',
            periodType: 'month',
            locationId: '1',
            locationType: 'floor',
        }).apiUrl,
    )
    .reply(() => [200, test_tag_pending_inspections_floor])
    .onGet(
        routes.TEST_TAG_REPORT_INSPECTIONS_DUE_API({
            period: '3',
            periodType: 'month',
            locationId: '1',
            locationType: 'room',
        }).apiUrl,
    )
    .reply(() => [200, test_tag_pending_inspections_room])
    // .onGet(
    //     new RegExp(
    //         panelRegExp(routes.TEST_TAG_REPORT_INSPECTIONS_BY_LICENCED_USER_API('.*').apiUrl),
    //     ),
    // )
    // .reply(config => {
    //     const url = new URL(`${config.baseURL}${config.url}`);
    //     const params = url.searchParams;
    //     const userRange = params.has('user_range')
    //         ? params
    //               .get('user_range')
    //               .split(',')
    //               .map(item => parseInt(item, 10))
    //         : null;
    //     const dateStart = params.has('start_date') ? params.get('start_date') : null;
    //     const dateEnd = params.has('start_date') ? params.get('end_date') : null;
    //     const data =
    //         !!userRange || !!dateStart || !!dateEnd
    //             ? test_tag_inspections_by_licenced_user.data.user_inspections.filter(
    //                   user =>
    //                       (!!userRange ? userRange.includes(user.user_id) : user.user_id !== '') &&
    //                       (!!dateStart ? user.start_date >= dateStart : user.start_date !== '') &&
    //                       (!!dateEnd ? user.start_date <= dateEnd : user.end_date !== ''),
    //               )
    //             : test_tag_inspections_by_licenced_user.data.user_inspections;

    //     const total = data.reduce((prev, curr) => prev + curr.total_for_user, 0);

    //     return [
    //         200,
    //         {
    //             data: {
    //                 user_inspections: data,
    //                 total_inspections: total,
    //             },
    //         },
    //     ];
    // })
    .onGet(
        new RegExp(
            panelRegExp(
                routes.TEST_TAG_REPORT_INSPECTIONS_BY_LICENCED_USER_API({
                    startDate: null,
                    endDate: null,
                    userRange: null,
                }).apiUrl,
            ),
        ),
    )
    .reply(() => [200, test_tag_inspections_by_licenced_user])
    .onGet(routes.TEST_TAG_REPORT_UTILITY_LICENCED_USERS().apiUrl)
    .reply(() => [200, test_tag_licenced_inspectors])
    .onGet(routes.TEST_TAG_TAGGED_BUILDING_LIST().apiUrl)
    .reply(() => [200, test_tag_tagged_building_list])
    .onGet(
        routes.TEST_TAG_ASSET_REPORT_BY_FILTERS_LIST({
            assetStatus: 'OUTFORREPAIR',
            locationType: 'building',
            locationId: '4',
            inspectionDateFrom: null,
            inspectionDateTo: null,
        }).apiUrl,
    )
    .reply(() => [200, test_tag_assets_report_assets])
    // .onGet(/test-and-tag\/asset\/search\/mine.*/)
    // .reply(config => {
    //    const url = new URL(`${config.baseURL}${config.url}`);
    //    const params = url.searchParams;
    //    const location = params.has('location_type') ? `${params.get('location_type')}_id` : 'room_id';
    //    const locationId = params.has('location_type') ? parseInt(params.get('location_id'),10) : undefined;
    //    console.log(config, params.toString(), params.get('asset_type_id'), params.get('inspect_comment'), location, locationId)

    //     return [200, {data: test_tag_assets_mine.data.filter(asset=> asset.asset_type_id === (params.get('asset_type_id') ?? asset.asset_type_id) &&
    //         asset[location] === (locationId ?? asset[location]) &&
    //         asset.inspect_comment.indexOf(params.get('inspect_comment') ?? asset.inspect_comment) > -1)}]
    // })
    .onGet(/test-and-tag\/asset\/search\/mine.*/)
    .reply(() => [200, test_tag_assets_mine])
    .onPut(routes.TEST_TAG_BULK_UPDATE_API().apiUrl)
    .reply(() => [200, { status: 'OK' }])
    .onPut(new RegExp(panelRegExp(routes.TEST_TAG_MODIFY_INSPECTION_DETAILS_API('.*').apiUrl)))
    .reply(() => [200, { status: 'OK' }])
    .onGet(routes.TEST_TAG_USER_LIST_API().apiUrl)
    .reply(withDelay([200, test_tag_user_list]))
    .onPut(/test-and-tag\/user\/5/)
    .reply(withDelay([400, {}]))
    .onPut(/test-and-tag\/user\/\d*/)
    .reply(
        withDelay([
            200,
            {
                status: 'OK',
            },
        ]),
    )
    .onPost(/test-and-tag\/user/)
    .reply(
        withDelay([
            200,
            {
                status: 'OK',
            },
        ]),
    )
    .onDelete(/test-and-tag\/user\/5/)
    .reply(withDelay([400, {}]))
    .onDelete(/test-and-tag\/user\/\d*/)
    .reply(
        withDelay([
            200,
            {
                status: 'OK',
            },
        ]),
    )
    .onAny()
    .reply(function(config) {
        console.log('url not mocked...', config.url);
        return [404, { message: `MOCK URL NOT FOUND: ${config.url}` }];
    });
