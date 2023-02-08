import React from 'react';
import { useLocation } from 'react-router';
import PropTypes from 'prop-types';

import locale from './notfound.locale';

import { AUTH_URL_LOGIN } from 'config';
import { adminEditRegexConfig, flattedPathConfig, flattedPathConfigExact } from 'config/routes';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { Script404 } from './Script404';

export const NotFound = ({ account, accountLoading }) => {
    const location = useLocation();
    const isValidRoute =
        flattedPathConfigExact.indexOf(location.pathname) >= 0 ||
        flattedPathConfig.find(f => location.pathname.startsWith(f));
    const isValidFileRoute = adminEditRegexConfig.test(location.pathname);
    const isCurrentPage = pathname => pathname === document.location.pathname;
    // if not known page, standard 404
    if (!(isValidRoute || isValidFileRoute)) {
        return (
            <StandardPage standardPageId="not-found" title={locale.notFound.title}>
                <Script404 account={account} accountLoading={accountLoading} />
                {locale.notFound.urlChangeAdvisory.find(changeAdvice => isCurrentPage(changeAdvice.linkPattern))
                    ? locale.notFound.urlChangeAdvisory.map(changeAdvice => {
                          return isCurrentPage(changeAdvice.linkPattern)
                              ? changeAdvice.content
                              : /* istanbul ignore next */ ''; // ignore while we only have one example
                      })
                    : locale.notFound.content}
            </StandardPage>
        );
    }
    // the page must require admin to land here when they are logged in
    const isLoggedIn = accountLoading === false && !!account && !!account.id;
    if (isLoggedIn) {
        return <StandardPage standardPageId="permission-denied" {...locale.permissionDenied} />;
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
            window.location.assign(`${AUTH_URL_LOGIN}?return=${window.btoa(window.location.href)}`);
        }
        return <StandardPage standardPageId="authentication-required" {...locale.authenticationRequired} />;
    }

    return <div className="waiting empty" />;
};

NotFound.propTypes = {
    account: PropTypes.object,
    accountLoading: PropTypes.bool,
};

export default React.memo(NotFound);
