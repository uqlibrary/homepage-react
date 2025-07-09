import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useAccountContext } from 'context';
import locale from '../shared/learningResources.locale';
import { a11yProps, reverseA11yProps } from '../shared/learningResourcesHelpers';
import { getCampusByCode } from 'helpers/general';
import { SubjectBody } from '../shared/SubjectBody';
import { TabPanel } from '../shared/TabPanel';
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: theme.palette.white.main,
    color: theme.palette.secondary.dark,
    boxShadow: 'none',
    border: '1px solid rgba(0, 0, 0, 0.2)',
}));

const StyledTabPanel = styled(TabPanel)(() => ({
    '& >div': {
        padding: 0,
    },
}));

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
        thisPreselectedCourse => {
            if (!initialLoadComplete) {
                let preselectedSubjectTab = null;
                !!account &&
                    !!account.current_classes &&
                    !!account.current_classes.length > 0 &&
                    account.current_classes.map((item, index) => {
                        if (
                            item.classnumber === thisPreselectedCourse.coursecode &&
                            getCampusByCode(item.CAMPUS) === thisPreselectedCourse.campus &&
                            item.semester === thisPreselectedCourse.semester
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
        <>
            {!!account && !!account.current_classes && account.current_classes.length > 0 ? (
                <>
                    <StyledAppBar position="static" component="div">
                        <Tabs
                            onChange={handleCourseTabChange}
                            scrollButtons="auto"
                            value={coursemenu}
                            variant="scrollable"
                        >
                            {account.current_classes.map((subject, index) => {
                                return (
                                    <Tab
                                        {...a11yProps(index, 'classtab')}
                                        data-testid={`classtab-${index}`}
                                        data-analyticsid={`classtab-${index}`}
                                        key={`classtab-${index}`}
                                        label={subject.classnumber}
                                        value={`${courseTabLabel}-${index}`} // must match 'index' in TabPanel
                                    />
                                );
                            })}
                        </Tabs>
                    </StyledAppBar>
                    {account.current_classes.map((subject, index) => {
                        return (
                            <StyledTabPanel
                                data-testid={`classpanel-${index}`}
                                index={`${courseTabLabel}-${index}`} // must match 'value' in Tab
                                label="classpanel"
                                key={`classpanel-${index}`}
                                tabId="coursemenu"
                                value={coursemenu}
                                {...reverseA11yProps(index, 'classtab')}
                            >
                                <SubjectBody
                                    subject={subject}
                                    readingList={readingList}
                                    examList={examList}
                                    guideList={guideList}
                                />
                            </StyledTabPanel>
                        );
                    })}
                </>
            ) : (
                <Grid container spacing={3} data-testid="no-classes" className={'noreadingLists'}>
                    <Grid item>
                        <Typography variant={'h5'}>No enrolled courses available</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <p>Your enrolled courses will appear here three weeks prior to the start of the semester.</p>
                        <p>Search for learning resources using the &apos;Course search&apos; tab, above.</p>
                    </Grid>
                </Grid>
            )}
        </>
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
