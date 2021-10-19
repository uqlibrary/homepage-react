import { default as locale } from './spotlightsadmin.locale';

const moment = require('moment');

export function formatDate(dateString, dateFormat = 'YYYY-MM-DD HH:mm:ss') {
    const newMoment = new moment(dateString);
    return newMoment.format(dateFormat);
}

// export function getTimeNowFormatted() {
//     return moment().format('YYYY-MM-DDTHH:mm');
// }

export function getStartOfDayFormatted() {
    return moment()
        .startOf('day')
        .add(1, 'minutes')
        .format('YYYY-MM-DDTHH:mm');
}

export function getTimeEndOfDayFormatted() {
    return moment()
        .endOf('day')
        .format('YYYY-MM-DDTHH:mm');
}

// return the sunday after next monday
// (next monday is the default start date, this is the default end date)
export function getTimeSundayNextFormatted(baseDate = null) {
    const today = baseDate || moment();
    const monday = 1;
    return today
        .isoWeekday(monday)
        .add(13, 'days')
        .endOf('day')
        .format('YYYY-MM-DDTHH:mm');
}

export function getTimeMondayComing(baseDate = null) {
    const today = baseDate || moment();
    const monday = 1;
    return today
        .isoWeekday(monday)
        .add(1, 'weeks')
        .hour(9); // 9am
}

export function getTimeMondayMidnightNext(baseDate = null) {
    const today = baseDate || moment();
    const monday = 1;
    return today
        .isoWeekday(monday)
        .add(1, 'weeks')
        .hour(0)
        .minute(1) // 1 minute past midnight
        .format('YYYY-MM-DDTHH:mm');
}

export const addConstantsToDisplayValues = (displayText, imageWidthIn = null, imageHeightIn = null, ratio = null) => {
    return displayText
        .replace('[WIDTH]', imageWidthIn || locale.form.upload.ideal.width)
        .replace('[HEIGHT]', imageHeightIn || locale.form.upload.ideal.height)
        .replace('[RATIO]', ratio || locale.form.upload.ideal.ratio)
        .replace('[MAXFILESIZE]', locale.form.upload.maxSize / 1000);
};

export function isPastSpotlight(spotlight) {
    return moment(spotlight.end).isBefore(moment());
}

export function isScheduledSpotlight(spotlight) {
    return moment(spotlight.start).isAfter(moment());
}

export function isCurrentSpotlight(spotlight) {
    return !isPastSpotlight(spotlight) && !isScheduledSpotlight(spotlight);
}
