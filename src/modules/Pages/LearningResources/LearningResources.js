import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useAccountContext } from 'context';
import { useLocation } from 'react-router-dom';
import { throttle } from 'throttle-debounce';

import locale from './shared/learningResources.locale';
import global from 'locale/global';
import { a11yProps, extractSubjectCodeFromName, reverseA11yProps } from './shared/learningResourcesHelpers';
import { getCampusByCode, isRepeatingString } from 'helpers/general';
import { courseTabLabel, MyCourses } from './panels/MyCourses';
import { CourseSearch } from './panels/CourseSearch';
import { TabPanel } from './shared/TabPanel';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { styled } from '@mui/material/styles';
import { breadcrumbs } from 'config/routes';

// lecturers are now maintaining their own courses (it used to be the Library learning Resource team)
// the Talis screen is just a text field, in which they are supposed to put the course ID
// and then a space and the campus - freeform :(
// now lecturers are putting much longer strings into some courses, eg where they have combined courses
// EDUC1234 / EDUC1235 / EDUC6789 St Lucia
// assume they are following their instructions and putting the campus on the end
function getNormalisedCampus(params) {
    let found = false;
    Object.values(global.campuses).map(validCampusname => {
        if (!!params.campus && params.campus.includes(validCampusname)) {
            found = validCampusname;
        }
    });
    return found;
}

export const isValidInput = params => {
    /**
     * the user must supply 3 parameters: course code, semester and campus
     * this will normally come from the home page
     * course code should be a valid coursecode, 4 char + 4 numbers + optional char
     * semester can be only letters and numbers
     * and campus must be in the global campus lookup list
     * (this cant go in the helpers file because it needs the global locale, which cant be reached during cypress tests)
     * @param params
     * @returns {boolean}
     */
    let valid = true;

    const allowedKeys = ['coursecode', 'campus', 'semester'];
    if (window.location.hostname === 'localhost') {
        allowedKeys.push('user');
    }

    Object.keys(params).map(key => {
        if (!allowedKeys.includes(key)) {
            valid = false;
        }
    });

    const validCourseCodePattern = new RegExp('^[A-Z]{4}[0-9]{4}[A-Z]?$');
    valid = !!valid && !!params.coursecode && validCourseCodePattern.test(params.coursecode);

    if (!!valid) {
        valid = !params.campus || !!getNormalisedCampus(params);
    }

    const validSemesterPattern = new RegExp('^[A-Za-z0-9,/ ]+$');
    valid = !!valid && !!params.semester && validSemesterPattern.test(params.semester);

    return valid;
};

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
    '& .TabSelected': {
        color: 'white !important',
        opacity: 1,
    },
    '& .TabUnselected': {
        color: 'white !important',
        opacity: 0.5,
    },
}));

export const getQueryParams = qs => {
    const qs1 = qs.split('+').join(' ');
    const re = /[?&]?([^=]+)=([^&]*)/g;
    const params = {};

    let tokens;
    // eslint-disable-next-line no-cond-assign
    while ((tokens = re.exec(qs1))) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }
    if (!isValidInput(params)) {
        return [];
    }

    return {
        ...params,
        campus: getNormalisedCampus(params),
    };
};

export const LearningResources = ({
    actions,
    examLearningResourceList,
    examLearningResourceListLoading,
    examLearningResourceListError,
    guideList,
    guideListLoading,
    guideListError,
    readingList,
    readingListLoading,
    readingListError,
}) => {
    /**
     * The page consists of 2 sections:
     * - the user's enrolled courses (aka subjects), and
     * - search area
     * If the user is enrolled in courses then we load that section: mycoursestab
     * Otherwise we load the search section: searchtab
     * These sections are displayed as 2 tabs across the top
     */

    const { account } = useAccountContext();
    const location = useLocation();

    useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.learningresources.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.learningresources.pathname);
    }, []);

    // store a list of the Guides that have been loaded, by subject
    const [currentGuidesList, updateGuidesList] = useState([]);

    // store a list of the Exams that have been loaded, by subject
    const [currentExamsList, updateExamsList] = useState([]);

    // store a list of the Reading Lists that have been loaded, by subject
    const [currentReadingLists, updateReadingLists] = useState([]);

    const throttledGuideLoad = useRef(throttle(1000, classnumber => actions.loadGuides(classnumber)));
    const throttledExamsLoad = useRef(throttle(1000, classnumber => actions.loadExamLearningResources(classnumber)));
    const throttledReadingListLoad = useRef(
        throttle(1000, (classnumber, campus, semester) => actions.loadReadingLists(classnumber, campus, semester)),
    );
    const loadNewSubject = React.useCallback(
        (classnumber, campus, semester) => {
            const minLengthOfValidCourseCode = 8;
            if (!classnumber || classnumber.length < minLengthOfValidCourseCode || isRepeatingString(classnumber)) {
                return;
            }

            if (!currentGuidesList[classnumber]) {
                throttledGuideLoad.current(classnumber);
            }

            if (!currentExamsList[classnumber]) {
                throttledExamsLoad.current(classnumber);
            }

            if (!currentReadingLists[classnumber]) {
                throttledReadingListLoad.current(classnumber, campus, semester);
            }
        },
        [currentGuidesList, currentExamsList, currentReadingLists],
    );

    const params = getQueryParams(location.search);
    useEffect(() => {
        if (!!params.coursecode && !!params.campus && !!params.semester) {
            if (!currentReadingLists[params.coursecode]) {
                loadNewSubject(params.coursecode, params.campus, params.semester);
            }
        }
    }, [params, currentReadingLists, loadNewSubject]);

    const getInitialTopTabState = () => {
        let initialTopTabState = 'searchtab';
        // if has account and no search param supplied, show My Course tab
        if (
            !!account &&
            !!account.current_classes &&
            account.current_classes.length > 0 &&
            (!params || !params.coursecode)
        ) {
            initialTopTabState = 'mycoursestab';
        }
        // if has account and param supplied and param in account list, show My Course tab
        !!params &&
            !!account &&
            !!account.current_classes &&
            account.current_classes.length > 0 &&
            account.current_classes.map(item => {
                /* istanbul ignore else */
                const campus = params.campus || '';
                /* istanbul ignore else */
                const semester = params.semester || '';
                if (
                    item.classnumber === params.coursecode &&
                    getCampusByCode(item.CAMPUS) === campus &&
                    item.semester === semester
                ) {
                    initialTopTabState = 'mycoursestab';
                }
            });
        return initialTopTabState;
    };
    const [topmenu, setCurrentTopTab] = useState(getInitialTopTabState);
    const handleTopTabChange = (event, topMenuTabId) => {
        setCurrentTopTab(topMenuTabId);
    };

    const [listSearchedSubjects, addToSearchList] = useState([]);
    const updateSearchList = newSearchKey => {
        addToSearchList(listSearchedSubjects.concat(newSearchKey));
    };

    const [coursemenu, setCurrentMenuTab] = useState(`${courseTabLabel}-0`);

    const loadSubjectAndFocusOnTab = (coursecode, subjectTabId) => {
        if (!currentReadingLists[coursecode]) {
            const enrolledClass =
                (!!account &&
                    !!account.current_classes &&
                    account.current_classes.find(c => c.classnumber === coursecode)) ||
                /* istanbul ignore next */ null;
            const campus =
                (!!enrolledClass && !!enrolledClass.CAMPUS && getCampusByCode(enrolledClass.CAMPUS)) ||
                /* istanbul ignore next */ null;
            const semester =
                (!!enrolledClass && !!enrolledClass.semester && enrolledClass.semester) ||
                /* istanbul ignore next */ null;
            loadNewSubject(coursecode, campus, semester);
        }

        setCurrentMenuTab(subjectTabId);
    };

    const selectMyCoursesTab = (subjectId, tabPosition) => {
        setCurrentTopTab('mycoursestab');
        const tabLabel = `${courseTabLabel}-${tabPosition}`;

        loadSubjectAndFocusOnTab(subjectId, tabLabel);
    };

    // store the reading list for this subject in currentReadingLists by subject
    const updateListOfReadingLists = React.useCallback(() => {
        if (!!readingList && !!readingList.coursecode && currentReadingLists[readingList.coursecode] === undefined) {
            const newReadingList = {};
            newReadingList[readingList.coursecode] = readingList;
            updateReadingLists(currentReadings => {
                return { ...currentReadings, ...newReadingList };
            });
        }
    }, [readingList, currentReadingLists]);

    React.useEffect(() => {
        // per https://wanago.io/2019/11/18/useeffect-hook-in-react-custom-hooks/
        updateListOfReadingLists();
    }, [updateListOfReadingLists]);

    // load guides into an array, so we dont have to call it again
    const updateGuidesSubjectList = React.useCallback(() => {
        if (
            !!guideList &&
            guideList.length > 0 &&
            !!guideList[0].coursecode &&
            currentGuidesList[guideList[0].coursecode] === undefined
        ) {
            const subjectNumber = guideList[0].coursecode;
            /* istanbul ignore else */
            if (subjectNumber !== false && currentGuidesList[subjectNumber] === undefined) {
                const newGuidesList = {};
                newGuidesList[subjectNumber] = guideList;
                updateGuidesList(currentGuides => {
                    return { ...currentGuides, ...newGuidesList };
                });
            }
        }
    }, [guideList, currentGuidesList]);

    React.useEffect(() => {
        updateGuidesSubjectList();
    }, [updateGuidesSubjectList]);

    // load exams into an array, so we dont have to call it again
    const updateExamsSubjectList = React.useCallback(() => {
        if (!!examLearningResourceList && !!examLearningResourceList.coursecode) {
            const subjectNumber = examLearningResourceList.coursecode;
            if (subjectNumber !== false && currentExamsList[subjectNumber] === undefined) {
                const newExamsList = {};
                newExamsList[subjectNumber] = examLearningResourceList;
                updateExamsList(currentExams => {
                    return { ...currentExams, ...newExamsList };
                });
            }
        }
    }, [examLearningResourceList, currentExamsList]);

    React.useEffect(() => {
        updateExamsSubjectList();
    }, [updateExamsSubjectList]);

    // load the data for the first class (it is automatically displayed if the user has classes). Should only run once
    React.useEffect(() => {
        const firstEnrolledClassNumber =
            (!!account.current_classes && account.current_classes.length > 0 && account.current_classes[0]) || null;
        const coursecode = extractSubjectCodeFromName(
            (!!firstEnrolledClassNumber && account.current_classes[0].classnumber) || null,
        );
        const campus =
            (!!firstEnrolledClassNumber &&
                !!firstEnrolledClassNumber.CAMPUS &&
                getCampusByCode(firstEnrolledClassNumber.CAMPUS)) ||
            null;
        const semester =
            (!!firstEnrolledClassNumber && !!firstEnrolledClassNumber.semester && firstEnrolledClassNumber.semester) ||
            null;

        loadNewSubject(coursecode, campus, semester);
    }, [account.current_classes, loadNewSubject]);

    const readingLists = {
        list: currentReadingLists,
        loading: readingListLoading,
        error: readingListError,
    };

    const examLists = {
        list: currentExamsList,
        loading: examLearningResourceListLoading,
        error: examLearningResourceListError,
    };

    const guideLists = {
        list: currentGuidesList,
        loading: guideListLoading,
        error: guideListError,
    };

    return (
        <StandardPage title={locale.title}>
            <section aria-live="assertive">
                <StandardCard style={{ border: '1px solid #d1d0d2' }} noPadding noHeader>
                    <Grid container>
                        <Grid item xs={12} data-testid="learning-resources">
                            <StyledAppBar
                                data-analyticsid="learning-resource-top-menu"
                                data-testid="learning-resource-top-menu"
                                id="learning-resource-top-menu"
                                position="static"
                                component="div"
                            >
                                <Tabs centered onChange={handleTopTabChange} value={topmenu}>
                                    <Tab
                                        className={topmenu === 'mycoursestab' ? 'TabSelected' : 'TabUnselected'}
                                        value="mycoursestab"
                                        label={locale.myCourses.title}
                                        {...a11yProps('0')}
                                    />
                                    <Tab
                                        value="searchtab"
                                        className={topmenu === 'searchtab' ? 'TabSelected' : 'TabUnselected'}
                                        label={locale.search.title}
                                        {...a11yProps('1')}
                                    />
                                </Tabs>
                            </StyledAppBar>

                            <TabPanel
                                value={topmenu}
                                index="mycoursestab" // must match 'value' in Tabs
                                label="topmenu"
                                {...reverseA11yProps('0')}
                            >
                                <MyCourses
                                    loadNewSubject={loadNewSubject}
                                    preselectedCourse={params}
                                    readingList={readingLists}
                                    examList={examLists}
                                    guideList={guideLists}
                                    setCurrentMenuTab={setCurrentMenuTab}
                                    coursemenu={coursemenu}
                                    loadSubjectAndFocusOnTab={loadSubjectAndFocusOnTab}
                                />
                            </TabPanel>
                            <TabPanel
                                value={topmenu}
                                index="searchtab" // must match 'value' in Tabs
                                label="topmenu"
                                {...reverseA11yProps('1')}
                            >
                                <CourseSearch
                                    account={account}
                                    listSearchedSubjects={listSearchedSubjects}
                                    loadNewSubject={loadNewSubject}
                                    updateSearchList={updateSearchList}
                                    preselectedCourse={params}
                                    readingList={readingLists}
                                    examList={examLists}
                                    guideList={guideLists}
                                    selectMyCoursesTab={selectMyCoursesTab}
                                />
                            </TabPanel>
                        </Grid>
                    </Grid>
                </StandardCard>
            </section>
        </StandardPage>
    );
};

LearningResources.propTypes = {
    actions: PropTypes.object,
    examLearningResourceList: PropTypes.any,
    examLearningResourceListLoading: PropTypes.bool,
    examLearningResourceListError: PropTypes.any,
    guideList: PropTypes.any,
    guideListLoading: PropTypes.bool,
    guideListError: PropTypes.any,
    readingList: PropTypes.any,
    readingListLoading: PropTypes.bool,
    readingListError: PropTypes.any,
};

export default React.memo(LearningResources);
