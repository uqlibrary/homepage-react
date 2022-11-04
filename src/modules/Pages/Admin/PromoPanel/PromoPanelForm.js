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
import PromoPanelGroupDateSelector from './Form/PromoPanelGroupDateSelector';

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

export const PromoPanelForm = ({
    scheduledList,
    scheduledGroupNames,
    currentPanel,
    // fullPromoPanelList,
    // fullPromoPanelUserTypeList,
    knownGroups,
    defaults,
    actions,
    history,
    isDefaultPanel,
}) => {
    // const scheduledGroups = [];
    console.log('CURRENT PANEL', currentPanel);
    const classes = useStyles();

    const [displayList, setDisplayList] = useState(scheduledList);
    const [unscheduledGroups, setUnscheduledGroups] = useState(knownGroups);
    const [scheduledGroups, setScheduledGroups] = useState(scheduledGroupNames);
    const [selectorGroupNames, setSelectorGroupNames] = React.useState(scheduledGroupNames);
    const [scheduleChangeIndex, setScheduleChangeIndex] = useState(null);
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [editDate, setEditDate] = useState({ start: null, end: null });

    const [values, setValues] = useState({
        ...defaults,

        is_default_panel: isDefaultPanel ? 1 : 0,
        start: defaults.startDateDefault,
        end: defaults.endDateDefault,
        scheduledList: displayList,
        scheduledGroups: scheduledGroupNames,
        test: 'test',
        admin_notes: (currentPanel && currentPanel.admin_notes) || '',
        title: (currentPanel && currentPanel.panel_title) || '',
        content: (currentPanel && currentPanel.panel_content) || '',
    });

    React.useEffect(() => {
        if (scheduledList.length > 0) {
            setValues({
                ...values,
                scheduledList: scheduledList,
            });
            setDisplayList(scheduledList);
        }
        if (scheduledGroupNames.length > 0) {
            setValues({
                ...values,
                scheduledGroups: scheduledGroupNames,
            });
            setSelectorGroupNames(scheduledGroupNames);
            const unscheduledGroup = knownGroups.filter(item => scheduledGroupNames.indexOf(item) < 0);

            setUnscheduledGroups(unscheduledGroup);
            setSelectorGroupNames([]);
        } else {
            const unscheduledGroup = knownGroups.filter(item => scheduledGroupNames.indexOf(item) < 0);

            setUnscheduledGroups(unscheduledGroup);
            setSelectorGroupNames([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scheduledGroupNames, scheduledList]);

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
            panel_title: values.title,
            panel_content: values.content,
            panel_groups: selectorGroupNames, // possibly use a function here for group validation
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

        setSelectorGroupNames(selections);
    };

    const handleAddSchedule = groups => {
        const newGroups = [...scheduledGroups];
        selectorGroupNames.map(item => {
            !newGroups.includes(item) && newGroups.push(item);
        });

        setScheduledGroups(newGroups);

        const unscheduledGroup = knownGroups
            .filter(item => selectorGroupNames.indexOf(item) < 0)
            .filter(item => newGroups.indexOf(item) < 0);

        setUnscheduledGroups(unscheduledGroup);
        setSelectorGroupNames([]);

        const allocatedList = [...displayList];
        allocatedList.push({
            groupNames: selectorGroupNames,
            startDate: values.start,
            endDate: values.end,
        });

        setValues({
            ...values,
            scheduledGroups: newGroups,
            scheduledList: allocatedList,
        });
        setDisplayList(allocatedList);
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
        const newSchedules = [...displayList];
        const removeGroups = displayList[idx].groupNames;

        newSchedules.splice(idx, 1);

        const newGroups = [...unscheduledGroups];
        removeGroups.map(item => !newGroups.includes(item) && newGroups.push(item));

        const unscheduled = knownGroups.filter(item => {
            return newGroups.indexOf(item) > -1;
        });
        const allocGroups = knownGroups.filter(item => unscheduled.indexOf(item) < 0);

        setUnscheduledGroups(unscheduled);
        setScheduledGroups(allocGroups);

        setValues({
            ...values,
            scheduledList: [...newSchedules],
            scheduledGroups: [...allocGroups],
        });
        setDisplayList([...newSchedules]);
    };

    const editPanelGroupSchedule = idx => {
        console.log('index', idx);
        console.log('editing ', displayList[idx]);
        setScheduleChangeIndex(idx);
        setEditDate({ start: displayList[idx].startDate, end: displayList[idx].endDate });
        setIsEditingDate(true);
    };

    const handleCloseGroupDate = () => {
        console.log('handleCloseGroupDate');
        setIsEditingDate(false);
    };
    const handleSaveGroupDate = (idx, dateRange) => {
        console.log('handleSaveGroupDate', idx, dateRange);
        console.log('displayList', displayList);
        const newDisplayList = [...displayList];
        newDisplayList[idx].startDate = dateRange.start;
        newDisplayList[idx].endDate = dateRange.end;
        setDisplayList(newDisplayList);
        setIsEditingDate(false);
    };

    console.log('DISPLAY LIST', displayList);
    console.log('KNOWN GROUPS', knownGroups);
    console.log('SCHEDULED LIST', displayList);

    console.log('SCHEDULED GROUP NAMES', scheduledGroupNames);

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
                                value={selectorGroupNames}
                                onChange={handleGroupChange}
                                renderValue={selected => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {knownGroups.map(name => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={selectorGroupNames.indexOf(name) > -1} />
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

                        {!values.is_default_panel && (
                            <>
                                <Grid item xs={12}>
                                    <Button
                                        color="primary"
                                        children="Add Schedule"
                                        data-testid="admin-promopanel-form-button-addSchedule"
                                        onClick={() => handleAddSchedule(values.scheduledGroups)}
                                        variant="contained"
                                        disabled={selectorGroupNames.length < 1}
                                    />
                                </Grid>
                                <Grid container style={{ border: '1px solid black', padding: '10px' }}>
                                    <Grid item xs={12}>
                                        Current assignments
                                        <Grid container>
                                            <Grid item xs={2}>
                                                <Typography style={{ fontWeight: 'bold' }}>Group name</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                Scheduled Start
                                            </Grid>
                                            <Grid item xs={3}>
                                                Scheduled End
                                            </Grid>
                                            <Grid item xs={4}>
                                                Action
                                            </Grid>
                                        </Grid>
                                        {displayList.length > 0 &&
                                            displayList.map((item, index) => {
                                                return (
                                                    <Grid container key={index}>
                                                        <Grid item xs={2}>
                                                            {item.groupNames.join(', ')}
                                                        </Grid>
                                                        <Grid item xs={3}>
                                                            {(item.startDate &&
                                                                moment(item.startDate).format(
                                                                    'dddd DD/MM/YYYY HH:mm a',
                                                                )) ||
                                                                'DEFAULT'}
                                                        </Grid>
                                                        <Grid item xs={3}>
                                                            {item.endDate &&
                                                                moment(item.endDate).format('dddd DD/MM/YYYY HH:mm a')}
                                                        </Grid>
                                                        <Grid item xs={4}>
                                                            <Button
                                                                color="primary"
                                                                children="Change Schedule"
                                                                data-testid="admin-promopanel-form-button-editSchedule"
                                                                onClick={() => editPanelGroupSchedule(index)}
                                                                variant="contained"
                                                            />
                                                            <Button
                                                                color="primary"
                                                                children="Remove group"
                                                                data-testid="admin-promopanel-form-button-editSchedule"
                                                                onClick={() => removePanelGroupSchedule(index)}
                                                                variant="contained"
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                );
                                            })}
                                    </Grid>
                                </Grid>
                            </>
                        )}
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
                previewGroup={selectorGroupNames}
                previewScheduled={values.scheduled === 1 ? true : false}
                previewStart={values.start}
                previewEnd={values.end}
            />
            <PromoPanelGroupDateSelector
                isEditingDate={isEditingDate}
                index={scheduleChangeIndex}
                defaultStartDate={editDate.start}
                defaultEndDate={editDate.end}
                scheduleChangeIndex={scheduleChangeIndex}
                handleCloseGroupDate={handleCloseGroupDate}
                handleSaveGroupDate={handleSaveGroupDate}
            />
        </Fragment>
    );
};

PromoPanelForm.propTypes = {
    knownGroups: PropTypes.array,
    actions: PropTypes.any,
    promoPanelList: PropTypes.array,
    promoPanelUserTypeList: PropTypes.array,
    scheduledList: PropTypes.array,
    scheduledGroupNames: PropTypes.array,
    userList: PropTypes.array,
    currentPanel: PropTypes.object,
    defaults: PropTypes.object,
    history: PropTypes.object,
    isDefaultPanel: PropTypes.bool,
};

PromoPanelForm.defaultProps = {
    isDefaultPanel: false,
    promoPanelList: [],
    publicFileUploading: false, // whether a file is currently being uploaded. Only done by Add, other defaults false
    publicFileUploadError: false,
    publicFileUploadResult: false,
};

export default PromoPanelForm;
