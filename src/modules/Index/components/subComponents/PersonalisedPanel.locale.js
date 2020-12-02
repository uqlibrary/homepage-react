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
            url: 'https://lib-print.library.uq.edu.au:9192/user',
            topup:
                'https://payments.uq.edu.au/OneStopWeb/aspx/TranAdd.aspx?TRAN-TYPE=W361&username=[id]&unitamountinctax=[value]&email=[email]',
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
            label: 'Possible records in eSpace to claim ([totalRecords])',
            tooltip: 'Click to visit your eSpace dashboard',
            url: 'https://espace.library.uq.edu.au/dashboard',
        },
        eSpaceOrcid: {
            label: 'ORCID account not linked to eSpace',
            tooltip: 'Click to visit eSpace to link/create your ORCID account',
            url: 'https://espace.library.uq.edu.au/author-identifiers/orcid/link',
        },
        eSpaceNTRO: {
            label: 'Incomplete NTRO records in eSpace ([total])',
            tooltip: 'Click to visit eSpace to complete these NTRO records',
            url: 'https://espace.library.uq.edu.au/records/incomplete',
        },
    },
};
