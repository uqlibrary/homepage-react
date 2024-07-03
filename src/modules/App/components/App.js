import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';
import { routes } from 'config';
import browserUpdate from 'browser-update';
import { AccountContext } from 'context';
import { ContentLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import * as pages from 'modules/App/components/pages';
import Grid from '@mui/material/Grid';
import { getHomepageLink } from 'helpers/access';

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

                <uq-site-header sitetitle={homepageLabel} siteurl={homepagelink} showmenu>
                    <span slot="site-utilities">
                        <askus-button />
                    </span>
                    <span slot="site-utilities">
                        <auth-button />
                    </span>
                </uq-site-header>
                <div role="region" aria-label="UQ Library Alerts" style={{ marginBottom: -16 }}>
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
                            <Switch>
                                {routesConfig.map((route, index) => (
                                    <Route key={`route_${index}`} {...route} />
                                ))}
                            </Switch>
                        </React.Suspense>
                    </AccountContext.Provider>
                </div>
                <div id="full-footer-block">
                    <connect-footer />
                    <uq-footer />
                    {!hideForAdmin() && <proactive-chat />}
                </div>
            </div>
        </Grid>
    );
};

App.propTypes = {
    account: PropTypes.object,
    actions: PropTypes.any,
    history: PropTypes.any,
    chatStatus: PropTypes.object,
    isSessionExpired: PropTypes.any,
};

App.defaultProps = {};

export default App;
