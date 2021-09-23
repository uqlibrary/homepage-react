import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import AddCircleSharpIcon from '@material-ui/icons/AddCircleSharp';
import RemoveCircleSharpIcon from '@material-ui/icons/RemoveCircle';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

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
            '&:disabled': {
                color: 'rgba(0, 0, 0, 0.26)',
                boxShadow: 'none',
                backgroundColor: 'rgba(0, 0, 0, 0.12)',
            },
        },
        box: {
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

export const AlertForm = ({ actions, alertLoading, alertResponse, alertStatus, defaults, alertError, history }) => {
    const classes = useStyles();

    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();

    const [isFormValid, setFormValidity] = useState(false); // enable-disable the save button
    const [showPreview, setPreviewOpen] = useState(false); // show hide the preview block

    const [values, setValues] = useState(defaults); // the data displayed in the form
    const [countSuccess, setSuccessCount] = useState(0); // store the number of success saves to display to the user
    const [dateList, setDateList] = useState([
        // list of details for "another date row" button
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

    const showHidePreview = showThePreview => {
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
            !alertLoading &&
            !isInvalidStartDate(currentValues.startDate) &&
            !isInvalidEndDate(currentValues.endDate, currentValues.startDate) &&
            currentValues.alertTitle.length > 0 &&
            !!currentValues.enteredbody &&
            currentValues.enteredbody.length > 0 &&
            (!currentValues.linkRequired || currentValues.linkUrl.length > 0) &&
            (!currentValues.linkRequired || isValidUrl(currentValues.linkUrl));

        // if we are currently showing the preview and the form becomes invalid, hide it again
        !isValid && !!showPreview && showHidePreview(false);

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
            setSuccessCount(prevCount => prevCount + 1);
            showConfirmation();
        }
    }, [showConfirmation, alertResponse, alertStatus]);

    useEffect(() => {
        if (!!alertError || alertStatus === 'error') {
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
            ['dateList']: [
                {
                    startDate: defaults.startDateDefault,
                    endDate: defaults.endDateDefault,
                },
            ],
            ['systems']: [],
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
            dateList: [
                {
                    startDate: getTimeNowFormatted(),
                    endDate: getTimeEndOfDayFormatted(),
                },
            ],
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
            ['systems']: expandableValues.systems || [],
        };
    }

    const saveAlerts = () => {
        setSuccessCount(0);
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
            systems: values.systems || [],
        };
        console.log('saveAlerts: newValues = ', newValues);
        newValues.dateList.forEach(dateset => {
            // an 'edit' event will only have one entry in the date array
            const saveableValues = {
                ...newValues,
                start: formatDate(dateset.startDate),
                end: formatDate(dateset.endDate),
            };
            !!saveableValues.dateList && delete saveableValues.dateList;
            defaults.type === 'edit' ? actions.saveAlertChange(saveableValues) : actions.createAlert(saveableValues);
        });

        const alertWrapper = document.getElementById('previewWrapper');
        !!alertWrapper && (alertWrapper.innerHTML = '');
        showHidePreview(false);

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
            showHidePreview(false);
            return;
        }

        showHidePreview(true);
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
        if (!!values.linkRequired) {
            makePreviewActionButtonJustNotifyUser(values);
        }
        alertWrapper.appendChild(alertWebComponent);
    };

    const handleChange = prop => event => {
        if (prop === 'system') {
            const systems = values.systems || [];
            if (systems.includes(event.target.name) && !event.target.checked) {
                // system exists in array and the checkbox has been unchecked. Remove.
                const index = systems.indexOf(event.target.name);
                index >= 0 && systems.splice(index, 1);
            } else if (!systems.includes(event.target.name) && !!event.target.checked) {
                // system doesnt exist in array and the checkbox has been checked. Add.
                systems.push(event.target.name);
            }
            setValues({
                ...values,
                systems: systems,
            });
            setFormValidity(validateValues(values));
            return;
        }

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

            setFormValidity(validateValues({ ...values, dateList: tempDateList }));

            return;
        }

        const newValue = !!event.target.value ? event.target.value : event.target.checked;
        setValues({ ...values, [prop]: newValue });

        const newValues = expandValues({ ...values, [prop]: newValue });
        setValues(newValues);

        setFormValidity(validateValues({ ...values, [prop]: newValue }));

        // if the form has changed, hide the Preview
        showHidePreview(false);
    };

    const removeDateRow = indexRowToBeRemoved => {
        const filteredDatelist = values.dateList.filter((row, index) => {
            return index !== indexRowToBeRemoved;
        });
        setDateList(filteredDatelist);
        setValues({
            ...values,
            dateList: filteredDatelist,
        });
    };

    const addDateRow = () => {
        const tempValue = values;
        tempValue.dateList = [
            ...tempValue.dateList,
            {
                startDate: getTimeNowFormatted(),
                endDate: getTimeEndOfDayFormatted(),
            },
        ];
        setDateList([
            ...dateList,
            {
                startDate: getTimeNowFormatted(),
                endDate: getTimeEndOfDayFormatted(),
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

    function postAddConfirmationDetails() {
        // update the number of alerts saved if they saved multiple date-sets
        return {
            ...locale.form.add.addAlertConfirmation,
            confirmationTitle: locale.form.add.addAlertConfirmation.confirmationTitle.replace(
                'An alert has',
                countSuccess > 1 ? `${countSuccess} alerts have` : 'An alert has',
            ),
        };
    }

    function postAddCloneDetails() {
        // update the number of alerts saved if they saved multiple date-sets
        return {
            ...locale.form.clone.cloneAlertConfirmation,
            confirmationTitle: locale.form.clone.cloneAlertConfirmation.confirmationTitle.replace(
                'The alert has',
                countSuccess > 1 ? `${countSuccess} alerts have` : 'The alert has',
            ),
        };
    }

    // the slug is saved to the db, the title is displayed on the form
    // note here what this list needs to be synced with
    const systemList = [
        {
            slug: 'homepage',
            title: 'Home page',
        },
        {
            slug: 'espace',
            title: 'eSpace *not yet available',
        },
        {
            slug: 'primo',
            title: 'Primo',
        },
    ];

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
                        locale={postAddConfirmationDetails()}
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
                        locale={postAddCloneDetails()}
                        onCancelAction={() => navigateToListPage()}
                    />
                )}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth title={locale.form.tooltips.title}>
                            <InputLabel htmlFor="alertTitle">{locale.form.labels.title}</InputLabel>
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
                        <FormControl fullWidth title={locale.form.tooltips.message}>
                            <InputLabel htmlFor="alertBody" style={{ minHeight: '1.1em' }}>
                                {locale.form.labels.message}
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
                                <Grid item md={5} xs={12}>
                                    <TextField
                                        id={`startDate-${index}`}
                                        data-testid={`admin-alerts-form-start-date-${index}`}
                                        error={isInvalidStartDate(dateset.startDate)}
                                        InputLabelProps={{ shrink: true }}
                                        label={locale.form.labels.startdate}
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
                                        label={locale.form.labels.enddate}
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
                                <Grid item md={2} xs={12}>
                                    {['add', 'clone'].includes(defaults.type) &&
                                    index === values.dateList.length - 1 ? (
                                        <IconButton
                                            data-testid={`admin-alerts-form-another-date-button-${index}`}
                                            onClick={addDateRow}
                                            title={locale.form.tooltips.addAnotherDateSet}
                                            style={{ minWidth: 60 }}
                                        >
                                            <AddCircleSharpIcon />
                                        </IconButton>
                                    ) : (
                                        <Typography className="MuiButtonBase-root" style={{ minWidth: 60 }}>
                                            &nbsp;
                                        </Typography>
                                    )}
                                    {['add', 'clone'].includes(defaults.type) && values.dateList.length > 1 && (
                                        <IconButton
                                            data-testid={`admin-alerts-form-remove-date-button-${index}`}
                                            onClick={() => removeDateRow(index)}
                                            title={locale.form.tooltips.removeDateSet}
                                        >
                                            <RemoveCircleSharpIcon />
                                        </IconButton>
                                    )}
                                </Grid>
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
                        <InputLabel style={{ color: 'rgba(0, 0, 0, 0.87)' }} title={locale.form.tooltips.link.checkbox}>
                            <Checkbox
                                checked={values.linkRequired}
                                data-testid="admin-alerts-form-checkbox-linkrequired"
                                onChange={handleChange('linkRequired')}
                                className={classes.checkbox}
                            />
                            {locale.form.labels.link.checkbox}
                        </InputLabel>
                    </Grid>
                    <Grid item sm={4} xs={12}>
                        <InputLabel style={{ color: 'rgba(0, 0, 0, 0.87)' }} title={locale.form.tooltips.permanent}>
                            <Checkbox
                                data-testid="admin-alerts-form-checkbox-permanent"
                                checked={values.permanentAlert}
                                onChange={handleChange('permanentAlert')}
                                name="permanentAlert"
                                title={locale.form.permanentTooltip}
                                className={classes.checkbox}
                            />
                            {locale.form.labels.permanent}
                        </InputLabel>
                    </Grid>
                    <Grid item sm={4} xs={12}>
                        <InputLabel style={{ color: 'rgba(0, 0, 0, 0.87)' }} title={locale.form.tooltips.urgent}>
                            <Checkbox
                                checked={values.urgent}
                                data-testid="admin-alerts-form-checkbox-urgent"
                                onChange={handleChange('urgent')}
                                name="urgent"
                                title={locale.form.urgentTooltip}
                                className={classes.checkbox}
                            />
                            {locale.form.labels.urgent}
                        </InputLabel>
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={2}
                    className={classes.box}
                    style={{
                        display: values.linkRequired ? 'flex' : 'none',
                    }}
                >
                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="linkTitle">{locale.form.labels.link.title}</InputLabel>
                            <Input
                                id="linkTitle"
                                data-testid="admin-alerts-form-link-title"
                                value={values.linkTitle}
                                onChange={handleChange('linkTitle')}
                                title={locale.form.tooltips.link.title}
                                inputProps={{
                                    maxLength: 55,
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="linkUrl">{locale.form.labels.link.url}</InputLabel>
                            <Input
                                type="url"
                                id="linkUrl"
                                data-testid="admin-alerts-form-link-url"
                                value={values.linkUrl}
                                onChange={handleChange('linkUrl')}
                                error={!isValidUrl(values.linkUrl)}
                                title={locale.form.tooltips.link.url}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container className={classes.box} spacing={2}>
                    <Grid item xs={12}>
                        <p>
                            This alert should <strong>only</strong> appear on...
                            <span style={{ fontSize: '0.8em' }}> (Leave all blank to show on all systems.)</span>
                        </p>
                    </Grid>
                    <Grid item xs={12}>
                        {systemList.map(system => {
                            const isChecked = values?.systems?.find(s => s === system.slug) || null;
                            return (
                                <InputLabel style={{ color: 'rgba(0, 0, 0, 0.87)' }} key={system.slug}>
                                    <Checkbox
                                        checked={!!isChecked}
                                        data-testid={`admin-alerts-form-checkbox-system-${system.slug}`}
                                        onChange={handleChange('system')}
                                        name={system.slug}
                                        title={system.title}
                                        className={classes.checkbox}
                                    />
                                    {system.title}
                                </InputLabel>
                            );
                        })}
                    </Grid>
                    <Grid item xs={12}>
                        <p>This list is TBA!!</p>
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
    alertLoading: PropTypes.any,
    alertStatus: PropTypes.any,
    defaults: PropTypes.object,
    history: PropTypes.object,
};

export default AlertForm;
