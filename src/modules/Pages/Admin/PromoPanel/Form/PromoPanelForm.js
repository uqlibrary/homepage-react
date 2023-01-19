/* istanbul ignore file */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import { scrollToTopOfPage } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';
import { PromoPanelSaveConfirmation } from './PromoPanelSaveConfirmation';
import PromoPanelPreview from '../PromoPanelPreview';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { default as locale } from 'locale/promopanel.locale';
import PromoPanelGroupDateSelector from './PromoPanelGroupDateSelector';
import PromoPanelFormConfirmation from './PromoPanelFormConfirmation';
import { addSchedule, initLists, saveGroupDate } from '../promoPanelHelpers';
import PromoPanelContentButtons from './PromoPanelContentButtons';
import PromoPanelFormSchedules from './PromoPanelFormSchedules';

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
    fullPromoPanelUserTypeList,
    knownGroups,
    defaults,
    actions,
    history,
    isDefaultPanel,
    panelUpdated,
    queueLength,
    // promoPanelActionError,
}) => {
    const classes = useStyles();

    const [selectorGroupNames, setSelectorGroupNames] = React.useState(scheduledGroupNames);
    const [scheduleChangeIndex, setScheduleChangeIndex] = useState(null);
    const [scheduleGroupIndex, setScheduleGroupIndex] = useState(null);
    const [panelScheduleId, setPanelScheduleId] = useState(null);
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
        admin_notes: (currentPanel && currentPanel.panel_admin_notes) || '',
        title: (currentPanel && currentPanel.panel_title) || '',
        content: (currentPanel && currentPanel.panel_content) || '',
    });
    const [displayList, setDisplayList] = useState([]);
    // const [hasError, setHasError] = useState(false);

    useEffect(() => {
        initLists(
            scheduledList,
            scheduledGroupNames,
            values,
            isDefaultPanel,
            setValues,
            setDisplayList,
            setSelectorGroupNames,
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scheduledGroupNames, scheduledList]);

    // useEffect(() => {
    //     if (!hasError && !!promoPanelActionError) {
    //         setHasError(true);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [promoPanelActionError]);

    const navigateToListPage = () => {
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

    const savePromoPanel = () => {
        const schedules = [];
        const defaults = [];

        if (values.scheduledList.length > 0) {
            values.scheduledList.map(item => {
                schedules.push({
                    id: item.id,
                    user_groups: [item.groupNames],
                    panel_schedule_start_time: item.startDate,
                    panel_schedule_end_time: item.endDate,
                    existing: item.existing,
                    dateChanged: item.dateChanged,
                });
            });
        }
        if (values.defaultList.length > 0) {
            values.defaultList.map(item => {
                defaults.push({ name: item.groupNames, existing: item.existing });
            });
        }

        const newValues = {
            panel_id: values.id,
            panel_title: values.title,
            panel_content: values.content,
            panel_admin_notes: values.admin_notes,
            panel_schedule: !isEdit && schedules.length > 0 ? schedules : null,
            panel_default_groups: !isEdit && defaults.length > 0 ? defaults : null,
        };

        setIsConfirmOpen(false);
        if (isEdit) {
            actions.savePromoPanel(newValues);
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
                    if (!!schedule.dateChanged) {
                        actions.updateUserTypePanelSchedule({
                            id: schedule.id,
                            usergroup: schedule.user_groups[0],
                            payload: {
                                panel_schedule_start_time: schedule.panel_schedule_start_time,
                                panel_schedule_end_time: schedule.panel_schedule_end_time,
                            },
                        });
                    }
                });
            } else if (defaults.length > 0) {
                defaults.map(defaultItem => {
                    if (!defaultItem.existing) {
                        actions.saveDefaultUserTypePanel({ id: newValues.panel_id, usergroup: defaultItem.name });
                    }
                });
            }
        } else {
            actions.createPromoPanel(newValues);
        }
    };

    const confirmSavePromo = () => {
        setConfirmationMode('save');
        if (values.is_default_panel) {
            /* istanbul ignore else */
            if (displayList.length > 0) {
                // show the confirmation box that it will overwrite the groups default with THIS panel.
                const formGroups = [];
                displayList.map(item => {
                    formGroups.push(item.groupNames);
                });
                setConfirmationMessage(locale.form.defaultGroups.alert(formGroups));
                setIsConfirmOpen(true);
            } else {
                savePromoPanel();
            }
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
            // // fake switch because istanbul doesnt block on an else if in this version :(
            // switch (true) {
            //     case ['active', 'weight'].includes(prop):
            //         propValue = !!propValue ? 1 : /* istanbul ignore next */ 0;
            //         break;
            //     /* istanbul ignore next */
            //     case propValue === false:
            //         // it returns false when we clear a text field
            //         propValue = '';
            //         break;
            //     /* istanbul ignore next */
            //     default:
            // }
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

        actions.updateScheduleQueuelength(
            newSchedules.filter(filter => !!!filter.existing || !!filter.dateChanged).length,
        );
    };

    const editPanelGroupSchedule = idx => {
        console.log('Editing Schedule');
        setScheduleChangeIndex(idx);
        setScheduleGroupIndex(displayList[idx].groupNames);
        setPanelScheduleId(displayList[idx].id);
        setEditDate({ start: displayList[idx].startDate, end: displayList[idx].endDate });
        setIsEditingDate(true);
    };

    const handleCloseGroupDate = () => {
        setIsEditingDate(false);
    };
    const handleSaveGroupDate = (idx, dateRange) => {
        saveGroupDate(idx, dateRange, displayList, setDisplayList, setIsEditingDate, actions);
        setValues({
            ...values,
            scheduledList: displayList,
        });
    };
    const clearForm = () => {
        setValues({
            ...defaults,
            admin_notes: '',
            title: '',
            content: '',
            scheduledList: [],
            defaultList: [],
        });
    };

    const addNewPanel = () => {
        clearForm();
        window.location.reload(false);
    };
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
                group={scheduleGroupIndex}
                defaultStartDate={editDate.start}
                defaultEndDate={editDate.end}
                scheduleChangeIndex={scheduleChangeIndex}
                scheduleGroupIndex={scheduleGroupIndex}
                handleCloseGroupDate={handleCloseGroupDate}
                handleSaveGroupDate={handleSaveGroupDate}
                fullPromoPanelUserTypeList={fullPromoPanelUserTypeList}
                displayList={displayList}
                setConfirmationMessage={setConfirmationMessage}
                setIsConfirmOpen={setIsConfirmOpen}
                setConfirmationMode={setConfirmationMode}
                panelScheduleId={panelScheduleId}
            />
            <PromoPanelFormConfirmation
                confirmationMode={confirmationMode}
                isConfirmOpen={isConfirmOpen}
                confirmationMessage={confirmationMessage}
                confirmSave={savePromoPanel}
                confirmAddSchedule={handleAddSchedule}
                cancelAction={cancelConfirmation}
            />

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
    fullPromoPanelUserTypeList: PropTypes.array,
    scheduledList: PropTypes.array,
    scheduledGroupNames: PropTypes.array,
    currentPanel: PropTypes.object,
    defaults: PropTypes.object,
    history: PropTypes.object,
    isDefaultPanel: PropTypes.bool,
    isEdit: PropTypes.bool,
    isClone: PropTypes.bool,
    panelUpdated: PropTypes.bool,
    promoPanelSaving: PropTypes.bool,
    queueLength: PropTypes.number,
    promoPanelActionError: PropTypes.string,
};

PromoPanelForm.defaultProps = {
    isDefaultPanel: false,
    promoPanelList: [],
};

export default PromoPanelForm;
