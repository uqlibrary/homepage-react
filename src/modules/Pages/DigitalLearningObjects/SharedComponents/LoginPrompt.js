import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import InfoIcon from '@mui/icons-material/Info';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const StyledLoginPrompt = styled(Box)(() => ({
    backgroundColor: '#dcedfd',
    color: 'rgba(0, 0, 0, 0.87)',
    fontWeight: 400,
    lineHeight: 1.5,
    margin: '24px 0',
    padding: 12,
    display: 'flex',
    alignItems: 'center',
    '& span': {
        marginLeft: 10,
        display: 'flex',
        alignItems: 'center',
    },
}));

const LoginPrompt = ({
    account,
    isLoggedIn = !!account?.id,
    narrower = false,
    prompt = 'for extra features',
    instyle,
    helpUrl = 'https://guides.library.uq.edu.au/research-and-teaching-staff/link-embed-resources/digital-learning-objects#s-lg-box-22922915',
    helpAriaLabel = 'Learn more about "Digital Learning Objects"',
}) => {
    const loginLink = `https://auth.library.uq.edu.au/login?return=${window.btoa(window.location.href)}`;
    const shouldRender = typeof account === 'undefined' ? !isLoggedIn : !account?.id;

    return (
        <>
            {shouldRender && (
                <StyledLoginPrompt
                    data-testid="dlor-homepage-loginprompt"
                    sx={{ instyle, margin: !!narrower ? /* istanbul ignore next */ '0 12px' : undefined }}
                >
                    <InfoIcon />
                    <span>
                        <a style={{ color: '#1e72c6' }} href={loginLink}>
                            Log in
                        </a>
                        &nbsp;{prompt}
                        {!!helpUrl && (
                            <>
                                {'  '}&nbsp;
                                <a href={helpUrl} target="_blank" aria-label={helpAriaLabel}>
                                    <HelpOutlineIcon style={{ marginTop: 6 }} />
                                </a>
                            </>
                        )}
                    </span>
                </StyledLoginPrompt>
            )}
        </>
    );
};

LoginPrompt.propTypes = {
    account: PropTypes.object,
    isLoggedIn: PropTypes.bool,
    narrower: PropTypes.bool,
    prompt: PropTypes.string,
    instyle: PropTypes.any,
    helpUrl: PropTypes.string,
    helpAriaLabel: PropTypes.string,
};

export default LoginPrompt;
