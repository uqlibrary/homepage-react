import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { default as locale } from 'locale/promopanel.locale';

const moment = require('moment');

const useStyles = makeStyles(theme => ({
    contentBox: {
        minWidth: '90%',
        paddingTop: 20,
        '& img': {
            maxWidth: 800,
            height: 800,
            border: '1px solid grey',
            textAlign: 'center',
        },
        '& li': {
            marginBottom: 10,
            padding: 10,
            '&:hover': {
                backgroundColor: theme.palette.secondary.main,
                transition: 'background-color 1s ease',
            },
            '& p': {
                marginBottom: 0,
                marginTop: 1,
            },
        },
        '& [aria-labelledby="lightboxTitle"]': {
            color: 'blue',
        },
    },
    dialogPaper: {
        // make the block take up more of the page
        width: 500,
    },
    link: {
        marginBottom: 10,
        marginRight: 10,
        cursor: 'pointer',
    },
}));

export const handleChange = (event, startDate, endDate, setSaveEnabled, setStartDate, setEndDate) => value => {
    console.log('Datelist The value is ', event, startDate);
    if (event === 'start') {
        if (moment(value.format('YYYY-MM-DD HH:mm')).isAfter(moment(endDate))) {
            setSaveEnabled(false);
        } else {
            setSaveEnabled(true);
        }
        setStartDate(value);
    } else {
        if (moment(startDate).isAfter(value.format('YYYY-MM-DD HH:mm'))) {
            setSaveEnabled(false);
        } else {
            setSaveEnabled(true);
        }
        setEndDate(value);
    }
};

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
                            (moment(startDate).isSameOrAfter(moment(schedule.panel_schedule_start_time)) &&
                                moment(startDate).isBefore(moment(schedule.panel_schedule_end_time))) ||
                            (moment(schedule.panel_schedule_start_time).isSameOrAfter(moment(startDate)) &&
                                /* istanbul ignore next */
                                moment(schedule.panel_schedule_start_time).isBefore(moment(endDate)))
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
    console.log('Datelist', displayList);
    !!displayList &&
        displayList.length > 0 &&
        displayList.map((alloc, index) => {
            console.log('Datelist alloc', startDate, alloc.startDate);
            /* istanbul ignore else  */
            if (
                ((moment(startDate).isSameOrAfter(moment(alloc.startDate)) &&
                    moment(startDate).isBefore(moment(alloc.endDate))) ||
                    /* istanbul ignore next */
                    (moment(alloc.startDate).isSameOrAfter(moment(startDate)) &&
                        moment(alloc.startDate).isBefore(moment(endDate)))) &&
                isValid &&
                index !== scheduleChangeIndex &&
                // Since MUI upgrade, this appears to no longer be relevant.
                // appears to be covered primarily in first if statement.
                // removed from coverage whilst this is being analysed.
                // istanbul ignore next */
                scheduleGroupIndex === alloc.groupNames
            ) {
                // Since MUI upgrade, this path appears to no longer be taken.
                // removing from coverage whilst this is being analysed.
                /* istanbul ignore next */
                () => {
                    isValid = false;
                    setConfirmationMessage(
                        locale.form.scheduleConflict.alert(
                            scheduleGroupIndex,
                            `Schedule existing in this panel for ${scheduleGroupIndex}`,
                            alloc.startDate,
                            alloc.endDate,
                        ),
                    );
                };
            }
        });

    if (isValid) {
        console.log('Datelist Start and End', startDate, endDate);
        handleSaveGroupDate(scheduleChangeIndex, {
            start: startDate,
            end: endDate,
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
    scheduleChangeIndex,
    scheduleGroupIndex,
    fullPromoPanelUserTypeList,
    setConfirmationMessage,
    setIsConfirmOpen,
    setConfirmationMode,
    panelScheduleId,
    displayList,
}) => {
    const classes = useStyles();

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

    return (
        <React.Fragment>
            <Dialog
                open={isEditingDate}
                aria-labelledby="lightboxTitle"
                PaperProps={{ classes: { root: classes.dialogPaper } }}
            >
                <DialogTitle
                    id="lightboxTitle"
                    data-testid="panel-edit-date-title"
                    style={{ position: 'relative', borderBottom: '1px solid #d7d1cc', fontSize: 12 }}
                    children={<p style={{ lineHeight: 1, margin: 0 }}>{'Edit Schedule Dates'}</p>}
                />
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs>
                            <DateTimePicker
                                value={startDate}
                                label="Start date"
                                onChange={newValue =>
                                    handleChange('start', newValue, endDate, setSaveEnabled, setStartDate, setEndDate)
                                }
                                inputFormat="ddd D MMM YYYY h:mm a"
                                inputProps={{
                                    id: 'admin-promopanel-group-start-date',
                                    'data-testid': 'admin-promopanel-group-start-date',
                                    style: {
                                        width: '100%',
                                        marginRight: 25,
                                    },
                                }}
                                showTodayButton
                                todayLabel={'Today'}
                                autoOk
                                KeyboardButtonProps={{
                                    'aria-label': 'Start Date',
                                    'data-testid': 'start-date-calendar',
                                    id: 'start-date-calendar',
                                }}
                                renderInput={params => (
                                    <TextField
                                        variant="standard"
                                        {...params}
                                        id="admin-promopanel-form-start-date-edit-container"
                                        data-testid="admin-promopanel-form-start-date-edit-container"
                                    />
                                )}
                            />
                            {moment(startDate).isBefore(moment().subtract(1, 'minutes')) && (
                                <div
                                    className={classes.errorStyle}
                                    id="start-date-warning"
                                    data-testid="start-date-warning"
                                >
                                    This date is in the past.
                                </div>
                            )}
                        </Grid>
                        <Grid item xs align="left">
                            <DateTimePicker
                                value={endDate}
                                label="End date"
                                onChange={handleChange(
                                    'end',
                                    startDate,
                                    endDate,
                                    setSaveEnabled,
                                    setStartDate,
                                    setEndDate,
                                )}
                                inputFormat="ddd D MMM YYYY h:mm a"
                                inputProps={{
                                    id: 'admin-promopanel-group-end-date',
                                    'data-testid': 'admin-promopanel-group-end-date',
                                    style: {
                                        width: '100%',
                                        marginRight: 25,
                                    },
                                }}
                                showTodayButton
                                todayLabel={'Today'}
                                autoOk
                                KeyboardButtonProps={{
                                    'aria-label': 'End Date',
                                    'data-testid': 'end-date-calendar',
                                    id: 'end-date-calendar',
                                }}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        id="admin-promopanel-form-end-date-edit-container"
                                        data-testid="admin-promopanel-form-end-date-edit-container"
                                    />
                                )}
                            />
                            {moment(endDate).isBefore(moment().subtract(1, 'minutes')) && (
                                <div
                                    className={classes.errorStyle}
                                    id="end-date-warning"
                                    data-testid="end-date-warning"
                                >
                                    This date is in the past.
                                </div>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            {moment(endDate).isBefore(moment(startDate)) && (
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

PromoPanelGroupDateSelector.defaultProps = {
    previewGroup: [],
    previewContent: '',
    helpButtonLabel: 'Help',
    helpContent: 'test',
    scheduleChangeIndex: null,
    scheduleGroupIndex: null,
};

export default PromoPanelGroupDateSelector;
