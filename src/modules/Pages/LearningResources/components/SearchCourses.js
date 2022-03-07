import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { a11yProps, extractSubjectCodeFromName, reverseA11yProps } from '../learningResourcesHelpers';
import { default as locale } from '../learningResources.locale';
import { SubjectBody } from './SubjectBody';
import { TabPanel } from './TabPanel';
import { LearningResourceSearch } from 'modules/SharedComponents/LearningResourceSearch';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(
    theme => ({
        subjectTabBar: {
            backgroundColor: theme.palette.white.main,
            color: theme.palette.secondary.dark,
            marginTop: '24px',
        },
        tabPanel: {
            backgroundColor: 'rgb(247, 247, 247)',
            margin: 0,
        },
    }),
    { withTheme: true },
);

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

export const SearchCourses = ({
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
    const classes = useStyles();

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

    const isValidSubjectNumber = searchKeyword => {
        return searchKeyword.length >= 8;
    };

    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const focusOnSelectedSubjectTab = React.useCallback(
        preselectedCourse => {
            if (!initialLoadComplete) {
                let tabId = null;
                /* istanbul ignore next */
                const searchKeyword = preselectedCourse.coursecode || '';
                /* istanbul ignore next */
                const campus = preselectedCourse.campus || '';
                /* istanbul ignore next */
                const semester = preselectedCourse.semester || '';
                loadNewSubject(searchKeyword, campus, semester);
                /* istanbul ignore else */
                if (!listSearchedSubjects.includes(searchKeyword)) {
                    // function not called when listSearchedSubjects has keyword, so the `if` is only for paranoia
                    updateSearchList(searchKeyword);
                }

                // tabId = listSearchedSubjects.length === 0 ? 0 : listSearchedSubjects.length - 1;
                tabId = 0;

                setCurrentSearchTab(`${subjectTabLabel}-${tabId}`);
            }
            setInitialLoadComplete(true);
        },
        [listSearchedSubjects, initialLoadComplete, loadNewSubject, updateSearchList],
    );

    const isACurrentClass = (courseCode, account) => {
        return (
            !!account && !!account.current_classes && account.current_classes.some(c => c.classnumber === courseCode)
        );
    };

    React.useEffect(() => {
        if (!!preselectedCourse.coursecode && !isACurrentClass(preselectedCourse.coursecode, account)) {
            focusOnSelectedSubjectTab(preselectedCourse);
        }
    }, [preselectedCourse, focusOnSelectedSubjectTab, account]); // run once on load

    const renderSearchResults = listSearchedSubjects => {
        return (
            <Fragment>
                <AppBar position="static" className={classes.subjectTabBar}>
                    <Tabs onChange={handleSearchTabChange} scrollButtons="auto" value={searchTab} variant="scrollable">
                        {!!listSearchedSubjects &&
                            listSearchedSubjects.length > 0 &&
                            listSearchedSubjects.map((subjectName, index) => {
                                const subjectCode = extractSubjectCodeFromName(subjectName);
                                return (
                                    <Tab
                                        data-testid={`classtab-${subjectCode}`}
                                        key={`classtab-${subjectCode}`}
                                        label={subjectCode}
                                        value={`${subjectTabLabel}-${index}`} // must match 'index' in TabPanel
                                        {...a11yProps(index, subjectTabLabel)}
                                    />
                                );
                            })}
                    </Tabs>
                </AppBar>
                {!!listSearchedSubjects &&
                    listSearchedSubjects.length > 0 &&
                    listSearchedSubjects.map((subjectCode, index) => {
                        const subject = {};
                        subject.classnumber = subjectCode;
                        return (
                            <TabPanel
                                data-testid={`classpanel-${index}`}
                                index={`${subjectTabLabel}-${index}`} // must match 'value' in Tabs
                                label="classpanel"
                                key={`classpanel-${index}`}
                                tabId={searchTab}
                                value={searchTab}
                                className={classes.tabPanel}
                                {...reverseA11yProps(index, subjectTabLabel)}
                            >
                                <SubjectBody
                                    subject={subject}
                                    readingList={readingList}
                                    examList={examList}
                                    guideList={guideList}
                                    panelHeadingLevel="h4"
                                    subjectHeaderLevel="h3"
                                />
                            </TabPanel>
                        );
                    })}
            </Fragment>
        );
    };

    const getPlaceInCurrentAccountList = subject => {
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

    const loadCourseAndSelectTab = (searchKeyword, suggestions) => {
        let tabId;

        const thisSuggestion =
            (!!suggestions &&
                suggestions
                    .filter(course => {
                        return (course.courseCode || /* istanbul ignore next */ '') === searchKeyword;
                    })
                    .pop()) ||
            /* istanbul ignore next */ null;

        const campus = thisSuggestion?.campus || /* istanbul ignore next */ '';

        const semester = thisSuggestion?.semester || /* istanbul ignore next */ '';

        // if subject is in 'my courses' list, swap to that tab
        if (isEnrolledInSubject(searchKeyword, account)) {
            // swap to correct tab on My Courses tab
            const subjectId = getPlaceInCurrentAccountList(searchKeyword);
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
                    : /* istanbul ignore next */ 0;
            setCurrentSearchTab(`${subjectTabLabel}-${tabId}`);
        }
    };

    return (
        <Grid container spacing={3} id={'full-learningresource'} data-testid={'full-learningresource'}>
            <Grid item xs={12} id="learningresource-search">
                <LearningResourceSearch
                    displayType="full"
                    elementId="full-learningresource"
                    loadCourseAndSelectTab={loadCourseAndSelectTab}
                />
            </Grid>
            {!!listSearchedSubjects && listSearchedSubjects.length > 0 && (
                <Grid item xs={12} role="region" aria-live="assertive" aria-label="Learning Resource Search Results">
                    <Typography
                        component="h2"
                        variant="h6"
                        style={{ marginLeft: '1.2rem' }}
                        id="learning-resource-search-results"
                    >
                        {locale.searchResultsTitle}
                    </Typography>
                    {renderSearchResults(listSearchedSubjects)}
                </Grid>
            )}
        </Grid>
    );
};

SearchCourses.propTypes = {
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
