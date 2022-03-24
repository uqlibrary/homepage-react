import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

// import { throttle } from 'throttle-debounce';
import { useTitle } from 'hooks';

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { noResultsFoundBlock } from 'modules/Pages/PastExamPaperSearch/pastExamPapers.helpers';

// import locale from './pastExamPaperList.locale';
// import { isRepeatingString } from 'helpers/general';

const useStyles = makeStyles(
    () => ({
        // searchPanel: {
        //     paddingTop: 12,
        //     paddingRight: 20,
        //     paddingBottom: 0,
        // },
        // searchPanelInfo: { color: 'red', paddingLeft: '2em' },
        // loading: {
        //     width: 80,
        //     marginLeft: -100,
        //     marginRight: 20,
        //     marginBottom: 6,
        //     opacity: 0.3,
        // },
        // aboutLink: {
        //     marginTop: '4em',
        //     lineHeight: 1.5,
        //     '& a': {
        //         textDecoration: 'underline',
        //     },
        // },
        // aboutBlock: {
        //     paddingBottom: '1em',
        //     '& strong': {
        //         letterSpacing: '0.7px',
        //     },
        // },
    }),
    { withTheme: true },
);
export const PastExamPaperList = ({ actions, examSearchListError, examSearchList, examSearchListLoading }) => {
    console.log('PastExamPaperList examSearchListError=', examSearchListError);
    console.log('PastExamPaperList examSearchListLoading=', examSearchListLoading);
    console.log('PastExamPaperList examSearchList=', examSearchList);
    // !!examSearchList && console.log('PastExamPaperList papers=', examSearchList.papers);
    // !!examSearchList && console.log('PastExamPaperList dates=', examSearchList.periods);
    // if (!!examSearchList) {
    //     console.log('<TR>');
    //     examSearchList.periods.map(semester => {
    //         console.log('<TH>', semester, '</TH>');
    //     });
    //     console.log('</TR>');
    //     // //
    //     // //
    //     // //
    //     // console.log('courses:', examSearchList.papers);
    //     examSearchList.papers.map(periodList => {
    //         // console.log('a course:', periodList);
    //         console.log('<TR>');
    //         periodList.map(semester => {
    //             // console.log('semester:', semester);
    //             semester.map(exam => {
    //                 !!exam.paperUrl
    //                     ? console.log('<TD>', exam.courseCode, exam.paperUrl, '</TD>')
    //                     : console.log('<TD>null</TD>');
    //             });
    //         });
    //         console.log('</TR>');
    //     });
    // }

    const classes = useStyles();
    useTitle('Past exam paper - Library - The University of Queensland'); // TODO like: FREN1 Past Exam Papers from 2017 to 2022
    const { courseHint } = useParams();

    useEffect(() => {
        /* istanbul ignore else */
        if (!!courseHint) {
            actions.loadExamSearch(courseHint);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseHint]);

    const listTitle = !!examSearchList
        ? `Past Exam Papers from ${examSearchList.minYear} to ${
              examSearchList.maxYear
          } for "${courseHint.toUpperCase()}"`
        : 'Past Exam Papers by Subject';

    function getCourseCode(course2) {
        const course = JSON.parse(JSON.stringify(course2));
        const firstCourse = course.find((paper, pp) => pp === 0);
        const firstSemester = !!firstCourse && firstCourse.pop();
        return !!firstSemester && !!firstSemester.courseCode ? firstSemester.courseCode : null;
    }

    return (
        <StandardPage>
            <StandardCard title="Past exam papers">
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
                            <span>Autocomplete suggestions currently unavailable - please try again later</span>
                        </Grid>
                    </Grid>
                )}
                {!examSearchListLoading &&
                    !examSearchListError &&
                    ((!!examSearchList && !examSearchList.papers) || !examSearchList) && (
                        <Grid container>
                            <Grid item xs={12}>
                                {noResultsFoundBlock(courseHint)}
                            </Grid>
                        </Grid>
                    )}
                {!examSearchListLoading &&
                    !examSearchListError &&
                    !!examSearchList &&
                    !!examSearchList.papers &&
                    !!examSearchList.periods && (
                        <Grid container>
                            <Grid item xs={'auto'}>
                                <h1>{listTitle}</h1>
                                <table border="1">
                                    <thead>
                                        <tr>
                                            <th />
                                            {examSearchList.periods.map((semester, ss) => {
                                                const parts = semester.split(' || ');
                                                return (
                                                    <th key={`exampaper-results-headercell-${ss}`}>
                                                        {parts.map((part, ii) => (
                                                            <div key={`exampaper-results-headercell-part-${ii}`}>
                                                                {part}
                                                            </div>
                                                        ))}
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {examSearchList.papers.map((course, cc) => {
                                            return (
                                                <tr key={`exampaper-results-row-${cc}`} data-xx={course.length}>
                                                    <th>{getCourseCode(course)}</th>
                                                    {course.map((semester, ss) => {
                                                        return (
                                                            <td key={`exampaper-results-bodycell-${ss}`}>
                                                                {semester.map((paper, pp) => {
                                                                    return (
                                                                        <div
                                                                            key={`exampaper-results-bodycell-detail-${pp}`}
                                                                        >
                                                                            {!!paper.paperUrl ? (
                                                                                <a href="${paper.paperUrl}">
                                                                                    {!!paper.examType && (
                                                                                        <div>{paper.examType}</div>
                                                                                    )}
                                                                                    {paper.courseCode}
                                                                                    {!!paper.examNote && (
                                                                                        <div>{paper.examNote}</div>
                                                                                    )}
                                                                                </a>
                                                                            ) : null}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </Grid>
                        </Grid>
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
