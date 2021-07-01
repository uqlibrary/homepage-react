/* eslint-disable max-len */
import React from 'react';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
/*

NOTE:
- text can be either plain text, eg text: 'Some text to display' or
- text can be formatted HTML text, eg
    text: (<div>Click here to search google: <a href='google.com'>search google</a></div>)
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
/* eslint-disable max-len */
export default {
    pages: {
        index: {
            title: 'Homepage',
        },
        contact: {
            title: 'Contact UQ Library',
            children: (
                <StandardCard>
                    <h3>Awaiting content</h3>
                    <p>Content will go here.</p>
                </StandardCard>
            ),
        },
        admin: {
            masquerade: {
                title: 'Masquerade',
            },
            alerts: {
                title: 'Alerts',
            },
        },
        secureCollection: {
            title: 'Secure File Collection',
        },
        courseresources: {
            title: 'Course resources',
        },
        paymentReceipt: {
            title: 'Payment receipt',
        },
        bookExamBooth: {
            title: 'Book an exam booth in the UQ Centre',
        },
    },
};
