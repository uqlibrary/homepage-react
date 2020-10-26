import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAccountContext } from 'context';

import locale from '../courseresourceslocale';

import { Guides } from './Guides';
import { ReadingLists } from './ReadingLists';
import { MyCourses } from './MyCourses';
import { PastExamPapers } from './PastExamPapers';
import { SearchCourseResources } from './SearchCourseResources';
import { SubjectLinks } from './SubjectLinks';
import { TabPanel } from './TabPanel';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import { makeStyles } from '@material-ui/styles';

import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

function a11yProps(index, classname = null) {
    const label = classname || index;
    return {
        id: `${label}-${index}`,
        'aria-controls': `${label}panel-${index}`,
    };
}

const useStyles = makeStyles(
    () => ({
        resourceBackground: {
            borderTop: '1px solid #e8e8e8',
            padding: '15px 0',
        },
        panelLayout: {
            padding: '12px 30px',
        },
        studyLinks: {
            borderBottom: '1px solid #e8e8e8',
            minHeight: '10rem',
        },
    }),
    { withTheme: true },
);

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
    const classes = useStyles();

    const [topmenu, setCurrentTopTab] = useState(!!account.classes && account.classes.length ? 'top0' : 'top1');
    const handleTopTabChange = (event, topMenuTabId) => {
        setCurrentTopTab(topMenuTabId);
    };

    // store a list of the Learning Resources that have been loaded, by subject
    const [currentLearningResourcesList, updateLearningResourcesList] = useState([]);

    // store a list of the Guides that have been loaded, by subject
    const [currentGuidesList, updateGuidesList] = useState([]);

    // store a list of the Reading Lists that have been loaded, by subject
    const [currentReadingLists, updateReadingLists] = useState([]);

    const loadNewSubject = classnumber => {
        if (!currentLearningResourcesList[classnumber]) {
            !!classnumber && actions.loadLearningResources(classnumber);
        }

        if (!currentGuidesList[classnumber]) {
            !!classnumber && actions.loadGuides(classnumber);
        }
    };

    const [displayType, setDisplayType] = useState('mycourses');
    const [keywordPresets, setKeywordPresets] = useState({});

    const [listSearchedSubjects, updateSearchList] = useState([]);
    // may need state of 'listMyCourses' which then shows the mycourses tab?

    const getCampusByCode = code => {
        const campuses = {
            STLUC: 'St Lucia',
            GATTN: 'Gatton',
            IPSWC: 'Ipswich',
            HERST: 'Herston',
        };
        if (campuses.hasOwnProperty(code)) {
            return campuses[code];
        }

        return null;
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

        // TODO, improve this
        const enrolment = classes.filter(aClass => aClass.classnumber === classnumber)[0];

        if (displayType === 'searchresults') {
            const semesterString = keywordPresets.period;
            const campus = keywordPresets.campus;
            return readingLists.filter(item => {
                return item.period === semesterString && item.campus.indexOf(campus) !== -1;
            });
        } else {
            const semesterString = enrolment.semester;
            const campus = getCampusByCode(enrolment.CAMPUS);
            return readingLists.filter(item => {
                return (
                    item.period === semesterString &&
                    (item.campus.indexOf(campus) !== -1 || enrolment.INSTRUCTION_MODE === 'EX')
                );
            });
        }
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

    React.useEffect(() => {
        updateLearningResourceSubjectList(learningResourcesList, account.classes);
    }, [learningResourcesList]);

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

    // load the data for the first class (it is automatically displayed if the user has classes). Should only run once
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

    const renderStudyHelpLinks = (
        <Grid alignContent={'space-between'} className={classes.studyLinks} container>
            <Grid item xs={12}>
                <StandardCard title={locale.studyHelp.title}>
                    {!!locale.studyHelp.links &&
                        locale.studyHelp.links.length > 0 &&
                        locale.studyHelp.links.map((item, index) => {
                            return item.linkTo && item.linkLabel ? (
                                <Grid className={classes.resourceBackground} item key={`studylink-${index}`} xs={12}>
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
                                <Typography>{locale.studyHelp.unavailable}</Typography>
                            );
                        })}
                </StandardCard>
            </Grid>
        </Grid>
    );

    const renderSubjectTabBody = subject => {
        const courseTitle =
            !!currentLearningResourcesList &&
            !!currentLearningResourcesList[subject.classnumber] &&
            !!currentLearningResourcesList[subject.classnumber][0] &&
            !!currentLearningResourcesList[subject.classnumber][0].course_title
                ? currentLearningResourcesList[subject.classnumber][0].course_title
                : null;

        return (
            <Grid container>
                <Grid item xs={12}>
                    <Typography color={'primary'} component={'h3'} variant={'h5'} style={{ textAlign: 'center' }}>
                        {subject.classnumber} - {courseTitle}
                    </Typography>
                </Grid>

                <ReadingLists
                    // actions={actions}
                    classnumber={subject.classnumber}
                    currentClasses={account.classes}
                    filterReadingLists={filterReadingLists}
                    readingList={currentReadingLists[[subject.classnumber]]}
                    readingListLoading={readingListLoading}
                    readingListError={readingListError}
                    learningResourcesList={currentLearningResourcesList[subject.classnumber]}
                    learningResourcesListLoading={learningResourcesListLoading}
                    learningResourcesListError={learningResourcesListError}
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

                <SubjectLinks subject={subject} />
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

    return (
        <StandardPage title={locale.title}>
            <div className="layout-card" style={{ margin: '16px auto' }}>
                <StandardCard noPadding noHeader>
                    <Grid className={classes.panelLayout} container spacing={1}>
                        <Grid item xs={12} id="courseresource-search">
                            <AppBar position="static">
                                <Tabs centered onChange={handleTopTabChange} value={topmenu}>
                                    <Tab value="top0" label={locale.myCourses.title} {...a11yProps('top0')} />
                                    <Tab value="top1" label={locale.search.title} {...a11yProps('top1')} />
                                    <Tab value="top2" label={locale.studyHelp.title} {...a11yProps('top2')} />
                                </Tabs>
                            </AppBar>

                            <TabPanel value={topmenu} index="top0" tabId="topmenu">
                                <MyCourses
                                    a11yProps={a11yProps}
                                    loadNewSubject={loadNewSubject}
                                    renderSubjectTabBody={renderSubjectTabBody}
                                />
                            </TabPanel>
                            <TabPanel value={topmenu} index="top1" tabId="topmenu">
                                <SearchCourseResources
                                    a11yProps={a11yProps}
                                    listSearchedSubjects={listSearchedSubjects}
                                    loadNewSubject={loadNewSubject}
                                    renderSubjectTabBody={renderSubjectTabBody}
                                    setKeywordPresets={setKeywordPresets}
                                    setDisplayType={setDisplayType}
                                    updateSearchList={updateSearchList}
                                />
                            </TabPanel>
                            <TabPanel value={topmenu} index="top2" tabId="topmenu">
                                {renderStudyHelpLinks}
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
