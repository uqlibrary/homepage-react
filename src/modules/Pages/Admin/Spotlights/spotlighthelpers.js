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
