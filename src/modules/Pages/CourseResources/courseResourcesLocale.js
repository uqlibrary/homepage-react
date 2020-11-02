import React, { Fragment } from 'react';

import JigsawIcon from '@material-ui/icons/Extension';
import DocumentIcon from '@material-ui/icons/Description';
import InfoIcon from '@material-ui/icons/ErrorOutline';
import CourtHouseIcon from '@material-ui/icons/AccountBalance';

export default {
    title: 'Course Resources',
    search: {
        title: 'Course search',
    },
    studyHelp: {
        title: 'Study Help',
        unavailable: 'No resources right now',
        links: [
            {
                icon: <DocumentIcon style={{ marginRight: 6 }} />,
                id: 'referencingGuides',
                linkLabel: 'Referencing guides',
                linkTo: 'https://guides.library.uq.edu.au/referencing',
            },
            {
                icon: <JigsawIcon style={{ marginRight: 6 }} />,
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
        title: 'My courses',
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
            none: 'No reading lists for this course',
            unavailable: 'Reading lists currently unavailable',
            multiple: {
                title: 'More than one reading list found for [classnumber]. Please select a list:',
                linkLabel: 'Search other reading lists',
                linkOut: 'http://lr.library.uq.edu.au/index.html',
            },
            footer: {
                linkLabel: '[numberExcessReadingLists] more [readingListNumber]',
            },
        },
        examPapers: {
            title: 'Past exam papers',
            none: 'No Past Exam Papers for this course',
            unavailable: 'Exam papers list currently unavailable',
            morePastExams: '[numberExcessExams] more past [examNumber]',
            footer: {
                linkOutPattern: 'https://www.library.uq.edu.au/exams/papers.php?stub=[courseCode]',
                linkLabel: 'Search for other exam papers',
            },
        },
        guides: {
            title: 'Library guides',
            none: 'No Library guides for this course',
            unavailable: 'Library guides list currently unavailable',
            footer: {
                linkOut: 'https://guides.library.uq.edu.au',
                linkLabel: 'All library guides',
            },
        },
        links: {
            title: 'Course links',
            blackboard: {
                title: 'Learn.UQ (Blackboard)',
                linkOutPattern: 'https://learn.uq.edu.au/[courseCode]',
            },
            ecp: {
                title: 'Electronic Course Profile',
                linkOutPattern: 'https://www.uq.edu.au/study/course.html?course_code=[courseCode]',
            },
        },
    },
};
