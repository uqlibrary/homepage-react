import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAccountContext } from 'context';
import { useLocation } from 'react-router';

import locale from '../courseResourcesLocale';
import { a11yProps, reverseA11yProps } from '../courseResourcesHelpers';
import { getCampusByCode, isRepeatingString } from 'helpers/general';
import { MyCourses } from './MyCourses';
import { SearchCourseResources } from './SearchCourseResources';
import { TabPanel } from './TabPanel';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

export const CourseResources = ({
    actions,
    examList,
    examListLoading,
    examListError,
    guideList,
    guideListLoading,
    guideListError,
    readingList,
    readingListLoading,
    readingListError,
}) => {
    const { account } = useAccountContext();
    const location = useLocation();

    const getQueryParams = qs => {
        const qs1 = qs.split('+').join(' ');
        const re = /[?&]?([^=]+)=([^&]*)/g;
        const params = {};

        let tokens;
        // eslint-disable-next-line no-cond-assign
        while ((tokens = re.exec(qs1))) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }

        return params;
    };

    // store a list of the Guides that have been loaded, by subject
    const [currentGuidesList, updateGuidesList] = useState([]);

    // store a list of the Exams that have been loaded, by subject
    const [currentExamsList, updateExamsList] = useState([]);

    // store a list of the Reading Lists that have been loaded, by subject
    const [currentReadingLists, updateReadingLists] = useState([]);

    const loadNewSubject = React.useCallback(
        (classnumber, campus = null, semester = null) => {
            console.log('loadNewSub: classnumber = ', classnumber, ';  campus = ', campus, ';  semester = ', semester);
            if (!classnumber || classnumber.length <= 3 || isRepeatingString(classnumber)) {
                return;
            }

            const firstClass =
                (!!account.current_classes && account.current_classes.length > 0 && account.current_classes[0]) || null;
            if (!currentGuidesList[classnumber]) {
                actions.loadGuides(classnumber);
            }

            if (!currentExamsList[classnumber]) {
                !actions.loadExams(classnumber);
            }

            if (!currentReadingLists[classnumber]) {
                actions.loadReadingLists(
                    classnumber,
                    campus || (!!firstClass.CAMPUS && getCampusByCode(firstClass.CAMPUS)) || '',
                    semester || (!!firstClass.semester && firstClass.semester) || '',
                    account,
                );
            }
        },
        [currentGuidesList, currentExamsList, currentReadingLists, account, actions],
    );

    const params = getQueryParams(location.search);
    React.useEffect(() => {
        if (!!params.coursecode && !!params.campus && !!params.semester) {
            if (!currentReadingLists[params.coursecode]) {
                console.log('main');
                loadNewSubject(params.coursecode, params.campus, params.semester);
            }
        }
    }, [params, currentReadingLists, loadNewSubject]);

    const getInitialTopTabState = () => {
        let initialTopTabState = 'top1';
        // if has account and no search param supplied, show My Course tab
        if (!!account.current_classes && account.current_classes.length && (!params || !params.coursecode)) {
            initialTopTabState = 'top0';
        }
        // if has account and param supplied and param in account list, show My Course tab
        !!account.current_classes &&
            account.current_classes.length &&
            !!params &&
            account.current_classes.map(item => {
                if (
                    item.classnumber === (params.coursecode || '') &&
                    getCampusByCode(item.CAMPUS) === (params.campus || '') &&
                    item.semester === (params.semester || '')
                ) {
                    initialTopTabState = 'top0';
                }
            });
        return initialTopTabState;
    };
    /**
     * The page consists of 2 sections:
     * - the user's enrolled courses (aka subjects), and
     * - search area
     * If the user is enrolled in courses then we load that section: top0
     * Otherwise we load the search section: top1
     * These sections are displayed as 2 tabs across the top
     */
    const [topmenu, setCurrentTopTab] = useState(getInitialTopTabState);
    const handleTopTabChange = (event, topMenuTabId) => {
        setCurrentTopTab(topMenuTabId);
    };

    const [listSearchedSubjects, addToSearchList] = useState([]);
    const updateSearchList = newSearchKey => {
        addToSearchList(newSearchKey);
    };

    // store the reading list for this subject in currentReadingLists by subject
    const updateListOfReadingLists = React.useCallback(() => {
        if (!!readingList && !!readingList.coursecode && currentReadingLists[readingList.coursecode] === undefined) {
            const newReadingList = {};
            // newReadingList[readingList.coursecode] = filterReadingLists(readingList);
            newReadingList[readingList.coursecode] = readingList;
            updateReadingLists(currentReadingLists => Object.assign({}, ...currentReadingLists, ...newReadingList));
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
            // if (subjectNumber !== false && currentGuidesList.subjectNumber === undefined) {
            if (subjectNumber !== false && currentGuidesList[subjectNumber] === undefined) {
                const newGuidesList = {};
                newGuidesList[subjectNumber] = guideList;
                updateGuidesList(currentGuidesList => Object.assign({}, ...currentGuidesList, ...newGuidesList));
            }
        }
    }, [guideList, currentGuidesList]);

    React.useEffect(() => {
        updateGuidesSubjectList();
    }, [updateGuidesSubjectList]);

    // load exams into an array, so we dont have to call it again
    const updateExamsSubjectList = React.useCallback(() => {
        if (!!examList && !!examList.coursecode) {
            const subjectNumber = examList.coursecode;
            if (subjectNumber !== false && currentExamsList[subjectNumber] === undefined) {
                const newExamsList = {};
                newExamsList[subjectNumber] = examList;
                updateExamsList(currentExamsList => Object.assign({}, ...currentExamsList, ...newExamsList));
            }
        }
    }, [examList, currentExamsList]);

    React.useEffect(() => {
        updateExamsSubjectList();
    }, [updateExamsSubjectList]);

    // load the data for the first class (it is automatically displayed if the user has classes). Should only run once
    React.useEffect(() => {
        const firstEnrolledClassNumber =
            (!!account.current_classes &&
                account.current_classes.length > 0 &&
                !!account.current_classes[0] &&
                account.current_classes[0].classnumber) ||
            null;
        console.log('one');
        loadNewSubject(firstEnrolledClassNumber);
    }, [account, loadNewSubject]);

    const readingLists = {
        list: currentReadingLists,
        loading: readingListLoading,
        error: readingListError,
    };

    const examLists = {
        list: currentExamsList,
        loading: examListLoading,
        error: examListError,
    };

    const guideLists = {
        list: currentGuidesList,
        loading: guideListLoading,
        error: guideListError,
    };

    return (
        <StandardPage title={locale.title} goBackFunc={() => history.back()} goBackTooltip="Go back">
            <div className="layout-card" style={{ margin: '0 auto 16px' }}>
                <StandardCard noPadding noHeader customBackgroundColor="#F7F7F7" style={{ boxShadow: '0 0 black' }}>
                    <Grid container>
                        <Grid item xs={12} data-testid="course-resources" style={{ marginBottom: 24 }}>
                            <AppBar
                                data-testid="course-resource-top-menu"
                                id="course-resource-top-menu"
                                position="static"
                                component="div"
                            >
                                <Tabs centered onChange={handleTopTabChange} value={topmenu}>
                                    <Tab value="top0" label={locale.myCourses.title} {...a11yProps('0')} />
                                    <Tab value="top1" label={locale.search.title} {...a11yProps('1')} />
                                </Tabs>
                            </AppBar>

                            <TabPanel
                                value={topmenu}
                                index="top0" // must match 'value' in Tabs
                                label="topmenu"
                                {...reverseA11yProps('0')}
                            >
                                <MyCourses
                                    loadNewSubject={loadNewSubject}
                                    preselectedCourse={params}
                                    readingList={readingLists}
                                    examList={examLists}
                                    guideList={guideLists}
                                />
                            </TabPanel>
                            <TabPanel
                                value={topmenu}
                                index="top1" // must match 'value' in Tabs
                                label="topmenu"
                                {...reverseA11yProps('1')}
                            >
                                <SearchCourseResources
                                    listSearchedSubjects={listSearchedSubjects}
                                    loadNewSubject={loadNewSubject}
                                    updateSearchList={updateSearchList}
                                    preselectedCourse={params}
                                    readingList={readingLists}
                                    examList={examLists}
                                    guideList={guideLists}
                                />
                            </TabPanel>
                        </Grid>
                    </Grid>
                </StandardCard>
            </div>
        </StandardPage>
    );
};

CourseResources.propTypes = {
    actions: PropTypes.object,
    examList: PropTypes.any,
    examListLoading: PropTypes.bool,
    examListError: PropTypes.any,
    guideList: PropTypes.any,
    guideListLoading: PropTypes.bool,
    guideListError: PropTypes.any,
    learningResourcesList: PropTypes.any,
    learningResourcesListLoading: PropTypes.bool,
    learningResourcesListError: PropTypes.any,
    readingList: PropTypes.any,
    readingListLoading: PropTypes.bool,
    readingListError: PropTypes.any,
};

export default React.memo(CourseResources);
