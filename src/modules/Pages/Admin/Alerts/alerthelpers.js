const moment = require('moment');

export function formatDate(dateString, dateFormat = 'YYYY-MM-DD HH:mm:ss') {
    const newMoment = new moment(dateString);
    return newMoment.format(dateFormat);
}

export const defaultStartTime = moment().format('YYYY-MM-DDTHH:mm');

export const defaultEndTime = moment()
    .endOf('day')
    .format('YYYY-MM-DDTHH:mm');
