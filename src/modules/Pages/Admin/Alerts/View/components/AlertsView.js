import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { AlertsUtilityArea } from 'modules/Pages/Admin/Alerts/AlertsUtilityArea';
import {
    getTimeNowFormatted,
    extractFieldsFromBody,
    formatDate,
    getBody,
    makePreviewActionButtonJustNotifyUser,
    manuallyMakeWebComponentBePermanent,
} from '../../alerthelpers';
import { default as locale } from '../../alertsadmin.locale';
import { scrollToTopOfPage } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';

const useStyles = makeStyles(() => ({
    previewWrapper: {
        transition: 'visibility 0s, opacity 10s ease-out',
    },
}));

export const AlertsView = ({ actions, alert, alertStatus, history }) => {
    const classes = useStyles();
    const { alertid } = useParams();

    const displayPreview = thisAlert => {
        const alertWrapper = document.getElementById('previewWrapper');
        !!alertWrapper && (alertWrapper.innerHTML = '');

        // oddly, hardcoding the alert with attributes tied to values doesnt work, so insert it this way
        const alertWebComponent = document.createElement('uq-alert');
        /* istanbul ignore next */
        if (!alertWebComponent) {
            return null;
        }

        const { isPermanent, linkRequired, linkTitle, linkUrl, message } = extractFieldsFromBody(alert?.body);

        alertWebComponent.setAttribute('id', 'alert-preview');
        alertWebComponent.setAttribute('alerttitle', thisAlert.title);
        alertWebComponent.setAttribute('alerttype', !!thisAlert.urgent ? '1' : '0');
        const body =
            !!thisAlert.body &&
            getBody({
                permanentAlert: isPermanent,
                linkRequired: linkRequired,
                linkTitle: linkTitle,
                linkUrl: linkUrl,
                enteredbody: message,
            });
        if (!!isPermanent) {
            manuallyMakeWebComponentBePermanent(alertWebComponent, body);
        } else {
            alertWebComponent.setAttribute('alertmessage', body);
        }
        if (!!linkRequired) {
            makePreviewActionButtonJustNotifyUser({ ...thisAlert, linkUrl: linkUrl });
        }
        alertWrapper.appendChild(alertWebComponent);

        return null;
    };

    React.useEffect(() => {
        if (!!alertid) {
            actions.loadAnAlert(alertid);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alertid]);

    React.useEffect(() => {
        if (!!alert) {
            displayPreview(alert);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alert]);

    if (alertStatus === 'loading') {
        return (
            <div style={{ minHeight: 600 }}>
                <InlineLoader message="Loading" />
            </div>
        );
    }

    const navigateToCloneForm = () => {
        history.push(`/admin/alerts/clone/${alertid}`);

        scrollToTopOfPage();
    };

    const navigateToListPage = () => {
        history.push('/admin/alerts');

        scrollToTopOfPage();
    };

    // Strip markdown from the body
    const linkRegex = !!alert?.body && alert.body.match(/\[([^\]]+)\]\(([^)]+)\)/);
    let message2 = alert?.body || '';
    if (!!linkRegex && linkRegex.length === 3) {
        message2 = alert.body.replace(linkRegex[0], '').replace('  ', ' ');
        message2 = message2.replace(linkRegex[0], '').replace('  ', ' ');
    }

    const isPermanent2 = message2.includes('[permanent]');
    if (!!isPermanent2) {
        message2 = message2.replace('[permanent]', '');
    }

    const values = {
        id: alert?.id || '',
        startDate: alert?.start ? formatDate(alert.start, 'YYYY-MM-DDTHH:mm:ss') : '',
        endDate: alert?.end ? formatDate(alert.end, 'YYYY-MM-DDTHH:mm:ss') : '',
        alertTitle: alert?.title || '',
        enteredbody: message2 || '',
        linkRequired: linkRegex?.length === 3,
        urgent: !!alert && !!alert.urgent,
        permanentAlert: isPermanent2 || false,
        linkTitle: !!linkRegex && linkRegex.length === 3 ? linkRegex[1] : '',
        linkUrl: !!linkRegex && linkRegex.length === 3 ? linkRegex[2] : '',
        type: 'view',
        minimumDate: getTimeNowFormatted(),
    };

    return (
        <Fragment>
            <Grid container style={{ paddingBottom: '1em', display: 'block' }}>
                <Grid item id="previewWrapper" className={classes.previewWrapper} />
            </Grid>
            <StandardPage title="Alerts Management">
                <section aria-live="assertive">
                    <AlertsUtilityArea actions={actions} helpContent={locale.view.help} history={history} />
                    <StandardCard title="View alert" squash>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl
                                    fullWidth
                                    title="Alert lead text. Appears in bold. Field length of 100 characters."
                                >
                                    <InputLabel htmlFor="alertTitle">Title *</InputLabel>
                                    <Input
                                        id="alertTitle"
                                        data-testid="admin-alerts-form-title"
                                        value={values.alertTitle}
                                        disabled
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth title="Regular body text. Field length of 550 characters.">
                                    <InputLabel htmlFor="alertBody" style={{ minHeight: '1.1em' }}>
                                        Message *
                                    </InputLabel>
                                    <Input
                                        id="alertBody"
                                        data-testid="admin-alerts-form-body"
                                        value={values.enteredbody}
                                        multiline
                                        rows={2}
                                        disabled
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} style={{ marginTop: 12 }}>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    id="startDate"
                                    data-testid="admin-alerts-form-start-date"
                                    InputLabelProps={{ shrink: true }}
                                    label="Start date"
                                    type="datetime-local"
                                    value={values.startDate}
                                    disabled
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    id="endDate"
                                    data-testid="admin-alerts-form-end-date"
                                    InputLabelProps={{ shrink: true }}
                                    label="End date"
                                    type="datetime-local"
                                    value={values.endDate}
                                    disabled
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            spacing={2}
                            style={{ minHeight: '4rem', paddingTop: '1rem' }}
                            className={classes.checkboxes}
                        >
                            <Grid item sm={4} xs={12}>
                                <InputLabel
                                    style={{ color: 'rgba(0, 0, 0, 0.87)' }}
                                    title="Check to add button to alert linking to more information. Displays extra form fields."
                                >
                                    <Checkbox
                                        checked={values.linkRequired}
                                        data-testid="admin-alerts-form-checkbox-linkrequired"
                                        className={classes.checkbox}
                                        disabled
                                    />
                                    Add info link
                                </InputLabel>
                            </Grid>
                            <Grid item sm={4} xs={12}>
                                <InputLabel
                                    style={{ color: 'rgba(0, 0, 0, 0.87)' }}
                                    title={locale.form.permanentTooltip}
                                >
                                    <Checkbox
                                        data-testid="admin-alerts-form-checkbox-permanent"
                                        checked={values.permanentAlert}
                                        name="permanentAlert"
                                        title={locale.form.permanentTooltip}
                                        className={classes.checkbox}
                                        disabled
                                    />
                                    Permanent
                                </InputLabel>
                            </Grid>
                            <Grid item sm={4} xs={12}>
                                <InputLabel style={{ color: 'rgba(0, 0, 0, 0.87)' }} title={locale.form.urgentTooltip}>
                                    <Checkbox
                                        checked={values.urgent}
                                        data-testid="admin-alerts-form-checkbox-urgent"
                                        name="urgent"
                                        title={locale.form.urgentTooltip}
                                        className={classes.checkbox}
                                        disabled
                                    />
                                    Urgent
                                </InputLabel>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            spacing={2}
                            className={classes.linkTitleWrapper}
                            style={{
                                display: values.linkRequired ? 'flex' : 'none',
                            }}
                        >
                            <Grid item md={6} xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="linkTitle">Link title *</InputLabel>
                                    <Input
                                        id="linkTitle"
                                        data-testid="admin-alerts-form-link-title"
                                        value={values.linkTitle}
                                        title="Use destination page title or clear call to action. Minimise length; max length 55 characters."
                                        disabled
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="linkUrl">Link URL *</InputLabel>
                                    <Input
                                        type="url"
                                        id="linkUrl"
                                        data-testid="admin-alerts-form-link-url"
                                        value={values.linkUrl}
                                        disabled
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} style={{ marginTop: '1rem' }}>
                            <Grid item xs={3} align="left">
                                <Button
                                    color="secondary"
                                    children="Cancel"
                                    data-testid="admin-alerts-form-button-cancel"
                                    onClick={() => navigateToListPage()}
                                    variant="contained"
                                />
                            </Grid>
                            <Grid item xs={9} align="right">
                                <Button
                                    color="primary"
                                    data-testid="admin-alerts-form-button-save"
                                    variant="contained"
                                    children="Clone"
                                    onClick={() => navigateToCloneForm()}
                                />
                            </Grid>
                        </Grid>
                    </StandardCard>
                </section>
            </StandardPage>
        </Fragment>
    );
};

AlertsView.propTypes = {
    actions: PropTypes.any,
    alert: PropTypes.any,
    alertError: PropTypes.any,
    alertStatus: PropTypes.any,
    history: PropTypes.object,
};

export default AlertsView;
