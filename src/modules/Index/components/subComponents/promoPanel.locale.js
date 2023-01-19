/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
import React from 'react';

// import { AUTH_URL_LOGIN } from 'config';
// const loginUrl = `${AUTH_URL_LOGIN}?return=${window.btoa(window.location.href)}`;

export const promoPanel = {
    loggedout: {
        title: 'Fallback Panel',
        content: (
            <div>
                <p>The Library is open during Summer Semester.</p>
                <p>Enjoy a range of comfortable study spaces. Access 24/7 spaces and collections with your UQ ID card. Check our <a href="https://web.library.uq.edu.au/locations-hours/opening-hours">opening hours</a> for details.</p>
                <p><a href="https://web.library.uq.edu.au/contact-us">Contact us</a> or visit an AskUs service point for assistance.</p>
            </div>
        ),
    },
    loggedin: {
        title: 'FallBack Loggedin',
        content: (
            <div>
                <p>The Library is open during Summer Semester.</p>
                <p>Enjoy a range of comfortable study spaces. Access 24/7 spaces and collections with your UQ ID card. Check our <a href="https://web.library.uq.edu.au/locations-hours/opening-hours">opening hours</a> for details.</p>
                <p><a href="https://web.library.uq.edu.au/contact-us">Contact us</a> or visit an AskUs service point for assistance.</p>
            </div>
        ),
    },
};
