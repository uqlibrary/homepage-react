import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { AWS_WAF_CAPTCHA_API_KEY, AWS_WAF_CAPTCHA_INTEGRATION_URL } from 'config/general';
import locale from '../membership.locale';

const { captcha } = locale.form;

/**
 * Read the current AWS WAF token to send on the protected create request. The integration script keeps a token
 * refreshed in the background and upgrades it once the puzzle is solved, so asking for it here - at submit time -
 * hands over a fresh, solved token rather than one that may have expired while the form was filled in. Resolves
 * undefined when the script has not loaded, so the caller simply sends no token header.
 */
export const getMembershipCaptchaToken = async () => {
    if (!window.AwsWafIntegration) {
        return undefined;
    }
    return window.AwsWafIntegration.getToken();
};

/**
 * The AWS WAF CAPTCHA puzzle at the foot of a new application. AWS's jsapi.js draws the puzzle into the container
 * and calls back once it is solved, which is what lets the form reveal its submit button. The solved token is not
 * kept here - it is read fresh at submit time by getMembershipCaptchaToken - so this only needs to report that the
 * puzzle is done. The script is loaded on demand rather than site-wide, since only this form asks for it.
 */
export const MembershipCaptcha = ({ onSolved }) => {
    const containerRef = useRef(null);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const container = containerRef.current;

        const render = () => {
            setHasError(false);
            window.AwsWafCaptcha.renderCaptcha(container, {
                apiKey: AWS_WAF_CAPTCHA_API_KEY,
                onSuccess: () => {
                    setHasError(false);
                    onSolved();
                },
                onError: () => setHasError(true),
                dynamicWidth: true,
            });
        };

        // A visit to an earlier application in the same session has already loaded the script and defined the
        // global, so it is only fetched once; a later mount renders straight into the container.
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
    }, [onSolved]);

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
};

export default MembershipCaptcha;
