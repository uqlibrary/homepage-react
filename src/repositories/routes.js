import { validation } from 'config';
import { IN_CREATION, IN_DRAFT, IN_REVIEW, RETRACTED, SUBMITTED_FOR_APPROVAL, UNPUBLISHED } from 'config/general';

export const zeroPaddedYear = value => (value ? ('0000' + value).substr(-4) : '*');

/**
 * Translate selected facets to query string parameters
 * @param {object} selected facets
 * @returns {object}
 */
export const getFacetsParams = facets => {
    const facetsParam = {};
    if (facets.hasOwnProperty('filters')) {
        Object.keys(facets.filters).map(key => {
            facetsParam[`filters[facets][${key}]`] = facets.filters[key];
        });
    }

    if (facets.hasOwnProperty('ranges')) {
        Object.keys(facets.ranges).map(key => {
            if (key === 'Year published') {
                const { from, to } = facets.ranges[key];
                const fromValueForEs = !!from && !!to && from > to ? zeroPaddedYear(to) : zeroPaddedYear(from);
                const toValueForEs = !!from && !!to && to < from ? zeroPaddedYear(from) : zeroPaddedYear(to);
                facetsParam[`ranges[facets][${key}]`] = `[${fromValueForEs} TO ${toValueForEs}]`;
            } else {
                facetsParam[`ranges[facets][${key}]`] = facets.ranges[key];
            }
        });
    }

    return facetsParam;
};

export const getStandardSearchParams = ({
    exportPublicationsFormat = '',
    page = 1,
    pageSize = 20,
    sortBy = 'score',
    sortDirection = 'desc',
    withUnknownAuthors = -1,
    facets = {},
}) => {
    const unknownAuthors = withUnknownAuthors >= 0 ? { with_unknown_authors: withUnknownAuthors } : {};

    return {
        export_to: exportPublicationsFormat,
        page: page,
        per_page: pageSize,
        sort: sortBy,
        order_by: sortDirection.toLowerCase(),
        ...getFacetsParams(facets),
        ...unknownAuthors,
    };
};

/**
 * getSearchType - based on data provided returns query string attribute
 * @param {string} pid/pubmed/string title to search
 * @returns {object} query string attribute based on input
 */
export const getSearchType = searchQuery => {
    if (!searchQuery) return {};

    if (validation.isValidDOIValue(searchQuery)) {
        return { doi: searchQuery.trim() };
    }

    if (validation.isValidPubMedValue(searchQuery)) {
        return { id: `pmid:${searchQuery.trim()}` };
    }

    return { title: searchQuery };
};

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

// Primo Suggestions API
export const PRIMO_SUGGESTIONS_API_GENERIC = ({ keyword }) => {
    return {
        apiUrl:
            'https://primo-instant-apac.hosted.exlibrisgroup.com/solr/ac?q=' +
            keyword +
            '&facet=off' +
            '&fq=scope%3A()%2BAND%2Bcontext%3A(B)' +
            '&rows=10' +
            '&wt=json',
    };
};

export const PRIMO_SUGGESTIONS_API_EXAMS = ({ keyword }) => ({
    apiUrl: 'https://api.library.uq.edu.au/v1/search_suggestions?type=exam_paper&prefix=' + keyword,
});

export const PRIMO_SUGGESTIONS_API_PAST_COURSE = ({ keyword }) => ({
    apiUrl: 'https://api.library.uq.edu.au/v1/search_suggestions?type=learning_resource&prefix=' + keyword,
});

// Chat availability API
export const CHAT_API = () => ({ apiUrl: 'chat_status', options: { params: { ts: `${new Date().getTime()}` } } });

// Alerts API
export const ALERT_API = () => ({ apiUrl: 'alerts/current', options: { params: { ts: `${new Date().getTime()}` } } });

// academic stats apis
export const VOCABULARIES_API = ({ id }) => ({ apiUrl: `vocabularies?cvo_ids=${id}` });
export const GET_PUBLICATION_TYPES_API = () => ({ apiUrl: 'records/types' });

// file uploading apis
export const FILE_UPLOAD_API = () => ({ apiUrl: 'file/upload/presigned' });

// create/patch record apis
export const NEW_RECORD_API = () => ({ apiUrl: 'records' });

export const NEW_COLLECTION_API = () => ({ apiUrl: 'collections' });

export const NEW_COMMUNITY_API = () => ({ apiUrl: 'communities' });

export const EXISTING_RECORD_API = ({ pid, isEdit }) => ({
    apiUrl: `records/${pid}${isEdit ? '?from=admin-form' : ''}`,
});

export const EXISTING_COLLECTION_API = ({ pid }) => ({ apiUrl: `records/${pid}` });

export const EXISTING_COMMUNITY_API = ({ pid }) => ({ apiUrl: `records/${pid}` });

export const RECORDS_ISSUES_API = ({ pid }) => ({ apiUrl: `records/${pid}/issues` });

// search/list records apis
export const POSSIBLE_RECORDS_API = values => ({
    apiUrl: 'records/search',
    options: {
        params: {
            rule: 'possible',
            ...getStandardSearchParams(values),
        },
    },
});

// (POST: with data: [\'pid\' => \'UQ:1\', \'type\' => \'H\'])`);
export const HIDE_POSSIBLE_RECORD_API = () => ({ apiUrl: 'records/search', options: { params: { rule: 'possible' } } });

export const INCOMPLETE_RECORDS_API = values => ({
    apiUrl: 'records/search',
    options: {
        params: {
            rule: 'incomplete',
            ...getStandardSearchParams(values),
        },
    },
});

export const AUTHOR_PUBLICATIONS_STATS_ONLY_API = values => ({
    apiUrl: 'records/search',
    options: {
        params: {
            rule: 'mine',
            'filters[stats_only]': true,
            ...getStandardSearchParams(values),
        },
    },
});

export const formatSearchQueryParams = ({ result, key, searchQueryParams }) => {
    const { value } = searchQueryParams[key];
    switch (key) {
        case 'rek_pid':
            if (value.toLowerCase().indexOf('uq:') !== 0) {
                return {
                    ...result,
                    [key]: `UQ:${value}`,
                };
            }
            break;
        case 'rek_genre_type':
            return {
                ...result,
                [key]: value.map(item => `"${item}"`),
            };
        case 'rek_status':
            return {
                ...result,
                [key]:
                    value < 0
                        ? [UNPUBLISHED, SUBMITTED_FOR_APPROVAL, IN_CREATION, IN_REVIEW, IN_DRAFT, RETRACTED]
                        : value,
            };
        case 'rek_created_date':
        case 'rek_updated_date':
            return result;
        case 'all':
            return {
                ...result,
                [key]: value,
            };
        default:
            break;
    }

    return {
        ...result,
        [key]: !!value ? value : searchQueryParams[key],
    };
};

export const SEARCH_INTERNAL_RECORDS_API = (query, route = 'search') => {
    // query = {searchQuery (text value - title search, doi or pubmed id)
    // searchQueryParams = {} (search parameters, eg title, author etc)
    // page = 1, pageSize = 20, sortBy = 'score', sortDirection = 'desc', facets = {}}
    let { searchQueryParams } = query;

    // convert {value, label} from advanced search to value string from api
    const searchQueryParamsWithoutLabels =
        (query.searchMode === 'advanced' &&
            !!searchQueryParams &&
            Object.keys(searchQueryParams).reduce(
                (result, key) => formatSearchQueryParams({ result, key, searchQueryParams }),
                {},
            )) ||
        searchQueryParams;

    const values = { ...query, searchQueryParams: searchQueryParamsWithoutLabels };

    searchQueryParams = {
        ...values.searchQueryParams,
    };

    let advancedSearchQueryParams = null;
    if (values.searchMode === 'advanced') {
        advancedSearchQueryParams = {
            mode: 'advanced', // mode to let axios request interceptor to know for serialising query params
            key: { ...searchQueryParams },
        };
    }

    return {
        apiUrl: `records/${route}`,
        options: {
            params: {
                ...getSearchType(values.searchQuery),
                ...getStandardSearchParams(values),
                ...(advancedSearchQueryParams || searchQueryParams),
            },
        },
    };
};

export const SEARCH_EXTERNAL_RECORDS_API = ({ source = 'wos', searchQuery = '' }) => ({
    apiUrl: 'external/records/search',
    options: { params: { source: source, ...getSearchType(searchQuery) } },
});

export const SEARCH_KEY_LOOKUP_API = ({ searchKey, searchQuery }) => ({
    apiUrl: 'records/search',
    options: {
        params: {
            rule: 'lookup',
            search_key: searchKey,
            lookup_value: searchQuery,
        },
    },
});

export const SEARCH_AUTHOR_LOOKUP_API = ({ searchQuery }) => ({
    apiUrl: 'fez-authors/search',
    options: {
        params: {
            rule: 'lookup',
            query: searchQuery.replace(/[.,\/?#!$%\^&\*;:{}=\-_`~()]/g, ' ').replace(/ +(?= )/g, ''),
        },
    },
});

export const THIRD_PARTY_LOOKUP_API_1FIELD = ({ type, field1 }) => ({
    apiUrl: `tool/lookup/${type}/${field1}`,
});

export const THIRD_PARTY_LOOKUP_API_2FIELD = ({ type, field1, field2 }) => ({
    apiUrl: `tool/lookup/${type}/${field1}/${field2}`,
});

export const COLLECTIONS_BY_COMMUNITY_LOOKUP_API = ({ communityPid }) => ({
    apiUrl: `communities/${communityPid}/collections`,
});

export const BATCH_IMPORT_API = () => ({
    apiUrl: 'external/records/batch-import',
});

export const UNLOCK_RECORD_API = ({ pid }) => ({
    apiUrl: `records/${pid}/unlock`,
});

export const GUIDES_API = ({ keyword }) => ({ apiUrl: 'library_guides/' + keyword });

export const EXAMS_API = ({ keyword }) => ({ apiUrl: `course_resources/${keyword}/exams` });

export const READING_LIST_API = ({ coursecode, campus, semester }) => {
    // api requires this field to be double encoded, as it may include characters like '/'
    const s = encodeURIComponent(encodeURIComponent(semester));
    return {
        apiUrl: `course_resources/${coursecode}/${campus}/${s}/reading_list`,
    };
};
