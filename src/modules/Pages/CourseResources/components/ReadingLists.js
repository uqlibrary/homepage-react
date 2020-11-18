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

export const ReadingLists = ({ readingList, readingListLoading, readingListError }) => {
    const classes = useStyles();

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

    // with the new api of calling for reading list by course code, campus and semester,
    // we should theoretically only ever have one reading list
    // but handle multiple anyway...
    const renderMultipleReadingListReference = readingLists => {
        console.log('renderMultipleReadingListReference');
        const coursecode = (!!readingLists && readingLists.length > 0 && readingLists[0].coursecode) || '';
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

    const readingListItemAriaLabel = l => `Reading list item ${l.title}, ${l.referenceType}, ${l.importance}`;

    const singleReadingListLength = readingList => {
        return !!readingList &&
            !!readingList.reading_lists &&
            readingList.reading_lists.length === 1 &&
            !!readingList.reading_lists[0] &&
            !!readingList.reading_lists[0].list
            ? readingList.reading_lists[0].list.length
            : 0;
    };

    const numberExcessReadingLists =
        singleReadingListLength(readingList) > locale.visibleItemsCount.readingLists
            ? singleReadingListLength(readingList) - locale.visibleItemsCount.readingLists
            : 0;

    const singleReadingListLengthTitle = readingList =>
        singleReadingListLength(readingList) > 0 ? `(${singleReadingListLength(readingList)})` : '';

    const readingListTitle = `${locale.myCourses.readingLists.title} ${singleReadingListLengthTitle(readingList)}`;

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

                        {!readingListError &&
                            !readingListLoading &&
                            (!readingList ||
                                (!!readingList.reading_lists && readingList.reading_lists.length === 0)) && (
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

                        {!readingListError &&
                            !readingListLoading &&
                            !!readingList &&
                            readingList.reading_lists.length > 1 && (
                                <Grid item>{renderMultipleReadingListReference(readingList.reading_lists)}</Grid>
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
                                    className={classes.courseResourceLineItem}
                                    data-testid="reading-list-more-link"
                                >
                                    <a
                                        // on-click="linkClicked"
                                        href={readingList.reading_lists[0].url}
                                    >
                                        <SpacedArrowForwardIcon />
                                        {locale.myCourses.readingLists.footer.linkLabel
                                            .replace('[numberExcessReadingLists]', numberExcessReadingLists)
                                            .replace(
                                                '[readingListNumber]',
                                                _pluralise('item', numberExcessReadingLists),
                                            )}
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
    readingList: PropTypes.any,
    readingListLoading: PropTypes.bool,
    readingListError: PropTypes.string,
};

export default React.memo(ReadingLists);
