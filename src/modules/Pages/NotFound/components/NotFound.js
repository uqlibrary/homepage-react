import React from 'react';
import { useLocation } from 'react-router';
import PropTypes from 'prop-types';

import locale from './notfound.locale';

import { AUTH_URL_LOGIN } from 'config';
import { flattedPathConfig } from 'config/routes';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import ScriptTag from 'react-script-tag';

export const NotFound = ({ account, accountLoading }) => {
    const location = useLocation();
    const isValidRoute = flattedPathConfig.indexOf(location.pathname) >= 0;
    // if not known page, standard 404
    const isLocal = window.location.hostname.indexOf('localhost') > 0;
    if (!isValidRoute) {
        return (
            <StandardPage goBackFunc={() => history.back()} standardPageId="not-found" title={locale.notFound.title}>
                {!isLocal && (
                    <ScriptTag
                        type="text/javascript"
                        src={`https://www.library.uq.edu.au/404.js?uri=${window.location.hostname}${
                            window.location.pathname
                        }&referrer=${document.referrer || 'Not available'}&requester=${
                            !accountLoading && account ? account.id : 'Not available'
                        }`}
                    />
                )}
                {locale.notFound.content}
            </StandardPage>
        );
    }
    // the page must require admin to land here when they are logged in
    const isLoggedIn = accountLoading === false && !!account && !!account.id;
    if (isLoggedIn) {
        return (
            <StandardPage
                goBackFunc={() => history.back()}
                standardPageId="permission-denied"
                {...locale.permissionDenied}
            />
        );
    }

    // the page must require them to be logged in to land here
    const isLoggedOut = accountLoading === false && !account;
    if (isLoggedOut) {
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
    account: PropTypes.object,
    accountLoading: PropTypes.bool,
};

export default React.memo(NotFound);
