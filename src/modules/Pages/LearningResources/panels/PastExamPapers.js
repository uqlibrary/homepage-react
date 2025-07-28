import React from 'react';
import PropTypes from 'prop-types';

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
    const examPaperTitle = `Past exam papers ${
        !examListError && !examListLoading && examTotalCount > 0 ? `(${examTotalCount} ${itemCountLabel})` : ''
    }`;

    const showLinkToPaper = (paper, index) => {
        const sampleIndicator = paper.paperType.toLowerCase().includes('sample') ? '(Sample)' : '';
        return (
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
        );
    };
    const showLinkToExamPaperSearch = (
        <a href={_courseLink(subject, 'https://www.library.uq.edu.au/exams/course/[courseCode]')}>
            <SpacedArrowForwardIcon />
            <span>{`${numberExcessExams} more past ` + _pluralise('paper', numberExcessExams)}</span>
        </a>
    );

    return (
        <StandardCard fullHeight noHeader standardCardId={`past-exams-${subject}`}>
            <Typography component={headingLevel} variant="h6" style={{ paddingBottom: '15px', fontWeight: 500 }}>
                {examPaperTitle}
            </Typography>
            <Grid container className={'exams'} data-testid="exam-list-wrapper">
                {(() => {
                    /* istanbul ignore else */
                    if (examListLoading !== false) {
                        return (
                            <Grid item xs={'auto'} style={{ width: 80, opacity: 0.3 }}>
                                <CircularProgress
                                    color="primary"
                                    size={20}
                                    data-testid="loading-exampaper-suggestions"
                                    aria-label="loading Past exam papers"
                                />
                            </Grid>
                        );
                    } else if (!!examListError) {
                        return (
                            <StyledBodyText data-testid="exams-springshare-error">
                                Exam papers list currently unavailable
                            </StyledBodyText>
                        );
                    } else if (!listOfExams || listOfExams.length === 0) {
                        return (
                            <>
                                <StyledItem item xs={12}>
                                    <StyledBodyText style={{ marginBlock: 0 }} data-testid="no-exam-papers">
                                        No Past Exam Papers for this course.
                                    </StyledBodyText>
                                </StyledItem>
                                <StyledItem item xs={12}>
                                    <a href="https://www.library.uq.edu.au/exams/">
                                        <SpacedArrowForwardIcon />
                                        <span>Search for other exam papers</span>
                                    </a>
                                </StyledItem>
                            </>
                        );
                    } else if (!!listOfExams && listOfExams.length > 0) {
                        return (
                            <>
                                {!!listOfExams &&
                                    listOfExams.length > 0 &&
                                    listOfExams.map((paper, index) => {
                                        return (
                                            <StyledItem item xs={12} key={`examPapers-${index}`}>
                                                {showLinkToPaper(paper, index)}
                                            </StyledItem>
                                        );
                                    })}
                                {!!numberExcessExams && numberExcessExams > 0 && (
                                    <StyledItem item xs={12} data-testid="exam-more-link">
                                        {showLinkToExamPaperSearch}
                                    </StyledItem>
                                )}
                            </>
                        );
                    } else {
                        return null;
                    }
                })()}
            </Grid>
            <StyledItem item xs={12} data-testid="exams-readmore">
                <a href={linkToDrupal('/study-and-learning-support/coursework/past-exam-papers')}>
                    <QuestionMarkIcon style={{ marginRight: 6 }} />
                    <span>Read more about past exam papers</span>
                </a>
            </StyledItem>
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
