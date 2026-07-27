export default {
    validationErrors: {
        firstName: 'Please use a shorter version of your First Name',
        lastName: 'Please use a shorter version of your Last Name',
        otherName: 'Please use a shorter version of the name',
        email: 'This email address is not valid',
        phone: 'This phone number is invalid',
        address: 'This address entry is too long',
        city: 'Please use a shorter version of the City name',
        state: 'Please use a shorter version of the State name',
        postcode: 'This postcode is not valid',
        country: 'Please use a shorter version of the Country name',
        departmentalAddress: 'Please use a shorter version of the Departmental address',
        homeInstitution: 'Please use a shorter version of the Home Institution name',
        studentNumber: 'This student number is invalid',
        award: 'Please use a shorter version of your award',
        graduatedYear: 'Please enter a valid year, as a number',
        retiredPosition: 'Please use a shorter version of your Staff title',
        retiredYears: 'Please use numbers for the year count',
        retiredNumber: 'This entry is too long - is this your Staff Number?',
        reciprocalLibraryNumber: 'This entry is too long - is this your ID Number?',
        institutionAffiliation: 'Please use a shorter version of your Institution Name',
        projectResearchTopic: 'Please use a shorter version of your Topic',
        organisationName: 'Please use a shorter version of the Organisation Name',
        proxyDate: 'This date is invalid (correct format: DD-MM-YYYY)',
        tooLong: 'This field is too long',
    },
    form: {
        invalidSummary: 'Some fields are either missing or invalid. Please review the fields highlighted in red above.',
        title: 'UQ Library Membership',
        mandatoryNote: 'Mandatory fields are marked with an asterisk',
        loadFailed: 'This application form could not be loaded. Please refresh the page to try again.',
        renewalLoadFailed:
            'There was an error setting up your renewal - please advise the Library through your usual contact method.',
        submitFailed: 'Your application could not be submitted. Please review the form and try again.',
        apply: 'Apply for membership',
        applying: 'Applying..',
        renew: 'Renew membership',
        renewing: 'Renewing..',
        frozen:
            'The membership backend database is being migrated to a new platform. Membership applications will be ' +
            'unavailable from 12-2pm AEST Thursday 15th June 2017.',
        paymentGatewayOutage:
            'The membership payment system is currently unavailable due to a scheduled outage. Alumni and Community ' +
            'membership applications and renewals will be unavailable from 7:00am-1:00pm AEST Monday 20th January ' +
            '2025. We apologise for any inconvenience caused.',
        contactUs: {
            text: 'if you do not receive the confirmation email or require assistance.',
            label: 'Contact us',
            url: 'https://web.library.uq.edu.au/about/contact-us',
        },
        findAPostcode: {
            before: 'You may find the Australia Post ',
            label: 'Find a postcode',
            url: 'https://auspost.com.au/apps/postcode.html',
            after: ' page useful.',
        },
    },
    upload: {
        title: 'Document Upload',
        inPersonNote: {
            before: 'If you are unable to upload the documents they will need to be presented in person at one of our ',
            label: 'service points',
            url: 'https://web.library.uq.edu.au/library-and-student-it-help',
            after:
                ' when you collect your Library card. You will be notified by email when your card is ready to ' +
                'collect.',
        },
        selectLabel: 'Select one or more documents to upload',
        constraints: maxMb => `Files must end in .png, .jpeg or .pdf, and be less than ${maxMb}MB in size.`,
        tooLarge: (name, maxMb) => `${name} is greater than ${maxMb}MB in size.`,
        wrongType: name => `${name} does not end in .png, .jpeg or .pdf.`,
        tooMany: (name, max) => `${name} was not added - an application can carry at most ${max} documents.`,
        problemsHeading: 'Some documents could not be added:',
        selectedHeading: 'Documents to upload',
        columnName: 'Name',
        columnSize: 'Size',
        columnStatus: 'Status',
        sizeInMb: sizeMb => `${sizeMb} MB`,
        remove: 'Remove',
        removeLabel: name => `Remove ${name}`,
        uploading: 'Uploading..',
        uploaded: 'Uploaded',
        failed: 'Failed',
        readyToUpload: 'Ready to upload',
        uploadOne: 'Click here to upload file',
        uploadMany: 'Click here to upload files',
        pendingUploads: 'Please upload the documents you have selected, or remove them, before applying.',
    },
    received: {
        title: 'UQ Library Membership',
        thankYou: 'Thank you for your membership application.',
        notifiedByEmail: 'You will be notified by email when your application has been processed by Library staff.',
        loadFailed: {
            reassure: 'Your application has been received, and Library staff can see it.',
            explain:
                'Your details are not shown again on this page once you have left or reloaded it, because a ' +
                'membership application is only visible to Library staff.',
            act:
                'If your membership type requires payment, or you would like to check on your application, ' +
                'please contact AskUs and quote your application reference.',
            referenceLabel: 'Application reference',
            askUs: {
                label: 'askus@library.uq.edu.au',
                email: 'askus@library.uq.edu.au',
                subject: 'UQ Library Membership Application',
            },
        },
        payNow: 'Pay now',
        redirecting: 'Redirecting to UQ Payments..',
        paymentUnavailable:
            'This application requires payment, but the payment page could not be reached. Please contact the ' +
            'Library to arrange payment.',
        alumniAcknowledgement: {
            before: 'I acknowledge that I have read the ',
            servicesLabel: 'Services for UQ Alumni',
            servicesUrl: 'https://www.library.uq.edu.au/library-services/services-for-uq-alumni',
            middle: ' and I am aware that access to databases is limited to those listed ',
            listedLabel: 'here',
            listedUrl: 'https://web.library.uq.edu.au/find-and-borrow/library-memberships/uq-alumni-membership',
            after: '.',
        },
        backToHomePage: {
            label: 'Back to UQ Library home page',
            url: 'https://www.library.uq.edu.au/',
        },
    },
    renewed: {
        title: 'UQ Library Membership',
        thankYou: 'Thank you, the membership renewal application has been successfully submitted.',
    },
    paymentConfirmation: {
        title: 'UQ Library Membership',
        processing: 'Processing..',
        thankYou:
            'Thank you, your payment has been received. You will be notified by email when your application has ' +
            'been processed by Library staff.',
        recordFailed:
            'Your payment was received, but we could not record it against your application. Please contact the ' +
            'Library and quote your receipt number so staff can finish processing it.',
        receiptNumber: receipt => `Your receipt number is ${receipt}.`,
    },
    terms: {
        submissionIndicatesAgreement: 'Your submission of this form indicates your agreement to abide by:',
        alumniServices: {
            label: 'The list of services and limited entitlements available to UQ alumni',
            url: 'https://web.library.uq.edu.au/find-and-borrow/library-memberships/uq-alumni-membership',
        },
        policies: [
            {
                label: 'The Library Code of Practice Policy',
                url: 'https://policies.uq.edu.au/document/view-current.php?id=129',
            },
            {
                label: 'The Information and Communication Technology Policy',
                url: 'https://policies.uq.edu.au/document/view-current.php?id=60',
            },
            {
                label: 'Acceptable Use of UQ ICT Resources guidelines',
                url: 'https://policies.uq.edu.au/document/view-current.php?id=384',
            },
        ],
        privacy: {
            title: 'Privacy statement',
            statement:
                'The University of Queensland Library only requests and uses personal information for the specific ' +
                'purpose for which it is requested. Your personal information is treated in strict compliance with ' +
                'relevant privacy laws. We disclose personal information with your express consent only, or where ' +
                'required by law. See our <a target="_blank" ' +
                'href="https://policies.uq.edu.au/document/view-current.php?id=4">Privacy Management Policy</a> and ' +
                '<a target="_blank" href="https://policies.uq.edu.au/document/view-current.php?id=12">Privacy ' +
                'Management Procedure</a> for details.',
        },
    },
    landing: {
        title: 'UQ Library Membership',
        loadFailed: 'The membership types could not be loaded. Please refresh the page to try again.',
        chooseType: 'Select the type of membership you wish to apply for from the list below:',
        anonymous: {
            returningMember: 'Returning Member?',
            login: 'Log in',
            notAMember: 'Not a member? Become a member of UQ Library today!',
        },
        renewing: {
            prompt: 'Renewal time!',
            renew: 'Click here to Renew now!',
            orApply: 'or apply for a different type of membership of UQ Library.',
        },
        loggedIn: {
            becomeAMember: 'Become a member of UQ Library',
        },
        applyLabel: title => `Apply for ${title}`,
        apply: 'Apply',
        typeListLabel: 'Membership types',
    },
};
