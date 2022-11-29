import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
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
import { PromoPanelSaveConfirmation } from './Form/PromoPanelSaveConfirmation';
import PromoPanelPreview from './PromoPanelPreview';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { default as locale } from 'modules/Pages/Admin/PromoPanel/promoPanelAdmin.locale';
// import { formatDate } from '../Spotlights/spotlighthelpers';
import PromoPanelGroupDateSelector from './Form/PromoPanelGroupDateSelector';
import PromoPanelFormConfirmation from './Form/PromoPanelFormConfirmation';
import { addSchedule, initLists, saveGroupDate } from './promoPanelHelpers';
import PromoPanelContentButtons from './PromoPanelContentButtons';
import PromoPanelFormSchedules from './PromoPanelFormSchedules';

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
    isEdit,
    isClone,
    promoPanelSaving,
    // fullPromoPanelList,
    fullPromoPanelUserTypeList,
    knownGroups,
    defaults,
    actions,
    history,
    isDefaultPanel,
    panelUpdated,
    // scheduleUpdated,
    queueLength,
}) => {
    // const scheduledGroups = [];
    const classes = useStyles();

    // const [unscheduledGroups, setUnscheduledGroups] = useState(knownGroups);
    // const [scheduledGroups, setScheduledGroups] = useState(scheduledGroupNames);
    const [adminNotes, setAdminNotes] = React.useState('');
    const [selectorGroupNames, setSelectorGroupNames] = React.useState(scheduledGroupNames);
    const [scheduleChangeIndex, setScheduleChangeIndex] = useState(null);
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [editDate, setEditDate] = useState({ start: null, end: null });
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState(null);
    const [confirmationMode, setConfirmationMode] = useState('');
    const [mode, setMode] = useState({ validate: true });
    const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);

    const [values, setValues] = useState({
        ...defaults,
        is_default_panel: isDefaultPanel ? 1 : 0,
        start: defaults.startDateDefault,
        end: defaults.endDateDefault,
        scheduledList: isDefaultPanel ? [] : scheduledList,
        defaultList: isDefaultPanel ? scheduledList : [],
        scheduledGroups: scheduledGroupNames,
        test: 'test',
        admin_notes: (currentPanel && currentPanel.panel_admin_notes) || '',
        title: (currentPanel && currentPanel.panel_title) || '',
        content: (currentPanel && currentPanel.panel_content) || '',
    });
    const [displayList, setDisplayList] = useState([]);
    React.useEffect(() => {
        initLists(
            scheduledList,
            scheduledGroupNames,
            knownGroups,
            values,
            isDefaultPanel,
            setValues,
            setDisplayList,
            setSelectorGroupNames,
        );
        console.log('INIT LISTS');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scheduledGroupNames, scheduledList]);

    React.useEffect(() => {
        console.log('Current Panel Changed');
        console.log(currentPanel);
        console.log(scheduledList);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPanel]);

    // const [allocatedGroups, setAllocatedGroups] = useState(values.allocatedGroups);

    const navigateToListPage = () => {
        // clearForm();

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
    const cancelConfirmation = () => {
        setIsConfirmOpen(false);
    };
    const confirmSavePromo = () => {
        setConfirmationMode('save');
        if (values.is_default_panel) {
            // show the confirmation box that it will overwrite the groups default with THIS panel.
            const formGroups = [];
            displayList.map(item => {
                formGroups.push(item.groupNames);
            });
            setConfirmationMessage(locale.form.defaultGroups.alert(formGroups));
            setIsConfirmOpen(true);
        }
    };

    const savePromoPanel = () => {
        const schedules = [];
        const defaults = [];
        console.log('Saving Panel');
        // if (!isEdit) {
        if (values.scheduledList.length > 0) {
            values.scheduledList.map(item => {
                schedules.push({
                    user_groups: [item.groupNames],
                    panel_schedule_start_time: item.startDate,
                    panel_schedule_end_time: item.endDate,
                    existing: item.existing,
                });
            });
        }
        if (values.defaultList.length > 0) {
            values.defaultList.map(item => {
                defaults.push({ name: item.groupNames, existing: item.existing });
            });
        }
        // }
        const newValues = {
            panel_id: values.id,
            panel_title: values.title,
            panel_content: values.content,
            panel_admin_notes: values.admin_notes,
            // panel_schedule: schedules.length > 0 ? schedules : null,
            // panel_default_groups: defaults.length > 0 ? defaults : null,
        };

        setIsConfirmOpen(false);
        if (isEdit) {
            // actions.savePromoPanel(newValues).then(navigateToListPage());
            actions.savePromoPanel(newValues);
            console.log('I should be in here', schedules, defaults);
            if (schedules.length > 0) {
                schedules.map(schedule => {
                    if (!schedule.existing) {
                        actions.saveUserTypePanelSchedule({
                            id: newValues.panel_id,
                            usergroup: schedule.user_groups[0],
                            payload: {
                                panel_schedule_start_time: schedule.panel_schedule_start_time,
                                panel_schedule_end_time: schedule.panel_schedule_end_time,
                            },
                        });
                    }
                });
            } else if (defaults.length > 0) {
                console.log('THE DEFAULTS', defaults);
                defaults.map(defaultItem => {
                    if (!defaultItem.existing) {
                        actions.saveDefaultUserTypePanel({ id: newValues.panel_id, usergroup: defaultItem.name });
                    }
                });
            }
        } else {
            // actions.createPromoPanel(newValues).then(navigateToListPage());
            actions.createPromoPanel(newValues);
        }
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

    const handleAddSchedule = () => {
        const [isValid, allocatedList] = addSchedule(
            displayList,
            fullPromoPanelUserTypeList,
            selectorGroupNames,
            values,
            setConfirmationMessage,
            locale,
            mode,
            actions,
        );
        setConfirmationMode('schedule');

        if (isValid) {
            setSelectorGroupNames([]);

            setValues({
                ...values,
                scheduledList: values.is_default_panel ? values.scheduledList : allocatedList,
                defaultList: values.is_default_panel ? allocatedList : values.defaultList,
            });
            setDisplayList(allocatedList);
        } else {
            setIsConfirmOpen(true);
        }
        setMode({ validate: true });
    };

    const handleChange = prop => event => {
        console.log('HANDLING CHANGE');
        let propValue;
        if (['is_default_panel'].includes(prop)) {
            propValue = event.target.checked ? 1 : 0;
        } else if (['start', 'end'].includes(prop)) {
            propValue = event.format('YYYY/MM/DD hh:mm a');
        } else {
            console.log('It changed here');
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
        if (['is_default_panel'].includes(prop)) {
            setDisplayList(event.target.checked ? [...values.defaultList] : [...values.scheduledList]);
        }
    };

    const removePanelGroupSchedule = idx => {
        const newSchedules = [...displayList];
        newSchedules.splice(idx, 1);
        setValues({
            ...values,
            scheduledList: values.is_default_panel ? [...values.scheduledList] : [...newSchedules],
            defaultList: values.is_default_panel ? [...newSchedules] : [...values.defaultList],
        });
        setDisplayList([...newSchedules]);

        actions.updateScheduleQueuelength(newSchedules.filter(filter => !!!filter.existing).length);
    };

    const editPanelGroupSchedule = idx => {
        setScheduleChangeIndex(idx);
        setEditDate({ start: displayList[idx].startDate, end: displayList[idx].endDate });
        setIsEditingDate(true);
    };

    const handleCloseGroupDate = () => {
        setIsEditingDate(false);
    };
    const handleSaveGroupDate = (idx, dateRange) => {
        saveGroupDate(idx, dateRange, displayList, setDisplayList, setIsEditingDate);
    };
    const clearForm = () => {
        // actions.clearPromoUpdatedStatus();
        console.log('Values beforehand are:', values);
        setValues({
            ...defaults,
            admin_notes: '',
            title: '',
            content: '',
            // ['admin_notes']: 'ffff',
            scheduledList: ['a'],
            defaultList: ['b'],
        });
        console.log("I've updated the values");
        console.log('Values therefore are:', values);
        // initLists(
        //     scheduledList,
        //     scheduledGroupNames,
        //     knownGroups,
        //     values,
        //     isDefaultPanel,
        //     setValues,
        //     setDisplayList,
        //     setSelectorGroupNames,
        // );

        console.log('Values here', values);
    };

    const addNewPanel = () => {
        clearForm();
        window.location.reload(false);

        // scrollToTopOfPage();
    };

    console.log('DISPLAYLIST', displayList);

    return (
        <>
            <StandardCard title={locale.editPage.Title(isEdit, isClone)}>
                <form className={classes.spotlightForm}>
                    {/* Confirmation Boxes here */}
                    <Typography style={{ fontWeight: 'bold', fontSize: 22 }}>
                        {locale.form.labels.adminNotesLabel}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl
                                className={classes.typingArea}
                                fullWidth
                                title={locale.form.tooltips.adminNotesField}
                            >
                                <InputLabel htmlFor="promoPanelAdminNote">
                                    {locale.form.labels.adminNotesField}
                                </InputLabel>
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
                            <Typography style={{ fontWeight: 'bold', fontSize: 22 }}>
                                {locale.form.labels.titleLabel}
                            </Typography>
                            <FormControl
                                className={classes.typingArea}
                                fullWidth
                                title={locale.form.tooltips.titleField}
                            >
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
                            <Typography style={{ fontWeight: 'bold', fontSize: 22 }}>
                                {locale.form.labels.contentLabel}
                            </Typography>
                            <CKEditor
                                id="promoPanelContent"
                                style={{ width: '100%' }}
                                editor={ClassicEditor}
                                config={{ ...locale.editor.config }}
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
                    </Grid>
                </form>
            </StandardCard>
            {/* Schedules */}

            <StandardCard style={{ marginTop: 20 }} title={locale.form.labels.defaultPanelLabel}>
                <PromoPanelFormSchedules
                    values={values}
                    isEdit={isEdit}
                    currentPanel={currentPanel}
                    scheduledList={scheduledList}
                    knownGroups={knownGroups}
                    defaults={defaults}
                    displayList={displayList}
                    removePanelGroupSchedule={removePanelGroupSchedule}
                    editPanelGroupSchedule={editPanelGroupSchedule}
                    selectorGroupNames={selectorGroupNames}
                    handleAddSchedule={handleAddSchedule}
                    handleChange={handleChange}
                    handleGroupChange={handleGroupChange}
                />
                {/* <Grid item md={5} xs={12}>
                    <Grid container>
                        <Typography style={{ fontSize: 12 }}>{locale.form.labels.defaultPanelHelp}</Typography>
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
                                    disabled={isEdit && scheduledList.length > 0}
                                />
                                {locale.form.labels.defaultPanelCheckbox}
                            </InputLabel>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container style={{ margin: '0 10px 0' }}>
                    <Grid item xs={4}>


                        <FormControl className={classes.dropdown} fullWidth title={locale.form.tooltips.groupField}>
                            <InputLabel id="group-selector">{locale.form.labels.groupSelectorLabel}</InputLabel>
                            <Select
                                labelId="group-selector"
                                id="demo-multiple-checkbox"
                                label={locale.form.labels.groupSelectorLabel}
                                // InputLabel="testing"
                                multiple
                                value={selectorGroupNames}
                                onChange={handleGroupChange}
                                renderValue={selected => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {knownGroups.map(item => (
                                    <MenuItem key={item.group} value={item.group}>
                                        <Checkbox checked={selectorGroupNames.indexOf(item.group) > -1} />
                                        <ListItemText primary={item.name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    {!!!values.is_default_panel && (
                        <>
                            <Grid item xs={4} align={'right'}>
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
                                    InputLabelProps={{ style: { textAlign: 'left' } }}
                                    autoOk
                                    KeyboardButtonProps={{
                                        'aria-label': locale.form.tooltips.publishDate,
                                    }}
                                />
                                {moment(values.start).isBefore(moment().subtract(1, 'minutes')) && (
                                    <div className={classes.errorStyle}>This date is in the past.</div>
                                )}
                            </Grid>
                            <Grid item xs={4} align={'right'}>
                                <KeyboardDateTimePicker
                                    id="admin-promopanel-form-end-date"
                                    data-testid="admin-promopanel-form-end-date"
                                    label={locale.form.labels.unpublishDate}
                                    onChange={handleChange('end')}
                                    value={values.end}
                                    minDate={values.start}
                                    format="DD/MM/YYYY HH:mm a"
                                    autoOk
                                    InputLabelProps={{ style: { textAlign: 'left' } }}
                                    KeyboardButtonProps={{
                                        'aria-label': locale.form.tooltips.unpublishDate,
                                    }}
                                    minDateMessage="Should not be before Date published"
                                />
                            </Grid>
                        </>
                    )}
                </Grid>

                <Grid container style={{ margin: '0 10px 0' }}>
                    <>
                        <Grid item xs={12} style={{ margin: '10px 0 10px' }}>
                            <Button
                                color="primary"
                                children={values.is_default_panel ? 'Add default' : 'Add schedule'}
                                data-testid="admin-promopanel-form-button-addSchedule"
                                onClick={() => handleAddSchedule()}
                                variant="contained"
                                disabled={selectorGroupNames.length < 1}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography style={{ fontWeight: 'bold' }}>
                                Currently {values.is_default_panel ? 'default' : 'scheduled'} for groups
                            </Typography>
                        </Grid>
                        <Grid container style={{ border: '1px solid black', padding: '10px' }}>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={2}>
                                        <Typography style={{ fontWeight: 'bold' }}>Group name</Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography style={{ fontWeight: 'bold' }}>Scheduled Start</Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography style={{ fontWeight: 'bold' }}>Scheduled End</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography style={{ fontWeight: 'bold', textAlign: 'right' }}>
                                            Actions
                                        </Typography>
                                    </Grid>
                                </Grid>
                                {displayList.length > 0 &&
                                    displayList.map((item, index) => {
                                        return (
                                            <Grid container key={index}>
                                                <Grid item xs={2} style={{ padding: '10px 0 10px' }}>
                                                    {item.groupNames}
                                                </Grid>
                                                <Grid item xs={3} style={{ padding: '10px 0 10px' }}>
                                                    {(!values.is_default_panel &&
                                                        moment(item.startDate).format('dddd DD/MM/YYYY HH:mm a')) ||
                                                        'DEFAULT'}
                                                </Grid>
                                                <Grid item xs={3} style={{ padding: '10px 0 10px' }}>
                                                    {!values.is_default_panel &&
                                                        moment(item.endDate).format('dddd DD/MM/YYYY HH:mm a')}
                                                </Grid>
                                                <Grid item xs={4} style={{ textAlign: 'right' }}>
                                                    {!!!values.is_default_panel && (
                                                        <Button
                                                            color="primary"
                                                            children="Change Schedule"
                                                            data-testid="admin-promopanel-form-button-editSchedule"
                                                            onClick={() => editPanelGroupSchedule(index)}
                                                            variant="contained"
                                                        />
                                                    )}

                                                    <Button
                                                        style={{ marginLeft: 10 }}
                                                        color="primary"
                                                        children="Remove group"
                                                        data-testid="admin-promopanel-form-button-editSchedule"
                                                        onClick={() => removePanelGroupSchedule(index)}
                                                        variant="contained"
                                                        disabled={!!item.existing}
                                                    />
                                                </Grid>
                                            </Grid>
                                        );
                                    })}
                            </Grid>
                        </Grid> */}

                <PromoPanelContentButtons
                    values={values}
                    isEdit={isEdit}
                    previewPromoPanel={previewPromoPanel}
                    navigateToListPage={navigateToListPage}
                    confirmSavePromo={confirmSavePromo}
                    savePromoPanel={savePromoPanel}
                    promoPanelSaving={promoPanelSaving || (panelUpdated && queueLength > 0)}
                />
            </StandardCard>

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
            <PromoPanelFormConfirmation
                confirmationMode={confirmationMode}
                isConfirmOpen={isConfirmOpen}
                confirmationMessage={confirmationMessage}
                confirmSave={savePromoPanel}
                confirmAddSchedule={handleAddSchedule}
                cancelAction={cancelConfirmation}
            />
            <p>
                {`${panelUpdated}`} {queueLength}
            </p>
            <PromoPanelSaveConfirmation
                isConfirmOpen={panelUpdated && queueLength === 0}
                title={isEdit ? 'Panel has been updated' : 'Panel has been created'}
                content={
                    values.scheduledList.length > 0 || values.defaultList.length > 0
                        ? 'Panel is saved, and schedules / defaults assigned'
                        : 'This panel is yet to be scheduled or assigned.'
                }
                primaryAction={addNewPanel}
                primaryText={isEdit ? 'Continue Editing' : 'Add another panel'}
                secondaryAction={navigateToListPage}
                secondaryText={'Return to list'}
            />
        </>
    );
};

PromoPanelForm.propTypes = {
    knownGroups: PropTypes.array,
    actions: PropTypes.any,
    promoPanelList: PropTypes.array,
    fullPromoPanelUserTypeList: PropTypes.array,
    promoPanelUserTypeList: PropTypes.array,
    scheduledList: PropTypes.array,
    scheduledGroupNames: PropTypes.array,
    userList: PropTypes.array,
    currentPanel: PropTypes.object,
    defaults: PropTypes.object,
    history: PropTypes.object,
    isDefaultPanel: PropTypes.bool,
    isEdit: PropTypes.bool,
    isClone: PropTypes.bool,
    panelUpdated: PropTypes.bool,
    scheduleUpdated: PropTypes.bool,
    promoPanelSaving: PropTypes.bool,
    queueLength: PropTypes.number,
};

PromoPanelForm.defaultProps = {
    isDefaultPanel: false,
    promoPanelList: [],
    publicFileUploading: false, // whether a file is currently being uploaded. Only done by Add, other defaults false
    publicFileUploadError: false,
    publicFileUploadResult: false,
};

export default PromoPanelForm;
