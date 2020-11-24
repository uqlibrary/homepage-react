import React from 'react';
import PropTypes from 'prop-types';

import { Guides } from './Guides';
import { PastExamPapers } from './PastExamPapers';
import { ReadingLists } from './ReadingLists';
import { SubjectLinks } from './SubjectLinks';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

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

    const courseTitle =
        // whichever one we get first (they should both have the same value)
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

    console.log('examList = ', examList);

    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography color={'primary'} component={'h3'} variant={'h5'} style={{ textAlign: 'center' }}>
                    {coursecode}
                    {courseTitle}
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
