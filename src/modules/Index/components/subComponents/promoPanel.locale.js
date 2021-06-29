import React from 'react';

// import { AUTH_URL_LOGIN } from 'config';
// const loginUrl = `${AUTH_URL_LOGIN}?return=${window.btoa(window.location.href)}`;

export const promoPanel = {
    loggedout: {
        title: 'Library access',
        content: (
            <div>
                <p>For students enrolled to study in Semester Two your library membership is active, and you can use it through the mid-year break.</p>
                <p>Congratulations to our graduating students! You can apply for an alumni membership. The first year is free.</p>
                <p>Visit{' '}
                    <a href="https://web.library.uq.edu.au/library-services/services-uq-alumni">
                        services for alumni
                    </a>{' '}
                    for more information.
                </p>
            </div>
        ),
    },
    loggedin: {
        title: 'Library access',
        content: (
            <div>
                <p>For students enrolled to study in Semester Two your library membership is active, and you can use it through the mid-year break.</p>
                <p>Congratulations to our graduating students! You can apply for an alumni membership. The first year is free.</p>
                <p>Visit{' '}
                    <a href="https://web.library.uq.edu.au/library-services/services-uq-alumni">
                        services for alumni
                    </a>{' '}
                    for more information.
                </p>
            </div>
        ),
    },
};
