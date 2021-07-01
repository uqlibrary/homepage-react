// import React, { useState } from 'react';
import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
// import { makeStyles } from '@material-ui/styles';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import AlertsListAsTable from './AlertsListAsTable';

// const useStyles = makeStyles(
//     () => ({
//         editButton: {
//             backgroundColor: '#0e62eb',
//             color: '#fff',
//             padding: '1em',
//         },
//     }),
//     { withTheme: true },
// );

export const AlertsAdmin = ({ actions, alerts, alertsLoading, alertsError }) => {
    // const classes = useStyles();

    let displayPanel = 'error';
    if (!!alertsError) {
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
        if (!alertsError && !alertsLoading && !alerts) {
            actions.loadAllAlerts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const wrapFragmentInStandardPage = (fragment, title = '') => {
        return (
            <StandardPage title="Alerts Management">
                <section aria-live="assertive">
                    <StandardCard title={title} noPadding>
                        <Grid container>
                            <Grid
                                item
                                xs={12}
                                data-testid="admin-alerts"
                                style={{
                                    marginBottom: 24,
                                    paddingLeft: 24,
                                    paddingRight: 24,
                                    minHeight: '10em',
                                    minWidth: '80%',
                                }}
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
            <React.Fragment>
                <p>
                    We're working on the issue and will have service restored as soon as possible. Please try again
                    later.
                </p>
            </React.Fragment>,
            'System temporarily unavailable',
        );
    }

    function displayAllAlerts() {
        const currentAlerts = [];
        const futureAlerts = [];
        const pastAlerts = [];
        alerts.forEach(alert => {
            if (moment(alert.end).isBefore(moment())) {
                pastAlerts.push(alert);
            } else if (moment(alert.start).isAfter(moment())) {
                futureAlerts.push(alert);
            } else {
                currentAlerts.push(alert);
            }
        });
        return wrapFragmentInStandardPage(
            <React.Fragment>
                <h3>Current Alerts</h3>
                {AlertsListAsTable(currentAlerts, alertsLoading)}
                <h3>Scheduled Alerts</h3>
                {AlertsListAsTable(futureAlerts, alertsLoading)}
                <h3>Past Alerts</h3>
                {AlertsListAsTable(pastAlerts, alertsLoading, true)}
            </React.Fragment>,
        );
    }

    console.log('displayPanel = ', displayPanel);
    switch (displayPanel) {
        case 'error':
            return displayApiErrorPanel();
        case 'loading':
            return wrapFragmentInStandardPage(
                <Grid
                    item
                    xs={'auto'}
                    style={{
                        width: 80,
                        marginRight: 20,
                        marginBottom: 6,
                        opacity: 0.3,
                    }}
                >
                    <CircularProgress color="primary" size={20} data-testid="loading-admin-alerts" />
                </Grid>,
            );
        case 'listall':
            return displayAllAlerts();
        /* istanbul ignore next */
        default:
            // to satisfy switch syntax - shouldnt be possible
            return wrapFragmentInStandardPage(<div className="waiting empty">Something went wrong</div>, '');
    }
};

AlertsAdmin.propTypes = {
    actions: PropTypes.object,
    alerts: PropTypes.array,
    alertsLoading: PropTypes.bool,
    alertsError: PropTypes.any,
};

export default React.memo(AlertsAdmin);
