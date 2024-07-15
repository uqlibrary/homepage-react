import React from 'react';
import PropTypes from 'prop-types';

// import { default as locale } from '../learningResources.locale';
import { Guides } from '../panels/Guides';
import { PastExamPapers } from '../panels/PastExamPapers';
import { default as ReadingLists } from '../panels/ReadingLists';
import { SubjectLinks } from '../panels/SubjectLinks';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { unescapeString } from 'helpers/general';
import { styled } from '@mui/material/styles';

const StyledContentBlock = styled(Grid)(({ theme }) => ({
    '&.contentBlock': {
        paddingLeft: 12,
        paddingRight: 12,
        marginBlock: 6,
    },
    '& .panelGap': {
        [theme.breakpoints.up('md')]: {
            paddingLeft: 16,
        },
        [theme.breakpoints.down('md')]: {
            paddingTop: 16,
        },
    },
}));
const StyledHeader = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.light,
    textAlign: 'center',
}));

export const SubjectBody = ({
    subject,
    examList,
    guideList,
    readingList,
    subjectHeaderLevel = 'h2',
    panelHeadingLevel = 'h3',
}) => {
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
            <StyledHeader component={subjectHeaderLevel} variant={'h5'} data-testid="learning-resource-subject-title">
                {subjectHeading(subject)}
                <br />
            </StyledHeader>

            <StyledContentBlock
                container
                spacing={3}
                className={'contentBlock'}
                data-testid="learning-resource-subject-reading-list"
            >
                <Grid item xs={12} md={6} className={'panelGap'}>
                    <ReadingLists
                        courseCode={coursecode}
                        readingList={readingList.list[coursecode]}
                        readingListLoading={readingList.loading}
                        readingListError={readingListError}
                        headingLevel={panelHeadingLevel}
                    />
                </Grid>
                <Grid item xs={12} md={6} data-testid="learning-resource-subject-exams" className={'panelGap'}>
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
            </StyledContentBlock>
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

export default SubjectBody;
