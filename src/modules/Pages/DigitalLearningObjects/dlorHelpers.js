import React from 'react';
import parse from 'html-react-parser';
import { fullPath } from 'config/routes';

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
        default:
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

// export function convertFileSizeStringToKb(fileSizeString) {
//     const sizeRegex = /^(\d+(?:\.\d+)?)\s*([KMGT]B)$/i;
//     const match = fileSizeString.match(sizeRegex);
//
//     if (!match) {
//         throw new Error(`convertFileSizeStringToKb:Invalid size string "${fileSizeString}"`);
//     }
//
//     const size = parseFloat(match[1]);
//     const unit = match[2].toUpperCase();
//
//     let sizeInKb;
//     switch (unit) {
//         case 'TB':
//             sizeInKb = size * 1000 * 1000 * 1000;
//             break;
//         case 'GB':
//             sizeInKb = size * 1000 * 1000;
//             break;
//         case 'MB':
//             sizeInKb = size * 1000;
//             break;
//         case 'KB':
//             sizeInKb = size;
//             break;
//         default:
//             throw new Error('Unsupported unit');
//     }
//
//     return sizeInKb.toString();
// }

export function convertFileSizeValuesToKb(fileSizeString) {
    const sizeRegex = /^(\d+(?:\.\d+)?)\s*([KMGT]B)$/i;
    const match = fileSizeString.match(sizeRegex);

    if (!match) {
        throw new Error(`convertFileSizeStringToKb:Invalid size string "${fileSizeString}"`);
    }

    const size = parseFloat(match[1]);
    const unit = match[2].toUpperCase();

    let sizeInKb;
    switch (unit) {
        case 'TB':
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
        default:
            throw new Error('Unsupported unit');
    }

    return sizeInKb.toString();
}

export function getDurationString(totalSeconds, format = 'MMMm SSSs') {
    if (totalSeconds === 0) {
        return '';
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return format.replace('MMM', minutes).replace('SSS', seconds);
}

export function getMinutesAndSecondFromTotalSeconds(totalSeconds) {
    if (totalSeconds === 0) {
        return { minutes: 0, seconds: 0 };
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    console.log('getMinutesAndSecondFromTotalSeconds from ', totalSeconds, 'get', minutes, seconds);
    return { minutes: minutes, seconds: seconds };
}

export function getMinutesFromTotalSeconds(totalSeconds) {
    if (totalSeconds === 0) {
        return { minutes: 0, seconds: 0 };
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    console.log('getMinutesFromTotalSeconds from ', totalSeconds, 'get', minutes, seconds);
    return minutes;
}

export function getSecondsFromTotalSeconds(totalSeconds) {
    if (totalSeconds === 0) {
        return { minutes: 0, seconds: 0 };
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    console.log('getSecondsFromTotalSeconds from ', totalSeconds, 'get', minutes, seconds);
    return seconds;
}

export function getTotalSecondsFromMinutesAndSecond(minutes, seconds) {
    if (!minutes && !seconds) {
        return 0;
    }
    const totalSeconds = (minutes || 0) * 1 * 60 + (seconds || 0) * 1;
    console.log('getTotalSecondsFromMinutesAndSecond from ', minutes, seconds, 'get', totalSeconds);
    return totalSeconds;
}

// export function convertDurationStringToSeconds(timeString, regexpFormat = /(\d+)\s*m\s*(\d+)\s*s/) {
//     const match = timeString.match(regexpFormat);
//
//     if (!match) {
//         throw new Error('Invalid time string format ', timeString);
//     }
//
//     const minutes = Number(match[1]);
//     const seconds = Number(match[2]);
//
//     return minutes * 60 + seconds;
// }

export function isValidNumber(value) {
    const numberValue = Number(value);

    // Check if the value is a number and greater than zero
    return !isNaN(numberValue) && numberValue > 0;
}

export const toTitleCase = str => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getDlorViewPageUrl = uuid => `${fullPath}/digital-learning-hub/view/${uuid}`;
