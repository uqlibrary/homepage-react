import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { default as locale } from 'modules/Pages/Admin/PromoPanel/promopanel.locale';
import Box from '@mui/material/Box';

const moment = require('moment');

export const handleGroupDateSave = (
    displayList,
    fullPromoPanelUserTypeList,
    scheduleGroupIndex,
    scheduleChangeIndex,
    panelScheduleId,
    startDate,
    endDate,
    setConfirmationMessage,
    handleSaveGroupDate,
    setConfirmationMode,
    setIsConfirmOpen,
) => {
    const capturedStartDate = moment(moment(new Date(startDate)).format('YYYY-MM-DD HH:mm:ss'));
    const capturedEndDate = moment(moment(new Date(endDate)).format('YYYY-MM-DD HH:mm:ss'));
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    let isValid = true;
    // Check against existing schedules already saved
    fullPromoPanelUserTypeList.map(schedules => {
        /* istanbul ignore else */
        if (schedules.usergroup_group === scheduleGroupIndex) {
            schedules.scheduled_panels &&
                schedules.scheduled_panels.map(schedule => {
                    /* istanbul ignore else */
                    if (isValid && schedule.panel_schedule_id !== panelScheduleId) {
                        /* istanbul ignore else */
                        if (
                            (capturedStartDate.isSameOrAfter(moment(new Date(schedule.panel_schedule_start_time))) &&
                                capturedStartDate.isBefore(moment(new Date(schedule.panel_schedule_end_time)))) ||
                            (moment(new Date(schedule.panel_schedule_start_time)).isSameOrAfter(capturedStartDate) &&
                                moment(new Date(schedule.panel_schedule_start_time)).isBefore(capturedEndDate))
                        ) {
                            isValid = false;
                            setConfirmationMessage(
                                locale.form.scheduleConflict.alert(
                                    scheduleGroupIndex,
                                    schedule.panel_title,
                                    schedule.panel_schedule_start_time,
                                    schedule.panel_schedule_end_time,
                                ),
                            );
                        }
                    }
                });
        }
    });
    !!displayList &&
        displayList.length > 0 &&
        displayList.map((alloc, index) => {
            /* istanbul ignore else  */
            if (
                ((capturedStartDate.isSameOrAfter(moment(alloc.startDate, dateFormat)) &&
                    capturedStartDate.isBefore(moment(alloc.endDate, dateFormat))) ||
                    (moment(alloc.startDate, dateFormat).isSameOrAfter(capturedStartDate) &&
                        moment(alloc.startDate, dateFormat).isBefore(capturedEndDate))) &&
                isValid &&
                index !== scheduleChangeIndex &&
                scheduleGroupIndex === alloc.groupNames
            ) {
                isValid = false;
                setConfirmationMessage(
                    locale.form.scheduleConflict.alert(
                        scheduleGroupIndex,
                        `Schedule existing in this panel for ${scheduleGroupIndex}`,
                        alloc.startDate,
                        alloc.endDate,
                    ),
                );
            }
        });

    if (isValid) {
        handleSaveGroupDate(scheduleChangeIndex, {
            start: capturedStartDate.format('YYYY-MM-DD HH:mm:ss'),
            end: capturedEndDate.format('YYYY-MM-DD HH:mm:ss'),
        });
    } else {
        setConfirmationMode('schedule');
        setIsConfirmOpen(true);
    }
};

export const PromoPanelGroupDateSelector = ({
    isEditingDate,
    defaultStartDate,
    defaultEndDate,
    handleCloseGroupDate,
    handleSaveGroupDate,
    scheduleChangeIndex = null,
    scheduleGroupIndex = null,
    fullPromoPanelUserTypeList,
    setConfirmationMessage,
    setIsConfirmOpen,
    setConfirmationMode,
    panelScheduleId,
    displayList,
}) => {
    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);
    const [saveEnabled, setSaveEnabled] = useState(true);

    useEffect(() => {
        setStartDate(defaultStartDate);
        setEndDate(defaultEndDate);
    }, [defaultStartDate, defaultEndDate]);

    const handleGroupDateClose = () => {
        setStartDate(defaultStartDate);
        setStartDate(defaultEndDate);
        handleCloseGroupDate();
    };

    React.useEffect(() => {
        if (moment(new Date(startDate)).isAfter(moment(new Date(endDate)))) {
            setSaveEnabled(false);
        } else {
            setSaveEnabled(true);
        }
    }, [startDate, endDate]);

    return (
        <React.Fragment>
            <Dialog open={isEditingDate} aria-labelledby="lightboxTitle" PaperProps={{ style: { width: 500 } }}>
                <DialogTitle
                    id="lightboxTitle"
                    data-testid="panel-edit-date-title"
                    style={{ position: 'relative', borderBottom: '1px solid #d7d1cc', fontSize: 12 }}
                    children={
                        <Box style={{ fontSize: '1.5em', fontWeight: 'bold', lineHeight: 1, margin: 0 }}>
                            {'Edit Schedule Dates'}
                        </Box>
                    }
                />
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs>
                            <DateTimePicker
                                sx={{ width: '65%' }}
                                value={moment(new Date(startDate))}
                                label="Start date"
                                // onChange={handleChange(
                                //     'start',
                                //     startDate,
                                //     endDate,
                                //     setSaveEnabled,
                                //     setStartDate,
                                //     setEndDate,
                                // )}
                                onChange={newValue => setStartDate(newValue)}
                                format="ddd D MMM YYYY h:mm a"
                                showTodayButton
                                todayLabel={'Today'}
                                autoOk
                                KeyboardButtonProps={{
                                    'aria-label': 'Start Date',
                                    'data-testid': 'start-date-calendar',
                                    id: 'start-date-calendar',
                                }}
                                slotProps={{
                                    textField: {
                                        variant: 'standard',
                                        id: 'admin-promopanel-group-start-date',
                                        inputProps: { 'data-testid': 'admin-promopanel-group-start-date' },
                                    },
                                    openPickerButton: {
                                        'data-testid': 'admin-promopanel-group-start-date-button',
                                    },
                                }}
                            />
                            {moment(new Date(startDate)).isBefore(moment().subtract(1, 'minutes')) && (
                                <div id="start-date-warning" data-testid="start-date-warning">
                                    This date is in the past.
                                </div>
                            )}
                        </Grid>
                        <Grid item xs align="left">
                            <DateTimePicker
                                sx={{ width: '65%' }}
                                value={moment(new Date(endDate))}
                                label="End date"
                                // onChange={handleChange(
                                //     'end',
                                //     startDate,
                                //     endDate,
                                //     setSaveEnabled,
                                //     setStartDate,
                                //     setEndDate,
                                // )}
                                onChange={newValue => setEndDate(newValue)}
                                format="ddd D MMM YYYY h:mm a"
                                showTodayButton
                                todayLabel={'Today'}
                                autoOk
                                KeyboardButtonProps={{
                                    'aria-label': 'End Date',
                                    'data-testid': 'end-date-calendar',
                                    id: 'end-date-calendar',
                                }}
                                slotProps={{
                                    textField: {
                                        variant: 'standard',
                                        id: 'admin-promopanel-group-end-date',
                                        inputProps: { 'data-testid': 'admin-promopanel-group-end-date' },
                                    },
                                    openPickerButton: {
                                        'data-testid': 'admin-promopanel-group-end-date-button',
                                    },
                                }}
                            />
                            {moment(new Date(endDate)).isBefore(moment().subtract(1, 'minutes')) && (
                                <div id="end-date-warning" data-testid="end-date-warning">
                                    This date is in the past.
                                </div>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            {moment(new Date(endDate)).isBefore(moment(new Date(startDate))) && (
                                <span data-testid="panel-start-date-warning">Start Date cannot be after End Date.</span>
                            )}
                        </Grid>

                        <Grid item xs={12} align="right">
                            <Button
                                style={{ marginTop: 10 }}
                                color="secondary"
                                children="Cancel"
                                data-testid="admin-promopanel-group-button-cancel"
                                variant="contained"
                                onClick={handleGroupDateClose}
                            />

                            <Button
                                style={{ marginTop: 10 }}
                                color="primary"
                                children="Ok"
                                disabled={!saveEnabled}
                                data-testid="admin-promopanel-group-button-save"
                                variant="contained"
                                onClick={() =>
                                    handleGroupDateSave(
                                        displayList,
                                        fullPromoPanelUserTypeList,
                                        scheduleGroupIndex,
                                        scheduleChangeIndex,
                                        panelScheduleId,
                                        startDate,
                                        endDate,
                                        setConfirmationMessage,
                                        handleSaveGroupDate,
                                        setConfirmationMode,
                                        setIsConfirmOpen,
                                    )
                                }
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};

PromoPanelGroupDateSelector.propTypes = {
    isEditingDate: PropTypes.bool,
    defaultStartDate: PropTypes.any,
    defaultEndDate: PropTypes.any,
    scheduleChangeIndex: PropTypes.number,
    scheduleGroupIndex: PropTypes.string,
    handleCloseGroupDate: PropTypes.func,
    handleSaveGroupDate: PropTypes.func,
    fullPromoPanelUserTypeList: PropTypes.array,
    setConfirmationMessage: PropTypes.func,
    setIsConfirmOpen: PropTypes.func,
    setConfirmationMode: PropTypes.func,
    panelScheduleId: PropTypes.number,
    displayList: PropTypes.array,
};

export default PromoPanelGroupDateSelector;
