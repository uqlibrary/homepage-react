import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import locale from './courseresourceslocale';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

export const LearningResources = ({
    actions,
    classnumber,
    currentClasses,
    learningResourcesList, // has sub element reading_lists (summary)
    learningResourcesListLoading,
    learningResourcesListError,
    readingList, // is list of books and chapeters, etc
    readingListLoading,
    readingListError,
    subject,
}) => {
    console.log('LearningResources start: readingList = ', readingList);
    const _pluralise = (word, num) => {
        return word + (num === 1 ? '' : 's');
    };

    const filterReadingLists = (learningResourcesList, classnumber, classes) => {
        console.log('filterReadingLists classnumber = ', classnumber);
        console.log('filterReadingLists learningResourcesList = ', learningResourcesList);
        const readingLists =
            (!!learningResourcesList &&
                learningResourcesList.length > 0 &&
                !!learningResourcesList[0] &&
                learningResourcesList[0].reading_lists) ||
            [];
        console.log('filterReadingLists: learningResourcesList[0].reading_lists =  ', readingLists);

        if (!readingLists || readingLists.length === 0) {
            console.log('filterReadingLists: list is empty');
            return [];
        }

        console.log('before filter: ', readingLists[0].reading_lists);
        if (readingLists.length === 1) {
            console.log('filterReadingLists: single reading list');
            return readingLists;
        }

        // do better
        const enrolment = classes.filter(aClass => aClass.classnumber === classnumber)[0];

        console.log('befor filter, resourcesList[0].reading_lists = ', learningResourcesList[0].reading_lists);
        const x = readingLists.filter(item => {
            // // if (searchedCourse != null && searchedCourse.courseId === course.courseId) {
            // /*
            //     search results are currently an array of results like this:
            //     {
            //         "name": "MATH2010",
            //         "url": "http:\/\/lr.library.uq.edu.au\/lists\/B89931FE-50AE-7102-7925-18EE386EAA4D",
            //         "type": "learning_resource",
            //         "course_title": "Analysis of Ordinary Differential Equations",
            //         "campus": "St Lucia",
            //         "period": "Semester 2 2020"
            //     }
            // */
            // //     semesterString = searchedCourse.term === enrolment.semester;
            // //     campus = searchedCourse.campus;
            // // } else {
            if (item.period === enrolment.semester) {
                console.log('filterReadingLists: matches ', enrolment.semester);
            } else {
                console.log('filterReadingLists: no match ', enrolment.semester, ' != ', item.period);
            }
            return item.period === enrolment.semester;
            // }
        });
        console.log('filterReadingLists produces: ', x);
        return x;
    };

    // get the long Talis string, like 2109F2EC-AB0B-482F-4D30-1DD3531E46BE fromm the Talis url
    const getReadingListId = readingList => {
        let id = '';
        if (!!readingList.url) {
            const url = readingList.url;
            id = url.substring(url.lastIndexOf('/') + 1);
            if (id.indexOf('.') !== -1) {
                id = id.substring(0, url.indexOf('.'));
            }
        }
        return id;
    };

    function getReadingListWhenResourceListAvailable(learningResourcesList) {
        // console.log('getReadingListWhenResourceListAvailable: filteredReadingLists = ', filteredReadingLists);
        const filteredReadingLists =
            !!learningResourcesList && learningResourcesList.length > 0
                ? filterReadingLists(learningResourcesList, classnumber, currentClasses)
                : [];
        console.log('LearningResources 1: filteredReadingLists = ', filteredReadingLists);

        if (!!filteredReadingLists && filteredReadingLists.length === 1) {
            const readingListId = getReadingListId(filteredReadingLists[0]);
            console.log('readingListId = ', readingListId);
            if (readingListId !== '' && readingListId !== false) {
                // I think false is the value to check against here?
                // !!actions.loadReadingLists &&
                actions.loadReadingLists(readingListId);
                console.log('readingList fetched');
            } else {
                console.log('readingList not fetched');
            }
        }
    }

    React.useEffect(() => {
        console.log('useEffect');
        getReadingListWhenResourceListAvailable(learningResourcesList);
    }, [learningResourcesList]);

    const filteredReadingLists =
        !!learningResourcesList && learningResourcesList.length > 0
            ? filterReadingLists(learningResourcesList, classnumber, currentClasses)
            : [];
    console.log('LearningResources 2: filteredReadingLists = ', filteredReadingLists);

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
        console.log('renderMultipleReadingListReference: readingLists = ', readingListSummaries);
        console.log('renderMultipleReadingListReference: classnumber = ', classnumber);
        const chooseListprompt = !!classnumber
            ? `More than one reading list found for ${classnumber}. Please select a list:`
            : '';
        return (
            <Fragment>
                <Typography style={{ paddingBottom: '15px' }}>{chooseListprompt}</Typography>
                {readingListSummaries.map((list, index) => {
                    return (
                        <Grid
                            key={`multiplereadinglist-${index}`}
                            style={{ borderTop: '1px solid #e8e8e8', padding: '15px 0' }}
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

    console.log('LearningResources: learningResourcesList = ', learningResourcesList);
    console.log('LearningResources: learningResourcesListLoading = ', learningResourcesListLoading);
    console.log('LearningResources: learningResourcesListError = ', learningResourcesListError);
    // const classnumber = 'FREN1010';

    // if (!(!!filteredReadingLists && filteredReadingLists.length === 1 && !!readingList)) {
    //     console.log('debug: !!filteredReadingLists = ', !!filteredReadingLists);
    //     console.log('debug: length = ', !!filteredReadingLists && filteredReadingLists.length === 1);
    //     console.log('debug: readingList = ', readingList);
    // }
    // if (!!filteredReadingLists && filteredReadingLists.length === 1 && !!readingList) {
    //     console.log('now we will display ', readingList);
    // } else {
    //     console.log('wont display reading list');
    // }

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
                        !!filteredReadingLists &&
                        filteredReadingLists.length === 1 &&
                        (!learningResourcesList || learningResourcesList.length === 0) && (
                            <Typography>No reading lists for this course</Typography>
                        )}

                    {!!filteredReadingLists &&
                        filteredReadingLists.length > 1 &&
                        renderMultipleReadingListReference(
                            // learningResourcesList[0].reading_lists,
                            filteredReadingLists,
                            subject.classnumber || '',
                        )}

                    {!!filteredReadingLists &&
                        filteredReadingLists.length === 1 &&
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
    actions: PropTypes.object,
    classnumber: PropTypes.any,
    currentClasses: PropTypes.any,
    learningResourcesList: PropTypes.any,
    learningResourcesListLoading: PropTypes.bool,
    learningResourcesListError: PropTypes.string,
    readingList: PropTypes.any,
    readingListLoading: PropTypes.bool,
    readingListError: PropTypes.string,
    subject: PropTypes.any,
};

export default React.memo(LearningResources);
