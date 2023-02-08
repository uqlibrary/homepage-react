import React from 'react';
import PropTypes from 'prop-types';

// import { default as locale } from '../learningResources.locale';
import { Guides } from '../panels/Guides';
import { PastExamPapers } from '../panels/PastExamPapers';
import { ReadingLists } from '../panels/ReadingLists';
import { SubjectLinks } from '../panels/SubjectLinks';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { unescapeString } from 'helpers/general';

const useStyles = makeStyles(
    theme => ({
        learningResourceLineItem: {
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
        panelGap: {
            [theme.breakpoints.up('md')]: {
                paddingLeft: 16,
            },
            [theme.breakpoints.down('sm')]: {
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
                <Grid item xs={12}>
                    <ReadingLists
                        subject={subject}
                        readingList={readingList.list[[coursecode]]}
                        readingListLoading={readingList.loading}
                        readingListError={readingList.error}
                        headingLevel={panelHeadingLevel}
                    />
                </Grid>
            </Grid>

            <Grid container className={classes.contentBlock}>
                <Grid item xs={12} md={4} data-testid="learning-resource-subject-exams">
                    <PastExamPapers
                        examList={examList.list[coursecode]}
                        examListLoading={examList.loading}
                        examListError={examList.error}
                        headingLevel={panelHeadingLevel}
                    />
                </Grid>
                <Grid item xs={12} md={4} className={classes.panelGap}>
                    <Guides
                        guideList={guideList.list[coursecode]}
                        guideListLoading={guideList.loading}
                        guideListError={guideList.error}
                        headingLevel={panelHeadingLevel}
                    />
                </Grid>
                <Grid item xs={12} md={4} className={classes.panelGap}>
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