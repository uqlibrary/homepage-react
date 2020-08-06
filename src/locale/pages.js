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
            title: 'eSpace',
        },
        contact: {
            title: 'Contact UQ Library',
            children: (
                <StandardCard>
                    <h3>General Enquiries</h3>
                    <p>
                        Tel: 07 334 69775 <br />
                        Email: <a href="mailto:espace@library.uq.edu.au">espace@library.uq.edu.au</a>
                        <br />
                    </p>
                    <h3>Staff contact</h3>
                    <p>
                        Andrew Heath
                        <br />
                        Manager, UQ Library
                        <br />
                        Tel: 07 334 69981
                        <br />
                        Email: <a href="mailto:a.heath@library.uq.edu.au">a.heath@library.uq.edu.au</a>
                        <br />
                    </p>
                    <h3>About UQ Library</h3>
                    The University of Queensland's institutional repository, UQ Library, aims to create global and
                    accessibility of UQ’s scholarly research by:
                    <ul>
                        <li>Enhancing discovery of UQ research via search engines such as Google and Trove</li>
                        <li>
                            Allowing researchers to deposit publications, datasets and open access materials and to view
                            publication metrics
                        </li>
                        <li>
                            Maintaining a complete and accurate work of all UQ research publications and research data
                            sets that feeds into central UQ systems including UQ Researchers and the Academic Portal
                        </li>
                        <li>
                            Enabling government reporting such as Australian Research Council’s Excellence in Research
                            for Australia and the Engagement and Impact Assessment
                        </li>
                        <li>
                            Supporting the deposit of open access publications to make UQ research globally accessible
                        </li>
                        <li>
                            Preserving and making digitised materials accessible to the world including HDR theses,
                            photographs, audio materials, videos, manuscripts and other original works.
                        </li>
                    </ul>
                    <p>
                        You can also read the{' '}
                        <a href="https://espace.library.uq.edu.au/view/UQ:295655/eSpaceScopeandPolicy.pdf">
                            UQ Library Scope and Policy
                        </a>
                        .
                    </p>
                </StandardCard>
            ),
        },
        notFound: {
            title: 'Page not found',
            children: (
                <StandardCard>
                    <p>The requested page could not be found.</p>
                    <p>Sorry about that, but here's what you can do next:</p>
                    <ul>
                        <li>Try re-typing the address, checking for spelling, capitalisation and/or punctuation.</li>
                        <li>Start again at the home page.</li>
                        <li>
                            If you’re sure the page should be at this address, email us at webmaster@library.uq.edu.au.
                        </li>
                    </ul>
                </StandardCard>
            ),
        },
        masquerade: {
            title: 'Masquerade',
            help: {
                title: 'Masquerade',
                text: <p>Masquerade as another user...</p>,
                buttonLabel: 'CLOSE',
            },
            description: {
                readonly: (
                    <p>
                        <strong>NOTE:</strong> As a read-only masquerader, you can view all parts of the profile, but
                        you are not able to make any changes to the account.
                    </p>
                ),
                full: (
                    <p>
                        <strong>WARNING!!</strong> When masquerading as a user, you will effectively become that user,
                        and changes you make will apply to the account!
                    </p>
                ),
            },
            labels: {
                submit: 'Masquerade',
                hint: 'Enter a UQ staff or student username (eg. uqjsmith1 or s123456)',
            },
        },
    },
};
