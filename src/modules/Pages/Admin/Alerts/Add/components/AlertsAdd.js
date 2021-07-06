import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { default as locale } from '../../alertsadmin.locale';

const moment = require('moment');

export const AlertsAdd = ({ actions, alerts, alertsLoading, alertsError }) => {
    console.log('props = ', actions, alerts, alertsLoading, alertsError);

    const [isFormValid, setFormValidity] = useState(false);
    const [showPreview, setPreviewOpen] = useState(false);

    const [values, setValues] = useState({
        id: '',
        startDate: '',
        endDate: '',
        alertTitle: '',
        // url: '',
        body: '',
        enteredbody: '',
        linkRequired: false,
        urgent: false,
        created: '',
        updated: '',
        permanentAlert: false,
        linkTitle: '',
        linkUrl: '',
    });

    const defaultStartTime = moment().format('YYYY-MM-DDTHH:mm');
    const defaultEndTime = moment()
        .endOf('day')
        .format('YYYY-MM-DDTHH:mm');

    const navigateToListPage = () => {
        window.location.href = '/admin/alerts';
    };

    function expandValues(values) {
        console.log('expandValues, values = ', values);
        // because otherwise we see 'false' when we clear the field
        const newAlertTitle = values.alertTitle || '';

        const newLinkTitle = values.linkTitle || '';
        const newLinkUrl = values.linkUrl || '';

        const permanentAlert = values.permanentAlert ? '[permanent]' : '';
        const link = values.linkRequired ? `[${values.linkTitle}](${values.linkUrl})` : '';
        const newBody = `${values.enteredbody}${link}${permanentAlert}`;

        setValues({
            ...values,
            ['alertTitle']: newAlertTitle,
            ['body']: newBody,
            ['linkTitle']: newLinkTitle,
            ['linkUrl']: newLinkUrl,
        });

        return values;
    }

    const saveAlert = () => {};

    const displayPreview = () => {
        // const displayValues = expandValues(values);
        // console.log(displayValues);
        setPreviewOpen(true);

        // oddly hardcoding the alert with attributes tied to values doesnt work, so insert it this way
        const alertWrapper = document.getElementById('previewWrapper');
        alertWrapper.innerHTML = '';
        const alert = document.createElement('uq-alert');
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
        console.log(
            'validateValues check: alertTitle = ',
            currentValues.alertTitle,
            currentValues.alertTitle.length > 0,
        );
        console.log(
            'validateValues check: enteredbody = ',
            currentValues.enteredbody,
            !!currentValues.enteredbody && currentValues.enteredbody.length > 0,
        );
        console.log(
            'validateValues check: linkRequired = ',
            currentValues.linkRequired,
            `[${currentValues.linkTitle}](${currentValues.linkUrl})`,
            !currentValues.linkRequired || currentValues.linkUrl.length > 0,
        );
        const isValid =
            currentValues.alertTitle.length > 0 &&
            !!currentValues.enteredbody &&
            currentValues.enteredbody.length > 0 &&
            (!currentValues.linkRequired || currentValues.linkUrl.length > 0);
        console.log('validvalues: ', isValid);

        // if we are currently showing the preview and the form becomes invalid, hide it again
        !isValid && !!showPreview && setPreviewOpen(false);

        return isValid;
    };

    // const notValidValues = () => {
    //     return !validateValues();
    // };

    const handleChange = prop => event => {
        // setPreviewOpen(false);

        const newValue = !!event.target.value ? event.target.value : event.target.checked;
        setValues({ ...values, [prop]: newValue });

        expandValues({ ...values, [prop]: newValue });

        // console.log('values.endDate = ', values.endDate);
        // console.log('event.target.value = ', event.target.value);
        // console.log('before ', values.endDate < event.target.value);
        // if (
        //     prop === 'startDate' &&
        //     event.target.value !== defaultStartTime &&
        //     event.target.value !== '' &&
        //     // (values.endDate === defaultEndTime || values.endDate === '')
        //     values.endDate < event.target.value
        // ) {
        //     const newEndDate = moment(event.target.value, 'YYYY-MM-DDTHH:MM')
        //         .set({ H: 23, m: 59 })
        //         .format('YYYY-MM-DDTHH:mm');
        //     console.log('newEndDate = ', newEndDate);
        //     console.log('update end date to ', {
        //         ...values,
        //         ['startDate']: event.target.value,
        //         ['endDate']: newEndDate,
        //     });
        //     setValues({ ...values, ['endDate']: newEndDate });
        // }

        setFormValidity(validateValues({ ...values, [prop]: newValue }));
    };

    return (
        <Fragment>
            <Grid container style={{ paddingBottom: '1em', display: isFormValid && showPreview ? 'block' : 'none' }}>
                <Grid item id="previewWrapper" />
            </Grid>
            <StandardPage title="Create Alert">
                <form>
                    <Grid container spacing={2}>
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
                                <Grid container spacing={2} style={{ height: '4rem', paddingTop: '1rem' }}>
                                    <Grid item xs={4}>
                                        <InputLabel style={{ color: 'rgba(0, 0, 0, 0.87)' }}>
                                            <Checkbox
                                                checked={values.linkRequired}
                                                data-testid="admin-alerts-add-checkbox-linkrequired"
                                                onChange={handleChange('linkRequired')}
                                            />
                                            Add link
                                        </InputLabel>
                                    </Grid>
                                    <Grid item xs={4}>
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
                                    <Grid item xs={4}>
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
                                        />
                                        <Button
                                            color="primary"
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
    actions: PropTypes.object,
    alerts: PropTypes.array,
    alertsLoading: PropTypes.bool,
    alertsError: PropTypes.any,
};

export default AlertsAdd;
