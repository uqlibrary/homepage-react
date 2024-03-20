import React from 'react';
import moment from 'moment';

import BookExamBooth from './BookExamBooth';

const BookExamBoothContainer = () => {
    /**
     * Return booking url based on whether student needs UQ computer
     *
     * @param bool isBYOD
     * @param string chosenLocationCode
     * @param array locations
     * @returns string
     */
    const getBookingUrl = (isBYOD, chosenLocationCode, locations) => {
        const urlRoot = 'https://uqbookit.uq.edu.au/app/booking-types/';
        // const urlRoot = 'https://uqbookit-dev.uq.edu.au/app/booking-types/';

        const locationCode =
            chosenLocationCode === 'unset' ? /* istanbul ignore next */ locations[0].value : chosenLocationCode; // should not be unset
        const locationOptions = locations.find(l => l.value === locationCode);
        const bookingCode = isBYOD ? locationOptions.BYODBookitLink : locationOptions.needsComputerBookitLink;
        return urlRoot + bookingCode;
    };

    /**
     * Calculate and return booking start time
     *
     * @param string startDate
     * @param number startTimeHours
     * @param number startTimeMinutes
     * @param number setupAllowance - Number of minutes
     * @returns moment
     */
    const getStartTime = (startDate, startTimeHours, startTimeMinutes, setupAllowance) =>
        moment(startDate)
            .hour(startTimeHours)
            .minute(startTimeMinutes)
            .subtract(setupAllowance, 'minutes');

    /**
     * Calculate and return booking end time
     *
     * @param string startDate
     * @param number startTimeHours
     * @param number startTimeMinutes
     * @param number sessionLengthMinutes
     * @returns moment
     */
    const getEndTime = (startDate, startTimeHours, startTimeMinutes, sessionLengthMinutes) => {
        const startDateTime = moment(startDate)
            .hour(startTimeHours)
            .minute(startTimeMinutes);
        const vacateAllowanceMinutes = 30; // client refers to this as the buffer time
        return startDateTime.add(sessionLengthMinutes, 'minutes').add(vacateAllowanceMinutes, 'minutes');
    };

    const getListHours = (firstHour, lastHour) => {
        const momentNow = moment();

        return Array(lastHour - firstHour + 1)
            .fill()
            .map((x, i) => {
                const hour = i + firstHour;
                const hourLabel = momentNow.hour(hour).format('h a');
                return {
                    value: hour,
                    label: hourLabel,
                };
            });
    };

    /**
     * Remove start time hours which won't accommodate given exam length
     *
     * @param number examLength - The number of minutes the exam will run for
     * @returns array
     */
    const startTimeHoursListByExamLength = examLength => {
        const output = getListHours(7, 22);

        /* istanbul ignore next */
        if (examLength >= 180) {
            output.pop();
        }
        /* istanbul ignore next */
        if (examLength > 90) {
            output.pop();
        }
        if (examLength > 30) {
            output.pop();
        }

        return output;
    };

    const minutesList = [
        { value: 0, label: '00', aria: 'booking on the hour' },
        { value: 15, label: '15', aria: 'booking at quarter past the hour' },
        { value: 30, label: '30', aria: 'booking at half past the hour' },
        {
            value: 45,
            label: '45',
            aria: 'booking at three quarters past the hour',
        },
    ];

    const sessionLengthList = [
        { value: '30', label: '30 minutes' },
        { value: '60', label: '1 hour' },
        { value: '90', label: '1 hour 30 minutes' },
        { value: '120', label: '2 hours' },
        { value: '150', label: '2 hours 30 minutes' },
        { value: '180', label: '3 hours' },
    ];

    return (
        <BookExamBooth
            {...{
                getBookingUrl,
                getEndTime,
                getStartTime,
                minutesList,
                sessionLengthList,
                startTimeHoursListByExamLength,
            }}
        />
    );
};

export default BookExamBoothContainer;
