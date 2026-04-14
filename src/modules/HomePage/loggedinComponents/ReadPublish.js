import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { linkToDrupal } from 'helpers/general';

import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

const StyledBodyCopyDiv = styled('div')(() => ({
    fontWeight: 400,
    lineHeight: '150%', // 24px
}));
const StyledStandardCard = styled(StandardCard)(() => ({
    '& .cardContentNoPadding': {
        marginTop: '-24px',
    },
}));

export const ReadPublish = () => {
    return (
        <StyledStandardCard
            subCard
            noPadding
            fullHeight
            primaryHeader
            standardCardId="readpublish-panel"
            title="Open access publishing"
        >
            <Grid container padding={3} spacing={2}>
                <Grid item xs={12}>
                    <a href="https://espace.library.uq.edu.au/journals/search/">Publish in the right journal</a>
                    <StyledBodyCopyDiv style={{ marginTop: '8px' }}>
                        Find and evaluate the best publishing options using Journal Search.
                    </StyledBodyCopyDiv>
                </Grid>
                <Grid item xs={12}>
                    <StyledBodyCopyDiv>
                        Visit{' '}
                        <Link
                            to={linkToDrupal('/research-and-publish/open-research/open-access-publishing-agreements')}
                        >
                            Open access publishing agreements
                        </Link>{' '}
                        for more information.
                    </StyledBodyCopyDiv>
                </Grid>
            </Grid>
        </StyledStandardCard>
    );
};

ReadPublish.propTypes = {
    account: PropTypes.object,
    journalSearchList: PropTypes.object,
    journalSearchLoading: PropTypes.bool,
    journalSearchError: PropTypes.bool,
};

export default ReadPublish;
