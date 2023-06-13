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
        testntagmanagebulkassetupdate: '/admin/testntag/manage/bulkassetupdate',
        testntagreportinspectionsdue: '/admin/testntag/report/inspectionsdue',
    },
    bookExamBooth: '/book-exam-booth',
    pastExamPaperList: courseHint => `/exams/course/${courseHint}`,
    pastExamPaperSearch: '/exams',
    help: 'https://guides.library.uq.edu.au/for-researchers/research-publications-guide',
};
