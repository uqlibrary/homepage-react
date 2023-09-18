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
                <p>Get to know your Library this O-Week (13–17 Feb) and during Connect Week (20–24 Feb)!</p>
                <p>Add <a href="https://orientation.uq.edu.au/event-search/organiser/3778">Library orientation sessions</a> to your Orientation Plan:</p>
                <ul>
                    <li>Join a library tour</li>
                    <li>Enjoy a Library Meet and Greet</li>
                    <li>Attend 1-hour info sessions – Introduction to Learn.UQ (Blackboard) or IT essentials for UQ students.</li>
                </ul>
                <p>Discover more <a href="https://life.uq.edu.au/orientation">orientation experiences</a> with UQ Life.</p>
            </div>
        ),
    },
    loggedin: {
        title: 'Orientation',
        content: (
            <div>
                <p>Get to know your Library this O-Week (13–17 Feb) and during Connect Week (20–24 Feb)!</p>
                <p>Add <a href="https://orientation.uq.edu.au/event-search/organiser/3778">Library orientation sessions</a> to your Orientation Plan:</p>
                <ul>
                    <li>Join a library tour</li>
                    <li>Enjoy a Library Meet and Greet</li>
                    <li>Attend 1-hour info sessions – Introduction to Learn.UQ (Blackboard) or IT essentials for UQ students.</li>
                </ul>
                <p>Discover more <a href="https://life.uq.edu.au/orientation">orientation experiences</a> with UQ Life.</p>
            </div>
        ),
    },
    apiError: {
        title: 'Message not found',
        content: (
            <div style={{ lineHeight: 24, margin: 0 }}>
                <p>We can’t display your library service message right now. Please refresh your browser or try again later.</p>
            </div>
        ),
    },
};
