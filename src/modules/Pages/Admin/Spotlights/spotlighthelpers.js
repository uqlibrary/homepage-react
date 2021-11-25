import { default as locale } from './spotlightsadmin.locale';

const moment = require('moment');

export function formatDate(dateString, dateFormat = 'YYYY-MM-DD HH:mm:ss') {
    const newMoment = new moment(dateString);
    return newMoment.format(dateFormat);
}

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

export const addConstantsToDisplayValues = (displayText, imageWidthIn, imageHeightIn, ratio) => {
    return displayText
        .replace('[WIDTH]', imageWidthIn)
        .replace('[HEIGHT]', imageHeightIn)
        .replace('[RATIO]', ratio)
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

// https://stackoverflow.com/a/5306832/1246313
// let hasDraggedAndDropped = false;
/* istanbul ignore next */
export function moveItemInArray(arr, oldIndex, newIndex) {
    if (newIndex >= arr.length) {
        let k = newIndex - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr; // for testing
}

// this is a bit of a misnomer - we dont want them to go smaller than this because that will make the image fuzzy
// when the spotlights are occupying the entire width of the screen (ipad view)
// but the bigger than this they get, the longer the page will take to load
export const ImageSizeIsPoor = (imageWidthIn, imageHeightIn) => {
    const ratio = (imageWidthIn / imageHeightIn).toFixed(2);
    return (
        imageWidthIn < locale.form.upload.ideal.width - locale.form.upload.heightWidthFlex ||
        imageWidthIn > locale.form.upload.ideal.width + locale.form.upload.heightWidthFlex ||
        /* istanbul ignore next */
        imageHeightIn < locale.form.upload.ideal.height - locale.form.upload.heightWidthFlex ||
        /* istanbul ignore next */
        imageHeightIn > locale.form.upload.ideal.height + locale.form.upload.heightWidthFlex ||
        /* istanbul ignore next */
        ratio < locale.form.upload.minRatio ||
        /* istanbul ignore next */
        ratio > locale.form.upload.maxRatio
    );
};
