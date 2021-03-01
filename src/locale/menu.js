export default {
    menuhome: {
        dataTestid: 'connect-home-link',
        linkTo: 'http://www.library.uq.edu.au',
        primaryText: 'Library home',
    },
    responsiveClose: {
        dataTestid: 'close-action',
        primaryText: 'Close',
    },
    publicmenu: [
        // the parent items appears in the footer; the submenuItems appear in the megamenu
        {
            id: 'libraryServices',
            dataTestid: 'connect-services-link',
            linkTo: 'https://web.library.uq.edu.au/library-services',
            primaryText: 'Library services',
            submenuItems: [
                {
                    primaryText: 'for Students',
                    secondaryText: 'Reading lists, past exams ...',
                    linkTo: 'https://web.library.uq.edu.au/library-services/services-for-students',
                    column: 1,
                },
                {
                    primaryText: 'for Researchers',
                    secondaryText: 'Data, impact, publishing support',
                    linkTo: 'https://web.library.uq.edu.au/library-services/services-for-researchers',
                    column: 1,
                },
                {
                    primaryText: 'for HDR students',
                    secondaryText: 'Research support, training, tools',
                    linkTo: 'https://web.library.uq.edu.au/library-services/services-higher-degree-by-research',
                    column: 1,
                },
                {
                    primaryText: 'for Teaching staff',
                    secondaryText: 'Reading lists, Blackboard links ...',
                    linkTo: 'https://web.library.uq.edu.au/library-services/services-for-teaching-staff',
                    column: 1,
                },
                {
                    primaryText: 'for Professional staff',
                    secondaryText: 'Access, training, borrowing',
                    linkTo: 'https://web.library.uq.edu.au/library-services/services-for-professional-staff',
                    column: 1,
                },
                {
                    primaryText: 'for Hospital staff',
                    secondaryText: 'Membership, literature search',
                    linkTo: 'https://web.library.uq.edu.au/library-services/services-for-hospital-staff',
                    column: 1,
                },
                {
                    primaryText: 'for UQ alumni',
                    secondaryText: 'Membership, resources',
                    linkTo: 'https://web.library.uq.edu.au/library-services/services-for-uq-alumni',
                    column: 1,
                },
                {
                    primaryText: 'for Community',
                    secondaryText: 'Public access & services',
                    linkTo: 'https://web.library.uq.edu.au/library-services/services-for-community',
                    column: 1,
                },
                {
                    primaryText: 'for Secondary schools',
                    linkTo: 'https://web.library.uq.edu.au/library-services/services-for-secondary-schools',
                    column: 1,
                },
                {
                    primaryText: 'for Clients with disabilities',
                    secondaryText: 'Accessibility, assistive technology',
                    linkTo: 'https://web.library.uq.edu.au/library-services/support-for-clients-disabilities',
                    column: 1,
                },
                {
                    primaryText: 'for Other libraries',
                    secondaryText: 'Document supply, off-air recordings',
                    linkTo: 'https://web.library.uq.edu.au/library-services/for-other-libraries',
                    column: 1,
                },
                {
                    primaryText: 'COVID-19',
                    secondaryText: 'Latest updates and service info',
                    linkTo: 'https://web.library.uq.edu.au/library-services/covid-19',
                    column: 2,
                },
                {
                    primaryText: 'Your librarian',
                    secondaryText: 'Expert advice for your discipline',
                    linkTo: 'https://web.library.uq.edu.au/library-services/liaison-librarians',
                    column: 2,
                },
                {
                    primaryText: 'Book a room',
                    secondaryText: 'Student meeting and study rooms',
                    linkTo: 'https://uqbookit.uq.edu.au/#/app/booking-types/77b52dde-d704-4b6d-917e-e820f7df07cb',
                    column: 2,
                },
                {
                    primaryText: 'Training',
                    secondaryText: 'Online & in-person classes',
                    linkTo: 'https://web.library.uq.edu.au/library-services/training',
                    column: 2,
                },
                {
                    primaryText: 'I.T.',
                    secondaryText: 'Printing, WiFi, available computers',
                    linkTo: 'https://web.library.uq.edu.au/library-services/it',
                    column: 2,
                },
                {
                    primaryText: 'Copyright advice',
                    secondaryText: 'For teaching, research, publishing ...',
                    linkTo: 'https://web.library.uq.edu.au/library-services/copyright-advice',
                    column: 2,
                },
                {
                    primaryText: 'Digitisation',
                    secondaryText: 'Convert material to digital format',
                    linkTo: 'https://web.library.uq.edu.au/library-services/digitisation',
                    column: 2,
                },
                {
                    primaryText: 'Special collections',
                    secondaryText: 'Search, request, access & copy',
                    linkTo: 'https://web.library.uq.edu.au/library-services/special-collections',
                    column: 2,
                },
            ],
        },
        {
            id: 'researchToolsTechniques',
            dataTestid: 'connect-research-link',
            linkTo: 'https://web.library.uq.edu.au/research-tools-techniques',
            primaryText: 'Research tools & techniques',
            submenuItems: [
                {
                    primaryText: 'Library Search',
                    secondaryText: 'What it is & how to use it',
                    linkTo: 'https://web.library.uq.edu.au/research-tools-techniques/library-search',
                    column: 1,
                },
                {
                    primaryText: 'Databases',
                    secondaryText: 'Browse or search by title',
                    linkTo: 'https://search.library.uq.edu.au/primo-explore/dbsearch?vid=61UQ',
                    column: 1,
                },
                {
                    primaryText: 'Google Scholar',
                    secondaryText: 'Enhanced access via the Library',
                    linkTo: 'https://web.library.uq.edu.au/research-tools-techniques/google-scholar',
                    column: 1,
                },
                {
                    primaryText: 'UQ eSpace',
                    secondaryText: 'Archive of UQ research & more',
                    linkTo: 'https://espace.library.uq.edu.au/',
                    column: 1,
                },
                {
                    primaryText: 'Fryer Manuscripts',
                    secondaryText: 'Search our unpublished collections',
                    linkTo: 'https://manuscripts.library.uq.edu.au/',
                    column: 1,
                },
                {
                    primaryText: 'Off-campus access',
                    secondaryText: 'Access full-text from anywhere',
                    linkTo: 'https://web.library.uq.edu.au/research-tools-techniques/campus-access',
                    column: 1,
                },
                {
                    primaryText: 'Search techniques',
                    secondaryText: 'Find the results you need',
                    linkTo: 'https://web.library.uq.edu.au/research-tools-techniques/search-techniques',
                    column: 2,
                },
                {
                    primaryText: 'Subject guides',
                    secondaryText: 'Law, medicine, management ...',
                    linkTo: 'https://guides.library.uq.edu.au/subject',
                    column: 2,
                },
                {
                    primaryText: 'Referencing style guides',
                    secondaryText: 'APA, AGLC, Harvard, Chicago ...',
                    linkTo: 'https://guides.library.uq.edu.au/referencing',
                    column: 2,
                },
                {
                    primaryText: 'EndNote referencing software',
                    secondaryText: 'Download and support',
                    linkTo: 'https://web.library.uq.edu.au/research-tools-techniques/endnote-referencing-software',
                    column: 2,
                },
                {
                    primaryText: 'Digital Essentials',
                    secondaryText: 'Build your digital & assignment skills',
                    linkTo: 'https://web.library.uq.edu.au/research-tools-techniques/digital-essentials',
                    column: 2,
                },
                {
                    primaryText: 'Digital Researcher Lab',
                    secondaryText: 'Projects, tools and support',
                    linkTo: 'https://web.library.uq.edu.au/research-tools-techniques/digital-researcher-lab',
                    column: 2,
                },
            ],
        },
        {
            id: 'collections',
            dataTestid: 'connect-collections-link',
            linkTo: 'https://web.library.uq.edu.au/collections',
            primaryText: 'Collections',
            submenuItems: [
                {
                    primaryText: 'Collection strength',
                    linkTo: 'https://web.library.uq.edu.au/collections/collection-strength',
                },
                {
                    primaryText: 'Stories from the collection',
                    linkTo: 'https://web.library.uq.edu.au/collections/stories-from-collection',
                },
                {
                    primaryText: 'Cultural & heritage collections',
                    linkTo: 'https://web.library.uq.edu.au/collections/cultural-heritage-collections',
                },
                {
                    primaryText: 'Collection management',
                    linkTo: 'https://web.library.uq.edu.au/collections/collection-management',
                },
                {
                    primaryText: 'UQ Archives',
                    linkTo: 'https://web.library.uq.edu.au/collections/university-queensland-archives',
                },
            ],
        },
        {
            id: 'borrowingRequesting',
            dataTestid: 'connect-borrowing-link',
            linkTo: 'https://web.library.uq.edu.au/borrowing-requesting',
            primaryText: 'Borrowing & requesting',
            submenuItems: [
                {
                    primaryText: 'View your loans & requests',
                    linkTo:
                        'https://search.library.uq.edu.au/primo-explore/account?vid=61UQ&section=overview&lang=en_US',
                    column: 1,
                },
                {
                    primaryText: 'How to borrow',
                    secondaryText: 'Rules, finding items, returning',
                    linkTo: 'https://web.library.uq.edu.au/borrowing-requesting/how-to-borrow',
                    column: 1,
                },
                {
                    primaryText: 'Borrowing rules',
                    linkTo: 'https://web.library.uq.edu.au/borrowing-requesting/how-borrow/borrowing-rules',
                    column: 1,
                },
                {
                    primaryText: 'Overdue items',
                    linkTo: 'https://web.library.uq.edu.au/borrowing-requesting/overdue-items',
                    secondaryText: 'Pay library fines',
                    column: 1,
                },
                {
                    primaryText: 'Request items',
                    secondaryText: 'On loan, off-campus, or not at UQ',
                    linkTo: 'https://web.library.uq.edu.au/borrowing-requesting/request-items',
                    column: 2,
                },
                {
                    primaryText: 'Request document delivery',
                    linkTo: 'https://web.library.uq.edu.au/borrowing-requesting/request-document-delivery',
                    column: 2,
                },
                {
                    primaryText: 'Request a purchase',
                    linkTo: 'https://web.library.uq.edu.au/borrowing-requesting/request-purchase',
                    column: 2,
                },
            ],
        },
        {
            id: 'locationsHours',
            dataTestid: 'connect-locations-link',
            linkTo: 'https://web.library.uq.edu.au/locations-hours',
            primaryText: 'Locations & hours',
            shiftLeft: true,
            submenuItems: [
                {
                    primaryText: 'Opening hours',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/opening-hours',
                    column: 1,
                },
                {
                    primaryText: 'Study space availability',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/study-space-availability',
                    column: 1,
                },
                {
                    primaryText: '24/7 spaces',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/247-study-spaces',
                    column: 1,
                },
                {
                    primaryText: 'Lost or stolen property',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/lost-or-stolen-property',
                    column: 1,
                },
                {
                    primaryText: 'Using & sharing library spaces',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/using-and-sharing-your-library-spaces',
                    column: 1,
                },
                {
                    primaryText: 'Lockers',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/lockers',
                    column: 1,
                },
                {
                    primaryText: 'Architecture & Music',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/architecture-music-library',
                    column: 2,
                },
                {
                    primaryText: 'Biological Sciences',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/biological-sciences-library',
                    column: 2,
                },
                {
                    primaryText: 'Central Library',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/central-library',
                    column: 2,
                },
                {
                    primaryText: 'Duhig Tower',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/duhig-tower',
                    column: 2,
                },
                {
                    primaryText: 'DH Engineering & Sciences',
                    linkTo:
                        'https://web.library.uq.edu.au/locations-hours/dorothy-hill-engineering-and-sciences-library',
                    column: 2,
                },
                {
                    primaryText: 'FW Robinson Reading Room',
                    secondaryText: 'Fryer Library & UQ Archives',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/fw-robinson-reading-room',
                    column: 2,
                },
                {
                    primaryText: 'Gatton',
                    secondaryText: 'JK Murray Library',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/uq-gatton-library-jk-murray-library',
                    column: 2,
                },
                {
                    primaryText: 'Herston Health Sciences',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/herston-health-sciences-library',
                    column: 3,
                },
                {
                    primaryText: 'Law',
                    secondaryText: 'Walter Harrison Library',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/law-library-walter-harrison-library',
                    column: 3,
                },
                {
                    primaryText: 'UQ/Mater McAuley Library',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/uqmater-mcauley-library',
                    column: 3,
                },
                {
                    primaryText: 'PACE Health Sciences',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/pace-health-sciences-library',
                    column: 3,
                },
                {
                    primaryText: 'Rural Clinical School',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/rural-clinical-school-rcs-library',
                    column: 3,
                },
                {
                    primaryText: 'Warehouse',
                    linkTo: 'https://web.library.uq.edu.au/locations-hours/warehouse',
                    column: 3,
                },
            ],
        },
        {
            id: 'about',
            dataTestid: 'connect-about-link',
            linkTo: 'https://web.library.uq.edu.au/about-us',
            primaryText: 'About',
            shiftLeft: true,
            submenuItems: [
                {
                    primaryText: 'Blog',
                    linkTo: 'https://web.library.uq.edu.au/blog',
                    column: 1,
                },
                {
                    primaryText: 'Events',
                    linkTo: 'https://web.library.uq.edu.au/about-us/events',
                    column: 1,
                },
                {
                    primaryText: 'Friends of the Library',
                    linkTo: 'https://web.library.uq.edu.au/about-us/friends-library',
                    column: 1,
                },
                {
                    primaryText: 'Membership',
                    linkTo: 'https://web.library.uq.edu.au/about-us/membership',
                    column: 1,
                },
                {
                    primaryText: 'Projects',
                    linkTo: 'https://web.library.uq.edu.au/about-us/projects',
                    column: 1,
                },
                {
                    primaryText: 'History of the Library',
                    linkTo: 'https://web.library.uq.edu.au/about-us/history-library',
                    column: 1,
                },
                {
                    primaryText: 'Give to the Library',
                    linkTo: 'https://alumni.uq.edu.au/uq-library',
                    column: 1,
                },
                {
                    primaryText: 'Library tours',
                    linkTo: 'https://web.library.uq.edu.au/about-us/library-tours',
                    column: 2,
                },
                {
                    primaryText: 'Organisational structure',
                    linkTo: 'https://web.library.uq.edu.au/about-us/organisational-structure',
                    column: 2,
                },
                {
                    primaryText: 'Policies & guidelines',
                    linkTo: 'https://web.library.uq.edu.au/about-us/policies-guidelines',
                    column: 2,
                },
                {
                    primaryText: 'Reports & publications',
                    linkTo: 'https://web.library.uq.edu.au/about-us/reports-and-publications',
                    column: 2,
                },
                {
                    primaryText: 'Employment',
                    linkTo: 'https://web.library.uq.edu.au/about-us/employment',
                    column: 2,
                },
                {
                    primaryText: 'Awards & fellowships',
                    linkTo: 'https://web.library.uq.edu.au/about-us/awards-fellowships',
                    column: 2,
                },
                {
                    primaryText: 'Mission',
                    linkTo: 'https://web.library.uq.edu.au/about-us/mission',
                    column: 2,
                },
            ],
        },
        {
            id: 'contactUs',
            dataTestid: 'connect-contact-link',
            linkTo: 'https://web.library.uq.edu.au/contact-us',
            primaryText: 'Contact us',
        },
    ],
};
