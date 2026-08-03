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
