import React from 'react';
import PropTypes from 'prop-types';

import locale from '../courseResources.locale';
import { _courseLink } from '../courseResourcesHelpers';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
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

export const SubjectLinks = ({ subject, headingLevel }) => {
    const classes = useStyles();

    // on the first render, add Legal Research Essentials to the Course Links for LAWS subjects
    /* istanbul ignore next */
    !locale.myCourses.courseLinks.links.find(i => i.id === 'legalResearchEssentials') &&
        subject.classnumber.startsWith('LAWS') &&
        locale.myCourses.courseLinks.links.push(locale.myCourses.courseLinks.legalResearchEssentials);

    return (
        <StandardCard fullHeight noHeader standardCardId={`subject-links-${subject.classnumber}`}>
            <Typography component={headingLevel} variant="h6" style={{ paddingBottom: '15px', fontWeight: 300 }}>
                {locale.myCourses.courseLinks.title}
            </Typography>
            <Grid container className={'CourseLinks'}>
                {!!locale.myCourses.courseLinks.links &&
                    locale.myCourses.courseLinks.links.length > 0 &&
                    locale.myCourses.courseLinks.links.map((item, index) => {
                        /* istanbul ignore next */
                        const dataTestid =
                            (!!item.id && subject.classnumber && `${item.id}-${subject.classnumber}`) || null;
                        return (
                            item.linkOutPattern &&
                            item.linkLabel && (
                                <Grid
                                    item
                                    className={classes.courseResourceLineItem}
                                    key={`studylink-${index}`}
                                    xs={12}
                                >
                                    <a
                                        data-testid={dataTestid}
                                        id={dataTestid}
                                        href={_courseLink(subject.classnumber, item.linkOutPattern)}
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
    headingLevel: PropTypes.string,
    subject: PropTypes.object,
};
