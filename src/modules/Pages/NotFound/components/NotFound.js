import React from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import { AUTH_URL_LOGIN } from 'config';
import { adminEditRegexConfig, flattedPathConfig, flattedPathConfigExact } from 'config/routes';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { Script404 } from './Script404';

// This script loads when none of the other pattern matches in App/components/pages.js matches

export const NotFound = ({ account, accountLoading }) => {
    const location = useLocation();
    const isValidRoute =
        flattedPathConfigExact.indexOf(location.pathname) >= 0 ||
        flattedPathConfig.find(f => location.pathname.startsWith(f));
    const isValidFileRoute = adminEditRegexConfig.test(location.pathname);
    const isCurrentPage = pathname => pathname === document.location.pathname;

    // when the url path matches linkPattern, the shown content will be displayed
    const urlChangeAdvisory = [
        {
            linkPattern: '/courseresources',
            content: (
                <div
                    className="layout-card"
                    data-testid="courseresources-in-url"
                    style={{
                        border: 'thin solid black',
                        padding: '1rem',
                        margin: '1rem',
                    }}
                >
                    <p>
                        <b>
                            This page has permanently moved and is now available at{' '}
                            <a href="/learning-resources">Learning resources</a>.
                        </b>
                    </p>
                </div>
            ),
        },
    ];
    const pagehasMoved = urlChangeAdvisory.find(changeAdvice => isCurrentPage(changeAdvice.linkPattern));

    if (!!pagehasMoved) {
        return (
            <StandardPage standardPageId="not-found" title="Page not found">
                <Script404 account={account} accountLoading={accountLoading} />
                {urlChangeAdvisory.map(changeAdvice => {
                    return isCurrentPage(changeAdvice.linkPattern)
                        ? changeAdvice.content
                        : /* istanbul ignore next */ ''; // ignore while we only have one example
                })}
            </StandardPage>
        );
    }

    // if not known page, standard 404
    if (!isValidRoute && !isValidFileRoute) {
        return (
            <StandardPage standardPageId="not-found" title="Page not found">
                <Script404 account={account} accountLoading={accountLoading} />
                <div className="layout-card" data-testid="page-not-found">
                    <p>The requested page could not be found.</p>
                    <p>Sorry about that, but here's what you can do next:</p>
                    <ul>
                        <li>Try re-typing the address, checking for spelling, capitalisation and/or punctuation.</li>
                        <li>Start again at the home page.</li>
                        <li>
                            If you’re sure the page should be at this address, email us at{' '}
                            <a href="mailto:webmaster@library.uq.edu.au">webmaster@library.uq.edu.au</a>.
                        </li>
                    </ul>
                </div>
            </StandardPage>
        );
    }

    const isLoggedIn = accountLoading === false && !!account && !!account.id;
    const isLoggedOut = accountLoading === false && !account;

    // the page must require special priv to land here when they are logged in
    if (isLoggedIn) {
        return (
            <StandardPage standardPageId="permission-denied" title="Permission denied">
                <div className="layout-card" data-testid="permission-denied">
                    The requested page is available to authorised users only.
                </div>
            </StandardPage>
        );
    }

    // the page must require them to be logged in to land here
    /* istanbul ignore else */
    if (isLoggedOut) {
        /* istanbul ignore next */
        if (
            process.env.NODE_ENV !== 'test' &&
            process.env.NODE_ENV !== 'cc' &&
            process.env.NODE_ENV !== 'development'
        ) {
            window.location.assign(`${AUTH_URL_LOGIN}?return=${window.btoa(window.location.href)}`);
        }
        return (
            <StandardPage standardPageId="authentication-required" title="Authentication required">
                <div className="layout-card" data-testid="user-not-loggedin">
                    <p>The requested page is available to authenticated users only.</p>
                    <p>Please login to continue</p>
                </div>
            </StandardPage>
        );
    }

    /* istanbul ignore next */
    return <div className="waiting empty" />;
};

NotFound.propTypes = {
    account: PropTypes.object,
    accountLoading: PropTypes.bool,
};

export default React.memo(NotFound);
