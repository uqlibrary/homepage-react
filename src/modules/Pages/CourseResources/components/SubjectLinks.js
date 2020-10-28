import React from 'react';
import PropTypes from 'prop-types';

import locale from '../courseResourcesLocale';
import { _courseLink } from '../courseResourcesHelpers';
import { SpacedArrowForwardIcon } from './SpacedArrowForwardIcon';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(
    () => ({
        courseResourceLineItem: {
            borderTop: '1px solid #e8e8e8',
            padding: '15px 0',
            '&:last-child': {
                borderBottom: '1px solid #e8e8e8',
            },
            '& a': {
                display: 'flex',
                alignItems: 'center',
            },
        },
    }),
    { withTheme: true },
);

export const SubjectLinks = ({ subject }) => {
    const classes = useStyles();
    return (
        <Grid container spacing={3} className={'CourseLinks'}>
            <Grid item xs={12}>
                <StandardCard title={locale.myCourses.links.title}>
                    <Grid container>
                        <Grid item xs={12} className={classes.courseResourceLineItem}>
                            <a
                                // on-click="linkClicked"
                                data-testid={`ecp-${subject.classnumber}`}
                                href={_courseLink(subject.classnumber, locale.myCourses.links.ecp.linkOutPattern)}
                            >
                                <SpacedArrowForwardIcon />
                                {locale.myCourses.links.ecp.title}
                            </a>
                        </Grid>
                        <Grid item xs={12} className={classes.courseResourceLineItem}>
                            <a
                                // on-click="linkClicked"
                                data-testid={`blackboard-${subject.classnumber}`}
                                href={_courseLink(
                                    subject.classnumber,
                                    locale.myCourses.links.blackboard.linkOutPattern,
                                )}
                            >
                                <SpacedArrowForwardIcon />
                                {locale.myCourses.links.blackboard.title}
                            </a>
                        </Grid>
                    </Grid>
                </StandardCard>
            </Grid>
        </Grid>
    );
};

SubjectLinks.propTypes = {
    subject: PropTypes.object,
};
