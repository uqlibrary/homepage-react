import React, { useState } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import Modal from '@material-ui/core/Modal';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import AlertsListAsTable from './AlertsListAsTable';
import { default as locale } from '../../alertsadmin.locale';
import { getUserPostfix } from 'helpers/general';
import { fullPath } from 'config/routes';

const useStyles = makeStyles(
    theme => ({
        pageLayout: {
            marginBottom: 24,
            paddingLeft: 24,
            paddingRight: 24,
            minHeight: '10em',
            minWidth: '80%',
        },
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflowY: 'scroll',
            maxHeight: '75%',
            paddingTop: '30%',
        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
            maxWidth: '75%',
            marginTop: 64,
            marginBottom: 64,
        },
        actionbutton: {
            backgroundColor: theme.palette.accent.main,
            padding: 8,
            color: '#fff',
            textTransform: 'uppercase',
            borderWidth: 0,
        },
        actionButtonPlacer: {
            float: 'right',
            marginTop: 16,
            marginRight: 16,
        },
        actionButtonWrapper: {
            position: 'relative',
        },
    }),
    { withTheme: true },
);

export const AlertsList = ({ actions, alerts, alertsLoading, alertsError }) => {
    const classes = useStyles();

    const [currentAlerts, setCurrentAlerts] = useState([]);
    const [futureAlerts, setFutureAlerts] = useState([]);
    const [pastAlerts, setPastAlerts] = useState([]);

    const [lightboxOpen, setLightboxOpen] = useState(false);

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

    const openHelpLightbox = () => {
        setLightboxOpen(true);
    };

    const closeHelpLightbox = () => {
        setLightboxOpen(false);
    };

    const navigateToAddPage = () => {
        const userString = getUserPostfix();
        console.log(
            'navigateToListPage: go to ',
            fullPath + window.location.pathname.replace('/alerts', `/alerts/add${userString}`),
        );
        window.location.href = fullPath + window.location.pathname.replace('/alerts', `/alerts/add${userString}`);
    };

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
                <section aria-live="assertive" className={classes.helpButtonWrapper}>
                    <div className={classes.actionButtonPlacer}>
                        <button
                            className={classes.actionbutton}
                            onClick={openHelpLightbox}
                            data-testid="admin-alerts-list-help-button"
                        >
                            Help / Info
                        </button>
                    </div>
                    <div className={classes.actionButtonPlacer}>
                        <button
                            className={classes.actionbutton}
                            onClick={() => navigateToAddPage()}
                            data-testid="admin-alerts-list-add-button"
                        >
                            Add alert
                        </button>
                    </div>
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        className={classes.modal}
                        open={lightboxOpen}
                        onClose={closeHelpLightbox}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                            timeout: 500,
                        }}
                        disableScrollLock
                    >
                        <Fade in={lightboxOpen}>
                            <div className={classes.paper}>{locale.helpPopupText}</div>
                        </Fade>
                    </Modal>
                    <StandardCard title="All Alerts" noPadding>
                        <Grid container>
                            <Grid item xs={12} data-testid="admin-alerts-list" className={classes.pageLayout}>
                                <div data-testid="admin-alerts-list-current-list">
                                    <h3>Current Alerts</h3>
                                    {AlertsListAsTable(currentAlerts, alertsLoading)}
                                </div>
                                <div data-testid="admin-alerts-list-future-list">
                                    <h3>Scheduled Alerts</h3>
                                    {AlertsListAsTable(futureAlerts, alertsLoading)}
                                </div>
                                <div data-testid="admin-alerts-list-past-list">
                                    <h3>Past Alerts</h3>
                                    {AlertsListAsTable(pastAlerts, alertsLoading, true)}
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
    alertsLoading: PropTypes.bool,
    alertsError: PropTypes.any,
};

export default React.memo(AlertsList);
