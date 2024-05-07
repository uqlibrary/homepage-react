import React from 'react';

export const displayDownloadInstructions = (downloadInstructions, theClass) => {
    const replaceMarkdownLinks = (match, linkText, url) => {
        return `<a rel="noreferrer noopener" href="${url}">${linkText}</a>`;
    };

    const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
    const content = downloadInstructions.replace(markdownLinkRegex, replaceMarkdownLinks).split('\n');

    return (
        <div data-testid="dlor-massaged-download-instructions" className={theClass}>
            {content.map((line, index) => (
                <p
                    key={index}
                    dangerouslySetInnerHTML={{
                        __html: line,
                    }}
                />
            ))}
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

export function formatFileSize(fileSize) {
    const units = ['KB', 'MB', 'GB', 'TB', 'PB'];
    let unitIndex = 0;
    let size = fileSize;

    while (size >= 1000 && unitIndex < units.length - 1) {
        size = (size / 1000).toFixed(1);
        unitIndex++;
    }
    return `${size} ${units[unitIndex]}`;
}

export function convertFileSizeStringToKb(fileSizeString) {
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
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return format.replace('MMM', minutes).replace('SSS', seconds);
}

export function convertDurationStringToSeconds(timeString, regexpFormat = /(\d+)\s*m\s*(\d+)\s*s/) {
    const match = timeString.match(regexpFormat);

    if (!match) {
        throw new Error('Invalid time string format ', timeString);
    }

    const minutes = Number(match[1]);
    const seconds = Number(match[2]);

    return minutes * 60 + seconds;
}
