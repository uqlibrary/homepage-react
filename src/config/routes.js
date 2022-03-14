import { locale } from 'locale';
import { isAlertsAdminUser, canSeeLearningResources, isSpotlightsAdminUser } from 'helpers/access';

export const fullPath = process.env.FULL_PATH || 'https://homepage-staging.library.uq.edu.au';

export const adminEditRegexConfig = new RegExp(/\/admin\/alerts\/edit\/(.*)/i);

export const pathConfig = {
    index: '/',
    learningresources: '/learning-resources',
    paymentReceipt: '/payment-receipt',
    admin: {
        alertsadd: '/admin/alerts/add',
        alertsedit: alertid => `/admin/alerts/edit/${alertid}`,
        alertsclone: alertid => `/admin/alerts/clone/${alertid}`,
        alertsview: alertid => `/admin/alerts/view/${alertid}`,
        alerts: '/admin/alerts',
        masquerade: '/admin/masquerade',
        spotlightsadd: '/admin/spotlights/add',
        spotlightsedit: spotlightid => `/admin/spotlights/edit/${spotlightid}`,
        spotlightsview: spotlightid => `/admin/spotlights/view/${spotlightid}`,
        spotlightsclone: spotlightid => `/admin/spotlights/clone/${spotlightid}`,
        spotlights: '/admin/spotlights',
    },
    bookExamBooth: '/book-exam-booth',
    pastExamPaperSearch: '/exams',
    help: 'https://guides.library.uq.edu.au/for-researchers/research-publications-guide',
};

// a duplicate list of routes for checking validity easily, 2 sets: exact match and startswith
export const flattedPathConfigExact = [
    '/',
    '/learning-resources',
    '/payment-receipt',
    '/admin/alerts/add',
    '/admin/alerts',
    '/admin/masquerade',
    '/admin/masquerade/',
    '/admin/spotlights/add',
    '/admin/spotlights',
    '/book-exam-booth',
    '/exams',
    '/exams/',
    'https://www.library.uq.edu.au/404.js',
];
export const flattedPathConfig = [
    '/admin/alerts/edit',
    '/admin/alerts/clone',
    '/admin/alerts/view',
    '/admin/spotlights/edit',
    '/admin/spotlights/view',
    '/admin/spotlights/clone',
    '/exams/',
];

export const getRoutesConfig = ({ components = {}, account = null }) => {
    const publicPages = [
        {
            path: pathConfig.index,
            component: components.Index,
            exact: true,
            pageTitle: locale.pages.index.title,
        },
        {
            path: pathConfig.paymentReceipt,
            component: components.PaymentReceipt,
            exact: true,
            pageTitle: locale.pages.paymentReceipt.title,
        },
        {
            path: pathConfig.bookExamBooth,
            component: components.BookExamBooth,
            exact: false,
            pageTitle: locale.pages.bookExamBooth.title,
        },
        {
            path: pathConfig.pastExamPaperSearch,
            component: components.PastExamPaperSearch,
            exact: false,
            pageTitle: locale.pages.pastExamPaperSearch.title,
        },
    ];

    const courseResoures = [
        {
            path: pathConfig.learningresources,
            component: components.LearningResources,
            exact: true,
            pageTitle: locale.pages.learningresources.title,
        },
    ];

    const alertidRegExp = '.*';
    const alertid = `:alertid(${alertidRegExp})`;
    const alertsDisplay = [
        {
            path: pathConfig.admin.alerts,
            component: components.AlertsList,
            exact: true,
            pageTitle: locale.pages.admin.alerts.title,
        },
        {
            path: pathConfig.admin.alertsadd,
            component: components.AlertsAdd,
            exact: true,
            pageTitle: locale.pages.admin.alerts.form.add.title,
        },
        {
            path: pathConfig.admin.alertsedit(alertid),
            component: components.AlertsEdit,
            pageTitle: locale.pages.admin.alerts.form.edit.title,
        },
        {
            path: pathConfig.admin.alertsclone(alertid),
            component: components.AlertsClone,
            pageTitle: locale.pages.admin.alerts.form.clone.title,
        },
        {
            path: pathConfig.admin.alertsview(alertid),
            component: components.AlertsView,
            pageTitle: locale.pages.admin.alerts.form.view.title,
        },
    ];

    const masqueradeDisplay = [
        {
            path: pathConfig.admin.masquerade,
            component: components.Masquerade,
            exact: true,
            pageTitle: locale.pages.admin.masquerade.title,
        },
    ];

    const spotlightidRegExp = '.*';
    const spotlightid = `:spotlightid(${spotlightidRegExp})`;
    const spotlightsDisplay = [
        {
            path: pathConfig.admin.spotlights,
            component: components.SpotlightsList,
            exact: true,
            pageTitle: locale.pages.admin.spotlights.title,
        },
        {
            path: pathConfig.admin.spotlightsadd,
            component: components.SpotlightsAdd,
            exact: true,
            pageTitle: locale.pages.admin.spotlights.form.add.title,
        },
        {
            path: pathConfig.admin.spotlightsedit(spotlightid),
            component: components.SpotlightsEdit,
            pageTitle: locale.pages.admin.spotlights.form.edit.title,
        },
        {
            path: pathConfig.admin.spotlightsclone(spotlightid),
            component: components.SpotlightsClone,
            pageTitle: locale.pages.admin.spotlights.form.clone.title,
        },
        {
            path: pathConfig.admin.spotlightsview(spotlightid),
            component: components.SpotlightsView,
            pageTitle: locale.pages.admin.spotlights.form.view.title,
        },
    ];

    return [
        ...publicPages,
        ...(account && canSeeLearningResources(account) ? courseResoures : []),
        ...(account && isAlertsAdminUser(account) ? alertsDisplay : []),
        ...(account && account.canMasquerade ? masqueradeDisplay : []),
        ...(account && isSpotlightsAdminUser(account) ? spotlightsDisplay : []),
        {
            component: components.NotFound,
        },
    ];
};
