import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
const moment = require('moment');

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { AlertHelpModal } from 'modules/Pages/Admin/Alerts/AlertHelpModal';
import { AlertForm } from 'modules/Pages/Admin/Alerts/AlertForm';
import { defaultStartTime, defaultEndTime } from '../../alerthelpers';

const useStyles = makeStyles(() => ({
    previewWrapper: {
        transition: 'visibility 0s, opacity 10s ease-out',
    },
}));

export const AlertsClone = ({ actions, alert, alertError, alertStatus, history }) => {
    const classes = useStyles();
    const { alertid } = useParams();

    React.useEffect(() => {
        console.log('useEffect alertid = ', alertid);
        if (!!alertid) {
            actions.loadAnAlert(alertid);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alertid]);

    console.log('alert = ', alert);

    if (alertStatus === 'loading') {
        return (
            <div style={{ minHeight: 600 }}>
                <InlineLoader message="Loading" />
            </div>
        );
    }

    // Strip markdown from the body
    const linkRegex = !!alert?.body && alert.body.match(/\[([^\]]+)\]\(([^)]+)\)/);
    let message = alert?.body || '';
    if (!!linkRegex && linkRegex.length === 3) {
        message = alert.body.replace(linkRegex[0], '').replace('  ', ' ');
        message = message.replace(linkRegex[0], '').replace('  ', ' ');
    }

    const isPermanent = message.includes('[permanent]');
    if (!!isPermanent) {
        message = message.replace('[permanent]', '');
    }

    const defaults = {
        id: alert?.id || '',
        startDate: defaultStartTime,
        endDate: defaultEndTime,
        alertTitle: alert?.title || '',
        enteredbody: message || '',
        linkRequired: linkRegex?.length === 3,
        urgent: alert?.urgent === '1' || false,
        permanentAlert: isPermanent || false,
        linkTitle: !!linkRegex && linkRegex.length === 3 ? linkRegex[1] : '',
        linkUrl: !!linkRegex && linkRegex.length === 3 ? linkRegex[2] : '',
        type: 'clone',
        minimumDate: moment().format('YYYY-MM-DDTHH:mm'),
    };

    return (
        <Fragment>
            <Grid container style={{ paddingBottom: '1em', display: 'block' }}>
                <Grid item id="previewWrapper" className={classes.previewWrapper} />
            </Grid>
            <StandardPage title="Alerts Management">
                <section aria-live="assertive">
                    <AlertHelpModal actions={actions} history={history} />
                    <StandardCard title="Clone alert" noPadding>
                        <AlertForm
                            actions={actions}
                            alertResponse={alert}
                            alertError={alertError}
                            alertStatus={alertStatus}
                            defaults={defaults}
                            history={history}
                        />
                    </StandardCard>
                </section>
            </StandardPage>
        </Fragment>
    );
};

AlertsClone.propTypes = {
    actions: PropTypes.any,
    alert: PropTypes.any,
    alertError: PropTypes.any,
    alertStatus: PropTypes.any,
    history: PropTypes.object,
};

export default AlertsClone;
