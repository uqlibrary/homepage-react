import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { AWS_WAF_CAPTCHA_API_KEY, AWS_WAF_CAPTCHA_INTEGRATION_URL, AWS_WAF_CAPTCHA_TOKEN_DOMAIN } from 'config/general';
import locale from '../membership.locale';

const { captcha } = locale.form;

/**
 * The AWS WAF CAPTCHA puzzle at the foot of a new application. AWS's jsapi.js draws the puzzle into the container
 * and, once it is solved, calls back with the solved AWS WAF token. That exact token is handed to the form via
 * onSolved: it is the one carrying proof of the CAPTCHA solution, which the API's WAF rule checks. (Re-reading the
 * token afterwards with AwsWafIntegration.getToken() can hand back the background silent-challenge token instead,
 * which the CAPTCHA rule action rejects with a 405, so we pass the onSuccess token straight through.) The script is
 * loaded on demand rather than site-wide, since only this form asks for it.
 *
 * `resetSignal` lets the form draw a fresh puzzle after the WAF rejects a submit (its token having expired past the
 * CAPTCHA immunity window): bumping the number re-runs the effect and re-renders the puzzle, so the applicant can
 * verify again rather than being left at a dead end.
 */
export const MembershipCaptcha = ({ onSolved, resetSignal }) => {
    const containerRef = useRef(null);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const container = containerRef.current;

        // Scope the token to the shared apex so it is valid both here (the homepage host, where the puzzle runs)
        // and on the API host the application is posted to. Without this the SDK mints a token for the protected
        // resource's host only, which cannot be acquired from this page - the puzzle solves but the token step
        // fails. This must be set before the SDK script runs, since it fetches a token in the background on load.
        window.awsWafCookieDomainList = [AWS_WAF_CAPTCHA_TOKEN_DOMAIN];

        const render = () => {
            setHasError(false);
            window.AwsWafCaptcha.renderCaptcha(container, {
                apiKey: AWS_WAF_CAPTCHA_API_KEY,
                onSuccess: wafToken => {
                    setHasError(false);
                    onSolved(wafToken);
                },
                onError: () => setHasError(true),
                dynamicWidth: true,
            });
        };

        // A visit to an earlier application in the same session has already loaded the script and defined the
        // global, so it is only fetched once; a later mount - or a reset - renders straight into the container.
        if (window.AwsWafCaptcha) {
            render();
            return undefined;
        }

        const script = document.createElement('script');
        script.src = `${AWS_WAF_CAPTCHA_INTEGRATION_URL}/jsapi.js`;
        script.async = true;
        script.onload = render;
        script.onerror = () => setHasError(true);
        document.head.appendChild(script);

        return () => {
            script.remove();
        };
    }, [onSolved, resetSignal]);

    return (
        <Box sx={{ marginTop: 3 }} data-testid="membership-captcha">
            <Typography variant="body2" sx={{ marginBottom: 1 }}>
                {captcha.instruction}
            </Typography>
            <div ref={containerRef} data-testid="membership-captcha-container" />
            {!!hasError && (
                <Alert severity="error" sx={{ marginTop: 1 }} data-testid="membership-captcha-error">
                    {captcha.error}
                </Alert>
            )}
        </Box>
    );
};

MembershipCaptcha.propTypes = {
    onSolved: PropTypes.func.isRequired,
    resetSignal: PropTypes.number,
};

export default MembershipCaptcha;
