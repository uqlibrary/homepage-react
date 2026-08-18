// Membership mock fixtures, grown as the membership app is migrated across. For now that is just the
// form-data (the chooser's account_types) and the renewal-eligibility check.

export const membershipFormData = {
    "hospital": {
        "classifications": [
            "Allied Health Professional",
            "Medical Doctor (Registrar)",
            "Other"
        ],
        "services": [
            "Royal Brisbane and Womens Hospital"
        ],
        "types": [
            "Continuing",
            "Casual",
            "Contract"
        ]
    },
    "reciprocal": {
        "institutions": [
            "Queensland University of Technology",
            "Griffith University",
            "Other"
        ]
    },
    "account_types": [
        {
            "title": "UQ Alumni",
            "value": "alumni",
            "description": "For UQ graduates who have a UQ username and password.",
            "conditions": "Please allow 5 working days for your application to be processed. Please note that new graduates (those in the first year following graduation or completion of program) should complete the <a href=\"/membership/form/alumninew\">application for new graduates</a>.",
            "agreement": [
                "And I have read the <a target=\"_blank\" href=\"https://web.library.uq.edu.au/find-and-borrow/library-memberships/uq-alumni-membership\">list of services available to UQ Alumni</a> and I am aware of my entitlements"
            ]
        },
        {
            "title": "RBWH and STARS",
            "value": "hospital",
            "description": "For employees of Royal Brisbane and Women's Hospital (RBWH) and Surgical, Treatment and Rehabilitation Service (STARS). Please allow 2 working days for your application to be processed.",
            "agreement": [],
            "upload": "Please upload an image of your hospital ID that clearly shows your name and payroll number. If you are unable to upload your document it will need to be presented in person at the AskUs desk at Herston Health Sciences Library or alternatively, emailed to <a href=\"mailto:hhsl@library.uq.edu.au\">hhsl@library.uq.edu.au</a>.",
            "conditions": "For employees of Royal Brisbane and Women's Hospital (RBWH) and Surgical, Treatment and Rehabilitation Service (STARS). Please allow 2 working days for your application to be processed."
        },
        {
            "title": "Retired UQ Staff",
            "value": "retired",
            "description": "For retired UQ staff with at least 10 years of service at UQ.",
            "conditions": "",
            "agreement": [
                "I have reviewed <a target=\"_blank\" href=\"https://web.library.uq.edu.au/find-and-borrow/borrow-library/borrowing-rules-and-charges\">borrowing privileges for community members</a> and I am aware that membership does not include remote access to electronic resources."
            ]
        },
        {
            "title": "Reciprocal Borrower",
            "value": "reciprocal",
            "description": "Free membership for eligible <a target=\"_blank\" href=\"https://web.library.uq.edu.au/find-and-borrow/borrow-library/borrowing-students-and-staff-other-universities-reciprocal\">staff and students</a> from a University that is a member of the <a href=\"http://www.caul.edu.au/caul-programs/ulanz\" target=\"_blank\">University Libraries Australia and New Zealand</a> agreement.",
            "conditions": "Free membership for eligible <a target=\"_blank\" href=\"https://web.library.uq.edu.au/find-and-borrow/borrow-library/borrowing-students-and-staff-other-universities-reciprocal\">staff and students</a> from a University that is a member of the <a href=\"http://www.caul.edu.au/caul-programs/ulanz\" target=\"_blank\">University Libraries Australia and New Zealand</a> agreement.",
            "agreement": [
                "I have reviewed <a target=\"_blank\" href=\"https://web.library.uq.edu.au/find-and-borrow/borrow-library/borrowing-rules-and-charges\">borrowing privileges for community members</a> and I am aware that membership does not include remote access to electronic resources."
            ],
            "upload": "Please upload proof of eligibility e.g. confirmation of enrolment / employment. Students from overseas will also need to supply a letter of introduction and indemnity from their home institution."
        },
        {
            "title": "Proxy Borrower",
            "value": "proxy",
            "description": "For senior UQ / teaching hospital staff to nominate another staff member to borrow material on their behalf. This form is to be completed by the authorising borrower.",
            "conditions": "For senior UQ / teaching hospital staff to nominate another staff member to borrow material on their behalf. This form is to be completed by the authorising borrower. A Library card with your name and the name of the person authorised to borrow for you will be sent to you. The signature panel on the card must be signed by the nominated borrower.",
            "agreement": [
                "And I understand that I am responsible for the return of Library materials borrowed on my behalf under this authorisation and that I may be charged for the replacement of material not returned."
            ]
        },
        {
            "title": "Alumni Friends",
            "value": "alumnifriends",
            "description": "For members of the Alumni Friends Giving Society.",
            "conditions": "For members of the Alumni Friends Giving Society. Membership costs $15 per year.",
            "agreement": [
                "I have reviewed <a target=\"_blank\" href=\"https://web.library.uq.edu.au/find-and-borrow/borrow-library/borrowing-rules-and-charges\">borrowing privileges for community members</a> and I am aware that membership does not include remote access to electronic resources."
            ],
            "upload": "Please upload proof of Alumni Friends membership.",
            "payment_options": [
                {
                    "code": "AF1",
                    "description": "12 months ($15)"
                }
            ]
        },
        {
            "title": "Community",
            "value": "community",
            "description": "For members of the general public. Membership costs $25 per year.",
            "conditions": "For members of the general public. Membership costs $25 per year.",
            "agreement": [
                "I have reviewed <a target=\"_blank\" href=\"https://web.library.uq.edu.au/find-and-borrow/borrow-library/borrowing-rules-and-charges\">borrowing privileges for community members</a> and I am aware that membership does not include remote access to electronic resources."
            ],
            "payment_options": [
                {
                    "code": "COM",
                    "description": "12 months ($25)"
                }
            ]
        },
        {
            "title": "UQ Associate",
            "value": "associate",
            "description": "For staff employed by UQ controlled entities e.g. JKTech.",
            "conditions": "For staff employed by UQ controlled entities e.g. JKTech.",
            "agreement": []
        },
        {
            "title": "New Graduates",
            "value": "alumninew",
            "description": "New graduates are eligible for one year free membership following graduation or completion of your program.",
            "conditions": "New graduates are eligible for one year free membership following graduation or completion of your program. Please allow 3 working days for your application to be processed.",
            "agreement": [
                "And I have read the <a target=\"_blank\" href=\"https://web.library.uq.edu.au/find-and-borrow/library-memberships/uq-alumni-membership\">list of services available to UQ Alumni</a> and I am aware of my entitlements"
            ]
        },
        {
            "title": "Staff Awaiting Aurion",
            "value": "awaitingaurion",
            "description": "For UQ staff waiting for their appointment to be loaded on the HR system",
            "conditions": "For UQ staff waiting for their appointment to be loaded on the HR system",
            "agreement": []
        },
        {
            "title": "Official Visitors",
            "value": "visitors",
            "description": "Official Visitors, higher degree candidates and deferring postgraduates (not on the UQ HR or Student admin  system)",
            "conditions": "Official Visitors, higher degree candidates and deferring postgraduates (not on the UQ HR or Student admin  system)",
            "agreement": [
                "I have reviewed <a href=\"https://web.library.uq.edu.au/find-and-borrow/borrow-library/borrowing-rules-and-charges\" target=\"_blank\">borrowing privileges for community members</a> and I am aware that membership does not include remote access to electronic resources."
            ]
        },
        {
            "title": "Fryer Visitors",
            "value": "fryer",
            "description": "Fryer Library is open for UQ staff and students and members of the general public. Those who are not affiliated with UQ can apply for free Fryer Library membership which provides access to Fryer Library material only, for access and use in the Fryer Library.",
            "conditions": "Fryer Library is open for UQ staff and students and members of the general public. Those who are not affiliated with UQ can apply for free Fryer Library membership which provides access to Fryer Library material only, for access and use in the Fryer Library.<br>Start requesting Fryer items using the online request form",
            "agreement": []
        }
    ],
    "titles": [
        "Mr",
        "Mrs",
        "Ms",
        "Mx",
        "Miss",
        "Dr",
        "Sr",
        "Prof",
        "Aprof"
    ]
};

export const membershipRenewing = {
    renewing: true,
    type: 'community',
    id: '00000000-0000-0000-0000-000000000009',
    renewal_code: 'renew-me-123',
};

// The membership types and their expiry dates, for the admin settings screen. Each type's `expiry` is the date
// its accounts expire on; `computed_expiry` is the date the type's daily rule works out. Where the two match,
// the type is on its computed date; where they differ, an admin has pinned an override. Day-first dates, the
// shape the API emits. Mutable, so a saved change is reflected on a reload the way the real store would hold it.
export const membershipTypes = [
    { id: 1, name: 'community', expiry: '02-08-2027', computed_expiry: '02-08-2027' },
    { id: 2, name: 'alumni', expiry: '02-08-2027', computed_expiry: '02-08-2027' },
    { id: 3, name: 'alumnifriends', expiry: '02-08-2027', computed_expiry: '02-08-2027' },
    { id: 4, name: 'fryer', expiry: '02-08-2027', computed_expiry: '02-08-2027' },
    // An override in place: the pinned date differs from the computed one, so it will not update on its own.
    { id: 5, name: 'hospital', expiry: '31-12-2027', computed_expiry: '24-12-2027' },
    { id: 6, name: 'reciprocal', expiry: '28-02-2027', computed_expiry: '28-02-2027' },
    { id: 7, name: 'associate', expiry: '28-02-2027', computed_expiry: '28-02-2027' },
    { id: 8, name: 'retired', expiry: '05-08-2029', computed_expiry: '05-08-2029' },
    { id: 9, name: 'alumninew', expiry: '30-11-2026', computed_expiry: '30-11-2026' },
    { id: 10, name: 'awaitingaurion', expiry: '02-09-2026', computed_expiry: '02-09-2026' },
    // Another override.
    { id: 11, name: 'visitors', expiry: '15-01-2027', computed_expiry: '02-09-2026' },
    // A type with no computed rule, so its date is always an explicit one.
    { id: 12, name: 'proxy', expiry: '30-06-2027', computed_expiry: null },
];

// The record a renewal link resolves to: a `renewing` application the form opens prefilled, with identity
// fields locked. Its id and code match membershipRenewing above, so the landing renewal prompt links straight
// to it.
export const membershipRenewal = {
    id: '00000000-0000-0000-0000-000000000009',
    type: 'community',
    status: 'renewing',
    title: 'Ms',
    first_name: 'Renewing',
    sn: 'Member',
    date_of_birth: '2-12-1985',
    mail: 'renewing.member@example.org',
    phone: '0733654000',
    home_address_0: '123 Library Way',
    home_address_1: 'St Lucia',
    home_address_city: 'Brisbane',
    home_address_state: 'QLD',
    home_address_postcode: '4067',
};

// What the file-upload endpoint answers with: the stored attachment the form carries into the application.
export const membershipAttachment = {
    id: 'file-1',
    filename: 'uploaded-document.pdf',
};

// The saved record the API answers a submission with: an unconfirmed application, echoing back the type, plus
// the gateway URL a paying type is sent to.
export const membershipSubmitted = (id, type) => ({
    id,
    type,
    status: 'unconfirmed',
    uq_payments_url:
        '/membership/paymentconfirmation?UQ_LIB_ID=' +
        id +
        '&ReceiptNo=R7654321&MembershipCode=COM&Success=Y&AmountPaid=25.00',
});

// The admin queue. The six named applications are the recognisable cases the listing, filters, payment and
// attachment views are built against (newest, so they lead page one) - a fresh application paid for, one whose
// payment was refused, one already confirmed, one renewing, one part-way through a confirmation, and one with a
// document attached; a spread of generated applications sits behind them so paging and the per-status counts
// are exercised the way the real ~9,500-row queue would drive them. Dates are day-first, the shape the API emits.
const namedApplications = [
    {
        id: '00000000-0000-0000-0000-000000000101',
        type: 'community',
        status: 'unconfirmed',
        title: 'Mr',
        first_name: 'Newly',
        sn: 'Applied',
        mail: 'newly.applied@example.org',
        date_of_birth: '04-05-1990', // 4 May, which a month-first parser would read as 5 April
        submitted_on: '15-07-2026 13:15:00',
        phone: '0733650001',
        home_address_0: '10 Sir Fred Schonell Drive',
        home_address_1: 'St Lucia',
        home_address_city: 'Brisbane',
        home_address_state: 'QLD',
        home_address_postcode: '4067',
        home_address_country: 'Australia',
        // A paying type that paid: its receipt and amount are the evidence an admin confirms it on.
        payment_receipt: 'R7654321',
        payment_response: 'Success',
        payment_amount: '25.00',
    },
    {
        // A payment the gateway refused. The API writes its "-" blank sentinel to the receipt and 'Failed' to
        // the response, and leaves the application unconfirmed - so the card reads it as the case for Delete
        // rather than Confirm.
        id: '00000000-0000-0000-0000-000000000106',
        type: 'community',
        status: 'unconfirmed',
        title: 'Mx',
        first_name: 'Payment',
        sn: 'Declined',
        mail: 'payment.declined@example.org',
        date_of_birth: '12-11-1985',
        submitted_on: '14-07-2026 09:20:00',
        payment_receipt: '-',
        payment_response: 'Failed',
    },
    {
        id: '00000000-0000-0000-0000-000000000102',
        type: 'alumni',
        status: 'confirmed',
        title: 'Dr',
        first_name: 'Already',
        sn: 'Confirmed',
        mail: 'already.confirmed@example.org',
        alumni_num: 's1234567',
        submitted_on: '14-07-2026 11:00:00',
        confirmed_on: '03-06-2026',
        phone: '0733650002',
        home_address_0: '4 Cordelia Street',
        home_address_1: 'South Brisbane',
        home_address_city: 'Brisbane',
        home_address_state: 'QLD',
        home_address_postcode: '4101',
        home_address_country: 'Australia',
        // An issued account, so it carries the expiry and barcode an admin corrects in place.
        expires_on: '31-12-2026',
        barcode: '2406700012345',
    },
    {
        id: '00000000-0000-0000-0000-000000000103',
        type: 'community',
        status: 'renewing',
        title: 'Ms',
        first_name: 'Renewing',
        sn: 'Member',
        mail: 'renewing.member@example.org',
        submitted_on: '13-07-2026 14:30:00',
        confirmed_on: '21-05-2025',
        // A renewing account already has an expiry and barcode; they show on the card but are corrected only
        // once the renewal is confirmed.
        expires_on: '30-06-2026',
        barcode: '2406700067890',
    },
    {
        id: '00000000-0000-0000-0000-000000000104',
        type: 'hospital',
        status: 'unconfirmed',
        title: 'Mrs',
        first_name: 'Halfway',
        sn: 'Through',
        mail: 'halfway.through@example.org',
        hospital_service: 'Royal Brisbane and Women\'s Hospital',
        submitted_on: '12-07-2026 15:00:00',
        // A confirmation the backend has begun but not finished, so the card guards it: no confirm, no delete.
        confirm_step: 1,
    },
    {
        id: '00000000-0000-0000-0000-000000000105',
        type: 'hospital',
        status: 'unconfirmed',
        title: 'Mr',
        first_name: 'With',
        sn: 'Documents',
        mail: 'with.documents@example.org',
        hospital_service: 'Princess Alexandra Hospital',
        submitted_on: '11-07-2026 08:45:00',
        attachment_0: JSON.stringify({ key: 'file-1', name: 'proof-of-employment.pdf' }),
    },
];

// Nineteen more, cycling through the three states and a few types on descending June dates, so the queue is two
// pages deep at the default page size and each triage tile has a real, checkable count.
const generatedApplications = Array.from({ length: 19 }, (_, index) => {
    const status = ['unconfirmed', 'renewing', 'confirmed'][index % 3];
    const day = String(19 - (index % 19)).padStart(2, '0');
    return {
        id: `00000000-0000-0000-0000-0000000002${String(index).padStart(2, '0')}`,
        type: ['community', 'hospital', 'reciprocal'][index % 3],
        status,
        title: 'Mx',
        first_name: `Queued${index}`,
        sn: `Applicant${index}`,
        mail: `queued${index}@example.org`,
        submitted_on: `${day}-06-2026 09:00:00`,
        ...(status !== 'unconfirmed' ? { confirmed_on: '01-06-2026' } : {}),
    };
});

export const membershipList = [...namedApplications, ...generatedApplications];
