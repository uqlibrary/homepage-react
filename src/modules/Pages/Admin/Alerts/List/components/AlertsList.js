import React, { useState } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import AlertsListAsTable from './AlertsListAsTable';
import { AlertHelpModal } from 'modules/Pages/Admin/Alerts/AlertHelpModal';

const useStyles = makeStyles(
    theme => ({
        pageLayout: {
            marginBottom: 24,
            paddingLeft: 24,
            paddingRight: 24,
            minHeight: '10em',
            minWidth: '80%',
        },
        mobileOnly: {
            [theme.breakpoints.up('sm')]: {
                display: 'none',
            },
        },
    }),
    { withTheme: true },
);

export const AlertsList = ({ actions, alerts, alertsLoading, alertsError, history }) => {
    const classes = useStyles();

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
            alerts.length > 0 &&
            alerts.forEach(alert => {
                const pastDateDuringHour = 'ddd D MMM YYYY [\n]h.mma';
                const pastDateOnTheHour = pastDateDuringHour.replace('h.mma', 'ha');
                const currentDateOnTheHour = pastDateOnTheHour.replace(' YYYY', '');
                const currentDateDuringTheHour = pastDateDuringHour.replace(' YYYY', '');
                if (moment(alert.end).isBefore(moment())) {
                    alert.startDateDisplay = moment(alert.start).format(
                        moment(alert.start).format('m') === '0' ? pastDateOnTheHour : pastDateDuringHour,
                    );
                    alert.endDateDisplay = moment(alert.end).format(
                        moment(alert.end).format('m') === '0' ? pastDateOnTheHour : pastDateDuringHour,
                    );
                } else {
                    alert.startDateDisplay = moment(alert.start).format(
                        moment(alert.start).format('m') === '0' ? currentDateOnTheHour : currentDateDuringTheHour,
                    );
                    alert.endDateDisplay = moment(alert.end).format(
                        moment(alert.end).format('m') === '0' ? currentDateOnTheHour : currentDateDuringTheHour,
                    );
                }
                // we provide a mousover with the complete data for clarity
                const fullDateFormat = 'dddd D MMMM YYYY h.mma';
                alert.startDateLong = moment(alert.start).format(fullDateFormat);
                alert.endDateLong = moment(alert.end).format(fullDateFormat);
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

    function displayApiErrorPanel() {
        return (
            <StandardPage title="Alerts Management">
                <section aria-live="assertive">
                    <StandardCard title="System temporarily unavailable" noPadding>
                        <Grid container>
                            <Grid item xs={12} data-testid="admin-alerts-list" className={classes.pageLayout}>
                                <p>
                                    We're working on the issue and will have service restored as soon as possible.
                                    Please try again later.
                                </p>
                            </Grid>
                        </Grid>
                    </StandardCard>
                </section>
            </StandardPage>
        );
    }

    function displayAllAlerts() {
        return (
            <StandardPage title="Alerts Management">
                <section aria-live="assertive">
                    <Grid container>
                        <Grid item xs={12} className={classes.mobileOnly}>
                            <p>Mobile? You might want to turn your phone sideways!</p>
                        </Grid>
                    </Grid>
                    <AlertHelpModal actions={actions} showAddButton history={history} />
                    <StandardCard title="All alerts" noPadding>
                        <Grid container>
                            <Grid item xs={12} data-testid="admin-alerts-list" className={classes.pageLayout}>
                                <div data-testid="admin-alerts-list-current-list">
                                    <h3>Current alerts</h3>
                                    {AlertsListAsTable(currentAlerts, alertsLoading, history)}
                                </div>
                                <div data-testid="admin-alerts-list-future-list">
                                    <h3>Scheduled alerts</h3>
                                    {AlertsListAsTable(futureAlerts, alertsLoading, history)}
                                </div>
                                <div data-testid="admin-alerts-list-past-list">
                                    <h3>Past alerts</h3>
                                    {AlertsListAsTable(pastAlerts, alertsLoading, history, true)}
                                </div>
                            </Grid>
                        </Grid>
                    </StandardCard>
                </section>
            </StandardPage>
        );
    }

    return displayPanel === 'error' ? displayApiErrorPanel() : displayAllAlerts();
};

AlertsList.propTypes = {
    actions: PropTypes.any,
    alerts: PropTypes.array,
    alertsLoading: PropTypes.any,
    alertsError: PropTypes.any,
    history: PropTypes.object,
};

export default React.memo(AlertsList);
