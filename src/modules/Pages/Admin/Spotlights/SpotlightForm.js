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
import { SpotlightFileUploadDropzone } from 'modules/Pages/Admin/Spotlights/SpotlightFileUploadDropzone';
import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';
import { formatDate } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';

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
    checkboxCell: {
        '& input[type="checkbox"]:checked + svg': {
            fill: '#595959',
        },
        padding: 0,
        color: 'rgba(0, 0, 0, 0.87)',
    },
}));

export const SpotlightForm = ({
    actions,
    spotlightResponse,
    spotlightStatus,
    defaults,
    spotlightError,
    publicFileUploading,
    publicFileUploadError,
    publicFileUploadResult,
    history,
}) => {
    console.log('form: spotlightError = ', spotlightError);
    console.log('form: spotlightResponse = ', spotlightResponse);
    console.log('form: spotlightStatus = ', spotlightStatus);
    const classes = useStyles();

    // const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();
    const [isErrorOpen, showErrorConfirmation, hideErrorConfirmation] = useConfirmationState();
    const [isAddOpen, showAddConfirmation, hideAddConfirmation] = useConfirmationState();
    const [isEditOpen, showEditConfirmation, hideEditConfirmation] = useConfirmationState();
    const [isCloneOpen, showCloneConfirmation, hideCloneConfirmation] = useConfirmationState();
    const [isUploadErrorOpen, showUploadError, hideUploadError] = useConfirmationState();

    const [isFormValid, setFormValidity] = useState(false); // enable-disable the save button
    const [uploadedFiles, setUploadedFiles] = useState(null);

    console.log('defaults = ', defaults);
    const [values, setValues] = useState({
        // the data displayed in the form
        ...defaults,
        start: defaults.startDateDefault,
        end: defaults.endDateDefault,
    });

    const isValidLinkAria = title => {
        return !!title && title.length > 0;
    };

    const isValidImgAlt = imgAlt => {
        return !!imgAlt && imgAlt.length > 0;
    };

    const isValidImageUrl = testurl => {
        if (!testurl) {
            return false;
        }
        if (!testurl.startsWith('http://') && !testurl.startsWith('https://')) {
            return false;
        }
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

    function isValidStartDate(startDate) {
        const momentToday = new moment();
        const formattedToday = momentToday.startOf('day').format('YYYYMMDDHHmmss');

        const formattedstartdate = formatDate(startDate, 'YYYYMMDDHHmmss');
        const formatteddefaultstartdate = formatDate(defaults.startDateDefault, 'YYYYMMDDHHmmss');
        const result =
            startDate !== '' &&
            !!moment(startDate).isValid() &&
            (formattedstartdate >= formattedToday || formattedstartdate >= formatteddefaultstartdate);
        // console.log('isValidStartDate: startDate = ', startDate);
        // console.log('isValidStartDate: defaults.startDateDefault = ', defaults.startDateDefault);
        // console.log('isValidStartDate: !!moment(startDate).isValid() = ', !!moment(startDate).isValid());
        // console.log("isValidStartDate: startDate !== '' = ", startDate !== '');
        // // console.log('isValidStartDate: moment(startDate) >= moment() ', moment(startDate) >= moment());
        // console.log(
        //     'isValidStartDate: formattedstartdate >= formattedToday = ', formattedstartdate >= formattedToday
        // );
        // console.log(
        //     'isValidStartDate: formattedstartdate >= formatteddefaultstartdate = ',
        //     formattedstartdate >= formatteddefaultstartdate,
        // );
        // console.log('isValidStartDate: formattedstartdate = ', formattedstartdate);
        // console.log('isValidStartDate: formattedToday = ', formattedToday);
        // console.log('isValidStartDate: formatteddefaultstartdate = ', formatteddefaultstartdate);
        // console.log('isValidStartDate: is valid', result);
        return result;
    }

    function isInvalidStartDate(startDate) {
        return !isValidStartDate(startDate);
    }

    function isInvalidEndDate(endDate, startDate) {
        const startDateReformatted = startDate !== '' && moment(startDate).format('YYYY-MM-DDTHH:mm');
        // console.log('isInvalidEndDate endDate < startDateReformatted: ', endDate, ' < ', startDateReformatted);
        // console.log("isInvalidEndDate startDate !== '': ", startDate !== '');
        // console.log('isInvalidEndDate together: ', endDate < startDateReformatted && startDate !== '');
        // console.log('isInvalidEndDate !moment(endDate).isValid() = ', !moment(endDate).isValid());
        return (startDate !== '' && endDate < startDateReformatted) || !moment(endDate).isValid();
    }

    const validateValues = currentValues => {
        console.log('validateValues: currentValues = ', currentValues);
        const isValid =
            spotlightStatus !== 'loading' &&
            !isInvalidStartDate(currentValues.start) &&
            !isInvalidEndDate(currentValues.end, currentValues.start) &&
            !!isValidLinkAria(currentValues.title) &&
            !!isValidImgAlt(currentValues.img_alt) &&
            // currentValues.img_alt.length > 0 && // set to title during save if blank
            // !!currentValues.localfilename &&
            // currentValues.localfilename.length > 0 &&
            (defaults.type === 'edit' ||
                defaults.type === 'clone' ||
                (!!currentValues.uploadedFile && currentValues.uploadedFile.length > 0)) &&
            // currentValues.fileDetails.length > 0 &&
            !!currentValues.url &&
            currentValues.url.length > 0 &&
            isValidImageUrl(currentValues.url);

        // console.log('validateValues: isValid = ', isValid, currentValues);
        // console.log('validateValues: isValidStartDate = ', !isInvalidStartDate(null, currentValues.start));
        // console.log('validateValues: isValidEndDate = ', !isInvalidEndDate(currentValues.end, currentValues.start));
        // console.log('validateValues: isValidLinkAria = ', !!isValidLinkAria(currentValues.title));
        // console.log('validateValues: isValidImgAlt = ', !!isValidImgAlt(currentValues.img_alt));
        // console.log(
        //     'validateValues: uploadedFile = ',
        //     defaults.type === 'edit' || (!!currentValues.uploadedFile && currentValues.uploadedFile.length > 0),
        // );
        // console.log(
        //     'validateValues: isValidImageUrl(', currentValues.url, ') = ', isValidImageUrl(currentValues.url)
        // );
        // console.log('validateValues: currentValues.img_alt = ', currentValues.img_alt);
        // console.log('validateValues: currentValues = ', currentValues);

        return isValid;
    };

    // useEffect(() => {
    //     if (!!defaults && defaults.type === 'clone') {
    //         setFormValidity(validateValues(defaults));
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    useEffect(() => {
        // console.log('uploadedFiles set to ', uploadedFiles);
        console.log('values have been changed to: ', values);
        setFormValidity(validateValues(values));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values]);

    useEffect(() => {
        if (!!spotlightResponse && !!spotlightResponse.id && ['saved', 'created'].includes(spotlightStatus)) {
            setValues(defaults); // save success - clear the form!
            if (!!publicFileUploadError) {
                showUploadError();
            } else if (defaults.type === 'edit') {
                showEditConfirmation();
            } else if (defaults.type === 'add') {
                showAddConfirmation();
            } else if (defaults.type === 'clone') {
                showCloneConfirmation();
            }
        }
    }, [
        spotlightResponse,
        spotlightStatus,
        defaults,
        publicFileUploadError,
        showEditConfirmation,
        showAddConfirmation,
        showCloneConfirmation,
        showUploadError,
    ]);

    useEffect(() => {
        if (!!spotlightError || spotlightStatus === 'error') {
            showErrorConfirmation();
        }
    }, [showErrorConfirmation, spotlightError, spotlightStatus]);

    useEffect(() => {
        if (!!publicFileUploadError) {
            showUploadError();
        }
    }, [showUploadError, publicFileUploadError]);

    const clearForm = () => {
        setValues(defaults);
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
        console.log('reloadClonePage defaults = ', {
            // the data displayed in the form
            ...defaults,
            start: defaults.startDateDefault,
            end: defaults.endDateDefault,
        });
        setValues({
            // the data displayed in the form
            ...defaults,
            start: defaults.startDateDefault,
            end: defaults.endDateDefault,
        });

        const topOfPage = document.getElementById('StandardPage');
        !!topOfPage && topOfPage.scrollIntoView();
    };

    const saveSpotlight = () => {
        const topOfPage = document.getElementById('StandardPage');
        !!topOfPage && topOfPage.scrollIntoView();

        console.log('saveSpotlight: currentValues = ', values);
        const newValues = {
            id: defaults.type === 'edit' ? values.id : null,
            start: formatDate(values.start),
            end: formatDate(values.end),
            title: values.title,
            url: values.url,
            // eslint-disable-next-line camelcase
            img_url: values?.img_url ?? null,
            img_alt: values.img_alt,
            // weight will update after save,
            // but lets just use a number that sits at the end of the current spotlights, as requested
            weight: defaults.type === 'edit' ? values.weight : 1000,
            active: !!values.active ? 1 : 0,
        };
        !!values.uploadedFile && (newValues.uploadedFile = values.uploadedFile);

        console.log('saveSpotlight editType = ', defaults.type);
        console.log('saveSpotlight: newValues = ', newValues);
        // const saveSpotlightChange = s => {
        //     return actions.saveSpotlightChangeWithExistingImage(s);
        // };
        switch (defaults.type) {
            case 'add':
                // console.log('handleSpotlightCreation: uploadedFiles = ', uploadedFiles);
                console.log('handleSpotlightCreation 2: newValues = ', newValues);
                actions.createSpotlightWithNewImage(newValues);
                // .then(() => actions.reweightSpotlights(saveSpotlightChange));
                break;
            case 'edit':
                if (!!values.uploadedFile) {
                    actions.saveSpotlightWithNewImage(newValues);
                    // .then(() => actions.reweightSpotlights(saveSpotlightChange));
                } else {
                    actions.saveSpotlightChangeWithExistingImage(newValues);
                    // .then(() => actions.reweightSpotlights(saveSpotlightChange));
                }
                break;
            case 'clone':
                if (!!values.uploadedFile) {
                    actions.createSpotlightWithNewImage(newValues);
                    // .then(() => actions.reweightSpotlights(saveSpotlightChange));
                } else {
                    actions.createSpotlightWithExistingImage(newValues);
                    // .then(() => actions.reweightSpotlights(saveSpotlightChange));
                }
                break;
            default:
                console.log('an unhandled type of ', defaults.type, ' was provided at SpotlightForm.saveSpotlight');
                return;
        }

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
            if (['active', 'weight'].includes(prop)) {
                newValue = !!newValue ? 1 : 0;
            } else if (newValue === false) {
                // it returns false when we clear a text field
                newValue = '';
            }
        }
        console.log('handleChange prop = ', prop, ': newValue = ', newValue);
        // we need the explicit setting of '' otherwise we get a 'false' in the field
        setValues({
            ...values,
            start: values.start || defaults.startDateDefault,
            end: values.end || defaults.endDateDefault,
            [prop]: newValue,
        });

        console.log('handleChange values now = ', values);
        setFormValidity(validateValues({ ...values, [prop]: newValue }));
    };

    const errorLocale = {
        ...locale.form.add.addSpotlightError,
        confirmationTitle: !!spotlightError ? `An error occurred: ${spotlightError}` : 'An unknown error occurred',
    };

    const uploadErrorLocale = () => {
        const errorMessage = (!!publicFileUploadError && !!publicFileUploadResult && publicFileUploadResult[0]) || '';
        return {
            ...locale.form.upload.uploadError,
            confirmationTitle: `An error occurred during the upload${
                !!errorMessage && typeof errorMessage === 'string' ? ': ' + errorMessage.trim() : ''
            }`,
        };
    };

    if (!!publicFileUploading) {
        return (
            <Grid
                item
                xs={'auto'}
                style={{
                    width: 80,
                    margin: '0 auto',
                    height: 200, // default to some space for the blocks
                }}
            >
                <InlineLoader message="Uploading" />
            </Grid>
        );
    }

    const handleSuppliedFiles = files => {
        console.log('handleSuppliedFiles files = ', files);
        setUploadedFiles(files);

        console.log('check: ', { ...values, ['uploadedFile']: files });
        setValues({ ...values, ['uploadedFile']: files });
        console.log('handleSuppliedFiles values now = ', values);

        setFormValidity(validateValues({ ...values, ['uploadedFile']: files }));

        setTimeout(() => {
            console.log('handleSuppliedFiles setTimeout: values = ', values);
            console.log('handleSuppliedFiles setTimeout: uploadedFiles = ', uploadedFiles);
        }, 1000);
    };

    const clearSuppliedFile = () => {
        setValues(prevState => {
            return { ...prevState, ['uploadedFile']: [] };
        });
        setFormValidity(validateValues({ ...values, ['uploadedFile']: [] }));
    };

    return (
        <Fragment>
            <form>
                <ConfirmationBox
                    actionButtonColor="primary"
                    actionButtonVariant="contained"
                    confirmationBoxId="spotlight-error"
                    onAction={() => spotlightError === 'The requested page could not be found.' && navigateToListPage()}
                    onClose={hideErrorConfirmation}
                    hideCancelButton
                    isOpen={isErrorOpen}
                    locale={errorLocale}
                />
                <ConfirmationBox
                    actionButtonColor="primary"
                    actionButtonVariant="contained"
                    confirmationBoxId="spotlight-edit-save-succeeded"
                    onAction={navigateToListPage}
                    onClose={hideEditConfirmation}
                    hideCancelButton
                    isOpen={isEditOpen}
                    locale={locale.form.edit.editSpotlightConfirmation}
                />
                <ConfirmationBox
                    actionButtonColor="secondary"
                    actionButtonVariant="contained"
                    confirmationBoxId="spotlight-add-save-succeeded"
                    onAction={hideAddConfirmation}
                    onClose={hideAddConfirmation}
                    onCancelAction={() => navigateToListPage()}
                    isOpen={isAddOpen}
                    locale={locale.form.add.addSpotlightConfirmation}
                />
                <ConfirmationBox
                    actionButtonColor="secondary"
                    actionButtonVariant="contained"
                    confirmationBoxId="spotlight-clone-save-succeeded"
                    onClose={hideCloneConfirmation}
                    onAction={() => reloadClonePage()}
                    isOpen={isCloneOpen}
                    locale={locale.form.clone.cloneSpotlightConfirmation}
                    onCancelAction={() => navigateToListPage()}
                />
                <ConfirmationBox
                    actionButtonColor="primary"
                    actionButtonVariant="contained"
                    confirmationBoxId="spotlight-file-upload-failed"
                    onClose={hideUploadError}
                    onAction={() => hideUploadError()}
                    isOpen={isUploadErrorOpen}
                    locale={uploadErrorLocale()}
                    hideCancelButton
                />
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth title={locale.form.tooltips.linkDescAriaField}>
                            <InputLabel htmlFor="spotlightTitle">{locale.form.labels.linkDescAriaField}</InputLabel>
                            <Input
                                id="spotlightTitle"
                                data-testid="admin-spotlights-form-title"
                                error={!isValidLinkAria(values.title)}
                                inputProps={{ maxLength: 100 }}
                                multiline
                                onChange={handleChange('title')}
                                required
                                rows={2}
                                value={values.title}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth title={locale.form.tooltips.imgAltField}>
                            <InputLabel htmlFor="spotlightTooltip">{locale.form.labels.imgAltField}</InputLabel>
                            <Input
                                id="spotlightTooltip"
                                data-testid="admin-spotlights-form-tooltip"
                                error={!isValidImgAlt(values.img_alt)}
                                value={values.img_alt}
                                onChange={handleChange('img_alt')}
                                inputProps={{ maxLength: 255 }}
                                multiline
                                rows={2}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth title={locale.form.tooltips.linkField}>
                            <InputLabel htmlFor="linkUrl">{locale.form.labels.linkField}</InputLabel>
                            <Input
                                type="url"
                                id="linkUrl"
                                data-testid="admin-spotlights-form-link-url"
                                value={values.url}
                                onChange={handleChange('url')}
                                error={!isValidImageUrl(values.url)}
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
                            label={locale.form.labels.publishDate}
                            onChange={handleChange('start')}
                            minDate={defaults.minimumDate}
                            format="DD/MM/YYYY HH:mm a"
                            showTodayButton
                            todayLabel={locale.form.labels.datePopupNowButton}
                            autoOk
                            KeyboardButtonProps={{
                                'aria-label': locale.form.tooltips.publishDate,
                            }}
                        />
                    </Grid>
                    <Grid item md={5} xs={12}>
                        <KeyboardDateTimePicker
                            id="admin-spotlights-form-end-date"
                            data-testid="admin-spotlights-form-end-date"
                            label={locale.form.labels.unpublishDate}
                            onChange={handleChange('end')}
                            value={values.end}
                            minDate={values.start}
                            format="DD/MM/YYYY HH:mm a"
                            autoOk
                            KeyboardButtonProps={{
                                'aria-label': locale.form.tooltips.unpublishDate,
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} style={{ marginTop: '1rem' }}>
                    <Grid item xs={10} align="left">
                        <SpotlightFileUploadDropzone
                            onAddFile={handleSuppliedFiles}
                            onClearFile={clearSuppliedFile}
                            currentImage={values.img_url}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} style={{ marginTop: '1rem' }}>
                    <Grid item xs={7} md={10} />
                    <Grid item xs={5} md={2} align="right">
                        <InputLabel
                            title={locale.form.tooltips.publishedCheckbox}
                            className={`${classes.checkboxCell}`}
                        >
                            <Checkbox
                                checked={values.active === 1}
                                data-testid="admin-spotlights-form-checkbox-published"
                                onChange={handleChange('active')}
                                className={classes.checkbox}
                            />
                            {locale.form.labels.publishedCheckbox}
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
