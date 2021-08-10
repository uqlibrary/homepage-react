import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { AlertsUtilityArea } from 'modules/Pages/Admin/Alerts/AlertsUtilityArea';
import { AlertForm } from 'modules/Pages/Admin/Alerts/AlertForm';
import { getTimeNowFormatted, extractFieldsFromBody, formatDate } from '../../alerthelpers';
import { default as locale } from '../../alertsadmin.locale';

const useStyles = makeStyles(() => ({
    previewWrapper: {
        transition: 'visibility 0s, opacity 0.5s linear',
    },
}));

export const AlertsEdit = ({ actions, alert, alertError, alertLoading, alertStatus, history }) => {
    const classes = useStyles();
    const { alertid } = useParams();

    React.useEffect(() => {
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
            urgent: !!alert && !!alert.urgent,
            permanentAlert: isPermanent || false,
            linkTitle: linkTitle,
            linkUrl: linkUrl,
            type: 'edit',
            minimumDate: getTimeNowFormatted(),
        };
    }

    const defaults = setDefaults();

    return (
        <Fragment>
            <Grid container style={{ paddingBottom: '1em', display: 'block' }}>
                <Grid item id="previewWrapper" className={classes.previewWrapper} />
            </Grid>
            <StandardPage title="Alerts Management">
                <section aria-live="assertive">
                    <AlertsUtilityArea
                        actions={actions}
                        helpContent={locale.form.help}
                        history={history}
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
    alertLoading: PropTypes.any,
    alertStatus: PropTypes.any,
    history: PropTypes.object,
};

export default AlertsEdit;
