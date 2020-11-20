import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useAccountContext } from 'context';

import locale from '../courseResourcesLocale';
import { a11yProps, reverseA11yProps } from '../courseResourcesHelpers';
import { getCampusByCode } from 'helpers/general';

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
            backgroundColor: theme.palette.white.main,
            color: theme.palette.secondary.dark,
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

export const MyCourses = ({ loadNewSubject, renderSubjectTabBody, preselectedCourse }) => {
    const { account } = useAccountContext();
    const classes = useStyles();

    const courseTabLabel = 'subjecttab';
    const [coursemenu, setCurrentMenuTab] = useState(`${courseTabLabel}-0`);
    const handleCourseTabChange = (event, subjectTabId) => {
        console.log('handleCourseTabChange');
        !!event.target.innerText && loadNewSubject(event.target.innerText);
        setCurrentMenuTab(subjectTabId);
    };

    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const focusOnSelectedSubjectTab = React.useCallback(
        preselectedCourse => {
            if (!initialLoadComplete) {
                let preselectedSubjectTab = null;
                account.current_classes.map((item, index) => {
                    if (
                        item.classnumber === preselectedCourse.coursecode &&
                        getCampusByCode(item.CAMPUS) === preselectedCourse.campus &&
                        item.semester === preselectedCourse.semester
                    ) {
                        preselectedSubjectTab = `${courseTabLabel}-${index}`;
                    }
                });
                if (preselectedSubjectTab !== null) {
                    console.log('focusOnSelectedSubjectTab: will set subject tab to ', preselectedSubjectTab);
                    setCurrentMenuTab(preselectedSubjectTab);
                }
            }
            setInitialLoadComplete(true);
        },
        [account, initialLoadComplete],
    );

    React.useEffect(() => {
        if (!!preselectedCourse.coursecode) {
            focusOnSelectedSubjectTab(preselectedCourse);
        }
    }, [preselectedCourse, focusOnSelectedSubjectTab]); // run once on load

    // based on https://material-ui.com/components/tabs/#automatic-scroll-buttons
    return (
        <Fragment>
            {!!account.current_classes && account.current_classes.length > 0 ? (
                <Fragment>
                    <AppBar position="static" className={classes.myCoursesTabBar} component="div">
                        <Tabs
                            onChange={handleCourseTabChange}
                            scrollButtons="auto"
                            value={coursemenu}
                            variant="scrollable"
                        >
                            {account.current_classes.map((item, index) => {
                                return (
                                    <Tab
                                        {...a11yProps(index, 'classtab')}
                                        data-testid={`classtab-${index}`}
                                        key={`classtab-${index}`}
                                        label={item.classnumber}
                                        value={`${courseTabLabel}-${index}`} // must match 'index' in TabPanel
                                    />
                                );
                            })}
                        </Tabs>
                    </AppBar>
                    {account.current_classes.map((item, index) => {
                        return (
                            <TabPanel
                                className={classes.courseTabs}
                                data-testid={`classpanel-${index}`}
                                index={`${courseTabLabel}-${index}`} // must match 'value' in Tab
                                label="classpanel"
                                key={`classpanel-${index}`}
                                tabId="coursemenu"
                                value={coursemenu}
                                {...reverseA11yProps(index, 'classtab')}
                            >
                                {renderSubjectTabBody(item)}
                            </TabPanel>
                        );
                    })}
                </Fragment>
            ) : (
                <Grid container spacing={3} data-testid="no-classes" className={'noreadingLists'}>
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
    loadNewSubject: PropTypes.func,
    renderSubjectTabBody: PropTypes.func,
    preselectedCourse: PropTypes.any,
};

export default MyCourses;
