import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { AlertsUtilityArea } from 'modules/Pages/Admin/Alerts/AlertsUtilityArea';
import { AlertForm } from 'modules/Pages/Admin/Alerts/Form/AlertForm';
import { getTimeNowFormatted, extractFieldsFromBody } from '../../alerthelpers';
import { formatDate } from 'modules/Pages/Admin/dateTimeHelper';
import { default as locale } from '../../alertsadmin.locale';

export const AlertsEdit = ({ actions, alert, alertError, alertLoading, alertStatus }) => {
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

    const { isPermanent, linkRequired, linkTitle, linkUrl, message } = extractFieldsFromBody(alert?.body);

    function setDefaults() {
        const startDateDefault = alert?.start ? formatDate(alert.start, 'YYYY-MM-DDTHH:mm:ss') : '';
        const endDateDefault = alert?.end ? formatDate(alert.end, 'YYYY-MM-DDTHH:mm:ss') : '';
        return {
            id: alert?.id || '',
            dateList: [
                {
                    startDate: startDateDefault,
                    endDate: endDateDefault,
                },
            ],
            startDateDefault: startDateDefault,
            endDateDefault: endDateDefault,
            alertTitle: alert?.title || '',
            enteredbody: message,
            linkRequired: linkRequired,
            priorityType: (!!alert && alert.priority_type) || 'info',
            permanentAlert: isPermanent || false,
            linkTitle: linkTitle,
            linkUrl: linkUrl,
            type: 'edit',
            minimumDate: getTimeNowFormatted(),
            systems: alert?.systems || [],
            updatedBy: (!!alert && alert.updated_by) || null,
            createdBy: (!!alert && alert.created_by) || '?',
        };
    }

    const defaults = setDefaults();

    return (
        <Fragment>
            <Grid container style={{ paddingBottom: '1em', display: 'block' }}>
                <Grid item id="previewWrapper" sx={{ transition: 'visibility 0s, opacity 0.5s linear' }} />
            </Grid>
            <StandardPage title="Alerts Management">
                <section aria-live="assertive">
                    <AlertsUtilityArea
                        actions={actions}
                        helpContent={locale.form.help}
                        // showCloneButton
                    />
                    <StandardCard title="Edit alert">
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

AlertsEdit.propTypes = {
    actions: PropTypes.any,
    alert: PropTypes.any,
    alertError: PropTypes.any,
    alertLoading: PropTypes.any,
    alertStatus: PropTypes.any,
};

export default AlertsEdit;
