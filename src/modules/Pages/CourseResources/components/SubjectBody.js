import React from 'react';
import PropTypes from 'prop-types';

import { Guides } from './Guides';
import { PastExamPapers } from './PastExamPapers';
import { ReadingLists } from './ReadingLists';
import { SubjectLinks } from './SubjectLinks';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { getCampusByCode, unescapeString } from 'helpers/general';

const useStyles = makeStyles(
    theme => ({
        courseResourceLineItem: {
            borderTop: '1px solid #e8e8e8',
            padding: '15px 0',
            '& a': {
                display: 'flex',
                alignItems: 'center',
            },
        },
        studyLinks: {
            minHeight: '10rem',
        },
        desktopGap: {
            [theme.breakpoints.up('md')]: {
                paddingLeft: 16,
            },
        },
    }),
    { withTheme: true },
);

export const SubjectBody = ({ subject, examList, guideList, readingList }) => {
    const classes = useStyles();

    const coursecode = subject.classnumber || null;
    const firstReadingList =
        !!readingList.list &&
        !!readingList.list[coursecode] &&
        !!readingList.list[coursecode].reading_lists &&
        readingList.list[coursecode].reading_lists.length > 0 &&
        !!readingList.list[coursecode].reading_lists[0] &&
        readingList.list[coursecode].reading_lists[0];
    const coursecampus = () =>
        (subject.CAMPUS && getCampusByCode(subject.CAMPUS)) ||
        (!!readingList && firstReadingList && !!firstReadingList.campus && firstReadingList.campus) ||
        null;
    const courseSemester = () => {
        const semester =
            (!!subject.semester && subject.semester) ||
            (!!readingList && firstReadingList && !!firstReadingList.period && firstReadingList.period) ||
            null;
        if (semester !== null) {
            return ` - ${semester}`;
        }
        return '';
    };

    const courseTitle = () => {
        // whichever one we get first (they should both have the same value)
        const title =
            (!!examList &&
                !!examList.list &&
                !!examList.list[coursecode] &&
                !!examList.list[coursecode].title &&
                ` - ${examList.list[coursecode].title}`) ||
            (!!readingList &&
                !!readingList.list &&
                !!readingList.list[coursecode] &&
                !!readingList.list[coursecode].title &&
                ` - ${readingList.list[coursecode].title}`) ||
            null;
        // we have titles like "FREN3310 - French&gt;English Translation". This fixes them
        return unescapeString(title);
    };

    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography
                    color={'primary'}
                    component={'h3'}
                    variant={'h5'}
                    data-testid="course-resource-subject-title"
                    style={{ textAlign: 'center' }}
                >
                    {coursecode}
                    {courseTitle()}
                </Typography>
                <Typography
                    color={'primary'}
                    component={'h4'}
                    variant={'h6'}
                    data-testid="course-resource-subject-locator"
                    style={{ textAlign: 'center', fontWeight: 300 }}
                >
                    {coursecampus()}
                    {courseSemester()}
                </Typography>
            </Grid>

            <ReadingLists
                readingList={readingList.list[[coursecode]]}
                readingListLoading={readingList.loading}
                readingListError={readingList.error}
            />

            <Grid container>
                <Grid item xs={12} md={4} className={'exams'}>
                    <PastExamPapers
                        examList={examList.list[coursecode]}
                        examListLoading={examList.loading}
                        examListError={examList.error}
                    />
                </Grid>
                <Grid item xs={12} md={4} className={classes.desktopGap}>
                    <Guides
                        guideList={guideList.list[coursecode]}
                        guideListLoading={guideList.loading}
                        guideListError={guideList.error}
                    />
                </Grid>
                <Grid item xs={12} md={4} className={classes.desktopGap}>
                    <SubjectLinks subject={subject} />
                </Grid>
            </Grid>
        </Grid>
    );
};

SubjectBody.propTypes = {
    subject: PropTypes.any,
    examList: PropTypes.object,
    guideList: PropTypes.object,
    readingList: PropTypes.object,
};

export default SubjectBody;
