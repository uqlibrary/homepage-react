import React from 'react';
import PropTypes from 'prop-types';

import locale from '../shared/learningResources.locale';
import { _courseLink, _pluralise } from '../shared/learningResourcesHelpers';
import { SpacedArrowForwardIcon } from '../shared/SpacedArrowForwardIcon';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { styled } from '@mui/material/styles';

const StyledItem = styled(Grid)(() => ({
    borderTop: '1px solid #e8e8e8',
    paddingBlock: '15px',
    '& a': {
        display: 'flex',
        alignItems: 'center',
    },
}));

export const PastExamPapers = ({ examList, examListLoading, examListError, headingLevel }) => {
    const subject = !!examList && examList.coursecode;

    const _extractExtension = url => {
        return url.substring(url.lastIndexOf('.') + 1).toUpperCase();
    };

    const listOfExams = !!examList && !!examList.list && examList.list.length > 0 ? examList.list : false;

    const numberExcessExams =
        !!examList && !!examList.remainingCount && examList.remainingCount > 0 ? examList.remainingCount : 0;

    const examTotalCount = listOfExams.length + numberExcessExams;

    const examAriaLabel = paper => `past exam paper for ${paper.period} format ${_extractExtension(paper.url)}`;

    const itemCountLabel = _pluralise('item', examTotalCount);
    const examPaperTitle = `${locale.myCourses.examPapers.title} ${
        !examListError && !examListLoading && examTotalCount > 0 ? `(${examTotalCount} ${itemCountLabel})` : ''
    }`;

    return (
        <StandardCard fullHeight noHeader standardCardId={`past-exams-${subject}`}>
            <Typography component={headingLevel} variant="h6" style={{ paddingBottom: '15px', fontWeight: 300 }}>
                {examPaperTitle}
            </Typography>
            <Grid container className={'exams'}>
                {!!examListError && (
                    /* istanbul ignore next */
                    <Typography>{locale.myCourses.examPapers.unavailable}</Typography>
                )}

                {!examListError && !!examListLoading && (
                    <Grid item xs={'auto'} style={{ width: 80, opacity: 0.3 }}>
                        <CircularProgress
                            color="primary"
                            size={20}
                            data-testid="loading-exampaper-suggestions"
                            aria-label="loading Past exam papers"
                        />
                    </Grid>
                )}

                {!examListError && !examListLoading && (!listOfExams || listOfExams.length === 0) && (
                    <React.Fragment>
                        <StyledItem item xs={12}>
                            <Typography data-testid="no-exam-papers">{locale.myCourses.examPapers.none}</Typography>
                        </StyledItem>
                        <StyledItem item xs={12}>
                            <a href={locale.myCourses.examPapers.footer.noPastExams.linkOut}>
                                <SpacedArrowForwardIcon />
                                {locale.myCourses.examPapers.footer.noPastExams.linkLabel}
                            </a>
                        </StyledItem>
                    </React.Fragment>
                )}
                {!examListError &&
                    !examListLoading &&
                    !!listOfExams &&
                    listOfExams.length > 0 &&
                    listOfExams.map((paper, index) => {
                        return (
                            <StyledItem item xs={12} key={`examPapers-${index}`}>
                                <a
                                    aria-label={examAriaLabel(paper)}
                                    className="exam-paper-item"
                                    data-title="examPaperItem"
                                    data-testid={`examPaperItem-${index}`}
                                    href={paper.url}
                                    key={`exam-${index}`}
                                >
                                    {paper.period} ({_extractExtension(paper.url)})
                                </a>
                            </StyledItem>
                        );
                    })}
                {!examListError && !examListLoading && !!numberExcessExams && numberExcessExams > 0 && (
                    <StyledItem item xs={12} data-testid="exam-more-link">
                        <a href={_courseLink(subject, locale.myCourses.examPapers.footer.morePastExams.linkOutPattern)}>
                            <SpacedArrowForwardIcon />
                            {locale.myCourses.examPapers.footer.morePastExams.linkLabel
                                .replace('[numberExcessExams]', numberExcessExams)
                                .replace('[examNumber]', _pluralise('paper', numberExcessExams))}
                        </a>
                    </StyledItem>
                )}
            </Grid>
        </StandardCard>
    );
};

PastExamPapers.propTypes = {
    examList: PropTypes.any,
    examListError: PropTypes.any,
    examListLoading: PropTypes.bool,
    headingLevel: PropTypes.string,
};

export default React.memo(PastExamPapers);
