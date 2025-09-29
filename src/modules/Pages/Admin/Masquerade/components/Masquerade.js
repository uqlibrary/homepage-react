import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import txt from './masquerade.locale';
import { StyledPrimaryButton } from 'helpers/general';

const StyledStandardCard = styled(StandardCard)(() => ({
    backgroundColor: 'white',
}));

const Masquerade = ({ account }) => {
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(false);

    const masqueradeAs = event => {
        if ((event && event.key && event.key !== 'Enter') || userName.length === 0) return;

        setLoading(true);

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
                        <StyledPrimaryButton
                            id="submitMasquerade"
                            data-analyticsid="submitMasquerade"
                            data-testid="masquerade-submit"
                            fullWidth
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
