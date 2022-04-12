/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
import React from 'react';

// import { AUTH_URL_LOGIN } from 'config';
// const loginUrl = `${AUTH_URL_LOGIN}?return=${window.btoa(window.location.href)}`;

export const promoPanel = {
    loggedout: {
        title: 'Assignment resources',
        content: (
            <div>
                <p>Working on an assignment? Check out these helpful resources:</p>
                <ul>
                    <li><a href="https://web.library.uq.edu.au/research-tools-techniques/digital-essentials/write-cite-submit">Write, cite and submit</a> &ndash; advice on planning, referencing and submitting your assignment</li>
                    <li><a href="https://guides.library.uq.edu.au/referencing">Referencing style guides</a> &ndash; get your references right with our style guides</li>
                    <li><a href="https://guides.library.uq.edu.au/subject">Subject guides</a> &ndash; find articles and specialised resources for your subject.</li>
                </ul>
            </div>
        ),
    },
    loggedin: {
        title: 'Assignment resources',
        content: (
            <div>
                <p>Working on an assignment? Check out these helpful resources:</p>
                <ul>
                    <li><a href="https://web.library.uq.edu.au/research-tools-techniques/digital-essentials/write-cite-submit">Write, cite and submit</a> &ndash; advice on planning, referencing and submitting your assignment</li>
                    <li><a href="https://guides.library.uq.edu.au/referencing">Referencing style guides</a> &ndash; get your references right with our style guides</li>
                    <li><a href="https://guides.library.uq.edu.au/subject">Subject guides</a> &ndash; find articles and specialised resources for your subject.</li>
                </ul>
            </div>
        ),
    },
};
