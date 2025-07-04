import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

import { useTitle } from 'hooks';

import { Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { MESSAGE_EXAMCODE_404, noResultsFoundBlock } from 'modules/Pages/PastExamPaperSearch/pastExamPapers.helpers';
import { styled } from '@mui/material/styles';
import { breadcrumbs } from 'config/routes';
import { linkToDrupal } from 'helpers/general';

const StyledTableCell = styled(TableCell)(() => ({
    textAlign: 'center',
    verticalAlign: 'top',
    '& .secondaryExamDetail': {
        marginTop: '1em',
    },
}));

const colourBlack = '#19151c';
const colourPaneBackground = '#f3f3f4';

const StyledMobileViewWrapper = styled('div')(() => ({
    marginBottom: '6rem',
    marginTop: '1rem',
    '& .bodyCell': {
        textAlign: 'center',
        verticalAlign: 'top',
    },
    '& .mobileLink': {
        '& > div': {
            marginTop: 20,
            marginBottom: 20,
        },
    },
    '& .zebra': {
        /* stripe alternate rows in movile view */
        backgroundColor: colourPaneBackground,
        paddingTop: '1rem',
        paddingBottom: '1rem',
        marginBottom: '1rem',
    },
    h3: {
        color: colourBlack,
    },
}));

export const PastExamPaperList = ({ actions, examSearchListError, examSearchList, examSearchListLoading }) => {
    const { courseHint } = useParams();
    const listTitle =
        !!examSearchList && !!examSearchList.minYear && !!examSearchList.maxYear && !!courseHint
            ? `Past Exam Papers from ${examSearchList.minYear} to ${
                  examSearchList.maxYear
              } for "${courseHint.toUpperCase()}"`
            : /* istanbul ignore next */ 'Past Exam Papers by Subject';

    useTitle(`${listTitle} - Library - The University of Queensland`);

    useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.exampapers.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.exampapers.pathname);
    }, []);

    useEffect(() => {
        /* istanbul ignore else */
        if (!!courseHint) {
            actions.loadExamSearch(courseHint);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseHint]);

    function getCourseCode(course2) {
        const course = JSON.parse(JSON.stringify(course2));
        const firstCourse = course.find((paper, pp) => pp === 0);
        const firstSemester = !!firstCourse && firstCourse.pop();
        return !!firstSemester && !!firstSemester.courseCode
            ? firstSemester.courseCode
            : /* istanbul ignore next */ null;
    }

    // don't display the input unless it is shown to be valid
    const displayedCourseHint = examSearchListError === false && courseHint.length > 0 ? `"${courseHint}"` : '';

    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('sm')) || false;

    const is404Error = !!examSearchListError && examSearchListError === MESSAGE_EXAMCODE_404;
    const isNon404Error = !!examSearchListError && examSearchListError !== MESSAGE_EXAMCODE_404;
    function writeMobileLayout(examSearchList) {
        return (
            <StyledMobileViewWrapper>
                {examSearchList.papers.map((course, cc) => {
                    return (
                        <div key={`exampaper-results-row-${cc}`} className={cc % 2 && 'zebra'}>
                            <Typography
                                variant="h3"
                                style={{
                                    fontSize: 16,
                                    fontWeight: 500,
                                    marginTop: 6,
                                    paddingLeft: 6,
                                    color: colourBlack,
                                }}
                            >
                                {getCourseCode(course)}
                            </Typography>
                            {course.map((semester, ss) => {
                                return (
                                    <div
                                        className={'bodyCell'}
                                        key={`exampaper-results-bodycell-${ss}`}
                                        data-testid={`exampaper-results-bodycell-${cc}-${ss}`}
                                    >
                                        {semester.map((paper, pp) => {
                                            let display = `${paper.courseCode} ${paper.examPeriod} ${paper.examYear}`;
                                            display += !!paper.examType ? ` (${paper.examType})` : '';
                                            display += !!paper.examNote ? ` ${paper.examNote}` : '';
                                            display += !paper.examNote && semester.length > 1 ? ` Paper ${pp + 1}` : '';
                                            return (
                                                <div
                                                    key={`exampaper-results-bodycell-detail-${pp}`}
                                                    className={'mobileLink'}
                                                >
                                                    {!!paper.paperUrl && (
                                                        <div>
                                                            <a
                                                                href={paper.paperUrl}
                                                                data-testid={`exampaper-mobilelink-${cc}-${ss}-${pp}`}
                                                                target="_blank"
                                                            >
                                                                {display}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </StyledMobileViewWrapper>
        );
    }

    function writeDesktopLayout(examSearchList) {
        return (
            <TableContainer sx={{ maxHeight: 600, marginTop: '1rem' }} component={Paper}>
                <Table
                    stickyHeader
                    aria-label={listTitle}
                    aria-describedby="examResultsDescription"
                    data-testid="exampaper-results-table"
                >
                    <TableHead>
                        <TableRow data-testid="exampaper-results-table-header">
                            <TableCell
                                component="th"
                                scope="col"
                                sx={{ position: 'sticky', left: 0, zIndex: 10, border: 'none' }}
                                style={{ backgroundColor: colourPaneBackground }}
                            >
                                {' '}
                            </TableCell>
                            {examSearchList.periods.map((semester, ss) => {
                                const parts = semester.split(' || ');
                                return (
                                    <TableCell
                                        component="th"
                                        sx={{ textAlign: 'center' }}
                                        key={`exampaper-results-headercell-${ss}`}
                                        scope="col"
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 500,
                                            backgroundColor: colourPaneBackground,
                                        }}
                                    >
                                        {parts.map((part, ii) => (
                                            <div key={`exampaper-results-headercell-part-${ii}`}>{part}</div>
                                        ))}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <tbody data-testid="exampaper-results-table-body">
                        {examSearchList.papers.map((course, cc) => {
                            return (
                                <TableRow
                                    data-testid={`exampaper-results-row-${cc}`}
                                    key={`exampaper-results-row-${cc}`}
                                >
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        sx={{
                                            backgroundColor: colourPaneBackground,
                                            left: 0,
                                            position: 'sticky',
                                            verticalAlign: 'top',
                                        }}
                                        data-testid={`exampaper-results-label-${cc}`}
                                    >
                                        <Typography variant="h3" style={{ fontSize: 16, fontWeight: 500 }}>
                                            {getCourseCode(course)}
                                        </Typography>
                                    </TableCell>
                                    {course.map((semester, ss) => {
                                        return (
                                            <StyledTableCell
                                                key={`exampaper-results-bodycell-${ss}`}
                                                data-testid={`exampaper-results-bodycell-${cc}-${ss}`}
                                            >
                                                {semester.map((paper, pp) => {
                                                    return (
                                                        <div
                                                            key={`exampaper-results-bodycell-detail-${pp}`}
                                                            className={pp > 0 ? 'secondaryExamDetail' : null}
                                                        >
                                                            {!!paper.paperUrl ? (
                                                                <a
                                                                    data-testid={`exampaper-results-bodycell-link-${cc}-${ss}-${pp}`}
                                                                    href={paper.paperUrl}
                                                                    target="_blank"
                                                                >
                                                                    {!!paper.examType && (
                                                                        <span>
                                                                            {paper.examType}
                                                                            <br />
                                                                        </span>
                                                                    )}
                                                                    <span>{paper.courseCode}</span>
                                                                    {!!paper.examNote && (
                                                                        <span>
                                                                            <br />
                                                                            {paper.examNote}
                                                                        </span>
                                                                    )}
                                                                </a>
                                                            ) : null}
                                                        </div>
                                                    );
                                                })}
                                            </StyledTableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </tbody>
                </Table>
            </TableContainer>
        );
    }

    return (
        <StandardPage title={listTitle}>
            <StandardCard>
                {(() => {
                    if (!!examSearchListLoading) {
                        return (
                            <Grid container>
                                <Grid item xs={'auto'}>
                                    <CircularProgress
                                        color="primary"
                                        size={20}
                                        id="loading-suggestions"
                                        aria-label="Loading Past exam papers"
                                    />
                                </Grid>
                            </Grid>
                        );
                    } else if (!!isNon404Error) {
                        return (
                            <Grid container spacing={2} className={'searchPanel'} data-testid={'past-exam-paper-error'}>
                                <Grid item xs={12} sm={12} md className={'searchPanelInfo'}>
                                    <span>
                                        Past exam paper search is currently unavailable - please try again later
                                    </span>
                                </Grid>
                            </Grid>
                        );
                    } else if (
                        !examSearchListLoading &&
                        !isNon404Error &&
                        ((!!examSearchList && !!examSearchList.papers && examSearchList.papers.length === 0) ||
                            !examSearchList ||
                            !examSearchList.papers ||
                            !!is404Error)
                    ) {
                        return (
                            <Grid container>
                                <Grid item xs={12} data-testid="past-exam-paper-missing">
                                    {noResultsFoundBlock(displayedCourseHint)}
                                </Grid>
                            </Grid>
                        );
                    } else if (
                        !examSearchListLoading &&
                        !examSearchListError &&
                        !!examSearchList &&
                        !!examSearchList.papers &&
                        !!examSearchList.periods &&
                        !!examSearchList.papers.length > 0
                    ) {
                        return (
                            <>
                                <div id="examResultsDescription">
                                    <p>
                                        This table shows only the last five years, and only for semesters where exams
                                        are recorded.
                                    </p>
                                    <p>
                                        Past exam papers are actual papers from previous examination periods, and do not
                                        include answers.
                                    </p>
                                    <p>
                                        They may not be an accurate reflection of the format or content of any future
                                        exam paper.
                                    </p>
                                    <p>
                                        Where actual papers are restricted, sample papers provided by the school may be
                                        found in the column for the semester supplied.
                                    </p>
                                </div>
                                {isMobileView ? writeMobileLayout(examSearchList) : writeDesktopLayout(examSearchList)}
                            </>
                        );
                    } else {
                        return (
                            <Grid container>
                                <Grid item xs={'auto'}>
                                    <p className={'aboutLink'}>
                                        <a
                                            href={linkToDrupal(
                                                '/study-and-learning-support/coursework/past-exam-papers',
                                            )}
                                        >
                                            Read more about searching for past exam papers
                                        </a>
                                    </p>
                                </Grid>
                            </Grid>
                        );
                    }
                })()}
            </StandardCard>
        </StandardPage>
    );
};

PastExamPaperList.propTypes = {
    actions: PropTypes.any,
    examSearchListError: PropTypes.any,
    examSearchList: PropTypes.any,
    examSearchListLoading: PropTypes.bool,
};

export default PastExamPaperList;
