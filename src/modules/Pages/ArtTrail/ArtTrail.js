import React from 'react';

const openSubfolder = () => {
    // Ensure current path ends with a slash so the browser treats it as a directory
    const currentDir = window.location.href.endsWith('/') ? window.location.href : `${window.location.href}/`;

    const targetUrl = new URL('app', currentDir).href;
    console.log('Opening subfolder URL:', targetUrl);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
};

export const ArtTrail = () => {
    return (
        <div data-testid="art-trail-page">
            <h1>Art Trail</h1>
            <p>
                <button onClick={openSubfolder}>Launch webapp</button>
            </p>
        </div>
    );
};

export default ArtTrail;
