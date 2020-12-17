import React from 'react';
import { useLocation } from 'react-router';
import PropTypes from 'prop-types';

import locale from './notfound.locale';

import { AUTH_URL_LOGIN } from 'config';
import { flattedPathConfig } from 'config/routes';
import { loggedInConfirmed, loggedOutConfirmed } from 'helpers/general';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

export const NotFound = ({ account }) => {
    const location = useLocation();

    const isValidRoute = flattedPathConfig.indexOf(location.pathname) >= 0;

    // if not known page, standard 404
    if (!isValidRoute) {
        return <StandardPage goBackFunc={() => history.back()} standardPageId="not-found" {...locale.notFound} />;
    }

    // the page must require admin to land here when they are logged in
    if (loggedInConfirmed(account)) {
        return (
            <StandardPage
                goBackFunc={() => history.back()}
                standardPageId="permission-denied"
                {...locale.permissionDenied}
            />
        );
    }

    // the page must require them to be logged in to land here
    if (loggedOutConfirmed(account)) {
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

    return <div className="waiting empty" />;
};

NotFound.propTypes = {
    account: PropTypes.any,
};

export default React.memo(NotFound);
