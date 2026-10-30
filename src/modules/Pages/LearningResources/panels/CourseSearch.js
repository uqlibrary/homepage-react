import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { a11yProps, extractSubjectCodeFromName, reverseA11yProps } from '../shared/learningResourcesHelpers';
import { default as locale } from '../shared/learningResources.locale';
import { SubjectBody } from '../shared/SubjectBody';
import { TabPanel } from '../shared/TabPanel';
import { SubjectSearchDropdown } from 'modules/SharedComponents/SubjectSearchDropdown';
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
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
export const isEnrolledInSubject = (subject, account) => {
    return (
        (!!account &&
            !!account.current_classes &&
            account.current_classes.length > 0 &&
            account.current_classes.filter(item => {
                return (item.classnumber || '') === subject;
            }).length > 0) ||
        false
    );
};
export const isACurrentClass = (courseCode, account) => {
    return !!account && !!account.current_classes && account.current_classes.some(c => c.classnumber === courseCode);
};

export const isValidSubjectNumber = searchKeyword => {
    return searchKeyword.length >= 8;
};

export const getPlaceInCurrentAccountList = (subject, account) => {
    // probably a better way to do this...
    let counter = -1;
    let result = -1;
    !!account &&
        !!account.current_classes &&
        account.current_classes.length > 0 &&
        Object.values(account.current_classes).map(i => {
            counter++;
            if (i.classnumber === subject) {
                result = counter;
            }
        });
    return result;
};

export const getSubjectDetails = (subjectCode, examList, readingList) => {
    const subject = {};
    subject.classnumber = subjectCode;
    subject.title =
        (!!examList &&
            !!examList.list &&
            !!examList.list[subjectCode] &&
            !!examList.list[subjectCode].title &&
            examList.list[subjectCode].title) ||
        (!!readingList &&
            !!readingList.list &&
            !!readingList.list[subjectCode] &&
            !!readingList.list[subjectCode].course_title &&
            readingList.list[subjectCode].course_title) ||
        '';
    return subject;
};

export const CourseSearch = ({
    account,
    loadNewSubject,
    preselectedCourse,
    listSearchedSubjects,
    updateSearchList,
    readingList,
    examList,
    guideList,
    selectMyCoursesTab,
}) => {
    React.useEffect(() => {
        // when the page loads on the Search tab, put focus in the input field
        const searchField = document.getElementById('full-learningresource-autocomplete');
        !!searchField && searchField.focus();
    }, []);

    const subjectTabLabel = 'searchtab';
    const [searchTab, setCurrentSearchTab] = useState(`${subjectTabLabel}-0`);
    const handleSearchTabChange = (event, newSubjectTabId) => {
        setCurrentSearchTab(newSubjectTabId);
    };

    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const focusOnSelectedSubjectTab = useCallback(
        course => {
            if (!initialLoadComplete) {
                let tabId = null;

                /* istanbul ignore next */
                const searchKeyword = course.coursecode || '';

                const campus = course.campus || '';

                const semester = course.semester || '';
                loadNewSubject(searchKeyword, campus, semester);
                if (!listSearchedSubjects.includes(searchKeyword)) {
                    // function not called when listSearchedSubjects has keyword, so the `if` is only for paranoia
                    updateSearchList(searchKeyword);
                }

                tabId = 0;

                setCurrentSearchTab(`${subjectTabLabel}-${tabId}`);
            }
            setInitialLoadComplete(true);
        },
        [listSearchedSubjects, initialLoadComplete, loadNewSubject, updateSearchList],
    );

    React.useEffect(() => {
        if (!!preselectedCourse.coursecode && !isACurrentClass(preselectedCourse.coursecode, account)) {
            focusOnSelectedSubjectTab(preselectedCourse);
        }
    }, [preselectedCourse, focusOnSelectedSubjectTab, account]); // run once on load

    const loadCourseAndSelectTab = React.useCallback(
        (searchKeyword, suggestions) => {
            let tabId;

            const thisSuggestion =
                (!!suggestions &&
                    suggestions
                        .filter(course => {
                            return (course.courseCode || '') === searchKeyword;
                        })
                        .pop()) ||
                null;

            const campus = thisSuggestion?.campus || '';

            const semester = thisSuggestion?.semester || '';

            // if subject is in 'your courses' list, swap to that tab
            if (isEnrolledInSubject(searchKeyword, account)) {
                // swap to correct tab on Your Courses tab
                const subjectId = getPlaceInCurrentAccountList(searchKeyword, account);
                selectMyCoursesTab(searchKeyword, subjectId);
            } else if (
                !(
                    !!listSearchedSubjects &&
                    listSearchedSubjects.length > 0 &&
                    listSearchedSubjects.includes(searchKeyword)
                ) &&
                isValidSubjectNumber(searchKeyword)
            ) {
                loadNewSubject(searchKeyword, campus, semester);
                /* istanbul ignore else */
                if (!listSearchedSubjects.includes(searchKeyword)) {
                    updateSearchList(searchKeyword);
                }

                tabId = listSearchedSubjects.length;
                setCurrentSearchTab(`${subjectTabLabel}-${tabId}`);
            } else {
                tabId =
                    !!listSearchedSubjects && listSearchedSubjects.length > 0
                        ? listSearchedSubjects.indexOf(searchKeyword)
                        : 0;
                setCurrentSearchTab(`${subjectTabLabel}-${tabId}`);
            }
        },
        [account, listSearchedSubjects, selectMyCoursesTab, loadNewSubject, updateSearchList],
    );

    return (
        <Grid container spacing={3} id={'full-learningresource'} data-testid={'full-learningresource'}>
            <Grid size={{ xs: 12 }} id="learningresource-search">
                <SubjectSearchDropdown
                    displayType="full"
                    elementId="full-learningresource"
                    loadCourseAndSelectTab={loadCourseAndSelectTab}
                />
            </Grid>
            {!!listSearchedSubjects && listSearchedSubjects.length > 0 && (
                <Grid
                    size={{ xs: 12 }}
                    role="region"
                    aria-live="assertive"
                    aria-label="Learning Resource Search Results"
                >
                    <Typography component="h2" variant="h6" id="learning-resource-search-results">
                        {locale.searchResultsTitle}
                    </Typography>
                    <StyledAppBar position="static">
                        <Tabs
                            onChange={handleSearchTabChange}
                            scrollButtons="auto"
                            value={searchTab}
                            variant="scrollable"
                        >
                            {!!listSearchedSubjects &&
                                listSearchedSubjects.length > 0 &&
                                listSearchedSubjects.map((subjectName, index) => {
                                    const subjectCode = extractSubjectCodeFromName(subjectName);
                                    return (
                                        <Tab
                                            data-testid={`classtab-${subjectCode}`}
                                            data-analyticsid={`classtab-${subjectCode}`}
                                            key={`classtab-${subjectCode}`}
                                            label={subjectCode}
                                            value={`${subjectTabLabel}-${index}`} // must match 'index' in TabPanel
                                            {...a11yProps(index, subjectTabLabel)}
                                        />
                                    );
                                })}
                        </Tabs>
                    </StyledAppBar>
                    {!!listSearchedSubjects &&
                        listSearchedSubjects.length > 0 &&
                        listSearchedSubjects.map((subjectCode, index) => {
                            return (
                                <StyledTabPanel
                                    data-testid={`classpanel-${index}`}
                                    index={`${subjectTabLabel}-${index}`} // must match 'value' in Tabs
                                    label="classpanel"
                                    key={`classpanel-${index}`}
                                    tabId={searchTab}
                                    value={searchTab}
                                    {...reverseA11yProps(index, subjectTabLabel)}
                                >
                                    <SubjectBody
                                        subject={getSubjectDetails(subjectCode, examList, readingList)}
                                        readingList={readingList}
                                        examList={examList}
                                        guideList={guideList}
                                        panelHeadingLevel="h4"
                                        subjectHeaderLevel="h3"
                                    />
                                </StyledTabPanel>
                            );
                        })}
                </Grid>
            )}
        </Grid>
    );
};

CourseSearch.propTypes = {
    account: PropTypes.object,
    loadNewSubject: PropTypes.func,
    listSearchedSubjects: PropTypes.array,
    preselectedCourse: PropTypes.any,
    updateSearchList: PropTypes.func,
    readingList: PropTypes.object,
    examList: PropTypes.object,
    guideList: PropTypes.object,
    selectMyCoursesTab: PropTypes.func,
};
