import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
const moment = require('moment');

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';

import { AlertHelpModal } from 'modules/Pages/Admin/Alerts/AlertHelpModal';
import { AlertForm } from 'modules/Pages/Admin/Alerts/AlertForm';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

const useStyles = makeStyles(() => ({
    previewWrapper: {
        transition: 'visibility 0s, opacity 10s ease-out',
    },
}));

export const AlertsAdd = ({ actions, alert, alertError, alertStatus, history }) => {
    const classes = useStyles();
    const defaultStartTime = moment().format('YYYY-MM-DDTHH:mm');
    const defaultEndTime = moment()
        .endOf('day')
        .format('YYYY-MM-DDTHH:mm');

    const defaults = {
        id: '',
        startDate: defaultStartTime,
        endDate: defaultEndTime,
        alertTitle: '',
        body: '',
        enteredbody: '',
        linkRequired: false,
        urgent: false,
        permanentAlert: false,
        linkTitle: '',
        linkUrl: '',
        type: 'add',
        minimumDate: defaultStartTime,
    };
    return (
        <Fragment>
            <Grid container style={{ paddingBottom: '1em', display: 'block' }}>
                <Grid item id="previewWrapper" className={classes.previewWrapper} />
            </Grid>
            <StandardPage title="Alerts Management">
                <section aria-live="assertive">
                    <AlertHelpModal actions={actions} history={history} />
                    <StandardCard title="Create Alert" noPadding>
                        <AlertForm
                            actions={actions}
                            alert={alert}
                            alertError={alertError}
                            alertStatus={alertStatus}
                            history={history}
                            defaults={defaults}
                        />
                    </StandardCard>
                </section>
            </StandardPage>
        </Fragment>
    );
};

AlertsAdd.propTypes = {
    actions: PropTypes.any,
    alert: PropTypes.any,
    alertError: PropTypes.any,
    alertStatus: PropTypes.any,
    history: PropTypes.object,
};

export default AlertsAdd;
