import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';
const moment = require('moment');

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { useConfirmationState } from 'hooks';

import { default as locale } from './alertsadmin.locale';
import { formatDate } from './alerthelpers';

const useStyles = makeStyles(
    theme => ({
        checkboxes: {
            // on mobile layouts reverse the order of the checkboxes so the 'add link' appears with the link text fields
            [theme.breakpoints.down('sm')]: {
                display: 'flex',
                flexDirection: 'column-reverse',
            },
        },
        saveButton: {
            backgroundColor: theme.palette.accent.main,
            color: '#fff',
            '&:hover': {
                backgroundColor: theme.palette.accent.dark,
            },
            '&:disabled': {
                color: 'rgba(0, 0, 0, 0.26)',
                boxShadow: 'none',
                backgroundColor: 'rgba(0, 0, 0, 0.12)',
            },
        },
        linkTitleWrapper: {
            border: '1px solid rgb(211, 211, 211)',
            marginTop: '1em',
            paddingBottom: '1em',
        },
        checkbox: {
            '& input[type="checkbox"]:checked + svg': {
                fill: '#595959',
            },
        },
    }),
    { withTheme: true },
);

export const AlertForm = ({ actions, alertResponse, alertStatus, defaults, alertError, history }) => {
    const classes = useStyles();
    const { alertid } = useParams();

    console.log('AlertForm: alert = ', alertResponse);
    console.log('AlertForm: alertStatus = ', alertStatus);

    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();

    const [isFormValid, setFormValidity] = useState(false);
    const [showPreview, setPreviewOpen] = useState(false);

    console.log('AlertForm: defaults = ', defaults);
    const [values, setValues] = useState(defaults);

    const isValidUrl = testurl => {
        if (testurl.length === 0) {
            return false;
        }
        try {
            // eslint-disable-next-line no-new
            const x = new URL(testurl);
            console.log('new url = ', x);
        } catch (_) {
            console.log('new url NOT valid');
            return false;
        }
        // while technically an url doesn't need a TLD - in practice it does
        if (!testurl.includes('.')) {
            return false;
        }
        console.log('new url IS valid');
        return true;
    };

    const handlePreview = showPreview => {
        const alertWrapper = document.getElementById('previewWrapper');
        /* istanbul ignore next */
        if (!alertWrapper) {
            return;
        }

        alertWrapper.parentElement.style.visibility = !!showPreview ? 'visible' : 'hidden';
        alertWrapper.parentElement.style.opacity = !!showPreview ? '1' : '0';

        setPreviewOpen(showPreview);
    };

    function isInvalidStartDate(startDate) {
        return (startDate < defaults.startDate && startDate !== '') || !moment(startDate).isValid();
    }

    function isInvalidEndDate(endDate, startDate) {
        return (endDate < startDate && startDate !== '') || !moment(endDate).isValid();
    }

    const validateValues = currentValues => {
        const isValid =
            !isInvalidStartDate(currentValues.startDate) &&
            !isInvalidEndDate(currentValues.endDate, currentValues.startDate) &&
            currentValues.alertTitle.length > 0 &&
            !!currentValues.enteredbody &&
            currentValues.enteredbody.length > 0 &&
            (!currentValues.linkRequired || currentValues.linkUrl.length > 0) &&
            (!currentValues.linkRequired || isValidUrl(currentValues.linkUrl));

        // if we are currently showing the preview and the form becomes invalid, hide it again
        !isValid && !!showPreview && handlePreview(false);

        return isValid;
    };

    useEffect(() => {
        if (!!defaults && defaults.type === 'clone') {
            setFormValidity(validateValues(defaults));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    console.log('AlertForm defaults.type = ', defaults.type);
    console.log('AlertForm alert = ', alertResponse);
    useEffect(() => {
        if (!!alertResponse && !!alertResponse.id && alertStatus === 'saved') {
            console.log('show conf after saving: ', alertResponse);
            showConfirmation();
        }
    }, [showConfirmation, alertResponse, alertStatus]);

    useEffect(() => {
        if (!!alertError || alertStatus === 'error') {
            console.log('There was an error while saving a new alert: ', alertError);
            showConfirmation();
        }
    }, [showConfirmation, alertError, alertStatus]);

    const clearForm = () => {
        setValues({
            ['alertTitle']: '',
            ['enteredbody']: '',
            ['startDate']: defaults.startDate,
            ['endDate']: defaults.endDate,
            ['urgent']: false,
            ['permanentAlert']: false,
            ['linkRequired']: false,
            ['linkTitle']: '',
            ['linkUrl']: '',
        });
    };

    const navigateToListPage = () => {
        clearForm();

        actions.clearAlerts(); // force the list page to reload after save

        actions.clearAnAlert(); // make the form clear for the next use

        history.push('/admin/alerts');

        const topOfPage = document.getElementById('StandardPage');
        !!topOfPage && topOfPage.scrollIntoView();
    };

    const navigateToCloneForm = () => {
        console.log('alertid = ', alertid);
        history.push(`/admin/alerts/clone/${alertid}`);

        const topOfPage = document.getElementById('StandardPage');
        !!topOfPage && topOfPage.scrollIntoView();
    };

    const navigateToEditForm = () => {
        console.log('alertResponse = ', alertResponse);
        console.log('alertResponse.id = ', alertResponse.id);
        history.push(`/admin/alerts/edit/${alertResponse.id}`);

        const topOfPage = document.getElementById('StandardPage');
        !!topOfPage && topOfPage.scrollIntoView();
    };

    const getBody = values => {
        const permanentAlert = values.permanentAlert ? '[permanent]' : '';
        const link = values.linkRequired ? `[${values.linkTitle}](${values.linkUrl})` : '';
        return `${values.enteredbody}${permanentAlert}${link}`;
    };

    function expandValues(values) {
        // because otherwise we see 'false' when we clear the field
        const newAlertTitle = values.alertTitle || /* istanbul ignore next */ '';

        const newLinkTitle = values.linkTitle || '';
        const newLinkUrl = values.linkUrl || '';

        const newBody = getBody(values);

        setValues({
            ...values,
            ['alertTitle']: newAlertTitle,
            ['body']: newBody,
            ['linkTitle']: newLinkTitle,
            ['linkUrl']: newLinkUrl,
            // ['startDate']: newStartDate,
            // ['endDate']: newEndDate,
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
        const newValues = {
            id: defaults.type !== 'add' ? values.id : null,
            title: values.alertTitle,
            body: values.body,
            urgent: !!values.urgent ? '1' : '0',
            start: formatDate(values.startDate),
            end: formatDate(values.endDate),
        };
        console.log('will save ', newValues);
        defaults.type === 'edit' ? actions.saveAlertChange(newValues) : actions.createAlert(newValues);

        // force to the top of the page, because otherwise it looks a bit weird
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    };

    const displayPreview = () => {
        const alertWrapper = document.getElementById('previewWrapper');
        !!alertWrapper && (alertWrapper.innerHTML = '');
        if (!!showPreview) {
            handlePreview(false);
            return;
        }

        handlePreview(true);
        expandValues(values);

        // oddly, hardcoding the alert with attributes tied to values doesnt work, so insert it this way
        const alertWebComponent = document.createElement('uq-alert');
        /* istanbul ignore next */
        if (!alertWebComponent) {
            return;
        }
        alertWebComponent.setAttribute('id', 'alert-preview');
        alertWebComponent.setAttribute('alerttitle', values.alertTitle);
        alertWebComponent.setAttribute('alerttype', !!values.urgent ? '1' : '0');
        let body = (!!values.body && getBody(values)) || getBody(defaults);
        // when they havent entered all the link details yet, dont display the link in the preview at all
        body = body.replace('[]()', '');
        body = body.replace(`[${values.linkTitle}]()`, '');
        body = body.replace(`[](${values.linkUrl})`, '');
        // when the alert body has the square bracket for 'permanent',
        // that enclosed string is not accepted by setattribute
        // something to do with XSS blocking for special char?
        // so we have to handle it manually :(
        if (!!values.permanentAlert) {
            alertWebComponent.setAttribute('alertmessage', body.replace('[permanent]', ''));
            // manually remove the 'non-permanent' button
            const changeMessage = setInterval(() => {
                // its a moment before it is available
                const preview = document.getElementById('alert-preview');
                const previewShadowRoot = !!preview && preview.shadowRoot;
                const closeButton = !!previewShadowRoot && previewShadowRoot.getElementById('alert-close');
                if (!!closeButton) {
                    closeButton.remove();
                    clearInterval(changeMessage);
                }
            }, 100);
        } else {
            alertWebComponent.setAttribute('alertmessage', body);
        }
        // so the user doesnt lose their work by clicking on the preview button,
        // change the href to an alert of what the click would be
        const popuptext = `On the live website, this button will visit ${values.linkUrl} when clicked`;
        if (!!values.linkRequired) {
            const changeLink = setInterval(() => {
                // its a moment before it is available
                const preview = document.getElementById('alert-preview');
                const previewShadowRoot = !!preview && preview.shadowRoot;
                const link = !!previewShadowRoot && previewShadowRoot.getElementById('alert-action-desktop');
                if (!!link) {
                    link.setAttribute('href', '#');
                    link.setAttribute('title', popuptext);
                    link.onclick = () => {
                        alert(popuptext);
                        return false;
                    };
                    clearInterval(changeLink);
                }
            }, 100);
        }
        alertWrapper.appendChild(alertWebComponent);
    };

    const handleChange = prop => event => {
        const newValue = !!event.target.value ? event.target.value : event.target.checked;
        setValues({ ...values, [prop]: newValue });

        expandValues({ ...values, [prop]: newValue });

        setFormValidity(validateValues({ ...values, [prop]: newValue }));

        // if the form has changed, hide the Preview
        handlePreview(false);
    };

    const errorLocale = {
        ...locale.form.add.addAlertError,
        confirmationTitle: `An error occurred: ${alertError}`,
    };

    const handleConfirmation = () => {
        if (defaults.type !== 'add') {
            // the action on edit page is always 'return to list'
            navigateToListPage();
        } else if (!!alertError) {
            // On error on add, the button just closes the notification dialog,
            // allowing the user to correct and try again
            hideConfirmation(); // form remains loaded
        } else {
            clearForm();
        }
    };

    return (
        <Fragment>
            <form>
                {alertStatus === 'error' && (
                    <ConfirmationBox
                        actionButtonColor="primary"
                        actionButtonVariant="contained"
                        confirmationBoxId="alert-error"
                        onAction={() => alertError === 'The requested page could not be found.' && navigateToListPage()}
                        onClose={hideConfirmation}
                        hideCancelButton
                        isOpen={isOpen}
                        locale={errorLocale}
                    />
                )}
                {alertStatus !== 'error' && defaults.type !== 'add' && (
                    <ConfirmationBox
                        actionButtonColor="primary"
                        actionButtonVariant="contained"
                        confirmationBoxId="alert-edit-save-succeeded"
                        onAction={handleConfirmation}
                        onClose={hideConfirmation}
                        hideCancelButton
                        isOpen={isOpen}
                        locale={locale.form.edit.editAlertConfirmation}
                    />
                )}
                {alertStatus !== 'error' && defaults.type === 'add' && (
                    <ConfirmationBox
                        actionButtonColor="secondary"
                        actionButtonVariant="contained"
                        confirmationBoxId="alert-add-save-succeeded"
                        onAction={handleConfirmation}
                        onClose={hideConfirmation}
                        onCancelAction={() => navigateToListPage()}
                        isOpen={isOpen}
                        locale={locale.form.add.addAlertConfirmation}
                    />
                )}
                {alertStatus !== 'error' && defaults.type === 'clone' && (
                    <ConfirmationBox
                        actionButtonColor="secondary"
                        actionButtonVariant="contained"
                        confirmationBoxId="alert-clone-save-succeeded"
                        onAction={navigateToEditForm}
                        onClose={hideConfirmation}
                        onCancelAction={() => navigateToListPage()}
                        isOpen={isOpen}
                        locale={locale.form.clone.cloneAlertConfirmation}
                        showAlternateActionButton
                        onAlternateAction={navigateToCloneForm}
                    />
                )}
                <StandardCard>
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
                                    onChange={handleChange('alertTitle')}
                                    inputProps={{ maxLength: 100 }}
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
                                    onChange={handleChange('enteredbody')}
                                    multiline
                                    rows={2}
                                    inputProps={{ maxLength: 550 }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} style={{ marginTop: 12 }}>
                        <Grid item md={6} xs={12}>
                            {/* https://material-ui.com/components/pickers/ */}
                            <TextField
                                id="startDate"
                                data-testid="admin-alerts-form-start-date"
                                error={isInvalidStartDate(values.startDate)}
                                InputLabelProps={{ shrink: true }}
                                label="Start date"
                                onChange={handleChange('startDate')}
                                type="datetime-local"
                                value={values.startDate}
                                inputProps={{
                                    min: defaults.minimumDate,
                                    required: true,
                                }}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                id="endDate"
                                data-testid="admin-alerts-form-end-date"
                                InputLabelProps={{ shrink: true }}
                                label="End date"
                                onChange={handleChange('endDate')}
                                type="datetime-local"
                                value={values.endDate}
                                error={isInvalidEndDate(values.endDate, values.startDate)}
                                inputProps={{
                                    min: values.startDate,
                                    required: true,
                                }}
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
                                    onChange={handleChange('linkRequired')}
                                    className={classes.checkbox}
                                />
                                Add info link
                            </InputLabel>
                        </Grid>
                        <Grid item sm={4} xs={12}>
                            <InputLabel style={{ color: 'rgba(0, 0, 0, 0.87)' }} title={locale.form.permanentTooltip}>
                                <Checkbox
                                    data-testid="admin-alerts-form-checkbox-permanent"
                                    checked={values.permanentAlert}
                                    onChange={handleChange('permanentAlert')}
                                    name="permanentAlert"
                                    title={locale.form.permanentTooltip}
                                    className={classes.checkbox}
                                />
                                Permanent
                            </InputLabel>
                        </Grid>
                        <Grid item sm={4} xs={12}>
                            <InputLabel style={{ color: 'rgba(0, 0, 0, 0.87)' }} title={locale.form.urgentTooltip}>
                                <Checkbox
                                    checked={values.urgent}
                                    data-testid="admin-alerts-form-checkbox-urgent"
                                    onChange={handleChange('urgent')}
                                    name="urgent"
                                    title={locale.form.urgentTooltip}
                                    className={classes.checkbox}
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
                                    onChange={handleChange('linkTitle')}
                                    title="Use destination page title or clear call to action. Minimise length; max length 55 characters."
                                    inputProps={{
                                        maxLength: 55,
                                    }}
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
                                    onChange={handleChange('linkUrl')}
                                    error={!isValidUrl(values.linkUrl)}
                                    title="Please enter a valid URL"
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
                                data-testid="admin-alerts-form-button-preview"
                                color={!!showPreview ? 'default' : 'secondary'}
                                children="Preview"
                                onClick={displayPreview}
                                style={{ marginRight: '0.5rem' }}
                                variant={!!showPreview ? 'outlined' : 'contained'}
                            />
                            <Button
                                color="primary"
                                data-testid="admin-alerts-form-button-save"
                                variant="contained"
                                children={defaults.type === 'clone' ? 'Add new' : 'Save'}
                                disabled={!isFormValid}
                                onClick={saveAlert}
                                className={classes.saveButton}
                            />
                        </Grid>
                    </Grid>
                </StandardCard>
            </form>
        </Fragment>
    );
};

AlertForm.propTypes = {
    actions: PropTypes.any,
    alertResponse: PropTypes.any,
    alertError: PropTypes.any,
    alertStatus: PropTypes.any,
    defaults: PropTypes.object,
    history: PropTypes.object,
};

export default AlertForm;
