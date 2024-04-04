import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@mui/styles';

import InfoIcon from '@mui/icons-material/Info';

const useStyles = makeStyles(theme => ({
    loginAlert: {
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
        },
        // width: '100%',
    },
    narrrower: {
        margin: '0 12px',
    },
}));

const LoginPrompt = ({ account, narrower }) => {
    const classes = useStyles();
    const loginLink = `https://auth.library.uq.edu.au/login?return=${window.btoa(window.location.href)}`;
    let className = `${classes.loginAlert}`;
    if (!!narrower) {
        className = `${classes.loginAlert} ${classes.narrrower}`;
    }
    return (
        <>
            {!account?.id && (
                <div data-testid="dlor-homepage-loginprompt" className={className}>
                    <InfoIcon />
                    <span>
                        <a style={{ color: '#1e72c6' }} href={loginLink}>
                            Login
                        </a>{' '}
                        for the full experience
                    </span>
                </div>
            )}
        </>
    );
};

LoginPrompt.propTypes = {
    account: PropTypes.object,
    narrower: PropTypes.bool,
};
LoginPrompt.defaultProps = {
    narrower: false,
};

export default LoginPrompt;
