import React from 'react';
import PropTypes from 'prop-types';

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

export const DigitalLearningHub = ({
    dlorStatistics,
    dlorStatisticsLoading,
    dlorStatisticsError,
    account,
    title = 'Build Digital Skills',
    showFirstLink = true,
    subText = 'Find modules, videos and guides for study and teaching',
}) => {
    const hasStatistics = !!account && !dlorStatisticsLoading && !dlorStatisticsError && dlorStatistics;
    return (
        <StyledStandardCard
            subCard
            noPadding
            fullHeight
            primaryHeader
            standardCardId="digitallearninghub-panel"
            title={title}
        >
            <Grid container padding={3} spacing={2}>
                <Grid item xs={12}>
                    {!!showFirstLink && <a href="/digital-learning-hub">Digital Learning Hub</a>}
                    <StyledBodyCopyDiv style={{ marginTop: !!showFirstLink ? '8px' : '0px' }}>
                        {subText}
                    </StyledBodyCopyDiv>
                    {hasStatistics && (
                        <StyledBodyCopyDiv style={{ marginTop: '8px' }}>
                            <a href="#">Your favourites (2)</a>
                        </StyledBodyCopyDiv>
                    )}
                    <StyledBodyCopyDiv style={{ marginTop: '8px' }}>
                        <a href="#">Objects you are following (3)</a>
                    </StyledBodyCopyDiv>
                    <StyledBodyCopyDiv style={{ marginTop: '8px' }}>
                        <a href="#">New objects (23)</a>
                    </StyledBodyCopyDiv>
                </Grid>
            </Grid>
        </StyledStandardCard>
    );
};

DigitalLearningHub.propTypes = {
    account: PropTypes.object,
    title: PropTypes.string,
    showFirstLink: PropTypes.bool,
    subText: PropTypes.string,
    dlorStatistics: PropTypes.object,
    dlorStatisticsLoading: PropTypes.bool,
    dlorStatisticsError: PropTypes.any,
};

export default DigitalLearningHub;
