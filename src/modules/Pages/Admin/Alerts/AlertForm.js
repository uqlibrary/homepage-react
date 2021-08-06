import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import AddCircleSharpIcon from '@material-ui/icons/AddCircleSharp';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';

const moment = require('moment');

import { default as locale } from './alertsadmin.locale';
import {
    formatDate,
    getBody,
    getTimeEndOfDayFormatted,
    getTimeNowFormatted,
    makePreviewActionButtonJustNotifyUser,
    manuallyMakeWebComponentBePermanent,
} from './alerthelpers';

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

    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();

    const [isFormValid, setFormValidity] = useState(false);
    const [showPreview, setPreviewOpen] = useState(false);

    const [values, setValues] = useState(defaults);
    const [dateList, setDateList] = useState([
        {
            startDate: defaults.startDateDefault,
            endDate: defaults.endDateDefault,
        },
    ]);

    const isValidUrl = testurl => {
        if (testurl.length < 'http://x.co'.length) {
            // minimum possible url
            return false;
        }
        try {
            const url = new URL(testurl);
            console.log('new url = ', url);
            if (url.hostname.length < 'x.co'.length) {
                return false;
            }
        } catch (_) {
            return false;
        }
        // while technically an url doesn't need a TLD - in practice it does
        if (!testurl.includes('.')) {
            return false;
        }
        return true;
    };

    const handlePreview = showThePreview => {
        const alertWrapper = document.getElementById('previewWrapper');
        /* istanbul ignore next */
        if (!alertWrapper) {
            return;
        }

        alertWrapper.parentElement.style.visibility = !!showThePreview ? 'visible' : 'hidden';
        alertWrapper.parentElement.style.opacity = !!showThePreview ? '1' : '0';

        setPreviewOpen(showThePreview);
    };

    function isInvalidStartDate(startDate) {
        return (startDate < defaults.startDateDefault && startDate !== '') || !moment(startDate).isValid();
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

    useEffect(() => {
        if (!!alertResponse && !!alertResponse.id && alertStatus === 'saved') {
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
            ['startDate']: defaults.startDateDefault,
            ['endDate']: defaults.endDateDefault,
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

    const reloadClonePage = () => {
        setValues({
            ...defaults,
            startDate: getTimeNowFormatted(),
            endDate: getTimeEndOfDayFormatted(),
        });

        const topOfPage = document.getElementById('StandardPage');
        !!topOfPage && topOfPage.scrollIntoView();
    };

    function expandValues(expandableValues) {
        // because otherwise we see 'false' when we clear the field
        const newAlertTitle = expandableValues.alertTitle || /* istanbul ignore next */ '';

        const newLinkTitle = expandableValues.linkTitle || '';
        const newLinkUrl = expandableValues.linkUrl || '';

        const newBody = getBody(expandableValues);

        const newStartDate = expandableValues.startDate || defaults.startDateDefault;
        const newEndDate = expandableValues.endDate || defaults.endDateDefault;

        return {
            ...expandableValues,
            ['alertTitle']: newAlertTitle,
            ['body']: newBody,
            ['linkTitle']: newLinkTitle,
            ['linkUrl']: newLinkUrl,
            ['startDate']: newStartDate,
            ['endDate']: newEndDate,
        };
    }

    const saveAlerts = () => {
        const expandedValues = expandValues(values);
        setValues(expandedValues);

        const newValues = {
            id: defaults.type !== 'add' ? values.id : null,
            title: values.alertTitle,
            body: expandedValues.body, // unsure why this isnt set into `values` by the Set call above
            urgent: !!values.urgent ? '1' : '0',
            start: formatDate(values.startDate),
            end: formatDate(values.endDate),
            dateList: values.dateList,
        };
        newValues.dateList.forEach(dateset => {
            // an 'edit' event will only have one entry in the date array
            const saveableValues = {
                ...newValues,
                start: formatDate(dateset.startDate),
                end: formatDate(dateset.endDate),
            };
            !!saveableValues.dateList && delete saveableValues.dateList;
            console.log('will save: ', saveableValues);
            defaults.type === 'edit' ? actions.saveAlertChange(saveableValues) : actions.createAlert(saveableValues);
        });

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
        setValues(expandValues(values));

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
        if (!!values.permanentAlert) {
            manuallyMakeWebComponentBePermanent(alertWebComponent, body);
        } else {
            alertWebComponent.setAttribute('alertmessage', body);
        }
        // so the user doesnt lose their work by clicking on the preview button,
        // change the href to an alert of what the click would be
        if (!!values.linkRequired) {
            makePreviewActionButtonJustNotifyUser(values);
        }
        alertWrapper.appendChild(alertWebComponent);
    };

    const handleChange = prop => event => {
        let dateListIndex = null;
        if (prop === 'startDate') {
            dateListIndex = event?.target?.id.replace('startDate-', '');
        }
        if (prop === 'endDate') {
            dateListIndex = event?.target?.id.replace('endDate-', '');
        }
        if (!!dateListIndex) {
            const tempDateEntry = {
                startDate: prop === 'startDate' ? event.target.value : values.dateList[dateListIndex].startDate,
                endDate: prop === 'endDate' ? event.target.value : values.dateList[dateListIndex].endDate,
            };
            const tempDateList = values.dateList;
            tempDateList[dateListIndex] = tempDateEntry;
            setValues({
                ...values,
                dateList: tempDateList,
            });

            setDateList([
                ...dateList,
                {
                    startDate: prop === 'startDate' ? event.target.value : values.dateList[dateListIndex].startDate,
                    endDate: prop === 'endDate' ? event.target.value : values.dateList[dateListIndex].endDate,
                },
            ]);
            return;
        }

        const newValue = !!event.target.value ? event.target.value : event.target.checked;
        setValues({ ...values, [prop]: newValue });

        const newValues = expandValues({ ...values, [prop]: newValue });
        setValues(newValues);

        setFormValidity(validateValues({ ...values, [prop]: newValue }));

        // if the form has changed, hide the Preview
        handlePreview(false);
    };

    const addDateRow = e => {
        console.log('addDateRow a = ', e);
        const tempValue = values;
        tempValue.dateList = [
            ...tempValue.dateList,
            {
                startDate: defaults.startDateDefault,
                endDate: defaults.endDateDefault,
            },
        ];
        setDateList([
            ...dateList,
            {
                startDate: defaults.startDateDefault,
                endDate: defaults.endDateDefault,
            },
        ]);
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
                {alertStatus !== 'error' && defaults.type === 'edit' && (
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
                        onClose={hideConfirmation}
                        onAction={() => reloadClonePage()}
                        isOpen={isOpen}
                        locale={locale.form.clone.cloneAlertConfirmation}
                        onCancelAction={() => navigateToListPage()}
                    />
                )}
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
                {!!values.dateList &&
                    values.dateList.map((dateset, index) => {
                        return (
                            <Grid key={`dateset-${index}`} container spacing={2} style={{ marginTop: 12 }}>
                                <Grid item md={6} xs={12}>
                                    {/* https://material-ui.com/components/pickers/ */}
                                    <TextField
                                        id={`startDate-${index}`}
                                        data-testid={`admin-alerts-form-start-date-${index}`}
                                        error={isInvalidStartDate(dateset.startDate)}
                                        InputLabelProps={{ shrink: true }}
                                        label="Start date"
                                        onChange={handleChange('startDate')}
                                        pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                                        type="datetime-local"
                                        value={values.dateList[index].startDate}
                                        inputProps={{
                                            min: defaults.minimumDate,
                                            required: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item md={5} xs={12}>
                                    <TextField
                                        id={`endDate-${index}`}
                                        data-testid={`admin-alerts-form-end-date-${index}`}
                                        InputLabelProps={{ shrink: true }}
                                        label="End date"
                                        onChange={handleChange('endDate')}
                                        pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                                        type="datetime-local"
                                        value={values.dateList[index].endDate}
                                        error={isInvalidEndDate(dateset.endDate, dateset.startDate)}
                                        inputProps={{
                                            min: values.dateList[index].startDate,
                                            required: true,
                                        }}
                                    />
                                </Grid>
                                {['add', 'clone'].includes(defaults.type) && index === values.dateList.length - 1 && (
                                    <Grid item md={1} xs={12}>
                                        <IconButton
                                            data-testid={`admin-alerts-form-another-date-button-${index}`}
                                            onClick={addDateRow}
                                            title="Add another event with the same text but different start-end times"
                                        >
                                            <AddCircleSharpIcon />
                                        </IconButton>
                                    </Grid>
                                )}
                            </Grid>
                        );
                    })}
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
                            children={defaults.type === 'edit' ? 'Save' : 'Create'}
                            disabled={!isFormValid}
                            onClick={saveAlerts}
                            className={classes.saveButton}
                        />
                    </Grid>
                </Grid>
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
