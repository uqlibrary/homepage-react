/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
import React from 'react';

// import { AUTH_URL_LOGIN } from 'config';
// const loginUrl = `${AUTH_URL_LOGIN}?return=${window.btoa(window.location.href)}`;

export const promoPanel = {
    loggedout: {
        title: 'Message not found',
        content: (
            <div>
                <p>We can’t display your library service message right now. Please refresh your browser or try again later.</p>
            </div>
        ),
    },
    loggedin: {
        title: 'Message not found',
        content: (
            <div>
                <p>We can’t display your library service message right now. Please refresh your browser or try again later.</p>
            </div>
        ),
    },
};
