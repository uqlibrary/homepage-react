import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';
import { routes } from 'config';
import browserUpdate from 'browser-update';
import { AccountContext } from 'context';
import { ContentLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import * as pages from 'modules/App/components/pages';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';
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

const useStyles = makeStyles(theme => ({
    appBG: {
        ...theme.palette.primary.main,
    },
    layoutCard: {
        width: '100%',
        padding: 0,
        [theme.breakpoints.down('md')]: {
            margin: '0 auto 24px auto',
        },
    },
    layoutFill: {
        position: 'relative',
        display: 'flex',
        flexFlow: 'column',
        margin: 0,
        padding: 0,
        maxHeight: '100%',
        height: '100%',
    },
    titleLink: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        color: theme.palette.common.white,
        '& a': {
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline',
            },
        },
    },
    nowrap: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    connectFooter: {
        marginTop: 50,
        backgroundColor: theme.hexToRGBA(theme.palette.secondary.light, 0.15),
    },
    minimalFooter: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.white.main,
        backgroundImage: 'linear-gradient(90deg,#51247a,87%,#962a8b)',
    },
}));

const hideForAdmin = () => {
    return window.location.href.includes('/admin/');
};

export const App = ({ account, actions }) => {
    useEffect(() => {
        actions.loadCurrentAccount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const classes = useStyles();
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
        <Grid container className={classes.layoutFill}>
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
