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

// return sunday coming, unless it is fri-sat-sun, in which case return Next sunday
export function getTimeSundayNextFormatted(baseDate = null) {
    const today = baseDate || moment();
    const dayOfWeek = today.isoWeekday();
    const [friday, saturday, sunday] = [5, 6, 7];
    const numberOfWeeksToAdd = [friday, saturday, sunday].includes(dayOfWeek) ? 1 : 0;
    return today
        .isoWeekday(sunday)
        .add(numberOfWeeksToAdd, 'weeks')
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

export const addConstantsToDisplayValues = (displayText, imageWidthIn = null, imageHeightIn = null, ratio = null) => {
    return displayText
        .replace('[WIDTH]', imageWidthIn || locale.form.upload.ideal.width)
        .replace('[HEIGHT]', imageHeightIn || locale.form.upload.ideal.height)
        .replace('[RATIO]', ratio || locale.form.upload.ideal.ratio)
        .replace('[MAXFILESIZE]', locale.form.upload.maxSize / 1000);
};
