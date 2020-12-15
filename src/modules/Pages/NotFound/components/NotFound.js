import React from 'react';
import { useLocation } from 'react-router';
import { useAccountContext } from 'context';

import locale from './notfound.locale';
import * as actions from 'actions/actionTypes';
import { AUTH_URL_LOGIN } from 'config';
import { flattedPathConfig } from 'config/routes';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import CircularProgress from '@material-ui/core/CircularProgress';

export const NotFound = () => {
    const location = useLocation();
    const { account } = useAccountContext();

    const isValidRoute = flattedPathConfig.indexOf(location.pathname) >= 0;

    const isAccountLoaded = actions.CURRENT_ACCOUNT_LOADING === 'CURRENT_ACCOUNT_LOADING';

    // if not known page
    if (!isValidRoute) {
        return <StandardPage goBackFunc={() => history.back()} standardPageId="not-found" {...locale.notFound} />;
    }

    // if known page and is logged in (page must require admin to land here)
    if (isValidRoute && isAccountLoaded && !!account && !!account.id) {
        return (
            <StandardPage
                goBackFunc={() => history.back()}
                standardPageId="permission-denied"
                {...locale.permissionDenied}
            />
        );
    }

    // if known page and is NOT logged in (page must require logged in to land here)
    if (isValidRoute && isAccountLoaded && (!account || !account.id)) {
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

    // if not known page but user is logged in
    if (isAccountLoaded && !!account && !!account.id && !isValidRoute) {
        return <StandardPage goBackFunc={() => history.back()} standardPageId="not-found" {...locale.notFound} />;
    }

    // should never happen? - account did not load properly?
    /* istanbul ignore next */
    if (isAccountLoaded) {
        return <StandardPage goBackFunc={() => history.back()} standardPageId="not-found" {...locale.accountError} />;
    }

    return <CircularProgress color="primary" size={20} id="loading-not-found" />;
};

export default React.memo(NotFound);
