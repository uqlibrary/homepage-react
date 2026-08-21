// The queue holds thousands of applications, so the search, the filter, the sort, the paging and the per-status
// counts are all the server's job. What is left here is the vocabulary the UI drives the query with, and the
// arithmetic for describing the page that came back.

// The status buckets, matching the values the API filters on and the status each record carries back. `all`
// places no status constraint.
export const STATUS_ALL = 'all';
export const STATUS_UNCONFIRMED = 'unconfirmed';
export const STATUS_RENEWING = 'renewing';
export const STATUS_CONFIRMED = 'confirmed';
export const STATUS_KEYS = [STATUS_ALL, STATUS_UNCONFIRMED, STATUS_RENEWING, STATUS_CONFIRMED];

export const SORT_NEWEST = 'newest';
export const SORT_OLDEST = 'oldest';

export const DEFAULT_PER_PAGE = 20;

export const defaultQuery = {
    name: '',
    type: '',
    status: STATUS_ALL,
    sort: SORT_NEWEST,
    page: 1,
};

/**
 * "application" or "applications" for a count. Lives here rather than in the locale so both wordings are
 * exercised by the component tests - a locale string is only ever read through the browser.
 */
export const pluralApplications = count => (count === 1 ? 'application' : 'applications');

/**
 * The 1-based span of the page that came back, for "Showing 21–40 of 3,300". Null when there is nothing to
 * describe, so the caller can leave the line off entirely rather than print "0 of 0".
 */
export const pageRange = pagination => {
    if (!pagination || !pagination.total) {
        return null;
    }
    const start = (pagination.page - 1) * pagination.per_page + 1;
    const end = Math.min(pagination.page * pagination.per_page, pagination.total);
    return { start, end, total: pagination.total };
};
