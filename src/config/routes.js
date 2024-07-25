import { locale } from 'locale';
import { canSeeLearningResources, isAlertsAdminUser, isDlorAdminUser, isTestTagAdminUser } from 'helpers/access';
import { pathConfig } from './pathConfig';

export const fullPath = process.env.FULL_PATH || 'https://homepage-staging.library.uq.edu.au';

export const adminEditRegexConfig = new RegExp(/\/admin\/alerts\/edit\/(.*)/i);

// a duplicate list of routes for checking validity easily, 2 sets: exact match and startswith
export const flattedPathConfigExact = [
    '/',
    '/learning-resources',
    '/payment-receipt',
    '/admin/alerts/add',
    '/admin/alerts',
    '/admin/dlor',
    '/admin/dlor/add',
    '/admin/dlor/series/manage',
    '/admin/dlor/team/manage',
    '/admin/dlor/team/add',
    '/admin/masquerade',
    '/admin/masquerade/',
    '/admin/testntag',
    '/admin/testntag/manage/users',
    '/admin/testntag/manage/assettypes',
    '/admin/testntag/manage/locations',
    '/admin/testntag/manage/inspectiondevices',
    '/admin/testntag/manage/bulkassetupdate',
    '/admin/testntag/manage/inspectiondetails',
    '/admin/testntag/report/recalibrationsdue',
    '/admin/testntag/report/inspectionsdue',
    '/admin/testntag/report/assetsbyfilter',
    '/admin/testntag/report/inspectionsbylicenceduser',
    '/book-exam-booth',
    '/exams',
    '/exams/',
    '/digital-learning-hub',
    'https://www.library.uq.edu.au/404.js',
];
export const flattedPathConfig = [
    '/admin/alerts/edit',
    '/admin/alerts/clone',
    '/admin/alerts/view',
    '/admin/dlor/edit',
    '/admin/dlor/series/edit',
    '/admin/dlor/team/edit',
    '/digital-learning-hub/view',
    '/digital-learning-hub/confirm/subscribe',
    '/digital-learning-hub/confirm/unsubscribe',
    '/exams/course',
];

export const getRoutesConfig = ({ components = {}, account = null }) => {
    const standardRegExp = '.*';
    const examSearchCourseHint = `:courseHint(${standardRegExp})`;

    const dlorId = `:dlorId(${standardRegExp})`;
    const confirmationId = `:confirmationId(${standardRegExp})`;

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
            path: pathConfig.dlorView(dlorId),
            component: components.DLOView,
            pageTitle: 'Digital Learning Object Repository - View Object',
        },
        {
            path: pathConfig.dlorHome,
            component: components.DLOList,
            exact: true,
            pageTitle: 'Digital Learning Object Repository',
        },
        {
            path: pathConfig.dlorSubscriptionConfirmation(confirmationId),
            component: components.DLOConfirmSubscription,
            // exact: true,
            pageTitle: 'Digital Learning Object Repository - Confirm Subscription request',
        },
        {
            path: pathConfig.dlorUnsubscribe(confirmationId),
            component: components.DLOConfirmUnsubscription,
            // exact: true,
            pageTitle: 'Digital Learning Object Repository - Confirm Unsubscription request',
        },
        {
            path: pathConfig.pastExamPaperList(examSearchCourseHint),
            component: components.PastExamPaperList,
            pageTitle: locale.pages.pastExamPaperList.title,
        },
        {
            path: pathConfig.pastExamPaperSearch,
            component: components.PastExamPaperSearch,
            exact: false,
            pageTitle: locale.pages.pastExamPaperSearch.title,
        },
    ];

    const courseResourcesDisplay = [
        {
            path: pathConfig.learningresources,
            component: components.LearningResources,
            exact: true,
            pageTitle: locale.pages.learningresources.title,
        },
    ];

    const alertid = `:alertid(${standardRegExp})`;
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

    const dlorTeamId = `:dlorTeamId(${standardRegExp})`;
    const dlorSeriesId = `:dlorSeriesId(${standardRegExp})`;
    const dlorAdminDisplay = [
        {
            path: pathConfig.admin.dloradmin,
            component: components.DLOAdminHomepage,
            exact: true,
            pageTitle: 'Manage the Digital Learning Hub',
        },
        {
            path: pathConfig.admin.dloradd,
            component: components.DLOAdd,
            exact: true,
            pageTitle: 'Create a new Object',
        },
        {
            path: pathConfig.admin.dloredit(dlorId),
            component: components.DLOEdit,
            exact: true,
            pageTitle: 'Edit an Object',
        },
        {
            path: pathConfig.admin.dlorteammanage,
            component: components.DLOTeamList,
            exact: true,
            pageTitle: 'Manage Teams for the Digital Learning Hub',
        },
        {
            path: pathConfig.admin.dlorteamedit(dlorTeamId),
            component: components.DLOTeamEdit,
            exact: true,
            pageTitle: 'Edit a Team for the Digital Learning Hub',
        },
        {
            path: pathConfig.admin.dlorteamadd,
            component: components.DLOTeamAdd,
            exact: true,
            pageTitle: 'Create a new Team',
        },
        {
            path: pathConfig.admin.dlorseriesmanage,
            component: components.DLOSeriesList,
            exact: true,
            pageTitle: 'Manage Series for the Digital Learning Hub',
        },
        {
            path: pathConfig.admin.dlorseriesedit(dlorSeriesId),
            component: components.DLOSeriesEdit,
            exact: true,
            pageTitle: 'Edit a Series for the Digital Learning Hub',
        },
    ];

    const testntagDisplay = [
        {
            path: pathConfig.admin.testntagdashboard,
            component: components.TestTagDashboard,
            exact: true,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntaginspect,
            component: components.TestTagInspection,
            exact: true,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagmanageassettypes,
            component: components.TestTagManageAssetTypes,
            exact: true,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagmanagelocations,
            component: components.TestTagManageLocations,
            exact: true,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagmanageinspectiondevices,
            component: components.TestTagManageInspectionDevices,
            exact: true,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagmanagebulkassetupdate,
            component: components.TestTagManageBulkAssetUpdate,
            exact: true,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagmanageinspectiondetails,
            component: components.TestTagManageInspectionDetails,
            exact: true,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagreportrecalibrationssdue,
            component: components.TestTagReportRecalibrationsDue,
            exact: true,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagreportinspectionsdue,
            component: components.TestTagReportInspectionsDue,
            exact: true,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagreportinspectionsbylicenceduser,
            component: components.TestTagReportInspectionsByLicencedUser,
            exact: true,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagreportassetsbyfilters,
            component: components.TestTagAssetReportByFilters,
            exact: true,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagmanageusers,
            component: components.TestTagManageUsers,
            exact: true,
            pageTitle: locale.pages.admin.testntag.title,
        },
    ];

    return [
        ...publicPages,
        ...(account && canSeeLearningResources(account) ? courseResourcesDisplay : []),
        ...(account && isAlertsAdminUser(account) ? alertsDisplay : []),
        ...(account && isDlorAdminUser(account) ? dlorAdminDisplay : []),
        ...(account && account.canMasquerade ? masqueradeDisplay : []),
        ...(account && isTestTagAdminUser(account) ? testntagDisplay : []),
        {
            component: components.NotFound,
        },
    ];
};
