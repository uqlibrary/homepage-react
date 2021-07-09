import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
const moment = require('moment');

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { useConfirmationState } from 'hooks';

import { default as locale } from '../../alertsadmin.locale';
import { getUserPostfix } from 'helpers/general';
import { fullPath } from 'config/routes';

export const AlertsAdd = ({ actions, alerts, alertsError }) => {
    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();

    const [isFormValid, setFormValidity] = useState(false);
    const [showPreview, setPreviewOpen] = useState(false);

    const [values, setValues] = useState({
        // id: '',
        startDate: '',
        endDate: '',
        alertTitle: '',
        // url: '',
        body: '',
        enteredbody: '',
        linkRequired: false,
        urgent: false,
        // created: '',
        // updated: '',
        permanentAlert: false,
        linkTitle: '',
        linkUrl: '',
    });

    const defaultStartTime = moment().format('YYYY-MM-DDTHH:mm');
    const defaultEndTime = moment()
        .endOf('day')
        .format('YYYY-MM-DDTHH:mm');

    useEffect(() => {
        if (!!alerts && !!alerts.id) {
            showConfirmation();
        }
    }, [showConfirmation, alerts]);

    useEffect(() => {
        if (!!alertsError) {
            console.log('There was an error while saving a new alert: ', alertsError);
            showConfirmation();
        }
    }, [showConfirmation, alertsError]);

    const navigateToListPage = () => {
        const userString = getUserPostfix();
        console.log('navigateToListPage: go to ', `${fullPath}/admin/alerts${userString}`);
        window.location.href = `${fullPath}/admin/alerts${userString}`;
    };

    const reloadAddAlertPage = () => {
        const userString = getUserPostfix();
        console.log('reloadAddAlertPage: go to ', `${fullPath}/admin/alerts${userString}`);
        window.location.href = `${fullPath}/admin/alerts/add${userString}`;
    };

    const getBody = values => {
        const permanentAlert = values.permanentAlert ? '[permanent]' : '';
        const link = values.linkRequired ? `[${values.linkTitle}](${values.linkUrl})` : '';
        return `${values.enteredbody}${permanentAlert}${link}`;
    };

    function formatDate(dateString, dateFormat = 'YYYY-MM-DD HH:mm:ss') {
        const newMoment = new moment(dateString);
        return newMoment.format(dateFormat);
    }

    function expandValues(values) {
        // because otherwise we see 'false' when we clear the field
        const newAlertTitle = values.alertTitle || /* istanbul ignore next */ '';

        const newStartDate = formatDate(values.startDate || defaultStartTime);
        const newEndDate = formatDate(values.endDate || defaultEndTime);

        const newLinkTitle = values.linkTitle || '';
        const newLinkUrl = values.linkUrl || '';

        const newBody = getBody(values);

        setValues({
            ...values,
            ['alertTitle']: newAlertTitle,
            ['body']: newBody,
            ['linkTitle']: newLinkTitle,
            ['linkUrl']: newLinkUrl,
            ['startDate']: newStartDate,
            ['endDate']: newEndDate,
        });

        return values;
    }

    const saveAlert = () => {
        expandValues(values);

        console.log('will save: title = ', values.alertTitle || /* istanbul ignore next */ '');
        console.log('will save: body = ', values.body); // getBody());
        console.log('will save: startDate = ', values.startDate);
        console.log('will save: endDate = ', values.endDate);
        console.log('will save: urgent = ', !!values.urgent ? '1' : '0');
        actions.createAlert({
            title: values.alertTitle,
            body: values.body,
            urgent: !!values.urgent ? '1' : '0',
            start: values.startDate,
            end: values.endDate,
        });
    };

    const displayPreview = () => {
        expandValues(values);

        setPreviewOpen(true);

        // oddly hardcoding the alert with attributes tied to values doesnt work, so insert it this way
        const alertWrapper = document.getElementById('previewWrapper');
        alertWrapper.innerHTML = '';
        const alert = document.createElement('uq-alert');
        /* istanbul ignore else */
        if (!!alert) {
            alert.setAttribute('id', 'alert-preview');
            alert.setAttribute('alerttitle', values.alertTitle);
            alert.setAttribute('alerttype', !!values.urgent ? '1' : '0');
            // when the alert body has the square bracket for 'permanent',
            // that enclosed string is not accepted by setattribute
            // something to do with XSS blocking for special char?
            // so we have to handle it manually :(
            if (!!values.permanentAlert) {
                alert.setAttribute('alertmessage', values.body.replace('[permanent]', ''));
                // manually remove the 'non-permanent' button
                const changeMessage = setInterval(() => {
                    // its a moment before it is available
                    const alertShadowRoot = document.getElementById('alert-preview').shadowRoot;
                    const closeButton = !!alertShadowRoot && alertShadowRoot.getElementById('alert-close');
                    if (!!closeButton) {
                        closeButton.remove();
                        clearInterval(changeMessage);
                    }
                }, 100);
            } else {
                alert.setAttribute('alertmessage', values.body);
            }
            alertWrapper.appendChild(alert);
        }
    };

    const validateValues = currentValues => {
        const isValid =
            currentValues.alertTitle.length > 0 &&
            !!currentValues.enteredbody &&
            currentValues.enteredbody.length > 0 &&
            (!currentValues.linkRequired || currentValues.linkUrl.length > 0);

        // if we are currently showing the preview and the form becomes invalid, hide it again
        !isValid && !!showPreview && setPreviewOpen(false);

        return isValid;
    };

    const handleChange = prop => event => {
        const newValue = !!event.target.value ? event.target.value : event.target.checked;
        setValues({ ...values, [prop]: newValue });

        expandValues({ ...values, [prop]: newValue });

        setFormValidity(validateValues({ ...values, [prop]: newValue }));
    };

    /* istanbul ignore next */
    const _handleDefaultSubmit = event => {
        event && event.preventDefault();
    };

    return (
        <Fragment>
            <Grid container style={{ paddingBottom: '1em', display: isFormValid && showPreview ? 'block' : 'none' }}>
                <Grid item id="previewWrapper" />
            </Grid>
            <StandardPage title="Create Alert">
                <form onSubmit={_handleDefaultSubmit}>
                    <Grid container spacing={2}>
                        <ConfirmationBox
                            confirmationBoxId="alert-add-succeeded"
                            onAction={!alertsError ? reloadAddAlertPage : hideConfirmation}
                            onClose={hideConfirmation}
                            onCancelAction={navigateToListPage}
                            hideCancelButton={!!alertsError}
                            isOpen={isOpen}
                            locale={!!alerts ? locale.addForm.addAlertConfirmation : locale.addForm.addAlertError}
                        />
                        <Grid item xs={12}>
                            <StandardCard help={locale.addForm.help}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel htmlFor="alertTitle">Title *</InputLabel>
                                            <Input
                                                id="alertTitle"
                                                data-testid="admin-alerts-add-title"
                                                value={values.alertTitle}
                                                onChange={handleChange('alertTitle')}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel htmlFor="alertBody">Message *</InputLabel>
                                            <Input
                                                id="alertBody"
                                                data-testid="admin-alerts-add-body"
                                                value={values.enteredbody}
                                                onChange={handleChange('enteredbody')}
                                                multiline
                                                rows={2}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} style={{ marginTop: 12 }}>
                                    <Grid item md={6} xs={12}>
                                        {/* https://material-ui.com/components/pickers/ */}
                                        <TextField
                                            id="startDate"
                                            InputLabelProps={{ shrink: true }}
                                            label="Start date"
                                            onChange={handleChange('startDate')}
                                            type="datetime-local"
                                            value={values.startDate || defaultStartTime}
                                            inputProps={{
                                                min: defaultStartTime,
                                                required: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            id="endDate"
                                            InputLabelProps={{ shrink: true }}
                                            label="End date"
                                            onChange={handleChange('endDate')}
                                            type="datetime-local"
                                            value={values.endDate || defaultEndTime}
                                            inputProps={{
                                                min: values.startDate,
                                                required: true,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} style={{ minHeight: '4rem', paddingTop: '1rem' }}>
                                    <Grid item sm={4} xs={12}>
                                        <InputLabel
                                            style={{ color: 'rgba(0, 0, 0, 0.87)' }}
                                            title={locale.addForm.urgentTooltip}
                                        >
                                            <Checkbox
                                                checked={values.urgent}
                                                data-testid="admin-alerts-add-checkbox-urgent"
                                                onChange={handleChange('urgent')}
                                                name="urgent"
                                                title={locale.addForm.urgentTooltip}
                                            />
                                            Urgent
                                        </InputLabel>
                                    </Grid>
                                    <Grid item sm={4} xs={12}>
                                        <InputLabel
                                            style={{ color: 'rgba(0, 0, 0, 0.87)' }}
                                            title={locale.addForm.permanentTooltip}
                                        >
                                            <Checkbox
                                                data-testid="admin-alerts-add-checkbox-permanent"
                                                checked={values.permanentAlert}
                                                onChange={handleChange('permanentAlert')}
                                                name="permanentAlert"
                                                title={locale.addForm.permanentTooltip}
                                            />
                                            Permanent
                                        </InputLabel>
                                    </Grid>
                                    <Grid item sm={4} xs={12}>
                                        <InputLabel style={{ color: 'rgba(0, 0, 0, 0.87)' }}>
                                            <Checkbox
                                                checked={values.linkRequired}
                                                data-testid="admin-alerts-add-checkbox-linkrequired"
                                                onChange={handleChange('linkRequired')}
                                            />
                                            Add link
                                        </InputLabel>
                                    </Grid>
                                </Grid>
                                <Grid
                                    container
                                    spacing={2}
                                    style={{
                                        paddingBottom: '1em',
                                        marginTop: '1em',
                                        display: values.linkRequired ? 'flex' : 'none',
                                        border: '1px solid rgb(211, 211, 211)',
                                    }}
                                >
                                    <Grid item md={6} xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel htmlFor="linkTitle">Link title *</InputLabel>
                                            <Input
                                                id="linkTitle"
                                                data-testid="admin-alerts-add-link-title"
                                                value={values.linkTitle}
                                                onChange={handleChange('linkTitle')}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel htmlFor="linkUrl">Link URL *</InputLabel>
                                            <Input
                                                id="linkUrl"
                                                data-testid="admin-alerts-add-link-url"
                                                value={values.linkUrl}
                                                onChange={handleChange('linkUrl')}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} style={{ marginTop: '1rem' }}>
                                    <Grid item xs={3} align="left">
                                        <Button
                                            color="secondary"
                                            children="Cancel"
                                            data-testid="admin-alerts-add-button-cancel"
                                            onClick={() => navigateToListPage()}
                                        />
                                    </Grid>
                                    <Grid item xs={9} align="right">
                                        <Button
                                            data-testid="admin-alerts-add-button-preview"
                                            color="secondary"
                                            children="Preview"
                                            disabled={!isFormValid}
                                            onClick={displayPreview}
                                            style={{ marginRight: '0.5rem' }}
                                        />
                                        <Button
                                            color="primary"
                                            data-testid="admin-alerts-add-button-save"
                                            variant="contained"
                                            children="Save"
                                            disabled={!isFormValid}
                                            onClick={saveAlert}
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                    </Grid>
                </form>
            </StandardPage>
        </Fragment>
    );
};

AlertsAdd.propTypes = {
    actions: PropTypes.any,
    alerts: PropTypes.any,
    alertsError: PropTypes.any,
};

export default AlertsAdd;
