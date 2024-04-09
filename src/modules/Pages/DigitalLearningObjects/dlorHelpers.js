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

const isPrevieweableUrl = testUrl => {
    console.log('testUrl=', testUrl);
    try {
        const url = new URL(testUrl);
        const isPrevieweable = url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com';
        // eventually we may have multiple item type that can have a preview box...
        return !!isPrevieweable;
    } catch (_) {
        return false;
    }
};

export const getYoutubeViewableUrl = testUrlIn => {
    if (!isPrevieweableUrl(testUrlIn)) {
        return false;
    }

    let oldUrl;
    try {
        oldUrl = new URL(testUrlIn);
    } catch (_) {
        return false;
    }

    let youtubeId;
    if (oldUrl.protocol !== 'https:' && oldUrl.protocol !== 'http:') {
        return false;
    }
    const params = new URLSearchParams(oldUrl.search);
    if (params.size === 0) {
        if (oldUrl.pathname.length <= '/1234'.length) {
            // they've only entered the domain name
            return false;
        } else {
            /* testUrlIn was short form, like https://youtu.be/MwHA9G72-wU */
            youtubeId = oldUrl.pathname.substring(1); // strip the '/' from the front
        }
    } else {
        youtubeId = params.get('v');
    }
    if (!youtubeId) {
        return false;
    }

    const url = new URL('https://www.youtube.com/');
    url.search = '?v=' + youtubeId;
    return url.toString();
};
