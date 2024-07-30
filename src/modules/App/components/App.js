import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';
import { routes } from 'config';
import browserUpdate from 'browser-update';
import { AccountContext } from 'context';
import { ContentLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import * as pages from 'modules/App/components/pages';
import Grid from '@mui/material/Grid';
import { getHomepageLink } from 'modules/Pages/LearningResources/shared/learningResourcesHelpers';

browserUpdate({
    required: {
        e: -2,
        i: 11,
        f: -2,
        o: -2,
        s: -1,
        c: -2,
        samsung: 7.0,
        vivaldi: 1.2,
    },
    insecure: true,
    style: 'top',
    shift_page_down: true,
});

const hideForAdmin = () => {
    return window.location.href.includes('/admin/');
};

export const App = ({ account, actions }) => {
    useEffect(() => {
        actions.loadCurrentAccount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const routesConfig = routes.getRoutesConfig({
        components: pages,
        account: account,
    });

    const homepagelink = getHomepageLink();
    let homepageLabel = 'Library';
    /* istanbul ignore next */
    if (window.location.hostname === 'homepage-development.library.uq.edu.au') {
        homepageLabel = 'Library Dev';
    } else if (window.location.hostname === 'homepage-staging.library.uq.edu.au') {
        homepageLabel = 'Library Staging';
    } else if (window.location.hostname === 'localhost') {
        homepageLabel = 'Library Local';
    }

    const breadcrumbLabels = [
        { pathname: '/admin/alerts', title: 'Alerts admin' },
        { pathname: '/admin/dlor', title: 'Digital learning hub admin' },
        { pathname: '/admin/testntag', title: 'Test and tag' },
        { pathname: '/book-exam-booth', title: 'Book an Exam booth' },
        { pathname: '/digital-learning-hub', title: 'Digital learning hub' },
        { pathname: '/exams', title: 'Past exam papers' },
        { pathname: '/learning-resources', title: 'Learning resources' },
        { pathname: '/payment-receipt', title: 'Payment receipt' },
    ];

    let secondLevelTitle = null;
    let secondLevelUrl = null;

    function pageIsSubsystem(item) {
        return (
            window.location.pathname.startsWith(item.pathname) || window.location.hash.startsWith(`#${item.pathname}`)
        );
    }

    for (const item of breadcrumbLabels) {
        if (pageIsSubsystem(item)) {
            secondLevelTitle = item.title;
            secondLevelUrl = item.pathname;
            break; // Exit the loop once a match is found
        }
    }

    return (
        <Grid
            container
            sx={{
                position: 'relative',
                display: 'flex',
                flexFlow: 'column',
                margin: 0,
                padding: 0,
                maxHeight: '100%',
                height: '100%',
            }}
        >
            <div className="content-container" id="content-container" role="region" aria-label="Site content">
                <uq-header hidelibrarymenuitem="true" />
                {!hideForAdmin() && <cultural-advice-popup />}

                <uq-site-header
                    sitetitle={homepageLabel}
                    siteurl={homepagelink}
                    secondleveltitle={secondLevelTitle}
                    secondlevelurl={secondLevelUrl}
                    showmenu
                >
                    <span slot="site-utilities">
                        <askus-button />
                    </span>
                    <span slot="site-utilities">
                        <auth-button />
                    </span>
                </uq-site-header>
                {!hideForAdmin() && <proactive-chat />}
                <div role="region" aria-label="UQ Library Alerts">
                    <alert-list system="homepage" />
                </div>
                <div style={{ flexGrow: 1, marginTop: 16 }}>
                    <a name="content" />
                    <AccountContext.Provider
                        value={{
                            account: {
                                ...account,
                            },
                        }}
                    >
                        <React.Suspense fallback={<ContentLoader message="Loading" />}>
                            <Routes>
                                {routesConfig.map((route, index) => (
                                    <Route key={`route_${index}`} {...route} />
                                ))}
                            </Routes>
                        </React.Suspense>
                    </AccountContext.Provider>
                </div>
                <div id="full-footer-block">
                    <connect-footer />
                    <uq-footer />
                </div>
            </div>
        </Grid>
    );
};

App.propTypes = {
    account: PropTypes.object,
    actions: PropTypes.any,
    chatStatus: PropTypes.object,
    isSessionExpired: PropTypes.any,
};

export default App;
