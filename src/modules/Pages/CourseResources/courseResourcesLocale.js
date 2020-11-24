import React, { Fragment } from 'react';

import DocumentIcon from '@material-ui/icons/Description';
import InfoIcon from '@material-ui/icons/ErrorOutline';
import CourtHouseIcon from '@material-ui/icons/AccountBalance';
import { SpacedArrowForwardIcon } from './components/SpacedArrowForwardIcon';

export default {
    title: 'Course Resources',
    search: {
        title: 'Course search',
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
            error: {
                none: 'No reading lists for this course',
                unavailable: 'Reading lists currently unavailable',
                multiple: 'More than one reading list found for [classnumber]. Please select a list:',
                footer: {
                    linkLabel: 'Search other reading lists',
                    linkOut: 'http://lr.library.uq.edu.au/index.html',
                },
            },
            footer: {
                linkLabel: '[numberExcessReadingLists] more [readingListNumber]',
            },
            visibleItemsCount: 2,
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
            visibleItemsCount: 2,
        },
        guides: {
            title: 'Library guides',
            none: 'No Library guides for this course',
            unavailable: 'Library guides list currently unavailable',
            footer: {
                links: [
                    {
                        icon: <DocumentIcon style={{ marginRight: 6 }} />,
                        id: 'referencingGuides',
                        linkLabel: 'Referencing guides',
                        linkTo: 'https://guides.library.uq.edu.au/referencing',
                    },
                    {
                        icon: <SpacedArrowForwardIcon />,
                        id: 'all-guides',
                        linkLabel: 'All library guides',
                        linkTo: 'https://guides.library.uq.edu.au',
                    },
                ],
            },
            visibleItemsCount: 3,
        },
        courseLinks: {
            title: 'Course links',
            links: [
                {
                    icon: <SpacedArrowForwardIcon />,
                    id: 'blackboard',
                    linkLabel: 'Learn.UQ (Blackboard)',
                    linkOutPattern: 'https://learn.uq.edu.au/[courseCode]',
                },
                {
                    icon: <SpacedArrowForwardIcon />,
                    id: 'ecp',
                    linkLabel: 'Electronic Course Profile',
                    linkOutPattern: 'https://www.uq.edu.au/study/course.html?course_code=[courseCode]',
                },
                {
                    icon: <InfoIcon style={{ marginRight: 6 }} />,
                    id: 'library-training',
                    linkLabel: 'Library training',
                    linkOutPattern: 'https://web.library.uq.edu.au/library-services/training',
                },
            ],
            legalResearchEssentials: {
                // displays with list above, but for LAWS subjects only
                icon: <CourtHouseIcon style={{ marginRight: 6 }} />,
                id: 'legalResearchEssentials',
                linkLabel: 'Legal Research Essentials',
                linkOutPattern: 'https://web.library.uq.edu.au/library-services/training/legal-research-essentials',
            },
        },
    },
};
