const moment = require('moment');

export function formatDate(dateString, dateFormat = 'YYYY-MM-DD HH:mm:ss') {
    const newMoment = new moment(dateString);
    return newMoment.format(dateFormat);
}
