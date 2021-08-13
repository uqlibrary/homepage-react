import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
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

import { default as locale } from './spotlightsadmin.locale';
// import { formatDate, getTimeEndOfDayFormatted, getTimeNowFormatted } from './spotlighthelpers';
import { formatDate } from './spotlighthelpers';

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
    spotlightsLoading,
    spotlightResponse,
    spotlightStatus,
    defaults,
    spotlightError,
    history,
}) => {
    const classes = useStyles();

    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();

    const [isFormValid, setFormValidity] = useState(false); // enable-disable the save button

    console.log('defaults = ', defaults);
    const [values, setValues] = useState({
        // the data displayed in the form
        ...defaults,
        start: defaults.startDateDefault,
        end: defaults.endDateDefault,
    });

    const isValidTitle = title => {
        return title.length > 0;
    };

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
            !spotlightsLoading &&
            !isInvalidStartDate(currentValues.start) &&
            !isInvalidEndDate(currentValues.end, currentValues.start) &&
            !!isValidTitle(currentValues.title) &&
            // !!currentValues.url &&
            // currentValues.img_alt.length > 0 &&
            // currentValues.img_url.length > 0 &&
            // currentValues.url.length > 0 &&
            isValidUrl(currentValues.url);

        console.log('validateValues: isValid = ', isValid, currentValues);
        // console.log(
        //     'validateValues: isInvalidStartDate(',
        //     currentValues.start,
        //     ') = ',
        //     isInvalidStartDate(currentValues.start),
        // );
        // console.log('validateValues: currentValues.end = ', currentValues.end);
        // console.log(
        //     'validateValues: isInvalidStartDate(',
        //     currentValues.end,
        //     ') = ',
        //     isInvalidStartDate(currentValues.end),
        // );
        // console.log('validateValues: spotlightsLoading = ', spotlightsLoading);
        // console.log('validateValues: isValidTitle(', currentValues.title, ') = ', isValidTitle(currentValues.title));
        // console.log('validateValues: isValidUrl(', currentValues.url, ') = ', isValidUrl(currentValues.url));
        // console.log('validateValues: currentValues.img_alt = ', currentValues.img_alt);
        // console.log('validateValues: currentValues = ', currentValues);

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
        setValues(defaults);
        // setValues({
        //     ['title']: '',
        //     ['url']: '',
        //     ['start']: defaults.startDateDefault,
        //     ['end']: defaults.endDateDefault,
        //     ['urgent']: false,
        //     ['img_alt']: '',
        //     ['img_url']: '',
        //     ['weight']: 0,
        //     ['active']: 0,
        //     startDateDefault: getTimeNowFormatted(),
        //     endDateDefault: getTimeEndOfDayFormatted(),
        // });
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
        setValues(defaults);

        const topOfPage = document.getElementById('StandardPage');
        !!topOfPage && topOfPage.scrollIntoView();
    };

    const saveSpotlight = () => {
        const newValues = {
            id: defaults.type !== 'add' ? values.id : null,
            start: formatDate(values.start),
            end: formatDate(values.end),
            title: values.title,
            url: values.url, // unsure why this isnt set into `values` by the Set call above
            img_url: values.img_url,
            img_alt: values.img_alt || values.title,
            weight: values.weight,
            active: !!values.active ? 1 : 0,
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
        console.log('handleChange ', prop, ': newValue = ', newValue);
        setValues({ ...values, [prop]: newValue });

        console.log('handleChange values now = ', values);
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
                            <InputLabel htmlFor="spotlightTitle">Title - visible to assitive technology *</InputLabel>
                            <Input
                                id="spotlightTitle"
                                data-testid="admin-spotlights-form-title"
                                error={!isValidTitle(values.title)}
                                inputProps={{ maxLength: 100 }}
                                onChange={handleChange('title')}
                                required
                                value={values.title}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl
                            fullWidth
                            title="Tooltip TBA. Optional - if blank, Title will duplicate as tooltip"
                        >
                            <InputLabel htmlFor="spotlightTooltip">
                                Tooltip text - visible when user mouses over spotlight
                            </InputLabel>
                            <Input
                                id="spotlightTooltip"
                                data-testid="admin-spotlights-form-tooltip"
                                value={values.img_alt}
                                onChange={handleChange('img_alt')}
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
                                value={values.url}
                                onChange={handleChange('url')}
                                error={!isValidUrl(values.url)}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={2} style={{ marginTop: 12 }}>
                    <Grid item md={5} xs={12}>
                        {/* https://material-ui.com/components/pickers/ */}
                        <TextField
                            data-testid="admin-spotlights-form-start-date"
                            error={isInvalidStartDate(values.start)}
                            InputLabelProps={{ shrink: true }}
                            label="Date published"
                            onChange={handleChange('start')}
                            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                            type="datetime-local"
                            value={values.start}
                            inputProps={{
                                min: defaults.minimumDate,
                                required: true,
                                'aria-label': 'Date the spotlight will be published',
                            }}
                        />
                    </Grid>
                    <Grid item md={5} xs={12}>
                        <TextField
                            data-testid="admin-spotlights-form-end-date"
                            InputLabelProps={{ shrink: true }}
                            label="Date unpublished"
                            onChange={handleChange('end')}
                            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                            type="datetime-local"
                            value={values.end}
                            error={isInvalidEndDate(values.end, values.start)}
                            inputProps={{
                                min: values.start,
                                required: true,
                                'aria-label': 'Date the spotlight will be unpublished',
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} style={{ marginTop: '1rem' }}>
                    <Grid item xs={3} align="left">
                        <div style={{ width: '90%', height: '4rem', padding: '1rem', backgroundColor: 'lightgrey' }}>
                            File Upload tbd
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={2} style={{ marginTop: '1rem' }}>
                    <Grid item xs={3} align="left">
                        <InputLabel
                            style={{ color: 'rgba(0, 0, 0, 0.87)' }}
                            title="Check to add button to alert linking to more information. Displays extra form fields."
                        >
                            <Checkbox
                                checked={values.active === 1}
                                data-testid="admin-alerts-form-checkbox-published"
                                onChange={handleChange('active')}
                                className={classes.checkbox}
                            />
                            Published?
                        </InputLabel>
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
                            onClick={saveSpotlight}
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
    spotlightsLoading: PropTypes.any,
    spotlightStatus: PropTypes.any,
    defaults: PropTypes.object,
    history: PropTypes.object,
};

export default SpotlightForm;
