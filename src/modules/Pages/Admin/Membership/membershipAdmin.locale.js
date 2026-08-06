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
            // The action that turns an application into an account. It reads 'Re-confirm' where the applicant
            // has been confirmed before, since confirming again is a different, deliberate thing to do.
            confirm: 'Confirm',
            reconfirm: 'Re-confirm',
            confirming: 'Confirming',
            // The button sits among identical buttons down the page, so its accessible name says which
            // applicant it acts on.
            confirmLabel: (action, name) => `${action} the application for ${name}`,
            // A confirmation the backend has started but not finished. Neither confirming again nor deleting is
            // safe until it settles, so the card shows this in place of those actions.
            inProgress: 'In progress',
        },
        // What an admin action failed with. The lead-in is fixed and names no particular action, since it
        // fronts whatever the admin tried; the backend's own reason, where there is one, is appended to it.
        errorDialog: {
            confirmationBoxId: 'membership-error',
            confirmationTitle: 'Error',
            confirmationMessage: 'That action could not be completed:',
            confirmButtonLabel: 'Close',
            // Stands in when the backend gives no reason we can show. Reads as the tail of the lead-in above,
            // so it must not repeat it.
            unknown: 'Please try again, or contact support if the problem continues.',
        },
    },
};
