import React from 'react';
import PropTypes from 'prop-types';

import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import DocumentIcon from '@mui/icons-material/Description';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { SpacedArrowForwardIcon } from '../shared/SpacedArrowForwardIcon';

const StyledItem = styled(Grid)(() => ({
    borderTop: '1px solid #e8e8e8',
    padding: '15px 0',
    '& a': {
        display: 'inline',
    },
    '& a:has(span)': {
        display: 'flex',
        alignItems: 'center',
        '&:hover': {
            color: 'inherit',
            backgroundColor: 'inherit',
            '& span': {
                color: '#fff',
                backgroundColor: '#51247A',
            },
        },
    },
}));
const StyledBodyText = styled(Typography)(() => ({
    marginTop: '1rem',
    marginBottom: '2rem',
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.6,
}));

export const Guides = ({ headingLevel, guideList, guideListLoading, guideListError }) => {
    const coursecode = !!guideList && !!guideList.length > 0 && guideList[0].coursecode;
    return (
        <StandardCard fullHeight noHeader standardCardId={`guides-${coursecode}`}>
            <Typography component={headingLevel} variant="h6" style={{ paddingBottom: '15px', fontWeight: 500 }}>
                Subject guides
            </Typography>
            <Grid container className={'guides'}>
                {!!guideListError && (
                    <StyledBodyText data-testid="guides-springshare-error">
                        Subject guides list currently unavailable
                    </StyledBodyText>
                )}
                {!guideListError && !!guideListLoading && (
                    <Grid item xs={12} style={{ width: 80, opacity: 0.3 }}>
                        <CircularProgress
                            color="primary"
                            size={20}
                            data-testid="loading-guide-suggestions"
                            aria-label="Loading guides"
                        />
                    </Grid>
                )}
                {!guideListError && !guideListLoading && (!guideList || guideList.length === 0) && (
                    <StyledItem item xs={12} data-testid="no-guides">
                        <StyledBodyText>No subject guides for this course.</StyledBodyText>
                    </StyledItem>
                )}
                {!guideListError &&
                    !guideListLoading &&
                    !!guideList &&
                    guideList.length > 0 &&
                    guideList.slice(0, 3).map((guide, index) => {
                        return (
                            <StyledItem item xs={12} key={`guides-${index}`}>
                                <a
                                    aria-label={`library guide for ${guide.title}`}
                                    className="library-guide-item"
                                    data-title="guideListItem"
                                    data-testid={`guide-${index}`}
                                    href={guide.url}
                                    key={`guide-${index}`}
                                >
                                    {guide.title}
                                </a>
                            </StyledItem>
                        );
                    })}
                <StyledItem item key={'studylink-0'} xs={12}>
                    <a
                        data-testid="referencingGuides"
                        id="referencingGuides"
                        href="https://guides.library.uq.edu.au/referencing"
                    >
                        <DocumentIcon style={{ marginRight: 6 }} />
                        <span>Referencing guides</span>
                    </a>
                </StyledItem>
                {/* guides doesnt display a 'view N more' link because Guides doesnt have a search-by-course-code fn*/}
                <StyledItem item key={'studylink-1'} xs={12}>
                    <a data-testid="all-guides" id="all-guides" href="https://guides.library.uq.edu.au/all-guides">
                        <SpacedArrowForwardIcon />
                        <span>All library guides</span>
                    </a>
                </StyledItem>
            </Grid>
        </StandardCard>
    );
};

Guides.propTypes = {
    actions: PropTypes.object,
    headingLevel: PropTypes.string,
    guideList: PropTypes.any,
    guideListLoading: PropTypes.bool,
    guideListError: PropTypes.any,
    readingList: PropTypes.any,
    readingListLoading: PropTypes.bool,
    readingListError: PropTypes.any,
};

export default React.memo(Guides);
