import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useAccountContext } from 'context';
import locale from '../courseResources.locale';
import { a11yProps, reverseA11yProps } from '../courseResourcesHelpers';
import { getCampusByCode } from 'helpers/general';
import { SubjectBody } from './SubjectBody';
import { TabPanel } from './TabPanel';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
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

export const courseTabLabel = 'subjecttab';

export const MyCourses = ({
    loadSubjectAndFocusOnTab,
    preselectedCourse,
    readingList,
    examList,
    guideList,
    coursemenu,
    setCurrentMenuTab,
}) => {
    const { account } = useAccountContext();
    const classes = useStyles();

    const handleCourseTabChange = (event, subjectTabId) => {
        /* istanbul ignore next */
        if (!event.target.innerText) {
            // we didnt get a course code?
            return;
        }
        const coursecode = event.target.innerText;
        loadSubjectAndFocusOnTab(coursecode, subjectTabId);
    };

    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const focusOnSelectedSubjectTab = React.useCallback(
        preselectedCourse => {
            if (!initialLoadComplete) {
                let preselectedSubjectTab = null;
                !!account &&
                    !!account.current_classes &&
                    !!account.current_classes.length > 0 &&
                    account.current_classes.map((item, index) => {
                        if (
                            item.classnumber === preselectedCourse.coursecode &&
                            getCampusByCode(item.CAMPUS) === preselectedCourse.campus &&
                            item.semester === preselectedCourse.semester
                        ) {
                            preselectedSubjectTab = `${courseTabLabel}-${index}`;
                        }
                    });
                /* istanbul ignore else */
                if (preselectedSubjectTab !== null) {
                    setCurrentMenuTab(preselectedSubjectTab);
                }
            }
            setInitialLoadComplete(true);
        },
        [account, initialLoadComplete, setCurrentMenuTab],
    );

    React.useEffect(() => {
        if (!!preselectedCourse.coursecode) {
            focusOnSelectedSubjectTab(preselectedCourse);
        }
    }, [preselectedCourse, focusOnSelectedSubjectTab]); // run once on load

    // based on https://material-ui.com/components/tabs/#automatic-scroll-buttons
    return (
        <Fragment>
            {!!account && !!account.current_classes && account.current_classes.length > 0 ? (
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
                                <SubjectBody
                                    subject={item}
                                    readingList={readingList}
                                    examList={examList}
                                    guideList={guideList}
                                />
                            </TabPanel>
                        );
                    })}
                </Fragment>
            ) : (
                <Grid
                    container
                    spacing={3}
                    data-testid="no-classes"
                    style={{ paddingLeft: 24, paddingRight: 24 }}
                    className={'noreadingLists'}
                >
                    <Grid item>
                        <Typography variant={'h5'}>{locale.myCourses.none.title}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {locale.myCourses.none.description}
                    </Grid>
                </Grid>
            )}
        </Fragment>
    );
};

MyCourses.propTypes = {
    loadSubjectAndFocusOnTab: PropTypes.func,
    preselectedCourse: PropTypes.any,
    readingList: PropTypes.object,
    examList: PropTypes.object,
    guideList: PropTypes.object,
    coursemenu: PropTypes.string,
    setCurrentMenuTab: PropTypes.func,
};

export default MyCourses;
