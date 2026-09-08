import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { breadcrumbs } from 'config/routes';
import { redirectTo } from 'helpers/redirect';

import { MEMBERSHIP_TYPES } from '../membershipFieldRules';
import locale from '../membership.locale';

const { received } = locale;

// The two types that pay. The amount and the gateway URL are both decided by the API - nothing here works out
// what anything costs.
export const PAYING_TYPES = [MEMBERSHIP_TYPES.COMMUNITY, MEMBERSHIP_TYPES.ALUMNI_FRIENDS];

// The types shown the entitlements acknowledgement.
export const ACKNOWLEDGING_TYPES = [MEMBERSHIP_TYPES.ALUMNI, MEMBERSHIP_TYPES.ALUMNI_NEW];

export const canPay = membership => PAYING_TYPES.includes(membership?.type);

export const mustAcknowledge = membership => ACKNOWLEDGING_TYPES.includes(membership?.type);

export const MembershipReceived = ({ actions, membership, membershipLoading, membershipError }) => {
    const { id } = useParams();
    const [isRedirecting, setIsRedirecting] = useState(false);

    // The record normally arrives in the store from the submit that sent us here. On a reload or a bookmarked
    // link it is not there, so it is fetched.
    useEffect(() => {
        if (!!id && !membership && !membershipLoading && !membershipError) {
            actions.loadMembership(id);
        }
    }, [actions, id, membership, membershipError, membershipLoading]);

    useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.membership.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.membership.pathname);
    }, []);

    const paymentUrl = membership?.uq_payments_url;
    const isPaying = canPay(membership);

    const pay = useCallback(() => {
        /* istanbul ignore else - the button is only offered when there is somewhere to send them */
        if (paymentUrl) {
            setIsRedirecting(true);
            redirectTo(paymentUrl);
        }
    }, [paymentUrl]);

    // A type that has to pay is taken to the gateway rather than asked to press a button they have no reason
    // not to press. The button below is the way through if the redirect does not happen.
    useEffect(() => {
        !!isPaying && !!paymentUrl && pay();
    }, [isPaying, pay, paymentUrl]);

    if (!!id && membershipLoading) {
        return (
            <StandardPage title={received.title}>
                <InlineLoader message="Loading your application" />
            </StandardPage>
        );
    }

    return (
        <StandardPage title={received.title}>
            <div data-testid="membership-received">
                <Typography variant="h6" component="p">
                    {received.thankYou}
                </Typography>

                {/* The application went through; only reading it back did not, so it is not reported as a
                    failure. An applicant reaches this every time they reload or come back to this page: the
                    record is theirs but the API serves it to Library staff alone, so there is nothing to
                    re-read and nothing to fix here. Their reference is the one thing this page still knows,
                    and it is what AskUs will ask them for. */}
                {!!membershipError && (
                    <Alert severity="info" sx={{ marginTop: 2 }} data-testid="membership-received-load-error">
                        <Typography variant="body2">{received.loadFailed.reassure}</Typography>
                        <Typography variant="body2" sx={{ marginTop: 1 }}>
                            {received.loadFailed.explain}
                        </Typography>
                        <Typography variant="body2" sx={{ marginTop: 1 }}>
                            {received.loadFailed.act}
                        </Typography>
                        {!!id && (
                            <Typography variant="body2" sx={{ marginTop: 1 }}>
                                {`${received.loadFailed.referenceLabel}: `}
                                <Box component="strong" data-testid="membership-received-reference">
                                    {id}
                                </Box>
                            </Typography>
                        )}
                        <Typography variant="body2" sx={{ marginTop: 1 }}>
                            <Link
                                href={`mailto:${received.loadFailed.askUs.email}?subject=${encodeURIComponent(
                                    received.loadFailed.askUs.subject,
                                )}${id ? `&body=${encodeURIComponent(`${received.loadFailed.referenceLabel}: ${id}`)}` : ''}`}
                                data-testid="membership-received-askus"
                            >
                                {received.loadFailed.askUs.label}
                            </Link>
                        </Typography>
                    </Alert>
                )}

                {!!mustAcknowledge(membership) && (
                    <Box sx={{ marginTop: 2 }}>
                        <FormControlLabel
                            control={<Checkbox id="plsconf" inputProps={{ 'data-testid': 'membership-alumni-ack' }} />}
                            label={
                                <>
                                    {received.alumniAcknowledgement.before}
                                    <a
                                        href={received.alumniAcknowledgement.servicesUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {received.alumniAcknowledgement.servicesLabel}
                                    </a>
                                    {received.alumniAcknowledgement.middle}
                                    <a
                                        href={received.alumniAcknowledgement.listedUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {received.alumniAcknowledgement.listedLabel}
                                    </a>
                                    {received.alumniAcknowledgement.after}
                                </>
                            }
                        />
                    </Box>
                )}

                {!!isPaying && (
                    <Box sx={{ marginTop: 2 }} data-testid="membership-received-payment">
                        {!paymentUrl && (
                            <Alert severity="error" data-testid="membership-received-no-payment-url">
                                {received.paymentUnavailable}
                            </Alert>
                        )}
                        {!!paymentUrl && (
                            <>
                                <Button
                                    id="paynow"
                                    variant="contained"
                                    color="primary"
                                    onClick={pay}
                                    disabled={isRedirecting}
                                    data-testid="membership-received-pay"
                                >
                                    {received.payNow}
                                </Button>
                                {!!isRedirecting && (
                                    <Typography
                                        role="status"
                                        sx={{ marginTop: 1 }}
                                        data-testid="membership-redirecting"
                                    >
                                        {received.redirecting}
                                    </Typography>
                                )}
                            </>
                        )}
                    </Box>
                )}

                {!isPaying && (
                    <Typography sx={{ marginTop: 2 }} data-testid="membership-received-notified">
                        {received.notifiedByEmail}
                    </Typography>
                )}

                <Typography sx={{ marginTop: 3 }}>
                    <a href={received.backToHomePage.url}>{received.backToHomePage.label}</a>
                </Typography>
            </div>
        </StandardPage>
    );
};

MembershipReceived.propTypes = {
    actions: PropTypes.object,
    membership: PropTypes.object,
    membershipLoading: PropTypes.bool,
    membershipError: PropTypes.any,
};

export default MembershipReceived;
