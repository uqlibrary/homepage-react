import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useAccountContext } from 'context';

import locale from './courseresourceslocale';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import PrimoSearch from '../../../modules/reusable/PrimoSearch/containers/PrimoSearch';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

// mock data in early stage of dev
// import courseReadingList from
// '../../../../src/mock/data/records/courseReadingList_6888AB68-0681-FD77-A7D9-F7B3DEE7B29F';
// import learningResourceData from '../../../../src/mock/data/records/learningResources_FREN1010';
// import libraryGuide from '../../../../src/mock/data/records/libraryGuides_FREN1010';

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

    console.log('actions = ', actions);
    // const { loadReadingLists, loadGuides, loadLearningResources } = actions;

    /* istanbul ignore next */
    // React.useEffect(() => {
    //     // Load user's subject lists if it hasn't
    //     account.currentclasses.map(aclass => {
    //         !!aclass.classnumber && !!loadReadingLists && loadReadingLists(aclass.classnumber);
    //         !!aclass.classnumber && !!loadGuides && loadGuides(aclass.classnumber);
    //         !!aclass.classnumber && !!loadLearningResources && loadLearningResources(aclass.classnumber);
    //     });
    // }, [loadReadingLists, loadGuides, loadLearningResources, account]);

    const [topmenu, setCurrentTopTab] = useState(
        !!account.currentclasses && account.currentclasses.length ? 'top0' : 'top1',
    );
    const handleTopTabChange = (event, newValue) => {
        setCurrentTopTab(newValue);
    };

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

    const handleSubjectChange = classnumber => {
        console.log('handleSubjectChange for ', classnumber);

        actions.clearLearningResources();
        actions.clearGuides();
        actions.clearReadingLists();

        !!classnumber && !!actions.loadLearningResources && actions.loadLearningResources(classnumber);
        console.log('learningResourcesList = ', learningResourcesList);

        !!classnumber && !!actions.loadGuides && actions.loadGuides(classnumber);
        console.log('guideList = ', guideList);

        console.log('learningResourcesList = ', learningResourcesList);
        if (!!learningResourcesList && learningResourcesList.length === 1) {
            const learningResourcesEntry = learningResourcesList[0];
            console.log('learningResourcesEntry = ', learningResourcesEntry);
            const readingListId =
                !!learningResourcesEntry &&
                !!learningResourcesEntry.reading_lists &&
                learningResourcesEntry.reading_lists.length === 1 &&
                getReadingListId(learningResourcesEntry.reading_lists[0]);
            console.log('readingListId =', readingListId);
            if (readingListId !== '') {
                !!learningResourcesEntry &&
                    !!learningResourcesEntry.reading_lists &&
                    !!actions.loadReadingLists &&
                    actions.loadReadingLists(readingListId);
                console.log('readingList = ', readingList);
            } else {
                console.log('readingList not fetched');
            }
        }
    };

    const courseTabLabel = 'subjecttab';
    const [coursemenu, setCurrentMenuTab] = useState(`${courseTabLabel}-0`);
    const handleCourseTabChange = (event, newValue) => {
        !!event.target.innerText && handleSubjectChange(event.target.innerText);
        setCurrentMenuTab(newValue);
    };

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

    const _pluralise = (word, num) => {
        return word + (num === 1 ? '' : 's');
    };

    const _trimNotes = value => {
        if (value && value.length > this.notesTrimLength) {
            let _trimmed = value.substring(0, this.notesTrimLength);
            // trim on word boundary
            _trimmed = _trimmed.substring(0, _trimmed.lastIndexOf(' '));
            return _trimmed + '...';
        } else {
            return value;
        }
    };

    const _extractExtension = url => {
        return url.substring(url.lastIndexOf('.') + 1);
    };

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

    // PHIL1002 is currently an example of multiple reading lists
    const renderMultipleReadingListReference = (learningResourcesList, classnumber) => {
        const chooseListprompt = !!classnumber
            ? `More than one reading list found for <span>${classnumber}</span>. Please select a list:`
            : '';
        return (
            <Fragment>
                <Typography>{chooseListprompt}</Typography>
                {learningResourcesList.map((list, index) => {
                    <Grid key={`multiplereadinglist-${index}`} container style={{ borderTop: '1px solid #e8e8e8' }}>
                        <a
                            aria-label={`Reading list for  ${list.title} ${list.period}`}
                            href={list.url}
                            key={`lrlink-${index}`}
                        >
                            {list.title}, {list.period}
                        </a>
                    </Grid>;
                })}
                <Grid>
                    <a href="http://lr.library.uq.edu.au/index.html">
                        <ArrowForwardIcon style={{ paddingRight: '1rem' }} />
                        Search other reading lists
                    </a>
                </Grid>
            </Fragment>
        );
    };

    const renderSubjectTab = subject => {
        // console.log('subject = ', subject);

        // !!subject.classnumber && handleSubjectChange(subject.classnumber);

        const courseTitle =
            !!learningResourcesList && learningResourcesList.length > 0 ? learningResourcesList[0].course_title : null;

        const talisReadingListLink =
            (!!learningResourcesList &&
                learningResourcesList.length > 0 &&
                !!learningResourcesList[0].reading_lists &&
                learningResourcesList[0].reading_lists.length > 0 &&
                learningResourcesList[0].reading_lists[0].url) ||
            null;

        const numberExcessReadingLists =
            !!readingList && readingList.length > locale.visibleItemsCount.readingLists
                ? readingList.length - locale.visibleItemsCount.readingLists
                : 0;

        const examList =
            !!learningResourcesList && learningResourcesList.length === 1 ? learningResourcesList[0].exam_papers : null;
        const numberExcessExams =
            !!learningResourcesList &&
            learningResourcesList.length > 0 &&
            !!learningResourcesList[0] &&
            learningResourcesList[0].exam_papers.length > locale.visibleItemsCount.examPapers
                ? learningResourcesList[0].exam_papers.length - locale.visibleItemsCount.examPapers
                : 0;

        const readingListItemAriaLabel = l => `Reading list item ${l.title}, ${l.referenceType}, ${l.importance}`;
        const examAriaLabel = paper => `past exam paper for ${paper.period} format ${_extractExtension(paper.url)}`;
        // console.log('after load: readingList = ', readingList);

        const readingListTitle = `${locale.readingListText} ${
            !!readingList && readingList.length > 0 ? `(${readingList.length})` : ''
        }`;

        const examPaperTitle = `${locale.exampPapersTitle} ${
            !!examList && examList.length > 0 ? `(${examList.length})` : ''
        }`;

        return (
            <Grid container>
                <Grid item xs={12} style={{ textAlign: 'center' }}>
                    <Typography color={'primary'} variant={'h5'} component={'span'} style={{ fontSize: '1.33rem' }}>
                        {subject.classnumber} - {courseTitle}
                    </Typography>
                </Grid>

                <StandardCard
                    className="readingLists"
                    style={{ width: '100%', marginBottom: '1rem', marginTop: '1rem' }}
                    title={readingListTitle}
                >
                    <Grid container>
                        <Grid item xs={12}>
                            {readingListLoading && (
                                <Grid
                                    item
                                    xs={'auto'}
                                    style={{
                                        width: 80,
                                        marginLeft: -100,
                                        marginRight: 20,
                                        marginBottom: 6,
                                        opacity: 0.3,
                                    }}
                                >
                                    <CircularProgress color="primary" size={20} id="loading-suggestions" />
                                </Grid>
                            )}

                            {!!readingListError && <Typography>Reading lists currently unavailable</Typography>}

                            {!readingListError && (!learningResourcesList || learningResourcesList.length === 0) && (
                                <Typography>No reading lists for this course</Typography>
                            )}

                            {!!learningResourcesList &&
                                learningResourcesList.length > 1 &&
                                renderMultipleReadingListReference(learningResourcesList, subject.classnumber || '')}

                            {!!learningResourcesList &&
                                learningResourcesList.length === 1 &&
                                !!readingList &&
                                readingList.length > 0 &&
                                readingList
                                    // remove the exam links (they are shown below)
                                    .filter(item => item.url !== 'https://www.library.uq.edu.au/exams/search.html')
                                    // we only show a small number - theres a link to viewall on Talis if there are more
                                    .slice(0, locale.visibleItemsCount.readingLists)
                                    .map((list, index) => {
                                        return (
                                            <Grid
                                                key={`readingList-${index}`}
                                                style={{ borderTop: '1px solid #e8e8e8', padding: '15px 0' }}
                                            >
                                                {!!list.itemLink && !!list.title && (
                                                    <Grid className="subhead">
                                                        <a
                                                            aria-label={readingListItemAriaLabel}
                                                            className="reading-list-item"
                                                            href={list.itemLink}
                                                            // on-click="linkClicked"
                                                        >
                                                            {list.title}
                                                        </a>
                                                    </Grid>
                                                )}
                                                {!list.itemLink && !!list.title && (
                                                    <Typography>{list.title}</Typography>
                                                )}
                                                {!!list.author && (
                                                    <Typography style={{ fontStyle: 'italic' }}>
                                                        {list.author}
                                                        {!!list.year && <Fragment>{`, ${list.year} `}</Fragment>}
                                                    </Typography>
                                                )}
                                                {!!list.startPage && (
                                                    <Typography>
                                                        Pages from {list.startPage}
                                                        {!!list.endPage && (
                                                            <Fragment>{` to  ${list.endPage}`}</Fragment>
                                                        )}
                                                    </Typography>
                                                )}
                                                {!!list.notes && <Typography>{_trimNotes(list.notes)}</Typography>}
                                                <Typography>
                                                    {list.referenceType}
                                                    {!!list.importance && (
                                                        <Fragment>{` - ${list.importance}`}</Fragment>
                                                    )}
                                                </Typography>
                                            </Grid>
                                        );
                                    })}
                            {/* eg MATH4091 has 12 reading lists */}
                            {!!talisReadingListLink && !!numberExcessReadingLists && (
                                <div>
                                    <a
                                        // on-click="linkClicked"
                                        href={talisReadingListLink}
                                    >
                                        <ArrowForwardIcon style={{ paddingRight: '1rem' }} />
                                        {numberExcessReadingLists} more {_pluralise('item', numberExcessReadingLists)}
                                    </a>
                                </div>
                            )}
                        </Grid>
                    </Grid>
                </StandardCard>

                <StandardCard className="exams" style={{ width: '100%', marginBottom: '1rem' }} title={examPaperTitle}>
                    {!!learningResourcesListError && <Typography>Exam papers list currently unavailable</Typography>}

                    {!learningResourcesListError && learningResourcesListLoading && (
                        <Grid
                            item
                            xs={'auto'}
                            style={{ width: 80, marginLeft: -100, marginRight: 20, marginBottom: 6, opacity: 0.3 }}
                        >
                            <CircularProgress color="primary" size={20} id="loading-suggestions" />
                        </Grid>
                    )}

                    {!!examList && examList.length === 0 && (
                        <Grid>
                            <Typography>No Past Exam Papers for this course</Typography>
                            <a href={locale.examPapersSearchUrl}>
                                <ArrowForwardIcon style={{ paddingRight: '1rem' }} />
                                Search for other exam papers
                            </a>
                        </Grid>
                    )}
                    {!!examList && examList.length > 0 && (
                        <Grid id="pastExamPapers">
                            {examList.slice(0, locale.visibleItemsCount.examPapers).map((paper, index) => {
                                return (
                                    <Grid
                                        container
                                        key={`examPapers-${index}`}
                                        style={{ borderTop: '1px solid #e8e8e8', padding: '15px 0' }}
                                    >
                                        <a
                                            aria-label={examAriaLabel(paper)}
                                            className="exam-paper-item"
                                            data-title="examPaperItem"
                                            href={paper.url}
                                            key={`exam-${index}`}
                                            // on-click="linkClicked"
                                        >
                                            {paper.period} ({_extractExtension(paper.url)})
                                        </a>
                                    </Grid>
                                );
                            })}

                            {!!numberExcessExams && (
                                <Grid container style={{ borderTop: '1px solid #e8e8e8', padding: '15px 0' }}>
                                    <a
                                        // on-click="linkClicked"
                                        href={_courseLink(subject.classnumber, locale.examPapersSearchUrl)}
                                    >
                                        <ArrowForwardIcon style={{ paddingRight: '1rem' }} />
                                        {numberExcessExams} more past exam {_pluralise('paper', numberExcessExams)}
                                    </a>
                                </Grid>
                            )}
                        </Grid>
                    )}
                </StandardCard>

                <StandardCard className="Guides" style={{ width: '100%', marginBottom: '1rem' }} title="Library guides">
                    <Grid>
                        {guideListLoading && (
                            <Grid
                                item
                                xs={'auto'}
                                style={{ width: 80, marginLeft: -100, marginRight: 20, marginBottom: 6, opacity: 0.3 }}
                            >
                                <CircularProgress color="primary" size={20} id="loading-suggestions" />
                            </Grid>
                        )}

                        {!!guideListError && <Typography>Library guides list currently unavailable</Typography>}

                        {!guideListError && !!guideList && guideList.length === 0 && (
                            <Typography>No Library guides for this course</Typography>
                        )}

                        {!!guideList &&
                            guideList.length > 0 &&
                            guideList.map((guide, index) => {
                                return (
                                    <Grid
                                        container
                                        key={`guides-${index}`}
                                        style={{ borderTop: '1px solid #e8e8e8', padding: '15px 0' }}
                                    >
                                        <a
                                            aria-label={`library guide for ${guide.title}`}
                                            className="library-guide-item"
                                            data-title="guideListItem"
                                            href={guide.url}
                                            key={`guide-${index}`}
                                            // on-click="linkClicked"
                                        >
                                            {guide.title}
                                        </a>
                                    </Grid>
                                );
                            })}

                        <Grid container style={{ borderTop: '1px solid #e8e8e8', padding: '15px 0' }}>
                            <a
                                // on-tap="linkClicked"
                                id="allguideLists"
                                href="http://guides.library.uq.edu.au"
                            >
                                <ArrowForwardIcon style={{ paddingRight: '1rem' }} />
                                All library guides
                            </a>
                        </Grid>
                    </Grid>
                </StandardCard>
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
    let currentclasses = account.currentclasses || null;

    // dev hack while we wait for api update
    if (currentclasses === null) {
        currentclasses = [
            {
                subject: 'FREN',
                subjectLevel: '1010',
                classnumber: 'FREN1010',
                classname: 'Introductory French 1',
            },
            {
                subject: 'HIST',
                subjectLevel: '1201',
                classnumber: 'HIST1201',
                classname: 'The Australian  Experience',
            },
            {
                subject: 'HIST',
                subjectLevel: '312',
                classnumber: 'HIST2312',
                classname: 'The History Makers',
            },
        ];
    }
    */

    const renderCurrentCourses = (
        <Fragment>
            <AppBar position="static" style={{ backgroundColor: 'white', color: 'black' }}>
                <Tabs onChange={handleCourseTabChange} scrollButtons="auto" value={coursemenu} variant="scrollable">
                    {account.currentclasses.map((item, index) => {
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
            {account.currentclasses.map((item, index) => {
                return (
                    <TabPanel
                        data-testid={`classpanel-${index}`}
                        index={`${courseTabLabel}-${index}`} // must match value in Tabs
                        key={`classpanel-${index}`}
                        tabId="coursemenu"
                        value={coursemenu}
                    >
                        <Grid>{renderSubjectTab(item)}</Grid>
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
                                {!!account.currentclasses && account.currentclasses.length > 0 ? (
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
