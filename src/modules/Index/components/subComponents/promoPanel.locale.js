import React from 'react';

// import { AUTH_URL_LOGIN } from 'config';
// const loginUrl = `${AUTH_URL_LOGIN}?return=${window.btoa(window.location.href)}`;

export const promoPanel = {
    loggedout: {
        title: 'Exams',
        content: (
            <div>
                <p>
                    <a href="https://web.library.uq.edu.au/contact-us">Contact us</a> for online exam technical support.
                    The service is available 7am-9pm on exam days between 5 and 18 June.
                </p>
                <p>
                    <a href="https://life.uq.edu.au/study-spaces">Study spaces</a> are available in the Library and
                    on-campus.
                </p>
                <p>Good luck with your exams!</p>
            </div>
        ),
    },
    loggedin: {
        title: 'New home page!',
        content: (
            <div>
                <p>
                    <a href="https://web.library.uq.edu.au/contact-us">Contact us</a> for online exam technical support.
                    The service is available 7am-9pm on exam days between 5 and 18 June.
                </p>
                <p>
                    <a href="https://life.uq.edu.au/study-spaces">Study spaces</a> are available in the Library and
                    on-campus.
                </p>
                <p>Good luck with your exams!</p>
            </div>
        ),
    },
};
