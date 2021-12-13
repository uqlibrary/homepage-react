import { lazy } from 'react';

const lazyRetry = (importFn, retries = 3, interval = 500) => {
    return new Promise((resolve, reject) => {
        importFn()
            .then(resolve)
            .catch(
                /* istanbul ignore next */ error => {
                    if (!retries) {
                        reject(error);
                        return;
                    }

                    setTimeout(() => {
                        lazyRetry(importFn, retries - 1).then(resolve, reject);
                    }, interval);
                },
            );
    });
};
// lazy loaded components
export const NotFound = lazy(() => lazyRetry(() => import('modules/Pages/NotFound/containers/NotFound')));
export const CourseResources = lazy(() =>
    lazyRetry(() => import('modules/Pages/CourseResources/containers/CourseResources')),
);
export const PaymentReceipt = lazy(() => lazyRetry(() => import('modules/Pages/PaymentReceipt/PaymentReceipt')));
export const BookExamBooth = lazy(() =>
    lazyRetry(() => import('modules/Pages/BookExamBooth/containers/BookExamBooth')),
);
export const AlertsAdd = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Alerts/Add/containers/AlertsAdd')));
export const AlertsEdit = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Alerts/Edit/containers/AlertsEdit')));
export const AlertsClone = lazy(() =>
    lazyRetry(() => import('modules/Pages/Admin/Alerts/Clone/containers/AlertsClone')),
);
export const AlertsView = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Alerts/View/containers/AlertsView')));
export const AlertsList = lazy(() => lazyRetry(() => import('modules/Pages/Admin/Alerts/List/containers/AlertsList')));
export const SpotlightsList = lazy(() =>
    lazyRetry(() => import('modules/Pages/Admin/Spotlights/List/SpotlightsListContainer')),
);
export const SpotlightsAdd = lazy(() =>
    lazyRetry(() => import('modules/Pages/Admin/Spotlights/Form/Add/SpotlightsAddContainer')),
);
export const SpotlightsEdit = lazy(() =>
    lazyRetry(() => import('modules/Pages/Admin/Spotlights/Form/Edit/SpotlightsEditContainer')),
);
export const SpotlightsView = lazy(() =>
    lazyRetry(() => import('modules/Pages/Admin/Spotlights/View/SpotlightsViewContainer')),
);
export const SpotlightsClone = lazy(() =>
    lazyRetry(() => import('modules/Pages/Admin/Spotlights/Form/Clone/SpotlightsCloneContainer')),
);

// always load components
export { IndexContainer as Index } from 'modules/Index';
export { Masquerade } from 'modules/Pages/Admin/Masquerade';
export { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
