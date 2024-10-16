import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

import Grid from '@mui/material/Grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { AlertsUtilityArea } from 'modules/Pages/Admin/Alerts/AlertsUtilityArea';
import { AlertForm } from 'modules/Pages/Admin/Alerts/Form/AlertForm';
import { getTimeEndOfDayFormatted, getTimeNowFormatted } from '../../alerthelpers';
import { default as locale } from '../../alertsadmin.locale';

export const AlertsClone = ({ actions, alert, alertError, alertLoading, alertStatus }) => {
    const { alertid } = useParams();

    React.useEffect(() => {
        /* istanbul ignore else */
        if (!!alertid) {
            actions.loadAnAlert(alertid);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alertid]);

    if (alertStatus === 'loading') {
        return (
            <div style={{ minHeight: 600 }}>
                <InlineLoader message="Loading" />
            </div>
        );
    }

    const alertData = Array.isArray(alert) && alert.length > 0 ? alert[0] : alert;

    // Strip markdown from the body
    const linkRegex = !!alertData?.body && alertData.body.match(/\[([^\]]+)\]\(([^)]+)\)/);
    let message = alertData?.body || '';
    if (!!linkRegex && linkRegex.length === 3) {
        message = alertData.body.replace(linkRegex[0], '').replace('  ', ' ');
        message = message.replace(linkRegex[0], '').replace('  ', ' ');
    }

    const isPermanent = message.includes('[permanent]');
    if (!!isPermanent) {
        message = message.replace('[permanent]', '');
    }

    const defaults = {
        id: alertData?.id || '',
        dateList: [
            {
                startDate: getTimeNowFormatted(),
                endDate: getTimeEndOfDayFormatted(),
            },
        ],
        startDateDefault: getTimeNowFormatted(),
        endDateDefault: getTimeEndOfDayFormatted(),
        alertTitle: alertData?.title || '',
        enteredbody: message || '',
        linkRequired: linkRegex?.length === 3,
        priorityType: (!!alertData && alertData.priority_type) || 'info',
        permanentAlert: isPermanent || false,
        linkTitle: !!linkRegex && linkRegex.length === 3 ? linkRegex[1] : '',
        linkUrl: !!linkRegex && linkRegex.length === 3 ? linkRegex[2] : '',
        type: 'clone',
        minimumDate: getTimeNowFormatted(),
        systems: alertData?.systems || [],
    };

    return (
        <Fragment>
            <Grid container style={{ paddingBottom: '1em', display: 'block' }}>
                <Grid item id="previewWrapper" sx={{ transition: 'visibility 0s, opacity 10s ease-out' }} />
            </Grid>
            <StandardPage title="Alerts Management">
                <section aria-live="assertive">
                    <AlertsUtilityArea actions={actions} helpContent={locale.form.help} />
                    <StandardCard title="Clone alert">
                        <AlertForm
                            actions={actions}
                            alertLoading={alertLoading}
                            alertResponse={alert}
                            alertError={alertError}
                            alertStatus={alertStatus}
                            defaults={defaults}
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
    alertLoading: PropTypes.any,
    alertStatus: PropTypes.any,
};

export default AlertsClone;
