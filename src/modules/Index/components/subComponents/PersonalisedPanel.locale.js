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
            label: 'Manage your print balance ($[balance])',
            tooltip: 'Click to manage your print balance',
            url: 'https://lib-print.library.uq.edu.au:9192/user',
            topup:
                'https://payments.uq.edu.au/OneStopWeb/aspx/TranAdd.aspx?TRAN-TYPE=W361&username=[id]&unitamountinctax=[value]&email=[email]',
        },
        loans: {
            label: 'Manage your library loans ([loans])',
            tooltip: 'Click to manage your library loans',
            url: 'https://search.library.uq.edu.au/primo-explore/account?vid=61UQ&section=loans&lang=en_US',
        },
        fines: {
            label: 'Manage your library fines ($[fines])',
            tooltip: 'Click to manage your library fines',
            url: 'https://search.library.uq.edu.au/primo-explore/account?vid=61UQ&section=fines&lang=en_US',
        },
        roomBookings: {
            label: 'Manage your room bookings',
            tooltip: 'Click to manage your room bookings',
            url: 'https://uqbookit.uq.edu.au/#/app/booking-types/77b52dde-d704-4b6d-917e-e820f7df07cb',
        },
    },
};
