import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { _pluralise } from '../shared/learningResourcesHelpers';

import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Typography from '@mui/material/Typography';

const ReadingLists = ({ headingLevel, readingList, readingListLoading, readingListError }) => {
    // add up the number of items across lists, in that rare case where there is more than one list
    const readingListItemCount = readingList => {
        return !readingListError && !!readingList && !!readingList.reading_lists
            ? Object.values(readingList.reading_lists).reduce(
                  (accumulator, currentValue) => accumulator + currentValue.totalCount,
                  0,
              )
            : 0;
    };
    const readingListCount = readingList => {
        return !readingListError && !!readingList && !!readingList.reading_lists ? readingList.reading_lists.length : 0;
    };
    const itemCountLabel = _pluralise('item', readingListItemCount(readingList));
    const courseCode = (!!readingList && readingList.coursecode) || null;

    const readingListLinklabel = () => {
        if (!!readingListError) {
            return `view the the ${courseCode} Reading list`;
        }
        const readingListLength = readingListItemCount(readingList);
        if (readingListLength > 0) {
            return `view the ${readingListLength} ${itemCountLabel} on the ${courseCode} Reading list`;
        }
        return '';
    };
    const talisSubjectUrl = `https://uq.rl.talis.com/courses/${courseCode}.html`;
    return (
        <StandardCard
            noHeader
            standardCardId={`reading-list-${courseCode}`}
            style={{ marginBottom: '1rem', marginTop: '1rem' }}
        >
            <Grid container>
                <Typography
                    component={headingLevel}
                    variant="h6"
                    style={{ paddingTop: '15px', fontWeight: 300 }}
                    data-testid={'reading-list-linkout'}
                >
                    <Fragment>
                        Each subject has a Reading list...{' '}
                        {!!readingListLoading ? (
                            <CircularProgress
                                color="primary"
                                size={20}
                                data-testid="loading-readinglist-suggestions"
                                aria-label="Loading Reading lists"
                            />
                        ) : (
                            <Fragment>
                                {!!courseCode &&
                                    (readingListCount(readingList) > 0 ? (
                                        <a href={talisSubjectUrl}>{readingListLinklabel()}</a>
                                    ) : (
                                        'this subject will have a reading list published soon'
                                    ))}
                            </Fragment>
                        )}
                    </Fragment>
                </Typography>
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
