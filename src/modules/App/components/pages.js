/* eslint max-len: 0 */
import { lazy } from 'react';
import { lazyRetry } from 'helpers/general';

// lazy loaded components
export const NotFound = lazy(() => lazyRetry(() => import('modules/Pages/NotFound/containers/NotFound')));
export const LearningResources = lazy(() => lazyRetry(() => import('modules/Pages/LearningResources/LearningResourcesContainer')));
export const PaymentReceipt = lazy(() => lazyRetry(() => import('modules/Pages/PaymentReceipt/PaymentReceipt')));
export const BookExamBooth = lazy(() => lazyRetry(() => import('modules/Pages/BookExamBooth/BookExamBoothContainer')));
export const AlertsAdd = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Alerts/Form/Add/AlertsAddContainer')));
export const AlertsEdit = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Alerts/Form/Edit/AlertsEditContainer')));
export const AlertsClone = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Alerts/Form/Clone/AlertsCloneContainer')));
export const AlertsView = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Alerts/View/AlertsViewContainer')));
export const AlertsList = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Alerts/List/AlertsListContainer')));

export const DLOList = lazy(() => lazyRetry(() => import('modules/Pages/DigitalLearningObjects/Index/DLOListContainer')));
export const DLOView = lazy(() => lazyRetry(() => import('modules/Pages/DigitalLearningObjects/View/DLOViewContainer')));
export const DLOConfirmSubscription = lazy(() => lazyRetry(() => import('modules/Pages/DigitalLearningObjects/ConfirmSubscription/DLOConfirmSubscriptionContainer')));
export const DLOConfirmUnsubscription = lazy(() => lazyRetry(() => import('modules/Pages/DigitalLearningObjects/ConfirmUnsubscription/DLOConfirmUnsubscriptionContainer')));
export const DLOAdminHomepage = lazy(() => lazyRetry(() => import('modules/Pages/Admin/DigitalLearningObjects/Homepage/DLOAdminHomepageContainer')));
export const DLOAdd = lazy(() => lazyRetry(() => import('modules/Pages/Admin/DigitalLearningObjects/Form/Add/DLOAddContainer')));
export const DLOEdit = lazy(() => lazyRetry(() => import('modules/Pages/Admin/DigitalLearningObjects/Form/Edit/DLOEditContainer')));
export const DLOTeamList = lazy(() => lazyRetry(() => import('modules/Pages/Admin/DigitalLearningObjects/Team/DLOTeamListContainer')));
export const DLOTeamEdit = lazy(() => lazyRetry(() => import('modules/Pages/Admin/DigitalLearningObjects/Team/DLOTeamEditContainer')));
export const DLOTeamAdd = lazy(() => lazyRetry(() => import('modules/Pages/Admin/DigitalLearningObjects/Team/DLOTeamAddContainer')));
export const DLOSeriesList = lazy(() => lazyRetry(() => import('modules/Pages/Admin/DigitalLearningObjects/Series/DLOSeriesListContainer')));
export const DLOSeriesEdit = lazy(() => lazyRetry(() => import('modules/Pages/Admin/DigitalLearningObjects/Series/DLOSeriesEditContainer')));
export const SeriesView = lazy(() => lazyRetry(() => import('modules/Pages/DigitalLearningObjects/Series/SeriesViewContainer')));
export const DLOSeriesAdd = lazy(() => lazyRetry(() => import('modules/Pages/Admin/DigitalLearningObjects/Series/DLOSeriesAddContainer')));

export const TestTagDashboard = lazy(() => lazyRetry(() => import('modules/Pages/Admin/TestTag/Dashboard/containers/Dashboard')));
export const TestTagInspection = lazy(() => lazyRetry(() => import('modules/Pages/Admin/TestTag/Inspection/containers/Inspection')));
export const TestTagManageAssetTypes = lazy(() => lazyRetry(() => import('modules/Pages/Admin/TestTag/manage/AssetTypes/containers/AssetTypes')));
export const TestTagManageLocations = lazy(() => lazyRetry(() => import('modules/Pages/Admin/TestTag/manage/Locations/containers/Locations')));
export const TestTagManageInspectionDevices = lazy(() => lazyRetry(() => import('modules/Pages/Admin/TestTag/manage/InspectionDevices/containers/InspectionDevices')));
export const TestTagManageInspectionDetails = lazy(() => lazyRetry(() => import('modules/Pages/Admin/TestTag/manage/InspectionDetails/containers/InspectionDetails')));
export const TestTagReportRecalibrationsDue = lazy(() => lazyRetry(() => import('modules/Pages/Admin/TestTag/report/recalibrationsDue/containers/RecalibrationsDue')));
export const TestTagReportInspectionsDue = lazy(() => lazyRetry(() => import('modules/Pages/Admin/TestTag/report/inspectionsDue/containers/InspectionsDue')));
export const TestTagReportInspectionsByLicencedUser = lazy(() => lazyRetry(() => import('modules/Pages/Admin/TestTag/report/inspectionsByLicencedUser/containers/InspectionsByLicencedUser')));
export const TestTagAssetReportByFilters = lazy(() => lazyRetry(() => import('modules/Pages/Admin/TestTag/report/AssetReportByFilters/containers/AssetReportByFilters')));
export const TestTagManageBulkAssetUpdate = lazy(() => lazyRetry(() => import('modules/Pages/Admin/TestTag/manage/BulkAssetUpdate/containers/BulkAssetUpdate')));
export const TestTagManageUsers = lazy(() => lazyRetry(() => import('modules/Pages/Admin/TestTag/manage/Users/containers/Users')));

export const Masquerade = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Masquerade/containers/Masquerade')));
export const PastExamPaperSearch = lazy(() => lazyRetry(() => import('modules/Pages/PastExamPaperSearch/PastExamPaperSearchContainer')));
export const PastExamPaperList = lazy(() => lazyRetry(() => import('modules/Pages/PastExamPaperList/PastExamPaperListContainer')));

export const DLONew = lazy(() => lazyRetry(() => import('modules/Pages/DigitalLearningObjects/Objects/DLOAddContainer')));
export const DLOOwnEdit = lazy(() => lazyRetry(() => import('modules/Pages/DigitalLearningObjects/Objects/DLOEditContainer')));
export const DLOFilterManage = lazy(() => lazyRetry(() => import('modules/Pages/Admin/DigitalLearningObjects/Filters/DLOFilterManageContainer')));
// seperate route for team managers
export const DLOOwnTeamList = lazy(() => lazyRetry(() => import('modules/Pages/Admin/DigitalLearningObjects/Team/DLOTeamListContainer')));
// export const DLOOwnTeamEdit = lazy(() => lazyRetry(() => import('modules/Pages/Admin/DigitalLearningObjects/Team/DLOTeamEditContainer')));
// always load components
export { HomePageContainer as Index } from 'modules/HomePage';
export { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
