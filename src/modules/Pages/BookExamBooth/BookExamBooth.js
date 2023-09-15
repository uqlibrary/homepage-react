import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Button, FormControl, FormControlLabel, Grid, MenuItem, Radio, RadioGroup, Select } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import MapIcon from '@mui/icons-material/Map';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { useTitle } from 'hooks';

import locale from './bookExamBooth.locale';

const BookExamBooth = ({
    getBookingUrl,
    getEndTime,
    getStartTime,
    minutesList,
    sessionLengthList,
    startTimeHoursListByExamLength,
}) => {
    useTitle(locale.title);

    const dateFormat = 'DD/MM/YYYY';
    const defaultHour = 8;
    const defaultMinute = 15;
    const defaultExamLength = 30; // minutes
    const setupAllowance = 30; // the number of minutes they can arrive and setup before their exam time starts

    const yesterday = moment().subtract(1, 'days');
    // .format(dateFormat);

    // store the exam location
    const [chosenLocationCode, setLocation] = React.useState('unset');
    const _handleLocationDeciderChange = e => {
        setLocation(e.target.value);
    };

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

    // the student nominates how long their exam is supposed to run for
    const [sessionLength, setSessionLength] = React.useState(defaultExamLength);
    const _handleSessionLengthChange = e => {
        const newExamLength = e.target.value;

        const newStartTimeList = startTimeHoursListByExamLength(newExamLength);
        setStartTimeHoursList(newStartTimeList);

        setSessionLength(newExamLength);
    };

    const encodeTime = momentObj => encodeURIComponent(momentObj.format('HH:mm'));
    const _getAddress = () => {
        const bookingUrl = getBookingUrl(isBYOD, chosenLocationCode, locale.locationDecider.locations);
        const startTimeStr = encodeTime(getStartTime(startDate, startTimeHours, startTimeMinutes, setupAllowance));
        const endTimeStr = encodeTime(getEndTime(startDate, startTimeHours, startTimeMinutes, sessionLength));

        const address = bookingUrl + '&firstDay=' + startDate + '&fromTime=' + startTimeStr + '&toTime=' + endTimeStr;

        // alert('we would visit ' + address);
        window.location.assign(address);
    };

    return (
        <StandardPage title={locale.pageTitle}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {locale.intro}
                </Grid>
                <Grid item xs={12}>
                    <StandardCard title={locale.displayDecider.heading}>
                        <div className="displayDecider">
                            <label htmlFor="displayDecider">{locale.displayDecider.label}</label>
                            <br />
                            <FormControl variant="standard" component="fieldset" required>
                                <RadioGroup
                                    name="displayDecider"
                                    id="displayDecider"
                                    value={isProctorU}
                                    onChange={_handleDisplayDeciderChange}
                                >
                                    <FormControlLabel
                                        control={<Radio color="primary" />}
                                        data-testid="display-decider-option-yes"
                                        label={locale.displayDecider.yesText}
                                        value="yes"
                                    />
                                    <FormControlLabel
                                        control={<Radio color="primary" />}
                                        data-testid="display-decider-option-no"
                                        label={locale.displayDecider.noText}
                                        value="no"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </StandardCard>
                </Grid>

                {isProctorU === 'yes' && (
                    <Grid item xs={12}>
                        <StandardCard title={locale.locationDecider.heading}>
                            <div>
                                <FormControl variant="standard" component="fieldset" required>
                                    <RadioGroup
                                        name="locationDecider"
                                        id="locationDecider"
                                        value={chosenLocationCode}
                                        onChange={_handleLocationDeciderChange}
                                    >
                                        {locale.locationDecider.locations.map(l => {
                                            return (
                                                <FormControlLabel
                                                    control={<Radio color="primary" />}
                                                    data-testid={`display-location-option-${l.value}`}
                                                    data-analyticsid={`display-location-option-${l.value}`}
                                                    label={
                                                        <React.Fragment>
                                                            {l.label}
                                                            <a
                                                                style={{ paddingLeft: 5, marginTop: 5 }}
                                                                href={l.mapLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                aria-label={`View a map showing the location of exams at ${
                                                                    l.needsDefiniteArticle ? 'the' : ''
                                                                } ${l.label}`}
                                                                title={`View a map showing the location of exams at ${
                                                                    l.needsDefiniteArticle ? 'the' : ''
                                                                } ${l.label}`}
                                                            >
                                                                <MapIcon />
                                                            </a>
                                                        </React.Fragment>
                                                    }
                                                    key={`location-selector-${l.mapLink}`}
                                                    value={l.value}
                                                />
                                            );
                                        })}
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </StandardCard>
                    </Grid>
                )}

                {isProctorU === 'no' && (
                    <Grid item xs={12}>
                        <StandardCard title={locale.noBookingMessage.title} standardCardId="no-booking-necessary">
                            {locale.noBookingMessage.message}
                        </StandardCard>
                    </Grid>
                )}

                {isProctorU === 'yes' && chosenLocationCode !== 'unset' && (
                    <Grid item xs={12}>
                        <StandardCard title={locale.detailsSectionHeading} standardCardId="booking-details">
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <label htmlFor="examType">{locale.examType.label}</label>
                                    <br />
                                    <FormControl variant="standard" component="fieldset">
                                        <RadioGroup
                                            id="examType"
                                            name="examType"
                                            onChange={_handleExamTypeChange}
                                            value={isBYOD}
                                        >
                                            <FormControlLabel
                                                checked={isBYOD === false}
                                                control={<Radio color="primary" />}
                                                data-testid="exam-type-option-uq"
                                                label={locale.examType.noText}
                                                value="no"
                                            />
                                            <FormControlLabel
                                                checked={isBYOD === true}
                                                control={<Radio color="primary" />}
                                                data-testid="exam-type-option-byod"
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
                                        variant="standard"
                                        className="sessionLength"
                                        data-testid="session-length-select"
                                        defaultValue={sessionLengthList[0].value}
                                        id="sessionLength"
                                        name="sessionLength"
                                        onChange={_handleSessionLengthChange}
                                        options={sessionLengthList}
                                    >
                                        {sessionLengthList.map((item, index) => {
                                            return (
                                                <MenuItem
                                                    data-testid={`session-length-option-${item.value}`}
                                                    key={`sessionLength${index})`}
                                                    value={item.value}
                                                >
                                                    {item.label}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </Grid>
                                {console.log('startdate', startDate)}
                                <Grid item xs={12}>
                                    <label htmlFor="startDate">{locale.startDate.label}</label>
                                    <br />
                                    <DatePicker
                                        data-testid="start-date"
                                        inputFormat={dateFormat}
                                        id="startDate"
                                        minDate={yesterday}
                                        name="startDate"
                                        onChange={_handleStartDateChange}
                                        type="date"
                                        value={moment(startDate, 'DD/MM/YYYY')}
                                        renderInput={params => <TextField variant="standard" {...params} />}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <label htmlFor="startTimeHours">{locale.startTimeHours.label}</label>
                                    <br />
                                    <Select
                                        variant="standard"
                                        aria-label={locale.startTimeHours.aria}
                                        data-testid="start-time-hours"
                                        defaultValue={defaultHour}
                                        id="startTimeHours"
                                        name="startTimeHours"
                                        onChange={_handleStartTimeHoursChange}
                                    >
                                        {startTimeHoursList.map((item, index) => {
                                            return (
                                                <MenuItem
                                                    data-testid={`start-time-hours-option-${item.value}`}
                                                    key={`startTimeHours${index})`}
                                                    value={item.value}
                                                >
                                                    {item.label}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                    :{' '}
                                    <Select
                                        variant="standard"
                                        aria-label={locale.startTimeMinutes.aria}
                                        data-testid="start-time-minutes"
                                        defaultValue={defaultMinute}
                                        id="startTimeMinutes"
                                        name="startTimeMinutes"
                                        onChange={_handleStartTimeMinutesChange}
                                        options={minutesList}
                                    >
                                        {minutesList.map((item, index) => {
                                            return (
                                                <MenuItem
                                                    aria-label={item.aria}
                                                    data-testid={`start-time-minutes-option-${item.value}`}
                                                    key={`startTimeMinutes${index})`}
                                                    value={item.value}
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
                                            data-analyticsid={'submit_booth_search'}
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
    getBookingUrl: PropTypes.func,
    getEndTime: PropTypes.func,
    getStartTime: PropTypes.func,
    minutesList: PropTypes.array,
    sessionLengthList: PropTypes.array,
    startTimeHoursListByExamLength: PropTypes.func,
};

export default BookExamBooth;
