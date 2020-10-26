import React, { Fragment } from 'react';

// find an appropriate icon from https://material-ui.com/components/material-icons/ to use
import REPLACEMEIcon from '@material-ui/icons/AcUnit';
import InfoIcon from '@material-ui/icons/ErrorOutline';
import CourtHouseIcon from '@material-ui/icons/AccountBalance';

export default {
    title: 'Course Resources',
    search: {
        tabLabel: 'Course search',
    },
    studyHelp: {
        title: 'Study Help',
        unavailable: 'No resources right now',
        links: [
            {
                icon: <REPLACEMEIcon style={{ marginRight: 6 }} />,
                id: 'referencingGuides',
                linkLabel: 'Referencing guides',
                linkTo: 'https://guides.library.uq.edu.au/referencing',
            },
            {
                icon: <REPLACEMEIcon style={{ marginRight: 6 }} />,
                id: 'digitalessentials',
                linkLabel: 'Digital Essentials',
                linkTo: 'https://web.library.uq.edu.au/research-tools-techniques/digital-essentials',
            },
            {
                icon: <CourtHouseIcon style={{ marginRight: 6 }} />,
                id: 'legalResearchEssentials',
                linkLabel: 'Legal Research Essentials',
                linkTo: 'https://web.library.uq.edu.au/library-services/training/legal-research-essentials',
            },
            {
                icon: <InfoIcon style={{ marginRight: 6 }} />,
                id: 'libraryTraining',
                linkLabel: 'Library training',
                linkTo: 'https://web.library.uq.edu.au/library-services/training',
            },
        ],
    },
    visibleItemsCount: {
        // max number of items of each type we should display
        readingLists: 2,
        examPapers: 2,
        libGuides: 2,
    },
    notesTrimLength: 90,
    myCourses: {
        tabLabel: 'My courses',
        none: {
            title: 'No listed courses',
            description: (
                <Fragment>
                    <p>Courses will be shown 3 weeks prior to the start of semester</p>
                    <p>Please check back closer to the next enrollment period</p>
                    <p>You can search for information on courses using the &quot;Course Search&quot; tab, above</p>
                </Fragment>
            ),
        },
        readingLists: {
            title: 'Reading lists',
            multiple: {
                title: 'More than one reading list found for [classnumber]. Please select a list:',
                linkOut: 'Search other reading lists',
            },
            linkOut: '[numberExcessReadingLists] more [readingListNumber]',
        },
        examPapers: {
            title: 'Past exam papers',
            searchUrl: 'https://www.library.uq.edu.au/exams/papers.php?stub=',
            unavailable: 'Exam papers list currently unavailable',
            linkOut: 'Search for other exam papers',
            morePastExams: '[numberExcessExams] more past [examNumber]',
        },
        guides: {
            title: 'Library guides',
            unavailableMessage: 'No Library guides for this course',
            linkOut: 'All library guides',
        },
        links: {
            title: 'Course links',
            ecp: 'Electronic Course Profile',
            blackboard: 'Learn.UQ (Blackboard)',
        },
        ecpLinkUrl: 'http://www.uq.edu.au/study/course.html?course_code=',
        blackboardUrl: 'https://learn.uq.edu.au/',
    },
};
