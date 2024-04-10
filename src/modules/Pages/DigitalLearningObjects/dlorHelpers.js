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

export const getYoutubeViewableUrl = testUrlIn => {
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
    if (!testUrl.hostname.endsWith('youtube.com')) {
        return false;
    }
    const params = new URLSearchParams(testUrl.search);
    if (params.size === 0) {
        if (testUrl.pathname.length <= '/1234'.length) {
            // they've only entered the domain name, or the path isnt yet long enough to be a shorthand link
            return false;
        } else {
            /* testUrlIn was short form, like https://youtube.com/MwHA9G72-wU */
            videoId = testUrl.pathname.substring(1); // strip the '/' from the front
        }
    } else {
        videoId = params.get('v');
    }
    if (!videoId) {
        return false;
    }

    const url = new URL('https://www.youtube.com/');
    url.search = '?v=' + videoId;
    return url.toString();
};
export const getVimeoViewableUrl = testUrlIn => {
    let testUrl;
    try {
        testUrl = new URL(testUrlIn);
    } catch (_) {
        console.log('vimeo, caught false', testUrlIn);
        return false;
    }

    if (testUrl.protocol !== 'https:' && testUrl.protocol !== 'http:') {
        return false;
    }
    if (!testUrl.hostname.endsWith('vimeo.com')) {
        return false;
    }
    if (testUrl.pathname.startsWith('/video') && testUrl.pathname.length <= '/video/1234'.length) {
        // they've only entered the domain name, or the path isnt yet long enough to be a link
        return false;
    }
    if (testUrl.pathname.length <= '/1234'.length) {
        // they've only entered the domain name, or the path isn't yet long enough to be a link
        return false;
    }
    const videoId = testUrl.pathname.substring(1); // strip the '/' from the front
    if (!videoId) {
        console.log('vimeo, videoId=', videoId);
        return false;
    }

    const finalUrl = new URL('https://vimeo.com');
    finalUrl.pathname = `/${videoId}`;
    return finalUrl.toString();
};

export const isPreviewableUrl = testUrlIn => {
    return !!(getYoutubeViewableUrl(testUrlIn) || getVimeoViewableUrl(testUrlIn));
};
