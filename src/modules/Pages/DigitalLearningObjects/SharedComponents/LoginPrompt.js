import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const loginPromptInfoIcon =
    'url("data:image/svg+xml,%3csvg viewBox=%270 0 24 24%27 fill=%27none%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3ccircle cx=%2712%27 cy=%2712%27 r=%279.25%27 transform=%27rotate(-180 12 12)%27 stroke=%27%233b383e%27 stroke-width=%271.5%27%3e%3c/circle%3e%3cpath d=%27M12 16.2v-4%27 stroke=%27%233b383e%27 stroke-width=%271.5%27 stroke-linecap=%27round%27%3e%3c/path%3e%3ccircle cx=%2712%27 cy=%278.4%27 r=%271.1%27 transform=%27rotate(-180 12 8.4)%27 fill=%27%233b383e%27%3e%3c/circle%3e%3c/svg%3e")';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const StyledLoginPrompt = styled(Box)(({ theme }) => ({
    backgroundColor: '#e7f0fa',
    color: 'rgba(0, 0, 0, 0.87)',
    fontWeight: 400,
    lineHeight: 1.5,
    margin: '24px 0 40px',
    padding: 12,
    display: 'flex',
    alignItems: 'center',
    '& span': {
        marginLeft: 10,
        display: 'flex',
        alignItems: 'center',
    },
    '& a': {
        color: `${theme.palette.primary.main} !important`,
        textDecoration: 'underline',
        transition: 'color 200ms ease-out, background-color 200ms ease-out, text-decoration 200ms ease-out',
        '&:hover, &:focus-visible': {
            color: '#fff !important',
            backgroundColor: theme.palette.primary.main,
            textDecoration: 'underline',
            outline: 'none',
        },
    },
}));

const StyledInfoBadge = styled('span')(() => ({
    display: 'inline-block',
    width: '24px',
    height: '24px',
    backgroundImage: loginPromptInfoIcon,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    flexShrink: 0,
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
    const resolvedPrompt =
        typeof prompt === 'string' && prompt.trim().length > 0 ? prompt.trim() : 'for extra features';
    const displayPrompt = /[.!?]$/.test(resolvedPrompt) ? resolvedPrompt : `${resolvedPrompt}.`;

    return (
        <>
            {shouldRender && (
                <StyledLoginPrompt
                    data-testid="dlor-homepage-loginprompt"
                    sx={{ instyle, margin: !!narrower ? /* istanbul ignore next */ '0 12px' : undefined }}
                >
                    <StyledInfoBadge aria-hidden="true" />
                    <span>
                        <a href={loginLink}>Log in</a>
                        &nbsp;{displayPrompt}
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
