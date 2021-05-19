import React from 'react';
import moment from 'moment';

import BookExamBooth from '../components/BookExamBooth';

const BookExamBoothContainer = () => {
    /**
     * Return booking url based on whether student needs UQ computer
     *
     * @param bool isBYOD
     * @returns string
     */
    const getBookingUrl = isBYOD => {
        const urlRoot = 'https://uqbookit.uq.edu.au/#/app/booking-types/';
        // const urlRoot = 'https://uqbookit-dev.uq.edu.au/#/app/booking-types/';

        const bookingCodes = {
            byod: 'ae12d42e-faae-4553-8c6a-be2fcddb4b26',
            uq: 'f30fe4d2-bb58-4426-9c38-843c40b2cd3c',
        };
        const bookingCode = isBYOD ? bookingCodes.byod : bookingCodes.uq;
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
     * @param number sessionLength - Number of minutes
     * @returns moment
     */
    const getEndTime = (startDate, startTimeHours, startTimeMinutes, sessionLength) => {
        const startDateTime = moment(startDate)
            .hour(startTimeHours)
            .minute(startTimeMinutes);
        const vacateAllowance = startDateTime.isBefore('2020-06-22') ? 180 : 90;
        return startDateTime.add(sessionLength, 'minutes').add(vacateAllowance, 'minutes');
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
