import React from 'react';
import PropTypes from 'prop-types';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/styles';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import Typography from '@material-ui/core/Typography';

import { default as locale } from 'modules/Pages/Admin/PromoPanel/promoPanelAdmin.locale';
import { useEffect } from 'react';
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

export const PromoPanelFormSchedules = ({
    values,
    isEdit,
    currentPanel,
    scheduledList,
    knownGroups,
    defaults,
    displayList,
    removePanelGroupSchedule,
    editPanelGroupSchedule,
    selectorGroupNames,
    handleAddSchedule,
    handleChange,
    handleGroupChange,
}) => {
    // const scheduledGroups = [];
    const classes = useStyles();

    // const [unscheduledGroups, setUnscheduledGroups] = useState(knownGroups);
    // const [scheduledGroups, setScheduledGroups] = useState(scheduledGroupNames);
    console.log('Scheduled List', displayList);

    return (
        <>
            {/* Schedules */}
            <Grid item md={5} xs={12}>
                {/* <Typography style={{ fontWeight: 'bold', fontSize: 22 }}>
                        {locale.form.labels.defaultPanelLabel}
                    </Typography> */}
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
                    {/* <Typography style={{ fontWeight: 'bold' }}>Group Assignment</Typography> */}

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
                                    <Typography style={{ fontWeight: 'bold', textAlign: 'right' }}>Actions</Typography>
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
        </>
    );
};

PromoPanelFormSchedules.propTypes = {
    values: PropTypes.object,
    isEdit: PropTypes.bool,
    currentPanel: PropTypes.object,
    scheduledList: PropTypes.array,
    knownGroups: PropTypes.array,
    defaults: PropTypes.object,
    displayList: PropTypes.array,
    removePanelGroupSchedule: PropTypes.func,
    editPanelGroupSchedule: PropTypes.func,
    selectorGroupNames: PropTypes.array,
    handleAddSchedule: PropTypes.func,
    handleChange: PropTypes.func,
    handleGroupChange: PropTypes.func,
};

PromoPanelFormSchedules.defaultProps = {
    isDefaultPanel: false,
    promoPanelList: [],
    publicFileUploading: false, // whether a file is currently being uploaded. Only done by Add, other defaults false
    publicFileUploadError: false,
    publicFileUploadResult: false,
};

export default PromoPanelFormSchedules;
