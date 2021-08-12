import React from 'react';

// lazy loaded components
export const NotFound = React.lazy(() => import('modules/Pages/NotFound/containers/NotFound'));
export const CourseResources = React.lazy(() => import('modules/Pages/CourseResources/containers/CourseResources'));
export const PaymentReceipt = React.lazy(() => import('modules/Pages/PaymentReceipt/PaymentReceipt'));
export const BookExamBooth = React.lazy(() => import('modules/Pages/BookExamBooth/containers/BookExamBooth'));
export const AlertsAdd = React.lazy(() => import('modules/Pages/Admin/Alerts/Add/containers/AlertsAdd'));
export const AlertsEdit = React.lazy(() => import('modules/Pages/Admin/Alerts/Edit/containers/AlertsEdit'));
export const AlertsClone = React.lazy(() => import('modules/Pages/Admin/Alerts/Clone/containers/AlertsClone'));
export const AlertsView = React.lazy(() => import('modules/Pages/Admin/Alerts/View/containers/AlertsView'));
export const AlertsList = React.lazy(() => import('modules/Pages/Admin/Alerts/List/containers/AlertsList'));
export const SpotlightsList = React.lazy(() => import('modules/Pages/Admin/Spotlights/List/containers/SpotlightsList'));

// always load components
export { IndexContainer as Index } from 'modules/Index';
export { Masquerade } from 'modules/Pages/Admin/Masquerade';
export { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
