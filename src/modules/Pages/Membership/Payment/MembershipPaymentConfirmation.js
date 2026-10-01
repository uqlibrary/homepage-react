import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router';

import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { breadcrumbs } from 'config/routes';

import locale from '../membership.locale';

const { paymentConfirmation } = locale;

/**
 * Turn the payment gateway's return query string into the record the API stores.
 *
 * The whole query string is kept in `everything` as well, because the gateway has changed what it sends before
 * and staff have had to go back to the raw response to work out what happened.
 */
export const buildPaymentRecord = searchParams => {
    const params = Object.fromEntries(searchParams.entries());

    return {
        id: params.UQ_LIB_ID,
        payment_receipt: params.ReceiptNo,
        payment_code: params.MembershipCode,
        payment_response: params.Success,
        payment_amount: params.AmountPaid,
        everything: JSON.stringify(params),
    };
};

/**
 * Where the payment gateway sends the applicant back to.
 *
 * By the time this page loads the money has already changed hands - all that is left is to record it. So a
 * failure here is never reported as a failed payment; it is reported as something staff need to finish.
 */
export const MembershipPaymentConfirmation = ({ actions }) => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('processing');
    // The gateway will not send them back twice, and recording the same payment twice would be worse than not
    // recording it at all.
    const hasSaved = useRef(false);

    const receipt = searchParams.get('ReceiptNo');

    useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.membership.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.membership.pathname);
    }, []);

    useEffect(() => {
        if (hasSaved.current) {
            return;
        }
        hasSaved.current = true;

        actions
            .saveMembershipPayment(buildPaymentRecord(searchParams))
            .then(() => setStatus('saved'))
            .catch(() => setStatus('failed'));
    }, [actions, searchParams]);

    return (
        <StandardPage title={paymentConfirmation.title}>
            <div data-testid="membership-payment-confirmation">
                {status === 'processing' && <InlineLoader message={paymentConfirmation.processing} />}

                {status === 'saved' && (
                    <Typography variant="h6" component="p" data-testid="membership-payment-thankyou">
                        {paymentConfirmation.thankYou}
                    </Typography>
                )}

                {/* A failure here is a failure to record the payment, not a failed payment - so it is reported
                    as something staff need to finish, never as "payment received". */}
                {status === 'failed' && (
                    <Alert severity="warning" data-testid="membership-payment-record-failed">
                        {paymentConfirmation.recordFailed}
                        {!!receipt && ` ${paymentConfirmation.receiptNumber(receipt)}`}
                    </Alert>
                )}

                {status !== 'processing' && (
                    <Typography sx={{ marginTop: 3 }}>
                        <a href={locale.received.backToHomePage.url}>{locale.received.backToHomePage.label}</a>
                    </Typography>
                )}
            </div>
        </StandardPage>
    );
};

MembershipPaymentConfirmation.propTypes = {
    actions: PropTypes.object,
};

export default MembershipPaymentConfirmation;
