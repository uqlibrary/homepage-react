/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
import React from 'react';

// import { AUTH_URL_LOGIN } from 'config';
// const loginUrl = `${AUTH_URL_LOGIN}?return=${window.btoa(window.location.href)}`;

export const promoPanel = {
    loggedout: {
        title: 'Welcome to UQ!',
        content: (
            <div>
                <p>
                    <a href="https://life.uq.edu.au/orientation">
                        Celebrate Orientation 
                    </a>{' '}
                    during O-Week (19-23 July) and Connect Week (26-30 July).
                </p>
                <p>Plan your orientation experience, attend great events, get to know your campus (and Library) and get connected to your UQ Life!</p>
                <p>Get involved in{' '} 
                    <a href="https://web.library.uq.edu.au/blog/2021/07/get-involved-o-week?utm_source=homepage&utm_medium=promobox&utm_campaign=orientation-sem2-21">   
                       O-Week at the Library  
                    </a>{' '}
                    for library tours, training sessions, Koala Competition and more!
                </p>
            </div>
        ),
    },
    loggedin: {
        title: 'Welcome to UQ!',
        content: (
            <div>
                <p>
                    <a href="https://life.uq.edu.au/orientation">   
                        Celebrate Orientation 
                    </a>{' '}
                    during O-Week (19-23 July) and Connect Week (26-30 July).
                </p>
                <p>Plan your orientation experience, attend great events, get to know your campus (and Library) and get connected to your UQ Life!</p>
                <p>Get involved in{' '} 
                    <a href="https://web.library.uq.edu.au/blog/2021/07/get-involved-o-week?utm_source=homepage&utm_medium=promobox&utm_campaign=orientation-sem2-21">   
                       O-Week at the Library  
                    </a>{' '}
                    for library tours, training sessions, Koala Competition and more!
                </p>
            </div>
        ),
    },
};
