import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';
import { routes, AUTH_URL_LOGIN, AUTH_URL_LOGOUT, APP_URL } from 'config';
import locale from 'locale/global';
import browserUpdate from 'browser-update';
import Header from './Header';

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
import { AppLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { ContentLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import AppAlertContainer from '../containers/AppAlert';
import { Meta } from 'modules/SharedComponents/Meta';
import { OfflineSnackbar } from 'modules/SharedComponents/OfflineSnackbar';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { HelpDrawer } from 'modules/SharedComponents/Toolbox/HelpDrawer';
import * as pages from './pages';
import { AccountContext } from 'context';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Megamenu from './Megamenu';

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
});

export class AppClass extends PureComponent {
    static propTypes = {
        account: PropTypes.object,
        author: PropTypes.object,
        authorDetails: PropTypes.object,
        accountLoading: PropTypes.bool,
        accountAuthorLoading: PropTypes.bool,
        accountAuthorDetailsLoading: PropTypes.bool,
        isSessionExpired: PropTypes.bool,
        actions: PropTypes.object,
        location: PropTypes.object,
        history: PropTypes.object.isRequired,
        classes: PropTypes.object,
    };
    static childContextTypes = {
        userCountry: PropTypes.any,
        isMobile: PropTypes.bool,
        selectFieldMobileOverrides: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            menuDrawerOpen: false,
            docked: false,
            mediaQuery: window.matchMedia('(min-width: 1280px)'),
            isMobile: window.matchMedia('(max-width: 720px)').matches,
        };
    }

    getChildContext() {
        return {
            userCountry: 'AU', // this.state.userCountry,
            isMobile: this.state.isMobile,
            selectFieldMobileOverrides: {
                style: !this.state.isMobile ? { width: '100%' } : {},
                autoWidth: !this.state.isMobile,
                fullWidth: this.state.isMobile,
                menuItemStyle: this.state.isMobile
                    ? {
                          whiteSpace: 'normal',
                          lineHeight: '18px',
                          paddingBottom: '8px',
                      }
                    : {},
            },
        };
    }

    componentDidMount() {
        this.props.actions.loadCurrentAccount();
        this.handleResize(this.state.mediaQuery);
        this.state.mediaQuery.addListener(this.handleResize);
    }
    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.isSessionExpired) {
            this.sessionExpiredConfirmationBox.showConfirmation();
        }
    }

    componentWillUnmount() {
        this.state.mediaQuery.removeListener(this.handleResize);
    }

    handleResize = mediaQuery => {
        this.setState({
            docked: mediaQuery.matches,
        });
    };

    toggleMenu = () => {
        this.setState({
            menuDrawerOpen: !this.state.menuDrawerOpen,
        });
    };

    redirectUserToLogin = (isAuthorizedUser = false, redirectToCurrentLocation = false) => () => {
        const redirectUrl = isAuthorizedUser ? AUTH_URL_LOGOUT : AUTH_URL_LOGIN;
        const returnUrl = redirectToCurrentLocation || !isAuthorizedUser ? window.location.href : APP_URL;
        window.location.assign(`${redirectUrl}?url=${window.btoa(returnUrl)}`);
    };

    isPublicPage = menuItems => {
        return (
            menuItems.filter(menuItem => this.props.location.pathname === menuItem.linkTo && menuItem.public).length >
                0 ||
            new RegExp(routes.pathConfig.records.view(`(${routes.pidRegExp})`)).test(this.props.location.pathname)
        );
    };

    setSessionExpiredConfirmation = ref => {
        this.sessionExpiredConfirmationBox = ref;
    };

    render() {
        const { classes } = this.props;
        if (this.props.accountLoading) {
            return (
                <Grid container className={classes.layoutFill}>
                    <Grid zeroMinWidth item xs={12}>
                        <AppLoader
                            title={locale.global.title}
                            logoImage="largeLogo"
                            logoText={locale.global.logo.label}
                        />
                    </Grid>
                </Grid>
            );
        }

        const isAuthorizedUser = !this.props.accountLoading && this.props.account !== null;
        const isAuthorLoading = this.props.accountLoading || this.props.accountAuthorLoading;
        const isHdrStudent =
            !isAuthorLoading &&
            !!this.props.account &&
            this.props.account.class &&
            this.props.account.class.indexOf('IS_CURRENT') >= 0 &&
            this.props.account.class.indexOf('IS_UQ_STUDENT_PLACEMENT') >= 0;
        const menuItems = routes.getMenuConfig(
            this.props.account,
            this.props.author,
            this.props.authorDetails,
            isHdrStudent && !false,
            false,
        );
        const isPublicPage = this.isPublicPage(menuItems);

        let userStatusAlert = null;
        if (!this.props.accountLoading && !this.props.account && !isPublicPage) {
            // user is not logged in
            userStatusAlert = {
                ...locale.global.loginAlert,
                action: this.redirectUserToLogin(),
            };
        } else if (!isPublicPage && !isAuthorLoading && this.props.account && !this.props.author) {
            // user is logged in, but doesn't have eSpace author identifier
            userStatusAlert = {
                ...locale.global.notRegisteredAuthorAlert,
            };
        }
        const routesConfig = routes.getRoutesConfig({
            components: pages,
            authorDetails: this.props.authorDetails,
            account: this.props.account,
            accountAuthorDetailsLoading: this.props.accountAuthorDetailsLoading,
            isHdrStudent: isHdrStudent,
        });
        // const titleStyle = this.state.docked && true ? { paddingLeft: 284 } : { paddingLeft: 0 };
        return (
            <Grid container className={classes.layoutFill}>
                <Grid item xs={12}>
                    <Alert
                        title="TEST ALERT"
                        message="This is just a quick test"
                        type="warning"
                        dismissAction={() => null}
                        allowDismiss
                    />
                </Grid>
                <Meta routesConfig={routesConfig} />
                <Header
                    isAuthorizedUser={isAuthorizedUser}
                    toggleDrawer={this.toggleMenu}
                    drawerOpen={this.state.docked || this.state.menuDrawerOpen}
                />
                <Megamenu
                    menuItems={menuItems}
                    history={this.props.history}
                    isMobile={this.state.isMobile}
                    locale={{
                        skipNavAriaLabel: locale.global.skipNav.ariaLabel,
                        skipNavTitle: locale.global.skipNav.title,
                        closeMenuLabel: locale.global.mainNavButton.closeMenuLabel,
                    }}
                    drawerOpen={this.state.docked || this.state.menuDrawerOpen}
                />
                <div className="content-container" id="content-container">
                    <ConfirmDialogBox
                        hideCancelButton
                        onRef={this.setSessionExpiredConfirmation}
                        onAction={this.props.actions.logout}
                        locale={locale.global.sessionExpiredConfirmation}
                    />
                    {userStatusAlert && (
                        <Grid
                            container
                            alignContent="center"
                            justify="center"
                            alignItems="center"
                            style={{ marginBottom: 12 }}
                        >
                            <Grid item className={classes.layoutCard} style={{ marginTop: 0, marginBottom: 0 }}>
                                <Alert {...userStatusAlert} />
                            </Grid>
                        </Grid>
                    )}
                    <AppAlertContainer />
                    {isAuthorLoading && <InlineLoader message={locale.global.loadingUserAccount} />}

                    {!isAuthorLoading && (
                        <AccountContext.Provider
                            value={{
                                account: { ...this.props.account, ...this.props.author, ...this.props.authorDetails },
                            }}
                        >
                            <React.Suspense fallback={<ContentLoader message="Loading content" />}>
                                <Switch>
                                    {routesConfig.map((route, index) => (
                                        <Route key={`route_${index}`} {...route} />
                                    ))}
                                </Switch>
                            </React.Suspense>
                        </AccountContext.Provider>
                    )}
                </div>
                <HelpDrawer />
                <OfflineSnackbar />
            </Grid>
        );
    }
}

const StyledApp = withStyles(styles, { withTheme: true })(AppClass);
const App = props => <StyledApp {...props} />;
export default App;
