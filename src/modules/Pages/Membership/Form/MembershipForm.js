import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { useForm } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import { pathConfig } from 'config/pathConfig';
import { breadcrumbs } from 'config/routes';

import { MEMBERSHIP_TYPES } from '../membershipFieldRules';
import { isFrozen, isPaymentGatewayOutage } from '../membershipOutage';
import { isRenewal, transformRequest, transformResponse } from '../membershipTransformers';
import locale from '../membership.locale';
import ConfigText from '../SharedComponents/ConfigText';
import MembershipFormSections from './MembershipFormSections';
import MembershipTerms from './MembershipTerms';

const { form } = locale;

export const findAccountType = (membershipFormData, type) =>
    membershipFormData?.account_types?.find(accountType => accountType.value === type);

export const MembershipForm = ({
    actions,
    membershipFormData,
    membershipFormDataLoading,
    membershipFormDataError,
    membership,
    membershipLoading,
    membershipError,
    membershipSaving,
}) => {
    const { type: typeParam, id, code } = useParams();
    const navigate = useNavigate();

    // A renewal link carries an id and a code; without them this is a fresh application.
    const isRenewalRoute = !!id && !!code;
    // On a renewal the record itself says what type it is; the URL only says what was applied for.
    const type = membership?.type ?? typeParam;
    const isRenewing = isRenewal(membership);
    const current = findAccountType(membershipFormData, type);

    const { control, formState, reset, safelyHandleSubmit, setServerFieldErrors } = useForm();

    useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.membership.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.membership.pathname);
    }, []);

    useEffect(() => {
        /* istanbul ignore else */
        if (!membershipFormDataError && !membershipFormDataLoading && !membershipFormData) {
            actions.loadMembershipFormData();
        }
    }, [actions, membershipFormData, membershipFormDataError, membershipFormDataLoading]);

    // Clear any record left from an earlier application so a fresh one starts clean. Done on mount rather
    // than on the way out so the record this form saves survives for the received page to read.
    useEffect(() => {
        actions.clearMembership();
    }, [actions]);

    // A renewal link carries its own authority — the id and code pair — so the record is fetched with them.
    // Fetching it here rather than relying on a record handed over from a previous page means a reloaded or
    // bookmarked renewal link still opens a prefilled form.
    useEffect(() => {
        if (isRenewalRoute && !membershipError && !membershipLoading && !membership) {
            actions.loadMembershipByCode(id, code);
        }
    }, [actions, code, id, isRenewalRoute, membership, membershipError, membershipLoading]);

    // Once the record is loaded, prefill the form from it. Identity fields are shown but locked (see
    // isFieldDisabled), so a renewal cannot rewrite who the member is.
    useEffect(() => {
        if (!membership) {
            return;
        }
        reset(transformResponse(membership));
    }, [membership, reset]);

    // An unrecognised type has no form to show, so it is sent back to the landing chooser.
    useEffect(() => {
        if (!!membershipFormData && !current && !membershipFormDataLoading) {
            navigate(pathConfig.membership, { replace: true });
        }
    }, [current, membershipFormData, membershipFormDataLoading, navigate]);

    const onSubmit = safelyHandleSubmit(async values => {
        const request = transformRequest(values, { type, paymentOptions: current?.payment_options });

        try {
            // A renewal authenticates on the id and code from the link, so they travel with the body.
            const saved = isRenewing
                ? await actions.renewMembership({ ...request, id, code })
                : await actions.submitMembership(request);
            navigate(pathConfig.membershipReceived(saved.id));
        } catch (error) {
            // The API reports field-level problems keyed by field name, so they go back onto the fields.
            setServerFieldErrors(error?.errors);
            throw error;
        }
    });

    // During a scheduled maintenance window the form is closed to everyone, so nothing is asked for or submitted.
    if (isFrozen()) {
        return (
            <StandardPage title={form.title}>
                <Alert severity="error" data-testid="membership-form-frozen">
                    {form.frozen}
                </Alert>
            </StandardPage>
        );
    }

    // A payment gateway outage turns away only the types that would have to pay; the free types are unaffected.
    if (isPaymentGatewayOutage(type)) {
        return (
            <StandardPage title={form.title}>
                <Alert severity="error" data-testid="membership-form-outage">
                    {form.paymentGatewayOutage}
                </Alert>
            </StandardPage>
        );
    }

    if (membershipFormDataError || (isRenewalRoute && membershipError)) {
        return (
            <StandardPage title={form.title}>
                <Alert severity="error" data-testid="membership-form-load-error">
                    {isRenewalRoute && membershipError ? form.renewalLoadFailed : form.loadFailed}
                </Alert>
            </StandardPage>
        );
    }

    // A renewal has nothing to show until its record arrives, since the form is prefilled from it.
    if (!current || (isRenewalRoute && !membership)) {
        return (
            <StandardPage title={form.title}>
                <InlineLoader message="Loading the application form" />
            </StandardPage>
        );
    }

    const submitLabel = isRenewing
        ? (membershipSaving && form.renewing) || form.renew
        : (membershipSaving && form.applying) || form.apply;

    return (
        <StandardPage title={`${form.title} - ${current.title}`}>
            <div data-testid="membership-form">
                {/* The per-type introduction from the form config — who the type is for and how long it takes. */}
                {!!current.conditions && (
                    <ConfigText component="p" data-testid="membership-form-conditions" text={current.conditions} />
                )}

                {/*
                 * noValidate hands validation to us rather than the browser. Without it the browser blocks the
                 * submit on the first empty required field with a transient bubble a screen reader does not
                 * announce, and our own error reporting never runs.
                 */}
                <form onSubmit={onSubmit} noValidate data-testid="membership-form-element">
                    <Typography variant="body2" sx={{ marginBottom: 1 }}>
                        {form.mandatoryNote}
                    </Typography>

                    <MembershipFormSections
                        type={type}
                        control={control}
                        formData={membershipFormData}
                        current={current}
                        isRenewing={isRenewing}
                    />

                    <Box sx={{ marginTop: 3 }}>
                        <Typography>
                            <a
                                href={form.contactUs.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-testid="membership-form-contact-us"
                            >
                                {form.contactUs.label}
                            </a>{' '}
                            {form.contactUs.text}
                        </Typography>
                        {/* The postcode helper is only relevant where a home address is collected — fryer has
                            none, and a renewal keeps the address it already has. */}
                        {!isRenewing && type !== MEMBERSHIP_TYPES.FRYER && (
                            <Typography data-testid="membership-form-postcode-help">
                                {form.findAPostcode.before}
                                <a href={form.findAPostcode.url} target="_blank" rel="noopener noreferrer">
                                    {form.findAPostcode.label}
                                </a>
                                {form.findAPostcode.after}
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ marginTop: 3 }}>
                        <MembershipTerms type={type} control={control} current={current} />
                    </Box>

                    {/*
                     * A live region, so a failed submit is announced without being hunted for. Focus is left to
                     * react-hook-form, which puts it on the first field that needs fixing — between them the
                     * applicant is told there is a problem and taken straight to it (WCAG 3.3.1).
                     */}
                    <Box role="alert" data-testid="membership-form-error-summary" sx={{ marginTop: 2 }}>
                        {!!formState.isSubmitFailure && !!formState.hasValidationError && (
                            <Alert severity="error">{form.invalidSummary}</Alert>
                        )}
                        {!!formState.hasServerError && (
                            <Alert severity="error" data-testid="membership-form-server-error">
                                {form.submitFailed}
                            </Alert>
                        )}
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: 2 }}
                        id="membership-form-submit"
                        data-testid="membership-form-submit"
                        // Left enabled while the form is incomplete on purpose: a disabled button gives no reason
                        // and no way forward. Submitting an incomplete form reports what is missing.
                        disabled={!!membershipSaving}
                    >
                        {submitLabel}
                    </Button>
                </form>
            </div>
        </StandardPage>
    );
};

MembershipForm.propTypes = {
    actions: PropTypes.object,
    membershipFormData: PropTypes.object,
    membershipFormDataLoading: PropTypes.bool,
    membershipFormDataError: PropTypes.any,
    membership: PropTypes.object,
    membershipLoading: PropTypes.bool,
    membershipError: PropTypes.any,
    membershipSaving: PropTypes.bool,
};

export default MembershipForm;
