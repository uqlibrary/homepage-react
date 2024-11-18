export const ppLocale = {
    greetings: {
        morning: 'Good morning',
        afternoon: 'Good afternoon',
        evening: 'Good evening',
    },
    username: 'Your UQ username is [id]',
    unavailable: 'unavailable',
    items: {
        papercut: {
            label: 'Manage your print balance [balance]',
            tooltip: 'Click to manage your print balance',
            topup: '[origin]/papercut/top-up?amount=[value]',
        },
        loans: {
            label: 'Manage your library loans [loans]',
            tooltip: 'Click to manage your library loans',
            url: 'https://search.library.uq.edu.au/primo-explore/account?vid=61UQ&section=loans&lang=en_US',
        },
        fines: {
            label: 'Manage your library fines ($[fines])',
            tooltip: 'Click to manage your library fines',
            url: 'https://search.library.uq.edu.au/primo-explore/account?vid=61UQ&section=fines&lang=en_US',
        },
        eSpacePossible: {
            label: 'Claim [totalRecords] UQ eSpace records',
            tooltip: 'Click to visit your UQ eSpace dashboard',
            url: 'https://espace.library.uq.edu.au/records/possible',
        },
        eSpaceOrcid: {
            label: 'Link ORCiD account to UQ eSpace',
            tooltip: 'Click to visit UQ eSpace to link/create your ORCID account',
            url: 'https://espace.library.uq.edu.au/author-identifiers/orcid/link',
        },
        eSpaceNTRO: {
            label: 'Complete [total] NTRO records in UQ eSpace',
            tooltip: 'Click to visit UQ eSpace to complete these NTRO records',
            url: 'https://espace.library.uq.edu.au/records/incomplete',
        },
    },
};
