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
import { SpotlightFileUploadDropzone } from 'modules/Pages/Admin/Spotlights/Form/SpotlightFileUploadDropzone';
import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';
import { formatDate, scrollToTopOfPage } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';

import { useConfirmationState } from 'hooks';
import SpotlightFormReorderableThumbs from './SpotlightFormReorderableThumbs';

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
    spotlightForm: {
        '& label': {
            minHeight: '1.1em',
        },
    },
    errorStyle: {
        color: '#c80000',
        marginTop: 3,
        fontSize: '0.75rem',
    },
    typingArea: {
        '& textarea ': {
            backgroundColor: 'rgb(236, 236, 236, 0.5)',
            borderRadius: 4,
            padding: 10,
        },
        '& label': {
            color: '#000',
            paddingLeft: 10,
            paddingTop: 10,
        },
    },
    charactersRemaining: {
        textAlign: 'right',
        color: '#504e4e',
        fontSize: '0.8em',
    },
}));

export const isValidImageUrl = testurl => {
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
    // while technically an url doesn't need a TLD - in practice it does
    if (!testurl.includes('.')) {
        return false;
    }
    try {
        const url = new URL(testurl);
        if (url.hostname.length < 'x.co'.length) {
            return false;
        }
    } catch (_) {
        /* istanbul ignore next */
        return false;
    }
    return true;
};

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
    spotlights,
    spotlightsLoading,
}) => {
    const classes = useStyles();

    // we cant just use the Current Spotlights api because it doesnt return unpublished records :(
    const currentSpotlights =
        !spotlightsLoading &&
        !!spotlights &&
        spotlights
            .filter(s => moment(s.start).isBefore(moment()) && moment(s.end).isAfter(moment()))
            .sort((a, b) => a.weight - b.weight);

    const [isErrorOpen, showErrorConfirmation, hideErrorConfirmation] = useConfirmationState();
    const [isAddOpen, showAddConfirmation, hideAddConfirmation] = useConfirmationState();
    const [isEditOpen, showEditConfirmation, hideEditConfirmation] = useConfirmationState();
    const [isCloneOpen, showCloneConfirmation, hideCloneConfirmation] = useConfirmationState();
    const [isUploadErrorOpen, showUploadError, hideUploadError] = useConfirmationState();

    const [isFormValid, setFormValidity] = useState(false); // enable-disable the save button

    const [originalValues, setOriginalValues] = useState({});
    useEffect(() => {
        scrollToTopOfPage();

        const newVar = { weight: defaults.type === 'edit' ? defaults.weight : 1000, start: defaults.startDateDefault };
        setOriginalValues(newVar);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaults]);

    const [values, setValues] = useState({
        ...defaults,
        start: defaults.startDateDefault,
        end: defaults.endDateDefault,
        hasImage: defaults.type !== 'add',
    });

    const isValidLinkAria = title => {
        return !!title && title.length > 0;
    };

    const isValidImgAlt = imgAlt => {
        return !!imgAlt && imgAlt.length > 0;
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
        return result;
    }

    function isInvalidStartDate(startDate) {
        return !isValidStartDate(startDate);
    }

    function isInvalidEndDate(endDate, startDate) {
        const startDateReformatted = startDate !== '' && moment(startDate).format('YYYY-MM-DDTHH:mm');
        const endDateReformatted = endDate !== '' && moment(endDate).format('YYYY-MM-DDTHH:mm');
        return (startDate !== '' && endDateReformatted <= startDateReformatted) || !moment(endDate).isValid();
    }

    const validateValues = currentValues => {
        const isValid =
            spotlightStatus !== 'loading' &&
            !isInvalidStartDate(currentValues.start) &&
            !isInvalidEndDate(currentValues.end, currentValues.start) &&
            !!isValidLinkAria(currentValues.title) &&
            !!isValidImgAlt(currentValues.img_alt) &&
            (defaults.type === 'edit' ||
                defaults.type === 'clone' ||
                (!!currentValues.uploadedFile && currentValues.uploadedFile.length > 0)) &&
            !!currentValues.url &&
            currentValues.url.length > 0 &&
            isValidImageUrl(currentValues.url) &&
            !!currentValues.hasImage;

        return isValid;
    };

    useEffect(() => {
        setFormValidity(validateValues(values));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values]);

    useEffect(() => {
        if (!!spotlightResponse && !!spotlightResponse.id && ['saved', 'created'].includes(spotlightStatus)) {
            setValues(defaults); // save success - clear the form!
            /* istanbul ignore next */
            if (!!publicFileUploadError) {
                showUploadError();
            } else if (defaults.type === 'edit') {
                showEditConfirmation();
            } else if (defaults.type === 'add') {
                showAddConfirmation();
            } /* istanbul ignore else */ else if (defaults.type === 'clone') {
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
        /* istanbul ignore next */
        if (!!publicFileUploadError) {
            showUploadError();
        } /* istanbul ignore else */ /* istanbul ignore next */ else if (
            !!spotlightError ||
            spotlightStatus === 'error'
        ) {
            /* istanbul ignore next */
            showErrorConfirmation();
        }
    }, [showErrorConfirmation, spotlightError, spotlightStatus, showUploadError, publicFileUploadError]);

    /* istanbul ignore next */
    function clearUploadError() {
        /* istanbul ignore next */
        actions.clearUpload();
        /* istanbul ignore next */
        return hideUploadError();
    }

    const clearForm = () => {
        setValues(defaults);
    };

    const navigateToListPage = () => {
        clearForm();

        actions.clearSpotlights(); // force the list page to reload after save

        actions.clearASpotlight(); // make the form clear for the next use

        history.push('/admin/spotlights');

        scrollToTopOfPage();
    };

    const reloadClonePage = () => {
        setValues({
            // the data displayed in the form
            ...defaults,
            start: defaults.startDateDefault,
            end: defaults.endDateDefault,
        });

        scrollToTopOfPage();
    };

    const saveSpotlight = () => {
        scrollToTopOfPage();

        const newValues = {
            id: defaults.type === 'edit' ? values.id : null,
            start: formatDate(values.start),
            end: formatDate(values.end),
            title: values.title,
            url: values.url,
            // eslint-disable-next-line camelcase
            img_url: values?.img_url ?? /* istanbul ignore next */ null,
            img_alt: values.img_alt,
            // weight will update after save,
            // but lets just use a number that sits at the end of the current spotlights, as requested
            // weight: defaults.type === 'edit' ? values.weight : 1000, // weight,
            weight: values.weight,
            active: !!values.active ? 1 : 0,
            // eslint-disable-next-line camelcase
            admin_notes: values?.admin_notes ?? /* istanbul ignore next */ null,
        };
        !!values.uploadedFile && (newValues.uploadedFile = values.uploadedFile);

        switch (defaults.type) {
            case 'add':
                actions.createSpotlightWithNewImage(newValues);
                break;
            case 'edit':
                !!values.uploadedFile
                    ? actions.updateSpotlightWithNewImage(newValues)
                    : /* istanbul ignore next */ actions.updateSpotlightWithExistingImage(newValues);
                break;
            case 'clone':
                /* istanbul ignore next */
                !!values.uploadedFile
                    ? actions.createSpotlightWithNewImage(newValues)
                    : actions.createSpotlightWithExistingImage(newValues);
                break;
            /* istanbul ignore next */
            default:
                // never happens
                return;
        }

        // force to the top of the page, because otherwise it looks a bit weird
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    };

    /* istanbul ignore next */
    const updateWeightInValues = newWeight => {
        setValues(prevState => {
            return { ...prevState, weight: newWeight };
        });
    };

    const handleChange = prop => event => {
        let propValue;
        if (['start', 'end'].includes(prop)) {
            propValue = event.format('YYYY/MM/DD hh:mm a');
        } else {
            propValue = !!event.target.value ? event.target.value : event.target.checked;
            // fake switch because istanbul doesnt block on an else if in this version :(
            switch (true) {
                case ['active', 'weight'].includes(prop):
                    propValue = !!propValue ? 1 : /* istanbul ignore next */ 0;
                    break;
                /* istanbul ignore next */
                case propValue === false:
                    // it returns false when we clear a text field
                    propValue = '';
                    break;
                /* istanbul ignore next */
                default:
            }
        }
        setValues({
            ...values,
            start: values.start || /* istanbul ignore next */ defaults.startDateDefault,
            end: values.end || /* istanbul ignore next */ defaults.endDateDefault,
            [prop]: propValue,
        });
    };

    const errorLocale = {
        ...locale.form.add.addSpotlightError,
        confirmationTitle: !!spotlightError
            ? /* istanbul ignore next */ `An error occurred: ${JSON.stringify(spotlightError)}`
            : 'An unknown error occurred',
    };

    /* istanbul ignore next */
    const uploadErrorLocale = () => {
        const errorMessage = (!!publicFileUploadError && !!publicFileUploadResult && publicFileUploadResult[0]) || '';
        return {
            ...locale.form.upload.uploadError,
            confirmationTitle: `${locale.form.upload.uploadError.confirmationTitle}${
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
        setValues({ ...values, ['uploadedFile']: files, hasImage: true });
    };

    const clearSuppliedFile = () => {
        setValues(prevState => {
            return { ...prevState, ['uploadedFile']: [], hasImage: false };
        });
    };

    const ImageAltMaxLength = 255;
    const titleMaxLength = 100;
    const urlMaxLength = 250;

    // display a count of the remaining characters for the field
    const characterCount = (numCharsCurrent, numCharsMax) => (
        <div className={classes.charactersRemaining}>
            {numCharsCurrent > 0 && `${numCharsMax - numCharsCurrent} characters left`}
        </div>
    );
    return (
        <Fragment>
            <form className={classes.spotlightForm}>
                <ConfirmationBox
                    actionButtonColor="primary"
                    actionButtonVariant="contained"
                    confirmationBoxId="spotlight-error"
                    onAction={
                        /* istanbul ignore next */ () =>
                            /* istanbul ignore next */
                            spotlightError === 'The requested page could not be found.' && navigateToListPage()
                    }
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
                    onCancelAction={/* istanbul ignore next */ () => /* istanbul ignore next */ navigateToListPage()}
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
                    onClose={clearUploadError}
                    onAction={/* istanbul ignore next */ () => /* istanbul ignore next */ clearUploadError()}
                    isOpen={isUploadErrorOpen}
                    locale={uploadErrorLocale()}
                    hideCancelButton
                />
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl
                            className={classes.typingArea}
                            fullWidth
                            title={locale.form.tooltips.adminNotesField}
                        >
                            <InputLabel htmlFor="spotlightAdminNote">{locale.form.labels.adminNotesField}</InputLabel>
                            <Input
                                id="spotlightAdminNote"
                                data-testid="admin-spotlights-form-admin-note"
                                multiline
                                onChange={handleChange('admin_notes')}
                                rows={2}
                                value={values.admin_notes}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl
                            className={classes.typingArea}
                            fullWidth
                            title={locale.form.tooltips.linkDescAriaField}
                        >
                            <InputLabel htmlFor="spotlightTitle">{locale.form.labels.linkDescAriaField}</InputLabel>
                            <Input
                                id="spotlightTitle"
                                data-testid="admin-spotlights-form-title"
                                error={!isValidLinkAria(values.title)}
                                inputProps={{ maxLength: titleMaxLength }}
                                multiline
                                onChange={handleChange('title')}
                                required
                                rows={2}
                                value={values.title}
                            />
                            {!!values.title && characterCount(values.title.length, titleMaxLength)}
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl className={classes.typingArea} fullWidth title={locale.form.tooltips.imgAltField}>
                            <InputLabel htmlFor="spotlightTooltip">{locale.form.labels.imgAltField}</InputLabel>
                            <Input
                                id="spotlightTooltip"
                                data-testid="admin-spotlights-form-tooltip"
                                error={!isValidImgAlt(values.img_alt)}
                                inputProps={{ maxLength: ImageAltMaxLength }}
                                multiline
                                onChange={handleChange('img_alt')}
                                rows={2}
                                value={values.img_alt}
                            />
                            {!!values.img_alt && characterCount(values.img_alt.length, ImageAltMaxLength)}
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth title={locale.form.tooltips.linkField} className={classes.typingArea}>
                            <InputLabel htmlFor="linkUrl">{locale.form.labels.linkField}</InputLabel>
                            <Input
                                type="url"
                                id="linkUrl"
                                data-testid="admin-spotlights-form-link-url"
                                error={!isValidImageUrl(values.url)}
                                inputProps={{ maxLength: urlMaxLength }}
                                multiline
                                onChange={handleChange('url')}
                                value={values.url}
                            />
                            {!!values.url && characterCount(values.url.length, urlMaxLength)}
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
                        {moment(values.start).isBefore(moment().subtract(1, 'minutes')) && (
                            <div className={classes.errorStyle}>This date is in the past.</div>
                        )}
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
                            minDateMessage="Should not be before Date published"
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
                    <Grid item xs={10} align="left">
                        <SpotlightFormReorderableThumbs
                            currentSpotlights={currentSpotlights}
                            currentSpotlightsLoading={spotlightsLoading}
                            defaultWeight={
                                defaults.type === 'edit' && originalValues.start === values.start ? values.weight : 1000
                            }
                            currentValues={values}
                            updateWeightInValues={updateWeightInValues}
                            tableType={defaults.type}
                            originalValues={originalValues}
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
    spotlights: PropTypes.any,
    spotlightsLoading: PropTypes.any,
};

SpotlightForm.defaultProps = {
    publicFileUploading: false, // whether a file is currently being uploaded. Only done by Add, other defaults false
    publicFileUploadError: false,
    publicFileUploadResult: false,
};

export default SpotlightForm;
