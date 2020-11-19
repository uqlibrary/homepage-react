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
    subject.classnumber.startsWith('LAWS') && locale.studyHelp.links.push(locale.studyHelp.legalResearchEssentials);

    return (
        <StandardCard fullHeight title={locale.myCourses.links.title}>
            <Grid container className={'CourseLinks'}>
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
                        href={_courseLink(subject.classnumber, locale.myCourses.links.blackboard.linkOutPattern)}
                    >
                        <SpacedArrowForwardIcon />
                        {locale.myCourses.links.blackboard.title}
                    </a>
                </Grid>
                {!!locale.studyHelp.links &&
                    locale.studyHelp.links.length > 0 &&
                    locale.studyHelp.links.map((item, index) => {
                        return (
                            item.linkTo &&
                            item.linkLabel && (
                                <Grid
                                    item
                                    className={classes.courseResourceLineItem}
                                    key={`studylink-${index}`}
                                    xs={12}
                                >
                                    <a
                                        // on-tap="linkClicked"
                                        id={item.id || null}
                                        href={item.linkTo}
                                    >
                                        {!!item.icon && item.icon}
                                        {item.linkLabel}
                                    </a>
                                </Grid>
                            )
                        );
                    })}
            </Grid>
        </StandardCard>
    );
};

SubjectLinks.propTypes = {
    subject: PropTypes.object,
};
