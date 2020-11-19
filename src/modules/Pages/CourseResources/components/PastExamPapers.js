import React from 'react';
import PropTypes from 'prop-types';

import locale from '../courseResourcesLocale';
import { _courseLink, _pluralise } from '../courseResourcesHelpers';
import { SpacedArrowForwardIcon } from './SpacedArrowForwardIcon';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
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
    }),
    { withTheme: true },
);

export const PastExamPapers = ({ examList, examListLoading, examListError }) => {
    const classes = useStyles();

    const subject = !!examList && examList.coursecode;

    const _extractExtension = url => {
        return url.substring(url.lastIndexOf('.') + 1);
    };

    const listOfExams = !!examList && !!examList.list && examList.list.length > 0 ? examList.list : false;

    const numberExcessExams =
        !!listOfExams && listOfExams.length > locale.myCourses.examPapers.visibleItemsCount
            ? listOfExams.length - locale.myCourses.examPapers.visibleItemsCount
            : 0;

    const examAriaLabel = paper => `past exam paper for ${paper.period} format ${_extractExtension(paper.url)}`;

    const examPaperTitle = `${locale.myCourses.examPapers.title} ${
        !!listOfExams && listOfExams.length > 0 ? `(${listOfExams.length})` : ''
    }`;

    return (
        <StandardCard fullHeight title={examPaperTitle}>
            <Grid container>
                {!!examListError && <Typography>{locale.myCourses.examPapers.unavailable}</Typography>}

                {!examListError && !!examListLoading && (
                    <Grid item xs={'auto'} style={{ width: 80, marginRight: 20, marginBottom: 6, opacity: 0.3 }}>
                        <CircularProgress color="primary" size={20} data-testid="loading-exampaper-suggestions" />
                    </Grid>
                )}

                {!examListError && !examListLoading && (!listOfExams || listOfExams.length === 0) && (
                    <React.Fragment>
                        <Grid item xs={12} className={classes.courseResourceLineItem}>
                            <Typography>{locale.myCourses.examPapers.none}</Typography>
                        </Grid>
                        <Grid item xs={12} className={classes.courseResourceLineItem}>
                            <a href={_courseLink('', locale.myCourses.examPapers.footer.linkOutPattern)}>
                                <SpacedArrowForwardIcon />
                                {locale.myCourses.examPapers.footer.linkLabel}
                            </a>
                        </Grid>
                    </React.Fragment>
                )}
                {!!listOfExams &&
                    listOfExams.length > 0 &&
                    listOfExams.slice(0, locale.myCourses.examPapers.visibleItemsCount).map((paper, index) => {
                        return (
                            <Grid item xs={12} key={`examPapers-${index}`} className={classes.courseResourceLineItem}>
                                <a
                                    aria-label={examAriaLabel(paper)}
                                    className="exam-paper-item"
                                    data-title="examPaperItem"
                                    href={paper.url}
                                    key={`exam-${index}`}
                                    // on-click="linkClicked"
                                >
                                    {paper.period} ({_extractExtension(paper.url)})
                                </a>
                            </Grid>
                        );
                    })}
                {!!listOfExams && listOfExams.length > 0 && !!numberExcessExams && (
                    <Grid item xs={12} data-testid="exam-more-link" className={classes.courseResourceLineItem}>
                        <a
                            // on-click="linkClicked"
                            href={_courseLink(subject, locale.myCourses.examPapers.footer.linkOutPattern)}
                        >
                            <SpacedArrowForwardIcon />
                            {locale.myCourses.examPapers.morePastExams
                                .replace('[numberExcessExams]', numberExcessExams)
                                .replace('[examNumber]', _pluralise('paper', numberExcessExams))}
                        </a>
                    </Grid>
                )}
            </Grid>
        </StandardCard>
    );
};

PastExamPapers.propTypes = {
    examList: PropTypes.any,
    examListError: PropTypes.string,
    examListLoading: PropTypes.bool,
};

export default React.memo(PastExamPapers);
