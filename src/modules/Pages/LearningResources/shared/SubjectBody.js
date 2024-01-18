import React from 'react';
import PropTypes from 'prop-types';

// import { default as locale } from '../learningResources.locale';
import { Guides } from '../panels/Guides';
import { PastExamPapers } from '../panels/PastExamPapers';
import { default as ReadingLists } from '../panels/ReadingLists';
import { SubjectLinks } from '../panels/SubjectLinks';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { unescapeString } from 'helpers/general';

const useStyles = makeStyles(
    theme => ({
        panelGap: {
            [theme.breakpoints.up('md')]: {
                paddingLeft: 16,
            },
            [theme.breakpoints.down('md')]: {
                paddingTop: 16,
            },
        },
        header: {
            color: theme.palette.primary.light,
            textAlign: 'center',
        },
        contentBlock: {
            paddingLeft: 12,
            paddingRight: 12,
            marginBlock: 6,
        },
    }),
    { withTheme: true },
);

export const SubjectBody = ({ subject, examList, guideList, readingList, subjectHeaderLevel, panelHeadingLevel }) => {
    const classes = useStyles();
    const coursecode = subject.classnumber || /* istanbul ignore next */ null;
    const subjectHeading = course => {
        // we have titles like "FREN3310 - French&gt;English Translation". unescapeString fixes them
        const title =
            (!!course.DESCR && `- ${unescapeString(course.DESCR)}`) || // if from account
            (!!course.title && `- ${unescapeString(course.title)}`) || // if from subject search
            '';
        if (title !== '') {
            // put focus on the tab, for screenreaders
            const searchResults = document.getElementById('learning-resource-search-results');
            !!searchResults && searchResults.focus();
        }
        return `${course.classnumber} ${title}`;
    };

    const readingListError =
        subject.classnumber === readingList.coursecode ? /* istanbul ignore next */ readingList.error : null;
    return (
        <React.Fragment>
            <Typography
                className={classes.header}
                component={subjectHeaderLevel}
                variant={'h5'}
                data-testid="learning-resource-subject-title"
            >
                {subjectHeading(subject)}
                <br />
            </Typography>

            <Grid
                container
                spacing={3}
                className={classes.contentBlock}
                data-testid="learning-resource-subject-reading-list"
            >
                <Grid item xs={12} md={6} className={classes.panelGap}>
                    <ReadingLists
                        courseCode={coursecode}
                        readingList={readingList.list[coursecode]}
                        readingListLoading={readingList.loading}
                        readingListError={readingListError}
                        headingLevel={panelHeadingLevel}
                    />
                </Grid>
                <Grid item xs={12} md={6} data-testid="learning-resource-subject-exams" className={classes.panelGap}>
                    <PastExamPapers
                        examList={examList.list[coursecode]}
                        examListLoading={examList.loading}
                        examListError={examList.error}
                        headingLevel={panelHeadingLevel}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Guides
                        guideList={guideList.list[coursecode]}
                        guideListLoading={guideList.loading}
                        guideListError={guideList.error}
                        headingLevel={panelHeadingLevel}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <SubjectLinks subject={subject} headingLevel={panelHeadingLevel} />
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

SubjectBody.propTypes = {
    examList: PropTypes.object,
    guideList: PropTypes.object,
    readingList: PropTypes.object,
    panelHeadingLevel: PropTypes.string,
    subjectHeaderLevel: PropTypes.string,
    subject: PropTypes.any,
};

SubjectBody.defaultProps = {
    panelHeadingLevel: 'h3',
    subjectHeaderLevel: 'h2',
};

export default SubjectBody;
