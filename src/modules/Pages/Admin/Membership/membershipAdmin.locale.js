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
            // Removing an invalid, spam or duplicate application from the queue. Its accessible name names the
            // applicant, since the button sits among identical ones down the page.
            delete: 'Delete',
            deleteLabel: name => `Delete the application for ${name}`,
            deleting: 'Deleting',
            // Shown on the card once the delete has taken, in place of the buttons.
            deleted: 'Deleted',
            // Stands in for an account field an issued account has not been given yet, so the row reads as
            // empty-but-present rather than blank.
            notSet: 'Not set',
        },
        // Correcting an issued account's expiry and barcode where they sit on the card. The value is
        // pattern-checked here because the format is knowable without asking the API, and a bad barcode is
        // otherwise only refused after a round trip.
        inlineEdit: {
            // The icon-only controls name the field and the applicant they act on, since "Edit" repeated down
            // the page names nothing on its own.
            edit: (field, name) => `Edit the ${field} for ${name}`,
            add: (field, name) => `Add a ${field} for ${name}`,
            save: 'Save',
            saving: 'Saving..',
            cancel: 'Cancel',
            cancelLabel: (field, name) => `Stop editing the ${field} for ${name}`,
            expiry: {
                field: 'expiry',
                label: 'Expiry',
                placeholder: 'DD-MM-YYYY',
                invalid: 'Enter the expiry as DD-MM-YYYY',
            },
            barcode: {
                field: 'barcode',
                label: 'Barcode',
                invalid: 'A barcode starts with 24067 and is 13 or 14 digits long',
            },
        },
        // The prompt before a delete: it cannot be undone, so it is asked for rather than assumed.
        deleteDialog: {
            confirmationBoxId: 'membership-delete',
            confirmationTitle: 'Confirm deletion',
            confirmationMessage: name =>
                `You are about to delete the membership application for ${name}. ` +
                'Please note this action cannot be undone.',
            confirmButtonLabel: 'Yes, delete',
            cancelButtonLabel: 'Cancel',
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
            // The backend refuses a duplicate barcode with a status carrying internal debug text - the barcode
            // and a record id - which cannot go on screen, so this stands in its place. The barcode is
            // pattern-checked before it is sent, so a refusal here means it is well formed but already taken.
            barcodeRejected:
                'That barcode could not be saved. It may already be in use by another member. ' +
                'Check the barcode and try again.',
        },
    },
};
