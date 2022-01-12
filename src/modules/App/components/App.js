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
import { getAccountFromStorage } from 'actions';

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

export const App = ({ account, authorDetails, accountAuthorDetailsLoading, actions }) => {
    useEffect(() => {
        actions.loadCurrentAccount();

        // on first load, if the user didn't have a cookie, the loadCurrentAccount above didnt ask api for account.
        // reusable will load the sessionstorage when login succeeds
        // so watch for the mylibrary button to appear, as only logged-in users have it, then try again
        const accountDetails = getAccountFromStorage();
        console.log('App::: accountDetails =', accountDetails);
        if (!accountDetails) {
            console.log('App::: observing mylibrary');
            const targetNode = document.getElementById('mylibrarystub');

            if (!!targetNode) {
                // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
                const observer = new MutationObserver(function observeMylibraryButtonStub(e) {
                    console.log('App::: mylibrary stub changed');
                    if (e[0].removedNodes) {
                        console.log('App::: mylibrary stub removed');
                        actions.loadCurrentAccount();

                        observer.disconnect();
                    }
                });

                observer.observe(targetNode, { attributes: true });
            } else {
                console.log('App::: mylibrary stub already replaced?');
                actions.loadCurrentAccount();
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const classes = useStyles();
    const routesConfig = routes.getRoutesConfig({
        components: pages,
        authorDetails: authorDetails,
        account: account,
        accountAuthorDetailsLoading: accountAuthorDetailsLoading,
        isHdrStudent: isHdrStudent,
    });
    return (
        <Grid container className={classes.layoutFill}>
            <div className="content-container" id="content-container" role="region" aria-label="Site content">
                <uq-header
                    hidelibrarymenuitem="true"
                    searchlabel="library.uq.edu.au"
                    searchurl="http://library.uq.edu.au"
                />
                <uq-site-header sitetitle="Library" siteurl="http://www.library.uq.edu.au" showmenu>
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
                </div>
            </div>
        </Grid>
    );
};

App.propTypes = {
    account: PropTypes.object,
    accountAuthorDetailsLoading: PropTypes.bool,
    authorDetails: PropTypes.object,
    actions: PropTypes.any,
    history: PropTypes.any,
    chatStatus: PropTypes.object,
    isSessionExpired: PropTypes.any,
};

App.defaultProps = {};

export default App;
