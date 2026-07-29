import React from 'react';
import { useParams } from 'react-router';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import locale from '../membership.locale';

/**
 * Confirmation shown after an application is submitted. The applicant is redirected here with their new
 * application's id. Payment and the reassuring fallback for a reloaded receipt are added with their own slices.
 */
export const MembershipReceived = () => {
    const { id } = useParams();
    const { received } = locale;

    return (
        <StandardPage title={received.title}>
            <div data-testid="membership-received">
                <p data-testid="membership-received-thankyou">{received.thankYou}</p>
                <p>{received.notifiedByEmail}</p>
                <p data-testid="membership-received-reference">
                    {received.loadFailed.referenceLabel}: {id}
                </p>
            </div>
        </StandardPage>
    );
};

export default MembershipReceived;
