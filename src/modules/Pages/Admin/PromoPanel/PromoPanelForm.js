/* eslint-disable no-unused-vars */
import React, { String, Fragment, useEffect, useState } from 'react';
import PropTypes, { array } from 'prop-types';

import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/styles';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import Typography from '@material-ui/core/Typography';
import { scrollToTopOfPage } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';

import PromoPanelPreview from './PromoPanelPreview';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { default as locale } from 'modules/Pages/Admin/PromoPanel/promoPanelAdmin.locale';
import { formatDate } from '../Spotlights/spotlighthelpers';

const moment = require('moment');

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 6 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

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

const knownGroups = ['Public', 'UnderGrad', 'International', 'Staff'];

export const PromoPanelForm = ({
    actions,
    // spotlightResponse,
    // spotlightStatus,
    defaults,
    // spotlightError,
    // publicFileUploading,
    // publicFileUploadError,
    // publicFileUploadResult,
    history,
    // spotlights,
    // spotlightsLoading,
}) => {
    // const scheduledGroups = [];
    // console.log('The Parsed Defaults', defaults);
    const classes = useStyles();
    const [values, setValues] = useState({
        ...defaults,
        start: defaults.startDateDefault,
        end: defaults.endDateDefault,
        test: 'test',
    });

    const [unscheduledGroups, setUnscheduledGroups] = useState(knownGroups);
    const [scheduledGroups, setScheduledGroups] = useState(values.scheduledGroups);
    const [groupNames, setGroupNames] = React.useState(values.scheduledGroups);

    // const [allocatedGroups, setAllocatedGroups] = useState(values.allocatedGroups);
    const clearForm = () => {
        setValues(defaults);
    };

    const navigateToListPage = () => {
        clearForm();

        actions.clearCurrentPanel(); // force the list page to reload after save

        history.push('/admin/promopanel');
        scrollToTopOfPage();
    };

    const previewPromoPanel = () => {
        setValues({
            ...values,
            isPreviewOpen: true,
        });
    };

    const savePromoPanel = () => {
        const newValues = {
            id: defaults.type === 'edit' ? values.id : null,
            panel_name: values.name,
            panel_title: values.title,
            panel_content: values.content,
            panel_groups: groupNames, // possibly use a function here for group validation
            panel_start: formatDate(values.start),
            panel_end: formatDate(values.end),
            panel_adminNotes: values.admin_notes,
        };
        actions.createPromoPanel(newValues);
    };
    const handleContentChange = data => {
        setValues({
            ...values,
            content: data,
        });
    };

    const handlePreviewClose = () => {
        setValues({
            ...values,
            isPreviewOpen: false,
        });
    };

    const handleGroupChange = event => {
        const {
            target: { value },
        } = event;

        const selections = typeof value === 'string' ? value.split(',') : value;

        setGroupNames(selections);
    };

    const handleAddSchedule = groups => {
        console.log('groups passed in', groups);
        // console.log('Scheduled Groups', scheduledGroups);
        // console.log('Chosen Groups', groupNames);
        const newGroups = [...scheduledGroups];

        groupNames.map(item => !newGroups.includes(item) && newGroups.push(item));

        setScheduledGroups(newGroups);

        console.log('Group names are', groupNames, newGroups);

        const unscheduledGroup = knownGroups
            .filter(item => groupNames.indexOf(item) < 0)
            .filter(item => newGroups.indexOf(item) < 0);

        console.log('Setting UnscheduledGroups with ', unscheduledGroup);
        setUnscheduledGroups(unscheduledGroup);
        setGroupNames([]);

        const allocatedList = values.scheduleList;
        allocatedList.push({
            groupNames: groupNames,
            startDate: values.start,
            endDate: values.end,
        });

        setValues({
            ...values,
            scheduledGroups: newGroups,
            scheduleList: allocatedList,
        });
    };

    const handleChange = prop => event => {
        let propValue;
        if (['is_default_panel'].includes(prop)) {
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

    const removePanelGroupSchedule = idx => {
        const newSchedules = [...values.scheduleList];
        const removeGroups = values.scheduleList[idx].groupNames;

        // console.log('NewSchedules', newSchedules);
        // console.log('removeGroups', removeGroups);

        newSchedules.splice(idx, 1);

        const newGroups = [...unscheduledGroups];
        removeGroups.map(item => !newGroups.includes(item) && newGroups.push(item));

        const unscheduled = knownGroups.filter(item => {
            return newGroups.indexOf(item) > -1;
        });
        console.log('unscheduled', unscheduled);
        console.log('the values of scheduled groups', values.scheduledGroups);
        const allocGroups = knownGroups.filter(item => unscheduled.indexOf(item) < 0);
        console.log('The suggested scheduled groups are', allocGroups);

        setUnscheduledGroups(unscheduled);
        setScheduledGroups(allocGroups);

        console.log('Setting New Scheduled Groups', allocGroups);
        setValues({
            ...values,
            scheduleList: [...newSchedules],
            scheduledGroups: [...allocGroups],
        });
    };
    // console.log('SCHEDULED GROUPS FOR OBJECT', values.scheduledGroups);
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

                        <FormControl className={classes.dropdown} fullWidth title={locale.form.tooltips.groupField}>
                            <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={groupNames}
                                onChange={handleGroupChange}
                                renderValue={selected => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {unscheduledGroups.map(name => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={groupNames.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid container style={{ margin: '0 10px 0' }}>
                        <Typography style={{ fontWeight: 'bold' }}>Is this the default panel for group?</Typography>
                        <Grid container>
                            <Typography style={{ fontSize: 12 }}>
                                If selected, this will be the default panel for the selected groups
                            </Typography>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <InputLabel
                                    title={locale.form.tooltips.defaultPanelCheckbox}
                                    className={`${classes.scheduleCell}`}
                                >
                                    <Checkbox
                                        checked={values.is_default_panel === 1}
                                        data-testid="admin-spotlights-form-checkbox-published"
                                        onChange={handleChange('is_default_panel')}
                                        className={classes.checkbox}
                                    />
                                    {locale.form.labels.defaultPanelCheckbox}
                                </InputLabel>
                            </Grid>
                            {values.is_default_panel !== 1 && (
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

                        <Grid item xs={12}>
                            <Button
                                color="primary"
                                children="Add Schedule"
                                data-testid="admin-promopanel-form-button-addSchedule"
                                onClick={() => handleAddSchedule(values.scheduledGroups)}
                                variant="contained"
                                disabled={groupNames.length < 1}
                            />
                        </Grid>
                        <Grid container style={{ border: '1px solid black', padding: '10px' }}>
                            <Grid item xs={12}>
                                Current assignments
                                <Grid container>
                                    <Grid item xs={4}>
                                        <Typography style={{ fontWeight: 'bold' }}>Group name</Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        Scheduled Start
                                    </Grid>
                                    <Grid item xs={3}>
                                        Scheduled End
                                    </Grid>
                                    <Grid item xs={2}>
                                        Action
                                    </Grid>
                                </Grid>
                                {values.scheduleList.length > 0 &&
                                    values.scheduleList.map((item, index) => {
                                        return (
                                            <Grid container>
                                                <Grid item xs={4}>
                                                    {item.groupNames.join(', ')}
                                                </Grid>
                                                <Grid item xs={3}>
                                                    {item.startDate}
                                                </Grid>
                                                <Grid item xs={3}>
                                                    {item.endDate}
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Button
                                                        color="primary"
                                                        children="Remove group"
                                                        data-testid="admin-promopanel-form-button-cancel"
                                                        onClick={() => removePanelGroupSchedule(index)}
                                                        variant="contained"
                                                    />
                                                </Grid>
                                            </Grid>
                                        );
                                    })}
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} style={{ marginTop: '1rem' }}>
                        <Grid item xs={3} align="left">
                            <Button
                                color="secondary"
                                children="Cancel"
                                data-testid="admin-promopanel-form-button-cancel"
                                onClick={() => navigateToListPage()}
                                variant="contained"
                            />
                        </Grid>

                        <Grid item xs={9} align="right">
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
            <PromoPanelPreview
                isPreviewOpen={values.isPreviewOpen}
                previewName={values.name}
                handlePreviewClose={handlePreviewClose}
                previewTitle={values.title}
                previewContent={values.content}
                previewGroup={groupNames}
                previewScheduled={values.scheduled === 1 ? true : false}
                previewStart={values.start}
                previewEnd={values.end}
            />
        </Fragment>
    );
};

PromoPanelForm.propTypes = {
    actions: PropTypes.any,
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
