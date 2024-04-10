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
    return urlForPreview.toString();
};
export const getVimeoUrlForPreviewEmbed = testUrlIn => {
    let testUrl;
    try {
        testUrl = new URL(testUrlIn.replace(/\\\//g, '/'));
    } catch (_) {
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
        return false;
    }

    const urlForPreview = new URL('https://vimeo.com');
    urlForPreview.pathname = `/${videoId}`;
    return urlForPreview.toString();
};

export const isPreviewableUrl = testUrlIn => {
    return !!(getYoutubeUrlForPreviewEmbed(testUrlIn) || getVimeoUrlForPreviewEmbed(testUrlIn));
};
