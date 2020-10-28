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

export const PastExamPapers = ({
    subject,
    learningResourcesList,
    learningResourcesListLoading,
    learningResourcesListError,
}) => {
    const classes = useStyles();

    const _extractExtension = url => {
        return url.substring(url.lastIndexOf('.') + 1);
    };

    const examList =
        !!learningResourcesList && learningResourcesList.length === 1 ? learningResourcesList[0].exam_papers : null;
    const numberExcessExams =
        !!learningResourcesList &&
        learningResourcesList.length > 0 &&
        !!learningResourcesList[0] &&
        learningResourcesList[0].exam_papers.length > locale.visibleItemsCount.examPapers
            ? learningResourcesList[0].exam_papers.length - locale.visibleItemsCount.examPapers
            : 0;

    const examAriaLabel = paper => `past exam paper for ${paper.period} format ${_extractExtension(paper.url)}`;

    const examPaperTitle = `${locale.myCourses.examPapers.title} ${
        !!examList && examList.length > 0 ? `(${examList.length})` : ''
    }`;

    return (
        <Grid container spacing={3} className={'exams'}>
            <Grid item xs={12}>
                <StandardCard style={{ marginBottom: '1rem' }} title={examPaperTitle}>
                    <Grid container>
                        {!!learningResourcesListError && (
                            <Typography>{locale.myCourses.examPapers.unavailable}</Typography>
                        )}
                        {!learningResourcesListError && learningResourcesListLoading && (
                            <Grid
                                item
                                xs={'auto'}
                                style={{ width: 80, marginRight: 20, marginBottom: 6, opacity: 0.3 }}
                            >
                                <CircularProgress
                                    color="primary"
                                    size={20}
                                    data-testid="loading-exampaper-suggestions"
                                />
                            </Grid>
                        )}
                        {!!examList && examList.length === 0 && (
                            <Grid item xs={12} className={classes.courseResourceLineItem}>
                                <Typography>{locale.myCourses.examPapers.none}</Typography>
                                <a href={_courseLink('', locale.myCourses.examPapers.footer.linkOutPattern)}>
                                    <SpacedArrowForwardIcon />
                                    {locale.myCourses.examPapers.footer.linkLabel}
                                </a>
                            </Grid>
                        )}
                        {!!examList &&
                            examList.length > 0 &&
                            examList.slice(0, locale.visibleItemsCount.examPapers).map((paper, index) => {
                                return (
                                    <Grid
                                        item
                                        xs={12}
                                        key={`examPapers-${index}`}
                                        className={classes.courseResourceLineItem}
                                    >
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
                        {!!examList && examList.length > 0 && !!numberExcessExams && (
                            <Grid item xs={12} data-testid="exam-more-link" className={classes.courseResourceLineItem}>
                                <a
                                    // on-click="linkClicked"
                                    href={_courseLink(
                                        subject.classnumber,
                                        locale.myCourses.examPapers.footer.linkOutPattern,
                                    )}
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
            </Grid>
        </Grid>
    );
};

PastExamPapers.propTypes = {
    learningResourcesList: PropTypes.any,
    learningResourcesListError: PropTypes.string,
    learningResourcesListLoading: PropTypes.bool,
    subject: PropTypes.any,
};

export default React.memo(PastExamPapers);
