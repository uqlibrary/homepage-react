import React from 'react';
import parse from 'html-react-parser';
import { fullPath } from 'config/routes';
import { getUserPostfix } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';

/* istanbul ignore next */
export const displayDownloadInstructions = (downloadInstructions, theClass) => {
    function addRelnoopenerNoreferrer(htmlString) {
        // Use regular expression to find all anchor tags (<a>)
        const regex = /<a([^>]+)>/g;
        return htmlString.replace(regex, (match, attributes) => {
            // Add the rel="noopener noreferrer" attribute
            return `<a ${attributes} rel="noopener noreferrer">`;
        });
    }

    const content = addRelnoopenerNoreferrer(downloadInstructions);

    return (
        <div data-testid="dlor-massaged-download-instructions" className={theClass}>
            {parse(content)}
        </div>
    );
};

export const getYoutubeUrlForPreviewEmbed = testUrlIn => {
    let testUrl;
    try {
        testUrl = new URL(testUrlIn);
    } catch (_) {
        return false;
    }

    let videoId;
    if (testUrl.protocol !== 'https:' && testUrl.protocol !== 'http:') {
        return false;
    }
    if (!testUrl.hostname.endsWith('youtube.com') && !testUrl.hostname.endsWith('youtu.be')) {
        return false;
    }
    const params = new URLSearchParams(testUrl.search);
    // remove any params that arent the video id
    for (const key of params.keys()) {
        if (key !== 'v') {
            params.delete(key);
        }
    }
    if (params.size === 0) {
        if (testUrl.pathname.length <= '/1234'.length) {
            // they've only entered the domain name, or the path isnt yet long enough to be a shorthand link
            return false;
        } else {
            // testUrlIn was short form, like https://youtube.com/MwHA9G72-wU
            videoId = testUrl.pathname.substring(1); // strip the '/' from the front
        }
    } else {
        videoId = params.get('v');
    }
    /* istanbul ignore next */
    if (!videoId) {
        return false;
    }

    const urlForPreview = new URL('https://www.youtube.com/');
    urlForPreview.search = '?v=' + videoId;
    const response = urlForPreview.toString();
    return response;
};

export const isPreviewableUrl = testUrlIn => {
    return !!getYoutubeUrlForPreviewEmbed(testUrlIn);
    // || !!getOTHERTYPEUrlForPreviewEmbed(testUrlIn)
};

export const validFileSizeUnits = ['KB', 'MB', 'GB', 'TB', 'PB'];

export function convertFileSizeToKb(fileSize, units) {
    const size = parseFloat(fileSize);
    const unit = units.toUpperCase();

    let sizeInKb;
    switch (unit) {
        case 'TB': // would be better to use array validFileSizeUnits
            sizeInKb = size * 1000 * 1000 * 1000;
            break;
        case 'GB':
            sizeInKb = size * 1000 * 1000;
            break;
        case 'MB':
            sizeInKb = size * 1000;
            break;
        case 'KB':
            sizeInKb = size;
            break;
        /* istanbul ignore next */
        default:
            /* istanbul ignore next */
            throw new Error(`Unsupported unit, ${unit}`);
    }

    return sizeInKb.toString();
}
export function getFileSizeString(fileSize, type) {
    if (fileSize === 0) {
        if (type === 'unit') {
            return validFileSizeUnits[0];
        } else if (type === 'amount') {
            return 0;
        } else {
            return '';
        }
    }
    let unitIndex = 0;
    let size = fileSize;

    while (size >= 1000 && unitIndex < validFileSizeUnits.length - 1) {
        size = (size / 1000).toFixed(1);
        unitIndex++;
    }
    if (type === 'unit') {
        return validFileSizeUnits[unitIndex];
    } else if (type === 'amount') {
        return size;
    } else {
        return `${size} ${validFileSizeUnits[unitIndex]}`;
    }
}

export function getDurationString(totalSeconds, format = 'MMMm SSSs') {
    if (totalSeconds === 0) {
        return '';
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return format.replace('MMM', minutes).replace('SSS', seconds);
}

export function getMinutesFromTotalSeconds(totalSeconds) {
    if (totalSeconds === 0) {
        return 0;
    }
    return Math.floor(totalSeconds / 60);
}

export function getSecondsFromTotalSeconds(totalSeconds) {
    if (totalSeconds === 0) {
        return 0;
    }
    return totalSeconds % 60;
}

export function getTotalSecondsFromMinutesAndSecond(minutes, seconds) {
    if (!minutes && !seconds) {
        return 0;
    }
    return (minutes || 0) * 1 * 60 + (seconds || 0) * 1;
}

export function isValidNumber(value, isZeroAllowed = false) {
    const numberValue = Number(value);

    if (!!isZeroAllowed) {
        return !isNaN(numberValue) && numberValue >= 0;
    }
    // Check if the value is a number and greater than zero
    return !isNaN(numberValue) && numberValue > 0;
}

export const toTitleCase = str => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getDlorViewPageUrl = uuid => {
    const userString = getUserPostfix();
    return `${fullPath}/digital-learning-hub/view/${uuid}${userString}`;
};

export const isValidUrl = testUrl => {
    let url;

    try {
        url = new URL(testUrl);
    } catch (_) {
        return false;
    }

    return (
        (url?.protocol === 'http:' || url?.protocol === 'https:') &&
        !!url?.hostname &&
        !!url?.hostname.includes('.') && // tld only domain names really dont happen, must be a dot!
        url?.hostname.length >= '12.co'.length
    );
};
