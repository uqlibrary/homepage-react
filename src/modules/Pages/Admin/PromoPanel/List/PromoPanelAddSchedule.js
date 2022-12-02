/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import parse from 'html-react-parser';
import Button from '@material-ui/core/Button';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import { getTimeMondayMidnightNext, getTimeSundayNextFormatted } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';
// import { formatDate } from '../Spotlights/spotlighthelpers';

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
export const PromoPanelAddSchedule = ({
    isAddingSchedule,
    defaultStartDate,
    defaultEndDate,
    groupName,
    userPanelList,
    promoPanelList,
    handleAddGroupSchedule,
    handleCloseGroupSchedule,
    // handleCloseGroupDate,
    // handleSaveGroupDate,
    // scheduleChangeIndex,
}) => {
    const classes = useStyles();

    const [selectedPanel, setSelectedPanel] = useState('');
    const [AvailablePanels, setAvailablePanels] = useState(promoPanelList);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handlePanelChange = event => {
        const {
            target: { value },
        } = event;
        setSelectedPanel(value);
    };
    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);

    const getConflictErrormsg = (title, start, end) => {
        return (
            <>
                <p>A schedule already exists within these here times</p>
                <p>
                    <strong>{title}</strong>
                    <br />
                    {start} &gt; {end}
                </p>
            </>
        );
    };

    useEffect(() => {
        const available = [];
        promoPanelList.length > 0 &&
            promoPanelList.map(item => {
                if (item.default_panels_for.length < 1) {
                    available.push(item);
                }
            });
        setAvailablePanels(available);
    }, [promoPanelList]);

    useEffect(() => {
        setStartDate(defaultStartDate);
        setEndDate(defaultEndDate);
    }, [defaultStartDate, defaultEndDate]);

    useEffect(() => {
        if (isAddingSchedule) {
            setShowError(false);
            setSelectedPanel('');
            userPanelList.map(user => {
                if (user.usergroup_group === groupName) {
                    user.scheduled_panels.map(panel => {
                        if (
                            (moment(startDate).isSameOrAfter(moment(panel.panel_schedule_start_time)) &&
                                moment(startDate).isBefore(moment(panel.panel_schedule_end_time))) ||
                            (moment(panel.panel_schedule_start_time).isSameOrAfter(moment(startDate)) &&
                                moment(panel.panel_schedule_start_time).isBefore(moment(endDate)))
                        ) {
                            setErrorMessage(
                                getConflictErrormsg(
                                    panel.panel_title,
                                    panel.panel_schedule_start_time,
                                    panel.panel_schedule_end_time,
                                ),
                            );

                            setShowError(true);
                        }
                    });
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAddingSchedule]);

    const handleDateChange = event => value => {
        event === 'start'
            ? setStartDate(value.format('YYYY-MM-DD HH:mm'))
            : setEndDate(value.format('YYYY-MM-DD HH:mm'));
        // Check if there's a conflict here.
        setShowError(false);
        setErrorMessage('');
        if (groupName && groupName !== '') {
            userPanelList.map(user => {
                if (user.usergroup_group === groupName) {
                    user.scheduled_panels.map(panel => {
                        if (
                            (moment(startDate).isSameOrAfter(moment(panel.panel_schedule_start_time)) &&
                                moment(startDate).isBefore(moment(panel.panel_schedule_end_time))) ||
                            (moment(panel.panel_schedule_start_time).isSameOrAfter(moment(startDate)) &&
                                moment(panel.panel_schedule_start_time).isBefore(moment(endDate)))
                        ) {
                            setErrorMessage(
                                getConflictErrormsg(
                                    panel.panel_title,
                                    panel.panel_schedule_start_time,
                                    panel.panel_schedule_end_time,
                                ),
                            );
                            setShowError(true);
                        }
                    });
                }
            });
        }
    };

    const handleGroupSchedule = () => {
        handleAddGroupSchedule(selectedPanel, groupName, startDate, endDate);
    };
    // const handleGroupDateClose = () => {
    //     handleCloseGroupDate();
    // };

    // const handleGroupDateSave = () => {
    //     handleSaveGroupDate(scheduleChangeIndex, { start: startDate, end: endDate });
    // };

    return (
        <React.Fragment>
            <Dialog
                open={isAddingSchedule}
                aria-labelledby="lightboxTitle"
                PaperProps={{ classes: { root: classes.dialogPaper } }}
            >
                <DialogTitle
                    id="lightboxTitle"
                    data-testid="panel-edit-date-title"
                    style={{ position: 'relative', borderBottom: '1px solid #d7d1cc', fontSize: 12 }}
                    children={
                        <p style={{ lineHeight: 1, margin: 0 }}>{`Add a new scheduled panel for ${groupName}`}</p>
                    }
                />
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <FormControl className={classes.dropdown} fullWidth title={'Panel'}>
                                <InputLabel id="group-selector">Panel</InputLabel>
                                <Select
                                    labelId="group-selector"
                                    id="demo-multiple-checkbox"
                                    label="Panel"
                                    value={selectedPanel}
                                    onChange={handlePanelChange}
                                    // renderValue={selected => selected.join(', ')}
                                    MenuProps={MenuProps}
                                >
                                    {AvailablePanels.map(item => (
                                        <MenuItem key={item.panel_id} value={item.panel_id}>
                                            <ListItemText primary={item.panel_title} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs>
                            <KeyboardDateTimePicker
                                id="admin-promopanel-group-start-date"
                                data-testid="admin-promopanel-group-start-date"
                                value={startDate}
                                label="Start date"
                                onChange={handleDateChange('start')}
                                minDate={startDate}
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
                        <Grid item xs>
                            <KeyboardDateTimePicker
                                id="admin-promopanel-group-end-date"
                                data-testid="admin-promopanel-group-end-date"
                                value={endDate}
                                label="End date"
                                onChange={handleDateChange('end')}
                                format="DD/MM/YYYY HH:mm a"
                                minDate={startDate}
                                showTodayButton
                                todayLabel={'Today'}
                                autoOk
                                KeyboardButtonProps={{
                                    'aria-label': 'End Date',
                                }}
                            />
                            {moment(endDate).isBefore(moment().subtract(1, 'minutes')) && (
                                <div className={classes.errorStyle}>This date is in the past.</div>
                            )}
                        </Grid>
                    </Grid>
                    {showError && (
                        <Grid item xs={12}>
                            {errorMessage}
                        </Grid>
                    )}

                    <Grid item xs={12} align="right">
                        <Button
                            style={{ marginTop: 10 }}
                            color="secondary"
                            children="Cancel"
                            data-testid="admin-promopanel-group-button-cancel"
                            variant="contained"
                            onClick={handleCloseGroupSchedule}
                        />
                        <Button
                            style={{ marginTop: 10 }}
                            color="primary"
                            children="Save"
                            data-testid="admin-promopanel-group-button-save"
                            variant="contained"
                            disabled={showError || selectedPanel === ''}
                            onClick={handleGroupSchedule}
                        />
                    </Grid>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};

PromoPanelAddSchedule.propTypes = {
    isAddingSchedule: PropTypes.bool,
    groupName: PropTypes.string,
    defaultStartDate: PropTypes.any,
    defaultEndDate: PropTypes.any,
    userPanelList: PropTypes.array,
    promoPanelList: PropTypes.array,
    handleAddGroupSchedule: PropTypes.func,
    handleCloseGroupSchedule: PropTypes.func,
};

PromoPanelAddSchedule.defaultProps = {
    isAddingSchedule: false,
    defaultStartDate: getTimeMondayMidnightNext(),
    defaultEndDate: getTimeSundayNextFormatted(),
    userPanelList: [],
    promoPanelList: [],
};

export default PromoPanelAddSchedule;
