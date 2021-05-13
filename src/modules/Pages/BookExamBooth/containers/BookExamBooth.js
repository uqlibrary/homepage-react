import React from 'react';
import moment from 'moment';

import BookExamBooth from '../components/BookExamBooth';

const BookExamBoothContainer = () => {
    const setupAllowance = 30; // the number of minutes they can arrive and setup before their exam time starts

    const standardiseTime = time => {
        return time < 10 ? '0' + time : time;
    };

    const calculateBookingCode = isBYOD => {
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

    const calculateStartTime = (startDate, startTimeHours, startTimeMinutes) => {
        const startTimeHoursFinal = standardiseTime(startTimeHours);
        const startTimeMinutesFinal = standardiseTime(startTimeMinutes);
        const startDateTime = moment(startDate + ' ' + startTimeHoursFinal + ':' + startTimeMinutesFinal).subtract({
            minutes: setupAllowance,
        });

        const finalStartTimeHours = startDateTime.format('HH');
        const finalStartTimeMinutes = startDateTime.format('mm');

        return finalStartTimeHours + '%3A' + finalStartTimeMinutes;
    };

    const calculateEndTime = (startTimeHours, startTimeMinutes, sessionLength, startDate) => {
        const splitCharacter = '%3A'; // we send the encoding to uqbookit
        const timeDividingColon = ':';
        const numberofMinutesInHour = 60;

        // the amount of time they have to vacate the exam location and then the site is cleaned for the next student
        // for reasons unknown to me, they need much more cleaning time for the medical students?!?!
        const vacateAllowance = moment(startDate).isBefore('2020-06-22') ? 180 : 90;
        const vacateAllowanceHours = vacateAllowance / numberofMinutesInHour;

        const sessionLengthHours = sessionLength / numberofMinutesInHour;

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

    const listHours = [
        // yes, we could do something clever here, but we're working to a deadline...
        { value: 7, label: '7 am' },
        { value: 8, label: '8 am' },
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
                calculateBookingCode,
                calculateEndTime,
                calculateStartTime,
                minutesList,
                sessionLengthList,
                startTimeHoursListByExamLength,
            }}
        />
    );
};

export default BookExamBoothContainer;
