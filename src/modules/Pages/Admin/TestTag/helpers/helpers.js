import moment from 'moment';

export const capitaliseLeadingChar = text =>
    text?.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, match => match?.toUpperCase());

export const isEmptyStr = str =>
    str === null || str === undefined || (typeof str === 'string' && !!!str.trim()) || typeof str !== 'string';

export const isEmptyObject = obj =>
    !!!obj || obj.constructor !== Object || (Object.keys(obj).length === 0 && obj.constructor === Object);

export const createLocationString = ({ site, building, floor, room }) =>
    `${floor ?? ''}${!!room ? `-${room}` : ''} ${building ?? ''}${building ? ',' : ''} ${site ?? ''}`.trim();

export const isInvalidUUID = str => str?.length > 20 || !/^[a-z0-9]*$/.test(str);

export const isInvalidTeamSlug = str => isEmptyStr(str) || str.length > 10;
export const isInvalidTeamDisplayName = str => isEmptyStr(str) || str.length > 255;

/**
 * @param value {*}
 * @param format {string}
 * @param minDate {moment.MomentInput}
 * @param maxDate {moment.MomentInput}
 * @return {boolean}
 */
export const isValidDateRange = (value, format, minDate, maxDate) => {
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (typeof value !== 'string' || !value || !regex.test(value)) return true;

    const date = moment(value, format, true);
    return date.isValid() && date.isBetween(minDate, maxDate, 'day', '[]');
};
