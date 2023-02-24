import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { SpacedArrowForwardIcon } from '../shared/SpacedArrowForwardIcon';
import locale from '../shared/learningResources.locale';
import { _pluralise, trimNotes } from '../shared/learningResourcesHelpers';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { getCampusByCode, unescapeString } from 'helpers/general';

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
        studyLinks: {
            borderBottom: '1px solid #e8e8e8',
            minHeight: '10rem',
        },
    }),
    { withTheme: true },
);

export const ReadingLists = ({ subject, headingLevel, readingList, readingListLoading, readingListError }) => {
    const classes = useStyles();
    const semester = () => {
        const value = subject?.semester || readingList?.period || readingList?.reading_lists?.[0]?.period || '';
        return value ? ` for ${value}` : value;
    };
    const campus = () => {
        const value =
            (subject.CAMPUS && getCampusByCode(subject.CAMPUS)) ||
            readingList?.campus ||
            readingList?.reading_lists?.[0]?.campus ||
            '';
        return value ? ` at ${value}` : value;
    };
    // with the new api of calling for reading list by course code, campus and semester,
    // we should theoretically only ever have one reading list
    // but handle multiple anyway...
    const renderMultipleReadingListReference = (readingLists, coursecode) => {
        const chooseListPrompt = localCourseCode =>
            locale.myCourses.readingLists.error.multiple.replace('[classnumber]', localCourseCode);
        return (
            <Grid container style={{ paddingBottom: 12 }}>
                {!!readingLists && readingLists.length > 1 && (
                    <Typography style={{ paddingBottom: '15px' }} data-testid="reading-list-multiple-label">
                        {chooseListPrompt(coursecode)}
                    </Typography>
                )}
                {!!readingLists &&
                    readingLists.length > 0 &&
                    readingLists.map((list, index) => {
                        return (
                            <Grid
                                item
                                xs={12}
                                data-testid={`multiple-reading-lists-${index}`}
                                key={`multiple-reading-lists-${index}`}
                                className={classes.learningResourceLineItem}
                            >
                                <a
                                    aria-label={`Reading list for ${list.title} ${list.period}`}
                                    href={list.url}
                                    key={`reading-list-link-${index}`}
                                    data-testid={`reading-list-link-${index}`}
                                >
                                    {`${coursecode} ${list.campus}, ${list.period}`}
                                </a>
                            </Grid>
                        );
                    })}
                <Grid item xs={12} className={classes.learningResourceLineItem}>
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
    const readingListItemAriaLabel = l => `Reading list item ${l.title}, ${l.referenceType}, ${l.importance}`;
    const singleReadingListLength = readingList => {
        return !readingListError &&
            !!readingList &&
            !!readingList.reading_lists &&
            readingList.reading_lists.length === 1 &&
            !!readingList.reading_lists[0] &&
            !!readingList.reading_lists[0].totalCount
            ? readingList.reading_lists[0].totalCount
            : 0;
    };
    const numberExcessReadingLists =
        singleReadingListLength(readingList) > locale.myCourses.readingLists.visibleItemsCount
            ? singleReadingListLength(readingList) - locale.myCourses.readingLists.visibleItemsCount
            : 0;
    const itemCountLabel = _pluralise('item', singleReadingListLength(readingList));
    const singleReadingListLengthTitle = readingList =>
        singleReadingListLength(readingList) > 0 ? `(${singleReadingListLength(readingList)} ${itemCountLabel})` : '';
    const readingListTitle = `${
        locale.myCourses.readingLists.title
    }${semester()}${campus()} ${singleReadingListLengthTitle(readingList)}`;
    const courseCode = (!!readingList && readingList.coursecode) || 'unknown';

    return (
        <StandardCard
            noHeader
            standardCardId={`reading-list-${courseCode}`}
            style={{ marginBottom: '1rem', marginTop: '1rem' }}
        >
            <Typography component={headingLevel} variant="h6" style={{ paddingBottom: '15px', fontWeight: 300 }}>
                {readingListTitle}
            </Typography>
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
                            aria-label="Loading Reading lists"
                        />
                    </Grid>
                )}

                {!!readingListError && (
                    /* istanbul ignore next */ <Fragment>
                        <Grid item xs={12} className={classes.learningResourceLineItem}>
                            <Typography>
                                {locale.myCourses.readingLists.error.unavailable.label}
                                <a
                                    style={{ display: 'inline' }}
                                    aria-label={`Reading list for ${subject.classnumber}`}
                                    href={locale.myCourses.readingLists.error.unavailable.linkOut.replace(
                                        '[coursecode]',
                                        subject.classnumber.toLowerCase(),
                                    )}
                                >
                                    {locale.myCourses.readingLists.error.unavailable.tryManually}
                                </a>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} className={classes.learningResourceLineItem}>
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

                {!readingListError &&
                    !readingListLoading &&
                    (!readingList || (!!readingList.reading_lists && readingList.reading_lists.length === 0)) && (
                        <Fragment>
                            <Grid item xs={12} className={classes.learningResourceLineItem}>
                                <Typography>{locale.myCourses.readingLists.error.none}</Typography>
                            </Grid>
                            <Grid item xs={12} className={classes.learningResourceLineItem}>
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

                {!readingListError && !readingListLoading && !!readingList && readingList.reading_lists.length > 1 && (
                    <Grid item>{renderMultipleReadingListReference(readingList.reading_lists, courseCode)}</Grid>
                )}

                {!readingListError &&
                    !readingListLoading &&
                    !!readingList &&
                    !!readingList.reading_lists &&
                    readingList.reading_lists.length === 1 &&
                    !!readingList.reading_lists[0] &&
                    !!readingList.reading_lists[0].list &&
                    !!readingList.reading_lists[0].list.length > 0 &&
                    readingList.reading_lists[0].list
                        // we only show a small number - theres a link to viewall on Talis if there are more
                        .slice(0, locale.myCourses.readingLists.visibleItemsCount)
                        .map((list, index) => {
                            return (
                                <Grid
                                    item
                                    xs={12}
                                    data-testid={`reading-list-${index}`}
                                    key={`reading-list-${index}`}
                                    className={classes.learningResourceLineItem}
                                >
                                    {!!list.itemLink && !!list.title && (
                                        <a
                                            aria-label={readingListItemAriaLabel(list)}
                                            className="reading-list-item"
                                            href={list.itemLink}
                                        >
                                            {unescapeString(list.title)}
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
                                    {!!list.studentNote && (
                                        <Typography>{trimNotes(list.studentNote, locale.notesTrimLength)}</Typography>
                                    )}
                                    <Typography>
                                        {list.referenceType}
                                        {!!list.importance && <Fragment>{` - ${list.importance}`}</Fragment>}
                                    </Typography>
                                </Grid>
                            );
                        })}
                {/* eg MATH4091 has 12 reading list items */}
                {!readingListError &&
                    !readingListLoading &&
                    !!numberExcessReadingLists &&
                    !!readingList &&
                    !!readingList.reading_lists &&
                    readingList.reading_lists.length === 1 &&
                    !!readingList.reading_lists[0].url && (
                        <Grid
                            item
                            xs={12}
                            className={classes.learningResourceLineItem}
                            data-testid="reading-list-more-link"
                        >
                            <a href={readingList.reading_lists[0].url}>
                                <SpacedArrowForwardIcon />
                                {locale.myCourses.readingLists.footer.linkLabel
                                    .replace('[numberExcessReadingLists]', numberExcessReadingLists)
                                    .replace('[readingListNumber]', _pluralise('item', numberExcessReadingLists))}
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
