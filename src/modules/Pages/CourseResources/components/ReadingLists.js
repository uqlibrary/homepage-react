import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { SpacedArrowForwardIcon } from './SpacedArrowForwardIcon';
import locale from '../courseResourcesLocale';
import { _pluralise } from '../courseResourcesHelpers';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(
    () => ({
        courseResourceLineItem: {
            borderTop: '1px solid #e8e8e8',
            padding: '15px 0',
            '& a': {
                display: 'flex',
                alignItems: 'center',
            },
        },
        studyLinks: {
            borderBottom: '1px solid #e8e8e8',
            minHeight: '10rem',
        },
    }),
    { withTheme: true },
);

export const ReadingLists = ({
    currentClasses,
    getCampusByCode,
    keywordPresets,
    readingList,
    readingListLoading,
    readingListError,
    tabType,
}) => {
    const classes = useStyles();

    const filterReadingLists = React.useCallback(
        (readingLists, classes) => {
            if (!readingLists || readingLists.length === 0) {
                return [];
            }

            if (readingLists.reading_lists.length === 1) {
                return readingLists;
            }

            const classnumber = readingLists.coursecode;

            const extractDetailsOfEnrolmentFromCurrentClassList = (classes, classnumber) => {
                const subjectTemplate = {
                    semester: null,
                    CAMPUS: null,
                    INSTRUCTION_MODE: null,
                };
                const subjectlist =
                    !!classes && classes.filter(aClass => !!aClass && aClass.classnumber === classnumber);
                const thisSubject = (!!subjectlist && subjectlist.length > 0 && subjectlist[0]) || null;
                return {
                    semester: thisSubject.semester || subjectTemplate.semester,
                    CAMPUS: thisSubject.CAMPUS || subjectTemplate.CAMPUS,
                    INSTRUCTION_MODE: thisSubject.INSTRUCTION_MODE || subjectTemplate.INSTRUCTION_MODE,
                };
            };

            if (tabType === 'searchresults') {
                const semesterString = keywordPresets.period;
                const campus = keywordPresets.campus;
                return readingLists.reading_lists.filter(item => {
                    return item.period === semesterString && item.campus.indexOf(campus) !== -1;
                });
            } else {
                const subjectEnrolment = extractDetailsOfEnrolmentFromCurrentClassList(classes, classnumber);
                const semesterString = subjectEnrolment.semester;
                const campus = getCampusByCode(subjectEnrolment.CAMPUS);
                return readingLists.reading_lists.filter(item => {
                    return (
                        item.period === semesterString &&
                        (item.campus.indexOf(campus) !== -1 || subjectEnrolment.INSTRUCTION_MODE === 'EX')
                    );
                });
            }
        },
        [tabType, keywordPresets],
    );

    const filteredReadingLists = filterReadingLists(readingList, currentClasses);

    const _trimNotes = value => {
        if (value && value.length > locale.notesTrimLength) {
            let _trimmed = value.substring(0, locale.notesTrimLength);
            // trim on word boundary
            _trimmed = _trimmed.substring(0, _trimmed.lastIndexOf(' '));
            return _trimmed + '...';
        } else {
            return value;
        }
    };

    // PHIL1002 is currently an example of multiple reading lists
    // with the new api of calling for reading list by course code , campus and semester,
    // we should theoretically only ever have one reading list. but handle multiple anyway...
    const renderMultipleReadingListReference = (readingLists, coursecode) => {
        const chooseListPrompt = coursecode =>
            locale.myCourses.readingLists.error.multiple.replace('[classnumber]', coursecode);
        return (
            <Grid container style={{ paddingBottom: 12 }}>
                {!!coursecode && (
                    <Typography style={{ paddingBottom: '15px' }}>{chooseListPrompt(coursecode)}</Typography>
                )}
                {readingLists.map((list, index) => {
                    return (
                        <Grid
                            item
                            xs={12}
                            data-testid={`multiple-reading-lists-${index}`}
                            key={`multiple-reading-lists-${index}`}
                            className={classes.courseResourceLineItem}
                        >
                            <a
                                aria-label={`Reading list for ${list.title} ${list.period}`}
                                href={list.url}
                                key={`reading-list-link-${index}`}
                            >
                                {coursecode} {list.campus}, {list.period}
                            </a>
                        </Grid>
                    );
                })}
                <Grid item xs={12} className={classes.courseResourceLineItem}>
                    <a
                        data-testid="multiple-reading-list-search-link"
                        href={locale.myCourses.readingLists.error.footer.linkOut}
                    >
                        <SpacedArrowForwardIcon />
                        {locale.myCourses.readingLists.error.footer.linkLabel}
                    </a>
                </Grid>
            </Grid>
        );
    };

    const numberExcessReadingLists =
        filteredReadingLists.length === 1 && !!readingList && readingList.length > locale.visibleItemsCount.readingLists
            ? readingList.length - locale.visibleItemsCount.readingLists
            : 0;

    const readingListItemAriaLabel = l => `Reading list item ${l.title}, ${l.referenceType}, ${l.importance}`;

    const singleReadingList =
        !!filteredReadingLists &&
        !!filteredReadingLists.reading_lists &&
        filteredReadingLists.reading_lists.length === 1
            ? filteredReadingLists.reading_lists.pop()
            : null;

    const readingListTitle = `${locale.myCourses.readingLists.title} ${
        !!singleReadingList && !!singleReadingList.list && singleReadingList.list.length > 0
            ? `(${singleReadingList.list.length})`
            : ''
    }`;

    console.log('readinglist = ', readingList);

    return (
        <Grid container spacing={3} className={'readingLists'}>
            <Grid item xs={12}>
                <StandardCard style={{ marginBottom: '1rem', marginTop: '1rem' }} title={readingListTitle}>
                    <Grid container>
                        {!!readingListLoading && (
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
                                <CircularProgress
                                    color="primary"
                                    size={20}
                                    data-testid="loading-readinglist-suggestions"
                                />
                            </Grid>
                        )}

                        {!!readingListError && (
                            <Fragment>
                                <Grid item xs={12} className={classes.courseResourceLineItem}>
                                    <Typography>{locale.myCourses.readingLists.unavailable}</Typography>
                                </Grid>
                                <Grid item xs={12} className={classes.courseResourceLineItem}>
                                    <a
                                        data-testid="multiple-reading-list-search-link"
                                        href={locale.myCourses.readingLists.error.footer.linkOut}
                                    >
                                        <SpacedArrowForwardIcon />
                                        {locale.myCourses.readingLists.error.footer.linkLabel}
                                    </a>
                                </Grid>
                            </Fragment>
                        )}

                        {!filteredReadingLists && (
                            <Fragment>
                                <Grid item xs={12} className={classes.courseResourceLineItem}>
                                    <Typography>{locale.myCourses.readingLists.error.none}</Typography>
                                </Grid>
                                <Grid item xs={12} className={classes.courseResourceLineItem}>
                                    <a
                                        data-testid="multiple-reading-list-search-link"
                                        href={locale.myCourses.readingLists.error.footer.linkOut}
                                    >
                                        <SpacedArrowForwardIcon />
                                        {locale.myCourses.readingLists.error.footer.linkLabel}
                                    </a>
                                </Grid>
                            </Fragment>
                        )}

                        {!!filteredReadingLists && filteredReadingLists.length > 1 && (
                            <Grid item>
                                {renderMultipleReadingListReference(filteredReadingLists, readingList.coursecode || '')}
                            </Grid>
                        )}

                        {!!singleReadingList &&
                            singleReadingList.list
                                // remove the exam links (they are shown in the exams section below)
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
                                            item
                                            xs={12}
                                            data-testid={`reading-list-${index}`}
                                            key={`reading-list-${index}`}
                                            className={classes.courseResourceLineItem}
                                        >
                                            {!!list.itemLink && !!list.title && (
                                                <a
                                                    aria-label={readingListItemAriaLabel}
                                                    className="reading-list-item"
                                                    href={list.itemLink}
                                                    // on-click="linkClicked"
                                                >
                                                    {list.title}
                                                </a>
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
                        {!!numberExcessReadingLists && !!readingList && !!readingList.url && (
                            <Grid
                                item
                                xs={12}
                                className={classes.courseResourceLineItem}
                                data-testid="reading-list-more-link"
                            >
                                <a
                                    // on-click="linkClicked"
                                    href={readingList.url}
                                >
                                    <SpacedArrowForwardIcon />
                                    {locale.myCourses.readingLists.footer.linkLabel
                                        .replace('[numberExcessReadingLists]', numberExcessReadingLists)
                                        .replace('[readingListNumber]', _pluralise('item', numberExcessReadingLists))}
                                </a>
                            </Grid>
                        )}
                    </Grid>
                </StandardCard>
            </Grid>
        </Grid>
    );
};

ReadingLists.propTypes = {
    currentClasses: PropTypes.any,
    getCampusByCode: PropTypes.any,
    keywordPresets: PropTypes.any,
    readingList: PropTypes.any,
    readingListLoading: PropTypes.bool,
    readingListError: PropTypes.string,
    tabType: PropTypes.string,
};

export default React.memo(ReadingLists);
