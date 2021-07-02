import React, { useState } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

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

    const [currentAlerts, setCurrentAlerts] = useState([]);
    const [futureAlerts, setFutureAlerts] = useState([]);
    const [pastAlerts, setPastAlerts] = useState([]);
    let displayPanel = 'error';
    if (!!alertsError) {
        displayPanel = 'error';
    } else {
        displayPanel = 'listall';
    }

    React.useEffect(() => {
        if (!alertsError && !alertsLoading && !alerts) {
            actions.loadAllAlerts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        !!alerts &&
            alerts.forEach(alert => {
                alert.startDate =
                    moment(alert.start).format('m') === '0'
                        ? moment(alert.start).format('dddd D/MMM/YYYY ha')
                        : moment(alert.start).format('dddd D/MMM/YYYY h.mma');
                alert.endDate =
                    moment(alert.end).format('m') === '0'
                        ? moment(alert.end).format('dddd D/MMM/YYYY ha')
                        : moment(alert.end).format('dddd D/MMM/YYYY h.mma');
                // Strip markdown from the body
                const linkRegex = alert.body.match(/\[([^\]]+)\]\(([^)]+)\)/);
                alert.message = alert.body;
                if (!!linkRegex && linkRegex.length === 3) {
                    alert.message = alert.message.replace(linkRegex[0], '').replace('  ', ' ');
                }
                if (moment(alert.end).isBefore(moment())) {
                    setPastAlerts(pastAlerts => [...pastAlerts, alert]);
                } else if (moment(alert.start).isAfter(moment())) {
                    setFutureAlerts(futureAlerts => [...futureAlerts, alert]);
                } else {
                    setCurrentAlerts(currentAlerts => [...currentAlerts, alert]);
                }
            });
    }, [alerts]);

    const wrapFragmentInStandardPage = (fragment, title = '') => {
        return (
            <StandardPage title="Alerts Management">
                <section aria-live="assertive">
                    <StandardCard title={title} noPadding>
                        <Grid container>
                            <Grid
                                item
                                xs={12}
                                data-testid="admin-alerts-list"
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
        return wrapFragmentInStandardPage(
            <React.Fragment>
                <div data-testid="admin-alerts-list-current-list">
                    <h3>Current Alerts</h3>
                    {AlertsListAsTable(currentAlerts)}
                </div>
                <div data-testid="admin-alerts-list-future-list">
                    <h3>Scheduled Alerts</h3>
                    {AlertsListAsTable(futureAlerts)}
                </div>
                <div data-testid="admin-alerts-list-past-list">
                    <h3>Past Alerts</h3>
                    {AlertsListAsTable(pastAlerts, true)}
                </div>
            </React.Fragment>,
            'All Alerts',
        );
    }

    switch (displayPanel) {
        case 'error':
            return displayApiErrorPanel();
        default:
            return displayAllAlerts();
    }
};

AlertsAdmin.propTypes = {
    actions: PropTypes.object,
    alerts: PropTypes.array,
    alertsLoading: PropTypes.bool,
    alertsError: PropTypes.any,
};

export default React.memo(AlertsAdmin);
