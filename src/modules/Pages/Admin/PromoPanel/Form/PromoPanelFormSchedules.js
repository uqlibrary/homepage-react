import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import { makeStyles } from '@mui/styles';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { default as locale } from 'locale/promopanel.locale';

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
    const classes = useStyles();

    return (
        <>
            {/* Schedules */}
            <Grid item md={5} xs={12}>
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
                                data-testid="admin-promopanel-form-default-panel"
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
                    <FormControl
                        variant="standard"
                        className={classes.dropdown}
                        fullWidth
                        title={locale.form.tooltips.groupField}
                    >
                        <InputLabel id="group-selector">{locale.form.labels.groupSelectorLabel}</InputLabel>
                        <Select
                            variant="standard"
                            labelId="group-selector"
                            id="group-multiple-checkbox"
                            data-testid="group-selector"
                            label={locale.form.labels.groupSelectorLabel}
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
                            <DateTimePicker
                                sx={{
                                    width: '100%',
                                }}
                                label={locale.form.labels.startDate}
                                value={moment.utc(values.start)}
                                onChange={handleChange('start')}
                                minDate={moment.utc(defaults.minimumDate)}
                                inputFormat="ddd D MMM YYYY h:mm a"
                                inputProps={{
                                    id: 'admin-promopanel-form-start-date',
                                    'data-testid': 'admin-promopanel-form-start-date',
                                    label: locale.form.labels.startDate,
                                    // style: {
                                    //     width: '100%',
                                    //     marginRight: 25,
                                    // },
                                    readOnly: true,
                                }}
                                todayLabel={locale.form.labels.datePopupNowButton}
                                InputLabelProps={{ style: { textAlign: 'left' } }}
                                autoOk
                                KeyboardButtonProps={{
                                    'aria-label': locale.form.labels.startDate,
                                }}
                                renderInput={params => <TextField variant="standard" {...params} />}
                            />
                            {moment(values.start).isBefore(moment().subtract(1, 'minutes')) && (
                                <div data-testid="admin-promopanel-startdate-past" className={classes.errorStyle}>
                                    This date is in the past.
                                </div>
                            )}
                        </Grid>
                        <Grid item xs={4} align={'right'}>
                            <DateTimePicker
                                label={locale.form.labels.endDate}
                                // variant="inline"
                                onChange={handleChange('end')}
                                value={moment.utc(values.end)}
                                minDateTime={moment.utc(values.start)}
                                inputProps={{
                                    id: 'admin-promopanel-form-end-date',
                                    'data-testid': 'admin-promopanel-form-end-date',
                                    label: locale.form.labels.endDate,

                                    style: {
                                        width: '100%',
                                        marginRight: 25,
                                    },
                                    readOnly: true,
                                }}
                                inputFormat="ddd D MMM YYYY h:mm a"
                                autoOk
                                InputLabelProps={{ style: { textAlign: 'left' } }}
                                KeyboardButtonProps={{
                                    'aria-label': locale.form.labels.endDate,
                                }}
                                renderInput={params => {
                                    const value = params.inputProps.value ?? null;
                                    return (
                                        <TextField
                                            variant="standard"
                                            helperText={
                                                !value || moment.utc(value).isBefore(moment.utc(values.start))
                                                    ? 'Should not be before Date published.'
                                                    : ''
                                            }
                                            error={!value || moment.utc(value).isBefore(moment.utc(values.start))}
                                            {...params}
                                        />
                                    );
                                }}
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
                                                    moment(item.startDate).format('ddd D MMM YYYY h:mma')) ||
                                                    'DEFAULT'}
                                            </Grid>
                                            <Grid item xs={3} style={{ padding: '10px 0 10px' }}>
                                                {!values.is_default_panel &&
                                                    moment(item.endDate).format('ddd D MMM YYYY h:mma')}
                                            </Grid>
                                            <Grid item xs={4} style={{ textAlign: 'right' }}>
                                                {!!!values.is_default_panel && (
                                                    <Button
                                                        color="primary"
                                                        children="Change Schedule"
                                                        data-testid={`admin-promopanel-form-button-editSchedule-${index}`}
                                                        onClick={() => editPanelGroupSchedule(index)}
                                                        variant="contained"
                                                    />
                                                )}

                                                <Button
                                                    style={{ marginLeft: 10 }}
                                                    color="primary"
                                                    children="Remove group"
                                                    data-testid={`admin-promopanel-form-button-removeSchedule-${index}`}
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
};

export default PromoPanelFormSchedules;
