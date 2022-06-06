/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
import React from 'react';

// import { AUTH_URL_LOGIN } from 'config';
// const loginUrl = `${AUTH_URL_LOGIN}?return=${window.btoa(window.location.href)}`;

export const promoPanel = {
    loggedout: {
        title: 'Exams',
        content: (
            <div>
                <p><a href="https://web.library.uq.edu.au/contact-us">Contact us</a> for online exam technical support using online chat or by phone.</p>
                <p>We're available from 7am to 8pm between 9 and 21 June (excluding Sundays).</p>
                <ul>
                    <li><a href="https://web.library.uq.edu.au/library-services/students/prepare-online-exam-success">Prepare for online exam success</a></li>
                    <li><a href="https://life.uq.edu.au/study-spaces">Study spaces</a> are available in the library and on-campus.</li>
                </ul>
                <p>Good luck with your exams!</p>
            </div>
        ),
    },
    loggedin: {
        title: 'Exams',
        content: (
            <div>
                <p><a href="https://web.library.uq.edu.au/contact-us">Contact us</a> for online exam technical support using online chat or by phone.</p>
                <p>We're available from 7am to 8pm between 9 and 21 June (excluding Sundays).</p>
                <ul>
                    <li><a href="https://web.library.uq.edu.au/library-services/students/prepare-online-exam-success">Prepare for online exam success</a></li>
                    <li><a href="https://life.uq.edu.au/study-spaces">Study spaces</a> are available in the library and on-campus.</li>
                </ul>
                <p>Good luck with your exams!</p>
            </div>
        ),
    },
};
