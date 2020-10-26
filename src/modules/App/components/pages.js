import React from 'react';

// lazy loaded components
export const NotFound = React.lazy(() => import('modules/Pages/NotFound/components/NotFound'));
export const CourseResources = React.lazy(() => import('modules/Pages/CourseResources/containers/CourseResources'));

// always load components
export { IndexContainer as Index } from 'modules/Index';
export { Masquerade } from 'modules/Pages/Masquerade';
export { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
