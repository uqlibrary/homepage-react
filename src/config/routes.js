import { locale } from 'locale';
import { seeCourseResources, seeAlertsAdmin } from 'helpers/access';

export const fullPath = process.env.FULL_PATH || 'https://homepage-staging.library.uq.edu.au';

export const adminEditRegexConfig = new RegExp(/\/admin\/alerts\/edit\/(.*)/i);

export const pathConfig = {
    index: '/',
    secureCollection: '/collection',
    courseresources: '/courseresources',
    paymentReceipt: '/payment-receipt',
    admin: {
        alertsadd: '/admin/alerts/add',
        alertsedit: alertid => `/admin/alerts/edit/${alertid}`,
        alerts: '/admin/alerts',
        masquerade: '/admin/masquerade',
    },
    bookExamBooth: '/book-exam-booth',
    help: 'https://guides.library.uq.edu.au/for-researchers/research-publications-guide',
};

// a duplicate list of routes for checking validity easily
export const flattedPathConfig = [
    '/',
    '/collection',
    '/courseresources',
    '/payment-receipt',
    '/admin/alerts/add',
    '/admin/alerts/edit',
    '/admin/alerts',
    '/admin/masquerade',
    '/book-exam-booth',
    'https://www.library.uq.edu.au/404.js',
];

// TODO: will we even have roles?
export const roles = {
    admin: 'admin',
};

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
            // some collections are public and some arent - let the app decide
            path: pathConfig.secureCollection,
            component: components.SecureCollection,
            exact: true,
            pageTitle: locale.pages.secureCollection.title,
        },
        {
            path: pathConfig.bookExamBooth,
            component: components.BookExamBooth,
            exact: false,
            pageTitle: locale.pages.bookExamBooth.title,
        },
    ];

    const courseResoures = [
        {
            path: pathConfig.courseresources,
            component: components.CourseResources,
            exact: true,
            pageTitle: locale.pages.courseresources.title,
        },
    ];

    const alertsListDisplay = [
        {
            path: pathConfig.admin.alerts,
            component: components.AlertsList,
            exact: true,
            pageTitle: locale.pages.admin.alerts.title,
        },
    ];

    const alertAddDisplay = [
        {
            path: pathConfig.admin.alertsadd,
            component: components.AlertsAdd,
            exact: true,
            pageTitle: locale.pages.admin.alerts.title,
        },
    ];

    const alertidRegExp = '.*';
    const alertid = `:alertid(${alertidRegExp})`;
    const alertEditForm = [
        {
            path: pathConfig.admin.alertsedit(alertid),
            component: components.AlertsEdit,
            // exact: true,
            pageTitle: locale.pages.admin.alerts.title,
            regExPath: pathConfig.admin.alertsedit(`(${alertidRegExp})`),
        },
    ];

    const masqueradeDisplay = [
        {
            path: pathConfig.admin.masquerade,
            component: components.Masquerade,
            exact: true,
            access: [roles.admin],
            pageTitle: locale.pages.admin.masquerade.title,
        },
    ];

    return [
        ...publicPages,
        ...(account && seeCourseResources(account) ? courseResoures : []),
        ...(account && seeAlertsAdmin(account) ? alertAddDisplay : []),
        ...(account && seeAlertsAdmin(account) ? alertEditForm : []),
        ...(account && seeAlertsAdmin(account) ? alertsListDisplay : []),
        ...(account && account.canMasquerade ? masqueradeDisplay : []),
        {
            component: components.NotFound,
        },
    ];
};
