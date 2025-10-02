import React from 'react';
import { pathConfig } from 'config/pathConfig';

/*

NOTE:
- text can be either plain text, eg text: 'Some text to display' or
- text can be formatted HTML text, eg text: (
    <div>Click here to search google: <a href='google.com'>search google</a></div>
)
IMPORTANT: if currently text contains placeholders, eg any characters in square brackets,
eg [noOfResults] it cannot be formatted with HTML tags’

- help objects have the following shape:
help: {
    title: 'About these metrics',
    text: (<div></div>),
    buttonLabel: 'CLOSE'
}
- text can be plain or formatted HTML component with links/tags/etc
- if help is not required, delete help: {} fully (including closing '},')

*/

export default {
    global: {
        title: `UQ Library ${process.env.TITLE_SUFFIX || ''}`,
        appTitle: (
            <a
                href={`${pathConfig.index}`}
                className="appTitle"
                title="Click to return to the Library home page"
                style={{ color: '#FFFFFF' }}
            >
                UQ Library {process.env.TITLE_SUFFIX || ''}
            </a>
        ),
        logo: {
            // image: 'https://static.uq.net.au/v2/logos/corporate/uq-logo-white.svg',
            label: 'The University of Queensland',
            link: 'https://www.uq.edu.au',
        },
        loading: 'Loading',
        errorMessages: {
            400: {
                message: 'There was a problem with the input.',
                status: 400,
            },
            401: {
                message:
                    'You are not authorised to access the requested information. Please contact askus@library.uq.edu.au or try again later.',
                status: 401,
            },
            403: {
                message: 'Your session expired, please login again to continue.',
                status: 403,
            },
            404: {
                message: 'The requested page could not be found.',
                status: 404,
            },
            410: {
                message: 'This work has been deleted.',
                status: 410,
            },
            // deliberate trivial wording differences for debugging
            422: {
                message:
                    'An Error has occurred during this request and the request cannot be processed. Please contact webmaster@library.uq.edu.au or try again later.',
                status: 500,
            },
            500: {
                message:
                    'An error has occurred during the request and this request cannot be processed. Please contact webmaster@library.uq.edu.au or try again later.',
                status: 500,
            },
            generic:
                'An error has occurred during the request and the request cannot be processed. Please contact webmaster@library.uq.edu.au or try again later.',
            genericAlternate:
                "An error has occurred during this request and this request can't be processed. Please contact webmaster@library.uq.edu.au or try again later.",
        },
    },
    campuses: {
        STLUC: 'St Lucia',
        GATTN: 'Gatton',
        IPSWC: 'Ipswich',
        HERST: 'Herston',
        DUTPK: 'Dutton Park',
    },
};
