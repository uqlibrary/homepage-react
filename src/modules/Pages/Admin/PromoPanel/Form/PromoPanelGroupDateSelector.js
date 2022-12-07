/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { DateTimePicker } from '@material-ui/pickers';
import { default as locale } from 'modules/Pages/Admin/PromoPanel/promoPanelAdmin.locale';

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
}) => {
    const classes = useStyles();

    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);
    const [saveEnabled, setSaveEnabled] = useState(true);

    useEffect(() => {
        setStartDate(defaultStartDate);
        setEndDate(defaultEndDate);
    }, [defaultStartDate, defaultEndDate]);

    const handleChange = event => value => {
        if (event === 'start') {
            if (moment(value.format('YYYY-MM-DD HH:mm')).isAfter(moment(endDate))) {
                setSaveEnabled(false);
            } else {
                setSaveEnabled(true);
            }
            setStartDate(value.format('YYYY-MM-DD HH:mm'));
        } else {
            if (moment(startDate).isAfter(value.format('YYYY-MM-DD HH:mm'))) {
                setSaveEnabled(false);
            } else {
                setSaveEnabled(true);
            }
            setEndDate(value.format('YYYY-MM-DD HH:mm'));
        }
    };

    const handleGroupDateClose = () => {
        setStartDate(defaultStartDate);
        setStartDate(defaultEndDate);
        handleCloseGroupDate();
    };

    const handleGroupDateSave = () => {
        let isValid = true;
        fullPromoPanelUserTypeList.map(schedules => {
            if (schedules.usergroup_group === scheduleGroupIndex) {
                schedules.scheduled_panels &&
                    schedules.scheduled_panels.map(schedule => {
                        if (isValid && schedule.panel_schedule_id !== panelScheduleId) {
                            if (
                                (moment(startDate).isSameOrAfter(moment(schedule.panel_schedule_start_time)) &&
                                    moment(startDate).isBefore(moment(schedule.panel_schedule_end_time))) ||
                                (moment(schedule.panel_schedule_start_time).isSameOrAfter(moment(startDate)) &&
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

        if (isValid) {
            handleSaveGroupDate(scheduleChangeIndex, { start: startDate, end: endDate });
        } else {
            setConfirmationMode('schedule');
            setIsConfirmOpen(true);
        }
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
                                id="admin-promopanel-group-start-date"
                                data-testid="admin-promopanel-group-start-date"
                                value={startDate}
                                label="Start date"
                                onChange={handleChange('start')}
                                format="DD/MM/YYYY HH:mm a"
                                showTodayButton
                                todayLabel={'Today'}
                                autoOk
                                KeyboardButtonProps={{
                                    'aria-label': 'Start Date',
                                }}
                            />
                            {moment(startDate).isBefore(moment().subtract(1, 'minutes')) && (
                                <div className={classes.errorStyle}>This date is in the past.</div>
                            )}
                        </Grid>
                        <Grid item xs align="left">
                            <DateTimePicker
                                id="admin-promopanel-group-end-date"
                                data-testid="admin-promopanel-group-end-date"
                                value={endDate}
                                label="End date"
                                onChange={handleChange('end')}
                                format="DD/MM/YYYY HH:mm a"
                                showTodayButton
                                todayLabel={'Today'}
                                autoOk
                                KeyboardButtonProps={{
                                    'aria-label': 'Start Date',
                                }}
                            />
                            {moment(endDate).isBefore(moment().subtract(1, 'minutes')) && (
                                <div className={classes.errorStyle}>This date is in the past.</div>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            {moment(endDate).isBefore(moment(startDate)) && (
                                <span>Start Date cannot be after End Date.</span>
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
                                children="Save"
                                disabled={!saveEnabled}
                                data-testid="admin-promopanel-group-button-save"
                                variant="contained"
                                onClick={handleGroupDateSave}
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
