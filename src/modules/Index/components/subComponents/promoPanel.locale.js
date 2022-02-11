/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
import React from 'react';

// import { AUTH_URL_LOGIN } from 'config';
// const loginUrl = `${AUTH_URL_LOGIN}?return=${window.btoa(window.location.href)}`;

export const promoPanel = {
    loggedout: {
        title: 'Orientation',
        content: (
            <div>
                <p>Get to know your Library as part of <span style="white-space: nowrap;">O-Week</span> (14-18 Feb) and Connect Week (21-25 Feb).</p>
                <p>Add <a href="https://orientation.uq.edu.au/event-search/organiser/3778">Library orientation sessions</a> such as an introductory IT session or one of our social events to your Orientation Plan!</p>
                <p>Make the most of your <a href="https://life.uq.edu.au/orientation">orientation experience</a> with UQ Life.</p>
            </div>
        ),
    },
    loggedin: {
        title: 'Orientation',
        content: (
            <div>
                <p>Get to know your Library as part of <span style="white-space: nowrap;">O-Week</span> (14-18 Feb) and Connect Week (21-25 Feb). </p>
                <p>Add <a href="https://orientation.uq.edu.au/event-search/organiser/3778">Library orientation sessions</a> such as an introductory IT session or one of our social events to your Orientation Plan!</p>
                <p>Make the most of your <a href="https://life.uq.edu.au/orientation">orientation experience</a> with UQ Life.</p>
            </div>
        ),
    },
};
