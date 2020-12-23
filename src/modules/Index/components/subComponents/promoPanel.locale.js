import React from 'react';

import { AUTH_URL_LOGIN } from 'config';

const loginUrl = `${AUTH_URL_LOGIN}?url=${window.btoa(window.location.href)}`;

export const promoPanel = {
    loggedout: {
        title: 'New My Library!',
        content: (
            <div>
                <p>Try the new My Library for a great personalised experience.</p>
                <ul>
                    <li>Set your campus</li>
                    <li>Get your course resources &amp; more</li>
                    <li>Top-up your print balance</li>
                </ul>
                <p>
                    <a href={loginUrl}>Log in now!</a>
                </p>
            </div>
        ),
    },
    loggedin: {
        title: 'New My Library!',
        content: (
            <div>
                <p>Try the new My Library for a great personalised experience.</p>
                <p>Depending on your user type, you will be able to:</p>
                <ul>
                    <li>Set your campus</li>
                    <li>Get your course resources &amp; more</li>
                    <li>Top-up your print balance</li>
                </ul>
            </div>
        ),
    },
};
