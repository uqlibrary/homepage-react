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
                <p>We are closed for the Christmas break from Friday 23 December and will reopen on Tuesday 3 January 2023.</p>
                <p>Selected 24/7 spaces and collections are available through the break with your UQ ID card. All other libraries, collections, and our library services will be closed.</p>
                <p>Visit <a href="https://web.library.uq.edu.au/blog/2022/12/library-hours-christmas-holidays?utm_source=homepage&amp;utm_medium=web&amp;utm_campaign=christmas22">Library hours over Christmas</a> for more information.</p>
                <p>Have a happy and safe holiday!</p>
            </div>
        ),
    },
    loggedin: {
        title: 'Holiday hours',
        content: (
            <div>
                <p>We are closed for the Christmas break from Friday 23 December and will reopen on Tuesday 3 January 2023.</p>
                <p>Selected 24/7 spaces and collections are available through the break with your UQ ID card. All other libraries, collections, and our library services will be closed.</p>
                <p>Visit <a href="https://web.library.uq.edu.au/blog/2022/12/library-hours-christmas-holidays?utm_source=homepage&amp;utm_medium=web&amp;utm_campaign=christmas22">Library hours over Christmas</a> for more information.</p>
                <p>Have a happy and safe holiday!</p>
            </div>
        ),
    },
};
