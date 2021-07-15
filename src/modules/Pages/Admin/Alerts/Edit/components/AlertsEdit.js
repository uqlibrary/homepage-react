import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
const moment = require('moment');

import Grid from '@material-ui/core/Grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { AlertHelpModal } from 'modules/Pages/Admin/Alerts/AlertHelpModal';
import { AlertForm } from 'modules/Pages/Admin/Alerts/AlertForm';
import { formatDate } from '../../alerthelpers';

export const AlertsEdit = ({ actions, alert, alertError, alertStatus, history }) => {
    const { alertid } = useParams();
    console.log('AlertsEdit alertid = ', alertid);
    console.log('AlertsEdit props actions = ', actions);
    console.log('AlertsEdit props alert = ', alert);
    console.log('AlertsEdit props alertError = ', alertError);
    console.log('AlertsEdit props alertStatus = ', alertStatus);

    React.useEffect(() => {
        console.log('useEffect alertid = ', alertid);
        if (!!alertid) {
            actions.loadAnAlert(alertid);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alertid]);

    console.log('alert = ', alert);

    if (alertStatus === 'loading') {
        return <InlineLoader message="Loading" />;
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
        startDate: alert?.start ? formatDate(alert.start, 'YYYY-MM-DDTHH:mm:ss') : '',
        endDate: alert?.end ? formatDate(alert.end, 'YYYY-MM-DDTHH:mm:ss') : '',
        alertTitle: alert?.title || '',
        body: '',
        enteredbody: message || '',
        linkRequired: linkRegex?.length === 3,
        urgent: alert?.urgent === '1' || false,
        permanentAlert: isPermanent || false,
        linkTitle: !!linkRegex && linkRegex.length === 3 ? linkRegex[1] : '',
        linkUrl: !!linkRegex && linkRegex.length === 3 ? linkRegex[2] : '',
        type: 'edit',
        minimumDate: moment().format('YYYY-MM-DDTHH:mm'),
    };

    return (
        <Fragment>
            <Grid container style={{ paddingBottom: '1em', display: 'none' }}>
                <Grid item id="previewWrapper" />
            </Grid>
            <StandardPage title="Alerts Management">
                <section aria-live="assertive">
                    <AlertHelpModal actions={actions} history={history} />
                    <StandardCard title="Edit Alert" noPadding>
                        <AlertForm
                            actions={actions}
                            alert={alert}
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

AlertsEdit.propTypes = {
    actions: PropTypes.any,
    alert: PropTypes.any,
    alertError: PropTypes.any,
    alertStatus: PropTypes.any,
    history: PropTypes.object,
};

export default AlertsEdit;
