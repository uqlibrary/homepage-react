import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useCookies } from 'react-cookie';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import txt from './masquerade.locale';
import { PREMASQUERADE_SESSION_COOKIE_NAME } from 'config/general';

const StyledStandardCard = styled(StandardCard)(() => ({
    backgroundColor: 'white',
}));

const Masquerade = ({ account }) => {
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(false);
    const [cookies, setCookie] = useCookies();

    const masqueradeAs = event => {
        if ((event && event.key && event.key !== 'Enter') || userName.length === 0) return;

        setLoading(true);

        // store the old cookie so we can end the masquerade (done in reusable)
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + 20 * 60 * 1000);
        // cookie expiry period is a bit arbitrary
        // If the masqueraded-session is left in place after cookie expiry, it will just log them out.
        console.log(
            'homepage/Maquerade/masqueradeAs:: PREMASQUERADE_SESSION_COOKIE_NAME=',
            cookies[PREMASQUERADE_SESSION_COOKIE_NAME],
        );
        /* istanbul ignore next */
        if (!!cookies[PREMASQUERADE_SESSION_COOKIE_NAME]) {
            console.log(
                'homepage/Maquerade/masqueradeAs:: deleting old masquerade cookie ',
                PREMASQUERADE_SESSION_COOKIE_NAME,
            ); // debug
            delete cookies[PREMASQUERADE_SESSION_COOKIE_NAME];
        }
        console.log('document.cookie=', document.cookie);
        const cookies2 = document.cookie.split(';');
        for (let i = 0; i < cookies2.length; ++i) {
            const pair = cookies2[i].trim().split('=');
            if (!!pair[0] && pair[0] === name) {
                console.log('cookies: ', pair[0], ':', pair[1]);
            }
        }
        console.log('homepage/Maquerade/masqueradeAs:: setting cookie to ', cookies.UQLID); // debug
        setCookie(PREMASQUERADE_SESSION_COOKIE_NAME, cookies.UQLID, { expires: expirationDate });

        let redirectUrl = `${window.location.protocol}//${window.location.hostname}`;
        const isDevBranch = window.location.hostname === 'homepage-development.library.uq.edu.au';
        redirectUrl += isDevBranch ? /* istanbul ignore next */ window.location.pathname : '/';
        window.location.assign(
            `https://auth.library.uq.edu.au/masquerade?user=${userName}&return=${window.btoa(redirectUrl)}`,
        );
    };

    const usernameChanged = event => {
        setUserName(event.target.value);
    };

    const userCapabilityStatement = canMasqueradeType => {
        return canMasqueradeType && canMasqueradeType === 'readonly'
            ? txt.user.access.readonly.capabilityStatement
            : txt.user.access.full.capabilityStatement;
    };

    return (
        <StandardPage title={txt.title}>
            <StyledStandardCard noHeader standardCardId="masquerade">
                <Typography>{userCapabilityStatement(account.canMasqueradeType)}</Typography>
                <Grid container spacing={3} alignItems={'flex-end'} style={{ marginTop: 12 }}>
                    <Grid item xs>
                        <TextField
                            variant="standard"
                            data-testid="masquerade-userName"
                            fullWidth
                            label={txt.labels.hint}
                            value={userName}
                            onChange={usernameChanged}
                            InputProps={{ onKeyPress: masqueradeAs }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={'auto'}>
                        <Button
                            variant="contained"
                            id="submitMasquerade"
                            data-analyticsid="submitMasquerade"
                            data-testid="masquerade-submit"
                            fullWidth
                            color="primary"
                            children={txt.labels.submit}
                            disabled={loading}
                            onClick={masqueradeAs}
                            onKeyUp={masqueradeAs}
                        />
                    </Grid>
                </Grid>
            </StyledStandardCard>
        </StandardPage>
    );
};

Masquerade.propTypes = {
    account: PropTypes.object.isRequired,
};

export default React.memo(Masquerade);
