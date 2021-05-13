import React from 'react';
import moment from 'moment';
import { Button, FormControl, FormControlLabel, Grid, MenuItem, Radio, RadioGroup, Select } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import locale from '../bookExamBooth.locale';

const BookExamBooth = () => {
    const dateFormat = 'YYYY-MM-DD';

    const yesterday = moment()
        .subtract(1, 'days')
        .format(dateFormat);

    // the exam type is either byod (bring your own device) or uq (use a uq provided device)
    const [isProctorU, setIsProctorU] = React.useState('unset');
    const handleDisplayDeciderChange = e => {
        setIsProctorU(e.target.value);
    };

    // the exam type is either byod (bring your own device) or uq (use a uq provided device)
    const [isBYOD, setExamIsBYOD] = React.useState(false);
    const handleExamTypeChange = e => {
        setExamIsBYOD(e.target.value === 'yes');
    };

    // the student chooses when their exam is
    const [startDate, setStartDate] = React.useState(yesterday);
    const handleStartDateChange = e => {
        setStartDate(e.format(dateFormat));
    };

    const defaultHour = 8;
    const [startTimeHours, setStartTimeHours] = React.useState(defaultHour);
    const handleStartTimeHoursChange = e => {
        setStartTimeHours(e.target.value);
    };

    const defaultMinute = 15;
    const listMinutes = [
        { value: 0, label: '00', aria: 'booking on the hour' },
        { value: 15, label: '15', aria: 'booking at quarter past the hour' },
        { value: 30, label: '30', aria: 'booking at half past the hour' },
        {
            value: 45,
            label: '45',
            aria: 'booking at three quarters past the hour',
        },
    ];

    const [startTimeMinutes, setStartTimeMinutes] = React.useState(defaultMinute);
    const handleStartTimeMinutesChange = e => {
        setStartTimeMinutes(e.target.value);
    };

    const defaultExamLength = 30; // minutes
    const listHours = [
        // yes, we could do something clever here, but we're working to a deadline...
        { value: 7, label: '7 am' },
        { value: defaultHour, label: '8 am' },
        { value: 9, label: '9 am' },
        { value: 10, label: '10 am' },
        { value: 11, label: '11 am' },
        { value: 12, label: '12 pm' },
        { value: 13, label: '1 pm' },
        { value: 14, label: '2 pm' },
        { value: 15, label: '3 pm' },
        { value: 16, label: '4 pm' },
        { value: 17, label: '5 pm' },
        { value: 18, label: '6 pm' },
        { value: 19, label: '7 pm' },
        { value: 20, label: '8 pm' },
        { value: 21, label: '9 pm' },
        { value: 22, label: '10 pm' },
    ];

    const startTimeHoursListByExamLength = examLength => {
        const output = listHours;

        if (examLength >= 180) {
            output.pop();
        }
        if (examLength > 90) {
            output.pop();
        }
        if (examLength > 30) {
            output.pop();
        }

        return output;
    };

    // defaultExamLength
    const [startTimeHoursList, setStartTimeHoursList] = React.useState(startTimeHoursListByExamLength(20));

    // the student nominates how long their exam is supposed to run for
    const [sessionLength, setSessionLength] = React.useState(defaultExamLength);
    const _handleSessionLengthChange = e => {
        const newExamLength = e.target.value;

        const newStartTimeList = startTimeHoursListByExamLength(newExamLength);
        setStartTimeHoursList(newStartTimeList);

        setSessionLength(newExamLength);
    };

    const sessionLengthList = [
        { value: '30', label: '30 minutes' },
        { value: '60', label: '1 hour' },
        { value: '90', label: '1 hour 30 minutes' },
        { value: '120', label: '2 hours' },
        { value: '150', label: '2 hours 30 minutes' },
        { value: '180', label: '3 hours' },
    ];

    const setupAllowance = 30; // the number of minutes they can arrive and setup before their exam time starts

    const standardiseTime = time => {
        return time < 10 ? '0' + time : time;
    };

    const _calculateStartTime = (startDate, startTimeHours, startTimeMinutes) => {
        const startTimeHoursFinal = standardiseTime(startTimeHours);
        const startTimeMinutesFinal = standardiseTime(startTimeMinutes);
        const startDateTime = moment(startDate + ' ' + startTimeHoursFinal + ':' + startTimeMinutesFinal).subtract({
            minutes: setupAllowance,
        });

        const finalStartTimeHours = startDateTime.format('HH');
        const finalStartTimeMinutes = startDateTime.format('mm');

        return finalStartTimeHours + '%3A' + finalStartTimeMinutes;
    };

    const _calculateEndTime = (startTimeHours, startTimeMinutes, sessionLength) => {
        const splitCharacter = '%3A'; // we send the encoding to uqbookit
        const timeDividingColon = ':';
        const numberofMinutesInHour = 60;

        // the amount of time they have to vacate the exam location and then the site is cleaned for the next student
        // for reasons unknown to me, they need much more cleaning time for the medical students?!?!
        const vacateAllowance = moment(startDate).isBefore('2020-06-22') ? 180 : 90;
        const vacateAllowanceHours = vacateAllowance / numberofMinutesInHour;

        const sessionLengthHours = parseInt(sessionLength, 10) / numberofMinutesInHour;

        const startTimeHoursFinal = standardiseTime(startTimeHours);
        const startTimeMinutesFinal = standardiseTime(startTimeMinutes);

        const arbitraryDate = '2019-12-01';
        const startDateTimeFinal = arbitraryDate + ' ' + startTimeHoursFinal + ':' + startTimeMinutesFinal;
        const addToStartHours = sessionLengthHours + vacateAllowanceHours;
        const endDate = moment(startDateTimeFinal)
            .add(addToStartHours, 'hours')
            .format('HH:mm');

        return endDate.replace(timeDividingColon, splitCharacter);
    };

    const _calculateBookingCode = isBYOD => {
        const examType = isBYOD ? 'byod' : 'uq';
        const result = {
            byod: 'ae12d42e-faae-4553-8c6a-be2fcddb4b26',
            uq: 'f30fe4d2-bb58-4426-9c38-843c40b2cd3c',
        };
        if (!!result[examType]) {
            return result[examType];
        }
        return 'code not found';
    };

    const _getAddress = () => {
        const urlRoot = 'https://uqbookit.uq.edu.au//#/app/booking-types/';
        // const urlRoot = 'https://uqbookit-dev.uq.edu.au/#/app/booking-types/';

        const bookingCode = _calculateBookingCode(isBYOD, sessionLength);

        const startTime = _calculateStartTime(startDate, startTimeHours, startTimeMinutes);

        const endTime = _calculateEndTime(startTimeHours, startTimeMinutes, sessionLength);

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
                                    onChange={handleDisplayDeciderChange}
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
                                            onChange={handleExamTypeChange}
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
                                        onChange={handleStartDateChange}
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
                                        onChange={handleStartTimeHoursChange}
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
                                        onChange={handleStartTimeMinutesChange}
                                        options={listMinutes}
                                    >
                                        {listMinutes.map((item, index) => {
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

export default BookExamBooth;
