import React from 'react';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
// import { makeStyles } from '@material-ui/styles';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { AUTH_URL_LOGIN, AUTH_URL_LOGOUT } from 'config';
import { default as menuLocale } from 'locale/menu';

// const useStyles = makeStyles(
//     () => ({
//         followLink: {},
//     }),
//     { withTheme: true },
// );

export const AlertsAdmin = ({ actions, account, alerts, alertsLoading, alertsError }) => {
    // const classes = useStyles();

    let displayPanel = 'error';
    let redirectLink = null;
    if (!account || !account.id) {
        displayPanel = 'loginRequired';
        redirectLink = `${AUTH_URL_LOGIN}?return=${window.btoa(window.location.href)}`;
    } else if (!!alertsError) {
        displayPanel = 'error';
    } else if (!alertsError && !!alertsLoading) {
        displayPanel = 'loading';
    } else if (!alertsError && !alertsLoading && !alerts) {
        // does this actually happen?
        displayPanel = 'loading';
    } else {
        displayPanel = 'listall';
    }

    React.useEffect(() => {
        if (!!account && !alertsError && !alertsLoading && !alerts) {
            actions.loadAllAlerts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const wrapFragmentInStandardPage = (title, fragment) => {
        return (
            <StandardPage title="Alerts Management">
                <section aria-live="assertive">
                    <StandardCard title={title} noPadding>
                        <Grid container>
                            <Grid
                                item
                                xs={12}
                                data-testid="admin-alerts"
                                style={{ marginBottom: 24, paddingLeft: 24, paddingRight: 24 }}
                            >
                                {fragment}
                            </Grid>
                        </Grid>
                    </StandardCard>
                </section>
            </StandardPage>
        );
    };

    function displayApiErrorPanel() {
        return wrapFragmentInStandardPage(
            'System temporarily unavailable',
            <React.Fragment>
                <p>
                    We're working on the issue and will have service restored as soon as possible. Please try again
                    later.
                </p>
            </React.Fragment>,
        );
    }

    function displayNoAccessPanel() {
        const logoutLink = `${AUTH_URL_LOGOUT}?return=${window.btoa(window.location.href)}`;
        return wrapFragmentInStandardPage(
            'Access to this file is only available to UQ staff and students.',
            <React.Fragment>
                <ul>
                    <li>
                        If you have another UQ account, <a href={logoutLink}>logout and switch accounts</a> to proceed.
                    </li>
                    <li>
                        <a href={menuLocale.contactus.link}>Contact us</a> if you should have file collection access
                        with this account.
                    </li>
                </ul>
                <p>
                    Return to the <a href="https://www.library.uq.edu.au/">Library Home Page</a>.
                </p>
            </React.Fragment>,
        );
    }

    // the window is set to the auth url before this panel is displayed, so it should only blink up, if at all
    function displayLoginRequiredRedirectorPanel(redirectLink) {
        /* istanbul ignore else */
        if (redirectLink !== null) {
            window.location.assign(redirectLink);
        }
        return wrapFragmentInStandardPage(
            'Redirecting',
            <React.Fragment>
                <p>Login is required for this page - please wait while you are redirected.</p>

                <Grid item xs={'auto'} style={{ width: 80, marginRight: 20, marginBottom: 6, opacity: 0.3 }}>
                    <CircularProgress color="primary" size={20} data-testid="loading-admin-alerts-login" />
                </Grid>

                <p>
                    You can <a href={redirectLink}>click here</a> if you aren't redirected.
                </p>
            </React.Fragment>,
        );
    }

    console.log('displayPanel = ', displayPanel);
    switch (displayPanel) {
        case 'error':
            return displayApiErrorPanel();
        case 'loading':
            console.log('here');
            return wrapFragmentInStandardPage(
                <Grid item xs={'auto'} style={{ width: 80, marginRight: 20, marginBottom: 6, opacity: 0.3 }}>
                    <CircularProgress color="primary" size={20} data-testid="loading-admin-alerts" />
                </Grid>,
            );
        case 'loginRequired':
            return displayLoginRequiredRedirectorPanel(redirectLink);
        case 'invalidUser':
            return displayNoAccessPanel();
        /* istanbul ignore next */
        default:
            // to satisfy switch syntax - shouldnt be possible
            return wrapFragmentInStandardPage('', <div className="waiting empty">Something went wrong</div>);
    }
};

AlertsAdmin.propTypes = {
    actions: PropTypes.object,
    account: PropTypes.object,
    alerts: PropTypes.object,
    alertsLoading: PropTypes.bool,
    alertsError: PropTypes.any,
};

export default React.memo(AlertsAdmin);
