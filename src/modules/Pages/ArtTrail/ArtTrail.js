import React from 'react';

import locale from './artTrail.locale';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from '../../SharedComponents/Toolbox/StandardCard';

const openSubfolder = () => {
    // Ensure current path ends with a slash so the browser treats it as a directory
    const currentDir = window.location.href.endsWith('/') ? window.location.href : `${window.location.href}/`;

    const targetUrl = new URL('app', currentDir).href;
    console.log('Opening subfolder URL:', targetUrl);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
};

export const ArtTrail = () => {
    return (
        <StandardPage title={locale.title}>
            <StandardCard
                standardCardId="art-trail-page"
                title="Welcome to the University of Queensland Library Art Trail"
            >
                <p>Some content would go here.</p>

                <button onClick={openSubfolder}>Launch webapp</button>
            </StandardCard>
        </StandardPage>
    );
};

export default ArtTrail;
