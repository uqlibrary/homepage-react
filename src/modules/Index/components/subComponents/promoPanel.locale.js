/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
import React from 'react';

// import { AUTH_URL_LOGIN } from 'config';
// const loginUrl = `${AUTH_URL_LOGIN}?return=${window.btoa(window.location.href)}`;

export const promoPanel = {
    loggedout: {
        title: 'Open online!',
        content: (
            <div>
                <p>We are online to help you. Access the Library from home, including:</p>
                <ul>
                    <li><a href="https://web.library.uq.edu.au/library-services/students/course-reading-lists">Reading lists</a> for your courses</li>
                    <li><a href="https://guides.library.uq.edu.au/subject">Subject guides</a> for specialised resources in your subject area</li>
                    <li>Tips for <a href="https://web.library.uq.edu.au/library-services/students/how-study-online">studying online</a>.</li>
                </ul>
                <p><a href="https://web.library.uq.edu.au/contact-us">Contact us</a>, including on chat or by phone during business hours, if you need assistance.</p>
            </div>
        ),
    },
    loggedin: {
        title: 'Open online!',
        content: (
            <div>
                <p>We are online to help you. Access the Library from home, including:</p>
                <ul>
                    <li><a href="https://web.library.uq.edu.au/library-services/students/course-reading-lists">Reading lists</a> for your courses</li>
                    <li><a href="https://guides.library.uq.edu.au/subject">Subject guides</a> for specialised resources in your subject area</li>
                    <li>Tips for <a href="https://web.library.uq.edu.au/library-services/students/how-study-online">studying online</a>.</li>
                </ul>
                <p><a href="https://web.library.uq.edu.au/contact-us">Contact us</a>, including on chat or by phone during business hours, if you need assistance.</p>
            </div>
        ),
    },
};
