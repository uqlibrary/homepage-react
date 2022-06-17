/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
import React from 'react';

// import { AUTH_URL_LOGIN } from 'config';
// const loginUrl = `${AUTH_URL_LOGIN}?return=${window.btoa(window.location.href)}`;

export const promoPanel = {
    loggedout: {
        title: 'Mid-year break',
        content: (
            <div>
                <p>Congratulations to our new graduates!</p>
                <p>         
                    Visit our <a href="https://web.library.uq.edu.au/library-services/services-for-uq-alumni">services for alumni</a> page to apply 
                    for your New Graduate Alumni Membership (free for the first year) and for resources available to alumni members.
                </p>
                <p>
                    To our returning students, you have access to the library throughout the mid-semester break if you're enrolled for Semester Two. 
                </p>
                <p>Enjoy your break and we'll see you in July!</p>   
            </div>
        ),
    },
    loggedin: {
        title: 'Mid-year break',
        content: (
            <div>
                <p>Congratulations to our new graduates!</p>
                <p>         
                    Visit our <a href="https://web.library.uq.edu.au/library-services/services-for-uq-alumni">services for alumni</a> page to apply 
                    for your New Graduate Alumni Membership (free for the first year) and for resources available to alumni members.
                </p>
                <p>
                    To our returning students, you have access to the library throughout the mid-semester break if you're enrolled for Semester Two. 
                </p>
                <p>Enjoy your break and we'll see you in July!</p>   
            </div>
        ),
    },
};
