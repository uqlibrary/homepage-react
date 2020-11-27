import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import { a11yProps, extractSubjectCodeFromName, reverseA11yProps } from '../courseResourcesHelpers';
import { CourseResourceSearch } from 'modules/SharedComponents/CourseResourceSearch';
import { SubjectBody } from './SubjectBody';
import { TabPanel } from './TabPanel';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

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

export const SearchCourseResources = ({
    account,
    loadNewSubject,
    preselectedCourse,
    listSearchedSubjects,
    updateSearchList,
    readingList,
    examList,
    guideList,
}) => {
    const classes = useStyles();

    const subjectTabLabel = 'searchtab';
    const [searchTab, setCurrentSearchTab] = useState(`${subjectTabLabel}-0`);
    const handleSearchTabChange = (event, newSubjectTabId) => {
        setCurrentSearchTab(newSubjectTabId);
    };

    const shouldAddToSearchList = searchKeyword => {
        return searchKeyword.length >= 8;
    };

    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const focusOnSelectedSubjectTab = React.useCallback(
        preselectedCourse => {
            if (!initialLoadComplete) {
                let tabId = null;
                const searchKeyword = preselectedCourse.coursecode || '';
                const campus = preselectedCourse.campus || '';
                const semester = preselectedCourse.semester || '';
                if (!listSearchedSubjects.includes(searchKeyword) && shouldAddToSearchList(searchKeyword)) {
                    loadNewSubject(searchKeyword, campus, semester);
                    updateSearchList(listSearchedSubjects.concat(searchKeyword));

                    tabId = listSearchedSubjects.length;
                } else {
                    tabId = listSearchedSubjects.indexOf(searchKeyword);
                }

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
                        {listSearchedSubjects.map((subjectName, index) => {
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
                {listSearchedSubjects.map((subjectCode, index) => {
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
                            />
                        </TabPanel>
                    );
                })}
            </Fragment>
        );
    };

    const loadCourseAndSelectTab = (searchKeyword, suggestions) => {
        let tabId;

        const thisSuggestion =
            (!!suggestions && suggestions.filter(course => (course.text || '') === searchKeyword).pop()) || null;
        const campus = (!!thisSuggestion && thisSuggestion.rest?.campus) || '';
        const semester = (!!thisSuggestion && thisSuggestion.rest?.period) || '';
        if (!listSearchedSubjects.includes(searchKeyword) && shouldAddToSearchList(searchKeyword)) {
            loadNewSubject(searchKeyword, campus, semester);
            updateSearchList(listSearchedSubjects.concat(searchKeyword));

            tabId = listSearchedSubjects.length;
        } else {
            tabId = listSearchedSubjects.indexOf(searchKeyword);
        }

        setCurrentSearchTab(`${subjectTabLabel}-${tabId}`);
    };

    return (
        <StandardCard noPadding noHeader standardCardId="full-courseresource" style={{ boxShadow: 'none' }}>
            <Grid item xs={12} id="courseresource-search">
                <CourseResourceSearch
                    displayType="full"
                    elementId="full-courseresource"
                    loadCourseAndSelectTab={loadCourseAndSelectTab}
                />
                {!!listSearchedSubjects && listSearchedSubjects.length > 0 && renderSearchResults(listSearchedSubjects)}
            </Grid>
        </StandardCard>
    );
};

SearchCourseResources.propTypes = {
    account: PropTypes.object,
    loadNewSubject: PropTypes.func,
    listSearchedSubjects: PropTypes.array,
    preselectedCourse: PropTypes.any,
    updateSearchList: PropTypes.func,
    readingList: PropTypes.object,
    examList: PropTypes.object,
    guideList: PropTypes.object,
};
