import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { linkToDrupal } from 'helpers/general';

import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

const StyledBodyCopyDiv = styled('div')(() => ({
    fontWeight: 400,
}));

export const ReadPublish = () => {
    return (
        <StandardCard
            subCard
            noPadding
            fullHeight
            primaryHeader
            standardCardId="readpublish-panel"
            title="Read and publish"
        >
            <Grid container padding={3} spacing={2} style={{ paddingBlock: '16px' }}>
                <Grid item xs={12}>
                    <a href="https://espace.library.uq.edu.au/journals/search/">Publish in the right journal</a>
                    <StyledBodyCopyDiv>
                        Find and evaluate the best publishing options using Journal Search.
                    </StyledBodyCopyDiv>
                </Grid>
                <Grid item xs={12}>
                    <StyledBodyCopyDiv>
                        Visit{' '}
                        <Link to={linkToDrupal('/research-and-publish/open-research/read-and-publish-agreements')}>
                            Read and Publish Agreements
                        </Link>{' '}
                        for more information.
                    </StyledBodyCopyDiv>
                </Grid>
            </Grid>
        </StandardCard>
    );
};

ReadPublish.propTypes = {
    account: PropTypes.object,
    journalSearchList: PropTypes.object,
    journalSearchLoading: PropTypes.bool,
    journalSearchError: PropTypes.bool,
};

export default ReadPublish;
