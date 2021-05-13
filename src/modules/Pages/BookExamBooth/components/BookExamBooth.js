import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import { Button, FormControl, FormControlLabel, Grid, MenuItem, Radio, RadioGroup, Select } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import locale from '../bookExamBooth.locale';

const BookExamBooth = ({
    calculateBookingCode,
    calculateEndTime,
    calculateStartTime,
    minutesList,
    sessionLengthList,
    startTimeHoursListByExamLength,
}) => {
    const dateFormat = 'YYYY-MM-DD';
    const defaultHour = 8;
    const defaultMinute = 15;

    const yesterday = moment()
        .subtract(1, 'days')
        .format(dateFormat);

    // the exam type is either byod (bring your own device) or uq (use a uq provided device)
    const [isProctorU, setIsProctorU] = React.useState('unset');
    const _handleDisplayDeciderChange = e => {
        setIsProctorU(e.target.value);
    };

    // the exam type is either byod (bring your own device) or uq (use a uq provided device)
    const [isBYOD, setExamIsBYOD] = React.useState(false);
    const _handleExamTypeChange = e => {
        setExamIsBYOD(e.target.value === 'yes');
    };

    // the student chooses when their exam is
    const [startDate, setStartDate] = React.useState(yesterday);
    const _handleStartDateChange = e => {
        setStartDate(e.format(dateFormat));
    };

    const [startTimeHours, setStartTimeHours] = React.useState(defaultHour);
    const _handleStartTimeHoursChange = e => {
        setStartTimeHours(e.target.value);
    };

    const [startTimeMinutes, setStartTimeMinutes] = React.useState(defaultMinute);
    const _handleStartTimeMinutesChange = e => {
        setStartTimeMinutes(e.target.value);
    };

    const [startTimeHoursList, setStartTimeHoursList] = React.useState(startTimeHoursListByExamLength(20));

    const defaultExamLength = 30; // minutes
    // the student nominates how long their exam is supposed to run for
    const [sessionLength, setSessionLength] = React.useState(defaultExamLength);
    const _handleSessionLengthChange = e => {
        const newExamLength = e.target.value;

        const newStartTimeList = startTimeHoursListByExamLength(newExamLength);
        setStartTimeHoursList(newStartTimeList);

        setSessionLength(newExamLength);
    };

    const _getAddress = () => {
        const urlRoot = 'https://uqbookit.uq.edu.au//#/app/booking-types/';
        // const urlRoot = 'https://uqbookit-dev.uq.edu.au/#/app/booking-types/';

        const bookingCode = calculateBookingCode(isBYOD);

        const startTime = calculateStartTime(startDate, startTimeHours, startTimeMinutes);

        const endTime = calculateEndTime(startTimeHours, startTimeMinutes, sessionLength, startDate);

        const address =
            urlRoot + bookingCode + '?firstDay=' + startDate + '&fromTime=' + startTime + '&toTime=' + endTime;

        // alert('we would visit ' + address);
        window.location.assign(address);
    };

    return (
        <StandardPage title={locale.title}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {locale.intro}
                </Grid>
                <Grid item xs={12}>
                    <StandardCard title={locale.displayDecider.heading}>
                        <div className="displayDecider">
                            <label htmlFor="displayDecider">{locale.displayDecider.label}</label>
                            <br />
                            <FormControl component="fieldset" required>
                                <RadioGroup
                                    name="displayDecider"
                                    id="displayDecider"
                                    value={isProctorU}
                                    onChange={_handleDisplayDeciderChange}
                                >
                                    <FormControlLabel
                                        value="yes"
                                        control={<Radio color="primary" />}
                                        label={locale.displayDecider.yesText}
                                    />
                                    <FormControlLabel
                                        value="no"
                                        control={<Radio color="primary" />}
                                        label={locale.displayDecider.noText}
                                    />
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </StandardCard>
                </Grid>
                {isProctorU === 'no' && (
                    <Grid item xs={12}>
                        <StandardCard title={locale.noBookingMessage.title}>
                            {locale.noBookingMessage.message}
                        </StandardCard>
                    </Grid>
                )}

                {isProctorU === 'yes' && (
                    <Grid item xs={12}>
                        <StandardCard title={locale.detailsSectionHeading}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <label htmlFor="examType">{locale.examType.label}</label>
                                    <br />
                                    <FormControl component="fieldset">
                                        <RadioGroup
                                            id="examType"
                                            name="examType"
                                            onChange={_handleExamTypeChange}
                                            value={isBYOD}
                                        >
                                            <FormControlLabel
                                                checked={isBYOD === false}
                                                control={<Radio color="primary" />}
                                                label={locale.examType.noText}
                                                value="no"
                                            />
                                            <FormControlLabel
                                                checked={isBYOD === true}
                                                control={<Radio color="primary" />}
                                                label={locale.examType.yesText}
                                                value="yes"
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <label htmlFor="sessionLength">{locale.sessionLength.label}</label>
                                    <br />
                                    <Select
                                        className="sessionLength"
                                        defaultValue={sessionLengthList[0].value}
                                        id="sessionLength"
                                        name="sessionLength"
                                        onChange={_handleSessionLengthChange}
                                        options={sessionLengthList}
                                    >
                                        {sessionLengthList.map((item, index) => {
                                            return (
                                                <MenuItem key={`sessionLength${index})`} value={item.value}>
                                                    {item.label}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </Grid>
                                <Grid item xs={12}>
                                    <label htmlFor="startDate">{locale.startDate.label}</label>
                                    <br />
                                    <DatePicker
                                        format={dateFormat}
                                        id="startDate"
                                        minDate={yesterday}
                                        name="startDate"
                                        onChange={_handleStartDateChange}
                                        type="date"
                                        value={yesterday}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <label htmlFor="startTimeHours">{locale.startTimeHours.label}</label>
                                    <br />
                                    <Select
                                        aria-label={locale.startTimeHours.aria}
                                        defaultValue={defaultHour}
                                        id="startTimeHours"
                                        name="startTimeHours"
                                        onChange={_handleStartTimeHoursChange}
                                    >
                                        {startTimeHoursList.map((item, index) => {
                                            return (
                                                <MenuItem key={`startTimeHours${index})`} value={item.value}>
                                                    {item.label}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                    :
                                    <Select
                                        aria-label={locale.startTimeMinutes.aria}
                                        defaultValue={defaultMinute}
                                        id="startTimeMinutes"
                                        name="startTimeMinutes"
                                        onChange={_handleStartTimeMinutesChange}
                                        options={minutesList}
                                    >
                                        {minutesList.map((item, index) => {
                                            return (
                                                <MenuItem
                                                    key={`startTimeMinutes${index})`}
                                                    value={item.value}
                                                    aria-label={item.aria}
                                                >
                                                    {item.label}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </Grid>
                                <Grid item xs={12}>
                                    <fieldset>
                                        {locale.submissionInstructions}
                                        <Button
                                            aria-label={locale.submitButton.aria}
                                            color="primary"
                                            data-testid={'booth-search-submit-button'}
                                            id={'booth-search-submit-button'}
                                            onClick={_getAddress}
                                            size="large"
                                            variant="contained"
                                        >
                                            {locale.submitButton.label}
                                        </Button>
                                    </fieldset>
                                </Grid>
                            </Grid>
                        </StandardCard>
                    </Grid>
                )}
            </Grid>
        </StandardPage>
    );
};

BookExamBooth.propTypes = {
    calculateBookingCode: PropTypes.func,
    calculateEndTime: PropTypes.func,
    calculateStartTime: PropTypes.func,
    minutesList: PropTypes.array,
    sessionLengthList: PropTypes.array,
    startTimeHoursListByExamLength: PropTypes.func,
};

export default BookExamBooth;
