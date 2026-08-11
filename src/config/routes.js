import React from 'react';
import { locale } from 'locale';
import { canSeeLearningResourcesPage, isAlertsAdminUser, isDlorAdminUser, isTestTagUser } from 'helpers/access';
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
    '/admin/dlor/series/add',
    '/admin/dlor/team/manage',
    '/admin/dlor/team/add',
    '/admin/dlor/filters',
    '/admin/dlor/vocabulary',
    '/admin/dlor/schedule',
    '/admin/masquerade',
    '/admin/masquerade/',
    '/admin/testntag',
    '/admin/testntag/manage/users',
    '/admin/testntag/manage/teams',
    '/admin/testntag/manage/assettypes',
    '/admin/testntag/manage/locations',
    '/admin/testntag/manage/inspectiondevices',
    '/admin/testntag/manage/bulkassetupdate',
    '/admin/testntag/manage/inspectiondetails',
    '/admin/testntag/manage/printertemplates',
    '/admin/testntag/report/recalibrationsdue',
    '/admin/testntag/report/inspectionsdue',
    '/admin/testntag/report/assetsbyfilter',
    '/admin/testntag/report/inspectionsbylicenceduser',
    '/book-exam-booth',
    '/exams',
    '/exams/',
    '/digital-learning-hub',
    'https://www.library.uq.edu.au/404.js',
    '/digital-learning-hub-list',
    '/digital-learning-hub/dashboard',
];
export const flattedPathConfig = [
    '/admin/alerts/edit',
    '/admin/alerts/clone',
    '/admin/alerts/view',
    '/admin/dlor/edit',
    '/admin/dlor/series/edit',
    '/admin/dlor/team/edit',
    '/admin/dlor/series/add',
    '/admin/dlor/filters/edit',
    '/digital-learning-hub/view',
    '/digital-learning-hub/confirm/subscribe',
    '/digital-learning-hub/confirm/unsubscribe',
    '/digital-learning-hub/submit',
    '/digital-learning-hub/edit',
    '/exams/course',
];

export const getRoutesConfig = ({ components = {}, account = null }) => {
    const examSearchCourseHint = ':courseHint';

    const dlorId = ':dlorId';
    const seriesId = ':seriesId';
    const confirmationId = ':confirmationId';

    // A standalone section with its own look and feel — App renders it without the shared chrome.
    const publicStandalonePages = [
        {
            path: pathConfig.artTrailApp,
            element: <components.ArtTrailApp />,
            pageTitle: 'Art Trail',
            standalone: true,
        },
    ];

    const publicPages = [
        {
            path: pathConfig.index,
            element: <components.Index />,
            pageTitle: locale.pages.index.title,
        },
        {
            path: pathConfig.paymentReceipt,
            element: <components.PaymentReceipt />,
            pageTitle: locale.pages.paymentReceipt.title,
        },
        {
            path: pathConfig.bookExamBooth,
            element: <components.BookExamBooth />,
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
            pageTitle: 'Digital Learning Object Repository',
        },
        {
            path: pathConfig.dlorViewSeries(seriesId),
            element: <components.SeriesView />,
            pageTitle: 'Digital Learning Object Repository - View Series',
        },
        {
            path: pathConfig.dlorSubscriptionConfirmation(confirmationId),
            element: <components.DLOConfirmSubscription />,
            pageTitle: 'Digital Learning Object Repository - Confirm Subscription request',
        },
        {
            path: pathConfig.dlorUnsubscribe(confirmationId),
            element: <components.DLOConfirmUnsubscription />,

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
            pageTitle: locale.pages.pastExamPaperSearch.title,
        },
        {
            path: pathConfig.dlorSubmit,
            element: <components.DLONew />,
            pageTitle: 'Submit request for new object',
        },
        {
            path: pathConfig.dlorOwnObjectEdit(dlorId),
            element: <components.DLOOwnEdit />,
            pageTitle: 'Edit details of your object',
        },
        {
            path: pathConfig.artTrailLanding,
            element: <components.ArtTrail />,
            pageTitle: 'Art Trail Welcome',
        },
    ];

    const courseResourcesDisplay = [
        {
            path: pathConfig.learningresources,
            element: <components.LearningResources />,
            pageTitle: locale.pages.learningresources.title,
        },
    ];

    const alertid = ':alertid';
    const alertsDisplay = [
        {
            path: pathConfig.admin.alerts,
            element: <components.AlertsList />,
            pageTitle: locale.pages.admin.alerts.title,
        },
        {
            path: pathConfig.admin.alertsadd,
            element: <components.AlertsAdd />,
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
            pageTitle: locale.pages.admin.masquerade.title,
        },
    ];

    const dlorTeamId = ':dlorTeamId';
    const dlorSeriesId = ':dlorSeriesId';
    const dlorAdminDisplay = [
        {
            path: pathConfig.admin.dloradmin,
            element: <components.DLOAdminHomepage />,
            pageTitle: 'Manage the Digital Learning Hub',
        },
        {
            path: pathConfig.admin.dloradd,
            element: <components.DLOAdd />,
            pageTitle: 'Create a new Object',
        },
        {
            path: pathConfig.admin.dloredit(dlorId),
            element: <components.DLOEdit />,
            pageTitle: 'Edit an Object',
        },
        {
            path: pathConfig.admin.dlorteammanage,
            element: <components.DLOTeamList />,
            pageTitle: 'Manage Teams for the Digital Learning Hub',
        },
        {
            path: pathConfig.admin.dlorteamedit(dlorTeamId),
            element: <components.DLOTeamEdit />,
            pageTitle: 'Edit a Team for the Digital Learning Hub',
        },
        {
            path: pathConfig.admin.dlorteamadd,
            element: <components.DLOTeamAdd />,
            pageTitle: 'Create a new Team',
        },
        {
            path: pathConfig.admin.dlorseriesmanage,
            element: <components.DLOSeriesList />,
            pageTitle: 'Manage Series for the Digital Learning Hub',
        },
        {
            path: pathConfig.admin.dlorseriesedit(dlorSeriesId),
            element: <components.DLOSeriesEdit />,
            pageTitle: 'Edit a Series for the Digital Learning Hub',
        },
        {
            path: pathConfig.admin.dlorseriesadd,
            element: <components.DLOSeriesAdd />,
            pageTitle: 'Create a new Series',
        },
        {
            path: pathConfig.admin.dlorfiltersmanage,
            element: <components.DLOFilterManage />,
            pageTitle: 'Manage Filters',
        },
        {
            path: pathConfig.admin.dlorvocabularymanage,
            element: <components.DLOVocabularyManage />,
            pageTitle: 'Manage Vocabulary',
        },
        {
            path: pathConfig.admin.dlorScheduler,
            element: <components.DLOBulkSchedule />,
            pageTitle: 'Manage feature schedules',
        },
    ];
    const authenticatedDlorDisplay = [
        {
            path: pathConfig.dlorProtected,
            element: <components.DLOList />,
            pageTitle: 'Digital Learning Object Repository',
        },
        {
            path: pathConfig.dlorViewSecure(dlorId),
            element: <components.DLOView />,
            pageTitle: 'Digital Learning Object Repository - View Object',
        },
        {
            path: pathConfig.dlorDashboard,
            element: <components.DLODashboard />,
            pageTitle: 'Digital Learning Object Repository - Dashboard',
        },
    ];

    const dlorTeamAdminDisplay = [
        {
            path: pathConfig.dlorOwnTeamList,
            element: <components.DLOOwnTeamList />,
            pageTitle: 'Digital Learning Object Repository - Team Management',
        },
        {
            path: pathConfig.dlorOwnTeamEdit(dlorTeamId),
            element: <components.DLOOwnTeamEdit />,
            pageTitle: 'Digital Learning Object Repository - Edit Team',
        },
    ];

    const testntagDisplay = [
        {
            path: pathConfig.admin.testntagdashboard,
            element: <components.TestTagDashboard />,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntaginspect,
            element: <components.TestTagInspection />,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagmanageassettypes,
            element: <components.TestTagManageAssetTypes />,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagmanagelocations,
            element: <components.TestTagManageLocations />,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagmanageinspectiondevices,
            element: <components.TestTagManageInspectionDevices />,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagmanagebulkassetupdate,
            element: <components.TestTagManageBulkAssetUpdate />,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagmanageinspectiondetails,
            element: <components.TestTagManageInspectionDetails />,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagreportrecalibrationssdue,
            element: <components.TestTagReportRecalibrationsDue />,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagreportinspectionsdue,
            element: <components.TestTagReportInspectionsDue />,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagreportinspectionsbylicenceduser,
            element: <components.TestTagReportInspectionsByLicencedUser />,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagreportassetsbyfilters,
            element: <components.TestTagAssetReportByFilters />,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagmanageusers,
            element: <components.TestTagManageUsers />,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagmanageteams,
            element: <components.TestTagManageTeams />,
            pageTitle: locale.pages.admin.testntag.title,
        },
        {
            path: pathConfig.admin.testntagmanageprintertemplates,
            element: <components.TestTagManagePrinterTemplates />,
            pageTitle: locale.pages.admin.testntag.title,
        },
    ];

    return [
        ...publicStandalonePages,
        ...publicPages,
        ...(account && canSeeLearningResourcesPage(account) ? courseResourcesDisplay : []),
        ...(account && isAlertsAdminUser(account) ? alertsDisplay : []),
        ...(account && isDlorAdminUser(account) ? dlorAdminDisplay : []),
        ...(account && account.canMasquerade ? masqueradeDisplay : []),
        ...(account && isTestTagUser(account) ? testntagDisplay : []),
        ...(account ? dlorTeamAdminDisplay : []),
        ...(account ? authenticatedDlorDisplay : []),
        {
            path: '*',
            element: <components.NotFound />,
        },
    ];
};

// the top level link that appears in the page breadcrumb
// call with use effect on every page that should have a 3rd level breadcrumb
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
