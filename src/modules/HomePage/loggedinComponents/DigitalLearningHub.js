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

export const DigitalLearningHub = ({
    title = "Build Digital Skills",
    showFirstLink = true,
    subText = "Find modules, videos and guides for study and teaching",
}) => {
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
                    {!!showFirstLink && (<a href="#">Digital Learning Hub</a>)}
                     <StyledBodyCopyDiv style={{ marginTop: !!showFirstLink ? '8px': '0px' }}>
                        {subText} 
                    </StyledBodyCopyDiv >
                    <StyledBodyCopyDiv style={{ marginTop: '8px' }}><a href="#">Your favourites (2)</a></StyledBodyCopyDiv>
                    <StyledBodyCopyDiv style={{ marginTop: '8px' }}><a href="#">Objects you are following  (3)</a></StyledBodyCopyDiv>
                    <StyledBodyCopyDiv style={{ marginTop: '8px' }}><a href="#">New objects (23)</a></StyledBodyCopyDiv>
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
};

export default DigitalLearningHub;
