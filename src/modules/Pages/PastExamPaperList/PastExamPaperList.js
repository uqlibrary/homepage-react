import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

// import { throttle } from 'throttle-debounce';
import { useTitle } from 'hooks';

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { noResultsFoundBlock } from 'modules/Pages/PastExamPaperSearch/pastExamPapers.helpers';

// import locale from './pastExamPaperList.locale';
// import { isRepeatingString } from 'helpers/general';

const useStyles = makeStyles(
    () => ({
        bodyCell: {
            textAlign: 'center',
            verticalAlign: 'top',
        },
        headerCell: {
            textAlign: 'center',
        },
        secondaryExamDetail: {
            marginTop: '1em',
        },
        tableContainer: {
            maxHeight: 600,
        },
        stickyHeaderCell: {
            position: 'sticky',
            left: 0,
            zIndex: 10,
        },
        stickyFirstCell: {
            position: 'sticky',
            left: 0,
            backgroundColor: 'white',
        },
    }),
    { withTheme: true },
);
export const PastExamPaperList = ({ actions, examSearchListError, examSearchList, examSearchListLoading }) => {
    console.log('PastExamPaperList examSearchListError=', examSearchListError);
    console.log('PastExamPaperList examSearchListLoading=', examSearchListLoading);
    console.log('PastExamPaperList examSearchList=', examSearchList);

    const { courseHint } = useParams();
    const listTitle =
        !!examSearchList && !!examSearchList.minYear
            ? `Past Exam Papers from ${examSearchList.minYear} to ${
                  examSearchList.maxYear
              } for "${courseHint.toUpperCase()}"`
            : 'Past Exam Papers by Subject';

    const classes = useStyles();
    useTitle(`${listTitle} - Library - The University of Queensland`);

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
        return !!firstSemester && !!firstSemester.courseCode ? firstSemester.courseCode : null;
    }

    return (
        <StandardPage>
            <StandardCard title={listTitle}>
                {!!examSearchListLoading && (
                    <Grid container>
                        <Grid item xs={'auto'} className={classes.loading}>
                            <CircularProgress color="primary" size={20} id="loading-suggestions" />
                        </Grid>
                    </Grid>
                )}
                {!!examSearchListError && (
                    <Grid container spacing={2} className={classes.searchPanel} data-testid={'past-exam-paper-error'}>
                        <Grid item xs={12} sm={12} md className={classes.searchPanelInfo}>
                            <span>Past exam paper search is currently unavailable - please try again later</span>
                        </Grid>
                    </Grid>
                )}
                {!examSearchListLoading &&
                    !examSearchListError &&
                    ((!!examSearchList && !!examSearchList.papers && examSearchList.papers.length === 0) ||
                        !examSearchList) && (
                        <Grid container>
                            <Grid item xs={12} data-testid="past-exam-paper-missing">
                                {noResultsFoundBlock(courseHint)}
                            </Grid>
                        </Grid>
                    )}
                {!examSearchListLoading &&
                    !examSearchListError &&
                    !!examSearchList &&
                    !!examSearchList.papers &&
                    !!examSearchList.periods && (
                        <TableContainer className={classes.tableContainer} component={Paper}>
                            <Table
                                stickyHeader
                                aria-label="Past Exam Papers by Subject"
                                sx={{
                                    width: 'max-content',
                                }}
                            >
                                <TableHead>
                                    <TableRow data-testid="exampaper-results-table-header">
                                        <TableCell component="th" scope="col" className={classes.stickyHeaderCell}>
                                            {' '}
                                        </TableCell>
                                        {examSearchList.periods.map((semester, ss) => {
                                            const parts = semester.split(' || ');
                                            return (
                                                <TableCell
                                                    component="th"
                                                    className={classes.headerCell}
                                                    key={`exampaper-results-headercell-${ss}`}
                                                    scope="col"
                                                >
                                                    {parts.map((part, ii) => (
                                                        <div key={`exampaper-results-headercell-part-${ii}`}>
                                                            {part}
                                                        </div>
                                                    ))}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                </TableHead>
                                <tbody data-testid="exampaper-results-table-body">
                                    {examSearchList.papers.map((course, cc) => {
                                        return (
                                            <TableRow key={`exampaper-results-row-${cc}`}>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    className={classes.stickyFirstCell}
                                                >
                                                    {getCourseCode(course)}
                                                </TableCell>
                                                {course.map((semester, ss) => {
                                                    return (
                                                        <TableCell
                                                            className={classes.bodyCell}
                                                            key={`exampaper-results-bodycell-${ss}`}
                                                            data-testid={`exampaper-results-bodycell-${cc}-${ss}`}
                                                        >
                                                            {semester.map((paper, pp) => {
                                                                return (
                                                                    <div
                                                                        key={`exampaper-results-bodycell-detail-${pp}`}
                                                                        className={
                                                                            pp > 0 ? classes.secondaryExamDetail : null
                                                                        }
                                                                    >
                                                                        {!!paper.paperUrl && (
                                                                            <a href={paper.paperUrl}>
                                                                                {!!paper.examType && (
                                                                                    <div>{paper.examType}</div>
                                                                                )}
                                                                                {paper.courseCode}
                                                                                {!!paper.examNote && (
                                                                                    <div>{paper.examNote}</div>
                                                                                )}
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </TableContainer>
                    )}
                <Grid container>
                    <Grid item xs={'auto'}>
                        <p className={classes.aboutLink}>
                            <a href="https://web.library.uq.edu.au/library-services/students/past-exam-papers">
                                Read more about searching for past exam papers
                            </a>
                        </p>
                    </Grid>
                </Grid>
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
