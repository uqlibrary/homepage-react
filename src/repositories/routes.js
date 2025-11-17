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
        apiUrl: `learning_resources/reading_list/count/${coursecode}/${campus}/${s}`,
    };
};

// alerts
export const ALERTS_ALL_API = () => {
    return {
        apiUrl: '/alerts',
    };
};
export const ALERT_BY_ID_API = ({ id }) => ({ apiUrl: `alert/${id}` });

export const ALERTS_CREATE_API = () => ({ apiUrl: 'alerts' });

export const ALERT_UPDATE_API = ({ id }) => ({ apiUrl: `alert/${id}` });

export const ALERT_DELETE_API = ({ id }) => ({ apiUrl: `alert/${id}` });

/** TEST AND TAG **/
export const TEST_TAG_USER_API = () => ({ apiUrl: 'test-and-tag/user' });
export const TEST_TAG_ONLOAD_DASHBOARD_API = () => ({ apiUrl: 'test-and-tag/onload/dashboard' });
export const TEST_TAG_ONLOAD_INSPECT_API = () => ({ apiUrl: 'test-and-tag/onload/inspect' });

export const TEST_TAG_SITE_API = () => ({ apiUrl: 'test-and-tag/site/current' });
export const TEST_TAG_FLOOR_API = id => ({
    apiUrl: `test-and-tag/building/${id}/current`,
});
export const TEST_TAG_ROOM_API = id => ({
    apiUrl: `test-and-tag/floor/${id}/current`,
});

export const TEST_TAG_ADD_LOCATION_API = type => ({ apiUrl: `test-and-tag/${type}` });
export const TEST_TAG_MODIFY_LOCATION_API = ({ type, id }) => ({ apiUrl: `test-and-tag/${type}/${id}` });

export const TEST_TAG_ASSETS_API = pattern => ({ apiUrl: `/test-and-tag/asset/search/current/${pattern}` });
export const TEST_TAG_ASSETS_FILTERED_API = (pattern, filter) => {
    const urlParams = {
        ...(filter?.status?.discarded === false ? { without_discards: 1 } : {}),
        // TODO: add more filters as required
    };
    const qs = new URLSearchParams(urlParams);
    const hasParams = [...qs].length > 0;
    const apiUrl = `test-and-tag/asset/search/current/${pattern}${hasParams ? `?${qs.toString()}` : ''}`;
    return {
        apiUrl,
    };
};
export const TEST_TAG_ASSETS_MINE_API = ({ locationId, locationType, assetTypeId, textSearch }) => {
    const urlParams = {
        ...(!!locationId && !!locationType ? { location_id: locationId, location_type: locationType } : {}),
        ...(!!assetTypeId ? { asset_type_id: assetTypeId } : {}),
        ...(!!textSearch ? { inspect_comment: textSearch } : {}),
    };
    const qs = new URLSearchParams(urlParams);
    const hasParams = [...qs].length > 0;
    const apiUrl = `/test-and-tag/asset/search/mine${hasParams ? `?${qs.toString()}` : ''}`;
    return {
        apiUrl,
    };
};

export const TEST_TAG_ASSET_ACTION = () => ({ apiUrl: '/test-and-tag/action' });
export const TEST_TAG_ASSETTYPE_ADD = () => ({ apiUrl: '/test-and-tag/asset-type' });
export const TEST_TAG_INSPECTION_DEVICE_API = () => ({ apiUrl: '/test-and-tag/inspection-device/current/mine' });
export const TEST_TAG_ADD_INSPECTION_DEVICE_API = () => ({ apiUrl: '/test-and-tag/inspection-device' });
export const TEST_TAG_MODIFY_INSPECTION_DEVICE_API = id => ({ apiUrl: `/test-and-tag/inspection-device/${id}` });

/** TEST AND TAG ASSET TYPES **/
// List Asset Types
export const TEST_TAG_ASSETTYPE_API = () => ({ apiUrl: 'test-and-tag/asset-type/current/mine' });
// Add an asset type
export const TEST_TAG_ADD_ASSET_TYPE_API = () => ({ apiUrl: 'test-and-tag/asset-type' });
// Save an asset type (ID contained in payload)
export const TEST_TAG_SAVE_ASSETTYPE_API = id => ({ apiUrl: `test-and-tag/asset-type/${id}` });
// Delete an Asset type (Reassigning assets to new asset type)
export const TEST_TAG_DELETE_REASSIGN_ASSETTYPE_API = () => ({ apiUrl: 'test-and-tag/asset-type/reassign' });
// Delete an Empty Asset Type
export const TEST_TAG_DELETE_ASSET_TYPE_API = id => ({ apiUrl: `test-and-tag/asset-type/${id}` });

/** TEST AND TAG INSPECTIONS REPORT */
export const TEST_TAG_REPORT_INSPECTIONS_DUE_API = ({ locationId, locationType, period, periodType }) => {
    const urlParams = {
        ...(!!locationId && !!locationType ? { [`${locationType}_id`]: locationId } : {}),
        ...(!!period && !!periodType ? { period_length: period, period_type: periodType } : {}),
    };
    const qs = new URLSearchParams(urlParams);
    const hasParams = [...qs].length > 0;
    const apiUrl = `test-and-tag/report/pending-inspections${hasParams ? `?${qs.toString()}` : ''}`;
    return {
        apiUrl,
    };
};
/* TEST AND TAG INSPECTIONS BY LICENCED USER */
export const TEST_TAG_REPORT_INSPECTIONS_BY_LICENCED_USER_API = ({ startDate, endDate, userRange }) => {
    const urlParams = {
        ...(!!startDate && !!endDate ? { start_date: startDate, end_date: endDate } : {}),
        ...(!!userRange ? { user_range: userRange } : {}),
    };
    const qs = new URLSearchParams(urlParams);
    const hasParams = Object.keys(urlParams).length > 0;
    const apiUrl = `test-and-tag/report/user-inspections${hasParams ? `?${qs.toString()}` : ''}`;
    return {
        apiUrl,
    };
};
/* UTILITY API USED FOR LICENCED USER INSPECTIONS REPORT - GET LICENCED USERS FOR DROPDOWN */
export const TEST_TAG_REPORT_UTILITY_LICENCED_USERS = () => ({ apiUrl: 'test-and-tag/report/licenced-inspectors' });

/* Asset Report for DEPT */
export const TEST_TAG_TAGGED_BUILDING_LIST = () => ({ apiUrl: 'test-and-tag/building/mine' });
export const TEST_TAG_ASSET_REPORT_BY_FILTERS_LIST = ({
    assetStatus,
    locationType,
    locationId,
    inspectionDateFrom,
    inspectionDateTo,
}) => {
    const urlParams = {
        ...(!!assetStatus ? { asset_status: assetStatus } : {}),
        ...(!!locationType ? { location_type: locationType } : {}),
        ...(!!locationId ? { location_id: locationId } : {}),
        ...(!!inspectionDateFrom ? { inspection_date_from: inspectionDateFrom } : {}),
        ...(!!inspectionDateTo ? { inspection_date_to: inspectionDateTo } : {}),
    };
    const qs = new URLSearchParams(urlParams);
    const hasParams = Object.keys(urlParams).length > 0;
    const apiUrl = `test-and-tag/asset/search/mine${hasParams ? `?${qs.toString()}` : ''}`;
    return {
        apiUrl,
    };
};

export const TEST_TAG_BULK_UPDATE_API = () => ({ apiUrl: 'test-and-tag/asset' });

export const TEST_TAG_MODIFY_INSPECTION_DETAILS_API = id => ({ apiUrl: `/test-and-tag/asset/${id}/action` });

export const TEST_TAG_USER_LIST_API = () => ({ apiUrl: 'test-and-tag/users/all' });
export const TEST_TAG_UPDATE_USER_API = id => ({ apiUrl: `test-and-tag/user/${id}` });
export const TEST_TAG_ADD_USER_API = () => ({ apiUrl: 'test-and-tag/user' });
export const TEST_TAG_DELETE_USER_API = id => ({ apiUrl: `test-and-tag/user/${id}` });

export const DLOR_ALL_API = () => ({ apiUrl: 'dlor/public/list/full' }); // is admin in staging
export const DLOR_ALL_CURRENT_API = () => ({ apiUrl: 'dlor/public/list/current' });
export const DLOR_GET_BY_ID_API = ({ id }) => ({ apiUrl: `dlor/public/find/${id}` });
export const DLOR_GET_FILTER_LIST = () => ({ apiUrl: 'dlor/public/facet/list' });
export const DLOR_SERIES_LIST_API = () => ({ apiUrl: 'dlor/public/series/list' });
export const DLOR_SUBSCRIPTION_CONFIRMATION_API = ({ id }) => ({ apiUrl: `dlor/public/${id}/confirm/subscribe` });
export const DLOR_UNSUBSCRIBE_FIND_API = ({ id }) => ({ apiUrl: `dlor/public/${id}/confirm/find` });
export const DLOR_UNSUBSCRIBE_API = ({ id }) => ({ apiUrl: `dlor/public/${id}/confirm/unsubscribe` });
export const DLOR_TEAM_LIST_API = () => ({ apiUrl: 'dlor/public/teams/list' });

export const DLOR_DEMOGRAPHICS_SAVE_API = () => ({ apiUrl: 'dlor/auth/demographics' });
/* istanbul ignore next */
export const DLOR_REQUEST_API = () => ({ apiUrl: 'dlor/auth/object' });
// dlor admin routes
export const DLOR_CREATE_API = () => ({ apiUrl: 'dlor/admin/object' });

export const DLOR_UPDATE_API = id => ({ apiUrl: `dlor/admin/object/${id}` });
export const DLOR_OWNED_UPDATE_API = id => ({ apiUrl: `dlor/auth/object/${id}` });

export const DLOR_DESTROY_API = ({ id }) => ({ apiUrl: `dlor/admin/object/${id}` });
export const DLOR_TEAM_DELETE_API = id => ({ apiUrl: `dlor/admin/team/${id}` });
export const DLOR_TEAM_SINGLE_GET_API = ({ id }) => ({ apiUrl: `dlor/auth/team/${id}` });

export const DLOR_ADMIN_TEAM_UPDATE_API = id => ({ apiUrl: `dlor/auth/team/${id}` });

export const DLOR_TEAM_CREATE_API = () => ({ apiUrl: 'dlor/admin/team' });
export const DLOR_FILE_TYPE_LIST_API = () => ({ apiUrl: 'dlor/admin/file_types/list' });
export const DLOR_SERIES_DELETE_API = id => ({ apiUrl: `dlor/admin/series/${id}` });
export const DLOR_SERIES_UPDATE_API = id => ({ apiUrl: `dlor/admin/series/${id}` });
export const DLOR_SERIES_CREATE_API = () => ({ apiUrl: 'dlor/admin/series' });
export const DLOR_SERIES_LOAD_API = id => ({ apiUrl: `dlor/public/series/find/${id}` });
export const DLOR_FAVOURITES_API = () => ({ apiUrl: 'dlor/auth/favourites' });

export const DLOR_CREATE_FACET_API = () => ({ apiUrl: 'dlor/admin/facet' });
export const DLOR_UPDATE_FACET_API = id => ({ apiUrl: `dlor/admin/facet/${id}` });
export const DLOR_DELETE_FACET_API = id => ({ apiUrl: `dlor/admin/facet/${id}` });
export const DLOR_DEMOGRAPHICS_REPORT_API = () => ({ apiUrl: 'dlor/admin/demographics/all' });
export const DLOR_FAVOURITES_REPORT_API = () => ({ apiUrl: 'dlor/admin/favourites' });
export const DLOR_ADMIN_NOTES_API = uuid => ({ apiUrl: `dlor/admin/object/notes/${uuid}` });

export const DLOR_CREATE_TEAM_ADMIN_API = () => ({ apiUrl: 'dlor/auth/teammember' });
export const DLOR_EDIT_TEAM_ADMIN_API = id => ({ apiUrl: `dlor/auth/teammember/${id}` });
export const DLOR_DELETE_TEAM_ADMIN_API = id => ({ apiUrl: `dlor/auth/teammember/${id}` });

export const DLOR_KEYWORDS_API = () => ({ apiUrl: 'dlor/public/keywords/list' });
export const DLOR_KEYWORDS_UPDATE_API = () => ({ apiUrl: 'dlor/admin/keywords' });
export const DLOR_KEYWORDS_DESTROY_API = () => ({ apiUrl: 'dlor/admin/keywords/delete' });
export const DLOR_STATISTICS_API = () => ({ apiUrl: 'dlor/auth/stats' });

const productionRoot = 'https://assets.library.uq.edu.au/reusable-webcomponents/api/homepage';
const stagingRoot = 'https://assets.library.uq.edu.au/reusable-webcomponents-staging/api/homepage';
export const DRUPAL_ARTICLE_API = () => {
    const filePath = '/articles.json';
    const shouldUseProduction = process.env.BRANCH === 'production';
    return {
        apiUrl: shouldUseProduction ? `${productionRoot}${filePath}` : `${stagingRoot}${filePath}`,
    };
};

export const VEMCOUNT_API = () => {
    const filePath = '/headcount.json';
    const shouldUseProduction = process.env.BRANCH === 'production';
    return {
        apiUrl: shouldUseProduction ? `${productionRoot}${filePath}` : `${stagingRoot}${filePath}`,
    };
};

export const JOURNAL_SEARCH_API = () => ({ apiUrl: 'https://api.library.uq.edu.au/v1/journals/favourites?sort=score' });

// Loans API
export const LOANS_API = () => ({
    apiUrl: 'account/loans',
    options: { params: { ts: `${new Date().getTime()}` } },
});
