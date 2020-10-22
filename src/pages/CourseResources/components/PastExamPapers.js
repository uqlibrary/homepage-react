import React from 'react';
import PropTypes from 'prop-types';

import locale from '../courseresourceslocale';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

export const PastExamPapers = ({
    subject,
    learningResourcesList,
    learningResourcesListLoading,
    learningResourcesListError,
}) => {
    const _pluralise = (word, num) => {
        return word + (num === 1 ? '' : 's');
    };

    const _extractExtension = url => {
        return url.substring(url.lastIndexOf('.') + 1);
    };

    const _courseLink = (courseId, url) => {
        return url + courseId;
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

    const examPaperTitle = `${locale.subject.examPapers.title} ${
        !!examList && examList.length > 0 ? `(${examList.length})` : ''
    }`;

    return (
        <StandardCard className="exams" style={{ width: '100%', marginBottom: '1rem' }} title={examPaperTitle}>
            {!!learningResourcesListError && <Typography>{locale.subject.examPapers.unavailable}</Typography>}

            {!learningResourcesListError && learningResourcesListLoading && (
                <Grid item xs={'auto'} style={{ width: 80, marginRight: 20, marginBottom: 6, opacity: 0.3 }}>
                    <CircularProgress color="primary" size={20} id="loading-suggestions" />
                </Grid>
            )}

            {!!examList && examList.length === 0 && (
                <Grid>
                    <Typography>No Past Exam Papers for this course</Typography>
                    <a href={locale.examPapersSearchUrl}>
                        <ArrowForwardIcon style={{ paddingRight: '1rem' }} />
                        {locale.subject.examPapers.linkOut}
                    </a>
                </Grid>
            )}
            {!!examList && examList.length > 0 && (
                <Grid id="pastExamPapers">
                    {examList.slice(0, locale.visibleItemsCount.examPapers).map((paper, index) => {
                        return (
                            <Grid
                                container
                                key={`examPapers-${index}`}
                                style={{ borderTop: '1px solid #e8e8e8', padding: '15px 0' }}
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

                    {!!numberExcessExams && (
                        <Grid container style={{ borderTop: '1px solid #e8e8e8', padding: '15px 0' }}>
                            <a
                                // on-click="linkClicked"
                                href={_courseLink(subject.classnumber, locale.subject.examPapers.searchUrl)}
                            >
                                <ArrowForwardIcon style={{ paddingRight: '1rem' }} />
                                {locale.subject.examPapers.morePastExams
                                    .replace('[numberExcessExams]', numberExcessExams)
                                    .replace('[examNumber]', _pluralise('paper', numberExcessExams))}
                            </a>
                        </Grid>
                    )}
                </Grid>
            )}
        </StandardCard>
    );
};

PastExamPapers.propTypes = {
    learningResourcesList: PropTypes.any,
    learningResourcesListError: PropTypes.string,
    learningResourcesListLoading: PropTypes.bool,
    subject: PropTypes.any,
};

export default React.memo(PastExamPapers);
