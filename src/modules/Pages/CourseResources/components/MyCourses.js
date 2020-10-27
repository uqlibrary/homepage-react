import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useAccountContext } from 'context';

import locale from '../courseResourcesLocale';

import { TabPanel } from './TabPanel';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(
    theme => ({
        myCoursesTabBar: {
            backgroundColor: theme.palette.accent.main,
            color: 'white',
        },
        noclasses: {
            marginBottom: '1rem',
            marginTop: '1rem',
        },
        courseTabs: {
            margin: 0,
        },
    }),
    { withTheme: true },
);

export const MyCourses = ({ a11yProps, loadNewSubject, renderSubjectTabBody }) => {
    const { account } = useAccountContext();
    const classes = useStyles();

    const courseTabLabel = 'subjecttab';
    const [coursemenu, setCurrentMenuTab] = useState(`${courseTabLabel}-0`);
    const handleCourseTabChange = (event, subjectTabId) => {
        !!event.target.innerText && loadNewSubject(event.target.innerText);
        setCurrentMenuTab(subjectTabId);
    };

    return (
        <Fragment>
            {!!account.classes && account.classes.length > 0 ? (
                <Fragment>
                    <AppBar position="static" className={classes.myCoursesTabBar}>
                        <Tabs
                            onChange={handleCourseTabChange}
                            scrollButtons="auto"
                            value={coursemenu}
                            variant="scrollable"
                        >
                            {account.classes.map((item, index) => {
                                return (
                                    <Tab
                                        {...a11yProps(index, 'classtab')}
                                        data-testid={`classtab-${index}`}
                                        key={`classtab-${index}`}
                                        id={`classtab-${index}`}
                                        label={item.classnumber}
                                        value={`${courseTabLabel}-${index}`} // must match 'index' in TabPanel
                                    />
                                );
                            })}
                        </Tabs>
                    </AppBar>
                    {account.classes.map((item, index) => {
                        return (
                            <TabPanel
                                className={classes.courseTabs}
                                data-testid={`classpanel-${index}`}
                                index={`${courseTabLabel}-${index}`} // must match 'value' in Tab
                                key={`classpanel-${index}`}
                                tabId="coursemenu"
                                value={coursemenu}
                            >
                                {renderSubjectTabBody(item)}
                            </TabPanel>
                        );
                    })}
                </Fragment>
            ) : (
                <Grid container spacing={3} className={'noreadingLists'}>
                    <Grid item xs={12}>
                        <StandardCard className={classes.noclasses} title={locale.myCourses.none.title}>
                            <Grid container>
                                <Grid item xs={12}>
                                    {locale.myCourses.none.description}
                                </Grid>
                            </Grid>
                        </StandardCard>
                    </Grid>
                </Grid>
            )}
        </Fragment>
    );
};

MyCourses.propTypes = {
    a11yProps: PropTypes.func,
    loadNewSubject: PropTypes.func,
    renderSubjectTabBody: PropTypes.func,
};

export default MyCourses;
