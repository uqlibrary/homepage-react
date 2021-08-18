import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/styles';
import { KeyboardDateTimePicker } from '@material-ui/pickers';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { SpotlightUploader } from 'modules/Pages/Admin/Spotlights/SpotlightUploader';
import { default as locale } from './spotlightsadmin.locale';
// import { formatDate, getTimeEndOfDayFormatted, getTimeNowFormatted } from './spotlighthelpers';
import { formatDate } from './spotlighthelpers';

import { useConfirmationState } from 'hooks';

const moment = require('moment');

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
    publicFileUploading,
    publicFileUploadError,
    publicFileUploadResult,
    history,
}) => {
    console.log('uploadPublicFile: publicFileUploading = ', publicFileUploading);
    console.log('uploadPublicFile: publicFileUploadError = ', publicFileUploadError);
    console.log('uploadPublicFile: publicFileUploadResult = ', publicFileUploadResult);
    // !!publicFileUploadResult
    //     ? console.log('uploadPublicFile: publicFileUploadResult join = ', publicFileUploadResult.join(' ').trim())
    //     : console.log('no join publicFileUploadResult = ', publicFileUploadResult);
    const classes = useStyles();

    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();
    // const [isOpenUploadFile, showErrorUploadFile, hideConfirmationUploadFile] = useConfirmationState();

    const [isFormValid, setFormValidity] = useState(false); // enable-disable the save button
    const [uploadedFiles, setUploadedFiles] = useState(null);

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

    function isValidStartDate(param, startDate) {
        const momentStartDate = new moment(startDate);
        const momentStartDateFormatted = momentStartDate.format('YYYY-MM-DDTHH:mm');
        return (
            startDate !== '' && momentStartDateFormatted >= defaults.startDateDefault && !!moment(startDate).isValid()
        );
    }

    function isInvalidStartDate(param, startDate) {
        return !isValidStartDate(param, startDate);
    }

    function isInvalidEndDate(endDate, startDate) {
        return (endDate < startDate && startDate !== '') || !moment(endDate).isValid();
    }

    const validateValues = currentValues => {
        console.log('validateValues: currentValues = ', currentValues);
        const isValid =
            !spotlightsLoading &&
            !isInvalidStartDate(null, currentValues.start) &&
            !isInvalidEndDate(currentValues.end, currentValues.start) &&
            !!isValidTitle(currentValues.title) &&
            // currentValues.img_alt.length > 0 && // set to title during save if blank
            // !!currentValues.localfilename &&
            // currentValues.localfilename.length > 0 &&
            !!currentValues.uploadedFile &&
            // currentValues.fileDetails.length > 0 &&
            !!currentValues.url &&
            currentValues.url.length > 0 &&
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
        // console.log('uploadedFiles set to ', uploadedFiles);
        console.log('values have been changed to: ', values);
        setFormValidity(validateValues(values));
    }, [values]);

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

    useEffect(() => {
        if (!!publicFileUploadError) {
            showConfirmation();
        }
    }, [showConfirmation, publicFileUploadError]);

    const addAriaLabelToMuiDatePickerButton = (idDiv, ariaLabel) => {
        const theBlock = document.getElementById(idDiv);
        const theButton = !!theBlock && theBlock.parentNode.querySelector('button');
        !!theButton && !theButton.hasAttribute('aria-label') && theButton.setAttribute('aria-label', ariaLabel);
    };

    const runAfterRender = () => {
        // component doesnt allow pass of aria-label to the button, and we have 2, so they need distinct labels
        addAriaLabelToMuiDatePickerButton('admin-spotlights-form-start-date-label', 'Select publish date-time');
        addAriaLabelToMuiDatePickerButton('admin-spotlights-form-end-date-label', 'Select unpublish date-time');
    };

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

    const handleSpotlightCreation = newValues => {
        console.log('handleSpotlightCreation 1: newValues = ', newValues);
        if (defaults.type === 'add') {
            console.log('handleSpotlightCreation: uploadedFiles = ', uploadedFiles);
            // only 1 file may be uploaded, but it comes in an array
            // const uploadedFile = !!uploadedFiles && uploadedFiles.lengh > 0 && uploadedFiles.shift();
            // newValues.uploadedFile = uploadedFile;
            console.log('handleSpotlightCreation 2: newValues = ', newValues);
            // !!uploadedFile && actions.createSpotlightWithFile(newValues);
            actions.createSpotlightWithFile(newValues);
        } else {
            // newValues.img_url should be supplied by the form, because we preview the image in there
            actions.createSpotlight(newValues);
        }
    };

    const saveSpotlight = () => {
        console.log('saveSpotlight: values = ', values);
        const newValues = {
            id: defaults.type !== 'add' ? values.id : null,
            start: formatDate(values.start),
            end: formatDate(values.end),
            title: values.title,
            url: values.url,
            // img_url: values.img_url,
            img_alt: values.img_alt || values.title,
            weight: values.weight,
            active: !!values.active ? 1 : 0,
        };

        console.log('saveSpotlight defaults.type = ', defaults.type);
        console.log(
            defaults.type === 'edit'
                ? 'saveSpotlight actions.saveSpotlightChange: newValues = '
                : 'saveSpotlight handleSpotlightCreation: newValues = ',
        );
        console.log('saveSpotlight: newValues = ', newValues);
        defaults.type === 'edit' ? actions.saveSpotlightChange(newValues) : handleSpotlightCreation(newValues);

        // force to the top of the page, because otherwise it looks a bit weird
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    };

    const handleChange = prop => event => {
        let newValue;
        if (['start', 'end'].includes(prop)) {
            newValue = event.format('YYYY/MM/DD hh:mm a');
        } else {
            newValue = !!event.target.value ? event.target.value : event.target.checked;
            if (prop === 'active') {
                newValue = !!newValue ? 1 : 0;
            }
        }
        console.log('handleChange ', prop, ': newValue = ', newValue);
        setValues({ ...values, [prop]: newValue });

        console.log('handleChange values now = ', values);
        setFormValidity(validateValues({ ...values, [prop]: newValue }));
    };

    const errorLocale = {
        ...locale.form.add.addSpotlightError,
        confirmationTitle: `An error occurred: ${spotlightError}`,
    };

    const uploadErrorLocale = () => {
        console.log('uploadErrorLocale: publicFileUploadResult = ', publicFileUploadResult);
        const errorMessage = (!!publicFileUploadResult && publicFileUploadResult[0]) || '';
        return {
            ...locale.form.upload.uploadError,
            // confirmationTitle: 'An error occurred during the upload',
            confirmationTitle: `An error occurred during the upload${!!errorMessage ? ': ' + errorMessage.trim() : ''}`,
        };
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

    if (!!publicFileUploading) {
        return (
            <Grid
                item
                xs={'auto'}
                style={{
                    width: 80,
                    marginRight: 20,
                    marginBottom: 6,
                    opacity: 0.3,
                    height: 200, // default to some space for the blocks
                }}
            >
                <InlineLoader message="Loading" />
            </Grid>
        );
    }

    const handleUploadedFiles = files => {
        console.log('handleUploadedFiles files = ', files);
        const file = !!files && files.length > 0 && files.shift();
        console.log('handleUploadedFiles file = ', file);

        setUploadedFiles(file);

        // const filename = !!file && file.name;
        // console.log('handleUploadedFiles filename = ', filename);
        setValues({ ...values, ['uploadedFile']: file });

        console.log('handleUploadedFiles values now = ', values);
        setFormValidity(validateValues({ ...values, ['uploadedFile']: file }));

        setTimeout(() => {
            console.log('handleUploadedFiles setTimeout: uploadedFiles = ', uploadedFiles);
        }, 1000);
    };

    const clearUploadedFile = () => {
        setFormValidity(validateValues({ ...values, ['uploadedFile']: '' }));
    };

    return (
        <Fragment>
            <form onLoad={runAfterRender()}>
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
                        actionButtonColor="primary"
                        actionButtonVariant="contained"
                        confirmationBoxId="spotlight-edit-save-succeeded"
                        onAction={handleConfirmation}
                        onClose={hideConfirmation}
                        hideCancelButton
                        isOpen={isOpen}
                        locale={locale.form.edit.editSpotlightConfirmation}
                    />
                )}
                {spotlightStatus !== 'error' && !publicFileUploadError && defaults.type === 'add' && (
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
                {!!publicFileUploadError && (
                    <ConfirmationBox
                        actionButtonColor="primary"
                        actionButtonVariant="contained"
                        confirmationBoxId="spotlight-file-upload-failed"
                        onClose={hideConfirmation}
                        onAction={() => hideConfirmation()}
                        isOpen={isOpen}
                        locale={uploadErrorLocale()}
                        hideCancelButton
                    />
                )}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth title={locale.form.tooltips.ariaTitle}>
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
                        <FormControl fullWidth title={locale.form.tooltips.tooltipMouseover}>
                            <InputLabel htmlFor="spotlightTooltip">{locale.form.tooltips.tooltipInField}</InputLabel>
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
                        <FormControl fullWidth title={locale.form.tooltips.link}>
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
                        <KeyboardDateTimePicker
                            id="admin-spotlights-form-start-date"
                            data-testid="admin-spotlights-form-start-date"
                            value={values.start}
                            label="Date published"
                            onChange={handleChange('start')}
                            minDate={defaults.minimumDate}
                            format="DD/MM/YYYY HH:mm a"
                            showTodayButton
                            autoOk
                        />
                    </Grid>
                    <Grid item md={5} xs={12}>
                        <KeyboardDateTimePicker
                            id="admin-spotlights-form-end-date"
                            data-testid="admin-spotlights-form-end-date"
                            label="Date unpublished"
                            onChange={handleChange('end')}
                            value={values.end}
                            minDate={values.start}
                            format="DD/MM/YYYY HH:mm a"
                            autoOk
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} style={{ marginTop: '1rem' }}>
                    <Grid item xs={10} align="left">
                        <SpotlightUploader onAddFile={handleUploadedFiles} onClearFile={clearUploadedFile} />
                    </Grid>
                </Grid>
                <Grid container spacing={2} style={{ marginTop: '1rem' }}>
                    <Grid item xs={3} align="left">
                        <InputLabel
                            style={{ color: 'rgba(0, 0, 0, 0.87)' }}
                            title={locale.form.tooltips.publishcheckbox}
                        >
                            <Checkbox
                                checked={values.active === 1}
                                data-testid="admin-spotlights-form-checkbox-published"
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
    publicFileUploading: PropTypes.any,
    publicFileUploadError: PropTypes.any,
    publicFileUploadResult: PropTypes.any,
    spotlightResponse: PropTypes.any,
    spotlightError: PropTypes.any,
    spotlightsLoading: PropTypes.any,
    spotlightStatus: PropTypes.any,
    defaults: PropTypes.object,
    history: PropTypes.object,
};

SpotlightForm.defaultProps = {
    publicFileUploading: false, // whether a file is currently being uploaded. Only done by Add, other defaults false
    publicFileUploadError: false,
    publicFileUploadResult: false,
};

export default SpotlightForm;
