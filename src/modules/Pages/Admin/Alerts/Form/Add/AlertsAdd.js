import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';

import { AlertsUtilityArea } from 'modules/Pages/Admin/Alerts/AlertsUtilityArea';
import { AlertForm } from 'modules/Pages/Admin/Alerts/Form/AlertForm';
import { getTimeNowFormatted, getTimeEndOfDayFormatted } from '../../alerthelpers';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { default as locale } from '../../alertsadmin.locale';

export const AlertsAdd = ({ actions, alert, alertError, alertLoading, alertStatus, history }) => {
    const defaults = {
        id: '',
        dateList: [
            {
                startDate: getTimeNowFormatted(),
                endDate: getTimeEndOfDayFormatted(),
            },
        ],
        startDateDefault: getTimeNowFormatted(),
        endDateDefault: getTimeEndOfDayFormatted(),
        alertTitle: '',
        enteredbody: '',
        linkRequired: false,
        priorityType: 'info',
        permanentAlert: false,
        linkTitle: '',
        linkUrl: '',
        type: 'add',
        minimumDate: getTimeNowFormatted(),
        systems: [],
    };
    return (
        <Fragment>
            <Grid container style={{ paddingBottom: '1em', display: 'block' }}>
                <Grid item id="previewWrapper" sx={{ transition: 'visibility 0s, opacity 10s ease-out' }} />
            </Grid>
            <StandardPage title="Alerts Management">
                <section aria-live="assertive">
                    <AlertsUtilityArea actions={actions} history={history} helpContent={locale.form.help} />
                    <StandardCard title="Create alert">
                        <AlertForm
                            actions={actions}
                            alertResponse={alert}
                            alertError={alertError}
                            alertLoading={alertLoading}
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
    alertLoading: PropTypes.any,
    alertStatus: PropTypes.any,
    history: PropTypes.object,
};

export default AlertsAdd;
