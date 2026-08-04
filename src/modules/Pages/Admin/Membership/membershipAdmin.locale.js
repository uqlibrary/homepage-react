export default {
    list: {
        title: 'UQ Library Membership Admin',
        pageTitle: 'Membership Admin',
        frozen:
            'The membership backend database is being migrated to a new platform. ' +
            'Membership applications will be unavailable from 12-2pm AEST Thursday 15th June 2017.',
        loading: 'Loading membership applications',
        loadFailed: 'The membership applications could not be loaded. Please try again.',
        search: {
            legend: 'Find membership applications',
            name: { label: 'Name', placeholder: 'Search by name' },
            type: { label: 'Membership type', placeholder: 'Any type' },
            status: {
                label: 'Status',
                any: 'Any status',
                unconfirmed: 'Unconfirmed only',
                reconfirm: 'Reconfirm only',
            },
            submit: 'Search',
            submitting: 'Searching..',
        },
        results: {
            none: 'No membership applications found',
            noneHint: 'Try a different name, or widen the type and status filters.',
            // Announced when a search finishes, because the results appear below the button rather than where
            // focus is.
            count: count => `${count} membership application${count === 1 ? '' : 's'} found`,
            // Names the list itself, since there are no column headers to say what it holds.
            caption: 'Membership applications',
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
