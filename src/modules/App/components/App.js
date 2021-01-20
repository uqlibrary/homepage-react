import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';
import { routes } from 'config';
import browserUpdate from 'browser-update';
import { AccountContext } from 'context';
import { ContentLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import AppAlertContainer from '../containers/AppAlert';
import * as pages from './pages';
import Grid from '@material-ui/core/Grid';
import UQHeader from './UQHeader';
import ChatStatus from './ChatStatus';
import { ConnectFooter, MinimalFooter } from 'modules/SharedComponents/Footer';
import UQSiteHeader from './UQSiteHeader';
import { makeStyles } from '@material-ui/core/styles';

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
        backgroundColor: theme.hexToRGBA(theme.palette.secondary.main, 0.15),
    },
    minimalFooter: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.white.main,
        backgroundImage: 'linear-gradient(90deg,#51247a,87%,#962a8b)',
    },
}));

export const App = ({
    account,
    author,
    authorDetails,
    accountLoading,
    accountAuthorDetailsLoading,
    actions,
    chatStatus,
    libHours,
    libHoursLoading,
    history,
}) => {
    useEffect(() => {
        actions.loadCurrentAccount();
        actions.loadAlerts();
        actions.loadChatStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const classes = useStyles();
    const isAuthorizedUser = accountLoading === false && account !== null;
    const isAccountLoading = accountLoading;
    const isHdrStudent =
        !isAccountLoading &&
        !!account &&
        account.class &&
        account.class.indexOf('IS_CURRENT') >= 0 &&
        account.class.indexOf('IS_UQ_STUDENT_PLACEMENT') >= 0;
    const routesConfig = routes.getRoutesConfig({
        components: pages,
        authorDetails: authorDetails,
        account: account,
        accountAuthorDetailsLoading: accountAuthorDetailsLoading,
        isHdrStudent: isHdrStudent,
    });
    return (
        <Grid container className={classes.layoutFill}>
            {chatStatus && (chatStatus.online === true || chatStatus.online === false) && (
                <ChatStatus status={chatStatus} />
            )}
            <div className="content-container" id="content-container" role="region" aria-label="Site content">
                <div className="content-header" role="region" aria-label="Site header">
                    <UQHeader />
                </div>
                <UQSiteHeader
                    isAuthorizedUser={isAuthorizedUser}
                    isHdrStudent={isHdrStudent}
                    account={account}
                    accountLoading={isAccountLoading}
                    author={author}
                    authorDetails={authorDetails}
                    history={history}
                    chatStatus={!!chatStatus && chatStatus.online}
                    libHours={libHours}
                    libHoursloading={libHoursLoading}
                />
                <div role="region" aria-label="UQ Library Alerts">
                    <AppAlertContainer />
                </div>
                <div style={{ flexGrow: 1, marginTop: 16 }}>
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
                <div>
                    <Grid container spacing={0}>
                        <Grid item xs={12} className={classes.connectFooter}>
                            <ConnectFooter history={history} />
                        </Grid>
                        <Grid item xs={12} className={classes.minimalFooter}>
                            <MinimalFooter />
                        </Grid>
                    </Grid>
                </div>
            </div>
        </Grid>
    );
};

App.propTypes = {
    account: PropTypes.object,
    accountLoading: PropTypes.bool,
    accountAuthorDetailsLoading: PropTypes.bool,
    author: PropTypes.object,
    authorDetails: PropTypes.object,
    actions: PropTypes.any,
    history: PropTypes.any,
    libHours: PropTypes.object,
    libHoursLoading: PropTypes.bool,
    chatStatus: PropTypes.object,
    isSessionExpired: PropTypes.any,
};

App.defaultProps = {};

export default App;
