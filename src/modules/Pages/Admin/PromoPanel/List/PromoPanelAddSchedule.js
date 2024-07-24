import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import { getTimeMondayMidnightNext, getTimeSundayNextFormatted } from 'modules/Pages/Admin/dateTimeHelper';

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

export const PromoPanelAddSchedule = ({
    isAddingSchedule = /* istanbul ignore next */ false,
    groupName,
    handleAddGroupSchedule,
    handleCloseGroupSchedule,
    userPanelList,
    promoPanelList,
}) => {
    const defaultStartDate = getTimeMondayMidnightNext();
    const defaultEndDate = getTimeSundayNextFormatted();
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
                <p>A schedule already exists within these times</p>
                <p>
                    <strong>{title}</strong>
                    <br />
                    {moment(start).format('DD/MM/YYYY HH:mm a')} &gt; {moment(end).format('DD/MM/YYYY HH:mm a')}
                </p>
            </>
        );
    };

    useEffect(() => {
        const available = [];
        promoPanelList.length > 0 &&
            promoPanelList.map(item => {
                if (item.default_panels_for.length < 1 && !(item.hasOwnProperty('is_past') && item.is_past)) {
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
        event === 'start' ? setStartDate(value) : setEndDate(value);
        // Check if there's a conflict here.
        setShowError(false);
        setErrorMessage('');
    };

    const handleGroupSchedule = () => {
        let valid = true;
        /* istanbul ignore else */
        if (groupName && groupName !== '') {
            userPanelList.map(user => {
                /* istanbul ignore else */
                if (user.usergroup_group === groupName) {
                    user.scheduled_panels.map(panel => {
                        /* istanbul ignore next */
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
                            valid = false;
                        }
                    });
                }
            });
        }
        /* istanbul ignore else */
        if (valid) {
            handleAddGroupSchedule(selectedPanel, groupName, startDate, endDate);
        }
    };

    return (
        <React.Fragment>
            <Dialog open={isAddingSchedule} aria-labelledby="lightboxTitle" PaperProps={{ style: { width: 600 } }}>
                <DialogTitle
                    id="lightboxTitle"
                    data-testid="panel-edit-date-title"
                    style={{ position: 'relative', borderBottom: '1px solid #d7d1cc', fontSize: 12 }}
                    children={
                        <h2 style={{ lineHeight: 1, margin: 0 }}>{`Add a new scheduled panel for ${groupName}`}</h2>
                    }
                />
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <FormControl variant="standard" sx={{ width: '100%' }} fullWidth title={'Panel'}>
                                <InputLabel id="group-selector">Panel</InputLabel>
                                <Select
                                    variant="standard"
                                    labelId="group-selector"
                                    id="new-scheduled-panel-for-group"
                                    label="Panel"
                                    value={selectedPanel}
                                    onChange={handlePanelChange}
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
                        <Grid item sm={6}>
                            <DateTimePicker
                                sx={{
                                    width: '100%',
                                }}
                                id="admin-promopanel-group-start-date"
                                data-testid="admin-promopanel-group-start-date"
                                value={startDate}
                                label="Start date"
                                onChange={handleDateChange('start')}
                                inputProps={{
                                    id: 'admin-promopanel-group-start-date',
                                    'data-testid': 'admin-promopanel-group-start-date',
                                    style: {
                                        width: '100%',
                                        marginRight: 25,
                                    },
                                    readOnly: true,
                                }}
                                // // minDate={startDate}
                                inputFormat="ddd D MMM YYYY h:mm a"
                                renderInput={params => (
                                    <TextField
                                        variant="standard"
                                        {...params}
                                        id="admin-promopanel-group-start-date-container"
                                        data-testid="admin-promopanel-group-start-date-container"
                                    />
                                )}
                            />
                            {moment(startDate).isBefore(moment().subtract(1, 'minutes')) && (
                                <div className={'errorStyle'} data-testid="start-date-error">
                                    This date is in the past.
                                </div>
                            )}
                        </Grid>
                        <Grid item sm={6}>
                            <DateTimePicker
                                sx={{
                                    width: '100%',
                                }}
                                id="admin-promopanel-group-end-date"
                                data-testid="admin-promopanel-group-end-date"
                                value={endDate}
                                label="End date"
                                onChange={handleDateChange('end')}
                                inputFormat="ddd D MMM YYYY h:mm a"
                                inputProps={{
                                    id: 'admin-promopanel-group-end-date',
                                    'data-testid': 'admin-promopanel-group-end-date',
                                    style: {
                                        width: '100%',
                                        marginRight: 25,
                                    },
                                    readOnly: true,
                                }}
                                minDate={startDate}
                                renderInput={params => (
                                    <TextField
                                        variant="standard"
                                        {...params}
                                        id="admin-promopanel-group-end-date-container"
                                        data-testid="admin-promopanel-group-end-date-container"
                                    />
                                )}
                            />
                            {moment(endDate).isBefore(moment().subtract(1, 'minutes')) && (
                                <div className={'errorStyle'} data-testid="end-date-error">
                                    This date is in the past.
                                </div>
                            )}
                        </Grid>
                    </Grid>
                    {showError && (
                        <Grid item xs={12} data-testid="schedule-error-conflict">
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
    userPanelList: PropTypes.array,
    promoPanelList: PropTypes.array,
    handleAddGroupSchedule: PropTypes.func,
    handleCloseGroupSchedule: PropTypes.func,
};

export default PromoPanelAddSchedule;
