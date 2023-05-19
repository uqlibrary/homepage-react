export const zeroPaddedYear = value => (value ? ('0000' + value).substr(-4) : '*');
import { API_URL } from '../config';

export const CURRENT_ACCOUNT_API = () => ({
    apiUrl: 'account',
    options: { params: { ts: `${new Date().getTime()}` } },
});
export const CURRENT_AUTHOR_API = () => ({ apiUrl: 'fez-authors' });
export const AUTHOR_API = ({ authorId }) => ({ apiUrl: `fez-authors/${authorId}` });

// Training API
export const TRAINING_API = (numEvents = 6, filterId = 104) => ({
    // default, see TRAINING_FILTER_GENERAL
    apiUrl: 'training_events',
    options: { params: { take: numEvents, 'filterIds[]': filterId, ts: `${new Date().getTime()}` } },
});

// Papercut balance API
export const PRINTING_API = () => ({
    apiUrl: 'papercut/balance',
    options: { params: { ts: `${new Date().getTime()}` } },
});

// Loans API
export const LOANS_API = () => ({
    apiUrl: 'account/loans',
    options: { params: { ts: `${new Date().getTime()}` } },
});

// eSpace Possible records
export const POSSIBLE_RECORDS_API = () => ({
    apiUrl: 'records/search',
    options: {
        params: {
            rule: 'possible',
            export_to: '',
            page: 1,
            per_page: 20,
            sort: 'score',
            order_by: 'desc',
            'filters[stats_only]': true,
        },
    },
});

// eSpace NTRO records Incomplete (user is prompted to update them)
export const INCOMPLETE_NTRO_RECORDS_API = () => ({
    apiUrl: 'records/search',
    options: {
        params: {
            rule: 'incomplete',
            export_to: '',
            page: 1,
            per_page: 20,
            sort: 'score',
            order_by: 'desc',
            'filters[stats_only]': true,
        },
    },
});

export const LEARNING_RESOURCES_COURSE_SUGGESTIONS_API = ({ keyword }) => ({
    apiUrl: API_URL + 'learning_resources/suggestions?hint=' + keyword,
});

// Library hours
export const LIB_HOURS_API = () => ({
    apiUrl: 'library_hours/day',
    options: { params: { ts: `${new Date().getTime()}` } },
});

// Computer availability
export const COMP_AVAIL_API = () => ({
    apiUrl: 'computer_availability',
    options: { params: { ts: `${new Date().getTime()}` } },
});

// file uploading apis
export const UPLOAD_PUBLIC_FILES_API = () => ({ apiUrl: 'file/public' });

export const GUIDES_API = ({ keyword }) => ({ apiUrl: 'library_guides/' + keyword });

export const LEARNING_RESOURCES_EXAMS_API = ({ keyword }) => ({ apiUrl: `exams/course/${keyword}/summary` });

export const EXAMS_SEARCH_API = hint => ({ apiUrl: `exams/search/${hint}` });
export const EXAMS_SUGGESTION_API = hint => ({ apiUrl: `exams/suggestions/${hint}` });

export const READING_LIST_API = ({ coursecode, campus, semester }) => {
    // api requires this field to be double encoded, as it may include characters like '/'
    const s = encodeURIComponent(encodeURIComponent(semester));
    return {
        apiUrl: `learning_resources/reading_list/summary/${coursecode}/${campus}/${s}`,
    };
};

// alerts
export const ALERTS_ALL_API = () => {
    return {
        apiUrl: '/alerts',
    };
};
export const ALERT_BY_ID_API = ({ id }) => ({ apiUrl: `alert/${id}` });

export const ALERT_CREATE_API = () => ({ apiUrl: 'alert' });

export const ALERT_SAVE_API = ({ id }) => ({ apiUrl: `alert/${id}` });

export const ALERT_DELETE_API = ({ id }) => ({ apiUrl: `alert/${id}` });

// spotlights

// used on homepage
export const SPOTLIGHTS_API_CURRENT = () => ({ apiUrl: 'spotlights/current' });

// used on spotlights admin
export const SPOTLIGHTS_ALL_API = () => ({ apiUrl: 'spotlights?noCache=1' });
/*
returns array of
{
    "id": "1e1b0e10-c400-11e6-a8f0-47525a49f469",
    "start": "2016-12-17 12:24:00",
    "end": "2017-01-30 00:00:00",
    "title": "Feedback on library services",
    "url": "https:\/\/web.library.uq.edu.au\/blog\/2016\/12\/your-feedback-july-september-2016",
    "img_url": "https:\/\/app.library.uq.edu.au\/file\/public\/17c26e10-c400-11e6-9509-e31d0c6d416e.jpg",
    "img_alt": "Feedback on library services",
    "weight": 0,
    "active": 0
}
 */

export const SPOTLIGHT_GET_BY_ID_API = ({ id }) => ({ apiUrl: `spotlight/${id}?noCache=1` });
/*
returns:
{
    "id": "ca7d3e70-516f-11eb-880b-1d4a9f408ccb",
    "start": "2021-01-08 15:05:00",
    "end": "2021-01-18 18:00:00",
    "title": "08\/01\/21 Spaces & collections closed temporarily test",
    "url": "https:\/\/web.library.uq.edu.au\/library-services\/covid-19",
    "img_url": "https:\/\/app.library.uq.edu.au\/file\/public\/4d2dce40-5175-11eb-8aa1-fbc04f4f5310.jpg",
    "img_alt": "Our spaces and collections are closed temporarily. Read more Library COVID-19 Updates.",
    "weight": 0,
    "active": 0
}
 */

export const SPOTLIGHT_CREATE_API = () => ({ apiUrl: 'spotlight' });
/*
send payload:
{
    active: 0
    end: "2021-08-12 11:25:51"
    img_alt: "test"
    img_url: "https://app.library.uq.edu.au/file/public/20d834a0-f58c-11eb-a4cd-611585dc0de4.jpg"
    start: "2021-08-05 11:25:51"
    title: "test LdG"
    url: "http://example.com"
}
 */

export const SPOTLIGHT_SAVE_API = ({ id }) => ({ apiUrl: `spotlight/${id}` });

export const SPOTLIGHT_DELETE_BULK_API = () => ({ apiUrl: 'spotlight/bulk' });

// Promo Panel Admin

export const PROMOPANEL_CREATE_API = () => ({ apiUrl: 'promo_panel/panel' });
export const PROMOPANEL_UPDATE_API = ({ id }) => ({ apiUrl: `promo_panel/panel/${id}` });
export const PROMOPANEL_LIST_USERTYPES_API = () => ({
    apiUrl: 'promo_panel/groups',
    options: { params: { ts: `${new Date().getTime()}` } },
});
export const PROMOPANEL_LIST_ACTIVE_PANELS_API = () => ({
    apiUrl: 'promo_panel/groups/active',
    options: { params: { ts: `${new Date().getTime()}` } },
});
export const PROMOPANEL_LIST_API = () => ({
    apiUrl: 'promo_panel/panels',
    options: { params: { ts: `${new Date().getTime()}` } },
});
export const PROMOPANEL_GET_CURRENT_API = () => ({
    apiUrl: 'promo_panel',
    options: { params: { ts: `${new Date().getTime()}` } },
});
export const PROMOPANEL_GET_ANON_API = () => ({
    apiUrl: 'promo_panel/loggedout',
    options: { params: { ts: `${new Date().getTime()}` } },
});
export const PROMOPANEL_ADD_SCHEDULE_API = ({ id, usergroup }) => ({
    apiUrl: `promo_panel/group/${usergroup}/panel/${id}/schedule`,
});
export const PROMOPANEL_UPDATE_SCHEDULE_API = ({ id, usergroup }) => ({
    apiUrl: `promo_panel/group/${usergroup}/schedule/${id}`,
});
export const PROMOPANEL_UPDATE_USERTYPE_DEFAULT = ({ id, usergroup }) => ({
    apiUrl: `promo_panel/group/${usergroup}/panel/${id}/default`,
});

export const PROMOPANEL_DELETE_API = ({ id }) => ({ apiUrl: `promo_panel/panel/${id}` });

export const PROMOPANEL_UNSCHEDULE_API = ({ id }) => ({
    apiUrl: `promo_panel/schedule/${id}`,
});
/** TEST AND TAG **/
export const TEST_TAG_USER_API = () => ({ apiUrl: 'test_and_tag/user' });
export const TEST_TAG_ONLOAD_DASHBOARD_API = () => ({ apiUrl: 'test_and_tag/onload/dashboard' });
export const TEST_TAG_ONLOAD_INSPECT_API = () => ({ apiUrl: 'test_and_tag/onload/inspect' });
// export const TEST_TAG_SITE_API = () => ({ apiUrl: 'test_and_tag/site/current' });
export const TEST_TAG_FLOOR_API = buildingId => ({
    apiUrl: `test_and_tag/building/${buildingId}/current`,
});
export const TEST_TAG_ROOM_API = floorId => ({
    apiUrl: `test_and_tag/floor/${floorId}/current`,
});
export const TEST_TAG_ASSETS_API = pattern => ({ apiUrl: `/test_and_tag/asset/search/current/${pattern}` });
export const TEST_TAG_ASSET_ACTION = () => ({ apiUrl: '/test_and_tag/action' });

/** TEST AND TAG ASSET TYPES **/
// List Asset Types
export const TEST_TAG_ONLOAD_ASSETTYPE_API = () => ({ apiUrl: 'test_and_tag/onload/assettype' });
// Save an asset type (ID contained in payload)
export const TEST_TAG_SAVE_ASSETTYPE_API = () => ({ apiUrl: 'test_and_tag/assettype' });
