export default {
    list: {
        title: 'UQ Library Membership Admin',
        pageTitle: 'Membership Admin',
        frozen:
            'The membership backend database is being migrated to a new platform. ' +
            'Membership applications will be unavailable from 12-2pm AEST Thursday 15th June 2017.',
        loading: 'Loading membership applications',
        loadFailed: 'The membership applications could not be loaded. Please try again.',
        retry: 'Try again',
        reload: 'Reload applications',
        // The triage tiles: a count per status that doubles as the status filter.
        tiles: {
            legend: 'Filter by status',
            all: 'All',
            unconfirmed: 'Unconfirmed',
            renewing: 'Renewing',
            confirmed: 'Confirmed',
            // The accessible name of a tile pairs its label with its count, since the two are drawn apart.
            label: (label, count) => `${label}, ${count}`,
        },
        toolbar: {
            search: { label: 'Search', placeholder: 'Search by name or email', clear: 'Clear search' },
            type: { label: 'Membership type', any: 'All types' },
            sort: { label: 'Sort', newest: 'Newest first', oldest: 'Oldest first' },
        },
        results: {
            // Announced as the query changes, because the list updates below where focus is. The noun is
            // pluralised by the caller, so this string carries no branch a browser test would have to reach.
            showing: (start, end, total, noun) => `Showing ${start}–${end} of ${total} ${noun}`,
            noneShort: 'No applications',
            // Names the list itself, since there are no column headers to say what it holds.
            caption: 'Membership applications',
            // Nothing in the queue at all — a different thing to say than nothing matching the filters.
            none: 'No membership applications found',
            noneHint: 'There are no applications in the queue right now.',
            noMatch: 'No applications match your filters',
            noMatchHint: 'Try a different search, or widen the type and status filters.',
            clear: 'Clear filters',
        },
        // The pager beneath the list.
        pager: {
            label: 'Membership applications pages',
        },
        row: {
            mailSubject: 'UQ Library Membership Application',
            // Names the date for a screen reader, which has no other way to know what it is - a sighted
            // reader has the calendar icon in its place. Every application on the page carries this date, so
            // spelling the word out on every one of them earned nothing but length.
            submittedOn: 'Submitted',
            // Prefixes its value on the line of facts, rather than heading a column, so it is as short as it
            // can be and still say what the value is.
            birthdate: 'Born',
        },
    },
};
