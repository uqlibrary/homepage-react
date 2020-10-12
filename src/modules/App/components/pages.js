import React from 'react';

// lazy loaded components
export const NotFound = React.lazy(() => import('pages/NotFound/components/NotFound'));

// always load components
export { IndexContainer as Index } from 'modules/Index';
export { Masquerade } from 'pages/Masquerade';
export { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
