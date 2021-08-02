import { locale } from 'locale';
import { seeCourseResources, seeAlertsAdmin } from 'helpers/access';

export const fullPath = process.env.FULL_PATH || 'https://homepage-staging.library.uq.edu.au';

export const adminEditRegexConfig = new RegExp(/\/admin\/alerts\/edit\/(.*)/i);

export const pathConfig = {
    index: '/',
    courseresources: '/courseresources',
    paymentReceipt: '/payment-receipt',
    admin: {
        alertsadd: '/admin/alerts/add',
        alertsedit: alertid => `/admin/alerts/edit/${alertid}`,
        alertsclone: alertid => `/admin/alerts/clone/${alertid}`,
        alertsview: alertid => `/admin/alerts/view/${alertid}`,
        alerts: '/admin/alerts',
        masquerade: '/admin/masquerade',
    },
    bookExamBooth: '/book-exam-booth',
    help: 'https://guides.library.uq.edu.au/for-researchers/research-publications-guide',
};

// a duplicate list of routes for checking validity easily
export const flattedPathConfig = [
    '/',
    '/courseresources',
    '/payment-receipt',
    '/admin/alerts/add',
    '/admin/alerts/edit',
    '/admin/alerts/clone',
    '/admin/alerts/view',
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
            pageTitle: locale.pages.admin.alerts.form.add.title,
        },
    ];

    const alertidRegExp = '.*';
    const alertid = `:alertid(${alertidRegExp})`;
    const alertEditForm = [
        {
            path: pathConfig.admin.alertsedit(alertid),
            component: components.AlertsEdit,
            // exact: true,
            pageTitle: locale.pages.admin.alerts.form.edit.title,
            regExPath: pathConfig.admin.alertsedit(`(${alertidRegExp})`),
        },
    ];

    const alertCloneForm = [
        {
            path: pathConfig.admin.alertsclone(alertid),
            component: components.AlertsClone,
            // exact: true,
            pageTitle: locale.pages.admin.alerts.form.clone.title,
            regExPath: pathConfig.admin.alertsedit(`(${alertidRegExp})`),
        },
    ];

    const alertView = [
        {
            path: pathConfig.admin.alertsview(alertid),
            component: components.AlertsView,
            // exact: true,
            pageTitle: locale.pages.admin.alerts.form.view.title,
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
        ...(account && seeAlertsAdmin(account) ? alertCloneForm : []),
        ...(account && seeAlertsAdmin(account) ? alertView : []),
        ...(account && seeAlertsAdmin(account) ? alertsListDisplay : []),
        ...(account && account.canMasquerade ? masqueradeDisplay : []),
        {
            component: components.NotFound,
        },
    ];
};
