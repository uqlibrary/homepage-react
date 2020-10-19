import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import locale from './courseresourceslocale';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

export const LearningResources = ({
    subject,
    readingList,
    readingListLoading,
    readingListError,
    learningResourcesList,
    learningResourcesListLoading,
    learningResourcesListError,
}) => {
    const _pluralise = (word, num) => {
        return word + (num === 1 ? '' : 's');
    };

    const _trimNotes = value => {
        if (value && value.length > this.notesTrimLength) {
            let _trimmed = value.substring(0, this.notesTrimLength);
            // trim on word boundary
            _trimmed = _trimmed.substring(0, _trimmed.lastIndexOf(' '));
            return _trimmed + '...';
        } else {
            return value;
        }
    };

    // PHIL1002 is currently an example of multiple reading lists
    const renderMultipleReadingListReference = (readingLists, classnumber) => {
        console.log('multiple: readingLists = ', readingLists);
        const chooseListprompt = !!classnumber
            ? `More than one reading list found for ${classnumber}. Please select a list:`
            : '';
        return (
            <Fragment>
                <Typography>{chooseListprompt}</Typography>
                {readingLists.map((list, index) => {
                    <Grid key={`multiplereadinglist-${index}`} container style={{ borderTop: '1px solid #e8e8e8' }}>
                        <a
                            aria-label={`Reading list for  ${list.title} ${list.period}`}
                            href={list.url}
                            key={`lrlink-${index}`}
                        >
                            {list.title}, {list.period}
                        </a>
                    </Grid>;
                })}
                <Grid>
                    <a href="http://lr.library.uq.edu.au/index.html">
                        <ArrowForwardIcon style={{ paddingRight: '1rem' }} />
                        Search other reading lists
                    </a>
                </Grid>
            </Fragment>
        );
    };

    const talisReadingListLink =
        (!!learningResourcesList &&
            learningResourcesList.length > 0 &&
            !!learningResourcesList[0].reading_lists &&
            learningResourcesList[0].reading_lists.length > 0 &&
            learningResourcesList[0].reading_lists[0].url) ||
        null;

    const numberExcessReadingLists =
        !!readingList && readingList.length > locale.visibleItemsCount.readingLists
            ? readingList.length - locale.visibleItemsCount.readingLists
            : 0;

    const readingListItemAriaLabel = l => `Reading list item ${l.title}, ${l.referenceType}, ${l.importance}`;

    const readingListTitle = `${locale.readingListText} ${
        !!readingList && readingList.length > 0 ? `(${readingList.length})` : ''
    }`;

    console.log('check learningResourcesList for mult lusts: ', learningResourcesList);

    /*
    let classes = account.classes || null;

    // dev hack while we wait for api update (needs more fields)
    if (classes === null) {
        classes = [
            {
                SUBJECT: 'FREN',
                subjectLevel: '1010',
                classnumber: 'FREN1010',
                classname: 'Introductory French 1',
            },
            {
                SUBJECT: 'HIST',
                subjectLevel: '1201',
                classnumber: 'HIST1201',
                classname: 'The Australian  Experience',
            },
            {
                SUBJECT: 'PHIL',
                subjectLevel: '1002',
                classnumber: 'PHIL1002',
                classname: 'Introduction to Philosophy: What is Philosophy?',
            },
        ];
    }
    */

    return (
        <StandardCard
            className="readingLists"
            style={{ width: '100%', marginBottom: '1rem', marginTop: '1rem' }}
            title={readingListTitle}
        >
            <Grid container>
                <Grid item xs={12}>
                    {(!!readingListLoading || !!learningResourcesListLoading) && (
                        <Grid
                            item
                            xs={'auto'}
                            style={{
                                width: 80,
                                marginRight: 20,
                                marginBottom: 6,
                                opacity: 0.3,
                            }}
                        >
                            <CircularProgress color="primary" size={20} id="loading-suggestions" />
                        </Grid>
                    )}

                    {(!!readingListError || !!learningResourcesListError) && (
                        <Typography>Reading lists currently unavailable</Typography>
                    )}

                    {(!readingListError || !learningResourcesListError) &&
                        (!learningResourcesList || learningResourcesList.length === 0) && (
                            <Typography>No reading lists for this course</Typography>
                        )}

                    {!!learningResourcesList &&
                        learningResourcesList.length > 0 &&
                        !!learningResourcesList[0].reading_lists &&
                        renderMultipleReadingListReference(
                            learningResourcesList[0].reading_lists,
                            subject.classnumber || '',
                        )}

                    {!!learningResourcesList &&
                        learningResourcesList.length === 1 &&
                        !!readingList &&
                        readingList.length > 0 &&
                        readingList
                            // remove the exam links (they are shown below)
                            .filter(item => item.url !== 'https://www.library.uq.edu.au/exams/search.html')
                            // we only show a small number - theres a link to viewall on Talis if there are more
                            .slice(0, locale.visibleItemsCount.readingLists)
                            .map((list, index) => {
                                return (
                                    <Grid
                                        key={`readingList-${index}`}
                                        style={{ borderTop: '1px solid #e8e8e8', padding: '15px 0' }}
                                    >
                                        {!!list.itemLink && !!list.title && (
                                            <Grid className="subhead">
                                                <a
                                                    aria-label={readingListItemAriaLabel}
                                                    className="reading-list-item"
                                                    href={list.itemLink}
                                                    // on-click="linkClicked"
                                                >
                                                    {list.title}
                                                </a>
                                            </Grid>
                                        )}
                                        {!list.itemLink && !!list.title && <Typography>{list.title}</Typography>}
                                        {!!list.author && (
                                            <Typography style={{ fontStyle: 'italic' }}>
                                                {list.author}
                                                {!!list.year && <Fragment>{`, ${list.year} `}</Fragment>}
                                            </Typography>
                                        )}
                                        {!!list.startPage && (
                                            <Typography>
                                                Pages from {list.startPage}
                                                {!!list.endPage && <Fragment>{` to  ${list.endPage}`}</Fragment>}
                                            </Typography>
                                        )}
                                        {!!list.notes && <Typography>{_trimNotes(list.notes)}</Typography>}
                                        <Typography>
                                            {list.referenceType}
                                            {!!list.importance && <Fragment>{` - ${list.importance}`}</Fragment>}
                                        </Typography>
                                    </Grid>
                                );
                            })}
                    {/* eg MATH4091 has 12 reading lists */}
                    {!!talisReadingListLink && !!numberExcessReadingLists && (
                        <div>
                            <a
                                // on-click="linkClicked"
                                href={talisReadingListLink}
                            >
                                <ArrowForwardIcon style={{ paddingRight: '1rem' }} />
                                {numberExcessReadingLists} more {_pluralise('item', numberExcessReadingLists)}
                            </a>
                        </div>
                    )}
                </Grid>
            </Grid>
        </StandardCard>
    );
};

LearningResources.propTypes = {
    subject: PropTypes.any,
    readingList: PropTypes.any,
    readingListLoading: PropTypes.bool,
    readingListError: PropTypes.string,
    learningResourcesList: PropTypes.any,
    learningResourcesListLoading: PropTypes.bool,
    learningResourcesListError: PropTypes.string,
};

export default React.memo(LearningResources);
