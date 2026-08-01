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
import { transformRequest } from '../membershipTransformers';
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
    membershipSaving,
}) => {
    const { type } = useParams();
    const navigate = useNavigate();
    const current = findAccountType(membershipFormData, type);

    const { control, formState, safelyHandleSubmit, setServerFieldErrors } = useForm();

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

    // Leaving the record behind would show it to the next application started in this session.
    useEffect(() => () => actions.clearMembership(), [actions]);

    // An unrecognised type has no form to show, so it is sent back to the landing chooser.
    useEffect(() => {
        if (!!membershipFormData && !current && !membershipFormDataLoading) {
            navigate(pathConfig.membership, { replace: true });
        }
    }, [current, membershipFormData, membershipFormDataLoading, navigate]);

    const onSubmit = safelyHandleSubmit(async values => {
        const request = transformRequest(values, { type, paymentOptions: current?.payment_options });

        try {
            const saved = await actions.submitMembership(request);
            navigate(pathConfig.membershipReceived(saved.id));
        } catch (error) {
            // The API reports field-level problems keyed by field name, so they go back onto the fields.
            setServerFieldErrors(error?.errors);
            throw error;
        }
    });

    if (membershipFormDataError) {
        return (
            <StandardPage title={form.title}>
                <Alert severity="error" data-testid="membership-form-load-error">
                    {form.loadFailed}
                </Alert>
            </StandardPage>
        );
    }

    if (!current) {
        return (
            <StandardPage title={form.title}>
                <InlineLoader message="Loading the application form" />
            </StandardPage>
        );
    }

    const submitLabel = (membershipSaving && form.applying) || form.apply;

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
                        {/* The postcode helper is only relevant where a home address is collected — fryer has none. */}
                        {type !== MEMBERSHIP_TYPES.FRYER && (
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
    membershipSaving: PropTypes.bool,
};

export default MembershipForm;
