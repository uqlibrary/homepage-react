import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';
import { routes } from 'config';
import browserUpdate from 'browser-update';
import { AccountContext } from 'context';
import { ContentLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import * as pages from 'modules/App/components/pages';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { isHdrStudent } from 'helpers/access';
import { STORAGE_ACCOUNT_KEYNAME } from 'config/general';

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
        [theme.breakpoints.down('sm')]: {
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

export const App = ({ account, actions }) => {
    console.log('App start');
    useEffect(() => {
        // ideally we would just do window.addEventListener('storage' ...)
        // but that watcher doesn't work within the same window
        // so reusable will broadcast when it has written to storage
        /* istanbul ignore else */
        if ('BroadcastChannel' in window) {
            const bc = new BroadcastChannel('account_availability');
            console.log('now waiting on broadcasts', bc);
            /* istanbul ignore next */
            bc.onmessage = messageEvent => {
                if (messageEvent.data === 'account_updated') {
                    console.log('BroadcastChannel message account_updated');
                    actions.loadCurrentAccount();
                } else if (messageEvent.data === 'account_removed') {
                    console.log('BroadcastChannel message account_removed');
                    actions.logout();
                } else {
                    console.log('bc unknown message, messageEvent.data=', messageEvent.data);
                }
                return null;
            };
        }
        console.log('after BroadcastChannel');

        // if the reusable started much quicker than this, homepage won't have been up to receive the message
        // but the storage will be present
        const getStoredUserDetails = setInterval(() => {
            const storedUserDetailsRaw = sessionStorage.getItem(STORAGE_ACCOUNT_KEYNAME);
            const storedUserDetails = !!storedUserDetailsRaw && JSON.parse(storedUserDetailsRaw);
            if (
                storedUserDetails?.hasOwnProperty('status') &&
                (storedUserDetails.status === 'loggedin' || storedUserDetails.status === 'loggedout')
            ) {
                clearInterval(getStoredUserDetails);

                console.log('session storage found, load current account');
                actions.loadCurrentAccount();
            } else {
                console.log('looping for account session stirafe');
            }
        }, 100);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const classes = useStyles();
    const routesConfig = routes.getRoutesConfig({
        components: pages,
        account: account,
        isHdrStudent: isHdrStudent,
    });

    let homepagelink = 'http://www.library.uq.edu.au';
    let homepageLabel = 'Library';
    /* istanbul ignore next */
    if (window.location.hostname === 'homepage-development.library.uq.edu.au') {
        homepagelink = `${window.location.protocol}//${window.location.hostname}${window.location.pathname}#/`;
        homepageLabel = 'Library Dev Homepage';
    } else if (window.location.hostname === 'localhost') {
        const homepagePort = '2020';
        homepagelink = `${window.location.protocol}//${window.location.hostname}:${homepagePort}/`;
        homepageLabel = 'Library Local Homepage';
    }

    return (
        <Grid container className={classes.layoutFill}>
            <div className="content-container" id="content-container" role="region" aria-label="Site content">
                <uq-header
                    hidelibrarymenuitem="true"
                    searchlabel="library.uq.edu.au"
                    searchurl="http://library.uq.edu.au"
                />
                <cultural-advice-popup />
                <uq-site-header sitetitle={homepageLabel} siteurl={homepagelink} showmenu>
                    <span slot="site-utilities">
                        <askus-button />
                    </span>
                    <span slot="site-utilities">
                        <div id="mylibrarystub" />
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
                    <proactive-chat />
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
