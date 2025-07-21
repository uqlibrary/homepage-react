import React from 'react';
import PropTypes from 'prop-types';

import { _pluralise } from '../shared/learningResourcesHelpers';
import { SpacedArrowForwardIcon } from '../shared/SpacedArrowForwardIcon';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const StyledItem = styled(Grid)(() => ({
    borderTop: '1px solid #e8e8e8',
    paddingBlock: '15px',
    '& a': {
        display: 'inline-flex',
        alignItems: 'center',
        '&:hover': {
            color: 'inherit',
            backgroundColor: 'inherit',
            '& span': {
                color: '#fff',
                backgroundColor: '#51247A',
            },
        },
        '& p': {
            marginBlock: 0,
        },
        '& span': {
            marginBlock: 0,
        },
    },
    '& .presentLabel': {
        lineHeight: 1.3,
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
const ReadingLists = ({ courseCode, headingLevel, readingList, readingListLoading, readingListError }) => {
    const talisSubjectUrl = courseCode => {
        return 'https://uq.rl.talis.com/courses/[coursecode].html'.replace('[coursecode]', courseCode.toLowerCase());
    };

    const listOfReadingLists =
        !!readingList && !!readingList.reading_lists && readingList.reading_lists.length > 0
            ? readingList.reading_lists
            : false;
    return (
        <StandardCard fullHeight noHeader standardCardId={`reading-list-${courseCode}`}>
            <Typography component={headingLevel} variant="h6" style={{ paddingBottom: '15px', fontWeight: 500 }}>
                Course reading lists
            </Typography>
            <Grid container className={'readinglists'}>
                {!!readingListError && (
                    /* istanbul ignore next */
                    <StyledBodyText variant={'span'} data-testid={`unavailable-${courseCode}`}>
                        Reading list currently unavailable - <a href={talisSubjectUrl(courseCode)}>Try manually</a>
                    </StyledBodyText>
                )}
                {!readingListError && !!readingListLoading && (
                    <Grid item xs={'auto'} style={{ width: 80, opacity: 0.3 }}>
                        <CircularProgress
                            color="primary"
                            size={20}
                            data-testid="loading-readinglist-suggestions"
                            aria-label="Loading Reading lists"
                        />
                    </Grid>
                )}
                {/* eslint-disable-next-line max-len */}
                {!readingListError && !readingListLoading && (!listOfReadingLists || listOfReadingLists.length === 0) && (
                    <React.Fragment>
                        <StyledItem item xs={12}>
                            <StyledBodyText variant={'span'} data-testid="no-reading-lists">
                                No Reading list for this course.
                            </StyledBodyText>
                        </StyledItem>
                        <StyledItem item xs={12}>
                            <a href={talisSubjectUrl(courseCode)}>
                                <SpacedArrowForwardIcon />
                                <StyledBodyText>View older lists</StyledBodyText>
                            </a>
                        </StyledItem>
                    </React.Fragment>
                )}
                {!readingListError && !readingListLoading && !!listOfReadingLists && listOfReadingLists.length >= 1 && (
                    <StyledItem item xs={12}>
                        <StyledBodyText variant={'span'} className={'presentLabel'}>
                            View required and recommended readings on your course reading list.
                        </StyledBodyText>
                    </StyledItem>
                )}
                {/* eslint-disable-next-line max-len */}
                {!readingListError && !readingListLoading && !!listOfReadingLists && listOfReadingLists.length === 1 && (
                    <StyledItem item xs={12} data-testid="reading-list-link">
                        <a href={listOfReadingLists[0].url}>
                            <SpacedArrowForwardIcon />
                            <StyledBodyText variant={'span'}>{`${courseCode} Reading list (contains ${
                                listOfReadingLists[0].totalCount
                            } ${_pluralise('item', listOfReadingLists[0].totalCount)})`}</StyledBodyText>
                        </a>
                    </StyledItem>
                )}
                {!readingListError && !readingListLoading && !!listOfReadingLists && listOfReadingLists.length > 1 && (
                    <StyledItem item xs={12} data-testid="reading-list-link">
                        <a href={talisSubjectUrl(courseCode)}>
                            <SpacedArrowForwardIcon />
                            <StyledBodyText variant={'span'}>{`${courseCode} (has ${
                                listOfReadingLists.length
                            } ${_pluralise('reading list', listOfReadingLists.length)})`}</StyledBodyText>
                        </a>
                    </StyledItem>
                )}
            </Grid>
        </StandardCard>
    );
};

ReadingLists.propTypes = {
    subject: PropTypes.object,
    courseCode: PropTypes.string,
    headingLevel: PropTypes.string,
    readingList: PropTypes.any,
    readingListLoading: PropTypes.bool,
    readingListError: PropTypes.any,
};

export default React.memo(ReadingLists);
