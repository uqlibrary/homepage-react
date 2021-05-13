import React from 'react';

import { AUTH_URL_LOGIN } from 'config';

const loginUrl = `${AUTH_URL_LOGIN}?return=${window.btoa(window.location.href)}`;

export const promoPanel = {
    loggedout: {
        title: 'New home page!',
        content: (
            <div>
                <span>We have updated the home page with a great new look and feel.</span>
                <p>
                    <a href={loginUrl}>Log in now</a> for a brand new personalised experience:
                </p>
                <ul>
                    <li>Set your campus</li>
                    <li>Top-up your print balance</li>
                    <li>Get your course resources &amp; more</li>
                </ul>
                <span>
                    <a href="https://web.library.uq.edu.au/blog/2021/01/discover-new-library-home-page">
                        Discover the new home page!
                    </a>
                </span>
            </div>
        ),
    },
    loggedin: {
        title: 'New home page!',
        content: (
            <div>
                <span>
                    We have personalised your home page just for you. Your page may contain additional features
                    depending on who you are.
                </span>
                <ul>
                    <li>Get your course resources (UQ students)</li>
                    <li>Set your campus to sort library hours &amp; computer availability</li>
                    <li>Top-up your print balance</li>
                    <li>Click the My Library button for links to library services</li>
                </ul>
                <span>
                    <a href="https://web.library.uq.edu.au/blog/2021/01/discover-new-library-home-page">
                        More about your new home page!
                    </a>
                </span>
            </div>
        ),
    },
};
