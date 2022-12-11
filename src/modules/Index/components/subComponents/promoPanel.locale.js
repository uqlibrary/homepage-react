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
                <p>Congratulations to everyone who has completed their Semester 2 courses and exams.</p>
                <p>For Summer Semester students, we are open on-campus and online:</p>
                <ul>
                    <li>Study in a range of comfortable spaces. Check our <a href="https://web.library.uq.edu.au/locations-hours/opening-hours">opening hours</a> for details.</li>
                    <li><a href="https://web.library.uq.edu.au/contact-us">Contact us</a> or visit an AskUs service point for assistance.</li>
                </ul>
            </div>
        ),
    },
    loggedin: {
        title: 'FallBack Loggedin',
        content: (
            <div>
                <p>Congratulations to everyone who has completed their Semester 2 courses and exams.</p>
                <p>For Summer Semester students, we are open on-campus and online:</p>
                <ul>
                    <li>Study in a range of comfortable spaces. Check our <a href="https://web.library.uq.edu.au/locations-hours/opening-hours">opening hours</a> for details.</li>
                    <li><a href="https://web.library.uq.edu.au/contact-us">Contact us</a> or visit an AskUs service point for assistance.</li>
                </ul>
            </div>
        ),
    },
};
