// webpack configuration for prod/staging/dev builds
const deployment = {
    development: {
        url: branch => `https://homepage-development.library.uq.edu.au/${branch}/#/`,
        fullPath: branch => `https://homepage-development.library.uq.edu.au/${branch}/#`,
        api: 'https://api.library.uq.edu.au/staging/',
        auth_login: 'https://auth.library.uq.edu.au/login',
        auth_logout: 'https://auth.library.uq.edu.au/logout',
        gtm: 'GTM-PNKNTSQ',
        title: 'UQ Library (DEVELOPMENT)',
        short_name: 'Library',
        titleSuffix: 'Development',
        environment: 'development',
        basePath: '',
        publicPath: '',
        reusablejs:
            'https://assets.library.uq.edu.au/reusable-webcomponents-development/feature-leadegroot/uq-lib-reusable.min.js', // dev
        // reusablejs: 'https://assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js',
    },
    staging: {
        url: () => 'https://homepage-staging.library.uq.edu.au/',
        fullPath: () => 'https://homepage-staging.library.uq.edu.au',
        api: 'https://api.library.uq.edu.au/staging/',
        auth_login: 'https://auth.library.uq.edu.au/login',
        auth_logout: 'https://auth.library.uq.edu.au/logout',
        gtm: 'GTM-PNKNTSQ',
        title: 'UQ Library (STAGING)',
        short_name: 'Library',
        titleSuffix: 'Staging',
        environment: 'staging',
        basePath: '',
        publicPath: '/',
        reusablejs: 'http://assets.library.uq.edu.au/reusable-webcomponents-staging/uq-lib-reusable.min.js',
    },
    production: {
        url: () => 'https://homepage-production.library.uq.edu.au/',
        fullPath: () => 'https://homepage-production.library.uq.edu.au',
        api: 'https://api.library.uq.edu.au/v1/',
        auth_login: 'https://auth.library.uq.edu.au/login',
        auth_logout: 'https://auth.library.uq.edu.au/logout',
        gtm: 'GTM-PX9H7R',
        title: 'UQ Library',
        short_name: 'Library',
        titleSuffix: '',
        environment: 'production',
        basePath: '',
        publicPath: '/',
        reusablejs: 'https://assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js',
    },
};

exports.default = deployment;
