import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';
import { routes, AUTH_URL_LOGIN, AUTH_URL_LOGOUT, APP_URL } from 'config';
import locale from 'locale/global';
import browserUpdate from 'browser-update';

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

// application components
import { ContentLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import AppAlertContainer from '../containers/AppAlert';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import * as pages from './pages';
import { AccountContext } from 'context';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import UQHeader from './UQHeader';
import ChatStatus from './ChatStatus';
import { ConnectFooter, MinimalFooter } from '../../SharedComponents/Footer';
import UQSiteHeader from './UQSiteHeader';

const styles = theme => ({
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
});

export class AppClass extends PureComponent {
    static propTypes = {
        account: PropTypes.object,
        author: PropTypes.object,
        authorLoading: PropTypes.bool,
        authorDetails: PropTypes.object,
        accountLoading: PropTypes.bool,
        accountAuthorLoading: PropTypes.bool,
        accountAuthorDetailsLoading: PropTypes.bool,
        isSessionExpired: PropTypes.bool,
        actions: PropTypes.object,
        location: PropTypes.object,
        history: PropTypes.object.isRequired,
        classes: PropTypes.object,
        chatStatus: PropTypes.any,
        libHours: PropTypes.object,
        libHoursLoading: PropTypes.bool,
        trainingEvents: PropTypes.array,
        trainingEventsLoading: PropTypes.bool,
    };
    static childContextTypes = {
        userCountry: PropTypes.any,
    };

    constructor(props) {
        super(props);
        this.state = {
            chatStatus: { online: false },
        };
    }

    getChildContext() {
        return {
            userCountry: 'AU', // this.state.userCountry,
        };
    }

    componentDidMount() {
        this.props.actions.loadCurrentAccount();
        this.props.actions.loadAlerts();
        this.props.actions.loadChatStatus();
    }
    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.isSessionExpired) {
            this.sessionExpiredConfirmationBox.showConfirmation();
        }
        if (this.props.chatStatus && !!this.props.chatStatus.online) {
            this.setState({
                chatStatus: { online: true },
            });
        }
        this.props.actions.showAppAlert({
            title: 'We are open on-campus and online.',
            message: 'Access collections, services, and support to help you continue your work and study.',
            type: 'info_outline',
            action: () => (window.location.href = 'https://web.library.uq.edu.au/library-services/covid-19'),
            actionButtonLabel: 'UQ Library COVID-19 Updates',
        });
    }
    redirectUserToLogin = (isAuthorizedUser = false, redirectToCurrentLocation = false) => () => {
        const redirectUrl = isAuthorizedUser ? AUTH_URL_LOGOUT : AUTH_URL_LOGIN;
        const returnUrl = redirectToCurrentLocation || !isAuthorizedUser ? window.location.href : APP_URL;
        window.location.assign(`${redirectUrl}?url=${window.btoa(returnUrl)}`);
    };

    setSessionExpiredConfirmation = ref => {
        this.sessionExpiredConfirmationBox = ref;
    };

    render() {
        const { classes } = this.props;
        const isAuthorizedUser = !this.props.accountLoading && this.props.account !== null;
        const isAccountLoading = this.props.accountLoading;
        const isHdrStudent =
            !isAccountLoading &&
            !!this.props.account &&
            this.props.account.class &&
            this.props.account.class.indexOf('IS_CURRENT') >= 0 &&
            this.props.account.class.indexOf('IS_UQ_STUDENT_PLACEMENT') >= 0;
        const routesConfig = routes.getRoutesConfig({
            components: pages,
            authorDetails: this.props.authorDetails,
            account: this.props.account,
            accountAuthorDetailsLoading: this.props.accountAuthorDetailsLoading,
            isHdrStudent: isHdrStudent,
        });
        return (
            <Grid container className={classes.layoutFill}>
                <ConfirmDialogBox
                    hideCancelButton
                    onRef={this.setSessionExpiredConfirmation}
                    onAction={this.props.actions.logout}
                    locale={locale.global.sessionExpiredConfirmation}
                />
                <ChatStatus status={this.props.chatStatus} />
                <div className="content-container" id="content-container" role="region" aria-label="Site content">
                    <div className="content-header" role="region" aria-label="Site header">
                        <UQHeader />
                    </div>
                    <UQSiteHeader
                        isAuthorizedUser={isAuthorizedUser}
                        isHdrStudent={isHdrStudent}
                        account={this.props.account}
                        author={this.props.author}
                        authorDetails={this.props.authorDetails}
                        history={this.props.history}
                        chatStatus={!!this.props.chatStatus && this.props.chatStatus.online}
                        libHours={this.props.libHours}
                        libHoursloading={this.props.libHoursLoading}
                    />
                    <div role="region" aria-label="UQ Library Alerts">
                        <AppAlertContainer />
                    </div>
                    {!isAccountLoading && (
                        <div style={{ flexGrow: 1, marginTop: 16 }}>
                            <AccountContext.Provider
                                value={{
                                    account: {
                                        ...this.props.account,
                                        ...this.props.author,
                                        ...this.props.authorDetails,
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
                    )}
                    <div>
                        <Grid container spacing={0}>
                            <Grid item xs={12} className={classes.connectFooter}>
                                <ConnectFooter history={this.props.history} />
                            </Grid>
                            <Grid item xs={12} className={classes.minimalFooter}>
                                <MinimalFooter />
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </Grid>
        );
    }
}

const StyledApp = withStyles(styles, { withTheme: true })(AppClass);
const App = props => <StyledApp {...props} />;
export default App;
