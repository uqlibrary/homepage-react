import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { SpacedArrowForwardIcon } from './SpacedArrowForwardIcon';

import locale from '../courseresourceslocale';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export const ReadingLists = ({
    classnumber,
    currentClasses,
    filterReadingLists,
    learningResourcesList, // has sub element reading_lists (summary)
    learningResourcesListLoading,
    learningResourcesListError,
    readingList, // list of books. chapters, etc
    readingListLoading,
    readingListError,
}) => {
    const _pluralise = (word, num) => {
        return word + (num === 1 ? '' : 's');
    };

    const filteredReadingLists =
        !!learningResourcesList && learningResourcesList.length > 0
            ? filterReadingLists(learningResourcesList, classnumber, currentClasses)
            : [];

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
    const renderMultipleReadingListReference = (readingListSummaries, classnumber) => {
        const chooseListPrompt = !!classnumber
            ? locale.myCourses.readingLists.multiple.title.replace('[classnumber]', classnumber)
            : '';
        return (
            <Fragment>
                <Typography style={{ paddingBottom: '15px' }}>{chooseListPrompt}</Typography>
                {readingListSummaries.map((list, index) => {
                    return (
                        <Grid
                            key={`multiplereadinglist-${index}`}
                            style={{ borderTop: '1px solid #e8e8e8', padding: '15px 0 0 0' }}
                        >
                            <a
                                aria-label={`Reading list for  ${list.title} ${list.period}`}
                                href={list.url}
                                key={`lrlink-${index}`}
                            >
                                {list.title}, {list.period}
                            </a>
                        </Grid>
                    );
                })}
                <Grid>
                    <a href="http://lr.library.uq.edu.au/index.html">
                        <SpacedArrowForwardIcon />
                        {locale.myCourses.readingLists.multiple.linkOut}
                    </a>
                </Grid>
            </Fragment>
        );
    };

    const talisReadingListLink =
        (!!learningResourcesList &&
            learningResourcesList.length === 1 &&
            !!learningResourcesList[0].reading_lists &&
            learningResourcesList[0].reading_lists.length > 0 &&
            learningResourcesList[0].reading_lists[0].url) ||
        null;

    const numberExcessReadingLists =
        filteredReadingLists.length === 1 && !!readingList && readingList.length > locale.visibleItemsCount.readingLists
            ? readingList.length - locale.visibleItemsCount.readingLists
            : 0;

    const readingListItemAriaLabel = l => `Reading list item ${l.title}, ${l.referenceType}, ${l.importance}`;

    const readingListTitle = `${locale.myCourses.readingLists.title} ${
        !!readingList && readingList.length > 0 ? `(${readingList.length})` : ''
    }`;

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
        <Grid container spacing={3} className={'readingLists'}>
            <Grid item xs={12}>
                <StandardCard style={{ marginBottom: '1rem', marginTop: '1rem' }} title={readingListTitle}>
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
                                !!filteredReadingLists &&
                                filteredReadingLists.length === 1 &&
                                (!learningResourcesList || learningResourcesList.length === 0) && (
                                    <Typography>No reading lists for this course</Typography>
                                )}

                            {!!filteredReadingLists &&
                                filteredReadingLists.length > 1 &&
                                renderMultipleReadingListReference(filteredReadingLists, classnumber || '')}

                            {!!filteredReadingLists &&
                                filteredReadingLists.length === 1 &&
                                !!readingList &&
                                readingList.length > 0 &&
                                readingList
                                    // remove the exam links (they are shown below)
                                    // TODO
                                    // MATH4106 is an example with only an exam. check this works prperly
                                    // ie the count matches the number displayed
                                    // we may have to instead sort it so exam is last? Ugh :(
                                    .filter(item => item.url !== 'https://www.library.uq.edu.au/exams/search.html')
                                    // we only show a small number - theres a link to viewall on Talis if there are more
                                    .slice(0, locale.visibleItemsCount.readingLists)
                                    .map((list, index) => {
                                        return (
                                            <Grid
                                                key={`readingList-${index}`}
                                                style={{ borderTop: '1px solid #e8e8e8', padding: '15px 0 0 0' }}
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
                                                {!list.itemLink && !!list.title && (
                                                    <Typography>{list.title}</Typography>
                                                )}
                                                {!!list.author && (
                                                    <Typography style={{ fontStyle: 'italic' }}>
                                                        {list.author}
                                                        {!!list.year && <Fragment>{`, ${list.year} `}</Fragment>}
                                                    </Typography>
                                                )}
                                                {!!list.startPage && (
                                                    <Typography>
                                                        Pages from {list.startPage}
                                                        {!!list.endPage && (
                                                            <Fragment>{` to  ${list.endPage}`}</Fragment>
                                                        )}
                                                    </Typography>
                                                )}
                                                {!!list.notes && <Typography>{_trimNotes(list.notes)}</Typography>}
                                                <Typography>
                                                    {list.referenceType}
                                                    {!!list.importance && (
                                                        <Fragment>{` - ${list.importance}`}</Fragment>
                                                    )}
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
                                        <SpacedArrowForwardIcon />
                                        {locale.myCourses.readingLists.footer.linkLabel
                                            .replace('[numberExcessReadingLists]', numberExcessReadingLists)
                                            .replace(
                                                '[readingListNumber]',
                                                _pluralise('item', numberExcessReadingLists),
                                            )}
                                    </a>
                                </div>
                            )}
                        </Grid>
                    </Grid>
                </StandardCard>
            </Grid>
        </Grid>
    );
};

ReadingLists.propTypes = {
    classnumber: PropTypes.any,
    currentClasses: PropTypes.any,
    filterReadingLists: PropTypes.any,
    learningResourcesList: PropTypes.any,
    learningResourcesListLoading: PropTypes.bool,
    learningResourcesListError: PropTypes.string,
    readingList: PropTypes.any,
    readingListLoading: PropTypes.bool,
    readingListError: PropTypes.string,
};

export default React.memo(ReadingLists);
