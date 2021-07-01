export const zeroPaddedYear = value => (value ? ('0000' + value).substr(-4) : '*');

export const CURRENT_ACCOUNT_API = () => ({
    apiUrl: 'account',
    options: { params: { ts: `${new Date().getTime()}` } },
});
export const CURRENT_AUTHOR_API = () => ({ apiUrl: 'fez-authors' });
export const AUTHOR_API = ({ authorId }) => ({ apiUrl: `fez-authors/${authorId}` });
export const AUTHOR_DETAILS_API = ({ userId }) => ({
    apiUrl: `authors/details/${userId}`,
});

// Spotlights API
export const SPOTLIGHTS_API = () => ({ apiUrl: 'spotlights/current' });

// Training API
export const TRAINING_API = (numEvents = 6) => ({
    apiUrl: 'training_events',
    options: { params: { take: numEvents, 'filterIds[]': 104, ts: `${new Date().getTime()}` } },
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

// eSpace Possible records
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

// Primo Suggestions API
// https://primo-instant-apac.hosted.exlibrisgroup.com/solr/ac?q=cats&facet=off&fq=scope%3A()%2BAND%2Bcontext%3A(B)&rows=10&wt=json&json.wrf=byutv_jsonp_callback_c631f96adec14320b23f1cac342d30f6&_=2ef82775b72140a6bde04ea6e20012e4
export const PRIMO_SUGGESTIONS_API_GENERIC = ({ keyword }) => {
    return {
        apiUrl:
            'https://primo-instant-apac.hosted.exlibrisgroup.com/solr/ac?q=' +
            keyword +
            '&facet=off' +
            '&fq=scope%3A()%2BAND%2Bcontext%3A(B)' +
            '&rows=10' +
            '&wt=json' +
            '&json.wrf=byutv_jsonp_callback_c631f96adec14320b23f1cac342d30f6',
    };
};

export const PRIMO_SUGGESTIONS_API_EXAMS = ({ keyword }) => ({
    apiUrl: 'https://api.library.uq.edu.au/v1/search_suggestions?type=exam_paper&prefix=' + keyword,
});

export const SUGGESTIONS_API_PAST_COURSE = ({ keyword }) => ({
    apiUrl: 'https://api.library.uq.edu.au/v1/search_suggestions?type=learning_resource&prefix=' + keyword,
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
export const FILE_UPLOAD_API = () => ({ apiUrl: 'file/upload/presigned' });

export const GUIDES_API = ({ keyword }) => ({ apiUrl: 'library_guides/' + keyword });

export const EXAMS_API = ({ keyword }) => ({ apiUrl: `course_resources/${keyword}/exams` });

export const READING_LIST_API = ({ coursecode, campus, semester }) => {
    // api requires this field to be double encoded, as it may include characters like '/'
    const s = encodeURIComponent(encodeURIComponent(semester));
    return {
        apiUrl: `course_resources/${coursecode}/${campus}/${s}/reading_list`,
    };
};

// confirm the user's login, when needed
export const SECURE_COLLECTION_CHECK_API = ({ path }) => ({ apiUrl: `file/collection/testlogin/${path}` });

// get file & folder details file/collection/{folder}/{filePath}
export const SECURE_COLLECTION_FILE_API = ({ path }) => ({ apiUrl: `file/collection/${path}?acknowledged` });

// alerts
export const ALERTS_ALL_API = () => ({ apiUrl: '/alerts?noCache=1' });
export const ALERTS_BY_ID_API = ({ id }) => ({ apiUrl: `alerts/${id}?noCache=1` });
