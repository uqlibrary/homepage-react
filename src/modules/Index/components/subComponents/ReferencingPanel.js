import React from 'react';
import PropTypes from 'prop-types';
import { canSeeEndnoteReferencing } from 'helpers/access';

import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

const StyledBodyCopyDiv = styled('div')(() => ({
    fontWeight: 400,
}));
const StyledStandardCard = styled(StandardCard)(() => ({
    '& .cardContentNoPadding': {
        marginTop: '-24px',
    },
}));

export const ReferencingPanel = ({ account }) => {
    return (
        <StyledStandardCard
            subCard
            noPadding
            primaryHeader
            standardCardId="referencing-homepage-panel"
            title="Referencing"
        >
            <Grid container padding={3} spacing={2}>
                <Grid item xs={12}>
                    <a href={'https://guides.library.uq.edu.au/referencing'} data-testid={'referencing-style'}>
                        Referencing style guides
                    </a>
                    <StyledBodyCopyDiv>APA, Chicago, Vancouver and more</StyledBodyCopyDiv>
                </Grid>
                {canSeeEndnoteReferencing(account) && (
                    <Grid item xs={12}>
                        <a
                            href={'https://guides.library.uq.edu.au/referencing/endnote'}
                            data-testid={'referencing-endnote'}
                        >
                            Endnote referencing software
                        </a>
                        <StyledBodyCopyDiv>Download and support</StyledBodyCopyDiv>
                    </Grid>
                )}
            </Grid>
        </StyledStandardCard>
    );
};

ReferencingPanel.propTypes = {
    account: PropTypes.object,
};

export default ReferencingPanel;
