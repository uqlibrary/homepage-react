import React from 'react';
import PropTypes from 'prop-types';

import locale from '../shared/learningResources.locale';
import { _courseLink } from '../shared/learningResourcesHelpers';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { SpacedArrowForwardIcon } from '../shared/SpacedArrowForwardIcon';

const StyledItem = styled(Grid)(() => ({
    borderTop: '1px solid #e8e8e8',
    paddingBlock: '15px',
    '& a': {
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

export const SubjectLinks = ({ subject, headingLevel }) => {
    // on the first render, add Legal Research Essentials to the Course Links for LAWS subjects
    return (
        <StandardCard fullHeight noHeader standardCardId={`subject-links-${subject.classnumber}`}>
            <Typography component={headingLevel} variant="h6" style={{ paddingBottom: '15px', fontWeight: 500 }}>
                Course links
            </Typography>
            <Grid container className={'CourseLinks'}>
                <StyledItem item xs={12}>
                    <a data-testid="blackboard" id="blackboard" href="https://learn.uq.edu.au/">
                        <SpacedArrowForwardIcon />
                        <span>Learn.UQ (Blackboard)</span>
                    </a>
                </StyledItem>
                <StyledItem item xs={12}>
                    <a
                        data-testid="ecp"
                        id="ecp"
                        href={_courseLink(
                            subject.classnumber,
                            'https://www.uq.edu.au/study/course.html?course_code=[courseCode]',
                        )}
                    >
                        <SpacedArrowForwardIcon />
                        <span>Electronic Course Profile</span>
                    </a>
                </StyledItem>
                {subject.classnumber.startsWith('LAWS') && (
                    <StyledItem item xs={12}>
                        <a
                            data-testid="legalResearchEssentials"
                            id="legalResearchEssentials"
                            href="https://web.library.uq.edu.au/study-and-learning-support/training-and-workshops/legal-research-essentials"
                        >
                            <SpacedArrowForwardIcon />
                            <span>Legal Research Essentials</span>
                        </a>
                    </StyledItem>
                )}
            </Grid>
        </StandardCard>
    );
};

SubjectLinks.propTypes = {
    headingLevel: PropTypes.string,
    subject: PropTypes.object,
};
