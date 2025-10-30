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
    title = 'Build digital skills',
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
                    <a href="/digital-learning-hub">Digital Learning Hub</a>
                    <StyledBodyCopyDiv style={{ marginTop: '8px' }}>{subText}</StyledBodyCopyDiv>
                    {hasStatistics && (
                        <StyledBodyCopyDiv style={{ marginTop: '8px' }}>
                            <a href="/digital-learning-hub?type=favourite">
                                Your favourites ({dlorStatistics?.my_favourites})
                            </a>
                        </StyledBodyCopyDiv>
                    )}
                    <StyledBodyCopyDiv style={{ marginTop: '8px' }}>
                        <a href="/digital-learning-hub?type=featured">
                            Featured objects ({dlorStatistics?.featured_objects})
                        </a>
                    </StyledBodyCopyDiv>
                </Grid>
            </Grid>
        </StyledStandardCard>
    );
};

DigitalLearningHub.propTypes = {
    account: PropTypes.object,
    title: PropTypes.string,
    subText: PropTypes.string,
    dlorStatistics: PropTypes.object,
    dlorStatisticsLoading: PropTypes.bool,
    dlorStatisticsError: PropTypes.any,
};

export default DigitalLearningHub;
