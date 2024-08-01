import React from 'react';
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
    const examSearchCourseHint = ':courseHint';

    const dlorId = ':dlorId';
    const confirmationId = ':confirmationId';

    const publicPages = [
        {
            path: pathConfig.index,
            element: <components.Index />,
            exact: true,
            pageTitle: locale.pages.index.title,
        },
        {
            path: pathConfig.paymentReceipt,
            element: <components.PaymentReceipt />,
            exact: true,
            pageTitle: locale.pages.paymentReceipt.title,
        },
        {
            path: pathConfig.bookExamBooth,
            element: <components.BookExamBooth />,
            exact: false,
            pageTitle: locale.pages.bookExamBooth.title,
        },
        {
            path: pathConfig.dlorView(dlorId),
            element: <components.DLOView />,
            pageTitle: 'Digital Learning Object Repository - View Object',
        },
        {
            path: pathConfig.dlorHome,
            element: <components.DLOList />,
            exact: true,
            pageTitle: 'Digital Learning Object Repository',
        },
        {
            path: pathConfig.dlorSubscriptionConfirmation(confirmationId),
            element: <components.DLOConfirmSubscription />,
            // exact: true,
            pageTitle: 'Digital Learning Object Repository - Confirm Subscription request',
        },
        {
            path: pathConfig.dlorUnsubscribe(confirmationId),
            element: <components.DLOConfirmUnsubscription />,
            // exact: true,
            pageTitle: 'Digital Learning Object Repository - Confirm Unsubscription request',
        },
        {
            path: pathConfig.pastExamPaperList(examSearchCourseHint),
            element: <components.PastExamPaperList />,
            pageTitle: locale.pages.pastExamPaperList.title,
        },
        {
            path: pathConfig.pastExamPaperSearch,
            element: <components.PastExamPaperSearch />,
            exact: false,
            pageTitle: locale.pages.pastExamPaperSearch.title,
        },
    ];

    const courseResourcesDisplay = [
        {
            path: pathConfig.learningresources,
            element: <components.LearningResources />,
            exact: true,
            pageTitle: locale.pages.learningresources.title,
        },
    ];

    const alertid = ':alertid';
    const alertsDisplay = [
        {
            path: pathConfig.admin.alerts,
            element: <components.AlertsList />,
            exact: true,
            pageTitle: locale.pages.admin.alerts.title,
        },
        {
            path: pathConfig.admin.alertsadd,
            element: <components.AlertsAdd />,
            exact: true,
            pageTitle: locale.pages.admin.alerts.form.add.title,
        },
        {
            path: pathConfig.admin.alertsedit(alertid),
            element: <components.AlertsEdit />,
            pageTitle: locale.pages.admin.alerts.form.edit.title,
        },
        {
            path: pathConfig.admin.alertsclone(alertid),
            element: <components.AlertsClone />,
            pageTitle: locale.pages.admin.alerts.form.clone.title,
        },
        {
            path: pathConfig.admin.alertsview(alertid),
            element: <components.AlertsView />,
            pageTitle: locale.pages.admin.alerts.form.view.title,
        },
    ];

    const masqueradeDisplay = [
        {
            path: pathConfig.admin.masquerade,
            element: <components.Masquerade />,
            exact: true,
            pageTitle: locale.pages.admin.masquerade.title,
        },
    ];

    const dlorTeamId = ':dlorTeamId';
    const dlorSeriesId = ':dlorSeriesId';
    const dlorAdminDisplay = [
        {
            path: pathConfig.admin.dloradmin,
            element: <components.DLOAdminHomepage />,
            exact: true,
            pageTitle: 'Manage the Digital Learning Hub',
        },
        {
            path: pathConfig.admin.dloradd,
            element: <components.DLOAdd />,
            exact: true,
            pageTitle: 'Create a new Object',
        },
        {
            path: pathConfig.admin.dloredit(dlorId),
            element: <components.DLOEdit />,
            exact: true,
            pageTitle: 'Edit an Object',
        },
        {
            path: pathConfig.admin.dlorteammanage,
            element: <components.DLOTeamList />,
            exact: true,
            pageTitle: 'Manage Teams for the Digital Learning Hub',
        },
        {
            path: pathConfig.admin.dlorteamedit(dlorTeamId),
            element: <components.DLOTeamEdit />,
            exact: true,
            pageTitle: 'Edit a Team for the Digital Learning Hub',
        },
        {
            path: pathConfig.admin.dlorteamadd,
            element: <components.DLOTeamAdd />,
            exact: true,
            pageTitle: 'Create a new Team',
        },
        {
            path: pathConfig.admin.dlorseriesmanage,
            element: <components.DLOSeriesList />,
            exact: true,
            pageTitle: 'Manage Series for the Digital Learning Hub',
        },
        {
            path: pathConfig.admin.dlorseriesedit(dlorSeriesId),
            element: <components.DLOSeriesEdit />,
            exact: true,
            pageTitle: 'Edit a Series for the Digital Learning Hub',
        },
    ];

    const testntagDisplay = [
        {
            path: pathConfig.admin.testntagdashboard,
            element: <components.TestTagDashboard />,
            exact: true,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntaginspect,
            element: <components.TestTagInspection />,
            exact: true,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagmanageassettypes,
            element: <components.TestTagManageAssetTypes />,
            exact: true,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagmanagelocations,
            element: <components.TestTagManageLocations />,
            exact: true,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagmanageinspectiondevices,
            element: <components.TestTagManageInspectionDevices />,
            exact: true,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagmanagebulkassetupdate,
            element: <components.TestTagManageBulkAssetUpdate />,
            exact: true,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagmanageinspectiondetails,
            element: <components.TestTagManageInspectionDetails />,
            exact: true,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagreportrecalibrationssdue,
            element: <components.TestTagReportRecalibrationsDue />,
            exact: true,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagreportinspectionsdue,
            element: <components.TestTagReportInspectionsDue />,
            exact: true,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagreportinspectionsbylicenceduser,
            element: <components.TestTagReportInspectionsByLicencedUser />,
            exact: true,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagreportassetsbyfilters,
            element: <components.TestTagAssetReportByFilters />,
            exact: true,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagmanageusers,
            element: <components.TestTagManageUsers />,
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
            path: '*',
            element: <components.NotFound />,
        },
    ];
};

// the top level link that appears in the page breadcrumb
// call with use effect on eveyer page that should have a 3rd level breadcrumb
export const breadcrumbs = {
    alertsadmin: { pathname: '/admin/alerts', title: 'Alerts admin' },
    dloradmin: { pathname: '/admin/dlor', title: 'Digital learning hub admin' },
    testntag: { pathname: '/admin/testntag', title: 'Test and tag' },
    bookexambooth: { pathname: '/book-exam-booth', title: 'Book an Exam booth' },
    dlor: { pathname: '/digital-learning-hub', title: 'Digital learning hub' },
    exampapers: { pathname: '/exams', title: 'Past exam papers' },
    learningresources: { pathname: '/learning-resources', title: 'Learning resources' },
    paymentreceipt: { pathname: '/payment-receipt', title: 'Payment receipt' },
};
