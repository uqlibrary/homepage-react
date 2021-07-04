import React from 'react';

// lazy loaded components
export const NotFound = React.lazy(() => import('modules/Pages/NotFound/containers/NotFound'));
export const SecureCollection = React.lazy(() => import('modules/Pages/SecureCollection/containers/SecureCollection'));
export const CourseResources = React.lazy(() => import('modules/Pages/CourseResources/containers/CourseResources'));
export const PaymentReceipt = React.lazy(() => import('modules/Pages/PaymentReceipt/PaymentReceipt'));
export const BookExamBooth = React.lazy(() => import('modules/Pages/BookExamBooth/containers/BookExamBooth'));
export const AlertsList = React.lazy(() => import('modules/Pages/Admin/Alerts/List/containers/AlertsList'));

// always load components
export { IndexContainer as Index } from 'modules/Index';
export { Masquerade } from 'modules/Pages/Admin/Masquerade';
export { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
