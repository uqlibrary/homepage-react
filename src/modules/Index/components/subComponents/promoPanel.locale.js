/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
import React from 'react';

// import { AUTH_URL_LOGIN } from 'config';
// const loginUrl = `${AUTH_URL_LOGIN}?return=${window.btoa(window.location.href)}`;

export const promoPanel = {
    loggedout: {
        title: 'Services for students',
        content: (
            <div>
                <p>Visit our <a href="https://web.library.uq.edu.au/library-services/services-students?utm_source=homepage&utm_medium=promobox&utm_campaign=services-for-students">services for students</a> page to make the most of your library this semester:</p>
                <ul>
                    <li>Access learning resources for your courses, our Assignment Planner tool, and subject and referencing guides.</li>
                    <li>Build new skills with our Digital Essentials modules and discover in-person and online (LinkedIn Learning) training options.</li>
                </ul>
            </div>
        ),
    },
    loggedin: {
        title: 'Services for students',
        content: (
            <div>
                <p>Visit our <a href="https://web.library.uq.edu.au/library-services/services-students?utm_source=homepage&utm_medium=promobox&utm_campaign=services-for-students">services for students</a> page to make the most of your library this semester:</p>
                <ul>
                    <li>Access learning resources for your courses, our Assignment Planner tool, and subject and referencing guides.</li>
                    <li>Build new skills with our Digital Essentials modules and discover in-person and online (LinkedIn Learning) training options.</li>
                </ul>
            </div>
        ),
    },
};
