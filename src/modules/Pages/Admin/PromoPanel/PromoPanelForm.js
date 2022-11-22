import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

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
// import { formatDate } from '../Spotlights/spotlighthelpers';
import PromoPanelGroupDateSelector from './Form/PromoPanelGroupDateSelector';
import PromoPanelFormConfirmation from './Form/PromoPanelFormConfirmation';
import { addSchedule, initLists, saveGroupDate } from './promoPanelHelpers';

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
    // fullPromoPanelList,
    fullPromoPanelUserTypeList,
    knownGroups,
    defaults,
    actions,
    history,
    isDefaultPanel,
}) => {
    // const scheduledGroups = [];
    const classes = useStyles();

    // const [unscheduledGroups, setUnscheduledGroups] = useState(knownGroups);
    // const [scheduledGroups, setScheduledGroups] = useState(scheduledGroupNames);
    const [selectorGroupNames, setSelectorGroupNames] = React.useState(scheduledGroupNames);
    const [scheduleChangeIndex, setScheduleChangeIndex] = useState(null);
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [editDate, setEditDate] = useState({ start: null, end: null });
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState(null);
    const [confirmationMode, setConfirmationMode] = useState('');
    const [mode, setMode] = useState({ validate: true });

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
        const newValues = {
            panel_id: values.id,
            panel_title: values.title,
            panel_content: values.content,
            panel_admin_notes: values.admin_notes,
        };

        setIsConfirmOpen(false);
        if (isEdit) {
            actions.savePromoPanel(newValues).then(navigateToListPage());
        } else {
            actions.createPromoPanel(newValues).then(navigateToListPage());
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
                    <Grid item md={5} xs={12}>
                        <Typography style={{ fontWeight: 'bold' }}>Default Panel</Typography>
                        <Grid container>
                            <Typography style={{ fontSize: 12 }}>
                                Panels can either be a default panel for groups, or scheduled - NOT both.
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
                                        disabled={isEdit && scheduledList.length > 0}
                                    />
                                    {locale.form.labels.defaultPanelCheckbox}
                                </InputLabel>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container style={{ margin: '0 10px 0' }}>
                        <Grid item xs={4}>
                            {/* <Typography style={{ fontWeight: 'bold' }}>Group Assignment</Typography> */}

                            <FormControl className={classes.dropdown} fullWidth title={locale.form.tooltips.groupField}>
                                <InputLabel id="group-selector">Group Assignment</InputLabel>
                                <Select
                                    labelId="group-selector"
                                    id="demo-multiple-checkbox"
                                    label="Group Assignment"
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
                            </Grid>
                        </>
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
                                    !!!values.admin_notes ||
                                    values.admin_notes.length < 1 ||
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
                                children={isEdit ? 'Save' : 'Create'}
                                disabled={
                                    !!!values.admin_notes ||
                                    values.admin_notes.length < 1 ||
                                    !!!values.title ||
                                    values.title.length < 1 ||
                                    !!!values.content ||
                                    values.content.length < 1
                                }
                                // disabled={!isFormValid}
                                onClick={values.is_default_panel ? confirmSavePromo : savePromoPanel}
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
            <PromoPanelFormConfirmation
                confirmationMode={confirmationMode}
                isConfirmOpen={isConfirmOpen}
                confirmationMessage={confirmationMessage}
                confirmSave={savePromoPanel}
                confirmAddSchedule={handleAddSchedule}
                cancelAction={cancelConfirmation}
            />
        </Fragment>
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
};

PromoPanelForm.defaultProps = {
    isDefaultPanel: false,
    promoPanelList: [],
    publicFileUploading: false, // whether a file is currently being uploaded. Only done by Add, other defaults false
    publicFileUploadError: false,
    publicFileUploadResult: false,
};

export default PromoPanelForm;
