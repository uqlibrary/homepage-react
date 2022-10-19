/* eslint-disable no-unused-vars */
import React, { String, Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/styles';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import Typography from '@material-ui/core/Typography';

import PromoPanelPreview from './PromoPanelPreview';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
// import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
// import { SpotlightFileUploadDropzone } from 'modules/Pages/Admin/Spotlights/Form/SpotlightFileUploadDropzone';
import { default as locale } from 'modules/Pages/Admin/PromoPanel/promoPanelAdmin.locale';
import { formatDate } from '../Spotlights/spotlighthelpers';
// import { formatDate, scrollToTopOfPage } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';

// import { useConfirmationState } from 'hooks';
// import SpotlightFormReorderableThumbs from './SpotlightFormReorderableThumbs';

const moment = require('moment');

const useStyles = makeStyles(() => ({
    contentRequired: {
        color: '#990000',
        paddingTop: 10,
        display: 'block',
        fontSize: 14,
    },
    saveButton: {
        '&:disabled': {
            color: 'rgba(0, 0, 0, 0.26)',
            boxShadow: 'none',
            backgroundColor: 'rgba(0, 0, 0, 0.12)',
        },
    },
    previewButton: {
        marginRight: 10,
    },
    checkbox: {
        paddingLeft: 0,
        '&.Mui-checked': {
            color: 'black',
        },
    },
    checkboxCell: {
        '& input[type="checkbox"]:checked + svg': {
            fill: '#595959',
        },
        padding: 0,
        color: 'rgba(0, 0, 0, 0.87)',
    },
    promoPanelForm: {
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

const availableGroups = [
    'Public',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
];

export const PromoPanelForm = ({
    actions,
    // spotlightResponse,
    // spotlightStatus,
    defaults,
    // spotlightError,
    // publicFileUploading,
    // publicFileUploadError,
    // publicFileUploadResult,
    // history,
    // spotlights,
    // spotlightsLoading,
}) => {
    const classes = useStyles();

    const [values, setValues] = useState({
        ...defaults,
        start: defaults.startDateDefault,
        end: defaults.endDateDefault,
    });

    console.log('Values Group', values.group);

    const [groupName, setGroupName] = React.useState([values.group]);

    // const isValidLinkAria = title => {
    //     return !!title && title.length > 0;
    // };

    const previewPromoPanel = () => {
        setValues({
            ...values,
            isPreviewOpen: true,
        });
    };

    const savePromoPanel = () => {
        //     scrollToTopOfPage();
        console.log('The values at time of save', values);
        const newValues = {
            id: defaults.type === 'edit' ? values.id : null,
            panel_name: values.name,
            panel_title: values.title,
            panel_content: values.content,

            panel_start: formatDate(values.start),
            panel_end: formatDate(values.end),
        };
        actions.createPromoPanel(newValues);
    };
    const handleContentChange = data => {
        console.log('The recieved Data', data);
        setValues({
            ...values,
            content: data,
        });
        console.log('Values are:', values);
    };

    const handlePreviewClose = () => {
        console.log('is it?');
        setValues({
            ...values,
            isPreviewOpen: false,
        });
    };

    const handleGroupChange = event => {
        const {
            target: { value },
        } = event;
        setGroupName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        setValues({
            ...values,
            group: groupName,
        });
    };

    const handleChange = prop => event => {
        console.log('field context', event);
        let propValue;
        if (['scheduled'].includes(prop)) {
            propValue = event.target.checked ? 1 : 0;
        } else if (['start', 'end'].includes(prop)) {
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

    // const errorLocale = {
    //     ...locale.form.add.addSpotlightError,
    //     confirmationTitle: !!spotlightError
    //         ? /* istanbul ignore next */ `An error occurred: ${JSON.stringify(spotlightError)}`
    //         : 'An unknown error occurred',
    // };

    // /* istanbul ignore next */
    // const uploadErrorLocale = () => {
    //     const errorMessage = (!!publicFileUploadError && !!publicFileUploadResult
    // && publicFileUploadResult[0]) || '';
    //     return {
    //         ...locale.form.upload.uploadError,
    //         confirmationTitle: `${locale.form.upload.uploadError.confirmationTitle}${
    //             !!errorMessage && typeof errorMessage === 'string' ? ': ' + errorMessage.trim() : ''
    //         }`,
    //     };
    // };

    // if (!!publicFileUploading) {
    //     return (
    //         <Grid
    //             item
    //             xs={'auto'}
    //             style={{
    //                 width: 80,
    //                 margin: '0 auto',
    //                 height: 200, // default to some space for the blocks
    //             }}
    //         >
    //             <InlineLoader message="Uploading" />
    //         </Grid>
    //     );
    // }

    // const handleSuppliedFiles = files => {
    //     setValues({ ...values, ['uploadedFile']: files, hasImage: true });
    // };

    // const clearSuppliedFile = () => {
    //     setValues(prevState => {
    //         return { ...prevState, ['uploadedFile']: [], hasImage: false };
    //     });
    // };

    // const ImageAltMaxLength = 255;
    // const titleMaxLength = 100;
    // const urlMaxLength = 250;

    // display a count of the remaining characters for the field
    // const characterCount = (numCharsCurrent, numCharsMax) => (
    //     <div className={classes.charactersRemaining}>
    //         {numCharsCurrent > 0 && `${numCharsMax - numCharsCurrent} characters left`}
    //     </div>
    // );
    console.log('GROUP NAME', groupName);
    return (
        <Fragment>
            <form className={classes.spotlightForm}>
                {/* Confirmation Boxes here */}
                <Typography style={{ fontWeight: 'bold' }}>Panel Details</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl
                            className={classes.typingArea}
                            fullWidth
                            title={locale.form.tooltips.adminNotesField}
                        >
                            <InputLabel htmlFor="promoPanelAdminNote">{locale.form.labels.adminNotesField}</InputLabel>
                            <Input
                                id="promoPanelAdminNote"
                                data-testid="admin-promopanel-form-admin-note"
                                multiline
                                onChange={handleChange('admin_notes')}
                                rows={2}
                                value={values.admin_notes}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl className={classes.typingArea} fullWidth title={locale.form.tooltips.nameField}>
                            <InputLabel htmlFor="promoPanelTitle">{locale.form.labels.nameField}</InputLabel>
                            <Input
                                id="promoPanelName"
                                data-testid="admin-promopanel-form-name"
                                multiline
                                error={!values.name}
                                onChange={handleChange('name')}
                                rows={1}
                                value={values.name}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl className={classes.typingArea} fullWidth title={locale.form.tooltips.titleField}>
                            <InputLabel htmlFor="promoPanelTitle">{locale.form.labels.titleField}</InputLabel>
                            <Input
                                id="promoPanelTitle"
                                data-testid="admin-promopanel-form-title"
                                multiline
                                error={!values.title}
                                onChange={handleChange('title')}
                                rows={1}
                                value={values.title}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography style={{ fontWeight: 'bold' }}>Panel content</Typography>
                        <CKEditor
                            id="promoPanelContent"
                            style={{ width: '100%' }}
                            editor={ClassicEditor}
                            config={{
                                removePlugins: [
                                    'Image',
                                    'ImageCaption',
                                    'ImageStyle',
                                    'ImageToolbar',
                                    'ImageUpload',
                                    'EasyImage',
                                    'CKFinder',
                                    'BlockQuote',
                                    'Table',
                                    'MediaEmbed',
                                    'Heading',
                                ],
                            }}
                            data={values.content}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                handleContentChange(data);
                            }}
                            onBlur={(event, editor) => {
                                const data = editor.getData();
                                handleContentChange(data);
                            }}
                        />
                        {!!!values.content && (
                            <span className={classes.contentRequired}>* This content is required</span>
                        )}
                    </Grid>

                    <Grid item md={5} xs={12}>
                        <Typography style={{ fontWeight: 'bold' }}>Group Assignment</Typography>
                        {/* <FormControl className={classes.dropdown} fullWidth title={locale.form.tooltips.groupField}>
                            <InputLabel id="demo-simple-select-helper-label">Group</InputLabel>
                            <Select
                                labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper"
                                value={groupName}
                                label="Age"
                                onChange={handleGroupChange}
                                multiple
                            >
                                <MenuItem key="Public" value="Public">
                                    <em>Public</em>
                                </MenuItem>
                                <MenuItem key="Authenticated" value="Authenticated">
                                    <em>Authenticated</em>
                                </MenuItem>
                                <MenuItem key="Students" value="Students">
                                    Students
                                </MenuItem>
                                <MenuItem key="Staff" value="Staff">
                                    Staff
                                </MenuItem>
                            </Select>
                        </FormControl> */}

                        <FormControl className={classes.dropdown} fullWidth title={locale.form.tooltips.groupField}>
                            <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={groupName}
                                onChange={handleGroupChange}
                                // input={<OutlinedInput label="Tag" />}
                                renderValue={selected => selected.join(', ')}
                            >
                                {availableGroups.map(name => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={groupName.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid container style={{ margin: '0 10px 0' }}>
                        <Typography style={{ fontWeight: 'bold' }}>Panel Scheduling</Typography>
                        <Grid container>
                            <Typography style={{ fontSize: 12 }}>
                                If no schedule is defined, this will be considered to be the default for the selected
                                group
                            </Typography>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <InputLabel
                                    title={locale.form.tooltips.scheduleCheckbox}
                                    className={`${classes.scheduleCell}`}
                                >
                                    <Checkbox
                                        checked={values.scheduled === 1}
                                        data-testid="admin-spotlights-form-checkbox-published"
                                        onChange={handleChange('scheduled')}
                                        className={classes.checkbox}
                                    />
                                    {locale.form.labels.scheduleCheckbox}
                                </InputLabel>
                            </Grid>
                            {values.scheduled === 1 && (
                                <>
                                    <Grid item md={5} xs={6}>
                                        <KeyboardDateTimePicker
                                            id="admin-promopanel-form-start-date"
                                            data-testid="admin-promopanel-form-start-date"
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
                                    <Grid item md={5} xs={6}>
                                        <KeyboardDateTimePicker
                                            id="admin-promopanel-form-end-date"
                                            data-testid="admin-promopanel-form-end-date"
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
                                </>
                            )}
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} style={{ marginTop: '1rem' }}>
                        <Grid item xs={3} align="left">
                            <Button
                                color="secondary"
                                children="Cancel"
                                data-testid="admin-promopanel-form-button-cancel"
                                // onClick={() => navigateToListPage()}
                                variant="contained"
                            />
                        </Grid>

                        <Grid item xs={9} align="right">
                            {console.log('Values', values)}
                            <Button
                                color="primary"
                                data-testid="admin-promopanel-form-button-preview"
                                variant="contained"
                                children={'Preview'}
                                disabled={
                                    !!!values.name ||
                                    values.name.length < 1 ||
                                    !!!values.title ||
                                    values.title.length < 1 ||
                                    !!!values.content ||
                                    values.content.length < 1
                                }
                                onClick={previewPromoPanel}
                                className={classes.previewButton}
                            />
                            <Button
                                color="primary"
                                data-testid="admin-promopanel-form-button-save"
                                variant="contained"
                                children={defaults.type === 'edit' ? 'Save' : 'Create'}
                                // disabled={!isFormValid}
                                onClick={savePromoPanel}
                                className={classes.saveButton}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </form>
            {console.log('open', values.isPreviewOpen)}
            <PromoPanelPreview
                isPreviewOpen={values.isPreviewOpen}
                previewName={values.name}
                handlePreviewClose={handlePreviewClose}
                previewTitle={values.title}
                previewContent={values.content}
                previewGroup={groupName}
                previewScheduled={values.scheduled === 1 ? true : false}
                previewStart={values.start}
                previewEnd={values.end}
            />
        </Fragment>
    );
};

PromoPanelForm.propTypes = {
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

PromoPanelForm.defaultProps = {
    publicFileUploading: false, // whether a file is currently being uploaded. Only done by Add, other defaults false
    publicFileUploadError: false,
    publicFileUploadResult: false,
};

export default PromoPanelForm;
