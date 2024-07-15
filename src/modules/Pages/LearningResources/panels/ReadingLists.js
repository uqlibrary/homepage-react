import React from 'react';
import PropTypes from 'prop-types';

import locale from '../shared/learningResources.locale';
import { _pluralise } from '../shared/learningResourcesHelpers';
import { SpacedArrowForwardIcon } from '../shared/SpacedArrowForwardIcon';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const StyledItem = styled(Grid)(() => ({
    borderTop: '1px solid #e8e8e8',
    padding: '15px 0',
    '& a': {
        display: 'flex',
        alignItems: 'center',
    },
    '& .presentLabel': {
        paddingBottom: '1rem',
        lineHeight: 1.3,
    },
}));

const ReadingLists = ({ courseCode, headingLevel, readingList, readingListLoading, readingListError }) => {
    const talisSubjectUrl = courseCode => {
        return locale.myCourses.readingLists.courseLink.replace('[coursecode]', courseCode.toLowerCase());
    };

    const listOfReadingLists =
        !!readingList && !!readingList.reading_lists && readingList.reading_lists.length > 0
            ? readingList.reading_lists
            : false;
    return (
        <StandardCard fullHeight noHeader standardCardId={`reading-list-${courseCode}`}>
            <Typography component={headingLevel} variant="h6" style={{ paddingBottom: '15px', fontWeight: 300 }}>
                {locale.myCourses.readingLists.title}
            </Typography>
            <Grid container className={'readinglists'}>
                {!!readingListError && (
                    /* istanbul ignore next */
                    <Typography data-testid={`unavailable-${courseCode}`}>
                        Reading list currently unavailable - <a href={talisSubjectUrl(courseCode)}>Try manually</a>
                    </Typography>
                )}
                {!readingListError && !!readingListLoading && (
                    <Grid item xs={'auto'} style={{ width: 80, marginRight: 20, marginBottom: 6, opacity: 0.3 }}>
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
                            <Typography data-testid="no-reading-lists">No Reading list for this course.</Typography>
                        </StyledItem>
                        <StyledItem item xs={12}>
                            <a href={talisSubjectUrl(courseCode)}>
                                <SpacedArrowForwardIcon />
                                View older lists
                            </a>
                        </StyledItem>
                    </React.Fragment>
                )}
                {/* eslint-disable-next-line max-len */}
                {!readingListError && !readingListLoading && !!listOfReadingLists && listOfReadingLists.length === 1 && (
                    <React.Fragment>
                        <StyledItem item xs={12}>
                            <span className={'presentLabel'}>{locale.myCourses.readingLists.presentLabel}</span>
                        </StyledItem>
                        <StyledItem item xs={12} data-testid="reading-list-link">
                            <a href={listOfReadingLists[0].url}>
                                <SpacedArrowForwardIcon />
                                {`${courseCode} Reading list (contains ${listOfReadingLists[0].totalCount} ${_pluralise(
                                    'item',
                                    listOfReadingLists[0].totalCount,
                                )})`}
                            </a>
                        </StyledItem>
                    </React.Fragment>
                )}
                {!readingListError && !readingListLoading && !!listOfReadingLists && listOfReadingLists.length > 1 && (
                    <React.Fragment>
                        <StyledItem item xs={12}>
                            <span className={'presentLabel'}>{locale.myCourses.readingLists.presentLabel}</span>
                        </StyledItem>
                        <StyledItem item xs={12} data-testid="reading-list-link">
                            <a href={talisSubjectUrl(courseCode)}>
                                <SpacedArrowForwardIcon />
                                {`${courseCode} (has ${listOfReadingLists.length} ${_pluralise(
                                    'reading list',
                                    listOfReadingLists.length,
                                )})`}
                            </a>
                        </StyledItem>
                    </React.Fragment>
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
