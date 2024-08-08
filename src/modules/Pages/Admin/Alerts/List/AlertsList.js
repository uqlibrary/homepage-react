import React, { useState } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import Grid from '@mui/material/Grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import AlertsListAsTable from './AlertsListAsTable';
import { AlertsUtilityArea } from 'modules/Pages/Admin/Alerts/AlertsUtilityArea';
import { default as locale } from '../alertsadmin.locale';
import { styled } from '@mui/material/styles';

const StyledPageLayout = styled(Grid)(() => ({
    marginBottom: 24,
    paddingLeft: 24,
    paddingRight: 24,
    minHeight: '10em',
    minWidth: '80%',
}));

const StyledMobileView = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.up('sm')]: {
        display: 'none',
    },
    '& p': {
        backgroundColor: theme.palette.warning.light,
        color: '#000',
        fontWeight: 'bold',
        padding: 6,
        textAlign: 'center',
    },
}));

export const AlertsList = ({ actions, alerts, alertsLoading, alertsError }) => {
    const [currentAlerts, setCurrentAlerts] = useState([]);
    const [futureAlerts, setFutureAlerts] = useState([]);
    const [pastAlerts, setPastAlerts] = useState([]);

    React.useEffect(() => {
        /* istanbul ignore else */
        if (!alertsError && !alertsLoading && !alerts) {
            actions.loadAllAlerts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (!!alerts && alerts.length > 0) {
            setPastAlerts([]);
            setFutureAlerts([]);
            setCurrentAlerts([]);
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
        }
    }, [alerts]);

    /* istanbul ignore next */
    if (!!alertsError) {
        return (
            <StandardPage title="Alerts Management">
                <section aria-live="assertive">
                    <StandardCard title="System temporarily unavailable" noPadding>
                        <Grid container>
                            <StyledPageLayout item xs={12} data-testid="admin-alerts-list-error">
                                <p>
                                    We're working on the issue and will have service restored as soon as possible.
                                    Please try again later.
                                </p>
                            </StyledPageLayout>
                        </Grid>
                    </StandardCard>
                </section>
            </StandardPage>
        );
    }

    /* istanbul ignore next */
    const deleteAlert = alertID => {
        // this is called, but the coverage isn't happening
        return actions.deleteAlert(alertID);
    };

    return (
        <StandardPage title="Alerts Management">
            <section aria-live="assertive">
                <Grid container>
                    <StyledMobileView item xs={12}>
                        <p>Mobile? You might want to turn your phone sideways!</p>
                    </StyledMobileView>
                </Grid>
                <AlertsUtilityArea
                    actions={actions}
                    helpContent={locale.listPage.help}
                    showAddButton
                />
                <StandardCard title="All alerts" noPadding>
                    <Grid container>
                        <StyledPageLayout item xs={12} id="admin-alerts-list" data-testid="admin-alerts-list">
                            <div data-testid="admin-alerts-list-current-list">
                                <AlertsListAsTable
                                    rows={currentAlerts}
                                    headertag="Current alerts"
                                    alertsLoading={alertsLoading}
                                    actions={actions}
                                    deleteAlert={deleteAlert}
                                    alertOrder="forwardEnd"
                                />
                            </div>
                            <div data-testid="admin-alerts-list-future-list">
                                <AlertsListAsTable
                                    rows={futureAlerts}
                                    headertag="Scheduled alerts"
                                    alertsLoading={alertsLoading}
                                    actions={actions}
                                    deleteAlert={deleteAlert}
                                    alertOrder="forwardStart"
                                />
                            </div>
                            <div data-testid="admin-alerts-list-past-list">
                                <AlertsListAsTable
                                    rows={pastAlerts}
                                    headertag="Past alerts"
                                    alertsLoading={alertsLoading}
                                    actions={actions}
                                    deleteAlert={deleteAlert}
                                    alertOrder="reverseEnd"
                                />
                            </div>
                        </StyledPageLayout>
                    </Grid>
                </StandardCard>
            </section>
        </StandardPage>
    );
};

AlertsList.propTypes = {
    actions: PropTypes.any,
    alerts: PropTypes.array,
    alertsLoading: PropTypes.any,
    alertsError: PropTypes.any,
};

export default React.memo(AlertsList);
