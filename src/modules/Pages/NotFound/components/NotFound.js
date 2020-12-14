import React from 'react';
import { useLocation } from 'react-router';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { useAccountContext } from 'context';
import { AUTH_URL_LOGIN } from 'config';
import locale from './notfound.locale';
import { flattedPathConfig } from 'config/routes';

export const NotFound = () => {
    const location = useLocation();
    const { account } = useAccountContext();

    const isValidRoute = flattedPathConfig.indexOf(location.pathname) >= 0;

    // if known page and is logged in (page must require admin to land here)
    if (isValidRoute && account) {
        return (
            <StandardPage
                goBackFunc={() => history.back()}
                standardPageId="permission-denied"
                {...locale.permissionDenied}
            />
        );
    }

    // if known page and is NOT logged in (page must require logged in to land here)
    if (isValidRoute && !account) {
        // istanbul ignore next
        if (
            process.env.NODE_ENV !== 'test' &&
            process.env.NODE_ENV !== 'cc' &&
            process.env.NODE_ENV !== 'development'
        ) {
            // istanbul ignore next
            window.location.assign(`${AUTH_URL_LOGIN}?url=${window.btoa(window.location.href)}`);
        }
        return (
            <StandardPage
                goBackFunc={() => history.back()}
                standardPageId="authentication-required"
                {...locale.authenticationRequired}
            />
        );
    }

    // if not known page and is logged in
    if (!!account.id && !isValidRoute) {
        return <StandardPage goBackFunc={() => history.back()} standardPageId="not-found" {...locale.notFound} />;
    }

    // should never happen? - account did not load properly?
    return <StandardPage goBackFunc={() => history.back()} standardPageId="not-found" {...locale.accountError} />;
};

export default React.memo(NotFound);
