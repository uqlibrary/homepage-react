/* eslint max-len: 0 */
import { lazy } from 'react';
import { lazyRetry } from 'helpers/general';

// lazy loaded components
export const NotFound = lazy(() => lazyRetry(() => import('modules/Pages/NotFound/containers/NotFound')));
export const LearningResources = lazy(() => lazyRetry(() => import('modules/Pages/LearningResources/containers/LearningResources')));
export const PaymentReceipt = lazy(() => lazyRetry(() => import('modules/Pages/PaymentReceipt/PaymentReceipt')));
export const BookExamBooth = lazy(() => lazyRetry(() => import('modules/Pages/BookExamBooth/containers/BookExamBooth')));
export const AlertsAdd = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Alerts/Add/containers/AlertsAdd')));
export const AlertsEdit = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Alerts/Edit/containers/AlertsEdit')));
export const AlertsClone = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Alerts/Clone/containers/AlertsClone')));
export const AlertsView = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Alerts/View/containers/AlertsView')));
export const AlertsList = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Alerts/List/containers/AlertsList')));
export const SpotlightsList = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Spotlights/List/SpotlightsListContainer')));
export const SpotlightsAdd = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Spotlights/Form/Add/SpotlightsAddContainer')));
export const SpotlightsEdit = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Spotlights/Form/Edit/SpotlightsEditContainer')));
export const SpotlightsView = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Spotlights/View/SpotlightsViewContainer')));
export const SpotlightsClone = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Spotlights/Form/Clone/SpotlightsCloneContainer')));
export const Masquerade = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Masquerade/containers/Masquerade')));
export const PastExamPaperSearch = lazy(() => lazyRetry(() => import('modules/Pages/PastExamPaperSearch/PastExamPaperSearchContainer')));

// always load components
export { IndexContainer as Index } from 'modules/Index';
export { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
