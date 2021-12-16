/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
import React from 'react';

// import { AUTH_URL_LOGIN } from 'config';
// const loginUrl = `${AUTH_URL_LOGIN}?return=${window.btoa(window.location.href)}`;

export const promoPanel = {
    loggedout: {
        title: 'Holiday hours',
        content: (
            <div>
                <p>We are closed for the Christmas break from Thursday 23 December and will reopen on Tuesday 4 January 2022.</p>
                <p>Selected 24/7 spaces are available through the break with your UQ ID card. All other libraries, collections, and our library services will be closed.</p>
                <p>Visit <a href="https://web.library.uq.edu.au/blog/2021/11/library-hours-over-christmas?utm_source=homepage&amp;utm_medium=web&amp;utm_id=christmas21">Library hours over Christmas</a> for more information.</p>
                <p>Have a happy and safe holiday!</p>
            </div>
        ),
    },
    loggedin: {
        title: 'Holiday hours',
        content: (
            <div>
                <p>We are closed for the Christmas break from Thursday 23 December and will reopen on Tuesday 4 January 2022.</p>
                <p>Selected 24/7 spaces are available through the break with your UQ ID card. All other libraries, collections, and our library services will be closed.</p>
                <p>Visit <a href="https://web.library.uq.edu.au/blog/2021/11/library-hours-over-christmas?utm_source=homepage&amp;utm_medium=web&amp;utm_id=christmas21">Library hours over Christmas</a> for more information.</p>
                <p>Have a happy and safe holiday!</p>
            </div>
        ),
    },
};
