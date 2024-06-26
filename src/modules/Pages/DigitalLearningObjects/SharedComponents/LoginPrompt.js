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
    margin: 0,
    padding: 12,
    display: 'flex',
    alignItems: 'center',
    '& span': {
        marginLeft: 10,
        display: 'flex',
        alignItems: 'center',
    },
}));

const LoginPrompt = ({ account, narrower, prompt, instyle }) => {
    const loginLink = `https://auth.library.uq.edu.au/login?return=${window.btoa(window.location.href)}`;
    return (
        <>
            {!account?.id && (
                <StyledLoginPrompt
                    data-testid="dlor-homepage-loginprompt"
                    sx={{ instyle, margin: !!narrower ? '0 12px' : undefined }}
                >
                    <InfoIcon />
                    <span>
                        <a style={{ color: '#1e72c6' }} href={loginLink}>
                            Log in
                        </a>
                        &nbsp;{prompt}
                        {'  '}&nbsp;
                        <a
                            href="https://guides.library.uq.edu.au/teaching/link-embed-resources/digital-learning-objects#s-lg-box-22746342"
                            target="_blank"
                        >
                            <HelpOutlineIcon style={{ marginTop: 6 }} />
                        </a>
                    </span>
                </StyledLoginPrompt>
            )}
        </>
    );
};

LoginPrompt.propTypes = {
    account: PropTypes.object,
    narrower: PropTypes.bool,
    prompt: PropTypes.string,
    instyle: PropTypes.any,
};
LoginPrompt.defaultProps = {
    narrower: false,
    prompt: 'for extra features',
};

export default LoginPrompt;
