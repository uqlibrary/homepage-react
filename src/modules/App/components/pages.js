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
export const SpotlightsList = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Spotlights/List/SpotlightsListContainer')));
export const SpotlightsAdd = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Spotlights/Form/Add/SpotlightsAddContainer')));
export const SpotlightsEdit = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Spotlights/Form/Edit/SpotlightsEditContainer')));
export const SpotlightsView = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Spotlights/View/SpotlightsViewContainer')));
export const SpotlightsClone = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Spotlights/Form/Clone/SpotlightsCloneContainer')));

export const TestTagDashboard = lazy(() => lazyRetry(() => import('modules/Pages/Admin/TestTag/Dashboard/containers/Dashboard')));
export const TestTagInspection = lazy(() => lazyRetry(() => import('modules/Pages/Admin/TestTag/Inspection/containers/Inspection')));
export const TestTagManageAssetTypes = lazy(() => lazyRetry(() => import('modules/Pages/Admin/TestTag/ManageAssetTypes/containers/ManageAssetTypes')));

export const Masquerade = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Masquerade/containers/Masquerade')));
export const PastExamPaperSearch = lazy(() => lazyRetry(() => import('modules/Pages/PastExamPaperSearch/PastExamPaperSearchContainer')));
export const PastExamPaperList = lazy(() => lazyRetry(() => import('modules/Pages/PastExamPaperList/PastExamPaperListContainer')));

export const PromoPanelList = lazy(() => lazyRetry(() => import('modules/Pages/Admin/PromoPanel/List/PromoPanelListContainer')));
export const PromoPanelAdd = lazy(() => lazyRetry(() => import('modules/Pages/Admin/PromoPanel/Form/Add/PromoPanelAddContainer')));
export const PromoPanelEdit = lazy(() => lazyRetry(() => import('modules/Pages/Admin/PromoPanel/Form/Edit/PromoPanelEditContainer')));
// export const PromoPanelView = lazy(() => lazyRetry(() => import('modules/Pages/Admin/PromoPanel/View/PromoPanelViewContainer')));
export const PromoPanelClone = lazy(() => lazyRetry(() => import('modules/Pages/Admin/PromoPanel/Form/Clone/PromoPanelCloneContainer')));


// always load components
export { IndexContainer as Index } from 'modules/Index';
export { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
