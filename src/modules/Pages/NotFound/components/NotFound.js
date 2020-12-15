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

    const isAccountLoadingComplete = actions.CURRENT_ACCOUNT_LOADING === 'CURRENT_ACCOUNT_LOADING';

    const loggedInConfirmed = isAccountLoadingComplete && !!account && !!account.id;

    const loggedOutConfirmed = isAccountLoadingComplete && !!account && !account.id;

    // if not known page, standard 404
    if (!isValidRoute) {
        return <StandardPage goBackFunc={() => history.back()} standardPageId="not-found" {...locale.notFound} />;
    }

    // the page must require admin to land here when they are logged in
    if (loggedInConfirmed) {
        return (
            <StandardPage
                goBackFunc={() => history.back()}
                standardPageId="permission-denied"
                {...locale.permissionDenied}
            />
        );
    }

    // the page must require them to be logged in to land here
    if (loggedOutConfirmed) {
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

    // the call to load the account is complete, but status is undetermined
    // should never happen? - account did not load properly?
    /* istanbul ignore next */
    if (isAccountLoadingComplete) {
        return <StandardPage goBackFunc={() => history.back()} standardPageId="not-found" {...locale.accountError} />;
    }

    // unsure of why this isnt called in test. Maybe tests load so fast it never happens?
    /* istanbul ignore next */
    return <CircularProgress color="primary" size={20} id="checking-for-page-allowed" />;
};

export default React.memo(NotFound);
