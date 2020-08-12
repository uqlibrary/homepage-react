// webpack configuration for prod/staging/dev builds
const deployment = {
    development: {
        url: branch => `https://development.library.uq.edu.au/homepage/${branch}/#/`,
        fullPath: branch => `https://development.library.uq.edu.au/homepage/${branch}/#`,
        api: 'https://api.library.uq.edu.au/staging/',
        auth_login: 'https://fez-staging.library.uq.edu.au/login.php',
        auth_logout: 'https://auth.library.uq.edu.au/logout',
        gtm: 'GTM-K597ZS',
        title: 'UQ Library (DEVELOPMENT)',
        short_name: 'Library',
        titleSuffix: 'Development',
        environment: 'development',
        basePath: 'espace/', // updated in webpack
        publicPath: '',
    },
    staging: {
        url: () => 'https://fez-staging.library.uq.edu.au/',
        fullPath: () => 'https://fez-staging.library.uq.edu.au',
        api: 'https://api.library.uq.edu.au/staging/',
        auth_login: 'https://fez-staging.library.uq.edu.au/login.php',
        auth_logout: 'https://auth.library.uq.edu.au/logout',
        gtm: 'GTM-K597ZS',
        title: 'UQ Library (STAGING)',
        short_name: 'Library',
        titleSuffix: 'Staging',
        environment: 'staging',
        basePath: '',
        publicPath: '/',
    },
    production: {
        url: () => 'https://espace.library.uq.edu.au/',
        fullPath: () => 'https://espace.library.uq.edu.au',
        api: 'https://api.library.uq.edu.au/v1/',
        auth_login: 'https://espace.library.uq.edu.au/login.php',
        auth_logout: 'https://auth.library.uq.edu.au/logout',
        gtm: 'GTM-T4NPC25',
        title: 'UQ Library',
        short_name: 'Library',
        titleSuffix: '',
        environment: 'production',
        basePath: '',
        publicPath: '/',
    },
};

exports.default = deployment;
