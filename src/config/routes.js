import { locale } from 'locale';
import {
    isAlertsAdminUser,
    canSeeLearningResources,
    isSpotlightsAdminUser,
    isTestTagAdminUser,
    isPromoPanelAdminUser,
} from 'helpers/access';
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
    '/admin/masquerade',
    '/admin/masquerade/',
    '/admin/spotlights/add',
    '/admin/spotlights',
    '/admin/promopanel/add',
    '/admin/promopanel',
    '/admin/testntag',
    '/admin/testntag/manage/assettypes',
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
    '/admin/promopanel/edit',
    '/admin/promopanel/view',
    '/admin/promopanel/clone',
    '/exams/course',
];

export const getRoutesConfig = ({ components = {}, account = null }) => {
    const examSearchRegExp = '.*';
    const examSearchCourseHint = `:courseHint(${examSearchRegExp})`;
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

    const promopanelidRegExp = '.*';
    const promopanelid = `:promopanelid(${promopanelidRegExp})`;
    const promoPanelDisplay = [
        {
            path: pathConfig.admin.promopanel,
            component: components.PromoPanelList,
            exact: true,
            pageTitle: locale.pages.admin.promopanel.title,
        },
        {
            path: pathConfig.admin.promopaneladd,
            component: components.PromoPanelAdd,
            exact: true,
            pageTitle: locale.pages.admin.promopanel.form.add.title,
        },
        {
            path: pathConfig.admin.promopaneledit(promopanelid),
            component: components.PromoPanelEdit,
            pageTitle: locale.pages.admin.promopanel.form.edit.title,
        },
        {
            path: pathConfig.admin.promopanelclone(promopanelid),
            component: components.PromoPanelClone,
            pageTitle: locale.pages.admin.promopanel.form.clone.title,
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
    ];
    // const testntagManageAssetTypes = [
    //     {
    //         path: pathConfig.admin.testntagmanageassettypes,
    //         component: components.TestTagManageAssetTypes,
    //         exact: true,
    //         pageTitle: locale.pages.admin.testntag.title,
    //     },
    // ];

    return [
        ...publicPages,
        ...(account && canSeeLearningResources(account) ? courseResourcesDisplay : []),
        ...(account && isAlertsAdminUser(account) ? alertsDisplay : []),
        ...(account && account.canMasquerade ? masqueradeDisplay : []),
        ...(account && isSpotlightsAdminUser(account) ? spotlightsDisplay : []),
        ...(account && isPromoPanelAdminUser(account) ? promoPanelDisplay : []),
        ...(account && isTestTagAdminUser(account) ? testntagDisplay : []),
        // ...(account && isTestTagAdminUser(account) ? testntagManageAssetTypes : []),
        {
            component: components.NotFound,
        },
    ];
};
