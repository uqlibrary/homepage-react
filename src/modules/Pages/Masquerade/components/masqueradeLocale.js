import React from 'react';

export default {
    title: 'Masquerade',
    help: {
        title: 'Masquerade',
        text: <p>Masquerade as another user...</p>,
        buttonLabel: 'CLOSE',
    },
    user: {
        access: {
            readonly: {
                capabilityStatement: (
                    <span>
                        <strong>NOTE:</strong> As a read-only masquerader, you can view all parts of the profile, but
                        you are not able to make any changes to the account.
                    </span>
                ),
            },
            full: {
                capabilityStatement: (
                    <span>
                        <strong>WARNING!!</strong> When masquerading as a user, you will effectively become that user,
                        and changes you make will apply to the account!
                    </span>
                ),
            },
        },
    },
    labels: {
        submit: 'Masquerade',
        hint: 'Enter a UQ staff or student username (eg. uqjsmith1 or s123456)',
    },
};
