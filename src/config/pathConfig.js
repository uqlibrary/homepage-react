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
        dloradmin: '/admin/dlor',
        dloradd: '/admin/dlor/add',
        dloredit: dlorId => `/admin/dlor/edit/${dlorId}`,
        dlorteammanage: '/admin/dlor/team/manage',
        dlorteamedit: dlorTeamId => `/admin/dlor/team/edit/${dlorTeamId}`,
        dlorteamadd: '/admin/dlor/team/add',
        dlorseriesmanage: '/admin/dlor/series/manage',
        dlorseriesedit: dlorSeriesId => `/admin/dlor/series/edit/${dlorSeriesId}`,
        masquerade: '/admin/masquerade',
        promopaneladd: '/admin/promopanel/add',
        promopaneledit: promopanelid => `/admin/promopanel/edit/${promopanelid}`,
        // promopanelview: promopanelid => `/admin/promopanel/view/${promopanelid}`,
        promopanelclone: promopanelid => `/admin/promopanel/clone/${promopanelid}`,
        promopanel: '/admin/promopanel',
        spotlightsadd: '/admin/spotlights/add',
        spotlightsedit: spotlightid => `/admin/spotlights/edit/${spotlightid}`,
        spotlightsview: spotlightid => `/admin/spotlights/view/${spotlightid}`,
        spotlightsclone: spotlightid => `/admin/spotlights/clone/${spotlightid}`,
        spotlights: '/admin/spotlights',
        testntagdashboard: '/admin/testntag',
        testntaginspect: '/admin/testntag/inspect',
        testntagmanagelocations: '/admin/testntag/manage/locations',
        testntagmanageinspectiondevices: '/admin/testntag/manage/inspectiondevices',
        testntagmanageassettypes: '/admin/testntag/manage/assettypes',
        testntagmanageinspectiondetails: '/admin/testntag/manage/inspectiondetails',
        testntagreportassetsbyfilters: '/admin/testntag/report/assetsbyfilter',
        testntagreportinspectionsbylicenceduser: '/admin/testntag/report/inspectionsbylicenceduser',
        testntagmanagebulkassetupdate: '/admin/testntag/manage/bulkassetupdate',
        testntagreportinspectionsdue: '/admin/testntag/report/inspectionsdue',
        testntagreportrecalibrationssdue: '/admin/testntag/report/recalibrationsdue',
        testntagmanageusers: '/admin/testntag/manage/users',
    },
    bookExamBooth: '/book-exam-booth',
    dlorHome: '/digital-learning-hub',
    dlorView: dlorId => `/digital-learning-hub/view/${dlorId}`,
    pastExamPaperList: courseHint => `/exams/course/${courseHint}`,
    pastExamPaperSearch: '/exams',
    help: 'https://guides.library.uq.edu.au/for-researchers/research-publications-guide',
};
