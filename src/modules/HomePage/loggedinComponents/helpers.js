import moment from 'moment-timezone';
import { isLoggedInUser } from 'helpers/access';
import { getCampusByCode } from 'helpers/general';
import { fullPath } from 'config/routes';

export const hasClasses = account =>
    isLoggedInUser(account) && !!account.current_classes && account.current_classes.length > 0;

export const getUrlForLearningResourceSpecificTab = (
    item,
    pageLocation,
    includeFullPath = false,
    isAccurateCampus = false,
) => {
    const campus = isAccurateCampus ? item.campus : getCampusByCode(item.CAMPUS);
    const learningResourceParams = `coursecode=${item.classnumber}&campus=${campus}&semester=${item.semester}`;
    const prefix = `${includeFullPath ? fullPath : ''}/learning-resources`;
    const url =
        !!pageLocation.search && pageLocation.search.indexOf('?') === 0
            ? `${prefix}${pageLocation.search}&${learningResourceParams}` // eg include ?user=s1111111
            : `${prefix}?${learningResourceParams}`;
    return url;
};

export const eventTimeLong = eventInternals => {
    const calendarOptions = {
        sameDay: '[Today,] dddd D MMMM [at] h.mma',
        nextDay: '[Tomorrow,] dddd D MMMM [at] h.mma',
        nextWeek: 'dddd D MMMM [at] h.mma',
        lastDay: '[Yesterday]  D MMMM [at] h.mma',
        lastWeek: '[Last] dddd  D MMMM [at] h.mma',
        sameElse: 'D MMMM [at] h.mma',
    };
    let dateString = moment(eventInternals.start).calendar(null, calendarOptions).replace('.00', '');
    const startDate = moment(eventInternals.start).format('MMDD');
    const endDate = moment(eventInternals.end).format('MMDD');
    if (startDate !== endDate) {
        dateString += ' - ' + moment(eventInternals.end).calendar(null, calendarOptions).replace('.00', '');
    }
    return dateString;
};

export const eventDateRange = eventInternals => {
    let response = moment(eventInternals.start).format('D MMMM');
    const startDate = moment(eventInternals.start).format('MMDD');
    const endDate = moment(eventInternals.end).format('MMDD');
    if (startDate !== endDate) {
        if (moment(eventInternals.start).format('MM') === moment(eventInternals.end).format('MM')) {
            response = moment(eventInternals.start).format('D') + ' - ' + moment(eventInternals.end).format('D MMMM');
        } else {
            response += ' - ' + moment(eventInternals.end).format('D MMMM');
        }
    }
    return response;
};

export const bookingText = ev => {
    /*
          if bookingSettings is null then bookings are not required
          if bookingSettings.isBookingAvailable is true then there are places still available (includes unlimited bookings where placesRemaining is null)
          if bookingSettings.isBookingAvailable is false then the course is fully booked
         */
    const placesRemainingText = { display: 'Booking is not required', button: 'Log in for more details' };
    if (ev.bookingSettings !== null) {
        if (ev.bookingSettings.isBookingAvailable) {
            placesRemainingText.display = 'Places still available';
            placesRemainingText.button = 'Log in and book now';
        } else {
            placesRemainingText.display = 'Event is fully booked';
            placesRemainingText.button = 'Log in to join wait list';
        }
    }
    return placesRemainingText;
};

// there is something strange happening that sometimes the api sends us an object and sometimes an array
// convert to an array when it happens
export const filterStandardisedTrainingEvents = (trainingEvents, trainingEventsLoading, trainingEventsError) => {
    const list =
        !trainingEventsLoading && !trainingEventsError && !!trainingEvents && typeof trainingEvents === 'object'
            ? Object.keys(trainingEvents).map(key => {
                  return trainingEvents[key];
              })
            : trainingEvents;
    return !!list && list.length > 0 ? list.slice(0, 3) : [];
};
