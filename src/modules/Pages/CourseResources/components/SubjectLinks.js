import React from 'react';
import PropTypes from 'prop-types';

import locale from '../courseresourceslocale';

import { SpacedArrowForwardIcon } from './SpacedArrowForwardIcon';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import Grid from '@material-ui/core/Grid';

const _courseLink = (courseId, url) => {
    return url + courseId;
};

export const SubjectLinks = ({ subject }) => (
    <Grid container spacing={3} className={'CourseLinks'}>
        <Grid item xs={12}>
            <StandardCard title={locale.myCourses.links.title}>
                <Grid container>
                    <Grid item xs={12} style={{ borderTop: '1px solid #e8e8e8', padding: '15px 0' }}>
                        <a
                            // on-click="linkClicked"
                            href={_courseLink(subject.classnumber, locale.myCourses.electronicCourseProfileLinkPrefix)}
                        >
                            <SpacedArrowForwardIcon />
                            {locale.myCourses.links.ecp}
                        </a>
                    </Grid>
                    <Grid style={{ borderTop: '1px solid #e8e8e8', padding: '15px 0' }}>
                        <a
                            // on-click="linkClicked"
                            id="blackboard"
                            href={_courseLink(subject.classnumber, locale.myCourses.blackboardLinkOut)}
                        >
                            <SpacedArrowForwardIcon />
                            {locale.myCourses.links.blackboard}
                        </a>
                    </Grid>
                </Grid>
            </StandardCard>
        </Grid>
    </Grid>
);

SubjectLinks.propTypes = {
    subject: PropTypes.object,
};
