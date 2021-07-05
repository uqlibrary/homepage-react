import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

const moment = require('moment');

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
// import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { default as locale } from '../../alertsadmin.locale';

export const AlertsAdd = ({ actions, alerts, alertsLoading, alertsError }) => {
    console.log('props = ', actions, alerts, alertsLoading, alertsError);

    // const [linkRequired, setLinkRequired] = useState(false);

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

    // console.log('values = ', values);

    const defaultStartTime = moment().format('YYYY-MM-DDTHH:mm');
    const defaultEndTime = moment()
        .endOf('day')
        .format('YYYY-MM-DDTHH:mm');

    const navigateToListPage = () => {
        window.location.href = '/admin/alerts';
    };

    function expandValues(values) {
        console.log('expandValues, values = ', values);
        const newAlertTitle = values.alertTitle || 'Read more';
        // because otherwise we see 'false' when we clear the field
        const newLinkTitle = values.linkTitle || '';
        const newLinkUrl = values.linkUrl || '';
        const permanentAlert = values.permanentAlert ? '[permanent]' : '';
        const link = values.linkRequired ? `[${values.linkTitle}](${values.linkUrl})` : '';
        const newBody = `${values.enteredbody}${link}${permanentAlert}`;

        console.log({ ...values, ['alertTitle']: newAlertTitle, ['body']: newBody });

        setValues({
            ...values,
            ['alertTitle']: newAlertTitle,
            ['body']: newBody,
            ['linkTitle']: newLinkTitle,
            ['linkUrl']: newLinkUrl,
        });

        console.log('alertTitle = ', values.alertTitle);
        console.log('body = ', values.body);

        return values;
    }

    const saveAlert = () => {};

    const displayPreview = () => {
        const displayValues = expandValues(values);
        console.log(displayValues);
        setPreviewOpen(true);

        // oddly hardcoding the alert with attributes tied to values doesnt work, so insert it this way
        const alertWrapper = document.getElementById('previewWrapper');
        alertWrapper.innerHTML = '';
        const alert = document.createElement('uq-alert');
        if (!!alert) {
            !alert.setAttribute('id', 'alert-preview');
            !!values.body && alert.setAttribute('alertmessage', values.body);
            !!values.alertTitle && alert.setAttribute('alerttitle', values.alertTitle);
            alert.setAttribute('alerttype', !!values.urgent ? '1' : '0');
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
        const devlinkValid =
            !currentValues.linkRequired || (currentValues.linkTitle.length > 0 && currentValues.linkUrl.length > 0);
        console.log(
            'validateValues check: linkRequired = ',
            currentValues.linkRequired,
            `[${currentValues.linkTitle}](${currentValues.linkUrl})`,
            devlinkValid,
        );
        const b =
            currentValues.alertTitle.length > 0 &&
            !!currentValues.enteredbody &&
            currentValues.enteredbody.length > 0 &&
            (!currentValues.linkRequired || (currentValues.linkTitle.length > 0 && currentValues.linkUrl.length > 0));
        console.log('validvalues: ', b);

        // if we are currently showing the preview and the form becomes invalid, hide it again
        !b && !!showPreview && setPreviewOpen(false);

        return b;
    };

    // const notValidValues = () => {
    //     return !validateValues();
    // };

    const handleChange = prop => event => {
        // setPreviewOpen(false);

        !!event.target.checked && console.log('event.target.checked = ', event.target.checked);
        !!event.target.value && console.log('event.target.vaue = ', event.target.value);
        const newValue = !!event.target.value ? event.target.value : event.target.checked;
        setValues({ ...values, [prop]: newValue });

        expandValues({ ...values, [prop]: newValue });

        // if (
        //     prop === 'startDate' &&
        //     event.target.value !== defaultStartTime &&
        //     event.target.value !== '' &&
        //     (values.endDate === defaultEndTime || values.endDate === '')
        // ) {
        //     const newEndDate = moment(event.target.value, 'YYYY-MM-DDTHH:MM')
        //         .set({ H: 23, m: 59 })
        //         .format('YYYY-MM-DDTHH:mm');
        //     console.log('newEndDate = ', newEndDate);
        //     console.log('update end date to ',
        //     { ...values, ['startDate']: event.target.value, ['endDate']: newEndDate });
        //     setValues({ ...values, ['endDate']: newEndDate1 });
        // }

        setFormValidity(validateValues({ ...values, [prop]: newValue }));
    };

    return (
        <Fragment>
            <Grid
                container
                // spacing={2}
                style={{ paddingBottom: '1em', display: isFormValid && showPreview ? 'block' : 'none' }}
            >
                <Grid item id="previewWrapper">
                    <uq-alert
                        id="alert-bc2f8d60-dd2c-11eb-87e7-33ba75ed085f"
                        alertmessage="In line with Queensland Government directions, you must wear a face mask when visiting UQ libraries.[UQ community COVID-19 advice](https://about.uq.edu.au/coronavirus)"
                        alerttitle="Face masks in the Library:"
                        alerttype="0"
                    />
                </Grid>
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
                                                value={values.alertTitle}
                                                onChange={handleChange('alertTitle')}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth style={{ padding: '3rem 0 0 0' }}>
                                            <InputLabel htmlFor="alertBody">Message *</InputLabel>
                                            <TextField
                                                id="alertBody"
                                                value={values.enteredbody}
                                                onChange={handleChange('enteredbody')}
                                                multiline
                                                rows={2}
                                                // style={{
                                                //     padding: '0.5rem',
                                                //     borderLeftWidth: 0,
                                                //     borderTopWidth: 0,
                                                //     borderRightWidth: 0,
                                                //     borderColor: 'rgba(0, 0, 0, 0.87)',
                                                // }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        {/* https://material-ui.com/components/pickers/ */}
                                        <TextField
                                            id="startDate"
                                            InputLabelProps={{ shrink: true }}
                                            label="Start date"
                                            onChange={handleChange('startDate')}
                                            type="datetime-local"
                                            value={values.startDate || defaultStartTime}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            id="endDate"
                                            InputLabelProps={{ shrink: true }}
                                            label="End date"
                                            onChange={handleChange('endDate')}
                                            type="datetime-local"
                                            value={values.endDate || defaultEndTime}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} style={{ height: '4rem', paddingTop: '1rem' }}>
                                    <Grid item xs={4}>
                                        <InputLabel style={{ color: 'rgba(0, 0, 0, 0.87)' }}>
                                            <Checkbox
                                                checked={values.linkRequired}
                                                onChange={handleChange('linkRequired')}
                                            />
                                            Add link?
                                        </InputLabel>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <InputLabel style={{ color: 'rgba(0, 0, 0, 0.87)' }}>
                                            <Checkbox
                                                checked={values.urgent}
                                                onChange={handleChange('urgent')}
                                                name="urgent"
                                            />
                                            Urgent?
                                        </InputLabel>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <InputLabel style={{ color: 'rgba(0, 0, 0, 0.87)' }}>
                                            <Checkbox
                                                checked={values.permanentAlert}
                                                onChange={handleChange('permanentAlert')}
                                                name="permanentAlert"
                                            />
                                            Permanent?
                                        </InputLabel>
                                    </Grid>
                                </Grid>
                                <Grid
                                    container
                                    spacing={2}
                                    style={{ paddingBottom: '1em', display: values.linkRequired ? 'flex' : 'none' }}
                                >
                                    <Grid item xs={6}>
                                        <FormControl fullWidth>
                                            <InputLabel htmlFor="linkTitle">Link Title *</InputLabel>
                                            <Input
                                                id="linkTitle"
                                                value={values.linkTitle}
                                                onChange={handleChange('linkTitle')}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControl fullWidth>
                                            <InputLabel htmlFor="linkUrl">Link URL *</InputLabel>
                                            <Input
                                                id="linkUrl"
                                                value={values.linkUrl}
                                                onChange={handleChange('linkUrl')}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={3} align="left">
                                        <Button
                                            color="secondary"
                                            children="Cancel"
                                            onClick={() => navigateToListPage()}
                                        />
                                    </Grid>
                                    <Grid item xs={9} align="right">
                                        <Button
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
