import React from 'react';
import { useLocation } from 'react-router';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { useAccountContext } from 'context';
import { AUTH_URL_LOGIN } from 'config';
import locale from './notfound.locale';
import { flattedPathConfig } from 'config/routes';
import { CURRENT_ACCOUNT_LOADING } from '../../../../actions/actionTypes';

export const NotFound = () => {
    const location = useLocation();
    const { account } = useAccountContext();

    const isValidRoute = flattedPathConfig.indexOf(location.pathname) >= 0;

    // if known page and is logged in (page must require admin to land here)
    if (isValidRoute && !CURRENT_ACCOUNT_LOADING && !!account && !!account.id) {
        return (
            <StandardPage
                goBackFunc={() => history.back()}
                standardPageId="permission-denied"
                {...locale.permissionDenied}
            />
        );
    }

    // if known page and is NOT logged in (page must require logged in to land here)
    if (isValidRoute && !CURRENT_ACCOUNT_LOADING && (!account || !account.id)) {
        /* istanbul ignore next */
        if (
            process.env.NODE_ENV !== 'test' &&
            process.env.NODE_ENV !== 'cc' &&
            process.env.NODE_ENV !== 'development'
        ) {
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

    // if not known page but user is is logged in
    if (!CURRENT_ACCOUNT_LOADING && !!account && !!account.id && !isValidRoute) {
        return <StandardPage goBackFunc={() => history.back()} standardPageId="not-found" {...locale.notFound} />;
    }

    // should never happen? - account did not load properly?
    /* istanbul ignore next */
    if (!CURRENT_ACCOUNT_LOADING) {
        return <StandardPage goBackFunc={() => history.back()} standardPageId="not-found" {...locale.accountError} />;
    }

    return 'loading';
};

export default React.memo(NotFound);
