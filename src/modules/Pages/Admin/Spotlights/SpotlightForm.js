import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';

const moment = require('moment');

import { default as locale } from './spotlightsadmin.locale';
import { formatDate, getTimeEndOfDayFormatted, getTimeNowFormatted } from './spotlighthelpers';

const useStyles = makeStyles(() => ({
    saveButton: {
        '&:disabled': {
            color: 'rgba(0, 0, 0, 0.26)',
            boxShadow: 'none',
            backgroundColor: 'rgba(0, 0, 0, 0.12)',
        },
    },
}));

export const SpotlightForm = ({
    actions,
    spotlightLoading,
    spotlightResponse,
    spotlightStatus,
    defaults,
    spotlightError,
    history,
}) => {
    const classes = useStyles();

    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();

    const [isFormValid, setFormValidity] = useState(false); // enable-disable the save button

    const [values, setValues] = useState(defaults); // the data displayed in the form

    const isValidUrl = testurl => {
        if (!!testurl && testurl.length < 'http://x.co'.length) {
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

    function isInvalidStartDate(startDate) {
        return (startDate < defaults.startDateDefault && startDate !== '') || !moment(startDate).isValid();
    }

    function isInvalidEndDate(endDate, startDate) {
        return (endDate < startDate && startDate !== '') || !moment(endDate).isValid();
    }

    const validateValues = currentValues => {
        const isValid =
            !spotlightLoading &&
            !isInvalidStartDate(currentValues.startDate) &&
            !isInvalidEndDate(currentValues.endDate, currentValues.startDate) &&
            currentValues.spotlightTitle.length > 0 &&
            !!currentValues.enteredbody &&
            currentValues.enteredbody.length > 0 &&
            (!currentValues.linkRequired || currentValues.linkUrl.length > 0) &&
            (!currentValues.linkRequired || isValidUrl(currentValues.linkUrl));

        return isValid;
    };

    useEffect(() => {
        if (!!defaults && defaults.type === 'clone') {
            setFormValidity(validateValues(defaults));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!!spotlightResponse && !!spotlightResponse.id && spotlightStatus === 'saved') {
            showConfirmation();
        }
    }, [showConfirmation, spotlightResponse, spotlightStatus]);

    useEffect(() => {
        if (!!spotlightError || spotlightStatus === 'error') {
            showConfirmation();
        }
    }, [showConfirmation, spotlightError, spotlightStatus]);

    const clearForm = () => {
        setValues({
            ['alertTitle']: '',
            ['enteredbody']: '',
            ['startDate']: defaults.startDateDefault,
            ['endDate']: defaults.endDateDefault,
            ['urgent']: false,
            // ['permanentSpotlight']: false,
            ['linkRequired']: false,
            ['linkTitle']: '',
            ['linkUrl']: '',
            ['dateList']: [
                {
                    startDate: defaults.startDateDefault,
                    endDate: defaults.endDateDefault,
                },
            ],
        });
    };

    const navigateToListPage = () => {
        clearForm();

        actions.clearSpotlights(); // force the list page to reload after save

        actions.clearASpotlight(); // make the form clear for the next use

        history.push('/admin/spotlights');

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
        const newBody = expandableValues.body || '';

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

    const saveSpotlights = () => {
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

        defaults.type === 'edit' ? actions.saveSpotlightChange(newValues) : actions.createSpotlight(newValues);

        // force to the top of the page, because otherwise it looks a bit weird
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    };

    const handleChange = prop => event => {
        const newValue = !!event.target.value ? event.target.value : event.target.checked;
        setValues({ ...values, [prop]: newValue });

        const newValues = expandValues({ ...values, [prop]: newValue });
        setValues(newValues);

        setFormValidity(validateValues({ ...values, [prop]: newValue }));
    };

    const errorLocale = {
        ...locale.form.add.addSpotlightError,
        confirmationTitle: `An error occurred: ${spotlightError}`,
    };

    const handleConfirmation = () => {
        if (defaults.type === 'edit') {
            // the action on edit page is always 'return to list'
            navigateToListPage();
        } else if (!!spotlightError) {
            // On error on creation, the button just closes the notification dialog,
            // allowing the user to correct and try again
            hideConfirmation(); // form remains loaded
        } else {
            clearForm();
        }
    };

    return (
        <Fragment>
            <form>
                {spotlightStatus === 'error' && (
                    <ConfirmationBox
                        actionButtonColor="primary"
                        actionButtonVariant="contained"
                        confirmationBoxId="spotlight-error"
                        onAction={() =>
                            spotlightError === 'The requested page could not be found.' && navigateToListPage()
                        }
                        onClose={hideConfirmation}
                        hideCancelButton
                        isOpen={isOpen}
                        locale={errorLocale}
                    />
                )}
                {spotlightStatus !== 'error' && defaults.type === 'edit' && (
                    <ConfirmationBox
                        actionButtonColor="secondary"
                        actionButtonVariant="contained"
                        confirmationBoxId="spotlight-edit-save-succeeded"
                        onAction={handleConfirmation}
                        onClose={hideConfirmation}
                        hideCancelButton
                        isOpen={isOpen}
                        locale={locale.form.edit.editSpotlightConfirmation}
                    />
                )}
                {spotlightStatus !== 'error' && defaults.type === 'add' && (
                    <ConfirmationBox
                        actionButtonColor="secondary"
                        actionButtonVariant="contained"
                        confirmationBoxId="spotlight-add-save-succeeded"
                        onAction={handleConfirmation}
                        onClose={hideConfirmation}
                        onCancelAction={() => navigateToListPage()}
                        isOpen={isOpen}
                        locale={locale.form.add.addSpotlightConfirmation}
                    />
                )}
                {spotlightStatus !== 'error' && defaults.type === 'clone' && (
                    <ConfirmationBox
                        actionButtonColor="secondary"
                        actionButtonVariant="contained"
                        confirmationBoxId="spotlight-clone-save-succeeded"
                        onClose={hideConfirmation}
                        onAction={() => reloadClonePage()}
                        isOpen={isOpen}
                        locale={locale.form.clone.cloneSpotlightConfirmation}
                        onCancelAction={() => navigateToListPage()}
                    />
                )}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth title="Help TBA">
                            <InputLabel htmlFor="spotlightTitle">Title *</InputLabel>
                            <Input
                                id="spotlightTitle"
                                data-testid="admin-spotlights-form-title"
                                value={values.title}
                                onChange={handleChange('spotlightTitle')}
                                inputProps={{ maxLength: 100 }}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth title="Tooltip TBA. Optional - if blank Title will duplicate as tooltip">
                            <InputLabel htmlFor="spotlightTitle">
                                Tooltip text - visible when user mouses over spotlight
                            </InputLabel>
                            <Input
                                id="spotlightTitle"
                                data-testid="admin-spotlights-form-tooltip"
                                value={values.img_alt}
                                onChange={handleChange('spotlightTooltip')}
                                inputProps={{ maxLength: 100 }}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth title="Please enter a valid URL">
                            <InputLabel htmlFor="linkUrl">Spotlight link *</InputLabel>
                            <Input
                                type="url"
                                id="linkUrl"
                                data-testid="admin-spotlights-form-link-url"
                                value={values.img_url}
                                onChange={handleChange('img_url')}
                                error={!isValidUrl(values.img_url)}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={2} style={{ marginTop: 12 }}>
                    <Grid item md={5} xs={12}>
                        {/* https://material-ui.com/components/pickers/ */}
                        <TextField
                            data-testid="admin-spotlights-form-start-date"
                            error={isInvalidStartDate(values.startDate)}
                            InputLabelProps={{ shrink: true }}
                            label="Start date"
                            onChange={handleChange('startDate')}
                            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                            type="datetime-local"
                            value={values.startDate}
                            inputProps={{
                                min: defaults.minimumDate,
                                required: true,
                            }}
                        />
                    </Grid>
                    <Grid item md={5} xs={12}>
                        <TextField
                            data-testid="admin-spotlights-form-end-date"
                            InputLabelProps={{ shrink: true }}
                            label="End date"
                            onChange={handleChange('endDate')}
                            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
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
                <Grid container spacing={2} style={{ marginTop: '1rem' }}>
                    <Grid item xs={3} align="left">
                        <Button
                            color="secondary"
                            children="Cancel"
                            data-testid="admin-spotlights-form-button-cancel"
                            onClick={() => navigateToListPage()}
                            variant="contained"
                        />
                    </Grid>
                    <Grid item xs={9} align="right">
                        <Button
                            color="primary"
                            data-testid="admin-spotlights-form-button-save"
                            variant="contained"
                            children={defaults.type === 'edit' ? 'Save' : 'Create'}
                            disabled={!isFormValid}
                            onClick={saveSpotlights}
                            className={classes.saveButton}
                        />
                    </Grid>
                </Grid>
            </form>
        </Fragment>
    );
};

SpotlightForm.propTypes = {
    actions: PropTypes.any,
    spotlightResponse: PropTypes.any,
    spotlightError: PropTypes.any,
    spotlightLoading: PropTypes.any,
    spotlightStatus: PropTypes.any,
    defaults: PropTypes.object,
    history: PropTypes.object,
};

export default SpotlightForm;
