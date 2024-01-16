import React from 'react';
import PropTypes from 'prop-types';

import { SpacedArrowForwardIcon } from '../shared/SpacedArrowForwardIcon';
import locale from '../shared/learningResources.locale';
import { _pluralise } from '../shared/learningResourcesHelpers';

import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(
    () => ({
        learningResourceLineItem: {
            borderTop: '1px solid #e8e8e8',
            padding: '15px 0',
            '& a': {
                display: 'flex',
                alignItems: 'center',
            },
        },
    }),
    { withTheme: true },
);
const ReadingLists = ({ headingLevel, readingList, readingListLoading, readingListError }) => {
    const classes = useStyles();

    const courseCode = (!!readingList && readingList.coursecode) || null;
    const talisSubjectUrl = courseCode => `https://uq.rl.talis.com/courses/${courseCode}.html`;

    const listOfReadingLists =
        !!readingList && !!readingList.reading_lists && readingList.reading_lists.length > 0
            ? readingList.reading_lists
            : false;
    const linkText = courseCode => {
        // add up the number of items across lists, in that rare case where there is more than one list
        const readingListItemCount = readingList => {
            return !readingListError && !!readingList && !!readingList.reading_lists
                ? Object.values(readingList.reading_lists).reduce(
                      (accumulator, currentValue) => accumulator + currentValue.totalCount,
                      0,
                  )
                : 0;
        };
        const noun = _pluralise('item', readingListItemCount(readingList));
        return `${courseCode} Reading list (contains ${readingListItemCount(readingList)} ${noun})`;
    };

    return (
        <StandardCard noHeader fullHeight standardCardId={`reading-list-${courseCode}`}>
            <Typography component={headingLevel} variant="h6" style={{ paddingBottom: '15px', fontWeight: 300 }}>
                {locale.myCourses.readingLists.title}
            </Typography>
            <Grid container className={'readinglists'}>
                <Grid item xs={12} className={classes.learningResourceLineItem}>
                    <span style={{ paddingBottom: '1rem', lineHeight: 1.3 }}>
                        View required and recommended readings on your course reading list.
                    </span>
                </Grid>
                {!!readingListError && (
                    /* istanbul ignore next */
                    <Typography>{locale.myCourses.readingLists.unavailable}</Typography>
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
                        <Grid item xs={12} className={classes.learningResourceLineItem}>
                            <Typography data-testid="no-reading-lists">
                                {locale.myCourses.readingLists.error.none}
                            </Typography>
                        </Grid>
                    </React.Fragment>
                )}
                {!readingListError && !readingListLoading && !!listOfReadingLists && listOfReadingLists.length > 0 && (
                    <Grid item xs={12} data-testid="reading-list-link" className={classes.learningResourceLineItem}>
                        <a href={talisSubjectUrl(courseCode)}>
                            <SpacedArrowForwardIcon />
                            {linkText(courseCode)}
                        </a>
                    </Grid>
                )}
            </Grid>
        </StandardCard>
    );
};

ReadingLists.propTypes = {
    subject: PropTypes.object,
    headingLevel: PropTypes.string,
    readingList: PropTypes.any,
    readingListLoading: PropTypes.bool,
    readingListError: PropTypes.any,
};

export default React.memo(ReadingLists);
