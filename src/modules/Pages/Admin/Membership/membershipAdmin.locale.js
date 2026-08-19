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
            // This bucket holds renewals the member has already completed that now await an admin's
            // re-confirmation, so it reads 'Reconfirm' rather than 'Renewing'. The filter value stays 'renewing'.
            renewing: 'Reconfirm',
            confirmed: 'Confirmed',
            // The accessible name of a tile pairs its label with its count, since the two are drawn apart.
            label: (label, count) => `${label}, ${count}`,
        },
        toolbar: {
            search: { label: 'Search', placeholder: 'Search by name or email', clear: 'Clear search' },
            type: { label: 'Membership type', any: 'All types' },
            sort: { label: 'Sort', newest: 'Newest first', oldest: 'Oldest first' },
            // Leaves the queue for the per-type expiry settings screen.
            settings: 'Settings',
            settingsLabel: 'Membership expiry settings',
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
            // Sending a renewing member their renewal link again, for one who lost or never received it. Its
            // accessible name names the applicant, since the button sits among identical ones down the page.
            resend: 'Resend email',
            resendLabel: name => `Resend the renewal email for ${name}`,
            // Opening the full record to read it and correct the applicant's contact details. Its accessible
            // name names the applicant, since the button sits among identical ones down the page.
            view: 'View / edit',
            viewLabel: name => `View and edit the application for ${name}`,
            // Stands in for an account field an issued account has not been given yet, so the row reads as
            // empty-but-present rather than blank.
            notSet: 'Not set',
            // Payment shown on the card as the evidence behind the confirm-or-delete decision. A payment is
            // written as exactly 'Success' or 'Failed', and left blank where none was ever taken, so only a
            // failure is worth a word of its own - a payment that worked has its receipt to show for it.
            paymentReceipt: 'Receipt',
            payment: 'Payment',
            paymentFailed: 'Failed',
            // The supporting documents an application carries, shown on the card so an admin can read the proof
            // behind a reciprocal or hospital application - the evidence to confirm or delete it on - without
            // opening the record. Each document opens in a new tab from a signed link fetched when it is asked
            // for.
            attachments: {
                label: 'Attachments',
                // Stands in for a document the backend stored without a name of its own.
                fallbackName: 'Document',
                // The link opens the document in a new tab; its accessible name pairs the file with the
                // applicant, since identical links sit down the page and "Document" on its own names none of
                // them.
                openLabel: (file, name) => `Open ${file} for ${name} (opens in a new tab)`,
            },
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
        // Downloading the applications matching the current search and filter as a CSV, for reporting and
        // offline processing. It gathers the whole matching set across pages, not only the page on screen, so
        // the label reads as the action rather than "export this page".
        export: {
            label: 'Export CSV',
            // Stands in for the label while the whole matching set is being gathered page by page.
            inProgress: 'Exporting..',
            filename: 'memberships.csv',
        },
        // The full record, opened from a card to read it whole and correct the applicant's identity, contact
        // and address. Only those fields are editable; the rest are shown for context, since deciding what to
        // correct means seeing the record it sits in. Saved through the same update endpoint as the inline
        // edits.
        viewDialog: {
            dialogId: 'membership-view',
            // Names the dialog for a screen reader; the applicant's name is appended by the caller.
            title: 'Application',
            // The read-only context, above the fields the admin can change.
            detailsHeading: 'Application',
            editHeading: 'Contact details',
            // The read-only facts. Each names the value beside it, since there are no columns to head.
            details: {
                type: 'Type',
                status: 'Status',
                submitted: 'Submitted',
                dateOfBirth: 'Date of birth',
                confirmed: 'Confirmed',
                expiry: 'Expiry',
                barcode: 'Barcode',
                // The payment the legacy record view left out: whether it went through, for how much, and its
                // receipt, so an admin need not open the gateway to see it.
                payment: 'Payment',
                paymentAmount: 'Amount',
                paymentReceipt: 'Receipt',
                // The pricing code the application was lodged under, kept on the record beside the payment it
                // drives. Shown read-only, as the old record view did, since it is set at submission and not
                // something an admin corrects here.
                paymentCode: 'Payment code',
                paid: 'Paid',
                paymentFailed: 'Failed',
                // Stands in where a fact was never recorded, so the row reads as empty-but-present.
                none: 'Not recorded',
            },
            save: 'Save changes',
            saving: 'Saving..',
            cancel: 'Cancel',
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
        // Feedback after a resend: the endpoint says whether it sent, so the admin is told either way. The
        // applicant's name is prefixed by the caller, since the same dialog fronts a resend for any row.
        resendDialog: {
            confirmationBoxId: 'membership-resend',
            sent: 'Renewal email sent successfully.',
            notSent: 'Unfortunately, the renewal email could not be sent. Please try again later.',
            confirmButtonLabel: 'Close',
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
    // The per-type expiry settings screen. Each membership type has a date the accounts of that type expire on.
    // That date is recomputed every day from the type's own rule - unless an admin pins an override here. An
    // override is any date other than the computed one; setting the date back to the computed one, or clearing
    // it, drops the override and returns the type to the daily-computed date ("set it and forget it").
    settings: {
        title: 'Expiry Dates By Type',
        pageTitle: 'Membership expiry settings',
        intro: [
            'The dates below will update automatically to calculated values every day according to the type, ' +
                'unless overridden.',
            'To activate the use of calculated dates, update the date to the calculated date for the type ' +
                '("set it and forget it").',
            'To override the calculated date, update the date to any other date than the calculated date. ' +
                'You can also just clear the field and click the update button.',
        ],
        loading: 'Loading membership types',
        loadFailed: 'The membership types could not be loaded. Please try again.',
        retry: 'Try again',
        // Names the list of types for a screen reader, since there are no column headers to say what it holds.
        caption: 'Membership types and their expiry dates',
        // Leads back to the applications queue.
        back: 'Back to applications',
        row: {
            expiryLabel: 'Expiry date',
            // The input sits among identical ones down the page, so its accessible name names the type it sets.
            expiryFor: title => `Expiry date for ${title}`,
            expiryPlaceholder: 'DD-MM-YYYY',
            invalid: 'Enter the date as DD-MM-YYYY',
            // The computed date is always shown, so an admin can see what to type to return a type to it.
            calculatedDefault: date => `Calculated expiry date (default): ${date}.`,
            // The date in the field is the computed one, so the type will keep updating on its own.
            usingCalculated: 'Using calculated expiry date',
            // The date in the field is something other than the computed one, so the type will not update.
            overrideActive: 'Override active',
            // Appended while the field has been edited but not yet saved, so the status reads as what the update
            // will make it rather than what it is now.
            onUpdate: ' on update',
            // Stands in for the status where a type has no computed rule to fall back to.
            automationUnavailable: 'Automation unavailable.',
            update: 'Update',
            updating: 'Updating..',
            // The button sits among identical ones down the page, so its accessible name names the type.
            updateLabel: title => `Update the expiry date for ${title}`,
            // Shown once an update has taken, so the admin sees it landed.
            saved: 'Saved',
            saveFailed: 'That date could not be saved. Please try again.',
        },
    },
};
