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
        <div
            role="tabpanel"
            hidden={value !== index}
            id={tabId || `tabpanel-${index}`}
            aria-labelledby={tabId || `tabpanel-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </div>
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
    readingList,
    readingListLoading,
    readingListError,
    learningResourcesList,
    learningResourcesListLoading,
    learningResourcesListError,
    guideList,
    guideListLoading,
    guideListError,
    actions,
}) => {
    const { account } = useAccountContext();

    /* istanbul ignore next */
    // React.useEffect(() => {
    //     // Load user's subject lists if it hasn't
    //     account.classes.map(aclass => {
    //         !!aclass.classnumber && !!loadReadingLists && loadReadingLists(aclass.classnumber);
    //         !!aclass.classnumber && !!loadGuides && loadGuides(aclass.classnumber);
    //         !!aclass.classnumber && !!loadLearningResources && loadLearningResources(aclass.classnumber);
    //     });
    // }, [loadReadingLists, loadGuides, loadLearningResources, account]);

    const [topmenu, setCurrentTopTab] = useState(!!account.classes && account.classes.length ? 'top0' : 'top1');
    const handleTopTabChange = (event, newValue) => {
        setCurrentTopTab(newValue);
    };

    // // get the long Talis string, like 2109F2EC-AB0B-482F-4D30-1DD3531E46BE fromm the Talis url
    // const getReadingListId = readingList => {
    //     let id = '';
    //     if (!!readingList.url) {
    //         const url = readingList.url;
    //         id = url.substring(url.lastIndexOf('/') + 1);
    //         if (id.indexOf('.') !== -1) {
    //             id = id.substring(0, url.indexOf('.'));
    //         }
    //     }
    //     return id;
    // };

    const handleSubjectChange = classnumber => {
        console.log('handleSubjectChange for', classnumber);

        actions.clearLearningResources();
        actions.clearGuides();
        actions.clearReadingLists();

        console.log('should be cleared now');

        // !!classnumber && !!actions.loadLearningResources && actions.loadLearningResources(classnumber);
        !!classnumber && actions.loadLearningResources(classnumber);
        // console.log('learningResourcesList = ', learningResourcesList);
        // filteredReadingLists = filterReadingLists(learningResourcesList, classnumber);
        // console.log('after filter, filteredReadingLists = ', filteredReadingLists);

        // !!classnumber && !!actions.loadGuides && actions.loadGuides(classnumber);
        !!classnumber && actions.loadGuides(classnumber);
        console.log('guideList = ', guideList);

        // console.log('handleSubjectChange: learningResourcesList = ', learningResourcesList);
        // if (
        //     !!learningResourcesList &&
        //     learningResourcesList.length > 0 &&
        //     learningResourcesList[0].reading_lists &&
        //     learningResourcesList[0].reading_lists.length === 1
        // ) {
        //     const readingListId = getReadingListId(learningResourcesList[0].reading_lists);
        //     if (readingListId !== '' && readingListId !== false) {
        //         // I think false is the 'wrong' value here
        //         // !!actions.loadReadingLists &&
        //         actions.loadReadingLists(readingListId);
        //         console.log('readingList = ', readingList);
        //     } else {
        //         console.log('readingList not fetched');
        //     }
        // }
    };

    let selectedCourse = '';

    const courseTabLabel = 'subjecttab';
    const [coursemenu, setCurrentMenuTab] = useState(`${courseTabLabel}-0`);
    const handleCourseTabChange = (event, newValue) => {
        !!event.target.innerText && handleSubjectChange(event.target.innerText);
        selectedCourse = !!event.target.innerText ? event.target.innerText : '';
        setCurrentMenuTab(newValue);
        console.log('at end of handleSubjectChange: filteredReadingLists = ', learningResourcesList);
    };
    console.log('selectedCourse = ', selectedCourse);

    const renderNoListedCourses = (
        <Fragment>
            <Typography component={'h2'} variant={'h6'}>
                No listed courses
            </Typography>
            <p>Courses will be shown 3 weeks prior to the start of semester</p>
            <p>Please check back closer to the next enrollment period</p>
            <p>You can search for information on courses using the &quot;Search&quot; tab, above</p>
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
                    actions={actions}
                    classnumber={subject.classnumber}
                    currentClasses={account.classes}
                    readingList={readingList}
                    readingListLoading={readingListLoading}
                    readingListError={readingListError}
                    learningResourcesList={learningResourcesList}
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

                <Guides guideList={guideList} guideListLoading={guideListLoading} guideListError={guideListError} />

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

    const renderCurrentCourses = readingLists => {
        console.log('renderCurrentCourses: readingLists = ', readingLists);
        return (
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
                                    value={`${courseTabLabel}-${index}`} // must match index in Tabpanel
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
                        >
                            <Grid>{renderSubjectTabBody(item)}</Grid>
                        </TabPanel>
                    );
                })}
            </Fragment>
        );
    };

    console.log('just before render, readingLists = ', learningResourcesList);
    const readingLists =
        !!learningResourcesList && learningResourcesList.length > 0 ? learningResourcesList[0].reading_lists : [];
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
                                    <Grid>{renderCurrentCourses(readingLists)}</Grid>
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
