import React from 'react';
import moment from 'moment';
import { FormControl, FormControlLabel, NativeSelect, Radio, RadioGroup, TextField } from '@material-ui/core';

const BookExamBooth = () => {
    const yesterday = moment()
        .subtract(1, 'days')
        .format('YYYY-MM-DD');

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
        setStartDate(e.target.value);
    };

    const defaultHour = 8;
    const [startTimeHours, setStartTimeHours] = React.useState(defaultHour);
    const handleStartTimeHoursChange = e => {
        setStartTimeHours(e.target.value);
    };

    const defaultMinute = 15;
    const listMinutes = [
        { value: 0, label: ':00', aria: 'booking on the hour' },
        { value: 15, label: ':15', aria: 'booking at quarter past the hour' },
        { value: 30, label: ':30', aria: 'booking at half past the hour' },
        {
            value: 45,
            label: ':45',
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
        { value: 7, label: '7am' },
        { value: defaultHour, label: '8am' },
        { value: 9, label: '9am' },
        { value: 10, label: '10am' },
        { value: 11, label: '11am' },
        { value: 12, label: '12pm' },
        { value: 13, label: '1pm' },
        { value: 14, label: '2pm' },
        { value: 15, label: '3pm' },
        { value: 16, label: '4pm' },
        { value: 17, label: '5pm' },
        { value: 18, label: '6pm' },
        { value: 19, label: '7pm' },
        { value: 20, label: '8pm' },
        { value: 21, label: '9pm' },
        { value: 22, label: '10pm' },
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

    const _isMobile = userAgent => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    };

    const _openWindow = item => {
        if (item.target) {
            if (_isMobile(navigator.userAgent)) {
                // On mobile we ignore the targetOptions
                window.open(item.link, item.target);
            } else {
                window.open(item.link, item.target, item.targetOptions || '');
            }
        } else {
            window.location = item.link;
        }
    };

    const _openChat = () => {
        const item = {
            link: 'https://support.my.uq.edu.au/app/chat/chat_launch_lib/p/45',
            target: 'chatWindow',
            targetOptions: 'width=400, height=460',
        };
        _openWindow(item);
    };

    const openContactForm = () => {
        const item = {
            link: 'https://support.my.uq.edu.au/app/library/contact',
        };
        _openWindow(item);
    };

    const convertUTCToBrisbane = hours => {
        return hours < 14 ? hours + 10 : 10 - (24 - hours);
    };

    const isChatOnline = () => {
        const d = new Date();
        const weekdaynumber = d.getUTCDay();
        let hours = d.getUTCHours();
        hours = convertUTCToBrisbane(hours);

        const sunday = 0;
        const saturday = 6;
        if (weekdaynumber === sunday || weekdaynumber === saturday) {
            return hours >= 12 && hours < 17; // noon - 5pm
        }

        // weekdays
        return hours >= 8 && hours < 20; // 8am - 8pm
    };
    return (
        <div className="App">
            <div>
                <h1>Book an exam booth in the Biological Sciences Library</h1>

                <p>
                    Please use this form to find an available booth in which to sit your exam at the{' '}
                    <a
                        href="https://use.mazemap.com/#v=1&config=uq&zlevel=1&center=153.013203,-27.497685&zoom=15.6&sharepoitype=poi&sharepoi=1000013772&campuses=uq&campusid=406"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Biological Sciences Library
                    </a>
                    .
                </p>

                <div className="displayDecider">
                    <label htmlFor="displayDecider" className="sectionLabel">
                        Are you booking this booth to sit a scheduled ProctorU exam?
                    </label>
                    <FormControl component="fieldset">
                        <RadioGroup
                            name="displayDecider"
                            id="displayDecider"
                            value={isProctorU}
                            onChange={handleDisplayDeciderChange}
                        >
                            <FormControlLabel
                                value="unset"
                                control={<Radio color="primary" />}
                                label="Please select an option"
                                checked={isProctorU === 'unset'}
                            />
                            <FormControlLabel
                                value="yes"
                                control={<Radio color="primary" />}
                                label="Yes, I am sitting a ProctorU exam"
                            />
                            <FormControlLabel
                                value="no"
                                control={<Radio color="primary" />}
                                label="No, I am NOT sitting a ProctorU exam"
                            />
                        </RadioGroup>
                    </FormControl>
                </div>

                {isProctorU === 'no' && (
                    <p>
                        {' '}
                        Please use one of the locations available{' '}
                        <a href="https://web.library.uq.edu.au/library-services/students/find-study-and-non-invigilated-exam-space">
                            around campus
                        </a>{' '}
                        - no booking necessary.
                    </p>
                )}

                {isProctorU === 'yes' && (
                    <div>
                        <div className="displayBlock examTypeBlock">
                            <label className="sectionLabel" htmlFor="examType">
                                Are you bringing your own computer?
                            </label>
                            <FormControl component="fieldset">
                                <RadioGroup
                                    name="examType"
                                    id="examType"
                                    value={isBYOD}
                                    onChange={handleExamTypeChange}
                                >
                                    <FormControlLabel
                                        value="no"
                                        control={<Radio color="primary" />}
                                        label="No, I need a UQ computer"
                                        checked={isBYOD === false}
                                    />
                                    <FormControlLabel
                                        value="yes"
                                        control={<Radio color="primary" />}
                                        label="Yes (each laptop booth has one power point)"
                                        checked={isBYOD === true}
                                    />
                                </RadioGroup>
                            </FormControl>
                        </div>

                        <div className="displayBlock sessionLengthBlock">
                            <label className="sectionLabel" htmlFor="sessionLength" id="sessionLength">
                                What is the duration of your exam, as shown on your personal exam timetable?
                            </label>
                            <NativeSelect
                                className="sessionLength"
                                defaultValue={sessionLengthList[0]}
                                name="sessionLength"
                                id="sessionLength"
                                onChange={_handleSessionLengthChange}
                                options={sessionLengthList}
                            >
                                {sessionLengthList.map((item, index) => {
                                    return (
                                        <option key={`sessionLength${index})`} value={item.value}>
                                            {item.label}
                                        </option>
                                    );
                                })}
                                ;
                            </NativeSelect>
                        </div>

                        <div className="displayBlock startDateBlock">
                            <label className="sectionLabel" htmlFor="startDate">
                                What is the date of your exam, as shown on your personal exam timetable?
                            </label>
                            <TextField
                                className="startDate"
                                defaultValue={yesterday}
                                id="startDate"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                name="startDate"
                                onChange={handleStartDateChange}
                                type="date"
                            />
                        </div>

                        <div className="displayBlock startTimeBlock">
                            <label className="sectionLabel" htmlFor="startTimeHours">
                                What is your registered ProctorU appointment time? - Select the nearest possible time
                            </label>
                            <div>
                                <NativeSelect
                                    aria-label="Select the nearest hour"
                                    className="startTimeHours"
                                    defaultValue={defaultHour}
                                    id="startTimeHours"
                                    name="startTimeHours"
                                    onChange={handleStartTimeHoursChange}
                                >
                                    {startTimeHoursList.map((item, index) => {
                                        return (
                                            <option key={`startTimeHours${index})`} value={item.value}>
                                                {item.label}
                                            </option>
                                        );
                                    })}
                                    ;
                                </NativeSelect>

                                <NativeSelect
                                    aria-label="Select the nearest minute value"
                                    className="startTimeMinutes"
                                    id="startTimeMinutes"
                                    options={listMinutes}
                                    defaultValue={defaultMinute}
                                    name="startTimeMinutes"
                                    onChange={handleStartTimeMinutesChange}
                                >
                                    {listMinutes.map((item, index) => {
                                        return (
                                            <option
                                                key={`startTimeMinutes${index})`}
                                                value={item.value}
                                                aria-label={item.aria}
                                            >
                                                {item.label}
                                            </option>
                                        );
                                    })}
                                    ;
                                </NativeSelect>
                            </div>
                        </div>

                        <fieldset>
                            <p>
                                Submit this form to proceed to UQ Book It. Log in with your student ID and password. You
                                will see a list of available exam booths based on your choices above, for example{' '}
                                <strong>A01 - Exam Computer Booth - Building 94</strong>.
                            </p>
                            <ol>
                                <li>
                                    Select any booth. A booking form will appear.
                                    <br />
                                    <strong>Do not adjust the date or times</strong>, they have been prefilled for you
                                    and include additional time for you to get setup.
                                </li>
                                <li>
                                    Enter your course code in the <strong>Booking Title</strong>
                                </li>
                                <li>
                                    Click <strong>Book</strong>
                                </li>
                            </ol>
                            <p>You will receive a confirmation email.</p>
                            <button
                                className="submit_booth_search"
                                name="submit_booth_search"
                                onClick={_getAddress}
                                aria-label="You will be sent to UQ BookIt system to complete your booking. Select an exam booth but do not adjust the time or date. After you book, you will receive a confirmation mail"
                            >
                                Submit and go to UQ BookIt
                            </button>
                        </fieldset>
                    </div>
                )}
            </div>

            <div className="cornerchat" id="cornerchat">
                {!!isChatOnline() ? (
                    <button aria-label="Chat now" className="chatOnline" onClick={_openChat}>
                        Chat - online now
                    </button>
                ) : (
                    <button
                        aria-label="Chat offline - leave your question"
                        className="chatOffline"
                        onClick={openContactForm}
                    >
                        Chat offline - leave your question
                    </button>
                )}
            </div>
        </div>
    );
};

export default BookExamBooth;
