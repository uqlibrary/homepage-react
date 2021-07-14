import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
const moment = require('moment');

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { AlertHelpModal } from 'modules/Pages/Admin/Alerts/AlertHelpModal';
import { AlertForm } from 'modules/Pages/Admin/Alerts/AlertForm';

export const AlertsAdd = ({ actions, alert, alertError, alertStatus, history }) => {
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
    };
    return (
        <Fragment>
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
