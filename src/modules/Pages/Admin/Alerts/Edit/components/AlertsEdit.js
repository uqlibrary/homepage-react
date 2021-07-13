import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { AlertHelpModal } from 'modules/Pages/Admin/Alerts/AlertHelpModal';
import { AlertForm } from 'modules/Pages/Admin/Alerts/AlertForm';

export const AlertsEdit = ({ actions, alert, alertsError, history }) => {
    return (
        <Fragment>
            <StandardPage title="Alerts Management">
                <section aria-live="assertive">
                    <AlertHelpModal history={history} />
                    <StandardCard title="Edit Alert" noPadding>
                        <AlertForm actions={actions} alert={alert} alertsError={alertsError} history={history} />
                    </StandardCard>
                </section>
            </StandardPage>
        </Fragment>
    );
};

AlertsEdit.propTypes = {
    actions: PropTypes.any,
    alert: PropTypes.any,
    alertsError: PropTypes.any,
    history: PropTypes.object,
};

export default AlertsEdit;
