import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useAccountContext } from 'context';

import locale from './courseresourceslocale';

import { Guides } from './Guides';
import { LearningResources } from './LearningResources';
import { PastExamPapers } from './PastExamPapers';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import PrimoSearch from 'modules/reusable/PrimoSearch/containers/PrimoSearch';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

function TabPanel(props) {
    const { children, value, tabId, index, ...other } = props;

    return (
        <Grid
            role="tabpanel"
            hidden={value !== index}
            id={tabId || `tabpanel-${index}`}
            aria-labelledby={tabId || `tabpanel-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3} style={{ paddingLeft: 0, paddingRight: 0 }}>
                    {children}
                </Box>
            )}
        </Grid>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
    tabId: PropTypes.string,
};

function a11yProps(index, classname = null) {
    const label = classname || index;
    return {
        id: `${label}-${index}`,
        'aria-controls': `${label}panel-${index}`,
    };
}

export const CourseResources = ({
    actions,
    guideList,
    guideListLoading,
    guideListError,
    learningResourcesList, // has sub element reading_lists (summary)
    learningResourcesListLoading,
    learningResourcesListError,
    readingList, // list of books. chapters, etc
    readingListLoading,
    readingListError,
}) => {
    const { account } = useAccountContext();

    const [topmenu, setCurrentTopTab] = useState(!!account.classes && account.classes.length ? 'top0' : 'top1');
    const handleTopTabChange = (event, topMenuTabId) => {
        setCurrentTopTab(topMenuTabId);
    };

    const [currentLearningResourcesList, updateLearningResourcesList] = useState([]);
    const [currentGuidesList, updateGuidesList] = useState([]);
    const [currentReadingLists, updateReadingLists] = useState([]);

    const handleSubjectChange = classnumber => {
        if (!currentLearningResourcesList[classnumber]) {
            !!classnumber && actions.loadLearningResources(classnumber);
        }

        if (!currentGuidesList[classnumber]) {
            !!classnumber && actions.loadGuides(classnumber);
        }
    };

    const courseTabLabel = 'subjecttab';
    const [coursemenu, setCurrentMenuTab] = useState(`${courseTabLabel}-0`);
    const handleCourseTabChange = (event, subjectTabId) => {
        !!event.target.innerText && handleSubjectChange(event.target.innerText);
        setCurrentMenuTab(subjectTabId);
    };
    const filterReadingLists = (learningResourcesList, classnumber, classes) => {
        const readingLists =
            (!!learningResourcesList &&
                learningResourcesList.length > 0 &&
                !!learningResourcesList[0] &&
                learningResourcesList[0].reading_lists) ||
            [];

        if (!readingLists || readingLists.length === 0) {
            return [];
        }

        if (readingLists.length === 1) {
            return readingLists;
        }

        // do better
        const enrolment = classes.filter(aClass => aClass.classnumber === classnumber)[0];

        return readingLists.filter(item => {
            // // if (searchedCourse != null && searchedCourse.courseId === course.courseId) {
            // /*
            //     search results are currently an array of results like this:
            //     {
            //         "name": "MATH2010",
            //         "url": "http:\/\/lr.library.uq.edu.au\/lists\/B89931FE-50AE-7102-7925-18EE386EAA4D",
            //         "type": "learning_resource",
            //         "course_title": "Analysis of Ordinary Differential Equations",
            //         "campus": "St Lucia",
            //         "period": "Semester 2 2020"
            //     }
            // */
            // //     semesterString = searchedCourse.term === enrolment.semester;
            // //     campus = searchedCourse.campus;
            // // } else {
            return item.period === enrolment.semester;
            // }
        });
    };

    // get the long Talis string, like 2109F2EC-AB0B-482F-4D30-1DD3531E46BE fromm the Talis url
    const getReadingListId = readingList => {
        let id = '';
        if (!!readingList.url) {
            const url = readingList.url;
            id = url.substring(url.lastIndexOf('/') + 1);
            if (id.indexOf('.') !== -1) {
                id = id.substring(0, url.indexOf('.'));
            }
        }
        return id;
    };

    const requestReadingListLoad = (learningResources, subjectNumber, currentClasses) => {
        const filteredReadingLists =
            !!learningResources && learningResources.length > 0
                ? filterReadingLists(learningResources, subjectNumber, currentClasses)
                : [];
        if (filteredReadingLists.length === 1) {
            const talisId = getReadingListId(filteredReadingLists[0]);
            if (!!talisId && currentReadingLists.talisId === undefined) {
                actions.loadReadingLists(talisId);
            }
        }
    };

    const updateLearningResourceSubjectList = React.useCallback((learningResourcesList, currentClasses) => {
        if (!!learningResourcesList && learningResourcesList.length > 0 && learningResourcesList[0].title) {
            const subjectNumber = learningResourcesList[0].title;
            if (currentLearningResourcesList.subjectNumber === undefined) {
                const newLearningResourcesList = {};
                newLearningResourcesList[subjectNumber] = learningResourcesList;
                updateLearningResourcesList(currentLearningResourcesList =>
                    Object.assign({}, ...currentLearningResourcesList, ...newLearningResourcesList),
                );

                requestReadingListLoad(learningResourcesList, subjectNumber, currentClasses);
            }
        }
    });

    const getSubjectNumberbyTalisid = talisId => {
        let subjectNumber = false;
        Object.values(currentLearningResourcesList).map(item => {
            const readingList = !!item[0].reading_lists && item[0].reading_lists.length > 0 && item[0].reading_lists[0];
            if (talisId === getReadingListId(readingList)) {
                subjectNumber = item[0].title;
            }
        });
        return subjectNumber;
    };

    React.useEffect(() => {
        updateLearningResourceSubjectList(learningResourcesList, account.classes);
    }, [learningResourcesList]);

    const updateListOfReadingLists = React.useCallback(readingList => {
        if (!!readingList && readingList.length > 0 && !!readingList[0].talisId) {
            const subject = getSubjectNumberbyTalisid(readingList[0].talisId);
            if (currentReadingLists.subject === undefined) {
                const newReadingList = {};
                newReadingList[subject] = readingList;
                updateReadingLists(currentReadingLists => Object.assign({}, ...currentReadingLists, ...newReadingList));
            }
        }
    });

    React.useEffect(() => {
        updateListOfReadingLists(readingList);
    }, [readingList]);

    const updateGuidesSubjectList = React.useCallback(guideList => {
        if (!!guideList && guideList.length > 0 && guideList[0].coursecode) {
            const subjectNumber = guideList[0].coursecode;
            if (currentGuidesList.subjectNumber === undefined) {
                const newGuidesList = {};
                newGuidesList[subjectNumber] = guideList;
                updateGuidesList(currentGuidesList => Object.assign({}, ...currentGuidesList, ...newGuidesList));
            }
        }
    });

    React.useEffect(() => {
        updateGuidesSubjectList(guideList);
    }, [guideList]);

    // load the data for the first class (it is automatically displayed). Should only run once
    React.useEffect(() => {
        const firstEnrolledClassNumber =
            (!!account.classes &&
                account.classes.length > 0 &&
                !!account.classes[0] &&
                account.classes[0].classnumber) ||
            null;
        if (firstEnrolledClassNumber !== null) {
            !!firstEnrolledClassNumber && actions.loadLearningResources(firstEnrolledClassNumber);

            !!firstEnrolledClassNumber && actions.loadGuides(firstEnrolledClassNumber);
        }
    }, [account, actions]);

    const renderNoListedCourses = (
        <Fragment>
            <Typography component={'h2'} variant={'h6'}>
                No listed courses
            </Typography>
            <p>Courses will be shown 3 weeks prior to the start of semester</p>
            <p>Please check back closer to the next enrollment period</p>
            <p>You can search for information on courses using the &quot;Course Search&quot; tab, above</p>
        </Fragment>
    );

    const renderStudyHelpLinks = (
        <Fragment>
            {!!locale.studyHelpLinks &&
                locale.studyHelpLinks.length > 0 &&
                locale.studyHelpLinks.map((item, index) => {
                    return item.linkTo && item.linkLabel ? (
                        <Grid
                            item
                            key={`studylink-${index}`}
                            xs={12}
                            style={{ borderTop: '1px solid #e8e8e8', padding: '15px 0' }}
                        >
                            <a
                                // on-tap="linkClicked"
                                id={item.id || null}
                                href={item.linkTo}
                            >
                                {!!item.icon && item.icon}
                                {item.linkLabel}
                            </a>
                        </Grid>
                    ) : (
                        <Typography>No resources right now</Typography>
                    );
                })}
        </Fragment>
    );

    const _courseLink = (courseId, url) => {
        return url + courseId;
    };

    const renderSubjectCourseLinks = subject => {
        return (
            <Grid>
                <Grid style={{ borderTop: '1px solid #e8e8e8', padding: '15px 0' }}>
                    <a
                        // on-click="linkClicked"
                        href={_courseLink(subject.classnumber, locale.ecpLinkUrl)}
                    >
                        <ArrowForwardIcon style={{ paddingRight: '1rem' }} />
                        Electronic Course Profile
                    </a>
                </Grid>
                <Grid style={{ borderTop: '1px solid #e8e8e8', padding: '15px 0' }}>
                    <a
                        // on-click="linkClicked"
                        id="blackboard"
                        href={_courseLink(subject.classnumber, locale.blackboardUrl)}
                    >
                        <ArrowForwardIcon style={{ paddingRight: '1rem' }} />
                        Learn.UQ (Blackboard)
                    </a>
                </Grid>
            </Grid>
        );
    };

    const renderSubjectTabBody = subject => {
        const courseTitle =
            !!learningResourcesList && learningResourcesList.length > 0 ? learningResourcesList[0].course_title : null;

        return (
            <Grid container>
                <Grid item xs={12} style={{ textAlign: 'center' }}>
                    <Typography color={'primary'} variant={'h5'} component={'span'} style={{ fontSize: '1.33rem' }}>
                        {subject.classnumber} - {courseTitle}
                    </Typography>
                </Grid>

                <LearningResources
                    // actions={actions}
                    classnumber={subject.classnumber}
                    currentClasses={account.classes}
                    readingList={currentReadingLists[[subject.classnumber]]}
                    readingListLoading={readingListLoading}
                    readingListError={readingListError}
                    learningResourcesList={currentLearningResourcesList[subject.classnumber]}
                    learningResourcesListLoading={learningResourcesListLoading}
                    learningResourcesListError={learningResourcesListError}
                    subject={subject}
                />

                <PastExamPapers
                    subject={subject}
                    learningResourcesList={learningResourcesList}
                    learningResourcesListLoading={learningResourcesListLoading}
                    learningResourcesListError={learningResourcesListError}
                />

                <Guides
                    guideList={currentGuidesList[subject.classnumber]}
                    guideListLoading={guideListLoading}
                    guideListError={guideListError}
                />

                <StandardCard
                    className="CourseLinks"
                    style={{ width: '100%', marginBottom: '1rem' }}
                    title="Course links"
                >
                    {renderSubjectCourseLinks(subject)}
                </StandardCard>
            </Grid>
        );
    };

    /*
    let classes = account.classes || null;

    // dev hack while we wait for api update (needs more fields)
    if (classes === null) {
        classes = [
            {
                SUBJECT: 'FREN',
                subjectLevel: '1010',
                classnumber: 'FREN1010',
                classname: 'Introductory French 1',
            },
            {
                SUBJECT: 'HIST',
                subjectLevel: '1201',
                classnumber: 'HIST1201',
                classname: 'The Australian  Experience',
            },
            {
                SUBJECT: 'PHIL',
                subjectLevel: '1002',
                classnumber: 'PHIL1002',
                classname: 'Introduction to Philosophy: What is Philosophy?',
            },
        ];
    }
    */

    const renderCurrentCourses = (
        <Fragment>
            <AppBar position="static" style={{ backgroundColor: 'white', color: 'black' }}>
                <Tabs onChange={handleCourseTabChange} scrollButtons="auto" value={coursemenu} variant="scrollable">
                    {account.classes.map((item, index) => {
                        return (
                            <Tab
                                {...a11yProps(index, 'classtab')}
                                data-testid={`classtab-${index}`}
                                key={`classtab-${index}`}
                                id={`classtab-${index}`}
                                label={item.classnumber}
                                value={`${courseTabLabel}-${index}`} // must match index in TabPanel
                            />
                        );
                    })}
                </Tabs>
            </AppBar>
            {account.classes.map((item, index) => {
                return (
                    <TabPanel
                        data-testid={`classpanel-${index}`}
                        index={`${courseTabLabel}-${index}`} // must match value in Tabs
                        key={`classpanel-${index}`}
                        tabId="coursemenu"
                        value={coursemenu}
                        style={{ margin: 0 }}
                    >
                        {renderSubjectTabBody(item)}
                    </TabPanel>
                );
            })}
        </Fragment>
    );

    return (
        <StandardPage>
            <div className="layout-card" style={{ margin: '-8px auto 16px' }}>
                <StandardCard noPadding noHeader>
                    <Grid
                        // alignItems={'flex-end'}
                        container
                        spacing={1}
                        style={{ paddingTop: 12, paddingRight: 30, paddingBottom: 12, paddingLeft: 30 }}
                    >
                        <Grid item xs={12} md={'auto'} id="courseresources">
                            <InputLabel id="courseresources-label">Course Resources</InputLabel>
                        </Grid>
                        <Grid item xs={12} id="courseresource-search">
                            <AppBar position="static">
                                <Tabs centered onChange={handleTopTabChange} value={topmenu}>
                                    <Tab value="top0" label="My courses" {...a11yProps('top0')} />
                                    <Tab value="top1" label="Course Search" {...a11yProps('top1')} />
                                    <Tab value="top2" label="Study help" {...a11yProps('top2')} />
                                </Tabs>
                            </AppBar>

                            <TabPanel value={topmenu} index="top0" tabId="topmenu">
                                {!!account.classes && account.classes.length > 0 ? (
                                    <Grid>{renderCurrentCourses}</Grid>
                                ) : (
                                    <Grid>{renderNoListedCourses}</Grid>
                                )}
                            </TabPanel>
                            <TabPanel value={topmenu} index="top1" tabId="topmenu">
                                <Grid item xs={12} id="courseresource-search">
                                    <PrimoSearch displayType="courseresources" />
                                </Grid>
                            </TabPanel>
                            <TabPanel value={topmenu} index="top2" tabId="topmenu">
                                <Grid
                                    alignContent={'space-between'}
                                    container
                                    style={{ minHeight: '10rem', borderBottom: '1px solid #e8e8e8' }}
                                >
                                    {renderStudyHelpLinks}
                                </Grid>
                            </TabPanel>
                        </Grid>
                    </Grid>
                </StandardCard>
            </div>
        </StandardPage>
    );
};

CourseResources.propTypes = {
    readingList: PropTypes.any,
    readingListLoading: PropTypes.bool,
    readingListError: PropTypes.string,
    learningResourcesList: PropTypes.any,
    learningResourcesListLoading: PropTypes.bool,
    learningResourcesListError: PropTypes.string,
    guideList: PropTypes.any,
    guideListLoading: PropTypes.bool,
    guideListError: PropTypes.string,
    actions: PropTypes.object,
};

export default React.memo(CourseResources);
