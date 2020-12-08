import React from 'react';

export const promoPanel = {
    loggedout: {
        title: 'Welcome to the Library!',
        content: (
            <div>
                <p>Try the new My Library for a great personalised experience.</p>
                <ul>
                    <li>Set your campus</li>
                    <li>Get your course resources &amp; more</li>
                    <li>Top-up your print balance</li>
                </ul>
                <p>
                    <a href="/">Log in now!</a>
                </p>
            </div>
        ),
    },
    loggedin: {
        title: 'Welcome to the Library!',
        content: (
            <div>
                <p>So glad you took the time to log in - all the cool stuff is here!</p>
                <p>Here are some useful links you might like:</p>
                <ul>
                    <li>
                        <a href="/">A bullet point with a link</a>
                    </li>
                    <li>A second point that is just text.</li>
                </ul>
                <p>We hope you like our site.</p>
            </div>
        ),
    },
};
