export const capitaliseLeadingChar = text =>
    text.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, match => match.toUpperCase());

export const isEmptyStr = str =>
    str === null || str === undefined || (typeof str === 'string' && !!!str.trim()) || typeof str !== 'string';

export const isEmptyObject = obj =>
    !!!obj || obj.constructor !== Object || (Object.keys(obj).length === 0 && obj.constructor === Object);

export const createLocationString = ({ site, building, floor, room }) =>
    `${floor ?? ''}${!!room ? `-${room}` : ''} ${building ?? ''}${building ? ',' : ''} ${site ?? ''}`.trim();

export const isInvalidUUID = str => str?.length > 20 || !/^[a-z0-9]*$/.test(str);
