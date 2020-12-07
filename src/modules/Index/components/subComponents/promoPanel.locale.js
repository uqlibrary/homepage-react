import React from 'react';

export const promoPanel = {
    loggedout: {
        title: 'Welcome to the Library!',
        content: (
            <div>
                <p>Not logged in? You should try the logged in experience - it rocks!</p>
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
