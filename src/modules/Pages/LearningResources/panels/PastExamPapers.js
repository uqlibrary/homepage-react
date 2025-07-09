import React from 'react';
import PropTypes from 'prop-types';

import locale from '../shared/learningResources.locale';
import { _courseLink, _pluralise } from '../shared/learningResourcesHelpers';
import { SpacedArrowForwardIcon } from '../shared/SpacedArrowForwardIcon';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import { styled } from '@mui/material/styles';
import { linkToDrupal } from 'helpers/general';

const StyledItem = styled(Grid)(() => ({
    borderTop: '1px solid #e8e8e8',
    paddingBlock: '15px',
    '& a': {
        display: 'inline',
    },
    '& a:has(span)': {
        display: 'flex',
        alignItems: 'center',
        '&:hover': {
            color: 'inherit',
            backgroundColor: 'inherit',
            '& span': {
                color: '#fff',
                backgroundColor: '#51247A',
            },
        },
    },
}));
const StyledBodyText = styled(Typography)(() => ({
    marginTop: '1rem',
    marginBottom: '2rem',
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.6,
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
            <Typography component={headingLevel} variant="h6" style={{ paddingBottom: '15px', fontWeight: 500 }}>
                {examPaperTitle}
            </Typography>
            <StyledItem item xs={12} style={{ display: 'flex', alignItems: 'center' }} data-testid="exams-readmore">
                <QuestionMarkIcon style={{ marginRight: 6 }} />
                <a href={linkToDrupal('/study-and-learning-support/coursework/past-exam-papers')}>
                    Read more about past exam papers
                </a>
            </StyledItem>
            <Grid container className={'exams'} data-testid="exam-list-wrapper">
                {!!examListError && (
                    /* istanbul ignore next */
                    <StyledBodyText>{locale.myCourses.examPapers.unavailable}</StyledBodyText>
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
                            <StyledBodyText style={{ marginBlock: 0 }} data-testid="no-exam-papers">
                                {locale.myCourses.examPapers.none}
                            </StyledBodyText>
                        </StyledItem>
                        <StyledItem item xs={12}>
                            <a href={locale.myCourses.examPapers.footer.noPastExams.linkOut}>
                                <SpacedArrowForwardIcon />
                                <span>{locale.myCourses.examPapers.footer.noPastExams.linkLabel}</span>
                            </a>
                        </StyledItem>
                    </React.Fragment>
                )}
                {!examListError &&
                    !examListLoading &&
                    !!listOfExams &&
                    listOfExams.length > 0 &&
                    listOfExams.map((paper, index) => {
                        const sampleIndicator = paper.paperType.toLowerCase().includes('sample') ? '(Sample)' : '';
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
                                    <span>
                                        {paper.period} ({_extractExtension(paper.url)}) {sampleIndicator}
                                    </span>
                                </a>
                            </StyledItem>
                        );
                    })}
                {!examListError && !examListLoading && !!numberExcessExams && numberExcessExams > 0 && (
                    <StyledItem item xs={12} data-testid="exam-more-link">
                        <a href={_courseLink(subject, locale.myCourses.examPapers.footer.morePastExams.linkOutPattern)}>
                            <SpacedArrowForwardIcon />
                            <span>
                                {locale.myCourses.examPapers.footer.morePastExams.linkLabel
                                    .replace('[numberExcessExams]', numberExcessExams)
                                    .replace('[examNumber]', _pluralise('paper', numberExcessExams))}
                            </span>
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
